import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { returnBook } from '../features/books/booksSlice';
import type { Category, CategoryStats, BorrowedBookSummary } from '../types/book';

const StatsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: books, borrowedBookIds } = useAppSelector((state) => state.books);

  // Yêu cầu kỹ thuật 1 & 6: Dùng Utility Type CategoryStats = Record<Category, number>
  const statsByCategory = useMemo<CategoryStats>(() => {
    const stats: CategoryStats = {
      CNTT: 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };

    books.forEach((book) => {
      if (stats[book.category] !== undefined) {
        stats[book.category] += 1;
      }
    });

    return stats;
  }, [books]);

  // Yêu cầu kỹ thuật 1: Dùng Utility Type BorrowedBookSummary = Pick<Book, ...>
  const borrowedBooks = useMemo<BorrowedBookSummary[]>(() => {
    return books
      .filter((book) => borrowedBookIds.includes(book.id))
      .map(({ id, title, author, category }) => ({ id, title, author, category }));
  }, [books, borrowedBookIds]);

  const categories: Category[] = ['CNTT', 'Kinh tế', 'Ngoại ngữ'];

  return (
    <div className="space-y-8">
      {/* Header trang Thống kê */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Thống Kê Thư Viện
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Tổng quan dữ liệu đầu sách theo từng thể loại và tình trạng mượn sách
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 justify-center px-4 py-2 text-sm font-medium rounded border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-600 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors w-fit focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh mục</span>
        </Link>
      </div>

      {/* Grid thống kê tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Số sách đang mượn */}
        <div className="p-5 rounded-lg border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm transition-all">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Sách đang mượn
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {borrowedBookIds.length}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">/ tối đa 3 cuốn</span>
          </div>
          <div className="mt-3 w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                borrowedBookIds.length >= 3 ? 'bg-red-600' : 'bg-zinc-900 dark:bg-zinc-100'
              }`}
              style={{ width: `${(borrowedBookIds.length / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Thống kê từng thể loại */}
        {categories.map((cat) => (
          <div
            key={cat}
            className="p-5 rounded-lg border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm transition-all"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Thể loại: {cat}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {statsByCategory[cat]}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">đầu sách</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Tổng số lượng các tựa sách chuyên ngành
            </p>
          </div>
        ))}
      </div>

      {/* Danh sách các cuốn sách đang mượn */}
      <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Chi tiết sách sinh viên đang mượn ({borrowedBooks.length})
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Danh sách sách hiện tại bạn đang giữ, hãy trả sách đúng hạn
            </p>
          </div>
        </div>

        {borrowedBooks.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
            Bạn chưa mượn cuốn sách nào.{' '}
            <Link to="/" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 font-medium">
              Khám phá và mượn sách ngay
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
            {borrowedBooks.map((book) => (
              <div
                key={book.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {book.category}
                    </span>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                      {book.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Tác giả: {book.author}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => dispatch(returnBook(book.id))}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer active:scale-95 transition-colors"
                  >
                    Trả sách
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
