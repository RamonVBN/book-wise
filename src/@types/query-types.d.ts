// Query Types

import { ReadingStatus } from "@/generated/prisma";

export type FullBookProps = {
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

export interface ExploreBooksProps extends FullBookProps {
  author: string[];
  categories: string[];
  userBookInfo: UserBookInfo;
}

type BookProps = {
  id: string;
  author: string;
  title: string;
  coverUrl: string;
  pageCount: number;
  categories: string;
};

interface HomeRatingBookProps extends BookProps {
  userBookInfo: {
    userBookId?: string
    loggedUserCurrentBookStatus?: ReadingStatus 
  }
};

export interface HomePopBookProps extends HomeRatingBookProps {
  avgRating: number
}

type UserProps = {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  createdAt: string
};

export type RatingProps = {
  id: string;
  rate: number;
  review: string;
  book: BookProps;
  user: UserProps;
  createdAt: string;
  updatedAt: string;
};

export interface HomeRatingProps extends RatingProps {
  book: HomeRatingBookProps;
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
  user: UserProps;
  wantToReadPosition?: number;
  favoritePosition?: number;
};

export type HomeDataResponse = {
  recentRatings: HomeRatingProps[];
  popularBooks: HomePopBookProps[];
  lastUserActivity: RatingProps | UserBookProps | null;
};

export type GoogleBooksResponse = {
  items: ExploreBooksProps[];
  total: number;
};

export type BookStats = {
  avgRating: number;
  ratingsCount: number;
  ratingsSum: number;
  ratings: RatingProps[];
  userBookInfo: UserBookInfo;
};

export type ProfileResponse = {
  userInfo: UserProps
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
  userBookId: string
  status: ReadingStatus;
  isFavorite: boolean;
  rated: boolean;
} | null;

type UserBookReorderProps = {
  userBookList: UserBookProps[]

  listType: "favoriteBooks" | "wantToReadBooks";
};
