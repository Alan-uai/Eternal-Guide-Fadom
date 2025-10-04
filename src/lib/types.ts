export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface WikiArticleTable {
  headers: string[];
  rows: Record<string, string | number>[];
}

export interface WikiArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  imageId: string;
  tables?: Record<string, WikiArticleTable>;
}
