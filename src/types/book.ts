// P 1 — TypeScript nâng cao (generic, utility types, type guard)

export type Category = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  publishedYear: number;
  availableCopies: number;
  /** Đường dẫn ảnh bìa sách (tương đối so với /public) */
  coverUrl?: string;
}

// 1. Generic API Response format: { ok: true, data: T } | { ok: false, error: string }
export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Type Guard: isApiSuccess
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.ok === true && 'data' in response;
}

// Type Guard: isApiError
export function isApiError<T>(response: ApiResponse<T>): response is ApiError {
  return response.ok === false && typeof response.error === 'string';
}

// Utility Types used in application (yêu cầu ít nhất 2 utility types)
// 1. Record<Category, number>: Thống kê số lượng sách theo từng thể loại
export type CategoryStats = Record<Category, number>;

// 2. Pick<Book, 'id' | 'title' | 'author' | 'category'>: Tóm tắt thông tin sách đang mượn
export type BorrowedBookSummary = Pick<Book, 'id' | 'title' | 'author' | 'category'>;

// 3. Omit<Book, 'id'>: Dữ liệu sách khi thêm mới không bao gồm id
export type BookInput = Omit<Book, 'id'>;

// 4. Readonly<Book>: Đối tượng sách bất biến trong state
export type ImmutableBook = Readonly<Book>;
