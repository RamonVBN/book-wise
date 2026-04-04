import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
} from "./styles";
import {
  BookmarkSimple,
  BookOpen,
  Books,
  MagnifyingGlass,
  User,
  UserList,
} from "phosphor-react";
import { getYear, set } from "date-fns";
import { PageHeader } from "@/components/pageHeader";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import {
  ProfileResponse,
  RatingProps,
  UserBookProps,
} from "@/@types/query-types";
import { formatCategories } from "@/utils/formatCategories";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Fallback } from "@/components/Fallback";
import Image from "next/image";
import { ProfileBookCard } from "./components/ProfileBookCard";
import { CategoriesContainer, Category } from "@/components/Category/styles";
import { BookAlert } from "lucide-react";
import Link from "next/link";

const profileFormSchema = z.object({
  ratedBook: z.string().min(1),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

type MostReadCategory = {
  categoryName: string;
  count: number;
};

export type Categories = {
  'Sua estante': UserBookProps[];
  Avaliações: RatingProps[];
  Lidos: UserBookProps[];
  Favoritos: UserBookProps[];
  Abandonados: UserBookProps[];
  "Quero Ler": UserBookProps[];
  Lendo: UserBookProps[];
};

export default function Profile() {
  const session = useSession();

  const router = useRouter();

  const { register, handleSubmit, setFocus, reset, watch } =
    useForm<ProfileFormData>();

  const [profileCategory, setProfileCategory] =
    useState<keyof Categories>("Sua estante");

  function onSubmit() {
    reset();
    setFocus("ratedBook");
  }

  async function handlePossibleRedirect() {
    await router.push("/");
  }

  function handleProfileCategories(categoryName: keyof Categories) {
    setProfileCategory(categoryName);
  }

  const userId = session.data?.user.id;
  const userName = session.data?.user.name;
  const avatarUrl = session.data?.user.avatarUrl;
  const createdAt = session.data?.user.createdAt;

  const { data: profileData, isLoading: isLoadingRatings } =
    useQuery<ProfileResponse>({
      queryKey: ["profile", userId],
      queryFn: async () => {
        const response = await api.get(`/app/profile`);

        return response.data;
      },
      enabled: !!userId,
      staleTime: Infinity
    });


    const userRatings = useMemo(() => {
      return profileData?.userRatings ?? [];
    }, [profileData]);
    const allUserBooks = useMemo(() => {
      return profileData?.allUserBooks ?? [];
    }, [profileData]);
    const currentlyReadingBooks = useMemo(() => {
      return profileData?.currentlyReadingBooks ?? [];
    }, [profileData]);
    const wantToReadBooks = useMemo(() => {
      return profileData?.wantToReadBooks ?? [];
    }, [profileData]);
    const finishedBooks = useMemo(() => {
      return profileData?.finishedBooks ?? [];
    }, [profileData]);
    const favoriteBooks = useMemo(() => {
      return profileData?.favoriteBooks ?? [];
    }, [profileData]);
    const abandonedBooks = useMemo(() => {
      return profileData?.abandonedBooks ?? [];
    }, [profileData]);


  const categories: Categories = {
    'Sua estante': allUserBooks,
    Avaliações: userRatings,
    Lendo: currentlyReadingBooks,
    "Quero Ler": wantToReadBooks,
    Lidos: finishedBooks,
    Favoritos: favoriteBooks,
    Abandonados: abandonedBooks,
  };

  const booksByInput =
    categories[profileCategory]?.filter((userBook) =>
      userBook.book.title
        .toLowerCase()
        .trim()
        .includes(
          watch("ratedBook") ? watch("ratedBook").trim().toLowerCase() : "",
        ),
    ) ?? [];

  const userTotalPages = useMemo(() => {
    return allUserBooks.reduce((acc, ub) => {
      return acc + (ub?.currentPage ?? 0);
    }, 0);
  }, [profileData]);

  const userTotalAuthorsList = useMemo(() => {
    return finishedBooks
      .map((userBook) => {
        const authorsList = userBook.book.author.split(",");

        return authorsList;
      })
      .reduce((acc: string[], current): string[] => {
        current.map((author) => {
          if (acc.includes(author)) {
            return;
          } else {
            acc.push(author);
          }
        });

        return acc;
      }, []);
  }, [profileData?.allUserBooks]);

  const mostReadCategories = useMemo(() => {
    return finishedBooks
      .reduce((acc: MostReadCategory[], current): MostReadCategory[] => {
        current.book.categories.split(",").map((category) => {
          if (acc.some((item) => item.categoryName === category)) {
            const index = acc.findIndex(
              (item) => item.categoryName === category,
            );

            acc[index].count += 1;
          } else {
            acc.push({
              categoryName: category,
              count: 1,
            });
          }
        });

        return acc;
      }, [])
      .reduce((acc: MostReadCategory[], current, index): MostReadCategory[] => {
        if (index !== 0) {
          if (acc.every((category) => category.count < current.count)) {
            acc = [];

            acc.push(current);
          } else if (
            acc.every((category) => category.count === current.count)
          ) {
            acc.push(current);
          }
        } else {
          acc.push(current);
        }

        return acc;
      }, []);
  }, [profileData]);

  if (session.status === "unauthenticated") {
    handlePossibleRedirect();
  }

  return (
    <>
      <NextSeo
        title="Profile | BookWise"
        description="Veja suas leituras e estatísticas pessoais!"
      />
      <Layout>
        <Container>
          {isLoadingRatings ? (
            <Fallback />
          ) : (
            <>
              <PageHeader>
                <User />
                <h1>Perfil</h1>
              </PageHeader>
              
              <ProfileContainer>
                <ProfileMainContainer>
                  <div>
                    <ProfileForm onSubmit={handleSubmit(onSubmit)}>
                      <label>
                        <ProfileInput
                          {...register("ratedBook")}
                          placeholder="Buscar livro"
                        />
                      </label>
                      <ProfileButton>
                        <MagnifyingGlass />
                      </ProfileButton>
                    </ProfileForm>

                    <CategoriesContainer>
                      {(Object.keys(categories) as (keyof Categories)[]).map(
                        (categoryName) => (
                          <Category
                            onClick={() =>
                              handleProfileCategories(categoryName)
                            }
                            isActive={profileCategory === categoryName}
                            key={categoryName}
                          >
                            {categoryName} (
                            {categories[categoryName]?.length || 0})
                          </Category>
                        ),
                      )}
                    </CategoriesContainer>
                  </div>

                  <ProfileBooksContainer>
                    {allUserBooks.length > 0 ? booksByInput.map((b) => {
                      if (typeof b === "object" && "rate" in b) {
                        return <ProfileBookCard  key={b.id} rating={b} />;
                      } else {
                        return (
                          <ProfileBookCard
                            
                            isFavoriteList={profileCategory === "Favoritos"}
                            isAllUserBooks={profileCategory === "Sua estante"}
                            key={b.id}
                            userBook={b}
                          />
                        );
                      }
                    }) : (
                      <ProfileBookFallback>
                        <p>Você ainda não adicionou livros a sua estante...</p>
                          <Link href={'/explore'}>
                            <BookAlert/>
                          </Link>
                      </ProfileBookFallback>
                    )}
                  </ProfileBooksContainer>
                </ProfileMainContainer>

                <UserContainer>
                  <UserProfile>
                    {avatarUrl && (
                      <Image width={72} height={72} src={avatarUrl} alt="" />
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
                          {mostReadCategories.length > 0 ? mostReadCategories.map((category, i) => {
                            return formatCategories(category.categoryName, i);
                          }) : "Nenhuma categoria lida..."}
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
  );
}
