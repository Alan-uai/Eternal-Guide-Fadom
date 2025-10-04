export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface WikiArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  imageId: string;
}
