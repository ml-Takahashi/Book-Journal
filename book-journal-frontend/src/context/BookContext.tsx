import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { initialBooks, initialGenres } from '../data/initialData';
import type { Book, BookSection, Genre } from '../types';
import { generateId } from '../utils/id';

interface BookState {
  genres: Genre[];
  books: Book[];
  selectedGenreId: string | null;
  selectedBookId: string | null;
  searchTerm: string;
}

type Action =
  | { type: 'add-genre'; payload: { name: string; parentId: string | null } }
  | {
      type: 'add-book';
      payload: {
        title: string;
        author: string;
        genreId: string;
        description: string;
        tags: string[];
        sections: Array<Pick<BookSection, 'title' | 'summary'>>;
        coverColor?: string;
      };
    }
  | { type: 'select-genre'; payload: string | null }
  | { type: 'select-book'; payload: string | null }
  | { type: 'set-search'; payload: string }
  | {
      type: 'update-book';
      payload: {
        id: string;
        updates: Partial<
          Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'sections'>
        > & { sections?: BookSection[] };
      };
    };

interface BookContextValue {
  state: BookState;
  addGenre: (input: { name: string; parentId: string | null }) => void;
  addBook: (input: {
    title: string;
    author: string;
    genreId: string;
    description: string;
    tags: string[];
    sections: Array<Pick<BookSection, 'title' | 'summary'>>;
    coverColor?: string;
  }) => void;
  selectGenre: (id: string | null) => void;
  selectBook: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  updateBook: (
    id: string,
    updates: Partial<
      Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'sections'>
    > & { sections?: BookSection[] },
  ) => void;
}

const BookContext = createContext<BookContextValue | undefined>(undefined);

const initialState: BookState = {
  genres: initialGenres,
  books: initialBooks,
  selectedGenreId: null,
  selectedBookId: initialBooks[0]?.id ?? null,
  searchTerm: '',
};

function deriveCoverColor(index: number) {
  const palette = ['#6c5ce7', '#00cec9', '#fdcb6e', '#ff7675', '#0984e3'];
  return palette[index % palette.length];
}

function bookReducer(state: BookState, action: Action): BookState {
  switch (action.type) {
    case 'add-genre': {
      const newGenre: Genre = {
        id: generateId(),
        name: action.payload.name.trim(),
        parentId: action.payload.parentId ?? null,
      };

      return {
        ...state,
        genres: [...state.genres, newGenre],
        selectedGenreId: newGenre.id,
      };
    }
    case 'add-book': {
      const id = generateId();
      const timestamp = new Date().toISOString();
      const sections: BookSection[] = action.payload.sections
        .filter((section) => section.title.trim() || section.summary.trim())
        .map((section) => ({
          id: generateId(),
          title: section.title.trim() || '無題のセクション',
          summary: section.summary.trim(),
        }));

      const book: Book = {
        id,
        title: action.payload.title.trim(),
        author: action.payload.author.trim(),
        genreId: action.payload.genreId,
        description: action.payload.description.trim(),
        tags: action.payload.tags.map((tag) => tag.trim()).filter(Boolean),
        sections,
        createdAt: timestamp,
        updatedAt: timestamp,
        coverColor:
          action.payload.coverColor ??
          deriveCoverColor(state.books.length),
      };

      return {
        ...state,
        books: [...state.books, book],
        selectedBookId: id,
        selectedGenreId: book.genreId,
      };
    }
    case 'select-genre':
      return {
        ...state,
        selectedGenreId: action.payload,
      };
    case 'select-book':
      return {
        ...state,
        selectedBookId: action.payload,
      };
    case 'set-search':
      return {
        ...state,
        searchTerm: action.payload,
      };
    case 'update-book': {
      const books = state.books.map((book) => {
        if (book.id !== action.payload.id) {
          return book;
        }

        const nextSections = action.payload.updates.sections ?? book.sections;

        return {
          ...book,
          ...action.payload.updates,
          sections: nextSections,
          updatedAt: new Date().toISOString(),
        };
      });

      return { ...state, books };
    }
    default:
      return state;
  }
}

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(bookReducer, initialState);

  const addGenre = useCallback(
    (input: { name: string; parentId: string | null }) => {
      dispatch({ type: 'add-genre', payload: input });
    },
    [],
  );

  const addBook = useCallback(
    (input: {
      title: string;
      author: string;
      genreId: string;
      description: string;
      tags: string[];
      sections: Array<Pick<BookSection, 'title' | 'summary'>>;
      coverColor?: string;
    }) => {
      dispatch({ type: 'add-book', payload: input });
    },
    [],
  );

  const selectGenre = useCallback((id: string | null) => {
    dispatch({ type: 'select-genre', payload: id });
  }, []);

  const selectBook = useCallback((id: string | null) => {
    dispatch({ type: 'select-book', payload: id });
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: 'set-search', payload: term });
  }, []);

  const updateBook = useCallback(
    (
      id: string,
      updates: Partial<
        Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'sections'>
      > & { sections?: BookSection[] },
    ) => {
      dispatch({ type: 'update-book', payload: { id, updates } });
    },
    [],
  );

  const value = useMemo(
    () => ({
      state,
      addGenre,
      addBook,
      selectGenre,
      selectBook,
      setSearchTerm,
      updateBook,
    }),
    [state, addGenre, addBook, selectGenre, selectBook, setSearchTerm, updateBook],
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

export function useBookContext() {
  const context = useContext(BookContext);

  if (!context) {
    throw new Error('useBookContext must be used within a BookProvider');
  }

  return context;
}
