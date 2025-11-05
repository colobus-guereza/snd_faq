import { FAQ } from "@/types/faq";

export const faqs: FAQ[] = [
  {
    id: "1",
    title: "결제는 어떤 방법으로 가능하나요?",
    category: "결제",
    views: 1250,
  },
  {
    id: "2",
    title: "배송 기간은 얼마나 걸리나요?",
    category: "배송",
    views: 980,
  },
  {
    id: "3",
    title: "기타 튜닝은 어떻게 하나요?",
    category: "튜닝",
    views: 850,
  },
  {
    id: "4",
    title: "악기 수리 서비스는 어떻게 받을 수 있나요?",
    category: "수리",
    views: 720,
  },
  {
    id: "5",
    title: "악기 관리 방법을 알려주세요.",
    category: "악기관리",
    views: 650,
  },
  {
    id: "6",
    title: "레슨은 어떻게 신청하나요?",
    category: "레슨",
    views: 580,
  },
  {
    id: "7",
    title: "비즈니스 제안은 어떻게 하나요?",
    category: "비즈니스 제안",
    views: 520,
  },
  {
    id: "8",
    title: "결제 취소는 어떻게 하나요?",
    category: "결제",
    views: 480,
  },
  {
    id: "9",
    title: "배송 추적은 어디서 하나요?",
    category: "배송",
    views: 450,
  },
  {
    id: "10",
    title: "피아노 튜닝 비용은 얼마인가요?",
    category: "튜닝",
    views: 400,
  },
  {
    id: "11",
    title: "악기 수리 기간은 얼마나 걸리나요?",
    category: "수리",
    views: 380,
  },
  {
    id: "12",
    title: "악기 보관 방법이 궁금해요.",
    category: "악기관리",
    views: 350,
  },
  {
    id: "13",
    title: "레슨 비용은 얼마인가요?",
    category: "레슨",
    views: 320,
  },
];

export const categories = [
  "질문 TOP",
  "결제",
  "배송",
  "튜닝",
  "수리",
  "악기관리",
  "레슨",
  "비즈니스 제안",
] as const;

