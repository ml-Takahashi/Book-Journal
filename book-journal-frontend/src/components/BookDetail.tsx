import { useEffect, useMemo, useState } from 'react';
import { useBookContext } from '../context/BookContext';
import type { Book, BookSection, Genre } from '../types';
import { generateId } from '../utils/id';

interface BookDetailProps {
  book: Book | null;
  breadcrumbs: Genre[];
}

interface DraftState {
  description: string;
  tagsInput: string;
  sections: BookSection[];
}

const normalizeTags = (input: string | string[]) => {
  const list = Array.isArray(input) ? input : input.split(',');
  return list
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());
};

export function BookDetail({ book, breadcrumbs }: BookDetailProps) {
  const { updateBook } = useBookContext();
  const [draft, setDraft] = useState<DraftState | null>(null);

  useEffect(() => {
    if (!book) {
      setDraft(null);
      return;
    }
    setDraft({
      description: book.description,
      tagsInput: book.tags.join(', '),
      sections: book.sections.map((section) => ({ ...section })),
    });
  }, [book]);

  const isDirty = useMemo(() => {
    if (!book || !draft) return false;
    const draftTags = normalizeTags(draft.tagsInput);
    const currentTags = normalizeTags(book.tags);
    const sameTags =
      draftTags.length === currentTags.length &&
      draftTags.every((tag) => currentTags.includes(tag));

    const sameDescription = draft.description.trim() === book.description.trim();

    const sectionsMatch =
      draft.sections.length === book.sections.length &&
      draft.sections.every((section, index) => {
        const original = book.sections[index];
        return (
          section.title.trim() === original.title.trim() &&
          section.summary.trim() === original.summary.trim()
        );
      });

    return !(sameTags && sameDescription && sectionsMatch);
  }, [book, draft]);

  const handleSave = () => {
    if (!book || !draft) return;
    const tags = draft.tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    updateBook(book.id, {
      description: draft.description.trim(),
      tags,
      sections: draft.sections.map((section) => ({
        ...section,
        title: section.title.trim() || '無題のセクション',
        summary: section.summary.trim(),
      })),
    });
  };

  const handleReset = () => {
    if (!book) return;
    setDraft({
      description: book.description,
      tagsInput: book.tags.join(', '),
      sections: book.sections.map((section) => ({ ...section })),
    });
  };

  const handleSectionChange = (
    sectionId: string,
    key: 'title' | 'summary',
    value: string,
  ) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId ? { ...section, [key]: value } : section,
        ),
      };
    });
  };

  const handleSectionRemove = (sectionId: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, sections: prev.sections.filter((s) => s.id !== sectionId) };
    });
  };

  const handleAddSection = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: [
          ...prev.sections,
          {
            id: generateId(),
            title: '',
            summary: '',
          },
        ],
      };
    });
  };

  if (!book || !draft) {
    return (
      <section className="book-detail empty">
        <div className="empty-state">
          <span className="material-symbol hero">menu_book</span>
          <h2>本を選択してください</h2>
          <p>左のリストから本を選ぶか、新しい本を追加して整理を始めましょう。</p>
        </div>
      </section>
    );
  }

  const createdDate = new Date(book.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const updatedDate = new Date(book.updatedAt).toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <section className="book-detail">
      <header className="detail-header">
        <div>
          <p className="breadcrumbs">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.id}>
                {crumb.name}
                {index < breadcrumbs.length - 1 && ' • '}
              </span>
            ))}
          </p>
          <h2>{book.title}</h2>
          <p className="author">{book.author}</p>
        </div>
        <div className="meta">
          <span className="meta-item">
            <span className="material-symbol">calendar_today</span>
            追加日 {createdDate}
          </span>
          <span className="meta-item">
            <span className="material-symbol">schedule</span>
            最終更新 {updatedDate}
          </span>
        </div>
      </header>

      <div className="detail-body">
        <div className="field">
          <label htmlFor="description">概要</label>
          <textarea
            id="description"
            rows={5}
            value={draft.description}
            onChange={(event) =>
              setDraft((prev) =>
                prev ? { ...prev, description: event.target.value } : prev,
              )
            }
            placeholder="この本から得た学びや実践したいこと、印象に残った章などを記録しましょう。"
          />
        </div>

        <div className="field">
          <label htmlFor="tags">タグ</label>
          <input
            id="tags"
            type="text"
            value={draft.tagsInput}
            onChange={(event) =>
              setDraft((prev) =>
                prev ? { ...prev, tagsInput: event.target.value } : prev,
              )
            }
            placeholder="タグはカンマで区切ります（例： 読書術, デザイン思考）"
          />
        </div>

        <div className="sections-header">
          <h3>目次ハイライト</h3>
          <button type="button" className="ghost" onClick={handleAddSection}>
            ＋ セクションを追加
          </button>
        </div>

        <div className="sections">
          {draft.sections.map((section, index) => (
            <div key={section.id} className="section-card">
              <div className="section-header">
                <span className="section-index">{index + 1}</span>
                <input
                  type="text"
                  value={section.title}
                  onChange={(event) =>
                    handleSectionChange(section.id, 'title', event.target.value)
                  }
                  placeholder="セクション名"
                />
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => handleSectionRemove(section.id)}
                  aria-label="セクションを削除"
                >
                  <span className="material-symbol">delete</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={section.summary}
                onChange={(event) =>
                  handleSectionChange(section.id, 'summary', event.target.value)
                }
                placeholder="章の要点や引用、行動アイデアなどをまとめてください。"
              />
            </div>
          ))}
          {draft.sections.length === 0 && (
            <div className="section-empty">
              <p>セクションがまだありません。ハイライトを追加して自分だけの目次を作りましょう。</p>
              <button type="button" className="ghost" onClick={handleAddSection}>
                ＋ セクションを追加
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="detail-footer">
        <button
          type="button"
          className="ghost"
          onClick={handleReset}
          disabled={!isDirty}
        >
          元に戻す
        </button>
        <button
          type="button"
          className="primary"
          onClick={handleSave}
          disabled={!isDirty}
        >
          メモを保存
        </button>
      </footer>
    </section>
  );
}
