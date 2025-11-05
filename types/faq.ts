export interface FAQ {
  id: string;
  title: string;
  category: string;
  views: number;
  content?: string;
}

export type Category = 
  | "질문 TOP"
  | "결제"
  | "배송"
  | "튜닝"
  | "수리"
  | "악기관리"
  | "레슨"
  | "비즈니스 제안";

