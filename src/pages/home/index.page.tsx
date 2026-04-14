import { CaretRight, ChartLineUp } from "phosphor-react";
import {
  BookRating,
  BookRatingBody,
  BookRatingDescription,
  BookRatingUserContainer,
  BookRatingUser,
  BooksRatingsContainer,
  Container,
  HomeContainer,
  LastActivityBody,
  LastActivityContainer,
  LastActivityContent,
  LastActivityHeader,
  PopBookContainer,
  PopBookBody,
  PopBook,
  PopBookDescription,
  Rating,
  ContentContainer,
  BooksRatingsContainerHeader,
  LinkButton,
} from "./styles";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { capitalize } from "@/utils/capitalize";
import { PageHeader } from "@/components/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { HomeDataResponse } from "@/@types/query-types";
import Layout from "@/components/Layout";
import { formatBookName } from "@/utils/formatBookName";
import { StarRating } from "@/components/StarsRating";

import { NextSeo } from "next-seo";
import { Fallback } from "@/components/Fallback";
import { BooksStatusFlag } from "@/components/BooksStatusFlag";
import { Flame } from "lucide-react";
import { DescripitionText } from "@/components/DescriptionText";
import { BookCover } from "@/components/BookCover";
import Link from "next/link";
import { slugifyUserName } from "@/utils/slugifyUserName";
import { Avatar } from "@/components/Avatar";

export default function Home() {

  const session = useSession();

  const { data: homeData, isLoading: isLoadingHomeData } =
    useQuery<HomeDataResponse>({
      queryKey: ["home"],
      queryFn: async () => {
        const response = await api.get("/app/home");

        return response.data;
      },
      staleTime: 2 * 60 * 1000, // 2 minutos
    });

  const isSigned = session.status === "authenticated";

  const userId = session.data?.user.id;

  return (
    <>
      <NextSeo
        title="Home | BookWise"
        description="Veja as avaliações e os livros mais populares!"
      />
      <Layout>
        <Container>
          {!isLoadingHomeData ? (
            <>
              <PageHeader>
                <ChartLineUp />
                <h1>Início</h1>
              </PageHeader>
              <HomeContainer>
                <ContentContainer>
                  {isSigned && homeData?.lastUserActivity && (
                    <LastActivityContainer>
                      <LastActivityHeader>
                        <span>Sua última atividade</span>
                        <LinkButton
                          prefetch
                          href={`/profile/${slugifyUserName(session.data.user.name)}/${userId}?filter=allUserBooks`}
                        >
                          Ver todas
                          <CaretRight />
                        </LinkButton>
                      </LastActivityHeader>
                      <LastActivityBody
                        prefetch
                        href={`/profile/${slugifyUserName(session.data.user.name)}/${userId}?filter=allUserBooks`}
                      >
                        <BookCover
                          key={homeData.lastUserActivity.book.id}
                          width={108}
                          height={152}
                          sizes="108px"
                          priority
                          src={homeData.lastUserActivity.book.coverUrl}
                        />
                        <LastActivityContent>
                          <div>
                            <div>
                              <span>
                                {capitalize(
                                  formatDistanceToNow(
                                    homeData.lastUserActivity.updatedAt,
                                    { locale: ptBR, addSuffix: true },
                                  ),
                                )}
                              </span>
                              <span>
                                {typeof homeData.lastUserActivity == "object" &&
                                "rate" in homeData.lastUserActivity ? (
                                  <StarRating
                                    param={homeData.lastUserActivity.rate}
                                  />
                                ) : (
                                  <BooksStatusFlag
                                    status={homeData.lastUserActivity.status}
                                  />
                                )}
                              </span>
                            </div>
                            <div>
                              <h2>{homeData.lastUserActivity.book.title}</h2>
                              <span>
                                {homeData.lastUserActivity.book.author}
                              </span>
                            </div>
                          </div>
                          {typeof homeData.lastUserActivity == "object" &&
                          "review" in homeData.lastUserActivity ? (
                            <DescripitionText
                              description={homeData.lastUserActivity.review}
                            />
                          ) : null}
                        </LastActivityContent>
                      </LastActivityBody>
                    </LastActivityContainer>
                  )}

                  <BooksRatingsContainer>
                    <BooksRatingsContainerHeader>
                      Avaliações mais recentes
                    </BooksRatingsContainerHeader>

                    {homeData &&
                      homeData.recentRatings &&
                      homeData.recentRatings.map((rating) => {
                        return (
                          <BookRating key={rating.id}>
                            <BookRatingUserContainer>
                              <BookRatingUser>
                                <Link
                                  prefetch
                                  href={`/profile/${slugifyUserName(rating.user.name)}/${rating.user.id}?filter=allUserBooks`}
                                >
                                  <Avatar
                                    width={40}
                                    height={40}
                                    userName={rating.user.name}
                                    src={rating.user.avatarUrl}
                                  />
                                </Link>
                                <span>
                                  <span>{rating.user.name}</span>
                                  <span>
                                    {capitalize(
                                      formatDistanceToNow(rating.createdAt, {
                                        locale: ptBR,
                                        addSuffix: true,
                                      }),
                                    )}
                                  </span>
                                </span>
                              </BookRatingUser>
                              <Rating>
                                <StarRating param={rating.rate} />
                              </Rating>
                            </BookRatingUserContainer>
                            <BookRatingBody>
                              <BookCover
                                key={rating.id}
                                width={108}
                                height={152}
                                sizes="108px"
                                priority
                                src={rating.book.coverUrl}
                              />
                              <BookRatingDescription>
                                <span>
                                  <h2>{rating.book.title}</h2>
                                  <span>{rating.book.author}</span>
                                </span>
                                <DescripitionText description={rating.review} />
                              </BookRatingDescription>
                            </BookRatingBody>
                          </BookRating>
                        );
                      })}
                  </BooksRatingsContainer>
                </ContentContainer>

                <PopBookContainer>
                  <span>
                    <span>
                      Livros em alta
                      <Flame />
                    </span>
                    <LinkButton prefetch href={"/explore"}>
                      Ver todos
                      <CaretRight weight="bold" />
                    </LinkButton>
                  </span>
                  <PopBookBody>
                    {homeData &&
                      homeData.popularBooks &&
                      homeData.popularBooks.map((book) => {
                        return (
                          <PopBook key={book.id}>
                            <BookCover
                              key={book.id}
                              width={64}
                              height={94}
                              src={book.coverUrl}
                              priority
                              sizes="64px"
                            />
                            <PopBookDescription>
                              <span>
                                <h2>{formatBookName(book.title)}</h2>
                                <span>{book.author}</span>
                              </span>

                              <StarRating param={book.avgRating} />
                            </PopBookDescription>
                          </PopBook>
                        );
                      })}
                  </PopBookBody>
                </PopBookContainer>
              </HomeContainer>
            </>
          ) : (
            <Fallback />
          )}
        </Container>
      </Layout>
    </>
  );
}
