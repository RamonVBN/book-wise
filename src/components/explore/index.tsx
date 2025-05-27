import { Binoculars, MagnifyingGlass, Star } from "phosphor-react";
import { ExploreBook, ExploreBooksContainer, ExploreCategory, ExploreCategoriesContainer, ExploreContainer, ExploreHeader, ExploreInput, ExploreFormButton } from "./styles";
import { AllCategories, BooksProps } from "@/pages/app";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/pageHeader";
import { BookDetails } from "./components/BookDetails";
import { calcMediaRating } from "@/utils/calcMediaRating";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";


const exploreFormSchema = z.object({
    bookAuthor: z.string().min(1)
})

type ExploreFormType = z.infer<typeof exploreFormSchema>


export default function Explore(){
    
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

    const {data: booksData} = useQuery<{books: BooksProps[], categories: AllCategories}>({

        queryKey: ['books'],
        queryFn: async () => {

            const response = await api.get('/app/books')

            return response.data
        },
        
    })

    const filteredBooksByInput = booksData?.books?.filter((book) => watch('bookAuthor') ? book.name.trim().toLowerCase().includes(watch('bookAuthor').trim().toLowerCase()) || book.author.trim().toLowerCase().includes(watch('bookAuthor').trim().toLowerCase()) : true)

    const filteredBooksByCategoriesAndInput = filteredBooksByInput?.filter((book) => {

        return book.categories.some((bookCategory) => categoriesFilters.length > 0 ? categoriesFilters.includes(bookCategory.category.name): true)
    })


    return (
        <>
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
                <ExploreInput {...register('bookAuthor')}  placeholder="Buscar livro ou autor" type="text" />
                </label>
                <ExploreFormButton>
                    <MagnifyingGlass/>
                </ExploreFormButton>
            </form>
        </ExploreHeader>
                <ExploreCategoriesContainer>
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

                            return (
                            <ExploreBook name={book.name} onClick={(e) => handleOpenBookDetails(e.currentTarget.name)} key={i}>
                                <img src={book.coverUrl} alt="" />
                                <div>
                                    <span>
                                        <h2>{book.name}</h2>
                                        <span>{book.author}</span>
                                    </span>

                                    <span>
                                       
                                        {
                                            Array.from({length: 5}).map((_, i) => {

                                                const bookMediaRating = calcMediaRating(book.ratings)

                                                if (i + 1 > bookMediaRating) {
                                                    
                                                    return (
                                                        <Star key={i}/>
                                                    )
                                                }

                                                return (
                                                    <Star key={i} weight="fill"/>
                                                )
                                            })
                                        }
                                    </span>
                                </div>
                            </ExploreBook>
                            )
                        })
                    }
                    
                </ExploreBooksContainer>
                
        </ExploreContainer>
        </>
    )
}