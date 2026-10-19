import React, { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  borrowBook,
  returnBook,
  clearBorrowWarning,
  fetchBooks,
} from '../features/books/booksSlice';
import { BookCard } from '../features/books/BookCard';
import { useFilterStore } from '../stores/filterStore';
import type { CategoryFilter } from '../stores/filterStore';
import { useDebounce } from '../hooks/useDebounce';

const CATEGORIES: CategoryFilter[] = ['Tất cả', 'CNTT', 'Kinh tế', 'Ngoại ngữ'];

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: books, borrowedBookIds, status, error, warning } = useAppSelector(
    (state) => state.books
  );

  // Lấy state và action từ Zustand store
  const { keyword, category, setKeyword, setCategory, resetFilters } = useFilterStore();

  // P 2 & 5 — Custom hook generic useDebounce với delay 300ms cho ô tìm kiếm
  const debouncedKeyword = useDebounce<string>(keyword, 300);

  // P 5 — Tối ưu hiệu năng: tính toán danh sách sách sau khi lọc bằng useMemo
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // 1. Lọc theo thể loại
      const matchesCategory =
        category === 'Tất cả' || (book.category as CategoryFilter) === category;

      // 2. Tìm kiếm theo tên sách hoặc tác giả (không phân biệt hoa thường)
      const cleanKeyword = debouncedKeyword.trim().toLowerCase();
      const matchesKeyword =
        cleanKeyword === '' ||
        book.title.toLowerCase().includes(cleanKeyword) ||
        book.author.toLowerCase().includes(cleanKeyword);

      return matchesCategory && matchesKeyword;
    });
  }, [books, category, debouncedKeyword]);

  // P 5 — Tối ưu hiệu năng: các handler truyền xuống bọc bằng useCallback
  const handleBorrow = useCallback(
    (id: string) => {
      dispatch(borrowBook(id));
    },
    [dispatch]
  );

  const handleReturn = useCallback(
    (id: string) => {
      dispatch(returnBook(id));
    },
    [dispatch]
  );

  const handleRetry = useCallback(() => {
    dispatch(fetchBooks(false));
  }, [dispatch]);

  const handleSimulateError = useCallback(() => {
    dispatch(fetchBooks(true));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Cảnh báo khi vượt quá giới hạn mượn 3 cuốn sách (từ Redux middleware) */}
      {warning && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 p-4 rounded-lg border border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">⚠ Cảnh báo:</span>
            <span className="text-sm">{warning}</span>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearBorrowWarning())}
            className="text-xs font-semibold underline hover:opacity-80 cursor-pointer ml-auto shrink-0"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Thanh công cụ tìm kiếm và lọc thể loại */}
      <section className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          {/* Ô tìm kiếm có debounce 300ms */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm sách theo tên sách hoặc tác giả..."
              className="w-full h-10 px-4 text-sm rounded border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-colors"
              aria-label="Tìm kiếm sách theo tên hoặc tác giả"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                aria-label="Xoá từ khoá tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Nút giả lập lỗi API có chiều cao bằng đúng ô tìm kiếm (h-10) */}
          <button
            type="button"
            onClick={handleSimulateError}
            title="Nhấn để kiểm tra thông báo lỗi khi API thất bại theo Yêu cầu 1"
            className="h-10 px-4 text-xs font-medium rounded border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer shrink-0 flex items-center justify-center whitespace-nowrap focus:outline-none"
          >
            Giả lập lỗi API
          </button>
        </div>

        {/* Bộ lọc thể loại: Tất cả / CNTT / Kinh tế / Ngoại ngữ */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mr-1">
            Thể loại:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            );
          })}

          {(keyword !== '' || category !== 'Tất cả') && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline ml-auto cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </section>

      {/* Trạng thái 1: Đang tải... (Loading) */}
      {status === 'loading' && (
        <div className="p-12 text-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="inline-block animate-pulse text-base font-medium text-zinc-700 dark:text-zinc-300">
            Đang tải danh sách sách từ thư viện (khoảng 500ms)...
          </div>
        </div>
      )}

      {/* Trạng thái 2: Lỗi (Failed) */}
      {status === 'failed' && (
        <div className="p-8 text-center rounded-lg border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 space-y-3">
          <p className="font-semibold text-base">Đã xảy ra lỗi khi tải sách!</p>
          <p className="text-sm">{error || 'Không thể kết nối đến máy chủ thư viện.'}</p>
          <div>
            <button
              type="button"
              onClick={handleRetry}
              className="px-4 py-2 text-xs font-semibold rounded bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 cursor-pointer transition-colors"
            >
              Thử lại ngay
            </button>
          </div>
        </div>
      )}

      {/* Trạng thái 3: Hiển thị danh sách sách thành công */}
      {status === 'succeeded' && (
        <>
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>
              Tìm thấy <strong className="text-zinc-900 dark:text-zinc-100">{filteredBooks.length}</strong> cuốn sách
            </span>
            <span>
              Đang mượn:{' '}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {borrowedBookIds.length}/3
              </strong>{' '}
              cuốn
            </span>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="p-12 text-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <p className="text-sm">Không tìm thấy cuốn sách nào khớp với điều kiện tìm kiếm.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 px-3 py-1.5 text-xs font-medium rounded border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer transition-colors focus:outline-none"
              >
                Xoá bộ lọc tìm kiếm
              </button>
            </div>
          ) : (
            // P 5: Key không dùng index (dùng book.id)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isBorrowed={borrowedBookIds.includes(book.id)}
                  onBorrow={handleBorrow}
                  onReturn={handleReturn}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
