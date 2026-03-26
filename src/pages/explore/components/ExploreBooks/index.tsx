import Image from "next/image";
import { ExploreBook, ReadMark } from "./style";
import React from "react";
import { StarRating } from "@/components/StarsRating";
import { ExploreBooksProps } from "@/@types/query-types";

const BookCard = React.memo(function BookCard({book, handleOpenBookDetails} : 
    {book: ExploreBooksProps, 
    handleOpenBookDetails: (bookId: string) => void}
    )
    {
    return (
        <ExploreBook onClick={() => handleOpenBookDetails(book.id)}>

             {
                book.finished && (
                <ReadMark>LIDO</ReadMark>
                )
                }
                                          
            <Image width={108} height={152} loading="lazy" src={book.coverUrl}  alt="" />
            
            <div>
                <span>
                    <h2>{book.title}</h2>
                    <span>{
                        book.author && book.author.length > 1 ? book.author.map((name, i) => {
                            if (i < book.author.length - 1){
                                return name + ', '
                            } else {
                                return name
                            }
                        }) : book.author}
                        </span>
                </span>

                <span>
                    <StarRating param={book.avgRating}/>
                </span> 
            </div>
        </ExploreBook>
    )
})

export default BookCard