import { Binoculars, MagnifyingGlass } from "phosphor-react";

import  { ExploreContainer, ExploreHeader, ExploreInput, ExploreFormButton} from './styles.tsx'
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/pageHeader";
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
import LoadingSpinner from "./components/LoadingSpinner.tsx";
import BackToTop from "./components/BackToTopButton.tsx";
import { CategoriesContainer, Category } from "@/components/Category/styles.ts";
import axios from "axios";

const categories = [
    {queryName: 'Fiction', name: 'Ficção'},
    {queryName: 'Fantasy', name: 'Fantasia'},
    {queryName: 'Science Fiction', name: 'Ficção Científica'},
    {queryName: 'History', name: 'História'},
    {queryName: 'Philosophy', name: 'Filosofia'},
    {queryName: 'Technology', name: 'Tecnologia'},
    {queryName: 'Business', name: 'Negócios'},
    {queryName: 'Psychology', name: 'Psicologia'},
    {queryName: 'Self-Help', name: 'Autoajuda'},
    {queryName: 'Romance', name: 'Romance'},
    {queryName: 'Horror', name: 'Horror'},
    {queryName: 'Mystery', name: 'Mistério'}
]


const exploreFormSchema = z.object({
    query: z.string()
})

type ExploreFormType = z.infer<typeof exploreFormSchema>

export default function Explore() {

    
    const [categoriesFilters, setCategoriesFilters] = useState<string[]>(['Fiction'])

    const [isBookDetailsOpen, setIsBookDetailsOpen] = useState(false)

    const [bookDetailsId, setBookDetailsId] = useState<string>('')

    const exploreContainerRef = useRef<HTMLDivElement | null>(null)

    const [isBackToTopButtonVisible, setIsBackToTopButtonVisible] = useState(false)

    const { ref, inView } = useInView({
        rootMargin: '300px'
    })

    const {register, watch, setFocus} = useForm<ExploreFormType>({
        resolver: zodResolver(exploreFormSchema),
        defaultValues: {
            query: ''
        }
    })

    function handleCategoriesFilters(categoryName: string){

        if (categoriesFilters.includes(categoryName)) {

            const indexToRemove = categoriesFilters.findIndex((category) => category === categoryName)

            const newFilters = categoriesFilters.toSpliced(indexToRemove, 1)

            return setCategoriesFilters(newFilters)   
        }

        return setCategoriesFilters((prevState) => [...prevState, categoryName])
    }

    const handleOpenBookDetails = useCallback((bookId: string) => {
        setBookDetailsId(bookId)
        setIsBookDetailsOpen(true)
    }, [])

    function handleCloseBookDetails(){
        setIsBookDetailsOpen(false)
    }

    const debouncedQuery = useDebounce(watch('query'), 800)

    const {
        data: booksData, 
        isLoading, 
        hasNextPage, 
        fetchNextPage, 
        isFetchingNextPage} = useInfiniteQuery<BooksResponse>({
        queryKey: ['books', debouncedQuery, categoriesFilters.join(',')],
        queryFn: async ({pageParam = 0}) => {

            const subjectString = categoriesFilters.map(c => `subject:${c}`).join(' ')

            const q = debouncedQuery.length > 0 ? `intitle:${debouncedQuery}"+${subjectString}` :subjectString

            const googleResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&langRestrict=pt&country=BR&printType=books&orderBy=relevance&startIndex=${pageParam}&maxResults=20&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`)
            
            const exploreBooksResponse = await api.post(`/app/books`, { googleData: googleResponse.data.items })

            return exploreBooksResponse.data
        
        },
        initialPageParam: 0,
        staleTime: 10 * 60 * 1000, // 10 minutos
        gcTime: 30 * 60 * 1000, // 30 minutos
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
            const nextIndex = pages.length * 20

            if (!lastPage.items || lastPage.items.length === 0) {
                return undefined
            }

            if (nextIndex >= 300) {
                return undefined
            }

            return nextIndex
        }})

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
            const scrollTop = e.currentTarget.scrollTop
            setIsBackToTopButtonVisible(scrollTop > 300)
        }      

    const books = useMemo(() => booksData?.pages.flatMap(page => page.items) ?? [], [booksData])

    useEffect(() => {
        setFocus('query')
    }, [setFocus])

    useEffect(() => {
        if (categoriesFilters.length === 0  && (watch('query').trim().length === 0 ) ) {
            setCategoriesFilters(['Fiction'])
        }
    }, [categoriesFilters, watch('query')])

    useEffect(() => {
        if (!inView) return
        if (!hasNextPage) return
        if (isFetchingNextPage) return

        fetchNextPage()
        return 
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    const scrollToTop = () => {
        exploreContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
        <NextSeo
        title=" Explore | BookWise"
        description="Explore o mundo dos livros junto conosco!"
        />
        <Layout>
            {
                isBookDetailsOpen && (
                    <BookDetails debouncedQuery={debouncedQuery} categoriesFilters={categoriesFilters.join(',')} bookId={bookDetailsId} closeBookDetails={handleCloseBookDetails} />
                )
            }
            <ExploreContainer onScroll={handleScroll} ref={exploreContainerRef}>
            <ExploreHeader>

                <PageHeader>
                <Binoculars/>
                <h1>Explorar</h1>
                </PageHeader>
                
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>
                    <ExploreInput {...register('query')}  placeholder="Buscar livro" type="text" />
                    </label>
                    <ExploreFormButton>
                        <MagnifyingGlass/>
                    </ExploreFormButton>
                </form>
            </ExploreHeader>
                    {
                        !isLoading ? (
                            <>
                            <CategoriesContainer>
                            {
                                categories.map((category, i) => {

                                return (
                                    <Category isActive={categoriesFilters.includes(category.queryName)} onClick={() => handleCategoriesFilters(category.queryName)} key={i} >{category.name}</Category>
                                )
                                })
                            }   
                            </CategoriesContainer>

                             <ExploreBooksContainer>
                        {
                            books.map((book) => (

                                <BookCard key={book.id} book={book} handleOpenBookDetails={handleOpenBookDetails}/>
                            )) 
                            
                        }
                        {
                            isBackToTopButtonVisible && (
                                <BackToTop onClick={scrollToTop}/>
                            )
                        }

                        <div ref={ref}/>
                        
                    </ExploreBooksContainer>

                    {
                        isFetchingNextPage && (
                            <LoadingSpinner/>
                        )
                    }
                    </>
                        ) : (<Fallback/>)
                    }
            </ExploreContainer>
        </Layout>
        </>
    )
}
