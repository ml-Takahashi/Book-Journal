import type { CSSProperties } from 'react';
import type { Book } from '../types';

interface BookGalleryProps {
  books: Book[];
  selectedBookId: string | null;
  onSelectBook: (id: string | null) => void;
  onRequestCreate: () => void;
}

export function BookGallery({
  books,
  selectedBookId,
  onSelectBook,
  onRequestCreate,
}: BookGalleryProps) {
  if (books.length === 0) {
    return (
      <section className="book-gallery empty">
        <p className="empty-title">まだ本が登録されていません。</p>
        <p className="empty-description">
          本を追加して、目次メモや気づきを整理し始めましょう。
        </p>
        <button className="primary" type="button" onClick={onRequestCreate}>
          ＋ 本を追加
        </button>
      </section>
    );
  }

  return (
    <section className="book-gallery">
      <div className="book-grid">
        {books.map((book) => {
          const isActive = book.id === selectedBookId;
          const updated = new Date(book.updatedAt).toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <button
              key={book.id}
              type="button"
              className={`book-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelectBook(book.id)}
              style={
                {
                  '--accent': book.coverColor,
                } as CSSProperties
              }
            >
              <div className="card-accent" />
              <div className="card-content">
                <h3>{book.title}</h3>
                <p className="author">{book.author}</p>
                <p className="description">{book.description}</p>
                <div className="tags">
                  {book.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="card-footer">
                <span className="material-symbol">schedule</span>
                最終更新 {updated}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
