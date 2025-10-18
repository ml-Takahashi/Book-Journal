import { useMemo, useState } from 'react';
import { useBookContext } from '../context/BookContext';
import type { Book } from '../types';
import { getGenrePath } from '../utils/genreTree';
import { Sidebar } from './Sidebar';
import { BookDetail } from './BookDetail';
import { BookGallery } from './BookGallery';
import { AddBookDialog } from './dialogs/AddBookDialog';
import { AddGenreDialog } from './dialogs/AddGenreDialog';

export function AppLayout() {
  const {
    state: {
      genres,
      books,
      selectedGenreId,
      selectedBookId,
      searchTerm,
    },
    selectGenre,
    selectBook,
    setSearchTerm,
  } = useBookContext();

  const [isBookDialogOpen, setBookDialogOpen] = useState(false);
  const [isGenreDialogOpen, setGenreDialogOpen] = useState(false);

  const descendants = useMemo(() => {
    if (!selectedGenreId) {
      return new Set(genres.map((genre) => genre.id));
    }

    const childrenByParent = new Map<string, string[]>();
    genres.forEach((genre) => {
      if (!genre.parentId) return;
      const list = childrenByParent.get(genre.parentId) ?? [];
      list.push(genre.id);
      childrenByParent.set(genre.parentId, list);
    });

    const result = new Set<string>([selectedGenreId]);
    const visit = (id: string) => {
      const children = childrenByParent.get(id);
      if (!children) return;
      children.forEach((childId) => {
        if (!result.has(childId)) {
          result.add(childId);
          visit(childId);
        }
      });
    };
    visit(selectedGenreId);
    return result;
  }, [selectedGenreId, genres]);

  const filteredBooks = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return books
      .filter((book) => descendants.has(book.genreId))
      .filter((book) => {
        if (!normalizedTerm) return true;
        const haystack = [
          book.title,
          book.author,
          book.description,
          ...book.tags,
          ...book.sections.map((section) => `${section.title} ${section.summary}`),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedTerm);
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [books, descendants, searchTerm]);

  const activeBook: Book | null = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? null,
    [books, selectedBookId],
  );

  const breadcrumbs = useMemo(
    () =>
      selectedGenreId ? getGenrePath(selectedGenreId, genres) : [],
    [selectedGenreId, genres],
  );

  return (
    <>
      <div className="app-shell">
        <Sidebar
          selectedGenreId={selectedGenreId}
          onSelectGenre={selectGenre}
          onCreateGenre={() => setGenreDialogOpen(true)}
        />
        <div className="app-main">
          <header className="app-header">
            <div className="header-left">
              <div>
                <h1>読書ジャーナル</h1>
                <p>表示中: {filteredBooks.length}冊</p>
              </div>
            </div>
            <div className="header-actions">
              <div className="search">
                <span className="material-symbol">search</span>
                <input
                  type="search"
                  placeholder="タイトル・著者・タグで検索"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <button
                className="primary"
                type="button"
                onClick={() => setBookDialogOpen(true)}
              >
                ＋ 本を追加
              </button>
            </div>
          </header>
          <main className="app-content">
            <BookGallery
              books={filteredBooks}
              selectedBookId={selectedBookId}
              onSelectBook={selectBook}
              onRequestCreate={() => setBookDialogOpen(true)}
            />
            <BookDetail book={activeBook} breadcrumbs={breadcrumbs} />
          </main>
        </div>
      </div>
      <AddBookDialog
        open={isBookDialogOpen}
        onClose={() => setBookDialogOpen(false)}
      />
      <AddGenreDialog
        open={isGenreDialogOpen}
        onClose={() => setGenreDialogOpen(false)}
      />
    </>
  );
}
