import type { Book, Genre } from '../types';

export interface GenreTreeNode extends Genre {
  children: GenreTreeNode[];
  books: Book[];
  totalBooks: number;
}

export function buildGenreTree(genres: Genre[], books: Book[]): GenreTreeNode[] {
  const map = new Map<string, GenreTreeNode>();

  genres.forEach((genre) => {
    map.set(genre.id, {
      ...genre,
      children: [],
      books: [],
      totalBooks: 0,
    });
  });

  books.forEach((book) => {
    const node = map.get(book.genreId);
    if (node) {
      node.books.push(book);
    }
  });

  const roots: GenreTreeNode[] = [];

  map.forEach((node) => {
    const totalBooks =
      node.books.length +
      node.children.reduce((acc, child) => acc + child.totalBooks, 0);
    node.totalBooks = totalBooks;
  });

  map.forEach((node) => {
    if (node.parentId) {
      const parent = map.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  const computeTotals = (node: GenreTreeNode): number => {
    if (node.children.length === 0) {
      node.totalBooks = node.books.length;
      return node.totalBooks;
    }

    const total =
      node.books.length +
      node.children.reduce((sum, child) => sum + computeTotals(child), 0);
    node.totalBooks = total;
    return total;
  };

  roots.forEach((root) => computeTotals(root));

  const sortNodes = (nodes: GenreTreeNode[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    nodes.forEach((child) => sortNodes(child.children));
  };

  sortNodes(roots);

  return roots;
}

export function getGenrePath(genreId: string, genres: Genre[]): Genre[] {
  const map = new Map(genres.map((genre) => [genre.id, genre]));
  const path: Genre[] = [];
  let current = map.get(genreId) ?? null;

  while (current) {
    path.unshift(current);
    current = current.parentId ? map.get(current.parentId) ?? null : null;
  }

  return path;
}
