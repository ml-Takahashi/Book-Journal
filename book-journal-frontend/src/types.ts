export interface Genre {
  id: string;
  name: string;
  parentId: string | null;
}

export interface BookSection {
  id: string;
  title: string;
  summary: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genreId: string;
  description: string;
  sections: BookSection[];
  createdAt: string;
  updatedAt: string;
  coverColor: string;
  tags: string[];
}
