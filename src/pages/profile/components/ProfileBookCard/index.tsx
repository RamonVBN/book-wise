import {
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
import { formatDistanceToNow } from "date-fns";
import { capitalize } from "@/utils/capitalize";
import Image from "next/image";
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
import { ReadingStatusSelect } from "@/pages/explore/components/ReadingStatusSelect";
import { FavoriteButton } from "@/pages/explore/components/FavoriteButton";
import { ReadingProgress } from "../ReadingProgressBar";
import { BookmarkPlus, BookPlus, BookUp2 } from "lucide-react";
import { ReadingProgressUpdater } from "../ReadingProgressUpdater";
import { Categories } from "../../index.page";
import { ExploreBooksStatusFlag } from "@/pages/explore/components/ExploreBooksStatusFlag";
import { useSession } from "next-auth/react";

interface ProfileBookCardProps {
  userBook?: UserBookProps;
  rating?: RatingProps;
  isFavoriteList?: boolean;
  isAllUserBooks?: boolean;
}

export function ProfileBookCard({
  userBook,
  isFavoriteList,
  rating,
  isAllUserBooks
}: ProfileBookCardProps) {

  const queryClient = useQueryClient();

  const session = useSession()

  const [isUserRatingFormOpen, setisUserRatingFormOpen] = useState(false);

  const [isReadingProgressUpdaterOpen, setIsReadingProgressUpdaterOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const ratingId = rating?.id;
  const userId = rating?.user.id ?? userBook?.userId;
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
  }

  function handleDelete() {
    if (ratingId) {
      deleteRatingMutation(ratingId);
    } else {
      deleteUserBookMutation();
    }

    setIsModalOpen(false);
  }

  function handleSelectOpenChange(isOpen: boolean) {
    setIsSelectOpen(!isOpen);
  }

  function updateReadingProgress(newPage: number) {
    
    updateUserBookMutation({
      currentPage: newPage,
    });
  }

  const { mutate: updateRatingMutation } = useMutation({
    mutationFn: async (data: UserRatingSubmitData) => {
      const newRate = data.rate;
      const newReview = data.review;
      return await api.put(`/app/ratings/users/${rating?.id}`, {
        newReview,
        newRate,
      });
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["profile", userId] });

      const previousProfileData = queryClient.getQueryData(["profile", userId]);

      queryClient.setQueryData<ProfileResponse>(
        ["profile", userId],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            userRatings: oldData.userRatings.map((r) => {
              if (r.id === ratingId) {
                return {
                  ...r,
                  review: data.review,
                  rate: data.rate,
                };
              }

              return r;
            }),
          };
        },
      );

      return { previousProfileData };
    },
    onSuccess: () => {
      setisUserRatingFormOpen(false);
    },
    onError: (err, __, context) => {
      console.log(err);
      queryClient.setQueryData(
        ["profile", userId],
        context?.previousProfileData,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });

  const { mutate: createRatingMutation } = useMutation({
      mutationFn: async (data: UserRatingSubmitData) => {
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
      onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["profile", userId] });

      const previousProfileData = queryClient.getQueryData(["profile", userId]);

      queryClient.setQueryData<ProfileResponse>(
        ["profile", userId],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            userRatings: oldData.userRatings.map((r) => {
              if (r.id === ratingId) {
                return {
                  ...r,
                  review: data.review,
                  rate: data.rate,
                };
              }

              return r;
            }),
          };
        },
      );

      return { previousProfileData };
    },
    onSuccess: () => {
      setisUserRatingFormOpen(false);
    },
    onError: (err, __, context) => {
      console.log(err);
      queryClient.setQueryData(
        ["profile", userId],
        context?.previousProfileData,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
    });

  const { mutate: deleteRatingMutation } = useMutation({
    mutationFn: async (ratingId: string) => {
      return await api.delete(`/app/ratings/users/${ratingId}`);
    },
    onMutate: async (ratingId) => {
      await queryClient.cancelQueries({ queryKey: ["profile", userId] });

      const previousProfileData = queryClient.getQueryData(["profile", userId]);

      queryClient.setQueryData<ProfileResponse>(
        ["profile", userId],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            userRatings: oldData.userRatings.filter((r) => r.id !== ratingId),
          };
        },
      );

      return { previousProfileData };
    },
    onError: (err, __, context) => {
      console.log(err);
      queryClient.setQueryData(
        ["profile", userId],
        context?.previousProfileData,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });

  const {
    mutate: updateUserBookMutation,
    isPending: isUpdatingReadingStatus,
  } = useMutation({
    mutationFn: async ({
      status,
      isFavorite,
      currentPage
    }: {
      status?: ReadingStatus;
      isFavorite?: boolean;
      currentPage?: number;
    }) => {
      return await api.patch("/app/userBook", {
        readStatus: status,
        isFavorite: isFavorite,
        currentPage: currentPage,
        bookId: book?.id,
        title: book?.title,
        author: book?.author,
        coverUrl: book?.coverUrl,
        pageCount: book?.pageCount,
        categories: book?.categories,
      });
    },
    onMutate: async ({ status, isFavorite, currentPage }) => {
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
            .map((ub) => {
              if (ub.id === userBook?.id) {
                return {
                  ...ub,
                  status: status ?? ub.status,
                  isFavorite: isFavorite ?? ub.isFavorite,
                  currentPage: currentPage ?? ub.currentPage,
                };
              }
              return ub;
            });

          const currentlyReadingBooks = updatedProfileData.filter(
            (ub) => ub.status === "READING",
          );
          const wantToReadBooks = updatedProfileData.filter(
            (ub) => ub.status === "WANT_TO_READ",
          );
          const finishedBooks = updatedProfileData.filter(
            (ub) => ub.status === "FINISHED",
          );
          const abandonedBooks = updatedProfileData.filter(
            (ub) => ub.status === "ABANDONED",
          );
          const favoriteBooks = updatedProfileData.filter(
            (ub) => ub.isFavorite,
          );

          return {
            ...oldData,
            currentlyReadingBooks,
            wantToReadBooks,
            finishedBooks,
            abandonedBooks,
            favoriteBooks,
          };
        },
      );

      return { previousProfileData };
    },
    onError: (err, __, context) => {
      console.log(err);
      queryClient.setQueryData(
        ["profile", userId],
        context?.previousProfileData,
      );
    },
    onSuccess: () => {
      console.log("UserBook updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });

  const { mutate: deleteUserBookMutation } = useMutation({
    mutationFn: async () => {
      return await api.delete(`/app/userBook/${userBook?.id}`);
    },
    onMutate: async () => {
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
            .filter((ub) => ub.id !== userBook?.id);

          const currentlyReadingBooks = updatedProfileData.filter(
            (ub) => ub.status === "READING",
          );
          const wantToReadBooks = updatedProfileData.filter(
            (ub) => ub.status === "WANT_TO_READ",
          );
          const finishedBooks = updatedProfileData.filter(
            (ub) => ub.status === "FINISHED",
          );
          const abandonedBooks = updatedProfileData.filter(
            (ub) => ub.status === "ABANDONED",
          );
          const favoriteBooks = updatedProfileData.filter(
            (ub) => ub.isFavorite,
          );

          return {
            ...oldData,
            currentlyReadingBooks,
            wantToReadBooks,
            finishedBooks,
            abandonedBooks,
            favoriteBooks,
          };
        },
      );

      return { previousProfileData };
    },
    onError: (err, __, context) => {
      console.log(err);
      queryClient.setQueryData(
        ["profile", userId],
        context?.previousProfileData,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
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
    updateUserBookMutation({status});
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
        {
          userBook && (
            <ProfileBookTime>
            {capitalize(
              formatDistanceToNow(userBook.updatedAt, {
                addSuffix: true,
                locale: ptBR,
              }),
            )}
          </ProfileBookTime>
          )
        }
        <ProfileBook>
          <div>
            <ProfileBookInfo>
              {book && (
                <Image width={98} height={134} src={book?.coverUrl} alt="" />
              )}
              <div>
                <span>
                  <h2>{book?.title}</h2>
                  <span>{book?.author}</span>
                </span>

                <span>
                  {rating && !isUserRatingFormOpen && (
                    <StarRating param={rating.rate} />
                  )}
                </span>
              </div>
            </ProfileBookInfo>

            <ProfileBookOptions>
              <div>

                {!isAllUserBooks && (rating || (userBook?.status === 'FINISHED' && !isFavoriteList)) && (
                  <ProfileBookButton
                  disabled={userBook?.rated}
                    onClick={() => setisUserRatingFormOpen(!isUserRatingFormOpen)}
                  >
                    {
                      rating && (
                        <Pencil/>
                      )
                    }

                    {
                      (userBook?.status === 'FINISHED' && !isFavoriteList) && (
                        
                        userBook.rated ? <Star weight="fill"/> : <Star/>
                      )
                    }
                  </ProfileBookButton>
                )}

                {!isAllUserBooks && (userBook && userBook.status === 'READING' && !isFavoriteList) && (
                  <ProfileBookButton
                    onClick={() =>
                      setIsReadingProgressUpdaterOpen(!isReadingProgressUpdaterOpen)
                    }
                  >
                    <BookmarkPlus/>
                  </ProfileBookButton>
                )}

                {(rating || isAllUserBooks) && (
                  <ProfileBookButton onClick={() => setIsModalOpen(true)}>
                    <Trash size={24} />
                  </ProfileBookButton>
                )}
                {
                  userBook && isAllUserBooks && (
                    <ExploreBooksStatusFlag status={userBook.status} />
                  )
                }

                {!isAllUserBooks && userBook && (isFavoriteList || userBook.status === 'FINISHED') && (
                  <FavoriteButton
                    disabled={isUpdatingReadingStatus}
                    isFavorite={userBook.isFavorite}
                    setIsFavorite={(isFavorite) =>
                      updateUserBookMutation({
                        isFavorite,
                        status: userBook.status,
                      })
                    }
                  />
                )}

                {!isAllUserBooks && (userBook && !isFavoriteList) && (
                  <ReadingStatusSelect
                    disabled={isUpdatingReadingStatus}
                    onChange={onSelectChange}
                    handleSelectOpenChange={handleSelectOpenChange}
                    isSelectOpen={isSelectOpen}
                    value={userBook.status}
                  />
                )}

              </div>
            </ProfileBookOptions>
          </div>

          <div>
            {!isAllUserBooks && userBook && userBook.status === "READING" && !isFavoriteList && (
                  <ReadingProgress currentPage={userBook.currentPage ? userBook.currentPage : 0} totalPages={userBook.book.pageCount} />
                )}
          </div>

          {rating && !isUserRatingFormOpen && <p>{rating.review}</p>}

          {(rating || userBook?.status === 'FINISHED') && isUserRatingFormOpen && (
            <UserRatingForm
              initialReview={rating?.review}
              initialRate={rating?.rate}
              profile={true}
              handleRatingSubmit={handleRatingSubmit}
              handleCloseUserRatingForm={handleCloseUserRatingForm}
            />
          )}

          {
            userBook?.status === 'READING' && isReadingProgressUpdaterOpen && (
              <ReadingProgressUpdater
                handleCloseReadingProgressUpdater={() => setIsReadingProgressUpdaterOpen(!isReadingProgressUpdaterOpen)}
                onUpdate={updateReadingProgress}
                currentPage={userBook.currentPage ? userBook.currentPage : 0}
                totalPages={userBook.book.pageCount}
              />
            )
          }

        </ProfileBook>
      </div>
    </>
  );
}
