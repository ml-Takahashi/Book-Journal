import type { Book, Genre } from '../types';

const now = new Date();

export const initialGenres: Genre[] = [
  { id: 'genre-fiction', name: 'Fiction', parentId: null },
  { id: 'genre-speculative', name: 'Speculative', parentId: 'genre-fiction' },
  { id: 'genre-nonfiction', name: 'Non-Fiction', parentId: null },
  { id: 'genre-design', name: 'Design', parentId: 'genre-nonfiction' },
  { id: 'genre-productivity', name: 'Productivity', parentId: 'genre-nonfiction' },
];

export const initialBooks: Book[] = [
  {
    id: 'book-invisible-archive',
    title: 'Invisible Archive',
    author: 'Elena Cruz',
    genreId: 'genre-speculative',
    description:
      'A collection of short stories that explore layered cities and the hidden systems that govern them.',
    tags: ['worldbuilding', 'short stories'],
    sections: [
      {
        id: 'section1',
        title: 'Key Themes',
        summary:
          'Explores memory, governance, and the tension between physical spaces and digital overlays.',
      },
      {
        id: 'section2',
        title: 'Memorable Cities',
        summary:
          'Highlights the City of Echoes and Glacier Port as standout settings with distinct rules.',
      },
      {
        id: 'section3',
        title: 'Takeaways',
        summary:
          'Useful for understanding how constraints can create compelling narrative frameworks.',
      },
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    coverColor: '#6c5ce7',
  },
  {
    id: 'book-interface-atlas',
    title: 'Interface Atlas',
    author: 'Monica Zhang',
    genreId: 'genre-design',
    description:
      'A visual guide to interface patterns that balance aesthetics with long-term maintainability.',
    tags: ['design systems', 'ui'],
    sections: [
      {
        id: 'section4',
        title: 'Pattern Framework',
        summary:
          'Provides a repeatable framework for documenting patterns, with emphasis on accessibility.',
      },
      {
        id: 'section5',
        title: 'Case Studies',
        summary:
          'Breaks down redesigns for productivity apps, showing how to keep complexity approachable.',
      },
      {
        id: 'section6',
        title: 'Implementation Notes',
        summary:
          'Offers guidelines for pairing design tokens with component APIs and QA checklists.',
      },
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    coverColor: '#00cec9',
  },
  {
    id: 'book-routine-architecture',
    title: 'Routine Architecture',
    author: 'Haruto Sato',
    genreId: 'genre-productivity',
    description:
      'Blueprints for designing sustainable habits with modular routines and built-in retrospectives.',
    tags: ['habits', 'systems thinking'],
    sections: [
      {
        id: 'section7',
        title: 'Cycle Planning',
        summary:
          'Introduces cadence mapping to balance energy, focus, and creative output across a week.',
      },
      {
        id: 'section8',
        title: 'Retrospective Rituals',
        summary:
          'Short debrief rituals to capture learnings without creating additional overhead.',
      },
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    coverColor: '#fdcb6e',
  },
];
