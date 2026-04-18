import { Binoculars, MagnifyingGlass } from "phosphor-react";

import {
  ExploreContainer,
  ExploreHeader,
  ExploreInput,
  ExploreFormButton,
  ExplorePageFallback,
  CategoriesContainer,
  Category,
} from "./styles.tsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/PageHeader/index.ts";
import { BookDetails } from "./components/BookDetails";
import { useInfiniteQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { BooksResponse } from "@/@types/query-types";
import { NextSeo } from "next-seo";
import { Fallback } from "@/components/Fallback";
import { useDebounce } from "@/hooks/useDebounce";
import { useInView } from "react-intersection-observer";
import { api } from "@/lib/axios";
import { ExploreBooksContainer } from "./components/ExploreBooks/style";
import BookCard from "./components/ExploreBooks";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import BackToTop from "./components/BackToTopButton/index.tsx";
import axios from "axios";
import { BookX } from "lucide-react";
import { useRouter } from "next/router";

const categories = [
  { queryName: "Fiction", name: "Ficção" },
  { queryName: "Fantasy", name: "Fantasia" },
  { queryName: "Romance", name: "Romance" },
  { queryName: "Horror", name: "Horror" },
  { queryName: "Mystery", name: "Mistério" },
  { queryName: "History", name: "História" },
  { queryName: "Philosophy", name: "Filosofia" },
  { queryName: "Psychology", name: "Psicologia" },
  { queryName: "Technology", name: "Tecnologia" },
  { queryName: "Business", name: "Negócios" },
  { queryName: "Self-Help", name: "Autoajuda" },
];

const exploreFormSchema = z.object({
  search: z.string(),
});

type ExploreFormType = z.infer<typeof exploreFormSchema>;

export default function Explore() {
  const router = useRouter();

  const [isBookDetailsOpen, setIsBookDetailsOpen] = useState(false);

  const [bookDetailsId, setBookDetailsId] = useState<string>("");

  const exploreContainerRef = useRef<HTMLDivElement | null>(null);

  const [isBackToTopButtonVisible, setIsBackToTopButtonVisible] =
    useState(false);

  const { ref, inView } = useInView({
    rootMargin: "300px",
  });

  const searchTerm =
    typeof router.query.q === "string"
      ? router.query.q.replace(/\+/g, " ")
      : "";

  const urlCategory =
    typeof router.query.category === "string"
      ? router.query.category.split(" ")
      : [];

  const { register, watch, setFocus, reset, handleSubmit, setValue } =
    useForm<ExploreFormType>({
      resolver: zodResolver(exploreFormSchema),
      defaultValues: {
        search: "",
      },
    });

  const debouncedSearch = useDebounce(watch("search"), 2000);

  function handleUrlSearch({
    param,
    value,
  }: {
    param: "q" | "category";
    value: string;
  }) {

    const urlParams = [[param, value]] 
    Object.fromEntries(urlParams)

    router.replace({
      pathname: "/explore",
      query: {...Object.fromEntries(urlParams)},
    });
    return;
  }

  function onSubmit({ search }: ExploreFormType) {
    if (search.trim().length > 0) {
      handleUrlSearch({param: 'q', 'value': search})
      return;
    }

    return;
  }

  function handleCategoriesFilters(categoryName: string) {
    reset();

    if (urlCategory.includes(categoryName)) {
      const indexToRemove = urlCategory.findIndex(
        (category) => category === categoryName,
      );

      const newFilters = urlCategory.toSpliced(indexToRemove, 1).join(" ");

      handleUrlSearch({param: 'category', value: newFilters})
      return;
    }

    const newFilters = urlCategory.concat([categoryName]).join(" ");
    handleUrlSearch({param: 'category', value: newFilters})
    return;
  }

  const handleOpenBookDetails = useCallback((bookId: string) => {
    setBookDetailsId(bookId);
    setIsBookDetailsOpen(true);
  }, []);

  function handleCloseBookDetails() {
    setIsBookDetailsOpen(false);
  }

  const {
    data: booksData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<BooksResponse>({
    queryKey: ["books", searchTerm, [...urlCategory].sort().join(",")],
    queryFn: async ({ pageParam = 0 }) => {
      const subjectString = urlCategory.map((c) => `subject:${c}`).join(" ");
      

      const q =
        searchTerm.length > 0 ? `intitle:"${searchTerm}"` : subjectString;

      const googleResponse = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&langRestrict=pt&printType=books&orderBy=relevance&startIndex=${pageParam}&maxResults=20&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`,
      );

      const exploreBooksResponse = await api.post(`/app/books`, {
        googleData: googleResponse.data.items,
      });

      return exploreBooksResponse.data;
    },
    initialPageParam: 0,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
    enabled:
      (!!searchTerm && searchTerm.length > 0) ||
      (urlCategory && urlCategory.length > 0),
    getNextPageParam: (lastPage, pages) => {
      const nextIndex = pages.length * 20;

      if (!lastPage.items || lastPage.items.length === 0) {
        return undefined;
      }

      if (nextIndex >= 300) {
        return undefined;
      }

      return nextIndex;
    },
    retry: true,
    retryOnMount: true
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsBackToTopButtonVisible(scrollTop > 300);
  };

  const books = useMemo(
    () => booksData?.pages.flatMap((page) => page.items) ?? [],
    [booksData],
  );

  const scrollToTop = () => {
    exploreContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!inView) return;
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;

    fetchNextPage();
    return;
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (debouncedSearch.length > 0) {
      handleUrlSearch({param: 'q', value: debouncedSearch})
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (!router.isReady) return;
    setValue("search", searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setFocus("search");
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const hasSearch = typeof router.query.q === "string";
    const hasCategory =
      typeof router.query.category === "string" &&
      router.query.category.length > 0;

    if (!hasSearch && !hasCategory) {
      handleUrlSearch({param: 'category', value: 'Fiction'})
    }
  }, [router.isReady, searchTerm, urlCategory]);

  return (
    <>
      <NextSeo
        title=" Explore | BookWise"
        description="Explore o mundo dos livros junto conosco!"
      />
      <Layout>
        <BookDetails
          isOpen={isBookDetailsOpen && !!bookDetailsId}
          searchTerm={searchTerm}
          categoriesFilters={[...urlCategory].sort().join(",")}
          bookId={bookDetailsId}
          closeBookDetails={handleCloseBookDetails}
        />

        <ExploreContainer onScroll={handleScroll} ref={exploreContainerRef}>
          <ExploreHeader>
            <PageHeader>
              <Binoculars />
              <h1>Explorar</h1>
            </PageHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <label>
                <ExploreInput
                  {...register("search")}
                  placeholder="Buscar livro"
                  type="text"
                />
              </label>
              <ExploreFormButton>
                <MagnifyingGlass />
              </ExploreFormButton>
            </form>
          </ExploreHeader>
          <CategoriesContainer>
            {categories.map((category, i) => {
              return (
                <Category
                  disabled={isLoading}
                  isActive={urlCategory.includes(category.queryName)}
                  onClick={() => handleCategoriesFilters(category.queryName)}
                  key={i}
                >
                  {category.name}
                </Category>
              );
            })}
          </CategoriesContainer>
          {!isLoading ? (
            <>
              {books.length > 0 ? (
                <ExploreBooksContainer>
                  {books.map((book) => {
                    return (
                      <BookCard
                        key={book.id}
                        book={book}
                        handleOpenBookDetails={handleOpenBookDetails}
                      />
                    );
                  })}

                  {isBackToTopButtonVisible && (
                    <BackToTop onClick={scrollToTop} />
                  )}

                  <div ref={ref} />
                </ExploreBooksContainer>
              ) : (
                <ExplorePageFallback>
                  <p>Nenhum livro encontrado...</p>
                  <BookX />
                </ExplorePageFallback>
              )}

              {isFetchingNextPage && <LoadingSpinner />}
            </>
          ) : (
            <Fallback />
          )}
        </ExploreContainer>
      </Layout>
    </>
  );
}
