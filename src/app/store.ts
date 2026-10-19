import { configureStore } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import booksReducer, { borrowBook, setBorrowWarning } from '../features/books/booksSlice';

// Custom Redux Middleware: Giới hạn mượn tối đa 3 cuốn sách cùng lúc
export const borrowLimitMiddleware: Middleware = (store) => (next) => (action) => {
  if (borrowBook.match(action)) {
    const state = store.getState() as RootState;
    const currentBorrowedCount = state.books.borrowedBookIds.length;
    const targetBookId = action.payload;

    // Yêu cầu 7: Mỗi sinh viên chỉ được mượn tối đa 3 cuốn cùng lúc; vượt quá thì chặn lại và hiện cảnh báo
    if (currentBorrowedCount >= 3) {
      store.dispatch(
        setBorrowWarning('Mỗi sinh viên chỉ được mượn tối đa 3 cuốn cùng lúc! Vui lòng trả sách trước khi mượn thêm.')
      );
      // Chặn hành động mượn sách không cho dispatch tiếp
      return;
    }

    // Kiểm tra nếu sách đã đang được mượn bởi sinh viên này
    if (state.books.borrowedBookIds.includes(targetBookId)) {
      store.dispatch(setBorrowWarning('Bạn đang mượn cuốn sách này rồi!'));
      return;
    }

    // Kiểm tra số bản còn lại
    const book = state.books.items.find((b) => b.id === targetBookId);
    if (book && book.availableCopies <= 0) {
      store.dispatch(setBorrowWarning('Sách này hiện đã hết bản sao có sẵn!'));
      return;
    }
  }

  return next(action);
};

export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(borrowLimitMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
