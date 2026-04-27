import { BookPlus, PlusCircle } from "lucide-react";
import {
  AddBookOverlay,
  AddBookOverlayContainer,
  AddBookButton,
  AddBookButtonContainer,
} from "./styles";
import { ReactNode, useEffect, useRef, useState } from "react";
import { BooksStatusFlag } from "@/components/BooksStatusFlag";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReadingStatus } from "@/generated/prisma";
import { useAuth } from "@/components/AuthContext";
import {
  BooksQueryData,
  HomeDataResponse,
  HomePopBookProps,
  HomeRatingBookProps,
  HomeRatingProps,
  ProfileResponse,
  RatingBookProps,
  UserBookProps,
} from "@/@types/query-types";
import { compareAsc, compareDesc } from "date-fns";
import { useSession } from "next-auth/react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { toastMessages } from "@/lib/toast-messages";
import { AppTooltip } from "@/components/Tooltip";

type HomeBookProps = {
  children: ReactNode;
  homeBook: HomeRatingBookProps;
  handleOpenModal: (description: string) => void;
};

const status: ReadingStatus[] = [
  "READING",
  "WANT_TO_READ",
  "FINISHED",
  "ABANDONED",
];

export function HomeBook({
  children,
  homeBook,
  handleOpenModal,
}: HomeBookProps) {
  const session = useSession();

  const { demoUser } = useAuth();

  const queryClient = useQueryClient();

  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const optionsRef = useRef<HTMLDivElement>(null);

  const loggedUser = session.data?.user || demoUser;

  const loggedUserId = loggedUser?.id;

  const isRealUserSigned = session.status === "authenticated";

  const isDemoUserSigned = demoUser?.isDemo;

  const loggedUserCurrentBookStatus =
    isRealUserSigned || isDemoUserSigned
      ? homeBook.userBookInfo?.loggedUserCurrentBookStatus
      : undefined;

  const { mutate: updateUserBookMutation } = useMutation({
    mutationFn: async ({ status }: { status?: ReadingStatus }) => {
      if (demoUser?.isDemo) {
        return;
      }

      return await api.patch(`/app/user-books/${loggedUserId}`, {
        readStatus: status,
        bookId: homeBook?.id,
        title: homeBook?.title,
        author: homeBook?.author,
        coverUrl: homeBook?.coverUrl,
        pageCount: homeBook?.pageCount,
        categories: homeBook?.categories,
      });
    },
    mutationKey: ["updateUserBook"],
    onMutate: async ({ status }) => {
      await queryClient.cancelQueries({ queryKey: ["profile", loggedUserId] });

      toast.success(toastMessages.updateBook.success);

      const previousProfileData = queryClient.getQueryData([
        "profile",
        loggedUserId,
      ]);

      const userBookCacheId = crypto.randomUUID();

      let userBookExists = false;

      queryClient.setQueryData<ProfileResponse>(
        ["profile", loggedUserId],
        (oldData) => {
          const newUserBook: UserBookProps = {
            id: userBookCacheId,
            book: {
              ...homeBook!,
              id: homeBook!.id,
              title: homeBook!.title,
              author: homeBook!.author,
              categories: homeBook!.categories,
              pageCount: homeBook!.pageCount,
              coverUrl: homeBook!.coverUrl,
            },
            isFavorite: false,
            rated: false,
            status: status!,
            currentPage:
              status === "FINISHED" ? homeBook?.pageCount : undefined,
            updatedAt: new Date().toString(),
            user: loggedUser!,
            userId: loggedUserId!,
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

          userBookExists = oldData.abandonedBooks
            .concat(
              oldData.currentlyReadingBooks,
              oldData.finishedBooks,
              oldData.wantToReadBooks,
            )
            .some((ub) => ub.book.id === homeBook.id);

          if (userBookExists) {
            const updatedProfileData = oldData.abandonedBooks
              .concat(
                oldData.currentlyReadingBooks,
                oldData.finishedBooks,
                oldData.wantToReadBooks,
              )
              .map((ub) => {
                if (ub.book.id === homeBook.id) {
                  const newUpdatedAt = new Date();
                  return {
                    ...ub,
                    status: status ?? ub.status,
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

      queryClient.setQueriesData<BooksQueryData>(
        { queryKey: ["books"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((book) => {
                if (book.id !== homeBook.id) return book;

                return {
                  ...book,
                  userBookInfo: {
                    ...book.userBookInfo!,
                    status: status ?? book.userBookInfo!.status,
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
          loggedUserId,
        ]);

        const updatedUb = updatedProfileData?.allUserBooks[0];

        const updatedRecentRatings: HomeRatingProps[] =
          oldData.recentRatings.map((r) => {
            if (r.book?.id !== homeBook?.id) {
              return r;
            }

            const updatedUserBookInfo = {
              ...r.book.userBookInfo,
              loggedUserCurrentBookStatus:
                status ?? r.book.userBookInfo?.loggedUserCurrentBookStatus,
            };

            return {
              ...r,
              book: {
                ...r.book,
                userBookInfo: status
                  ? updatedUserBookInfo
                  : r.book.userBookInfo,
              },
            };
          });

        const updatedPopBooks: HomePopBookProps[] = oldData.popularBooks.map(
          (book) => {
            if (book.id !== homeBook.id) {
              return book;
            }

            const updatedUserBookInfo = {
              ...book.userBookInfo,
              loggedUserCurrentBookStatus:
                status ?? book.userBookInfo.loggedUserCurrentBookStatus,
            };

            return {
              ...book,
              userBookInfo: updatedUserBookInfo,
            };
          },
        );

        return {
          ...oldData,
          lastUserActivity: updatedUb ?? oldData.lastUserActivity,
          recentRatings: updatedRecentRatings,
          popularBooks: updatedPopBooks,
        };
      });

      return { previousProfileData };
    },
    onError: (err, __, context) => {
      toast.error(toastMessages.updateBook.error);
      console.log(err);
      queryClient.setQueryData(
        ["profile", loggedUserId],
        context?.previousProfileData,
      );
    },
    onSuccess: () => {
      if (!demoUser?.isDemo) {
        const isStillMutating =
          queryClient.isMutating({
            mutationKey: ["updateUserBook"],
          }) - 1;

        if (isStillMutating === 0) {
          queryClient.invalidateQueries({
            queryKey: ["profile", loggedUserId],
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

  function handleUpdateUserBook(status: ReadingStatus) {
    updateUserBookMutation({ status });
    setIsOptionsVisible(!isOptionsVisible);
    if (demoUser?.isDemo) {
      queryClient.setQueryData(["demo-user-interacted"], true);
    }
  }

  function handleClickOutside(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

    if (
      isOptionsVisible &&
      optionsRef.current &&
      !optionsRef.current.contains(target)
    ) {
      return setIsOptionsVisible(false);
    }
  }

  function handleEsc(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && isOptionsVisible) {
      return setIsOptionsVisible(false);
    }
  }

  function handleOpenOptions() {
    if (!isRealUserSigned && !isDemoUserSigned) {
      handleOpenModal("Faça login para começar a adicionar livros");
      return;
    }

    setIsOptionsVisible(!isOptionsVisible);
  }
  handleOpenOptions;

  useEffect(() => {
    if (isOptionsVisible) {
      optionsRef.current?.focus();
    }
  }, [isOptionsVisible]);

  return (
    <AddBookOverlayContainer
      onMouseLeave={() => setIsOptionsVisible(false)}
      onKeyDown={handleEsc}
      onPointerDown={handleClickOutside}
    >
      <AddBookOverlay>
        {isOptionsVisible ? (
          <AddBookButtonContainer tabIndex={-1} ref={optionsRef}>
            {status.map((s) => (
              <AppTooltip
                key={s}
                content={
                  s === "READING"
                    ? "Lendo"
                    : s === "WANT_TO_READ"
                      ? "Quero ler"
                      : s === "FINISHED"
                        ? "Lido"
                        : "Abandonado"
                }
              >
                <AddBookButton onClick={() => handleUpdateUserBook(s)}>
                  <BooksStatusFlag status={s} />
                </AddBookButton>
              </AppTooltip>
            ))}
          </AddBookButtonContainer>
        ) : (
          <AppTooltip
            content={
              loggedUserCurrentBookStatus
                ? "Atualizar livro"
                : "Adicionar livro"
            }
          >
            <AddBookButton onClick={handleOpenOptions}>
              {loggedUserCurrentBookStatus ? (
                <BooksStatusFlag status={loggedUserCurrentBookStatus} />
              ) : (
                <BookPlus />
              )}
            </AddBookButton>
          </AppTooltip>
        )}
      </AddBookOverlay>
      {children}
    </AddBookOverlayContainer>
  );
}
