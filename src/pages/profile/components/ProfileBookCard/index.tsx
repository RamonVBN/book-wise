import {
  BooksQueryData,
  ExploreBooksProps,
  HomeDataResponse,
  HomeRatingProps,
  ProfileResponse,
  RatingProps,
  UserBookProps,
} from "@/@types/query-types";
import {
  ModalBody,
  ProfileBook,
  ProfileBookButton,
  ProfileBookInfo,
  ProfileBookOptions,
  ProfileBookTime,
} from "./styles";
import { compareAsc, formatDistanceToNow, max } from "date-fns";
import { capitalize } from "@/utils/capitalize";
import { StarRating } from "@/components/StarsRating";
import {
  UserRatingForm,
  UserRatingSubmitData,
} from "@/components/UserRatingForm";
import { useEffect, useRef, useState } from "react";
import { ptBR } from "date-fns/locale/pt-BR";
import { Pencil, Star, Trash, X } from "phosphor-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Modal } from "@/components/Modal";
import { CloseButton } from "@/pages/explore/components/BookDetails/styles";
import { ReadingStatus } from "@/generated/prisma";
import { ReadingStatusSelect } from "@/components/ReadingStatusSelect";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ReadingProgress } from "../ReadingProgressBar";
import { BookmarkPlus, GripVertical } from "lucide-react";
import { ReadingProgressUpdater } from "../ReadingProgressUpdater";
import { BooksStatusFlag } from "@/components/BooksStatusFlag";
import { AppTooltip } from "@/components/Tooltip";
import { toast } from "sonner";
import { toastMessages } from "@/lib/toast-messages";
import { compareDesc } from "date-fns";
import { BookCover } from "@/components/BookCover";
import { DragHandleProps } from "../SortableItem";
import { FavoriteFlag } from "../FavoriteFlag";
import { useAuth } from "@/components/AuthContext";
import { DescripitionText } from "@/components/DescriptionText";

interface ProfileBookCardProps {
  userBook?: UserBookProps;
  rating?: RatingProps;
  isFavoriteList?: boolean;
  isAllUserBooks?: boolean;
  dragHandle?: DragHandleProps;
  dragging?: boolean;
  isLoggedUserProfile: boolean;
}

export function ProfileBookCard({
  userBook,
  isFavoriteList,
  rating,
  isAllUserBooks,
  dragHandle,
  dragging,
  isLoggedUserProfile,
}: ProfileBookCardProps) {
  const { demoUser } = useAuth();

  const queryClient = useQueryClient();

  const [isUserRatingFormOpen, setisUserRatingFormOpen] = useState(false);

  const [isReadingProgressUpdaterOpen, setIsReadingProgressUpdaterOpen] =
    useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const ratingId = rating?.id;
  const userId = rating?.user?.id ?? userBook?.userId;
  const user = rating?.user ?? userBook?.user;
  const book = rating?.book ?? userBook?.book;

  function handleCloseUserRatingForm() {
    setisUserRatingFormOpen(false);
  }

  function handleRatingSubmit(data: UserRatingSubmitData) {
    if (rating) {
      updateRatingMutation(data);
    } else {
      createRatingMutation(data);
    }

    setisUserRatingFormOpen(false);

    if (demoUser?.isDemo) {
      queryClient.setQueryData(["demo-user-interacted"], true);
    }
  }

  function handleDelete() {
    if (ratingId) {
      deleteRatingMutation(ratingId);
    } else {
      deleteUserBookMutation();
    }

    setIsModalOpen(false);

    if (demoUser?.isDemo) {
      queryClient.setQueryData(["demo-user-interacted"], true);
    }
  }

  function handleSelectOpenChange(isOpen: boolean) {
    setIsSelectOpen(!isOpen);
  }

  function updateReadingProgress(newPage: number, customTotalPage?: number) {
    updateUserBookMutation({
      currentPage: newPage,
      customTotalPage,
    });
  }

  const { mutate: updateRatingMutation, isPending: isUpdatingRating } =
    useMutation({
      mutationFn: async (data: UserRatingSubmitData) => {
        if (demoUser?.isDemo) {
          return;
        }

        const newRate = data.rate;
        const newReview = data.review;
        return await api.put(`/app/ratings/users/${rating?.id}`, {
          newReview,
          newRate,
        });
      },
      mutationKey: ["updateRating"],
      onMutate: async (data) => {
        toast.success(toastMessages.updateRating.success);

        await queryClient.cancelQueries({ queryKey: ["profile", userId] });

        const previousProfileData = queryClient.getQueryData([
          "profile",
          userId,
        ]);

        queryClient.setQueryData<ProfileResponse>(
          ["profile", userId],
          (oldData) => {
            if (!oldData) return oldData;

            const newUpdatedAt = new Date().toString();

            const newUserRatings = oldData.userRatings
              .map((r) => {
                if (r.id === ratingId) {
                  return {
                    ...r,
                    review: data.review,
                    rate: data.rate,
                    updatedAt: newUpdatedAt,
                  };
                }

                return r;
              })
              .sort((ur1, ur2) => compareDesc(ur1.updatedAt, ur2.updatedAt));

            return {
              ...oldData,
              userRatings: newUserRatings,
            };
          },
        );

        queryClient.setQueriesData<BooksQueryData>(
          { queryKey: ["books"] },
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                items: page.items.map((book) => {
                  if (book.id !== rating?.book.id) return book;

                  const newRatingsSum =
                    book.ratingsSum - rating.rate + data.rate;
                  const newAvg = newRatingsSum / book.ratingsCount;

                  const updatedBookRatings = book.ratings.map((r) => {
                    if (r.id === ratingId) {
                      return {
                        ...r,
                        review: data.review,
                        rate: data.rate,
                        updatedAt: new Date().toString(),
                      };
                    }

                    return r;
                  });

                  const updatedBook: ExploreBooksProps = {
                    ...book,
                    ratingsSum: newRatingsSum,
                    avgRating: newAvg,
                    ratings: updatedBookRatings,
                  };

                  return {
                    ...updatedBook,
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
            userId,
          ]);

          const oldHomeRating = oldData.recentRatings.find(
            (r) => r.id === updatedProfileData?.userRatings[0].id,
          );

          const isUpdatedRatingARecentRating = !!oldHomeRating;

          const updatedRating: HomeRatingProps = {
            ...updatedProfileData!.userRatings[0],
            book: {
              ...updatedProfileData!.userRatings[0].book,
              userBookInfo: {
                userBookId: oldHomeRating?.book.userBookInfo.userBookId,
                loggedUserCurrentBookStatus:
                  oldHomeRating?.book.userBookInfo.loggedUserCurrentBookStatus,
              },
            },
          };

          return {
            ...oldData,
            lastUserActivity: updatedRating ?? oldData.lastUserActivity,
            recentRatings: isUpdatedRatingARecentRating
              ? oldData.recentRatings.map((r) => {
                  if (r.id !== updatedRating?.id) {
                    return r;
                  }

                  return updatedRating;
                })
              : oldData.recentRatings,
          };
        });

        return { previousProfileData };
      },
      onError: (err, __, context) => {
        toast.error(toastMessages.updateRating.error);
        console.log(err);
        queryClient.setQueryData(
          ["profile", userId],
          context?.previousProfileData,
        );
      },
      onSuccess: () => {
        if (!demoUser?.isDemo) {
          const isStillMutating =
            queryClient.isMutating({
              mutationKey: ["updateRating"],
            }) - 1;

          if (isStillMutating === 0) {
            queryClient.invalidateQueries({
              queryKey: ["profile", userId],
            });

            queryClient.invalidateQueries({
              queryKey: ["books"],
            });

            queryClient.invalidateQueries({
              queryKey: ["home"],
            });
          }
        }
      },
    });

  const { mutate: createRatingMutation, isPending: isCreatingRating } =
    useMutation({
      mutationFn: async (data: UserRatingSubmitData) => {
        if (demoUser?.isDemo) {
          return;
        }

        return await api.post(`/app/ratings/users/${userId}`, {
          rate: data.rate,
          review: data.review,
          bookId: book?.id,
          title: book?.title,
          author: book?.author,
          coverUrl: book?.coverUrl,
          pageCount: book?.pageCount,
          categories: book?.categories,
        });
      },
      mutationKey: ["createRating"],
      onMutate: async (data) => {
        toast.success(toastMessages.addRating.success);

        await queryClient.cancelQueries({ queryKey: ["profile", userId] });

        const previousProfileData = queryClient.getQueryData([
          "profile",
          userId,
        ]);

        const newCacheRatingId = crypto.randomUUID();

        queryClient.setQueryData<ProfileResponse>(
          ["profile", userId],
          (oldData) => {
            if (!oldData) return oldData;

            const newRating: RatingProps = {
              id: newCacheRatingId,
              rate: data.rate,
              review: data.review,
              book: book!,
              user: user!,
              createdAt: new Date().toString(),
              updatedAt: new Date().toString(),
            };

            const newUserRatings = [newRating].concat(oldData.userRatings);

            const updatedUserbooks = oldData.abandonedBooks
              .concat(
                oldData.currentlyReadingBooks,
                oldData.finishedBooks,
                oldData.wantToReadBooks,
              )
              .map((ub) => {
                if (ub.id === userBook?.id) {
                  return {
                    ...ub,
                    rated: true,
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
            const favoriteBooks = updatedUserbooks.filter(
              (ub) => ub.isFavorite,
            );

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

        queryClient.setQueriesData<BooksQueryData>(
          { queryKey: ["books"] },
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                items: page.items.map((book) => {
                  if (book.id !== userBook?.book.id) return book;

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

        queryClient.setQueryData<HomeDataResponse>(["home"], (oldData) => {
          if (!oldData) return oldData;

          const updatedProfileData = queryClient.getQueryData<ProfileResponse>([
            "profile",
            userId,
          ]);

          const userBook = updatedProfileData?.allUserBooks.find(
            (ub) => ub.book.id === book?.id && ub.userId === user?.id,
          );

          const newRating: HomeRatingProps = {
            ...updatedProfileData!.userRatings[0],
            book: {
              ...updatedProfileData!.userRatings[0].book,
              userBookInfo: {
                userBookId: userBook?.id,
                loggedUserCurrentBookStatus: "FINISHED",
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

        return { previousProfileData };
      },
      onError: (err, __, context) => {
        toast.error(toastMessages.addRating.error);
        console.log(err);
        queryClient.setQueryData(
          ["profile", userId],
          context?.previousProfileData,
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
              queryKey: ["profile", userId],
            });

            queryClient.invalidateQueries({
              queryKey: ["books"],
            });

            queryClient.invalidateQueries({
              queryKey: ["home"],
            });
          }
        }
      },
    });

  const { mutate: deleteRatingMutation } = useMutation({
    mutationFn: async (ratingId: string) => {
      if (demoUser?.isDemo) {
        return;
      }

      return await api.delete(`/app/ratings/users/${ratingId}`);
    },
    onMutate: async (ratingId) => {
      toast.success(toastMessages.deleteRating.success);

      await queryClient.cancelQueries({ queryKey: ["profile", userId] });

      const previousProfileData = queryClient.getQueryData(["profile", userId]);

      queryClient.setQueryData<ProfileResponse>(
        ["profile", userId],
        (oldData) => {
          if (!oldData) return oldData;

          const ratingToDelete = oldData.userRatings.find(
            (r) => r.id === ratingId,
          );
          const updatedFinishedBooks = oldData.finishedBooks.map((ub) => {
            if (
              ub.book.id === ratingToDelete?.book.id &&
              ub.userId === rating?.user.id
            ) {
              return {
                ...ub,
                rated: false,
              };
            }

            return ub;
          });

          return {
            ...oldData,
            finishedBooks: updatedFinishedBooks,
            userRatings: oldData.userRatings.filter((r) => r.id !== ratingId),
          };
        },
      );

      queryClient.setQueriesData<BooksQueryData>(
        { queryKey: ["books"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((book) => {
                if (book.id !== rating?.book.id) return book;

                const newBookRatings = book.ratings.filter(
                  (rating) => rating.user.id !== userId,
                );

                const newRatingsCount = book.ratingsCount - 1;
                const newRatingsSum = book.ratingsSum - rating.rate;
                const newAvg =
                  newRatingsSum > 0 ? newRatingsSum / newRatingsCount : 0;

                return {
                  ...book,
                  ratingsCount: newRatingsCount,
                  ratingsSum: newRatingsSum,
                  avgRating: newAvg,
                  ratings: newBookRatings,
                  userBookInfo: {
                    ...book.userBookInfo!,
                    rated: false,
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
          userId,
        ]);

        const lastUpdatedRating = updatedProfileData?.userRatings[0];

        const lastUpdatedUserBook = updatedProfileData?.allUserBooks[0];

        if (!lastUpdatedRating && !lastUpdatedUserBook) return oldData;

        const lastUserActivityDate = max([
          lastUpdatedRating
            ? new Date(lastUpdatedRating.updatedAt)
            : new Date(0),
          lastUpdatedUserBook
            ? new Date(lastUpdatedUserBook.updatedAt)
            : new Date(0),
        ]);

        const newRecentRatings = oldData.recentRatings.filter(
          (r) => r.id !== ratingId,
        );

        return {
          ...oldData,
          lastUserActivity:
            lastUserActivityDate.toString() === lastUpdatedRating?.updatedAt
              ? lastUpdatedRating
              : (lastUpdatedUserBook ?? oldData.lastUserActivity),
          recentRatings: newRecentRatings,
        };
      });

      return { previousProfileData };
    },
    mutationKey: ["deleteRating"],
    onError: (err, __, context) => {
      toast.error(toastMessages.deleteRating.error);
      console.log(err);
      queryClient.setQueryData(
        ["profile", userId],
        context?.previousProfileData,
      );
    },
    onSuccess: () => {
      if (!demoUser?.isDemo) {
        const isStillMutating =
          queryClient.isMutating({
            mutationKey: ["deleteRating"],
          }) - 1;

        if (isStillMutating === 0) {
          queryClient.invalidateQueries({
            queryKey: ["profile", userId],
          });

          queryClient.invalidateQueries({
            queryKey: ["books"],
          });

          queryClient.invalidateQueries({
            queryKey: ["home"],
          });
        }
      }
    },
  });

  const { mutate: updateUserBookMutation, isPending: isUpdatingUserBook } =
    useMutation({
      mutationFn: async ({
        status,
        isFavorite,
        currentPage,
        customTotalPage,
      }: {
        status?: ReadingStatus;
        isFavorite?: boolean;
        currentPage?: number;
        customTotalPage?: number;
      }) => {
        if (demoUser?.isDemo) {
          return;
        }

        return await api.patch(`/app/user-books/${userId}`, {
          readStatus: status,
          isFavorite,
          currentPage,
          customTotalPage,

          bookId: book?.id,
          title: book?.title,
          author: book?.author,
          coverUrl: book?.coverUrl,
          pageCount: book?.pageCount,
          categories: book?.categories,
        });
      },
      mutationKey: ["updateUserBook"],
      onMutate: async ({
        status,
        isFavorite,
        currentPage,
        customTotalPage,
      }) => {
        await queryClient.cancelQueries({ queryKey: ["profile", userId] });

        if (status || (isFavorite !== undefined && !isFavorite)) {
          toast.success(toastMessages.updateBook.success);
        }

        const previousProfileData = queryClient.getQueryData([
          "profile",
          userId,
        ]);

        queryClient.setQueryData<ProfileResponse>(
          ["profile", userId],
          (oldData) => {
            if (!oldData) return oldData;

            const updatedProfileData = oldData.abandonedBooks
              .concat(
                oldData.currentlyReadingBooks,
                oldData.finishedBooks,
                oldData.wantToReadBooks,
              )
              .map((ub) => {
                if (ub.id === userBook?.id) {
                  const newUpdatedAt = new Date();
                  const totalPages = customTotalPage
                    ? customTotalPage
                    : (ub.customTotalPage ?? ub.book.pageCount);
                  return {
                    ...ub,
                    status:
                      totalPages === currentPage
                        ? "FINISHED"
                        : (status ?? ub.status),
                    isFavorite: isFavorite ?? ub.isFavorite,
                    currentPage:
                      currentPage ??
                      (status === "FINISHED" ? totalPages : ub.currentPage),
                    customTotalPage: customTotalPage ?? ub.customTotalPage,
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
          },
        );

        queryClient.setQueriesData<BooksQueryData>(
          { queryKey: ["books"] },
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                items: page.items.map((book) => {
                  if (book.id !== userBook?.book.id) return book;

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

        queryClient.setQueryData<HomeDataResponse>(["home"], (oldData) => {
          if (!oldData) return oldData;

          const updatedProfileData = queryClient.getQueryData<ProfileResponse>([
            "profile",
            userId,
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

        return { previousProfileData };
      },
      onError: (err, __, context) => {
        toast.error(toastMessages.updateBook.error);
        console.log(err);
        queryClient.setQueryData(
          ["profile", userId],
          context?.previousProfileData,
        );
      },
      onSuccess: (_, { status, isFavorite, currentPage }) => {
        if ((!status && isFavorite) || currentPage) {
          toast.success(toastMessages.updateBook.success);
        }

        if (!demoUser?.isDemo) {
          const isStillMutating =
            queryClient.isMutating({
              mutationKey: ["updateUserBook"],
            }) - 1;

          if (isStillMutating === 0) {
            queryClient.invalidateQueries({
              queryKey: ["profile", userId],
            });

            queryClient.invalidateQueries({
              queryKey: ["books"],
              refetchType: "all",
            });

            queryClient.invalidateQueries({
              queryKey: ["home"],
            });
          }
        } else {
          queryClient.setQueryData(["demo-user-interacted"], true);
        }
      },
    });

  const { mutate: deleteUserBookMutation } = useMutation({
    mutationFn: async () => {
      if (demoUser?.isDemo) {
        return;
      }

      return await api.delete(`/app/user-books/${userBook?.id}`);
    },
    mutationKey: ["deleteUserBook"],
    onMutate: async () => {
      toast.success(toastMessages.deleteBook.success);

      await queryClient.cancelQueries({ queryKey: ["profile", userId] });

      const previousProfileData = queryClient.getQueryData(["profile", userId]);

      queryClient.setQueryData<ProfileResponse>(
        ["profile", userId],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedProfileData = oldData.abandonedBooks
            .concat(
              oldData.currentlyReadingBooks,
              oldData.finishedBooks,
              oldData.wantToReadBooks,
            )
            .filter((ub) => ub.id !== userBook?.id)
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

          const newUserRatings = oldData.userRatings.filter(
            (rating) => rating.book.id !== userBook?.book.id,
          );

          return {
            ...oldData,
            allUserBooks: updatedProfileData,
            userRatings: newUserRatings,
            currentlyReadingBooks,
            wantToReadBooks,
            finishedBooks,
            abandonedBooks,
            favoriteBooks,
          };
        },
      );

      queryClient.setQueriesData<BooksQueryData>(
        { queryKey: ["books"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((book) => {
                if (book.id !== userBook?.book.id) return book;

                const newBookRatings = book.ratings.filter(
                  (rating) => rating.user.id !== userId,
                );

                const userBookRating = book.ratings.find(
                  (r) => r.user.id === userId,
                );

                const newRatingsCount = userBookRating
                  ? book.ratingsCount - 1
                  : book.ratingsCount;
                const newRatingsSum = userBookRating
                  ? book.ratingsSum - userBookRating.rate
                  : book.ratingsSum;
                const newAvg =
                  newRatingsSum > 0 ? newRatingsSum / newRatingsCount : 0;

                return {
                  ...book,
                  ratings: newBookRatings,
                  ratingsCount: newRatingsCount,
                  ratingsSum: newRatingsSum,
                  avgRating: newAvg,
                  userBookInfo: null,
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
          userId,
        ]);

        const deletedUserBook = userBook;

        const isThisBookARecentRatedBook = oldData.recentRatings.find(
          (r) => r.book.id === deletedUserBook?.book.id,
        );

        const isThisBookAPopBook = oldData.popularBooks.find(
          (b) => b.id === deletedUserBook?.book.id,
        );

        const lastUpdatedRating = updatedProfileData?.userRatings[0];

        const lastUpdatedUserBook = updatedProfileData?.allUserBooks[0];

        if (!lastUpdatedRating && !lastUpdatedUserBook)
          return {
            ...oldData,
            lastUserActivity: null,
            recentRatings: isThisBookARecentRatedBook
              ? oldData.recentRatings.map((r) => {
                  if (r.book.id !== deletedUserBook?.book.id) {
                    return r;
                  }

                  return {
                    ...r,
                    book: {
                      ...r.book,
                      userBookInfo: {
                        userBookId: undefined,
                        loggedUserCurrentBookStatus: undefined,
                      },
                    },
                  };
                })
              : oldData.recentRatings,
            popularBooks: isThisBookAPopBook
              ? oldData.popularBooks.map((b) => {
                  if (b.id !== deletedUserBook?.book.id) {
                    return b;
                  }

                  return {
                    ...b,
                    userBookInfo: {
                      userBookId: undefined,
                      loggedUserCurrentBookStatus: undefined,
                    },
                  };
                })
              : oldData.popularBooks,
          };

        const lastUserActivityDate = max([
          lastUpdatedRating
            ? new Date(lastUpdatedRating.updatedAt)
            : new Date(0),
          lastUpdatedUserBook
            ? new Date(lastUpdatedUserBook.updatedAt)
            : new Date(0),
        ]);

        return {
          ...oldData,
          lastUserActivity:
            lastUserActivityDate.toString() === lastUpdatedRating?.updatedAt
              ? lastUpdatedRating
              : (lastUpdatedUserBook ?? oldData.lastUserActivity),
          recentRatings: isThisBookARecentRatedBook
            ? oldData.recentRatings.map((r) => {
                if (r.book.id !== deletedUserBook?.book.id) {
                  return r;
                }

                return {
                  ...r,
                  book: {
                    ...r.book,
                    userBookInfo: {
                      userBookId: undefined,
                      loggedUserCurrentBookStatus: undefined,
                    },
                  },
                };
              })
            : oldData.recentRatings,
          popularBooks: isThisBookAPopBook
            ? oldData.popularBooks.map((b) => {
                if (b.id !== deletedUserBook?.book.id) {
                  return b;
                }

                return {
                  ...b,
                  userBookInfo: {
                    userBookId: undefined,
                    loggedUserCurrentBookStatus: undefined,
                  },
                };
              })
            : oldData.popularBooks,
        };
      });

      return { previousProfileData };
    },
    onError: (err, __, context) => {
      toast.error(toastMessages.deleteBook.error);
      console.log(err);
      queryClient.setQueryData(
        ["profile", userId],
        context?.previousProfileData,
      );
    },
    onSuccess: () => {
      if (!demoUser?.isDemo) {
        const isStillMutating =
          queryClient.isMutating({
            mutationKey: ["deleteUserBook"],
          }) - 1;

        if (isStillMutating === 0) {
          queryClient.invalidateQueries({
            queryKey: ["profile", userId],
          });

          queryClient.invalidateQueries({
            queryKey: ["books"],
            refetchType: "all",
          });

          queryClient.invalidateQueries({
            queryKey: ["home"],
          });
        }
      }
    },
  });

  function handleClickOutside(event: React.PointerEvent<HTMLDivElement>) {
    if (
      isModalOpen &&
      modalRef.current &&
      !modalRef.current.contains(event.target as Node)
    ) {
      return setIsModalOpen(false);
    }
  }

  function handleEsc(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && isModalOpen) {
      return setIsModalOpen(false);
    }
  }

  function onSelectChange(status: ReadingStatus) {
    updateUserBookMutation({ status });
  }

  useEffect(() => {
    modalRef.current?.focus();
  }, [isModalOpen]);

  return (
    <>
      {isModalOpen && (
        <Modal
          onKeyDown={handleEsc}
          onPointerDown={handleClickOutside}
          ref={modalRef}
        >
          <CloseButton type="button" onClick={() => setIsModalOpen(false)}>
            <X />
          </CloseButton>

          <ModalBody>
            <p>
              {rating
                ? "Tem certeza que deseja excluir sua avaliação?"
                : "Tem certeza que deseja excluir este livro da sua estante?"}
            </p>

            <div>
              <button onClick={() => handleDelete()}>Excluir</button>
              <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
            </div>
          </ModalBody>
        </Modal>
      )}

      <div>
        {rating && (
          <ProfileBookTime>
            {capitalize(
              formatDistanceToNow(rating.updatedAt, {
                addSuffix: true,
                locale: ptBR,
              }),
            )}
          </ProfileBookTime>
        )}
        {userBook && !dragHandle && !dragging && (
          <ProfileBookTime>
            {capitalize(
              formatDistanceToNow(userBook.updatedAt, {
                addSuffix: true,
                locale: ptBR,
              }),
            )}
          </ProfileBookTime>
        )}
        <ProfileBook dragging={dragging}>
          <div>
            <ProfileBookInfo>
              <div>
                {(dragHandle || dragging) && isLoggedUserProfile && (
                  <AppTooltip
                    dragging={dragging}
                    content="Mudar ordem dos itens"
                  >
                    <ProfileBookButton
                      {...dragHandle?.attributes}
                      {...dragHandle?.listeners}
                    >
                      <GripVertical />
                    </ProfileBookButton>
                  </AppTooltip>
                )}
              </div>

              <div>
                {book && (
                  <BookCover
                    key={book.id}
                    width={98}
                    height={134}
                    sizes="98px"
                    src={book.coverUrl}
                    priority
                  />
                )}
                <div>
                  <span>
                    <h2>{book?.title}</h2>
                    <span>{book?.author}</span>
                  </span>

                  {rating && !isUserRatingFormOpen && (
                    <StarRating param={rating.rate} />
                  )}
                </div>
              </div>
            </ProfileBookInfo>

            {isLoggedUserProfile && (
              <ProfileBookOptions>
                <div>
                  {!isAllUserBooks &&
                    (rating ||
                      (userBook?.status === "FINISHED" && !isFavoriteList)) && (
                      <AppTooltip
                        content={
                          rating
                            ? "Editar avaliação"
                            : userBook?.rated
                              ? "Livro avaliado"
                              : "Avaliar livro"
                        }
                      >
                        <ProfileBookButton
                          disabled={
                            userBook?.rated ||
                            isCreatingRating ||
                            isUpdatingRating
                          }
                          onClick={() =>
                            setisUserRatingFormOpen(!isUserRatingFormOpen)
                          }
                        >
                          {rating && <Pencil />}

                          {userBook?.status === "FINISHED" &&
                            !isFavoriteList &&
                            (userBook.rated || isCreatingRating ? (
                              <Star weight="fill" />
                            ) : (
                              <Star />
                            ))}
                        </ProfileBookButton>
                      </AppTooltip>
                    )}

                  {!isAllUserBooks &&
                    userBook &&
                    userBook.status === "READING" &&
                    !isFavoriteList && (
                      <AppTooltip content="Atualizar progresso de leitura">
                        <ProfileBookButton
                          disabled={isUpdatingUserBook}
                          isLoading={isUpdatingUserBook}
                          onClick={() =>
                            setIsReadingProgressUpdaterOpen(
                              !isReadingProgressUpdaterOpen,
                            )
                          }
                        >
                          <BookmarkPlus />
                        </ProfileBookButton>
                      </AppTooltip>
                    )}

                  {(rating || isAllUserBooks) && (
                    <AppTooltip
                      content={
                        rating
                          ? "Excluir avaliação"
                          : "Excluir livro da estante"
                      }
                    >
                      <ProfileBookButton onClick={() => setIsModalOpen(true)}>
                        <Trash size={24} />
                      </ProfileBookButton>
                    </AppTooltip>
                  )}
                  {userBook && isAllUserBooks && (
                    <BooksStatusFlag status={userBook.status} />
                  )}

                  {!isAllUserBooks &&
                    userBook &&
                    (isFavoriteList || userBook.status === "FINISHED") && (
                      <FavoriteButton
                        disabled={isUpdatingUserBook}
                        isFavorite={userBook.isFavorite}
                        setIsFavorite={(isFavorite) =>
                          updateUserBookMutation({
                            isFavorite,
                          })
                        }
                      />
                    )}

                  {!isAllUserBooks && userBook && !isFavoriteList && (
                    <ReadingStatusSelect
                      disabled={isUpdatingUserBook}
                      onChange={onSelectChange}
                      handleSelectOpenChange={handleSelectOpenChange}
                      isSelectOpen={isSelectOpen}
                      value={userBook.status}
                    />
                  )}
                </div>
              </ProfileBookOptions>
            )}

            {!isFavoriteList && !isLoggedUserProfile && !rating && (
              <BooksStatusFlag status={userBook!.status} />
            )}

            {!isLoggedUserProfile && !rating && isFavoriteList && (
              <FavoriteFlag />
            )}
          </div>

          <div>
            {!isAllUserBooks &&
              userBook &&
              (userBook.status === "READING" ||
                userBook.status === "ABANDONED" ||
                userBook.status === "FINISHED") &&
              !isFavoriteList && (
                <ReadingProgress
                  abandoned={userBook.status === "ABANDONED"}
                  currentPage={userBook.currentPage ? userBook.currentPage : 0}
                  totalPages={
                    userBook.customTotalPage
                      ? userBook.customTotalPage
                      : userBook.book.pageCount
                  }
                />
              )}
          </div>

          {rating && !isUserRatingFormOpen && (
            <DescripitionText description={rating.review} />
          )}

          {(rating || userBook?.status === "FINISHED") &&
            isUserRatingFormOpen && (
              <UserRatingForm
                initialReview={rating?.review}
                initialRate={rating?.rate}
                profile={true}
                handleRatingSubmit={handleRatingSubmit}
                handleCloseUserRatingForm={handleCloseUserRatingForm}
              />
            )}

          {userBook?.status === "READING" && isReadingProgressUpdaterOpen && (
            <ReadingProgressUpdater
              handleCloseReadingProgressUpdater={() =>
                setIsReadingProgressUpdaterOpen(!isReadingProgressUpdaterOpen)
              }
              onUpdate={updateReadingProgress}
              currentPage={userBook.currentPage ? userBook.currentPage : 0}
              totalPages={
                userBook.customTotalPage
                  ? userBook.customTotalPage
                  : userBook.book.pageCount
              }
            />
          )}
        </ProfileBook>
      </div>
    </>
  );
}
