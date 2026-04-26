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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { HomeDataResponse, ProfileResponse } from "@/@types/query-types";
import Layout from "@/components/Layout";
import { formatBookName } from "@/utils/formatBookName";
import { StarRating } from "@/components/StarsRating";

import { NextSeo } from "next-seo";
import { Fallback } from "@/components/Fallback";
import { BooksStatusFlag } from "@/components/BooksStatusFlag";
import { Flame, PlusCircle, X } from "lucide-react";
import { DescripitionText } from "@/components/DescriptionText";
import { BookCover } from "@/components/BookCover";
import Link from "next/link";
import { slugifyUserName } from "@/utils/slugifyUserName";
import { Avatar } from "@/components/Avatar";
import { useAuth } from "@/components/AuthContext";
import { Modal } from "@/components/Modal";
import { CloseButton } from "../explore/components/BookDetails/styles";
import { AuthModal } from "@/components/AuthModal";
import { useEffect, useRef, useState } from "react";
import { demoProfileData } from "@/mocks/profile";
import { HomeBook } from "./components/HomeBook";

export default function Home() {
  const queryClient = useQueryClient();

  const { demoUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const loginModalRef = useRef<HTMLDivElement>(null);

  const [modalDescripion, setModalDescription] = useState('')

  const session = useSession();

  const { data: homeData, isLoading: isLoadingHomeData } =
    useQuery<HomeDataResponse>({
      queryKey: ["home"],
      queryFn: async () => {
        const response = await api.get("/app/home");

        return response.data;
      },

      staleTime: demoUser?.isDemo ? Infinity : 2 * 60 * 1000, // 2 minutos
    });

  const isSigned = session.status === "authenticated";

  const userId = session.data?.user.id ?? demoUser?.id;
  const userName = session.data?.user.name ?? demoUser?.name;

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleClickOutside(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

    if (
      isModalOpen &&
      loginModalRef.current &&
      !loginModalRef.current.contains(target)
    ) {
      return setIsModalOpen(false);
    }
  }

  function handleEsc(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && isModalOpen) {
      return setIsModalOpen(false);
    }
  }

  function handleOpenLoginModal(description: string){
    setModalDescription(description)
    setIsModalOpen(true)
  }

  const hasDemoUserInteracted = queryClient.getQueryData([
    "demo-user-interacted",
  ]);

  const demofallbackActivity = demoProfileData.allUserBooks[0];

  const lastUserActivity =
    demoUser?.isDemo && !hasDemoUserInteracted
      ? demofallbackActivity
      : homeData?.lastUserActivity;

  useEffect(() => {
    if (isModalOpen) {
      loginModalRef.current?.focus();
    }
  }, [isModalOpen]);

  return (
    <>
      <NextSeo
        title="Home | BookWise"
        description="Veja as avaliações e os livros mais populares!"
      />
      <Layout>
        {isModalOpen && (
          <Modal
            ref={loginModalRef}
            onPointerDown={(e) => handleClickOutside(e)}
            onKeyDown={handleEsc}
          >
            <CloseButton type="button" onClick={() => setIsModalOpen(false)}>
              <X />
            </CloseButton>
            <AuthModal
              handleCloseModal={handleCloseModal}
              description={modalDescripion}
            />
          </Modal>
        )}

        <Container>
          {!isLoadingHomeData ? (
            <>
              <PageHeader>
                <ChartLineUp />
                <h1>Início</h1>
              </PageHeader>
              <HomeContainer>
                <ContentContainer>
                  {(isSigned || demoUser?.isDemo) && lastUserActivity && (
                    <LastActivityContainer>
                      <LastActivityHeader>
                        <span>Sua última atividade</span>
                        <LinkButton
                          prefetch
                          href={`/profile/${slugifyUserName(userName!)}/${userId}?filter=allUserBooks`}
                        >
                          Ver todas
                          <CaretRight />
                        </LinkButton>
                      </LastActivityHeader>
                      <LastActivityBody
                        prefetch
                        href={`/profile/${slugifyUserName(userName!)}/${userId}?filter=allUserBooks`}
                      >
                        <BookCover
                          key={lastUserActivity.book.id}
                          width={108}
                          height={152}
                          sizes="108px"
                          priority
                          src={lastUserActivity.book.coverUrl}
                        />
                        <LastActivityContent>
                          <div>
                            <div>
                              <span>
                                {capitalize(
                                  formatDistanceToNow(
                                    lastUserActivity.updatedAt,
                                    { locale: ptBR, addSuffix: true },
                                  ),
                                )}
                              </span>
                              <span>
                                {typeof lastUserActivity == "object" &&
                                "rate" in lastUserActivity ? (
                                  <StarRating showRate param={lastUserActivity.rate} />
                                ) : (
                                  <BooksStatusFlag
                                    status={lastUserActivity.status}
                                  />
                                )}
                              </span>
                            </div>
                            <div>
                              <h2>{lastUserActivity.book.title}</h2>
                              <span>{lastUserActivity.book.author}</span>
                            </div>
                          </div>
                          {typeof lastUserActivity == "object" &&
                          "review" in lastUserActivity ? (
                            <DescripitionText
                              description={lastUserActivity.review}
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
                                {isSigned || demoUser?.isDemo ? (
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
                                    onClick={() => handleOpenLoginModal('Faça login para ver perfis de outros usuários')}
                                  />
                                )}
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
                                <StarRating showRate param={rating.rate} />
                            </BookRatingUserContainer>
                            <BookRatingBody>
                              <HomeBook
                                handleOpenModal={handleOpenLoginModal}
                                homeBook={rating.book}
                              >
                                <BookCover
                                  key={rating.id}
                                  width={108}
                                  height={152}
                                  sizes="108px"
                                  priority
                                  src={rating.book.coverUrl}
                                />
                              </HomeBook>
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
                    <LinkButton prefetch href={"/explore?category=Fiction"}>
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
                            <HomeBook handleOpenModal={handleOpenLoginModal} homeBook={book}>
                              <BookCover
                                key={book.id}
                                width={64}
                                height={94}
                                src={book.coverUrl}
                                priority
                                sizes="64px"
                              />
                            </HomeBook>
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
