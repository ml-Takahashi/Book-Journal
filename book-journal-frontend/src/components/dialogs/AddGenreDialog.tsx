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
      title="Create a New Genre"
      footer={
        <>
          <button type="button" className="ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="add-genre-form" className="primary">
            Add Genre
          </button>
        </>
      }
    >
      <form id="add-genre-form" onSubmit={handleSubmit} className="form-stack">
        <label htmlFor="genre-name">Genre name</label>
        <input
          id="genre-name"
          type="text"
          autoFocus
          placeholder="e.g. Knowledge Management"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="genre-parent">Parent folder (optional)</label>
        <select
          id="genre-parent"
          value={parentId ?? ''}
          onChange={(event) =>
            setParentId(event.target.value ? event.target.value : null)
          }
        >
          <option value="">Top level</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <p className="helper">
          Genres build the folder structure for your library. You can nest them to
          mirror how you think about topics.
        </p>
      </form>
    </Dialog>
  );
}
