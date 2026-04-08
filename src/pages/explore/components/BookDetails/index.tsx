import { BookmarkSimple, BookOpen, X } from "phosphor-react";

import {
  BookDetailsBody,
  BookDetailsContainer,
  BookDetailsOverlay,
  BookDetailsRatingsContainer,
  BookDetailsRatingsBody,
  BookDetailsRatingsHeader,
  BookInfo,
  BookInfoBody,
  BookInfoFooter,
  BookDetailsRating,
  CloseButton,
  BookDetailsModalBody,
  BookDescription,
} from "./styles";

import { capitalize } from "@/utils/capitalize";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { formatCategories } from "@/utils/formatCategories";
import { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";

import Image from "next/image";

import googleLogo from "../../../../../assets/logos_google-icon.png";
import githubLogo from "../../../../../assets/akar-icons_github-fill.png";

import { api } from "@/lib/axios";
import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  BooksQueryData,
  BooksResponse,
  RatingProps,
  RatingQueryData,
} from "@/@types/query-types";
import { StarRating } from "@/components/StarsRating";
import {
  UserRatingForm,
  UserRatingSubmitData,
} from "@/components/UserRatingForm";
import { Modal } from "@/components/Modal";
import { ReadingStatusSelect } from "../../../../components/ReadingStatusSelect";
import { ReadingStatus } from "@/generated/prisma";
import { FavoriteButton } from "../../../../components/FavoriteButton";
import { ProviderButton } from "@/components/ProviderButton/styles";
import { DescripitionText } from "@/components/DescriptionText";

type BookDetailsProps = {
  closeBookDetails: () => void;
  bookId: string;
  debouncedQuery: string;
  categoriesFilters: string;
};

export function BookDetails({
  closeBookDetails,
  bookId,
  debouncedQuery,
  categoriesFilters,
}: BookDetailsProps) {
  const queryClient = useQueryClient();

  const session = useSession();

  const [isUserRatingOpen, setIsUserRatingOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const bookDetailsContainerRef = useRef<HTMLDivElement>(null);
  const loginModalRef = useRef<HTMLDivElement>(null);

  function handleUserRatingOpen() {
    if (session.status !== "authenticated") {
      return setIsModalOpen(true);
    }

    return setIsUserRatingOpen(true);
  }

  function handleCloseUserRatingForm() {
    return setIsUserRatingOpen(false);
  }

  function handleRatingSubmit(data: UserRatingSubmitData) {
    createRatingMutation(data);
    setIsUserRatingOpen(false);
  }

  function findBookById(bookId: string) {
    const queries = queryClient.getQueriesData<InfiniteData<BooksResponse>>({
      queryKey: ["books"],
    });

    const book = queries
      .flatMap(([, data]) => data?.pages ?? [])
      .flatMap((page) => page.items)
      .find((book) => book.id === bookId);

    return book;
  }

  const book = findBookById(bookId);

  const user = session.data?.user

  const { data: translatedBookData } = useQuery<{
    categories: string[];
    description: string;
  }>({
    queryKey: ["traslatedBook", bookId],
    enabled: !!bookId && !!book,
    queryFn: async () => {
      const response = await api.post("/app/translate-book", {
        categories: book?.categories,
        description: book?.description,
      });

      return response.data;
    },
  });

  function handleClickOutside(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

    if (
      isModalOpen &&
      loginModalRef.current &&
      !loginModalRef.current.contains(target)
    ) {
      return setIsModalOpen(false);
    }

    if (
      !isModalOpen &&
      bookDetailsContainerRef.current &&
      !bookDetailsContainerRef.current.contains(event.target as Node)
    ) {
      return closeBookDetails();
    }
  }

  function handleEsc(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      if (isModalOpen) {
        return setIsModalOpen(false);
      }
      return closeBookDetails();
    }
  }

  const { data: bookRatings } = useQuery<RatingQueryData>({
    queryKey: ["ratings", bookId],
    queryFn: async () => {
      const response = await api.get(`/app/ratings/books/${bookId}`);
      return response.data;
    },
    enabled: !!bookId,
    gcTime: 15 * 60 * 1000, // 15 minutos
  });

  const { mutate: createRatingMutation } = useMutation({
    mutationFn: async (data: UserRatingSubmitData) => {
      return await api.post(`/app/ratings/users/${user?.id}`, {
        rate: data.rate,
        review: data.review,
        bookId: book?.id,
        title: book?.title,
        author: book?.author.join(","),
        coverUrl: book?.coverUrl,
        pageCount: book?.pageCount,
        categories: book?.categories.join(","),
      });
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: ["ratings", bookId],
      });

      const previousBookRatings = queryClient.getQueryData([
        'ratings',
        bookId
      ]);

      const previousBooks = queryClient.getQueryData([
        'books',
        debouncedQuery,
        categoriesFilters
      ]);

      queryClient.setQueryData<BooksQueryData>(
        ["books", debouncedQuery, categoriesFilters],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((book) => {
                if (book.id !== bookId) return book;

                const newRatingsCount = book.ratingsCount + 1;
                const newRatingsSum = book.ratingsSum + data.rate!;
                const newAvg = newRatingsSum / newRatingsCount;

                return {
                  ...book,
                  avgRating: newAvg,
                  ratingsSum: newRatingsSum,
                  ratingsCount: newRatingsCount,
                  read: true,
                };
              }),
            })),
          };
        },
      );

      queryClient.setQueryData<RatingQueryData>(
        ['ratings', bookId],
        (oldData) => {
          if (!oldData) return oldData;
          if (!oldData.userStatus) return oldData;

          const newRating: RatingProps = {
            id: 'new rating cache id',
            rate: data.rate,
            review: data.review,
            book: {
              id: book!.id,
              title: book!.title,
              author: book!.author.join(','),
              categories: book!.categories.join(','),
              pageCount: book!.pageCount,
              coverUrl: book!.coverUrl,
            },
            user: user!,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
          }
          const newBookRatings = [newRating].concat(oldData.ratings)
          const newUserStatus = {
            ...oldData.userStatus,
            rated: true
          }

          return {
            ratings: newBookRatings,
            userStatus: newUserStatus
          };
        },
      );

      return { previousBookRatings, previousBooks };
    },
    onError: (err, __, context) => {
      console.log(err);
      queryClient.setQueryData(
        ["ratings", bookId],
        context?.previousBookRatings,
      );
      queryClient.setQueryData(
        ["books", debouncedQuery, categoriesFilters],
        context?.previousBooks,
      );
    },
    onSuccess() {
      console.log('terminou')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["ratings", bookId],
      });

      queryClient.invalidateQueries({
        queryKey: ["books", debouncedQuery, categoriesFilters],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["home"],
      });
    },
  });

  const {
    mutate: updateReadingStatusMutation,
    isPending: isUpdatingReadingStatus,
  } = useMutation({
    mutationFn: async ({
      status,
      isFavorite,
    }: {
      status?: ReadingStatus;
      isFavorite?: boolean;
    }) => {
      return await api.patch("/app/userBook", {
        readStatus: status,
        isFavorite: isFavorite,
        bookId: book?.id,
        title: book?.title,
        author: book?.author.join(","),
        coverUrl: book?.coverUrl,
        pageCount: book?.pageCount,
        categories: book?.categories.join(","),
      });
    },
    onMutate: async ({ status, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ["ratings", bookId] });

      const previousRatings = queryClient.getQueryData(["ratings", bookId]);

      queryClient.setQueryData<RatingQueryData>(
        ["ratings", bookId],
        (oldData) => {
          if (!oldData || !oldData.userStatus) return oldData;
          console.log(oldData);
          return {
            ...oldData,
            userStatus: {
              status: status ?? oldData.userStatus.status,
              isFavorite: isFavorite ?? oldData.userStatus.isFavorite,
              rated: oldData.userStatus.rated,
            },
          };
        },
      );

      return { previousRatings };
    },
    onError: (err, __, context) => {
      console.log(err);
      queryClient.setQueryData(["ratings", bookId], context?.previousRatings);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["ratings", bookId],
      });

      queryClient.invalidateQueries({
        queryKey: ["books", debouncedQuery, categoriesFilters],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["home"],
      });
    },
  });

  function handleSelectOpenChange(isOpen: boolean) {
    setIsSelectOpen(!isOpen);
  }

  function onSelectChange(status: ReadingStatus) {
    updateReadingStatusMutation({ status });
    return;
  }

  function onFavoriteButtonClick(isFavorite: boolean) {
    if (session.status !== "authenticated") {
      return setIsModalOpen(true);
    }

    updateReadingStatusMutation({ isFavorite });
    return;
  }

  function handleLoginModalOpen() {
    setIsModalOpen(true);
  }

  const bookStatus = bookRatings?.userStatus?.status;

  const isFavoriteBook = bookRatings?.userStatus?.isFavorite ?? false;

  useEffect(() => {
    bookDetailsContainerRef.current?.focus();
  }, []);

  useEffect(() => {
    console.log(bookStatus);
  }, [bookStatus]);

  if (!book) {
    return;
  }

  return (
    <>
      {isModalOpen && (
        <Modal ref={loginModalRef} onPointerDown={(e) => handleClickOutside(e)}>
          <CloseButton type="button" onClick={() => setIsModalOpen(false)}>
            <X />
          </CloseButton>
          <BookDetailsModalBody>
            <h3>Faça login para adicionar livros a sua estante</h3>
            <div>
              <ProviderButton onClick={async () => signIn("google")}>
                <Image src={googleLogo} alt="" />
                Entrar com Google
              </ProviderButton>

              <ProviderButton onClick={async () => signIn("github")}>
                <Image src={githubLogo} alt="" />
                Entrar com Github
              </ProviderButton>
            </div>
          </BookDetailsModalBody>
        </Modal>
      )}

      <BookDetailsOverlay onPointerDown={(e) => handleClickOutside(e)}>
        <BookDetailsContainer
          tabIndex={-1}
          onKeyDown={(e) => handleEsc(e)}
          ref={bookDetailsContainerRef}
        >
          <CloseButton onClick={closeBookDetails}>
            <X />
          </CloseButton>
          <BookDetailsBody>
            <BookInfo>
              <BookInfoBody>
                <Image
                  loading="eager"
                  quality={100}
                  width={171.65}
                  height={242}
                  src={book.coverUrl}
                  alt=""
                />
                <div>
                  <span>
                    <h2>{book?.title}</h2>
                    <span>{book?.author}</span>
                  </span>
                  <span>
                    <span>
                      <StarRating param={book.avgRating} />
                    </span>
                    <span>
                      {book.ratingsCount}{" "}
                      {book.ratingsCount === 1 ? "avaliação" : "avaliações"}
                    </span>
                  </span>
                </div>
              </BookInfoBody>

              <BookInfoFooter>
                <div>
                  <div>
                    <BookmarkSimple />
                    <span>
                      <span>Categoria(s)</span>
                      <span>
                        {translatedBookData
                          ? translatedBookData.categories.map((c, i) => {
                              return formatCategories(c, i);
                            })
                          : book?.categories.map((c, i) => {
                              return formatCategories(c, i);
                            })}
                      </span>
                    </span>
                  </div>

                  <div>
                    <BookOpen />
                    <span>
                      <span>Páginas</span>
                      <span>{book?.pageCount}</span>
                    </span>
                  </div>

                  <div>
                    <ReadingStatusSelect
                      openLoginModal={handleLoginModalOpen}
                      isAuthenticated={session.status === "authenticated"}
                      disabled={isUpdatingReadingStatus}
                      handleSelectOpenChange={handleSelectOpenChange}
                      isSelectOpen={isSelectOpen}
                      containerRef={bookDetailsContainerRef}
                      value={bookStatus}
                      onChange={onSelectChange}
                    />

                    {bookRatings?.userStatus?.status === "FINISHED" && (
                      <FavoriteButton
                        disabled={isUpdatingReadingStatus}
                        isFavorite={isFavoriteBook}
                        setIsFavorite={onFavoriteButtonClick}
                      />
                    )}
                  </div>
                </div>

                <BookDescription style={{ fontSize: "14px" }}>
                  <DescripitionText
                    description={
                      translatedBookData?.description
                        ? translatedBookData.description
                        : book.description
                    }
                  />
                </BookDescription>
              </BookInfoFooter>
            </BookInfo>

            <BookDetailsRatingsContainer>
              <BookDetailsRatingsHeader>
                <span>Avaliações</span>

                {bookRatings &&
                  bookRatings?.userStatus &&
                  bookRatings.userStatus.status === "FINISHED" &&
                  !bookRatings.userStatus.rated && (
                    <button
                      type="button"
                      onClick={() => handleUserRatingOpen()}
                    >
                      Avaliar
                    </button>
                  )}
              </BookDetailsRatingsHeader>

              <BookDetailsRatingsBody>
                {isUserRatingOpen && (
                  <UserRatingForm
                    handleCloseUserRatingForm={handleCloseUserRatingForm}
                    handleRatingSubmit={handleRatingSubmit}
                    avatarUrl={session.data?.user.avatarUrl}
                    userName={session.data?.user.name}
                  />
                )}

                {bookRatings &&
                  bookRatings.ratings &&
                  bookRatings.ratings.map((rating) => {
                    return (
                      <BookDetailsRating
                        isUserRating={
                          rating.user.email === session.data?.user.email
                        }
                        key={rating.id}
                      >
                        <div>
                          <div>
                            <Image
                              width={40}
                              height={40}
                              src={rating.user.avatarUrl}
                              alt=""
                            />
                            <span>
                              <h3>{rating.user.name}</h3>
                              <span>
                                {capitalize(
                                  formatDistanceToNow(rating.createdAt, {
                                    addSuffix: true,
                                    locale: ptBR,
                                  }),
                                )}
                              </span>
                            </span>
                          </div>

                          <span>
                            <StarRating param={rating.rate} />
                          </span>
                        </div>

                        <DescripitionText description={rating.review} />
                      </BookDetailsRating>
                    );
                  })}
              </BookDetailsRatingsBody>
            </BookDetailsRatingsContainer>
          </BookDetailsBody>
        </BookDetailsContainer>
      </BookDetailsOverlay>
    </>
  );
}
