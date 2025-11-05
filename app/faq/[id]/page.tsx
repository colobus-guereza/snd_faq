import { notFound } from "next/navigation";
import FAQDetail from "@/components/FAQDetail";
import { faqs } from "@/data/faqs";

export async function generateStaticParams() {
  return faqs.map((faq) => ({
    id: faq.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string }>;
}

export default async function FAQDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { category } = await searchParams;
  const faq = faqs.find((f) => f.id === id);

  if (!faq) {
    notFound();
  }

  return <FAQDetail faq={faq} returnCategory={category} />;
}