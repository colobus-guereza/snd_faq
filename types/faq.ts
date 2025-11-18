export interface FAQ {
  id: string;
  title: string;
  category: string;
  views: number;
  content?: string;
  tags?: string[];
}

export type Category =
  | "기술특징"
  | "튜닝리튠"
  | "교육레슨"
  | "고객지원";