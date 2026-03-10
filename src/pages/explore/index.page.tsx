import { Binoculars, MagnifyingGlass, Star, StarHalf } from "phosphor-react";
import { ExploreBook, ExploreBooksContainer, ExploreCategory, ExploreCategoriesContainer, ExploreContainer, ExploreHeader, ExploreInput, ExploreFormButton, ReadMark } from "./styles";
import { useEffect, useMemo, useState } from "react";
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
'Mystery'
]

const exploreFormSchema = z.object({
    query: z.string()
})

type ExploreFormType = z.infer<typeof exploreFormSchema>


export default function Explore(){

    const session = useSession()
    
    const [categoriesFilters, setCategoriesFilters] = useState<string[]>(['Fiction'])

    const [isBookDetailsOpen, setIsBookDetailsOpen] = useState(false)

    const [bookDetailsId, setBookDetailsId] = useState<string>('')

    const { ref, inView } = useInView()

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

    function handleOpenBookDetails(bookId: string){
        setBookDetailsId(bookId)

        setIsBookDetailsOpen(true)
    }

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
        queryKey: ['books', debouncedQuery, categoriesFilters],
        queryFn: async ({pageParam = 0}) => {
            let subjectString: string = ''

            if(categoriesFilters.length > 0){

                categoriesFilters.forEach((c, i) => {

                subjectString += `subject:${c}`

                if (i < categoriesFilters.length - 1){
                    subjectString += '+'
                }

                })
            }

            const q = 'intitle:' + debouncedQuery + '+' + subjectString

            const response = await api.get(`/app/books?q=${q}&startIndex=${pageParam}`)
            
            return response.data
        },
        initialPageParam: 0,
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

    const books = useMemo(() => booksData?.pages.flatMap(page => page.items) ?? [], [booksData])

    const userEmail = session.data?.user.email

    useEffect(() => {
        setFocus('query')

        if(categoriesFilters.length == 0){

            setCategoriesFilters(['Fiction'])
        }

        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    
    }, [booksData, categoriesFilters, inView, hasNextPage, fetchNextPage])

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
            <ExploreContainer>
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
                            books.map((book, i) => (
                                <ExploreBook onClick={() => handleOpenBookDetails(book.id)} key={i}>
                                  
                                    <img src={book.thumbnail} alt="" />
                                    <div>
                                        <span>
                                            <h2>{book.title}</h2>
                                            <span>{
                                                book.authors && book.authors.length > 1 ? book.authors.map((name, i) => {
                                                    if (i < book.authors.length - 1){
                                                        return name + ', '
                                                    } else {
                                                        return name
                                                    }
                                                }) : book.authors
                                            }</span>
                                        </span>

                                         <span>
                                        
                                            {
                                                <StarRating param={5}/>
                                            }
                                        </span>
                                       
                                    </div>
                                </ExploreBook>)) 
                            
                        }

                        <div ref={ref}>
                            {isFetchingNextPage && <p>Carregando...</p>}
                        </div>
                        
                    </ExploreBooksContainer>
                    </>
                        ) : (<Fallback/>)
                    }

                    
                    
            </ExploreContainer>
        </Layout>
        </>
    )
}