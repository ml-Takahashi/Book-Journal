import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useBookContext } from '../../context/BookContext';
import { Dialog } from './Dialog';

interface AddGenreDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddGenreDialog({ open, onClose }: AddGenreDialogProps) {
  const {
    state: { genres },
    addGenre,
  } = useBookContext();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName('');
      setParentId(null);
    }
  }, [open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    addGenre({ name, parentId });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="新しいジャンルを作成"
      footer={
        <>
          <button type="button" className="ghost" onClick={onClose}>
            キャンセル
          </button>
          <button type="submit" form="add-genre-form" className="primary">
            ジャンルを追加
          </button>
        </>
      }
    >
      <form id="add-genre-form" onSubmit={handleSubmit} className="form-stack">
        <label htmlFor="genre-name">ジャンル名</label>
        <input
          id="genre-name"
          type="text"
          autoFocus
          placeholder="例： ナレッジマネジメント"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="genre-parent">親フォルダー（任意）</label>
        <select
          id="genre-parent"
          value={parentId ?? ''}
          onChange={(event) =>
            setParentId(event.target.value ? event.target.value : null)
          }
        >
          <option value="">トップレベル</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <p className="helper">
          ジャンルは本棚のフォルダー構造を作ります。階層化すれば、自分の頭の中の整理方法をそのまま再現できます。
        </p>
      </form>
    </Dialog>
  );
}
