export type ApiBookProps = {
  id: number;
  title: string;
  image?: string | null;
  rate?: number;
  numberOfPages?: number;
  description?: string;
  authorsDto: {
    id: number;
    name: string;
    picture?: string;
    bio: string;
    rate: string;
  }[];
  genresDto: {
    genreId: number;
    genreName: string;
  }[];
};

export type BookProps = {
  id: number;
  title: string;
  image?: string | null;
  rate?: number;
  numberOfPages?: number;
  description?: string;
  author?: {
    id: number;
    name: string;
    picture?: string;
    bio: string;
    rate: string;
  };
  genres?: {
    genreId: number;
    genreName: string;
  }[];
};
