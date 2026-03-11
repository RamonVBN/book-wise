import Image from "next/image";
import { ExploreBook, ReadMark } from "./style";
import React from "react";
import { StarRating } from "@/components/StarsRating";
import { BookProps } from "@/@types/query-types";

const BookCard = React.memo(function BookCard({book, handleOpenBookDetails} : 
    {book: BookProps, 
    handleOpenBookDetails: (bookId: string) => void
    }){
    return (
        <ExploreBook onClick={() => handleOpenBookDetails(book.id)}>
                                          
            <Image width={108} height={152} loading="lazy" src={book.thumbnail} alt="" />
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
        </ExploreBook>
    )
})

export default BookCard