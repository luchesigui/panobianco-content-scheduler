import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Content Scheduler",
  description: "Área administrativa do Content Scheduler",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header da área admin */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin - Content Scheduler
              </h1>
            </div>
            <nav className="flex space-x-4">
              <a
                href="/calendar"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Calendário
              </a>
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Início
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Sidebar e conteúdo principal */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              <a
                href="/admin"
                className="text-gray-700 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              >
                <svg
                  className="text-gray-500 mr-3 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z"
                  />
                </svg>
                Dashboard
              </a>
              <a
                href="/admin/agendamento-manual"
                className="text-gray-700 hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              >
                <svg
                  className="text-gray-500 mr-3 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Agendamento Manual
              </a>
            </div>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}