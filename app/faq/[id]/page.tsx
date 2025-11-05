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
}

export default async function FAQDetailPage({ params }: PageProps) {
  const { id } = await params;
  const faq = faqs.find((f) => f.id === id);

  if (!faq) {
    notFound();
  }

  return <FAQDetail faq={faq} />;
}