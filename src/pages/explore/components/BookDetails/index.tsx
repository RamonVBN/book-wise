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
import { compareAsc, compareDesc, formatDistanceToNow } from "date-fns";
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
  HomeDataResponse,
  HomeRatingBookProps,
  HomeRatingProps,
  ProfileResponse,
  RatingProps,
  UserBookProps,
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
import { DescripitionText } from "@/components/DescriptionText";
import { toast } from "sonner";
import { toastMessages } from "@/lib/toast-messages";
import { BookCover } from "../../../../components/BookCover";
import Link from "next/link";
import { slugifyUserName } from "@/utils/slugifyUserName";
import { Avatar } from "@/components/Avatar";
import { formatAuthors } from "@/utils/formatAuthors";
import { useAuth } from "@/components/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { MeanRating } from "../MeanRating";

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

  const { demoUser } = useAuth();

  const [isUserRatingOpen, setIsUserRatingOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalMessage, setModalMessage] = useState("");

  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const bookDetailsContainerRef = useRef<HTMLDivElement>(null);
  const loginModalRef = useRef<HTMLDivElement>(null);

  function handleUserRatingOpen() {
    if (session.status !== "authenticated" && !demoUser?.isDemo) {
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

    if (demoUser?.isDemo) {
      queryClient.setQueryData(["demo-user-interacted"], true);
    }
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

  const user = session.data?.user ?? demoUser;

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
      if (demoUser?.isDemo) {
        return;
      }

      return await api.post(`/app/ratings/${user?.id}`, {
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

      const newCacheRatingId = crypto.randomUUID();

      const newProfileRating: RatingProps = {
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

      queryClient.setQueryData<ProfileResponse>(
        ["profile", user?.id],
        (oldData) => {
          if (!oldData) return oldData;

          const newUserRatings = [newProfileRating].concat(oldData.userRatings);

          const updatedUserbooks = oldData.abandonedBooks
            .concat(
              oldData.currentlyReadingBooks,
              oldData.finishedBooks,
              oldData.wantToReadBooks,
            )
            .map((ub) => {
              if (ub.id === book?.userBookInfo?.userBookId) {
                const newUpdatedAt = new Date();
                return {
                  ...ub,
                  rated: true,
                  updatedAt: newUpdatedAt.toString(),
                };
              }
              return ub;
            })
            .sort((ub1, ub2) => compareDesc(ub1.updatedAt, ub2.updatedAt));

          const currentlyReadingBooks = updatedUserbooks.filter(
            (ub) => ub.status === "READING",
          );
          const wantToReadBooks = updatedUserbooks.filter(
            (ub) => ub.status === "WANT_TO_READ",
          );
          const finishedBooks = updatedUserbooks.filter(
            (ub) => ub.status === "FINISHED",
          );
          const abandonedBooks = updatedUserbooks.filter(
            (ub) => ub.status === "ABANDONED",
          );
          const favoriteBooks = updatedUserbooks.filter((ub) => ub.isFavorite);

          return {
            ...oldData,
            allUserBooks: updatedUserbooks,
            userRatings: newUserRatings,
            currentlyReadingBooks,
            wantToReadBooks,
            finishedBooks,
            favoriteBooks,
            abandonedBooks,
          };
        },
      );

      queryClient.setQueryData<HomeDataResponse>(["home"], (oldData) => {
        if (!oldData) return oldData;

        const newRating: HomeRatingProps = {
          ...newProfileRating,
          book: {
            ...newProfileRating.book,
            userBookInfo: {
              userBookId: book?.userBookInfo?.userBookId,
              loggedUserCurrentBookStatus: book?.userBookInfo?.status,
            },
          },
        };
        return {
          ...oldData,
          lastUserActivity: newRating ?? oldData.lastUserActivity,
          recentRatings: newRating
            ? [newRating].concat(oldData.recentRatings)
            : oldData.recentRatings,
        };
      });

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
      if (!demoUser?.isDemo) {
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
        if (demoUser?.isDemo) {
          return;
        }

        return await api.patch(`/app/user-books/${user?.id}`, {
          readStatus: status,
          isFavorite: isFavorite,
          bookId: book?.id,
          title: book?.title,
          author: formatAuthors(book?.author ?? ["Autor desconhecido"]),
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

        const userBookCacheId = crypto.randomUUID();

        let userBookExists = false;

        queryClient.setQueryData<ProfileResponse>(
          ["profile", user?.id],
          (oldData) => {
            const newUserBook: UserBookProps = {
              id: userBookCacheId,
              book: {
                ...book!,
                id: book!.id,
                title: book!.title,
                author: book!.author.join(","),
                categories: book!.categories.join(","),
                pageCount: book!.pageCount,
                coverUrl: book!.coverUrl,
              },
              isFavorite: false,
              rated: false,
              status: status!,
              currentPage: status === "FINISHED" ? book?.pageCount : undefined,
              updatedAt: new Date().toString(),
              user: user!,
              userId: user!.id,
            };

            if (!oldData) {
              return {
                allUserBooks: [newUserBook],
                userRatings: [],
                currentlyReadingBooks:
                  newUserBook.status === "READING" ? [newUserBook] : [],
                wantToReadBooks:
                  newUserBook.status === "WANT_TO_READ" ? [newUserBook] : [],
                finishedBooks:
                  newUserBook.status === "FINISHED" ? [newUserBook] : [],
                abandonedBooks:
                  newUserBook.status === "ABANDONED" ? [newUserBook] : [],
                favoriteBooks: newUserBook.isFavorite ? [newUserBook] : [],
                userInfo: demoUser!,
              };
            }

            userBookExists = oldData.allUserBooks
              .some((ub) => ub.book.id === book?.id);

            if (userBookExists) {
              const updatedProfileData = oldData.allUserBooks
                .map((ub) => {
                  if (ub.book.id === book?.id) {
                    const newUpdatedAt = new Date();
                    const totalPages = ub.customTotalPage ?? ub.book.pageCount;

                    return {
                      ...ub,
                      status: status ?? ub.status,
                      isFavorite: isFavorite ?? ub.isFavorite,
                      currentPage:
                        status === "FINISHED" ? totalPages : ub.currentPage,
                      updatedAt: newUpdatedAt.toString(),
                    };
                  }
                  return ub;
                })
                .sort((ub1, ub2) => compareDesc(ub1.updatedAt, ub2.updatedAt));

              const currentlyReadingBooks = updatedProfileData.filter(
                (ub) => ub.status === "READING",
              );

              const wantToReadBooks = updatedProfileData
                .filter((ub) => ub.status === "WANT_TO_READ")
                .sort((ub1, ub2) =>
                  compareAsc(
                    ub1.wantToReadPosition ?? Infinity,
                    ub2.wantToReadPosition ?? Infinity,
                  ),
                );

              const finishedBooks = updatedProfileData.filter(
                (ub) => ub.status === "FINISHED",
              );

              const abandonedBooks = updatedProfileData.filter(
                (ub) => ub.status === "ABANDONED",
              );
              const favoriteBooks = updatedProfileData
                .filter((ub) => ub.isFavorite)
                .sort((ub1, ub2) =>
                  compareAsc(
                    ub1.favoritePosition ?? Infinity,
                    ub2.favoritePosition ?? Infinity,
                  ),
                );

              return {
                ...oldData,
                allUserBooks: updatedProfileData,
                currentlyReadingBooks,
                wantToReadBooks,
                finishedBooks,
                abandonedBooks,
                favoriteBooks,
              };
            }

            const updatedProfileData = [newUserBook]
              .concat(
                oldData.abandonedBooks.concat(
                  oldData.currentlyReadingBooks,
                  oldData.finishedBooks,
                  oldData.wantToReadBooks,
                ),
              )
              .sort((ub1, ub2) => compareDesc(ub1.updatedAt, ub2.updatedAt));

            const currentlyReadingBooks = updatedProfileData.filter(
              (ub) => ub.status === "READING",
            );

            const wantToReadBooks = updatedProfileData
              .filter((ub) => ub.status === "WANT_TO_READ")
              .sort((ub1, ub2) =>
                compareAsc(
                  ub1.wantToReadPosition ?? Infinity,
                  ub2.wantToReadPosition ?? Infinity,
                ),
              );

            const finishedBooks = updatedProfileData.filter(
              (ub) => ub.status === "FINISHED",
            );

            const abandonedBooks = updatedProfileData.filter(
              (ub) => ub.status === "ABANDONED",
            );
            const favoriteBooks = updatedProfileData
              .filter((ub) => ub.isFavorite)
              .sort((ub1, ub2) =>
                compareAsc(
                  ub1.favoritePosition ?? Infinity,
                  ub2.favoritePosition ?? Infinity,
                ),
              );

            return {
              ...oldData,
              allUserBooks: updatedProfileData,
              currentlyReadingBooks,
              wantToReadBooks,
              finishedBooks,
              abandonedBooks,
              favoriteBooks,
            };
          },
        );

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
                      userBookId: userBookExists
                        ? book.userBookInfo!.userBookId
                        : userBookCacheId,
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

        queryClient.setQueryData<HomeDataResponse>(["home"], (oldData) => {
          if (!oldData) return oldData;

          const updatedProfileData = queryClient.getQueryData<ProfileResponse>([
            "profile",
            user?.id,
          ]);

          const updatedUb = updatedProfileData?.allUserBooks[0];

          const isThisBookARecentRatedBook = oldData.recentRatings.find(
            (r) => r.book.id === updatedUb?.book.id,
          );

          const isThisBookAPopBook = oldData.popularBooks.find(
            (b) => b.id === updatedUb?.book.id,
          );

          return {
            ...oldData,
            lastUserActivity: updatedUb ?? oldData.lastUserActivity,
            recentRatings: isThisBookARecentRatedBook
              ? oldData.recentRatings.map((r) => {
                  if (r.book.id !== updatedUb?.book.id) {
                    return r;
                  }

                  return {
                    ...r,
                    book: {
                      ...r.book,
                      userBookInfo: {
                        ...r.book.userBookInfo,
                        loggedUserCurrentBookStatus: updatedUb.status,
                      },
                    },
                  };
                })
              : oldData.recentRatings,
            popularBooks: isThisBookAPopBook
              ? oldData.popularBooks.map((b) => {
                  if (b.id !== updatedUb?.book.id) {
                    return b;
                  }

                  return {
                    ...b,
                    userBookInfo: {
                      ...b.userBookInfo,
                      loggedUserCurrentBookStatus: updatedUb.status,
                    },
                  };
                })
              : oldData.popularBooks,
          };
        });

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

        if (!demoUser?.isDemo) {
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
        }
      },
    });

  function handleSelectOpenChange(isOpen: boolean) {
    setIsSelectOpen(!isOpen);
  }

  function onSelectChange(status: ReadingStatus) {
    updateUserBookMutation({ status });
    if (demoUser?.isDemo) {
      queryClient.setQueryData(["demo-user-interacted"], true);
    }
    return;
  }

  function onFavoriteButtonClick(isFavorite: boolean) {
    if (session.status !== "authenticated" && !demoUser?.isDemo) {
      return setIsModalOpen(true);
    }

    updateUserBookMutation({ isFavorite });
    if (demoUser?.isDemo) {
      queryClient.setQueryData(["demo-user-interacted"], true);
    }
    return;
  }

  function handleLoginModalOpen(message: string) {
    setModalMessage(message);
    setIsModalOpen(true);
  }

  const isSigned =
    session.status === "authenticated" || (demoUser?.isDemo ?? false);

  const bookStatus = isSigned ? book?.userBookInfo?.status : undefined

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
          <AuthModal description={modalMessage} />
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
                    <span>
                      {book?.author
                        ? formatAuthors(book.author)
                        : "Autor(es) desconhecido(s)"}
                    </span>
                  </span>

                  <span>
                    <MeanRating avgRating={book?.avgRating ?? 0} />
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
                 </div>

                  <div>
                    <ReadingStatusSelect
                      openLoginModal={handleLoginModalOpen}
                      isAuthenticated={isSigned}
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
                  showMoreButton
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
                    avatarUrl={
                      session.data?.user.avatarUrl ?? demoUser?.avatarUrl
                    }
                    userName={session.data?.user.name ?? demoUser?.name}
                  />
                )}

                {ratings &&
                  ratings.map((rating) => {
                    return (
                      <BookDetailsRating
                        isUserRating={rating.user.id === user?.id}
                        key={rating.id}
                      >
                        <div>
                          <div>
                            {user ? (
                              <Link
                                href={`/profile/${slugifyUserName(rating.user.name)}/${rating.user.id}?filter=allUserBooks`}
                              >
                                <Avatar
                                  width={40}
                                  height={40}
                                  userName={rating.user.name}
                                  src={rating.user.avatarUrl}
                                />
                              </Link>
                            ) : (
                              <Avatar
                                width={40}
                                height={40}
                                userName={rating.user.name}
                                src={rating.user.avatarUrl}
                                onClick={() =>
                                  handleLoginModalOpen(
                                    "Faça login pra ver perfis de outros usuários",
                                  )
                                }
                              />
                            )}

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

                          <StarRating param={rating.rate} />
                        </div>

                        <DescripitionText showMoreButton description={rating.review} />
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
