import React, { memo, useState } from 'react';
import type { Book } from '../../types/book';

export interface BookCardProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}

// P 5 — Toi uu hieu nang: component hien thi 1 cuon sach boc React.memo
const BookCardComponent: React.FC<BookCardProps> = ({
  book,
  isBorrowed,
  onBorrow,
  onReturn,
}) => {
  const isOutOfStock = book.availableCopies === 0;
  const [imgError, setImgError] = useState(false);

  return (
    <article
      data-testid={`book-card-${book.id}`}
      className="flex gap-4 p-4 rounded-lg border border-transparent hover:border-zinc-400 dark:hover:border-zinc-700 focus-within:border-zinc-400 dark:focus-within:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm transition-all"
    >
      {book.coverUrl && !imgError ? (
        <div className="shrink-0 w-[72px] h-[104px] rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={book.coverUrl}
            alt={`Bia sach ${book.title}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="shrink-0 w-[72px] h-[104px] rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-2xl select-none">
          📖
        </div>
      )}

      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <span className="inline-block px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
              {book.category}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
              Năm XB: {book.publishedYear}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
            {book.title}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">
            <span className="font-medium text-zinc-800 dark:text-zinc-300">{book.author}</span>
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Số bản còn: </span>
            <span
              data-testid={`copies-${book.id}`}
              className={`font-semibold ${
                isOutOfStock
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {book.availableCopies}
            </span>
          </div>

          <div>
            {isBorrowed ? (
              <button
                type="button"
                onClick={() => onReturn(book.id)}
                className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded bg-red-600 hover:bw-red-700 text-white transition-colors cursor-pointer active:scale-95"
                aria-label={`Trả sách ${book.title}`}
              >
                Trả
              </button>
            ) : (
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => onBorrow(book.id)}
                className={`inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  isOutOfStock
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 cursor-pointer active:scale-95'
                }`}
                aria-label={`Mượn sách ${book.title}`}
              >
                Mượn
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export const BookCard = memo(BookCardComponent);
