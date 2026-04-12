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
import { toast } from "sonner";
import { toastMessages } from "@/lib/toast-messages";
import { BookCover } from "../../../../components/BookCover";

type BookDetailsProps = {
  closeBookDetails: () => void;
  bookId: string;
  searchTerm: string;
  categoriesFilters: string;
  isOpen: boolean;
};

export function BookDetails({
  closeBookDetails,
  bookId,
  searchTerm,
  categoriesFilters,
  isOpen,
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
      queryKey: ["books", searchTerm, categoriesFilters],
    });

    const book = queries
      .flatMap(([, data]) => data?.pages ?? [])
      .flatMap((page) => page.items)
      .find((book) => book.id === bookId);

    return book;
  }

  const book = findBookById(bookId);

  const user = session.data?.user;

  const { data: translatedBookData } = useQuery<{
    categories: string[];
    description: string;
  }>({
    queryKey: ["traslatedBook", bookId],
    enabled: !!bookId && !!book,
    queryFn: async () => {
      const response = await api.post("/app/translate-books", {
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
      toast.success(toastMessages.addRating.success);

      await queryClient.cancelQueries({
        queryKey: ["ratings", bookId],
      });

      const previousBooks = queryClient.getQueryData([
        "books",
        searchTerm,
        categoriesFilters,
      ]);

      queryClient.setQueryData<BooksQueryData>(
        ["books", searchTerm, categoriesFilters],
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

                const newCacheRatingId = crypto.randomUUID();

                const newRating: RatingProps = {
                  id: newCacheRatingId,
                  rate: data.rate,
                  review: data.review,
                  book: {
                    id: book!.id,
                    title: book!.title,
                    author: book!.author.join(","),
                    categories: book!.categories.join(","),
                    pageCount: book!.pageCount,
                    coverUrl: book!.coverUrl,
                  },
                  user: user!,
                  createdAt: new Date().toString(),
                  updatedAt: new Date().toString(),
                };

                const newBookRatings = [newRating].concat(book.ratings);

                return {
                  ...book,
                  avgRating: newAvg,
                  ratingsSum: newRatingsSum,
                  ratingsCount: newRatingsCount,
                  userBookInfo: {
                    ...book.userBookInfo!,
                    rated: true,
                  },
                  ratings: newBookRatings,
                };
              }),
            })),
          };
        },
      );

      return { previousBooks };
    },
    mutationKey: ["createRating"],
    onError: (err, __, context) => {
      toast.error(toastMessages.addRating.error);
      console.log(err);
      queryClient.setQueryData(
        ["books", searchTerm, categoriesFilters],
        context?.previousBooks,
      );
    },
    onSuccess: () => {
      const isStillMutating =
        queryClient.isMutating({
          mutationKey: ["createRating"],
        }) - 1;

      if (isStillMutating === 0) {
        queryClient.invalidateQueries({
          queryKey: ["books", searchTerm, categoriesFilters],
        });

        queryClient.invalidateQueries({
          queryKey: ["profile", user?.id],
        });

        queryClient.invalidateQueries({
          queryKey: ["home"],
        });
      }
    },
  });

  const { mutate: updateUserBookMutation, isPending: isUpdatingReadingStatus } =
    useMutation({
      mutationFn: async ({
        status,
        isFavorite,
      }: {
        status?: ReadingStatus;
        isFavorite?: boolean;
      }) => {
        return await api.patch("/app/user-books", {
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
      mutationKey: ["updateUserBook"],
      onMutate: async ({ status, isFavorite }) => {
        await queryClient.cancelQueries({
          queryKey: ["books", searchTerm, categoriesFilters],
        });

        const previousBooks = queryClient.getQueryData<BooksQueryData>([
          "books",
          searchTerm,
          categoriesFilters,
        ]);

        queryClient.setQueryData<BooksQueryData>(
          ["books", searchTerm, categoriesFilters],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                items: page.items.map((book) => {
                  if (book.id !== bookId) return book;

                  return {
                    ...book,
                    userBookInfo: {
                      ...book.userBookInfo!,
                      status: status ?? book.userBookInfo!.status,
                      isFavorite:
                        isFavorite ?? book.userBookInfo?.isFavorite ?? false,
                    },
                  };
                }),
              })),
            };
          },
        );

        return { previousBooks };
      },
      onError: (err, __, context) => {
        const books = context?.previousBooks;

        const isUserUpdatingBook = books?.pages.some((page) => {
          return page.items.some((book) => {
            if (book.id === bookId) {
              return book.userBookInfo !== null;
            }

            return false;
          });
        });

        if (isUserUpdatingBook) {
          toast.error(toastMessages.updateBook.error);
        } else {
          toast.error(toastMessages.addBook.error);
        }

        console.log(err);
        queryClient.setQueryData(
          ["books", searchTerm, categoriesFilters],
          context?.previousBooks,
        );
      },
      onSuccess: (_, __, context) => {
        const books = context.previousBooks;

        const isUserUpdatingBook = books?.pages.some((page) => {
          return page.items.some((book) => {
            if (book.id === bookId) {
              return book.userBookInfo !== null;
            }

            return false;
          });
        });

        if (isUserUpdatingBook) {
          toast.success(toastMessages.updateBook.success);
        } else {
          toast.success(toastMessages.addBook.success);
        }

        const isStillMutating =
          queryClient.isMutating({
            mutationKey: ["updateUserBook"],
          }) - 1;

        if (isStillMutating === 0) {
          queryClient.invalidateQueries({
            queryKey: ["books", searchTerm, categoriesFilters],
          });

          queryClient.invalidateQueries({
            queryKey: ["profile", user?.id],
          });

          queryClient.invalidateQueries({
            queryKey: ["home"],
          });
        }
      },
    });

  function handleSelectOpenChange(isOpen: boolean) {
    setIsSelectOpen(!isOpen);
  }

  function onSelectChange(status: ReadingStatus) {
    updateUserBookMutation({ status });
    return;
  }

  function onFavoriteButtonClick(isFavorite: boolean) {
    if (session.status !== "authenticated") {
      return setIsModalOpen(true);
    }

    updateUserBookMutation({ isFavorite });
    return;
  }

  function handleLoginModalOpen() {
    setIsModalOpen(true);
  }

  const bookStatus = book?.userBookInfo?.status;

  const isFavoriteBook = book?.userBookInfo?.isFavorite ?? false;

  const rated = book?.userBookInfo?.rated;

  const ratings = book?.ratings;

  useEffect(() => {
    bookDetailsContainerRef.current?.focus();
  }, []);

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

      <BookDetailsOverlay
        open={isOpen}
        onKeyDown={(e) => handleEsc(e)}
        onPointerDown={(e) => handleClickOutside(e)}
      >
        <BookDetailsContainer
          open={isOpen}
          tabIndex={-1}
          ref={bookDetailsContainerRef}
        >
          <CloseButton onClick={closeBookDetails}>
            <X />
          </CloseButton>
          <BookDetailsBody>
            <BookInfo>
              <BookInfoBody>
                {book?.coverUrl && (
                  <BookCover
                    width={172}
                    height={242}
                    src={book.coverUrl}
                    key={book.id}
                    priority
                    sizes="172px"
                  />
                )}
                <div>
                  <span>
                    <h2>{book?.title}</h2>
                    <span>{book?.author}</span>
                  </span>
                  <span>
                    <span>
                      <StarRating param={book?.avgRating ?? 0} />
                    </span>
                    <span>
                      {book?.ratingsCount}{" "}
                      {book?.ratingsCount === 1 ? "avaliação" : "avaliações"}
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

                    {bookStatus === "FINISHED" && (
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
                      (translatedBookData?.description
                        ? translatedBookData.description
                        : book?.description) ?? ""
                    }
                  />
                </BookDescription>
              </BookInfoFooter>
            </BookInfo>

            <BookDetailsRatingsContainer>
              <BookDetailsRatingsHeader>
                <span>Avaliações</span>

                {bookStatus === "FINISHED" && !rated && (
                  <button type="button" onClick={() => handleUserRatingOpen()}>
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

                {ratings &&
                  ratings &&
                  ratings.map((rating) => {
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
