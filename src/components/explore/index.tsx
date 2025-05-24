import { Binoculars, MagnifyingGlass, Star } from "phosphor-react";
import { ExploreBook, ExploreBooksContainer, ExploreCategories, ExploreCategoriesContainer, ExploreContainer, ExploreHeader, ExploreInput, ExploreFormButton } from "./styles";
import { AllCategories, ExploreBooksProps } from "@/pages/app";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "../pageHeader";


interface ExploreProps {

    books: ExploreBooksProps | undefined
    categories: AllCategories | undefined 
}

const exploreFormSchema = z.object({
    bookAuthor: z.string().min(1)
})

type ExploreFormType = z.infer<typeof exploreFormSchema>


export default function Explore({books, categories}: ExploreProps){

    const [categoriesFilters, setCategoriesFilters] = useState<string[]>([])

    const {register, handleSubmit, reset, watch} = useForm<ExploreFormType>({
        resolver: zodResolver(exploreFormSchema)
    })

    function handleExploreSubmit(data: ExploreFormType){
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

    const filteredBooksByInput = books?.filter((book) => watch('bookAuthor') ? book.name.trim().toLowerCase().includes(watch('bookAuthor').trim().toLowerCase()) || book.author.trim().toLowerCase().includes(watch('bookAuthor').trim().toLowerCase()) : true)

    const filteredBooksByCategoriesAndInput = filteredBooksByInput?.filter((book) => {

        return book.categories.some((bookCategory) => categoriesFilters.length > 0 ? categoriesFilters.includes(bookCategory.category.name): true)
    })


    return (
        <>
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
                        categories && categories.map((category, i) => {

                            return (
                                <ExploreCategories isActive={categoriesFilters.includes(category.name)} onClick={() => handleCategoriesFilters(category.name)} key={i} >{category.name}</ExploreCategories>
                            )
                        })
                    }
                </ExploreCategoriesContainer>

                <ExploreBooksContainer>
                    {
                        filteredBooksByCategoriesAndInput && filteredBooksByCategoriesAndInput.map((book, i) => {

                            return (
                            <ExploreBook key={i}>
                                <img src={book.coverUrl} alt="" />
                                <div>
                                    <span>
                                        <h2>{book.name}</h2>
                                        <span>{book.author}</span>
                                    </span>

                                    <span>
                                        <Star/>
                                        <Star/>
                                        <Star/>
                                        <Star/>
                                        <Star/>
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