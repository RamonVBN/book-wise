import { Binoculars, MagnifyingGlass, Star, StarHalf } from "phosphor-react";

import  {ExploreCategory, ExploreCategoriesContainer, ExploreContainer, ExploreHeader, ExploreInput, ExploreFormButton} from './styles.tsx'
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/pageHeader";
import { BookDetails } from "./components/BookDetails";
import { calcMediaRating } from "@/utils/calcMediaRating";
import { useInfiniteQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { BooksResponse } from "@/@types/query-types";
import { useSession } from "next-auth/react";
import { StarRating } from "@/components/StarsRating";
import { NextSeo } from "next-seo";
import { Fallback } from "@/components/Fallback";
import { useDebounce } from "@/hooks/useDebounce";
import { useInView } from "react-intersection-observer";
import { api } from "@/lib/axios";
import Image from "next/image";
import { ExploreBooksContainer } from "./components/ExploreBooks/style";
import BookCard from "./components/ExploreBooks";
import LoadingSpinner from "./components/LoadingSpinner.tsx";
import BackToTop from "./components/BackToTopButton.tsx";


const categories = [
'Fiction',
'Fantasy',
'Science Fiction',
'History',
'Philosophy',
'Technology',
'Business',
'Psychology',
'Self-Help',
'Romance',
'Horror',
'Mystery',
]

// Em caso de exceder o limite de requisições do Goggle Books API.

const fakeData = Array.from({ length: 57 }, (_, i) => ({
  id: `book-${i + 1}`,
  title: `Book Title ${i + 1}`,
  description: `This is a brief description for Book Title ${i + 1}. It covers interesting topics and insights to engage the reader.`,
  authors: [`Author ${i % 10 + 1}`, `Co-author ${i % 5 + 1}`],
  categories: [`Category ${i % 8 + 1}`, `Category ${i % 6 + 1}`],
  pageCount: Math.floor(Math.random() * 400) + 50, // páginas entre 50 e 450
  thumbnail: ''
}))

const exploreFormSchema = z.object({
    query: z.string()
})

type ExploreFormType = z.infer<typeof exploreFormSchema>

export default function Explore(){

    const session = useSession()
    
    const [categoriesFilters, setCategoriesFilters] = useState<string[]>(['Fiction'])

    const [isBookDetailsOpen, setIsBookDetailsOpen] = useState(false)

    const [bookDetailsId, setBookDetailsId] = useState<string>('')

    const exploreContainerRef = useRef<HTMLDivElement | null>(null)

    const [isBackToTopButtonVisible, setIsBackToTopButtonVisible] = useState(true)

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

            const subjectString = categoriesFilters.map(c => `subject:${c}`).join('+')

            const q = debouncedQuery.length > 0 ? encodeURIComponent(`intitle:"${debouncedQuery}"` )
            : encodeURIComponent(subjectString)

            const response = await api.get(`/app/books?q=${q}&startIndex=${pageParam}`)
            
            return response.data
        },
        initialPageParam: 0,
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

    const userEmail = session.data?.user.email

    useEffect(() => {
        setFocus('query')
    }, [setFocus])

    useEffect(() => {
        if (categoriesFilters.length === 0) {
            setCategoriesFilters(['Fiction'])
        }
    }, [categoriesFilters])

    useEffect(() => {
        if (!inView) return
        if (!hasNextPage) return
        if (isFetchingNextPage) return

        fetchNextPage()

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
                    <BookDetails bookId={bookDetailsId} closeBookDetails={handleCloseBookDetails} />
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
                    <ExploreInput {...register('query')}  placeholder="Buscar livro ou autor" type="text" />
                    </label>
                    <ExploreFormButton>
                        <MagnifyingGlass/>
                    </ExploreFormButton>
                </form>
            </ExploreHeader>
                    {
                        !isLoading ? (
                            <>
                            <ExploreCategoriesContainer>
                            {
                                categories.map((category, i) => {

                                return (
                                    <ExploreCategory isActive={categoriesFilters.includes(category)} onClick={() => handleCategoriesFilters(category)} key={i} >{category}</ExploreCategory>
                                )
                                })
                            }   
                            </ExploreCategoriesContainer>

                             <ExploreBooksContainer>
                        {/* {
                            filteredBooksByCategoriesAndInput && filteredBooksByCategoriesAndInput.map((book, i) => {

                                const isUserRead = book.ratings.find((rating) => rating.user.email === userEmail )

                                const bookMediaRating = calcMediaRating(book.ratings)

                                return (
                                <ExploreBook onClick={() => handleOpenBookDetails(book.name)} key={i}>
                                    {
                                        isUserRead && (
                                            <ReadMark>LIDO</ReadMark>
                                        )
                                    }
                                    <img src={book.coverUrl} alt="" />
                                    <div>
                                        <span>
                                            <h2>{book.name}</h2>
                                            <span>{book.author}</span>
                                        </span>

                                        <span>
                                        
                                            {
                                                <StarRating param={bookMediaRating}/>

                                            }
                                        </span>
                                    </div>
                                </ExploreBook>
                                )
                            })
                        } */}

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