export interface FAQ {
  id: string;
  title: string;
  category: string;
  views: number;
  content?: string;
  tags?: string[];
}

export type Category = 
  | "질문 Top 10"
  | "결제/배송"
  | "튜닝/리튠"
  | "수리 A/S"
  | "관리법"
  | "기술특징"
  | "레슨/교육"
  | "문의/제안";