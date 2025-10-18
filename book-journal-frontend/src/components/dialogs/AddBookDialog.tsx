import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useBookContext } from '../../context/BookContext';
import { generateId } from '../../utils/id';
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
  const [sections, setSections] = useState<SectionDraft[]>([
    { id: generateId(), title: '', summary: '' },
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
    setSections([{ id: generateId(), title: '', summary: '' }]);
    setGenreId(selectedGenreId ?? genres[0]?.id ?? '');
  }, [open, selectedGenreId, genres]);

  const handleSectionChange = (
    id: string,
    key: 'title' | 'summary',
    value: string,
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, [key]: value } : section,
      ),
    );
  };

  const handleRemoveSection = (id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
  };

  const handleAddSection = () => {
    setSections((prev) => [...prev, { id: generateId(), title: '', summary: '' }]);
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
      sections: sections.map((section) => ({
        title: section.title,
        summary: section.summary,
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
              <h3>初期セクション</h3>
              <button type="button" className="ghost" onClick={handleAddSection}>
                ＋ セクションを追加
              </button>
            </div>
            {sections.map((section, index) => (
              <div key={section.id} className="section-draft">
                <div className="field-inline">
                  <label htmlFor={`section-title-${section.id}`}>
                    セクション {index + 1}
                  </label>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => handleRemoveSection(section.id)}
                    aria-label="セクションを削除"
                  >
                    <span className="material-symbol">delete</span>
                  </button>
                </div>
                <input
                  id={`section-title-${section.id}`}
                  type="text"
                  value={section.title}
                  onChange={(event) =>
                    handleSectionChange(section.id, 'title', event.target.value)
                  }
                  placeholder="セクション名"
                />
                <textarea
                  id={`section-summary-${section.id}`}
                  rows={3}
                  value={section.summary}
                  onChange={(event) =>
                    handleSectionChange(section.id, 'summary', event.target.value)
                  }
                  placeholder="要約や引用、参考にしたいポイントなどを記入します。"
                />
              </div>
            ))}
            {sections.length === 0 && (
              <div className="section-empty">
                <p>セクションはまだありません。「セクションを追加」から作成しましょう。</p>
              </div>
            )}
          </div>
        </form>
      )}
    </Dialog>
  );
}
