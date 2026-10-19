import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Book } from '../../types/book';
import { isApiSuccess } from '../../types/book';
import { fetchBooksApi } from '../../api/booksApi';

export interface BooksState {
  items: Book[];
  borrowedBookIds: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  warning: string | null;
}

export const initialState: BooksState = {
  items: [],
  borrowedBookIds: [],
  status: 'idle',
  error: null,
  warning: null,
};

// createAsyncThunk xử lý gọi API với 3 trạng thái pending / fulfilled / rejected
export const fetchBooks = createAsyncThunk<Book[], boolean | undefined>(
  'books/fetchBooks',
  async (shouldFail = false, { rejectWithValue }) => {
    const response = await fetchBooksApi(shouldFail);
    // Sử dụng type guard isApiSuccess để phân biệt 2 trường hợp thành công và thất bại
    if (isApiSuccess(response)) {
      return response.data;
    } else {
      return rejectWithValue(response.error);
    }
  }
);

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const book = state.items.find((b) => b.id === bookId);
      if (book && book.availableCopies > 0 && !state.borrowedBookIds.includes(bookId)) {
        book.availableCopies -= 1;
        state.borrowedBookIds.push(bookId);
        state.warning = null;
      }
    },
    returnBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const book = state.items.find((b) => b.id === bookId);
      if (book && state.borrowedBookIds.includes(bookId)) {
        book.availableCopies += 1;
        state.borrowedBookIds = state.borrowedBookIds.filter((id) => id !== bookId);
        state.warning = null;
      }
    },
    setBorrowWarning: (state, action: PayloadAction<string>) => {
      state.warning = action.payload;
    },
    clearBorrowWarning: (state) => {
      state.warning = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Trạng thái pending
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // 2. Trạng thái fulfilled
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      // 3. Trạng thái rejected
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Lỗi khi tải danh sách sách';
      });
  },
});

export const { borrowBook, returnBook, setBorrowWarning, clearBorrowWarning } = booksSlice.actions;

export default booksSlice.reducer;
