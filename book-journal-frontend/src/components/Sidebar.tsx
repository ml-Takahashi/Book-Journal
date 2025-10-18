import { useMemo } from 'react';
import { useBookContext } from '../context/BookContext';
import { buildGenreTree } from '../utils/genreTree';
import { GenreTree } from './GenreTree';

interface SidebarProps {
  selectedGenreId: string | null;
  onSelectGenre: (id: string | null) => void;
  onCreateGenre: () => void;
}

export function Sidebar({
  selectedGenreId,
  onSelectGenre,
  onCreateGenre,
}: SidebarProps) {
  const {
    state: { genres, books },
  } = useBookContext();

  const tree = useMemo(
    () => buildGenreTree(genres, books),
    [genres, books],
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>ジャンル</h2>
        <button className="ghost" type="button" onClick={onCreateGenre}>
          ＋
        </button>
      </div>
      <nav className="genre-nav">
        <button
          type="button"
          className={`genre-item ${selectedGenreId === null ? 'active' : ''}`}
          onClick={() => onSelectGenre(null)}
        >
          <div className="genre-label">
            <span className="material-symbol">library_books</span>
            すべての本
          </div>
        </button>
        <GenreTree
          nodes={tree}
          activeId={selectedGenreId}
          onSelect={onSelectGenre}
        />
      </nav>
    </aside>
  );
}
