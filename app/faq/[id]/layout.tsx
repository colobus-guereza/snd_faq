// FAQ 상세 페이지는 최상위 레이아웃의 CommonLayout을 사용하므로 별도 레이아웃 불필요
export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
