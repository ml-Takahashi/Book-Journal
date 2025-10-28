import { useEffect, useMemo, useState } from 'react';
import { useBookContext } from '../context/BookContext';
import type { Book, BookChapter, BookSection, Genre } from '../types';
import { generateId } from '../utils/id';
import { toSectionLabel } from '../utils/sections';

interface BookDetailProps {
  book: Book | null;
  breadcrumbs: Genre[];
  isFullscreen: boolean;
  onEnterFullscreen: () => void;
  onExitFullscreen: () => void;
}

interface DraftState {
  description: string;
  tagsInput: string;
  chapters: BookChapter[];
}

const normalizeTags = (input: string | string[]) => {
  const list = Array.isArray(input) ? input : input.split(',');
  return list
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());
};

const normalizeChaptersForCompare = (chapters: BookChapter[]) =>
  chapters.map((chapter) => ({
    title: chapter.title.trim(),
    summary: chapter.summary.trim(),
    sections: chapter.sections.map((section) => ({
      title: section.title.trim(),
      summary: section.summary.trim(),
    })),
  }));

export function BookDetail({
  book,
  breadcrumbs,
  isFullscreen,
  onEnterFullscreen,
  onExitFullscreen,
}: BookDetailProps) {
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
      chapters: book.chapters.map((chapter) => ({
        ...chapter,
        sections: chapter.sections.map((section) => ({ ...section })),
      })),
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

    const chaptersMatch =
      JSON.stringify(normalizeChaptersForCompare(draft.chapters)) ===
      JSON.stringify(normalizeChaptersForCompare(book.chapters));

    return !(sameTags && sameDescription && chaptersMatch);
  }, [book, draft]);

  const handleSave = () => {
    if (!book || !draft) return;
    const tags = draft.tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const chapters: BookChapter[] = draft.chapters
      .map((chapter) => {
        const cleanedSections: BookSection[] = chapter.sections
          .map((section) => ({
            ...section,
            title: section.title.trim(),
            summary: section.summary.trim(),
          }))
          .filter((section) => section.title || section.summary)
          .map((section) => ({
            ...section,
            title: section.title || '無題の節',
          }));

        const title = chapter.title.trim();
        const summary = chapter.summary.trim();

        if (!title && !summary && cleanedSections.length === 0) {
          return null;
        }

        return {
          ...chapter,
          title: title || '無題の章',
          summary,
          sections: cleanedSections,
        };
      })
      .filter((chapter): chapter is BookChapter => chapter !== null);

    updateBook(book.id, {
      description: draft.description.trim(),
      tags,
      chapters,
    });
  };

  const handleReset = () => {
    if (!book) return;
    setDraft({
      description: book.description,
      tagsInput: book.tags.join(', '),
      chapters: book.chapters.map((chapter) => ({
        ...chapter,
        sections: chapter.sections.map((section) => ({ ...section })),
      })),
    });
  };

  const handleChapterChange = (
    chapterId: string,
    key: 'title' | 'summary',
    value: string,
  ) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        chapters: prev.chapters.map((chapter) =>
          chapter.id === chapterId ? { ...chapter, [key]: value } : chapter,
        ),
      };
    });
  };

  const handleAddChapter = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        chapters: [
          ...prev.chapters,
          {
            id: generateId(),
            title: '',
            summary: '',
            sections: [{ id: generateId(), title: '', summary: '' }],
          },
        ],
      };
    });
  };

  const handleRemoveChapter = (chapterId: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        chapters: prev.chapters.filter((chapter) => chapter.id !== chapterId),
      };
    });
  };

  const handleSectionChange = (
    chapterId: string,
    sectionId: string,
    key: 'title' | 'summary',
    value: string,
  ) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        chapters: prev.chapters.map((chapter) => {
          if (chapter.id !== chapterId) return chapter;
          return {
            ...chapter,
            sections: chapter.sections.map((section) =>
              section.id === sectionId ? { ...section, [key]: value } : section,
            ),
          };
        }),
      };
    });
  };

  const handleAddSection = (chapterId: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        chapters: prev.chapters.map((chapter) => {
          if (chapter.id !== chapterId) return chapter;
          return {
            ...chapter,
            sections: [
              ...chapter.sections,
              { id: generateId(), title: '', summary: '' },
            ],
          };
        }),
      };
    });
  };

  const handleSectionRemove = (chapterId: string, sectionId: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        chapters: prev.chapters.map((chapter) => {
          if (chapter.id !== chapterId) return chapter;
          return {
            ...chapter,
            sections: chapter.sections.filter((section) => section.id !== sectionId),
          };
        }),
      };
    });
  };

  if (!book || !draft) {
    return (
      <section className={`book-detail empty${isFullscreen ? ' fullscreen' : ''}`}>
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

  const fullscreenToggle = () => {
    if (isFullscreen) {
      onExitFullscreen();
    } else {
      onEnterFullscreen();
    }
  };

  return (
    <section className={`book-detail${isFullscreen ? ' fullscreen' : ''}`}>
      <header className="detail-header">
        <div className="detail-headline">
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
          <div className="detail-actions">
            <button
              type="button"
              className="ghost"
              onClick={fullscreenToggle}
            >
              <span className="material-symbol">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
              {isFullscreen ? '分割表示に戻す' : '全画面で表示'}
            </button>
          </div>
        </div>
        <div className="detail-toolbar">
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

        <div className="chapters-header sections-header">
          <h3>章と節</h3>
          <button type="button" className="ghost" onClick={handleAddChapter}>
            ＋ 章を追加
          </button>
        </div>

        <div className="chapters">
          {draft.chapters.map((chapter, chapterIndex) => (
            <div key={chapter.id} className="chapter-card">
              <div className="chapter-header">
                <div className="chapter-title-group">
                  <span className="chapter-index">第{chapterIndex + 1}章</span>
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(event) =>
                      handleChapterChange(chapter.id, 'title', event.target.value)
                    }
                    placeholder="章のタイトル"
                  />
                </div>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => handleRemoveChapter(chapter.id)}
                  aria-label="章を削除"
                >
                  <span className="material-symbol">delete</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={chapter.summary}
                onChange={(event) =>
                  handleChapterChange(chapter.id, 'summary', event.target.value)
                }
                placeholder="章の概要や目的を記入します。"
              />

              <div className="chapter-sections-header sections-header">
                <button
                  type="button"
                  className="ghost"
                  onClick={() => handleAddSection(chapter.id)}
                >
                  ＋ 節を追加
                </button>
              </div>

              <div className="chapter-sections">
                {chapter.sections.map((section, sectionIndex) => (
                  <div key={section.id} className="section-card">
                    <div className="section-header">
                      <span className="section-index">
                        {toSectionLabel(sectionIndex + 1)}
                      </span>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(event) =>
                          handleSectionChange(
                            chapter.id,
                            section.id,
                            'title',
                            event.target.value,
                          )
                        }
                        placeholder="節のタイトル"
                      />
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => handleSectionRemove(chapter.id, section.id)}
                        aria-label="節を削除"
                      >
                        <span className="material-symbol">delete</span>
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={section.summary}
                      onChange={(event) =>
                        handleSectionChange(
                          chapter.id,
                          section.id,
                          'summary',
                          event.target.value,
                        )
                      }
                      placeholder="章の要点や引用、行動アイデアなどをまとめてください。"
                    />
                  </div>
                ))}
                {chapter.sections.length === 0 && (
                  <div className="section-empty">
                    <p>節がまだありません。ハイライトを追加して自分だけの目次を作りましょう。</p>
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => handleAddSection(chapter.id)}
                    >
                      ＋ 節を追加
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {draft.chapters.length === 0 && (
            <div className="chapter-empty">
              <p>章がまだありません。「章を追加」から構成を作成しましょう。</p>
              <button type="button" className="ghost" onClick={handleAddChapter}>
                ＋ 章を追加
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
