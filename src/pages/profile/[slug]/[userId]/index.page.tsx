import { useCallback, useEffect, useId, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  ProfileButton,
  ProfileMainContainer,
  ProfileForm,
  ProfileInput,
  UserSeparator,
  UserStats,
  UserStatsContainer,
  UserContainer,
  UserProfile,
  Container,
  ProfileContainer,
  ProfileBooksContainer,
  ProfileBookFallback,
  ProfileCategoriesContainer,
  ProfileCategory,
} from "../../styles"
import {
  BookmarkSimple,
  BookmarksSimple,
  BookOpen,
  Books,
  MagnifyingGlass,
  User,
  UserList,
} from "phosphor-react"
import { getYear } from "date-fns"
import { PageHeader } from "@/components/PageHeader"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { useSession } from "next-auth/react"
import Layout from "@/components/Layout"
import {
  ProfileResponse,
  RatingProps,
  UserBookProps,
  UserBookReorderProps,
} from "@/@types/query-types"
import { formatCategories } from "@/utils/formatCategories"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { Fallback } from "@/components/Fallback"
import { ProfileBookCard } from "../../components/ProfileBookCard"
import { BookAlert, Bookmark, Heart, StarIcon } from "lucide-react"
import Link from "next/link"
import { DragHandleProps } from "../../components/SortableItem"
import { SortableBooksList } from "../../components/SortableBooksList"
import { slugifyUserName } from "@/utils/slugifyUserName"
import { Avatar } from "@/components/Avatar"
import { useAuth } from "@/components/AuthContext"
import { demoProfileData } from "@/mocks/profile"

const profileFormSchema = z.object({
  searchBook: z.string().min(1),
})

type ProfileFormData = z.infer<typeof profileFormSchema>

type MostReadCategory = {
  categoryName: string
  count: number
}

export type Categories = {
  allUserBooks: {
    items: UserBookProps[]
    categoryName: "Sua estante" | "Estante"
    iconColor: "ALL_USER_BOOKS"
  }
  userRatings: {
    items: RatingProps[]
    categoryName: "Avaliações"
    iconColor: "USER_RATINGS"
  }
  currentlyReadingBooks: {
    items: UserBookProps[]
    categoryName: "Lendo"
    iconColor: "READING"
  }
  wantToReadBooks: {
    items: UserBookProps[]
    categoryName: "Quero ler"
    iconColor: "WANT_TO_READ"
  }
  finishedBooks: {
    items: UserBookProps[]
    categoryName: "Lidos"
    iconColor: "FINISHED"
  }
  favoriteBooks: {
    items: UserBookProps[]
    categoryName: "Favoritos"
    iconColor: "FAVORITES"
  }
  abandonedBooks: {
    items: UserBookProps[]
    categoryName: "Abandonados"
    iconColor: "ABANDONED"
  }
}

export default function Profile() {
  const queryClient = useQueryClient()

  const { demoUser } = useAuth()

  const session = useSession()

  const isSigned = session.status === "authenticated"

  const isDemoMode = demoUser?.isDemo ?? false

  const router = useRouter()

  const [orderedBooks, setOrderedBooks] = useState<UserBookProps[]>([])

  const { register, handleSubmit, setFocus, reset, watch } =
    useForm<ProfileFormData>({
      defaultValues: {
        searchBook: "",
      },
    })

  const profileFilter =
    typeof router.query.filter === "string" ? router.query.filter : ""

  function onSubmit() {
    reset()
    setFocus("searchBook")
  }

  async function handlePossibleRedirect() {
    await router.push("/")
  }

  const userId = router.query.userId

  const { data: profileData, isLoading: isLoadingProfile } =
    useQuery<ProfileResponse>({
      queryKey: ["profile", userId],
      queryFn: async () => {
        if (!demoUser?.isDemo || userId !== demoUser?.id) {
          const response = await api.get(`/app/profile/${userId}`)
          return response.data
        }

        const cachedProfile = queryClient.getQueryData<ProfileResponse>([
          "profile",
          userId,
        ])

        if (cachedProfile) {
          return cachedProfile
        }

        return demoProfileData
      },
      enabled: !!userId && (isSigned || isDemoMode),
      staleTime: Infinity,
      retry: true,
      retryOnMount: true,
    })

  const userName = profileData?.userInfo?.name ?? demoUser?.name
  const slugedUserName = slugifyUserName(userName ?? demoUser?.name ?? "user")
  const avatarUrl = profileData?.userInfo?.avatarUrl ?? demoUser?.avatarUrl
  const createdAt = profileData?.userInfo?.createdAt ?? new Date().toString()

  const isLoggedUserProfile =
    session.data?.user.id === userId || demoUser?.id === userId

  const { mutate: updateUserBookOrder } = useMutation({
    mutationFn: async ({ userBookList, listType }: UserBookReorderProps) => {
      const payload = userBookList.map((book, index) => ({
        id: book.id,
        position: index,
      }))

      if (!demoUser?.isDemo) {
        return await api.patch(`/app/user-books/reorder/${userId}`, {
          userBookList: payload,
          listType,
        })
      }

      return
    },
    onMutate: ({ userBookList, listType }) => {
      queryClient.setQueryData<ProfileResponse>(
        ["profile", userId],
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            wantToReadBooks:
              listType === "wantToReadBooks"
                ? userBookList
                : oldData.wantToReadBooks,
            favoriteBooks:
              listType === "favoriteBooks"
                ? userBookList
                : oldData.favoriteBooks,
          }
        },
      )
    },
    mutationKey: ["updateUserBookOrder"],
    onSuccess: () => {
      if (!demoUser?.isDemo) {
        const isStillMutating =
          queryClient.isMutating({
            mutationKey: ["updateUserBookOrder"],
          }) - 1

        if (isStillMutating === 0) {
          queryClient.invalidateQueries({
            queryKey: ["profile", userId],
          })
        }
      }
    },
  })

  function handleProfileCategories(categoryName: keyof Categories) {
    router.replace({
      pathname: `/profile/${slugedUserName}/${userId}`,
      query: { filter: categoryName },
    })
  }
  const renderStaticBook = useCallback(
    (b: RatingProps | UserBookProps) => {
      if ("rate" in b) {
        return (
          <ProfileBookCard
            isLoggedUserProfile={isLoggedUserProfile}
            key={b.id}
            rating={b}
          />
        )
      }

      return (
        <ProfileBookCard
          isLoggedUserProfile={isLoggedUserProfile}
          key={b.id}
          userBook={b}
          isAllUserBooks={profileFilter === "allUserBooks"}
        />
      )
    },
    [profileFilter, isLoggedUserProfile],
  )

  const renderSortableBook = useCallback(
    (book: UserBookProps, dragHandle?: DragHandleProps, dragging?: boolean) => {
      return (
        <ProfileBookCard
          isLoggedUserProfile={isLoggedUserProfile}
          key={book.id}
          userBook={book}
          dragHandle={dragHandle}
          dragging={dragging}
          isFavoriteList={profileFilter === "favoriteBooks"}
        />
      )
    },
    [profileFilter, isLoggedUserProfile],
  )

  function handleReorder(reorderedBooks: UserBookProps[]) {
    const updated = reorderedBooks.map((book, index) => ({
      ...book,

      favoritePosition:
        profileFilter === "favoriteBooks" ? index : book.favoritePosition,

      wantToReadPosition:
        profileFilter === "wantToReadBooks" ? index : book.wantToReadPosition,
    }))

    setOrderedBooks(updated)

    const listType =
      profileFilter === "favoriteBooks" ? "favoriteBooks" : "wantToReadBooks"

    updateUserBookOrder({ userBookList: updated, listType: listType })
  }

  const isSortableList =
    profileFilter.includes("favoriteBooks") ||
    profileFilter.includes("wantToReadBooks")

  const userRatings = useMemo(() => {
    return profileData?.userRatings ?? []
  }, [profileData])
  const allUserBooks = useMemo(() => {
    return profileData?.allUserBooks ?? []
  }, [profileData])
  const currentlyReadingBooks = useMemo(() => {
    return profileData?.currentlyReadingBooks ?? []
  }, [profileData])
  const wantToReadBooks = useMemo(() => {
    return profileData?.wantToReadBooks ?? []
  }, [profileData])
  const finishedBooks = useMemo(() => {
    return profileData?.finishedBooks ?? []
  }, [profileData])
  const favoriteBooks = useMemo(() => {
    return profileData?.favoriteBooks ?? []
  }, [profileData])
  const abandonedBooks = useMemo(() => {
    return profileData?.abandonedBooks ?? []
  }, [profileData])

  const categories: Categories = useMemo(
    () => ({
      allUserBooks: {
        items: allUserBooks,
        categoryName: isLoggedUserProfile ? "Sua estante" : "Estante",
        iconColor: "ALL_USER_BOOKS",
      },
      userRatings: {
        items: userRatings,
        categoryName: "Avaliações",
        iconColor: "USER_RATINGS",
      },
      currentlyReadingBooks: {
        items: currentlyReadingBooks,
        categoryName: "Lendo",
        iconColor: "READING",
      },
      wantToReadBooks: {
        items: wantToReadBooks,
        categoryName: "Quero ler",
        iconColor: "WANT_TO_READ",
      },
      finishedBooks: {
        items: finishedBooks,
        categoryName: "Lidos",
        iconColor: "FINISHED",
      },
      favoriteBooks: {
        items: favoriteBooks,
        categoryName: "Favoritos",
        iconColor: "FAVORITES",
      },
      abandonedBooks: {
        items: abandonedBooks,
        categoryName: "Abandonados",
        iconColor: "ABANDONED",
      },
    }),
    [profileData],
  )

  const searchValue = watch("searchBook")

  const booksByInput = useMemo(() => {
    const books = categories[profileFilter as keyof Categories]?.items ?? []

    if (!searchValue) return books

    return books.filter((userBook) =>
      userBook.book.title
        .toLowerCase()
        .includes(searchValue.toLowerCase().trim()),
    )
  }, [profileFilter, categories, searchValue])

  const userTotalPages = useMemo(() => {
    return allUserBooks.reduce((acc, ub) => {
      return acc + (ub?.currentPage ?? 0)
    }, 0)
  }, [profileData])

  const userTotalAuthorsList = useMemo(() => {
    return finishedBooks
      .map((userBook) => {
        const authorsList = userBook.book.author.split(",")

        return authorsList
      })
      .reduce((acc: string[], current): string[] => {
        current.map((author) => {
          if (acc.includes(author)) {
            return
          } else {
            acc.push(author)
          }
        })

        return acc
      }, [])
  }, [profileData?.allUserBooks])

  const mostReadCategories = useMemo(() => {
    return finishedBooks
      .reduce((acc: MostReadCategory[], current): MostReadCategory[] => {
        current.book.categories.split(",").map((category) => {
          if (acc.some((item) => item.categoryName === category)) {
            const index = acc.findIndex(
              (item) => item.categoryName === category,
            )

            acc[index].count += 1
          } else {
            acc.push({
              categoryName: category,
              count: 1,
            })
          }
        })

        return acc
      }, [])
      .reduce((acc: MostReadCategory[], current, index): MostReadCategory[] => {
        if (index !== 0) {
          if (acc.every((category) => category.count < current.count)) {
            acc = []

            acc.push(current)
          } else if (
            acc.every((category) => category.count === current.count)
          ) {
            acc.push(current)
          }
        } else {
          acc.push(current)
        }

        return acc
      }, [])
  }, [profileData])

  useEffect(() => {
    if (!router.isReady) return

    const hasFilter =
      typeof router.query.filter === "string" && router.query.filter.length > 0

    if (!hasFilter && slugedUserName) {
      router.replace({
        pathname: `/profile/${slugedUserName}/${userId}`,
        query: { filter: "allUserBooks" },
      })
    }
  }, [router.isReady, profileFilter, userId, userName])

  useEffect(() => {
    if (profileData && profileFilter && isSortableList) {
      const localStateBooks = categories[profileFilter as keyof Categories]
        ?.items as UserBookProps[]

      setOrderedBooks(localStateBooks)
    }
  }, [profileData, profileFilter])

  if (session.status === "unauthenticated" && !demoUser?.isDemo) {
    handlePossibleRedirect()
  }

  return (
    <>
      <NextSeo
        title="Profile | BookWise"
        description="Veja suas leituras e estatísticas pessoais!"
      />
      <Layout>
        <Container>
          {isLoadingProfile ? (
            <Fallback />
          ) : (
            <>
              <ProfileContainer>
                <PageHeader>
                  <User />
                  <h1>Perfil</h1>
                </PageHeader>
                <ProfileCategoriesContainer>
                  {(Object.keys(categories) as (keyof Categories)[]).map(
                    (categoryKey) => (
                      <ProfileCategory
                        status={categories[categoryKey].iconColor}
                        onClick={() => handleProfileCategories(categoryKey)}
                        isActive={profileFilter === categoryKey}
                        key={categoryKey}
                      >
                        <span>
                          {categories[categoryKey].categoryName ===
                            "Avaliações" && <StarIcon />}
                          {categories[categoryKey].categoryName ===
                            "Favoritos" && <Heart />}
                          {categories[categoryKey].categoryName ===
                            "Sua estante" && <BookmarksSimple size={24} />}
                          {categories[categoryKey].categoryName !==
                            "Avaliações" &&
                            categories[categoryKey].categoryName !==
                              "Favoritos" &&
                            categories[categoryKey].categoryName !==
                              "Sua estante" && <Bookmark />}
                          <span>{categories[categoryKey].categoryName}</span>
                        </span>
                        <span>
                          {categories[categoryKey].items?.length || 0}
                        </span>
                      </ProfileCategory>
                    ),
                  )}
                </ProfileCategoriesContainer>
                <ProfileMainContainer>
                  <PageHeader>
                    <User />
                    <h1>Perfil</h1>
                  </PageHeader>
                  <div>
                    {!isSortableList && (
                      <ProfileForm onSubmit={handleSubmit(onSubmit)}>
                        <label>
                          <ProfileInput
                            {...register("searchBook")}
                            placeholder="Buscar livro"
                          />
                        </label>
                        <ProfileButton>
                          <MagnifyingGlass />
                        </ProfileButton>
                      </ProfileForm>
                    )}
                  </div>

                  <ProfileBooksContainer>
                    {categories[profileFilter as keyof Categories]?.items
                      .length > 0 ? (
                      isSortableList ? (
                        <SortableBooksList
                          books={orderedBooks}
                          renderBook={renderSortableBook}
                          onReorder={handleReorder}
                        />
                      ) : (
                        booksByInput.map((book) => renderStaticBook(book))
                      )
                    ) : (
                      <ProfileBookFallback>
                        <p>
                          {profileFilter === "allUserBooks" &&
                            "Você ainda não adicionou livros a sua estante..."}
                          {profileFilter === "userRatings" &&
                            "Nenhuma avaliação realizada..."}
                          {profileFilter === "currentlyReadingBooks" &&
                            "Nenhum livro em progresso de leitura..."}
                          {profileFilter === "wantToReadBooks" &&
                            "Nenhum livro marcado como 'Quero ler'..."}
                          {profileFilter === "finishedBooks" &&
                            "Nenhum livro finalizado..."}
                          {profileFilter === "favoriteBooks" &&
                            "Nenhum livro favoritado..."}
                          {profileFilter === "abandonedBooks" &&
                            "Nenhum livro abandonado..."}
                        </p>
                        <Link href={"/explore"}>
                          <BookAlert />
                        </Link>
                      </ProfileBookFallback>
                    )}
                  </ProfileBooksContainer>
                </ProfileMainContainer>

                <UserContainer>
                  <UserProfile>
                    {avatarUrl && (
                      <Avatar
                        width={72}
                        height={72}
                        userName={userName ?? "User"}
                        src={avatarUrl}
                        borderWidth="md"
                      />
                    )}

                    <span>
                      <h2>{userName}</h2>
                      <span>
                        membro desde {getYear(createdAt ? createdAt : "")}
                      </span>
                    </span>
                  </UserProfile>

                  <UserSeparator />

                  <UserStatsContainer>
                    <UserStats>
                      <BookOpen />
                      <span>
                        <p>{userTotalPages}</p>
                        <span>Páginas lidas</span>
                      </span>
                    </UserStats>

                    <UserStats>
                      <Books />
                      <span>
                        <p>{userRatings.length}</p>
                        <span>Livros avaliados</span>
                      </span>
                    </UserStats>

                    <UserStats>
                      <UserList />
                      <span>
                        <p>{userTotalAuthorsList.length}</p>
                        <span>Autores lidos</span>
                      </span>
                    </UserStats>

                    <UserStats category>
                      <BookmarkSimple />
                      <span>
                        <p>
                          {mostReadCategories.length > 0
                            ? mostReadCategories.map((c, i) => {
                                return formatCategories(c.categoryName, i)
                              })
                            : "Nenhuma categoria lida..."}
                        </p>
                        <span>Categoria(s) mais lida(s)</span>
                      </span>
                    </UserStats>
                  </UserStatsContainer>
                </UserContainer>
              </ProfileContainer>
            </>
          )}
        </Container>
      </Layout>
    </>
  )
}
