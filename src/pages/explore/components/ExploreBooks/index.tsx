import Image from "next/image";
import { ExploreBook } from "./style";
import React from "react";
import { StarRating } from "@/components/StarsRating";
import { ExploreBooksProps } from "@/@types/query-types";
import { BooksStatusFlag } from "../../../../components/BooksStatusFlag";
import { BookCover } from "../../../../components/BookCover";

const BookCard = React.memo(function BookCard({
  book,
  handleOpenBookDetails,
}: {
  book: ExploreBooksProps;
  handleOpenBookDetails: (bookId: string) => void;
}) {
  return (
    <ExploreBook onClick={() => handleOpenBookDetails(book.id)}>
      {book.userBookInfo?.status && (
        <BooksStatusFlag explore={true} status={book.userBookInfo.status} />
      )}

      {/* <Image
        key={book.id}
        width={108}
        height={152}
        sizes="108px"
        priority  
        src={book.coverUrl}
        alt=""
      /> */}
      <BookCover
        key={book.id}
        width={108}
        height={152}
        sizes="108px"
        src={book.coverUrl}
        priority
      />

      <div>
        <span>
          <h2>{book.title}</h2>
          <span>
            {book.author && book.author.length > 1
              ? book.author.map((name, i) => {
                  if (i < book.author.length - 1) {
                    return name + ", ";
                  } else {
                    return name;
                  }
                })
              : book.author}
          </span>
        </span>

        <StarRating param={book.avgRating} />
      </div>
    </ExploreBook>
  );
});

export default BookCard;
