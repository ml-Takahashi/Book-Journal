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

export interface BookChapter {
  id: string;
  title: string;
  summary: string;
  sections: BookSection[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genreId: string;
  description: string;
  chapters: BookChapter[];
  createdAt: string;
  updatedAt: string;
  coverColor: string;
  tags: string[];
}
