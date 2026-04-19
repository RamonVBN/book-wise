import { ProfileResponse, UserBookProps } from "@/@types/query-types";

const demoUserInfo = {
  id: "demo-user",
  name: "Recruiter Demo",
  email: "demo@bookwise.app",
  avatarUrl: "/demo-avatar.png",
  createdAt: new Date().toString(),
  isDemo: true,
};

const allUserBooks: UserBookProps[] = [
  {
    id: crypto.randomUUID(),
    userId: 'demo-user',
    status: "READING",
    isFavorite: false,
    rated: false,
    currentPage: undefined,
    customTotalPage: undefined,
    updatedAt: new Date().toString(),
    book: {
      id: crypto.randomUUID(),
      title: "O Hobbit",
      description: "",
      author: "J.R.R. Tolkien",
      categories: "Ficção",
      pageCount: 360,
      coverUrl: "/images/books/o-hobbit.png",
      avgRating: 0,
      ratingsCount: 0,
      ratingsSum: 0,
      ratings: [],
    },
    user: demoUserInfo,
    wantToReadPosition: undefined,
    favoritePosition: undefined,
  },

  {
    id: crypto.randomUUID(),
    userId: 'demo-user',
    status: "FINISHED",
    isFavorite: false,
    rated: false,
    currentPage: 250,
    customTotalPage: undefined,
    updatedAt: new Date().toString(),
    book: {
      id: crypto.randomUUID(),
      title: "O guia do mochileiro das galáxias",
      description: "",
      author: "Douglas Adams",
      categories: "Ficção",
      pageCount: 250,
      coverUrl: "/images/books/o-guia-do-mochileiro-das-galaxias.png",
      avgRating: 0,
      ratingsCount: 0,
      ratingsSum: 0,
      ratings: [],
    },
    user: demoUserInfo,
    wantToReadPosition: undefined,
    favoritePosition: undefined,
  },

  {
    id: crypto.randomUUID(),
    userId: 'demo-user',
    status: "WANT_TO_READ",
    isFavorite: false,
    rated: false,
    currentPage: undefined,
    customTotalPage: undefined,
    updatedAt: new Date().toString(),
    book: {
      id: crypto.randomUUID(),
      title: "Refatoração",
      description: "",
      author: "Martin Fowler",
      categories: "Programação",
      pageCount: 332,
      coverUrl: "/images/books/refatoracao.png",
      avgRating: 0,
      ratingsCount: 0,
      ratingsSum: 0,
      ratings: [],
    },
    user: demoUserInfo,
    wantToReadPosition: undefined,
    favoritePosition: undefined,
  },

  {
    id: crypto.randomUUID(),
    userId: 'demo-user',
    status: "FINISHED",
    isFavorite: false,
    rated: false,
    currentPage: 263,
    customTotalPage: undefined,
    updatedAt: new Date().toString(),
    book: {
      id: crypto.randomUUID(),
      title: "Entendendo Algoritmos",
      description: "",
      author: "Aditya Y. Bhargava",
      categories: "Programação",
      pageCount: 263,
      coverUrl: "/images/books/entendendo-algoritmos.png",
      avgRating: 0,
      ratingsCount: 0,
      ratingsSum: 0,
      ratings: [],
    },
    user: demoUserInfo,
    wantToReadPosition: undefined,
    favoritePosition: undefined,
  },

  {
    id: crypto.randomUUID(),
    userId: 'demo-user',
    status: "WANT_TO_READ",
    isFavorite: false,
    rated: false,
    currentPage: undefined,
    customTotalPage: undefined,
    updatedAt: new Date().toString(),
    book: {
      id: crypto.randomUUID(),
      title: "JoJo",
      description: "",
      author: "Hirohiko Araki",
      categories: "Bizarrice",
      pageCount: 205,
      coverUrl: "/images/books/jojo.jpeg",
      avgRating: 0,
      ratingsCount: 0,
      ratingsSum: 0,
      ratings: [],
    },
    user: demoUserInfo,
    wantToReadPosition: undefined,
    favoritePosition: undefined,
  },
];

const currentlyReadingBooks = allUserBooks.filter(
  (b) => b.status === "READING",
);

const finishedBooks = allUserBooks.filter(
  (b) => b.status === "FINISHED",
);

const wantToReadBooks = allUserBooks.filter(
  (b) => b.status === "WANT_TO_READ",
);


export const demoProfileData: ProfileResponse = {
  userInfo: demoUserInfo,
  allUserBooks: allUserBooks,
  userRatings: [],
  currentlyReadingBooks: currentlyReadingBooks,
  wantToReadBooks: wantToReadBooks,
  finishedBooks: finishedBooks,
  favoriteBooks: [],
  abandonedBooks: [],
};
