import booksReducer, {
  initialState,
  borrowBook,
  returnBook,
  setBorrowWarning,
  clearBorrowWarning,
  fetchBooks,
} from './booksSlice';
import type { BooksState } from './booksSlice';
import type { Book } from '../../types/book';

describe('booksSlice reducer', () => {
  const sampleBooks: Book[] = [
    {
      id: 'b-01',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'CNTT',
      publishedYear: 2008,
      availableCopies: 2,
    },
    {
      id: 'b-02',
      title: 'Kinh Tế Học Vi Mô',
      author: 'N. Gregory Mankiw',
      category: 'Kinh tế',
      publishedYear: 2020,
      availableCopies: 1,
    },
  ];

  // Test 1: Trả về state mặc định ban đầu
  it('1. trả về state mặc định ban đầu khi truyền action không xác định', () => {
    const action = { type: 'unknown/action' };
    const state = booksReducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  // Test 2: Xử lý 3 trạng thái của fetchBooks (pending, fulfilled, rejected)
  it('2. xử lý đúng 3 trạng thái của fetchBooks (pending, fulfilled, rejected)', () => {
    // 2.1 Pending
    const pendingState = booksReducer(initialState, { type: fetchBooks.pending.type });
    expect(pendingState.status).toBe('loading');
    expect(pendingState.error).toBeNull();

    // 2.2 Fulfilled
    const fulfilledState = booksReducer(pendingState, {
      type: fetchBooks.fulfilled.type,
      payload: sampleBooks,
    });
    expect(fulfilledState.status).toBe('succeeded');
    expect(fulfilledState.items).toEqual(sampleBooks);
    expect(fulfilledState.error).toBeNull();

    // 2.3 Rejected
    const rejectedState = booksReducer(pendingState, {
      type: fetchBooks.rejected.type,
      payload: 'Lỗi tải sách giả lập',
    });
    expect(rejectedState.status).toBe('failed');
    expect(rejectedState.error).toBe('Lỗi tải sách giả lập');
  });

  // Test 3: Xử lý mượn sách (borrowBook)
  it('3. xử lý borrowBook: giảm 1 số bản có sẵn và thêm id vào danh sách đang mượn', () => {
    const stateWithBooks: BooksState = {
      ...initialState,
      items: sampleBooks,
      borrowedBookIds: [],
    };

    const nextState = booksReducer(stateWithBooks, borrowBook('b-01'));

    // Số bản của sách b-01 giảm từ 2 xuống 1
    const book01 = nextState.items.find((b) => b.id === 'b-01');
    expect(book01?.availableCopies).toBe(1);

    // ID 'b-01' được thêm vào borrowedBookIds
    expect(nextState.borrowedBookIds).toContain('b-01');
    expect(nextState.borrowedBookIds.length).toBe(1);
  });

  // Test 4: Xử lý trả sách (returnBook)
  it('4. xử lý returnBook: tăng 1 số bản có sẵn và loại bỏ id khỏi danh sách đang mượn', () => {
    const stateWithBorrowedBook: BooksState = {
      ...initialState,
      items: [
        {
          id: 'b-01',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          category: 'CNTT',
          publishedYear: 2008,
          availableCopies: 1,
        },
      ],
      borrowedBookIds: ['b-01'],
    };

    const nextState = booksReducer(stateWithBorrowedBook, returnBook('b-01'));

    // Số bản của sách b-01 tăng từ 1 lên 2
    const book01 = nextState.items.find((b) => b.id === 'b-01');
    expect(book01?.availableCopies).toBe(2);

    // ID 'b-01' không còn trong borrowedBookIds
    expect(nextState.borrowedBookIds).not.toContain('b-01');
    expect(nextState.borrowedBookIds.length).toBe(0);
  });

  // Test 5: Xử lý cảnh báo (setBorrowWarning và clearBorrowWarning)
  it('5. xử lý setBorrowWarning và clearBorrowWarning chính xác', () => {
    const warningMessage = 'Mỗi sinh viên chỉ được mượn tối đa 3 cuốn!';
    const warnedState = booksReducer(initialState, setBorrowWarning(warningMessage));
    expect(warnedState.warning).toBe(warningMessage);

    const clearedState = booksReducer(warnedState, clearBorrowWarning());
    expect(clearedState.warning).toBeNull();
  });
});
