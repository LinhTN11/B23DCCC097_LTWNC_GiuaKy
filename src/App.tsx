import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Menu, Sun, Moon, Library } from 'lucide-react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchBooks } from './features/books/booksSlice';
import { useTheme } from './context/ThemeContext';
import { HomePage } from './pages/HomePage';
import { Sidebar } from './components/Sidebar';

// P 5 — Tối ưu hiệu năng: trang Thống kê được lazy load bằng React.lazy + Suspense
const StatsPage = lazy(() => import('./pages/StatsPage'));

const MobileHeader: React.FC<{ onOpenMenu: () => void }> = ({ onOpenMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const borrowedCount = useAppSelector((state) => state.books.borrowedBookIds.length);

  return (
    <header className="md:hidden sticky top-0 z-40 h-14 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Mở menu điều hướng"
          className="p-1.5 -ml-1 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <Library className="w-5 h-5 text-zinc-900 dark:text-zinc-100 shrink-0" />
          <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">
            Mini Library
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/stats"
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-transparent bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
        >
          <span>Mượn:</span>
          <span
            className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
              borrowedCount >= 3
                ? 'bg-red-600 text-white'
                : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            }`}
          >
            {borrowedCount}/3
          </span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
          className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Yêu cầu 1: Khi khởi động app, lấy danh sách sách từ API giả lập (trễ khoảng 500ms)
  useEffect(() => {
    dispatch(fetchBooks(false));
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Header cho thiết bị di động */}
      <MobileHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />

      {/* Drawer trượt cho thiết bị di động */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Lớp nền mờ khi mở Drawer */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Nội dung Sidebar trên Mobile */}
          <div className="relative w-72 max-w-[80vw] h-full z-10 shadow-2xl">
            <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Sidebar dọc cố định trên màn hình Desktop (md trở lên) */}
      <div className="hidden md:block w-64 lg:w-72 shrink-0 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Khu vực nội dung chính */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Suspense
            fallback={
              <div className="py-20 text-center">
                <div className="inline-block px-4 py-2 text-sm font-medium rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 animate-pulse">
                  Đang tải trang Thống kê (Lazy loading)...
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/stats" element={<StatsPage />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-4 px-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Mini Library © 2026 — Lập trình Web Nâng cao (LTWNC)
        </footer>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
