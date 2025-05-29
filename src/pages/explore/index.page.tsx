import { Binoculars, MagnifyingGlass, Star, StarHalf } from "phosphor-react";
import { ExploreBook, ExploreBooksContainer, ExploreCategory, ExploreCategoriesContainer, ExploreContainer, ExploreHeader, ExploreInput, ExploreFormButton, ReadMark } from "./styles";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/pageHeader";
import { BookDetails } from "./components/BookDetails";
import { calcMediaRating } from "@/utils/calcMediaRating";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import Layout from "@/components/Layout";
import { AllCategories, BooksProps } from "@/@types/query-types";
import { useSession } from "next-auth/react";
import { StarRating } from "@/components/StarsRating";
import { NextSeo } from "next-seo";
import { Fallback } from "@/components/Fallback";


const exploreFormSchema = z.object({
    bookAuthor: z.string().min(1)
})

type ExploreFormType = z.infer<typeof exploreFormSchema>


export default function Explore(){

    const session = useSession()
    
    const [categoriesFilters, setCategoriesFilters] = useState<string[]>([])

    const [isBookDetailsOpen, setIsBookDetailsOpen] = useState(false)

    const [bookDetailsName, setBookDetailsName] = useState<string>('')

    const {register, handleSubmit, reset, watch} = useForm<ExploreFormType>({
        resolver: zodResolver(exploreFormSchema)
    })

    function handleExploreSubmit(){
        reset()
    }

    function handleCategoriesFilters(categoryName: string){

        if (categoriesFilters.includes(categoryName)) {

            const indexToRemove = categoriesFilters.findIndex((category) => category === categoryName)

            const newFilters = categoriesFilters.toSpliced(indexToRemove, 1)

            return setCategoriesFilters(newFilters)
            
        }

        return setCategoriesFilters((prevState) => [...prevState, categoryName])
    }

    function handleOpenBookDetails(bookName: string){
        setBookDetailsName(bookName)

        setIsBookDetailsOpen(true)
    }

    function handleCloseBookDetails(){
        setIsBookDetailsOpen(false)
    }

    const {data: booksData, isLoading} = useQuery<{books: BooksProps[], categories: AllCategories}>({

        queryKey: ['books'],
        queryFn: async () => {
            
            const response = await api.get('/app/books')

            return response.data
        },
        
        
    })

    const filteredBooksByInput = booksData?.books?.filter((book) => watch('bookAuthor') ? book.name.trim().toLowerCase().includes(watch('bookAuthor').trim().toLowerCase()) || book.author.trim().toLowerCase().includes(watch('bookAuthor').trim().toLowerCase()) : true)

    // const filteredBooksByCategoriesAndInput = filteredBooksByInput?.filter((book) => {

    //     return book.categories.some((bookCategory) => categoriesFilters.length > 0 ? categoriesFilters.includes(bookCategory.category.name): true)
    // })

    const filteredBooksByCategoriesAndInput = filteredBooksByInput?.filter((book) => {

        return categoriesFilters.every((filteredCategory) => book.categories.some((bookCategory) => bookCategory.category.name === filteredCategory))
    })

    const userEmail = session.data?.user.email

    return (
        <>
        <NextSeo
        title=" Explore | BookWise"
        description="Explore o mundo dos livros junto conosco!"
        />
        <Layout>
            {
                isBookDetailsOpen && (
                    <BookDetails bookName={bookDetailsName} closeBookDetails={handleCloseBookDetails} />
                )
            }
            <ExploreContainer>
            <ExploreHeader>

                <PageHeader>
                <Binoculars/>
                <h1>Explorar</h1>
                </PageHeader>
                
                <form onSubmit={handleSubmit(handleExploreSubmit)}>
                    <label>
                    <ExploreInput disabled={isLoading} {...register('bookAuthor')}  placeholder="Buscar livro ou autor" type="text" />
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
                    <ExploreCategory onClick={() => setCategoriesFilters([])} isActive={categoriesFilters.length < 1 || categoriesFilters.length === booksData?.categories.length}>Tudo</ExploreCategory>
                        {
                            booksData?.categories && booksData.categories.map((category, i) => {

                                return (
                                    <ExploreCategory isActive={categoriesFilters.includes(category.name)} onClick={() => handleCategoriesFilters(category.name)} key={i} >{category.name}</ExploreCategory>
                                )
                            })
                        }
                    </ExploreCategoriesContainer>

                    <ExploreBooksContainer>
                        {
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

                                            //     Array.from({length: 5}).map((_, i) => {
                                                
                                            //     if ((bookMediaRating - ((i + 1) - 1)) > 0 && (bookMediaRating - ((i + 1) - 1)) < 1 ) {
                                            //         return (
                                            //             <StarHalf key={i} weight="fill"/>  
                                            //         )
                                            //     }
                                                
                                            //     if (i + 1 > bookMediaRating) {

                                                    
                                            //         return (
                                            //             <Star key={i}/>
                                            //         )
                                            //     }

                                            //     return <Star key={i} weight="fill"/>
                                            // })

                                            }
                                        </span>
                                    </div>
                                </ExploreBook>
                                )
                            })
                        }
                        
                    </ExploreBooksContainer>
                    </>
                        ) : (<Fallback/>)
                    }

                    
                    
            </ExploreContainer>
        </Layout>
        </>
    )
}