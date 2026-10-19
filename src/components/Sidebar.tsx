import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Library, BookOpen, BarChart3, Sun, Moon, BookMarked, ArrowRight, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector } from '../app/hooks';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const borrowedCount = useAppSelector((state) => state.books.borrowedBookIds.length);

  const navLinks = [
    {
      to: '/',
      label: 'Danh mục sách',
      icon: BookOpen,
      isActive: location.pathname === '/',
    },
    {
      to: '/stats',
      label: 'Thống kê',
      icon: BarChart3,
      isActive: location.pathname === '/stats',
    },
  ];

  return (
    <aside className="h-full flex flex-col justify-between p-5 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
      {/* Phần trên: Tiêu đề kèm Icon & Menu điều hướng */}
      <div className="space-y-6">
        {/* Thay Logo SVG bằng icon Library trực tiếp */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <Library className="w-6 h-6 text-zinc-900 dark:text-zinc-100 shrink-0 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                Mini Library
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 dark:text-zinc-400">
                Thư viện Khoa
              </span>
            </div>
          </Link>

          {/* Nút đóng dành cho giao diện Mobile Drawer */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Đóng thanh điều hướng"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Khối điều hướng menu dọc */}
        <nav className="space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Điều hướng
          </p>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  link.isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Phần dưới: Widget mượn sách (bỏ border, nền sáng hơn), Theme Toggle & Bản quyền */}
      <div className="pt-4 space-y-3">
        {/* Widget tóm tắt mượn sách được chuyển xuống dưới, bỏ border, nền sáng hơn */}
        <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Sách đang mượn
              </span>
            </div>
            <span
              className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                borrowedCount >= 3
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              }`}
            >
              {borrowedCount}/3
            </span>
          </div>

          {/* Thanh tiến độ mượn */}
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                borrowedCount >= 3 ? 'bg-red-600' : 'bg-zinc-900 dark:bg-zinc-100'
              }`}
              style={{ width: `${Math.min((borrowedCount / 3) * 100, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 pt-0.5">
            <span>
              {borrowedCount === 0
                ? 'Chưa mượn sách nào'
                : borrowedCount >= 3
                ? 'Đã đạt tối đa 3 cuốn'
                : `Có thể mượn thêm ${3 - borrowedCount} cuốn`}
            </span>
            <Link
              to="/stats"
              onClick={onClose}
              className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline inline-flex items-center gap-0.5"
            >
              Xem
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Nút chuyển đổi Theme (Yêu cầu 8) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-xl border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-100/90 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            ) : (
              <Sun className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            )}
            <span>Giao diện</span>
          </span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal">
            {theme === 'light' ? 'Chế độ Tối' : 'Chế độ Sáng'}
          </span>
        </button>

        {/* Thông tin chân trang */}
        <div className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed px-1">
          <p className="font-medium text-zinc-600 dark:text-zinc-400">Mini Library © 2026</p>
          <p>Lập trình Web Nâng cao</p>
        </div>
      </div>
    </aside>
  );
};
