import type { Book, Genre } from '../types';

const now = new Date();

export const initialGenres: Genre[] = [
  { id: 'genre-fiction', name: '小説', parentId: null },
  { id: 'genre-speculative', name: 'SF・ファンタジー', parentId: 'genre-fiction' },
  { id: 'genre-nonfiction', name: 'ノンフィクション', parentId: null },
  { id: 'genre-design', name: 'デザイン', parentId: 'genre-nonfiction' },
  { id: 'genre-productivity', name: '仕事術', parentId: 'genre-nonfiction' },
];

export const initialBooks: Book[] = [
  {
    id: 'book-invisible-archive',
    title: '幻影のアーカイブ',
    author: 'エレナ・クルス',
    genreId: 'genre-speculative',
    description:
      '幾重にも折り重なる都市と、それを支配する見えない仕組みを描いた短編連作集。都市設計や世界観づくりのヒントが詰まっています。',
    tags: ['世界設定', '短編'],
    sections: [
      {
        id: 'section1',
        title: '主要テーマ',
        summary:
          '記憶と統治、物理空間とデジタル層のせめぎ合いが、都市の成り立ちにどのような影響を与えるかを考察。',
      },
      {
        id: 'section2',
        title: '印象的な都市',
        summary:
          'エコーズの街やグレイシャー港など、独自のルールを持つ都市が象徴的。制約が物語の推進力になることを示す。',
      },
      {
        id: 'section3',
        title: '実践アイデア',
        summary:
          '制約条件をデザインに活かすことで、魅力的な物語構造を生み出せるという気づきを得る。',
      },
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    coverColor: '#6c5ce7',
  },
  {
    id: 'book-interface-atlas',
    title: 'インターフェース・アトラス',
    author: 'モニカ・チャン',
    genreId: 'genre-design',
    description:
      '長期運用を前提としたUIパターンを、ビジュアルと事例で体系的にまとめたガイド。美しさと保守性の両立がテーマ。',
    tags: ['デザインシステム', 'UI'],
    sections: [
      {
        id: 'section4',
        title: 'パターン整理フレーム',
        summary:
          'アクセシビリティを軸に、誰でも再現できるパターン記述テンプレートを提示。',
      },
      {
        id: 'section5',
        title: 'ケーススタディ',
        summary:
          'プロダクティビティ系アプリのリデザイン事例を分解し、複雑さを扱いやすくする工夫を解説。',
      },
      {
        id: 'section6',
        title: '実装ノート',
        summary:
          'デザイントークンとコンポーネントAPIの連携方法、QAチェックリストの作り方をガイド。',
      },
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    coverColor: '#00cec9',
  },
  {
    id: 'book-routine-architecture',
    title: 'ルーティン設計術',
    author: '佐藤陽人',
    genreId: 'genre-productivity',
    description:
      '持続可能な習慣を組み立てるための設計図。モジュール化したルーティンと内省の仕組みで、生活リズムを整える。',
    tags: ['習慣化', 'システム思考'],
    sections: [
      {
        id: 'section7',
        title: 'サイクル計画',
        summary:
          '1週間のリズムを可視化し、エネルギー・集中・創造性のバランスを保つ「ケイデンスマップ」を紹介。',
      },
      {
        id: 'section8',
        title: '内省の儀式',
        summary:
          '負担を増やさず学びを定着させるショートリトロスペクティブの手順を解説。',
      },
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    coverColor: '#fdcb6e',
  },
];
