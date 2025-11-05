export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 rounded-full bg-blue-600">
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              고객센터
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              자주 묻는 질문
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              피해 사건 신고
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              토스의 보안
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

