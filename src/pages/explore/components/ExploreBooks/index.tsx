import { ExploreBook } from "./style";
import React from "react";
import { StarRating } from "@/components/StarsRating";
import { ExploreBooksProps } from "@/@types/query-types";
import { BooksStatusFlag } from "../../../../components/BooksStatusFlag";
import { BookCover } from "../../../../components/BookCover";
import { formatAuthors } from "@/utils/formatAuthors";
import { useSession } from "next-auth/react";
import { useAuth } from "@/components/AuthContext";

const BookCard = React.memo(function BookCard({
  book,
  handleOpenBookDetails,
}: {
  book: ExploreBooksProps;
  handleOpenBookDetails: (bookId: string) => void;
}) {

  const session = useSession()

  const { demoUser } = useAuth()

  const isRealUserSigned = session.status === 'authenticated'

  const isDemoUserSigned = demoUser?.isDemo ?? false

  const isSigned = isRealUserSigned || isDemoUserSigned

  return (
    <ExploreBook onClick={() => handleOpenBookDetails(book.id)}>
      {book.userBookInfo?.status && isSigned && (
        <BooksStatusFlag explore={true} status={book.userBookInfo.status} />
      )}
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
            {book.author ? formatAuthors(book.author) : 'Autor desconhecido'}
          </span>
        </span>

        <StarRating param={book.avgRating} />
      </div>
    </ExploreBook>
  );
});

export default BookCard;
