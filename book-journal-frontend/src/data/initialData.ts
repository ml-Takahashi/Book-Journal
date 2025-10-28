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
    chapters: [
      {
        id: 'chapter-invisible-1',
        title: '都市を構成するレイヤー',
        summary:
          '記憶と統治が重なり合う都市構造を整理し、物理層とデジタル層のせめぎ合いが物語の緊張感を生む点に注目。',
        sections: [
          {
            id: 'section-invisible-1a',
            title: '物理層とデジタル層の干渉',
            summary:
              'エコーズの街では、住民の記憶ログが都市計画に直接反映され、意図しない都市変容が発生する。',
          },
          {
            id: 'section-invisible-1b',
            title: '統治モデルの比較',
            summary:
              '自治ドローンによる管理都市と、住民合議制の半自律都市を比較し、どちらも「制約」が創造性の源泉になっている。',
          },
        ],
      },
      {
        id: 'chapter-invisible-2',
        title: '印象的な都市と活用アイデア',
        summary:
          '物語に登場する象徴的な都市をケーススタディ化し、世界設定づくりへの応用ポイントを整理。',
        sections: [
          {
            id: 'section-invisible-2a',
            title: 'グレイシャー港の物流ループ',
            summary:
              '氷結海を利用した周回ルートが、都市全体のリズムを規定する。リソース制約からルールを抽出する実例。',
          },
          {
            id: 'section-invisible-2b',
            title: '創作への実践アイデア',
            summary:
              '自作の世界観設計でも、先に制約を決める「ルール先行設計」を取り入れることで、物語に厚みが加わる。',
          },
        ],
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
    chapters: [
      {
        id: 'chapter-interface-1',
        title: 'パターン体系と定義の作り方',
        summary:
          'パターンを抽象度別に棚卸しし、再利用性とアクセシビリティを両立させる定義づくりの観点をまとめる。',
        sections: [
          {
            id: 'section-interface-1a',
            title: 'アクセシビリティ中心の分類',
            summary:
              '色・コントラスト・モーションなどのガイドラインを軸に分類することで、誰でも再現可能なパターン記述テンプレートができる。',
          },
          {
            id: 'section-interface-1b',
            title: '用語統一のチェックポイント',
            summary:
              'コンポーネント名とドキュメントの用語を同期させる「語彙スタイルガイド」を用意し、設計・実装の齟齬を減らす。',
          },
        ],
      },
      {
        id: 'chapter-interface-2',
        title: 'ケーススタディと運用ノート',
        summary:
          '実プロダクトのリデザイン事例を分解し、移行期のリスクと運用プロセスを整理する。',
        sections: [
          {
            id: 'section-interface-2a',
            title: 'プロダクティビティアプリの分解',
            summary:
              '情報量の多いプロダクトで、コンポーネントAPIと権限管理を紐づけることで複雑さを扱いやすくしている。',
          },
          {
            id: 'section-interface-2b',
            title: '実装&QAチェックリスト',
            summary:
              'デザイントークンの変更点をdiffとして残し、リリース前にアクセシビリティ観点のQAを自動化する手順を記録。',
          },
        ],
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
    chapters: [
      {
        id: 'chapter-routine-1',
        title: '週間サイクルの設計',
        summary:
          'ケイデンスマップを使って1週間のエネルギー配分を可視化し、創造活動のピークに合わせてルーティンを再配置する。',
        sections: [
          {
            id: 'section-routine-1a',
            title: 'ケイデンスマップの書き方',
            summary:
              '集中・休息・実験の3カテゴリでブロック化し、色分けして過負荷な時間帯を発見する。',
          },
          {
            id: 'section-routine-1b',
            title: '予定の棚卸し手順',
            summary:
              '週初めに固定予定を並べ、残りの時間をテーマごとに割り当てることで「空き容量」を確保する。',
          },
        ],
      },
      {
        id: 'chapter-routine-2',
        title: '内省と改善の仕組み',
        summary:
          'ショートリトロスペクティブを習慣化し、学びを翌週の行動に反映させるためのテンプレートを準備する。',
        sections: [
          {
            id: 'section-routine-2a',
            title: '週次レトロの質問セット',
            summary:
              '「続ける・始める・やめる」の3質問で感情と行動を切り分け、改善アイデアを即メモに変換する。',
          },
          {
            id: 'section-routine-2b',
            title: '振り返りログ設計',
            summary:
              'Notionテンプレートでログを蓄積し、月次でタグ別に振り返ると傾向が把握しやすい。',
          },
        ],
      },
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    coverColor: '#fdcb6e',
  },
];
