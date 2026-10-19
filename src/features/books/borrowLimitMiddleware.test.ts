import { configureStore } from '@reduxjs/toolkit';
import booksReducer, { borrowBook } from './booksSlice';
import type { BooksState } from './booksSlice';
import { borrowLimitMiddleware } from './borrowLimitMiddleware';
import type { Book } from '../../types/book';

describe('borrowLimitMiddleware', () => {
  const sampleBooks: Book[] = [
    {
      id: 'b-01',
      title: 'Book 1',
      author: 'Author 1',
      category: 'CNTT',
      publishedYear: 2020,
      availableCopies: 2,
    },
    {
      id: 'b-02',
      title: 'Book 2',
      author: 'Author 2',
      category: 'Kinh tế',
      publishedYear: 2021,
      availableCopies: 1,
    },
    {
      id: 'b-03',
      title: 'Book 3',
      author: 'Author 3',
      category: 'Ngoại ngữ',
      publishedYear: 2022,
      availableCopies: 3,
    },
    {
      id: 'b-04',
      title: 'Book 4',
      author: 'Author 4',
      category: 'CNTT',
      publishedYear: 2023,
      availableCopies: 1,
    },
  ];

  const createTestStore = (preloadedState?: { books: BooksState }) => {
    return configureStore({
      reducer: {
        books: booksReducer,
      },
      preloadedState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(borrowLimitMiddleware),
    });
  };

  it('cho phép mượn sách bình thường khi chưa đạt 3 cuốn', () => {
    const store = createTestStore({
      books: {
        items: sampleBooks,
        borrowedBookIds: ['b-01'],
        status: 'succeeded',
        error: null,
        warning: null,
      },
    });

    store.dispatch(borrowBook('b-02'));

    const state = store.getState();
    expect(state.books.borrowedBookIds).toEqual(['b-01', 'b-02']);
    expect(state.books.warning).toBeNull();
  });

  it('chặn mượn sách và kích hoạt cảnh báo khi sinh viên đã mượn 3 cuốn', () => {
    const store = createTestStore({
      books: {
        items: sampleBooks,
        borrowedBookIds: ['b-01', 'b-02', 'b-03'],
        status: 'succeeded',
        error: null,
        warning: null,
      },
    });

    // Thử mượn cuốn thứ 4
    store.dispatch(borrowBook('b-04'));

    const state = store.getState();
    // Vẫn chỉ giữ 3 cuốn, không tăng lên 4
    expect(state.books.borrowedBookIds.length).toBe(3);
    expect(state.books.borrowedBookIds).not.toContain('b-04');
    // Cảnh báo được hiển thị đúng yêu cầu
    expect(state.books.warning).toContain('Mỗi sinh viên chỉ được mượn tối đa 3 cuốn');
  });

  it('chặn mượn sách khi sách đã được mượn trước đó', () => {
    const store = createTestStore({
      books: {
        items: sampleBooks,
        borrowedBookIds: ['b-01'],
        status: 'succeeded',
        error: null,
        warning: null,
      },
    });

    store.dispatch(borrowBook('b-01'));

    const state = store.getState();
    expect(state.books.borrowedBookIds).toEqual(['b-01']);
    expect(state.books.warning).toContain('Bạn đang mượn cuốn sách này rồi!');
  });
});
