import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useBookContext } from '../../context/BookContext';
import { generateId } from '../../utils/id';
import { toSectionLabel } from '../../utils/sections';
import { Dialog } from './Dialog';

interface AddBookDialogProps {
  open: boolean;
  onClose: () => void;
}

interface SectionDraft {
  id: string;
  title: string;
  summary: string;
}

interface ChapterDraft {
  id: string;
  title: string;
  summary: string;
  sections: SectionDraft[];
}

const defaultAccentPalette = ['#6c5ce7', '#00cec9', '#fdcb6e', '#ff7675', '#0984e3'];

export function AddBookDialog({ open, onClose }: AddBookDialogProps) {
  const {
    state: { genres, selectedGenreId },
    addBook,
  } = useBookContext();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genreId, setGenreId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coverColor, setCoverColor] = useState(defaultAccentPalette[0]);
  const [chapters, setChapters] = useState<ChapterDraft[]>([
    {
      id: generateId(),
      title: '',
      summary: '',
      sections: [{ id: generateId(), title: '', summary: '' }],
    },
  ]);

  const hasGenres = genres.length > 0;

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setAuthor('');
    setDescription('');
    setTagsInput('');
    setCoverColor(
      defaultAccentPalette[
        Math.floor(Math.random() * defaultAccentPalette.length)
      ],
    );
    setChapters([
      {
        id: generateId(),
        title: '',
        summary: '',
        sections: [{ id: generateId(), title: '', summary: '' }],
      },
    ]);
    setGenreId(selectedGenreId ?? genres[0]?.id ?? '');
  }, [open, selectedGenreId, genres]);

  const handleChapterChange = (
    chapterId: string,
    key: 'title' | 'summary',
    value: string,
  ) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, [key]: value } : chapter,
      ),
    );
  };

  const handleRemoveChapter = (chapterId: string) => {
    setChapters((prev) => prev.filter((chapter) => chapter.id !== chapterId));
  };

  const handleAddChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        id: generateId(),
        title: '',
        summary: '',
        sections: [{ id: generateId(), title: '', summary: '' }],
      },
    ]);
  };

  const handleSectionChange = (
    chapterId: string,
    sectionId: string,
    key: 'title' | 'summary',
    value: string,
  ) => {
    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.id !== chapterId) return chapter;
        return {
          ...chapter,
          sections: chapter.sections.map((section) =>
            section.id === sectionId ? { ...section, [key]: value } : section,
          ),
        };
      }),
    );
  };

  const handleAddSection = (chapterId: string) => {
    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.id !== chapterId) return chapter;
        return {
          ...chapter,
          sections: [
            ...chapter.sections,
            { id: generateId(), title: '', summary: '' },
          ],
        };
      }),
    );
  };

  const handleRemoveSection = (chapterId: string, sectionId: string) => {
    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.id !== chapterId) return chapter;
        return {
          ...chapter,
          sections: chapter.sections.filter((section) => section.id !== sectionId),
        };
      }),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !author.trim() || !genreId) return;

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    addBook({
      title,
      author,
      genreId,
      description,
      tags,
      chapters: chapters.map((chapter) => ({
        title: chapter.title,
        summary: chapter.summary,
        sections: chapter.sections.map((section) => ({
          title: section.title,
          summary: section.summary,
        })),
      })),
      coverColor,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="本を追加"
      footer={
        <>
          <button type="button" className="ghost" onClick={onClose}>
            キャンセル
          </button>
          <button
            type="submit"
            form="add-book-form"
            className="primary"
            disabled={!hasGenres}
          >
            本を保存
          </button>
        </>
      }
    >
      {!hasGenres ? (
        <div className="empty-form">
          <p>本を追加する前に、少なくとも1つのジャンルを作成してください。</p>
        </div>
      ) : (
        <form id="add-book-form" className="form-stack" onSubmit={handleSubmit}>
          <label htmlFor="book-title">タイトル</label>
          <input
            id="book-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例： 不可視都市"
            required
            autoFocus
          />

          <label htmlFor="book-author">著者</label>
          <input
            id="book-author"
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="例： イタロ・カルヴィーノ"
            required
          />

          <label htmlFor="book-genre">ジャンル</label>
          <select
            id="book-genre"
            value={genreId}
            onChange={(event) => setGenreId(event.target.value)}
            required
          >
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          <label htmlFor="book-description">概要（任意）</label>
          <textarea
            id="book-description"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="どんな本なのか、誰から勧められたか、第一印象などを自由に記入してください。"
          />

          <label htmlFor="book-tags">タグ（カンマ区切り）</label>
          <input
            id="book-tags"
            type="text"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="例： 建築, 創造性, リーダーシップ"
          />

          <label htmlFor="book-color">アクセントカラー</label>
          <input
            id="book-color"
            type="color"
            value={coverColor}
            onChange={(event) => setCoverColor(event.target.value)}
          />

          <div className="section-controls">
            <div className="controls-header">
              <h3>初期章構成</h3>
              <button type="button" className="ghost" onClick={handleAddChapter}>
                ＋ 章を追加
              </button>
            </div>
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapter.id} className="chapter-draft">
                <div className="field-inline">
                  <label htmlFor={`chapter-title-${chapter.id}`}>
                    第{chapterIndex + 1}章
                  </label>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => handleRemoveChapter(chapter.id)}
                    aria-label="章を削除"
                  >
                    <span className="material-symbol">delete</span>
                  </button>
                </div>
                <input
                  id={`chapter-title-${chapter.id}`}
                  type="text"
                  value={chapter.title}
                  onChange={(event) =>
                    handleChapterChange(chapter.id, 'title', event.target.value)
                  }
                  placeholder="章のタイトル"
                />
                <textarea
                  id={`chapter-summary-${chapter.id}`}
                  rows={3}
                  value={chapter.summary}
                  onChange={(event) =>
                    handleChapterChange(chapter.id, 'summary', event.target.value)
                  }
                  placeholder="章の概要や目的を記入します。"
                />

                <div className="chapter-sections">
                  <div className="controls-header chapter-sections-controls">
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => handleAddSection(chapter.id)}
                    >
                      ＋ 節を追加
                    </button>
                  </div>
                  {chapter.sections.map((section, sectionIndex) => (
                    <div key={section.id} className="section-draft">
                      <div className="field-inline">
                        <label htmlFor={`section-title-${section.id}`}>
                          {toSectionLabel(sectionIndex + 1)}
                        </label>
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => handleRemoveSection(chapter.id, section.id)}
                          aria-label="節を削除"
                        >
                          <span className="material-symbol">delete</span>
                        </button>
                      </div>
                      <input
                        id={`section-title-${section.id}`}
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
                      <textarea
                        id={`section-summary-${section.id}`}
                        rows={3}
                        value={section.summary}
                        onChange={(event) =>
                          handleSectionChange(
                            chapter.id,
                            section.id,
                            'summary',
                            event.target.value,
                          )
                        }
                        placeholder="要約や引用、参考にしたいポイントなどを記入します。"
                      />
                    </div>
                  ))}
                  {chapter.sections.length === 0 && (
                    <div className="section-empty">
                      <p>節はまだありません。「節を追加」から作成しましょう。</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {chapters.length === 0 && (
              <div className="section-empty">
                <p>章はまだありません。「章を追加」から作成しましょう。</p>
              </div>
            )}
          </div>
        </form>
      )}
    </Dialog>
  );
}
