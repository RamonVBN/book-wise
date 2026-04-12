// Query Types

import { ReadingStatus } from "@/generated/prisma";

type RatingBookProps = {
  id: string;
  author: string;
  title: string;
  coverUrl: string;
  pageCount: number;
  categories: string;
};

type RatingUserProps = {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
};

export type RatingProps = {
  id: string;
  rate: number;
  review: string;
  book: RatingBookProps;
  user: RatingUserProps;
  createdAt: string;
  updatedAt: string;
};

export type BookProps = {
  id: string;
  title: string;
  description: string;
  author: string;
  categories: string;
  pageCount: number;
  coverUrl: string;
  avgRating: number;
  ratingsCount: number;
  ratingsSum: number;
  ratings: RatingProps[];
};

export interface ExploreBooksProps extends BookProps {
  author: string[];
  categories: string[];
  userBookInfo: UserBookInfo;
}

export type UserBookProps = {
  id: string;
  userId: string;
  status: ReadingStatus;
  isFavorite: boolean;
  rated: boolean;
  currentPage?: number;
  customTotalPage?: number;
  updatedAt: string;
  book: BookProps;
  user: RatingUserProps;
  wantToReadPosition?: number;
  favoritePosition?: number;
};

export type HomeDataResponse = {
  recentRatings: RatingProps[];
  popularBooks: BookProps[];
  lastUserActivity: RatingProps | UserBookProps | null;
};

export type BooksResponse = {
  items: ExploreBooksProps[];
  total: number;
};

export type BookStats = {
  avgRating: number;
  ratingsCount: number;
  ratingsSum: number;
  ratings: RatingProps;
  userBookInfo: UserBookInfo;
};

type Category = {
  category: {
    name: string;
  };
};

export type ProfileResponse = {
  userRatings: RatingProps[];
  allUserBooks: UserBookProps[];
  currentlyReadingBooks: UserBookProps[];
  finishedBooks: UserBookProps[];
  abandonedBooks: UserBookProps[];
  wantToReadBooks: UserBookProps[];
  favoriteBooks: UserBookProps[];
};

type BooksQueryData = {
  pages: {
    items: ExploreBooksProps[];
  }[];
};

type RatingQueryData = {
  ratings: RatingProps[];
  userStatus: UserBookInfo;
};

type UserBookInfo = {
  status: ReadingStatus;
  isFavorite: boolean;
  rated: boolean;
} | null;

type UserBookReorderProps = {
  userBookList: UserBookProps[]

  listType: "favoriteBooks" | "wantToReadBooks";
};
