# B23DCCC097_LTWNC_GiuaKy

## Mini Library — Ứng Dụng Tra Cứu & Quản Lý Mượn/Trả Sách

Ứng dụng web hỗ trợ sinh viên tra cứu và mượn/trả sách chuyên ngành của khoa, giải quyết bài toán quản lý ghi chép thủ công. Dự án được xây dựng với cấu trúc chuẩn **Feature-based**, tuân thủ nghiêm ngặt các nguyên tắc nâng cao của **React**, **TypeScript**, **Redux Toolkit**, **Zustand**, và **Tối ưu hiệu năng**.

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite + TypeScript (Strict mode, `verbatimModuleSyntax`)
- **State Management**:
  - **Redux Toolkit**: Quản lý danh sách sách, sách đang mượn, trạng thái gọi API và giới hạn mượn bằng Middleware.
  - **Zustand**: Quản lý bộ lọc tìm kiếm (từ khoá và thể loại).
  - **React Context**: Quản lý Theme Sáng / Tối với `useMemo` và custom hook `useTheme()`.
- **Routing**: React Router v7 (Lazy loading trang Thống kê qua `React.lazy` + `Suspense`).
- **Styling**: Tailwind CSS v4 (Thiết kế tối giản đơn sắc Trắng - Đen, chuẩn typography, không dùng gradient lòe loẹt).
- **Icons**: Lucide React.
- **Testing**: Jest + ts-jest + React Testing Library + userEvent (100% test cases xanh).

---

## 📁 Cấu Trúc Thư Mục (Feature-Based Structure)

```text
src/
├── api/
│   └── booksApi.ts               # API giả lập Promise + setTimeout 500ms, hỗ trợ tham số giả lập lỗi
├── app/
│   ├── hooks.ts                  # Typed hooks useAppDispatch, useAppSelector
│   └── store.ts                  # Redux store & đăng ký borrowLimitMiddleware
├── components/
│   └── Sidebar.tsx               # Sidebar điều hướng dọc, widget mượn sách & Theme toggle
├── context/
│   └── ThemeContext.tsx          # React Context quản lý Theme Sáng/Tối với useMemo & useTheme()
├── features/
│   └── books/                    # Feature module quản lý sách
│       ├── BookCard.tsx          # Component thẻ sách bọc React.memo
│       ├── BookCard.test.tsx     # RTL test cases với userEvent (hiển thị, click Mượn, disabled khi hết bản)
│       ├── booksSlice.ts         # createSlice + createAsyncThunk (đủ 3 trạng thái pending/fulfilled/rejected)
│       ├── booksSlice.test.ts    # Unit tests cho reducer booksSlice
│       ├── borrowLimitMiddleware.ts      # Custom Redux middleware chặn mượn > 3 cuốn
│       └── borrowLimitMiddleware.test.ts # Tests cho custom middleware
├── hooks/
│   ├── useDebounce.ts            # Custom hook generic useDebounce<T> (300ms)
│   └── useDebounce.test.ts       # Test useDebounce với fake timers
├── pages/
│   ├── HomePage.tsx              # Trang danh mục sách (tìm kiếm, lọc thể loại, mượn/trả, useMemo)
│   └── StatsPage.tsx             # Trang thống kê /stats (đầu sách theo thể loại, sách đang mượn)
├── stores/
│   └── filterStore.ts            # Zustand store quản lý bộ lọc tìm kiếm
├── types/
│   └── book.ts                   # Generic ApiResponse<T>, type guards, Utility Types (Record, Pick, Omit, Readonly)
├── App.tsx                       # Main layout, Navigation, lazy-loaded StatsPage
├── index.css                     # Tailwind CSS & Dark mode variant
└── main.tsx                      # Root provider
```

---

## 🎯 Bảng Đối Chiếu Yêu Cầu Kỹ Thuật (P 1 – P 6)

| Phần | Nội dung yêu cầu | Cài đặt thực tế trong dự án |
| :--- | :--- | :--- |
| **P 1** | **TypeScript nâng cao** | • **Generic**: `ApiResponse<T> = ApiSuccess<T> \| ApiError`<br>• **Type Guards**: `isApiSuccess<T>` và `isApiError<T>` phân biệt kết quả API<br>• **Utility Types**: `CategoryStats = Record<Category, number>`, `BorrowedBookSummary = Pick<Book, ...>`, `BookInput = Omit<Book, 'id'>`, `ImmutableBook = Readonly<Book>`<br>• Không dùng `any`. |
| **P 2** | **React Design Pattern** | Hook generic `useDebounce<T>(value: T, delay: number): T` được dùng để hoãn xử lý tìm kiếm 300ms. |
| **P 3** | **Redux Toolkit + TS** | Cấu trúc **Feature-based** (`src/features/books`), typed hooks `useAppSelector` & `useAppDispatch`, `createAsyncThunk` (`fetchBooks`) xử lý đầy đủ 3 trạng thái: `pending`, `fulfilled`, `rejected`. |
| **P 4** | **Zustand, Context, Middleware** | • Bộ lọc từ khoá & thể loại quản lý bằng **Zustand** (`useFilterStore`).<br>• Giao diện sáng/tối dùng **Context**, bọc giá trị bằng `useMemo` và custom hook `useTheme()`.<br>• Giới hạn sinh viên mượn tối đa 3 cuốn sách được chặn bởi **Custom Redux Middleware** (`borrowLimitMiddleware`). |
| **P 5** | **Tối ưu hiệu năng** | • Danh sách sau lọc tính bằng `useMemo`.<br>• `BookCard` bọc bằng `React.memo`.<br>• Các hàm callback truyền xuống bọc bằng `useCallback`.<br>• `key` dùng `book.id` duy nhất, không dùng index.<br>• Trang Thống kê được tách bundle và lazy load bằng `React.lazy` + `Suspense`. |
| **P 6** | **Kiểm thử tự động** | 14 test cases chạy qua (`npm test`):<br>• 5 tests cho `booksSlice.reducer`<br>• 4 tests cho component `BookCard` (RTL + `userEvent`)<br>• 2 tests cho `useDebounce` (fake timers)<br>• 3 tests cho `borrowLimitMiddleware`. |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Yêu cầu môi trường
- **Node.js**: v18+ trở lên (khuyến nghị v20+)
- **NPM**: v9+ trở lên

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:5173/` (hoặc cổng hiển thị trên terminal).

### 4. Chạy bộ kiểm thử (Unit Tests)
```bash
npm test
```
Tất cả 14 bài kiểm thử của `booksSlice`, `borrowLimitMiddleware`, `BookCard`, và `useDebounce` sẽ tự động thực thi và hiển thị kết quả.

### 5. Build dự án cho Production
```bash
npm run build
```
Kiểm tra tính toàn vẹn của TypeScript và quá trình chia gói (chunking) của trang Thống kê (`StatsPage`).

---

## 🧪 Kịch Bản Trải Nghiệm Chức Năng

1. **Khởi động & API giả lập**: Khi vừa vào app, màn hình hiển thị trạng thái `Đang tải danh sách sách từ thư viện (khoảng 500ms)...` trước khi danh sách sách hiển thị.
2. **Tìm kiếm & Lọc**:
   - Gõ tên sách hoặc tác giả vào ô tìm kiếm: Hook `useDebounce` chờ 300ms trước khi lọc, không phân biệt hoa thường.
   - Bấm vào các nút thể loại (`Tất cả`, `CNTT`, `Kinh tế`, `Ngoại ngữ`) để lọc tức thời qua Zustand store.
3. **Mượn & Trả sách**:
   - Nhấn **Mượn**: Số bản còn lại giảm 1, nút chuyển thành **Trả** (màu đỏ), số lượng trên badge "Đang mượn" tăng lên.
   - Sách hết số bản (`availableCopies = 0`): Nút **Mượn** tự động bị vô hiệu hoá (`disabled`).
   - Nhấn **Trả**: Số bản còn lại tăng 1, nút chuyển lại thành **Mượn**.
4. **Giới hạn mượn 3 cuốn (Redux Middleware)**:
   - Khi đã mượn đủ 3 cuốn, nếu cố gắng bấm mượn cuốn thứ 4, `borrowLimitMiddleware` sẽ chặn action lại và bật thanh cảnh báo: *"Mỗi sinh viên chỉ được mượn tối đa 3 cuốn cùng lúc! Vui lòng trả sách trước khi mượn thêm."*
5. **Trang Thống kê (`/stats`)**:
   - Nhấp vào mục **Thống kê** trên header: Trang được tải lười (Lazy loaded) hiển thị số đầu sách theo từng thể loại và danh sách chi tiết các cuốn bạn đang mượn kèm nút trả nhanh.
6. **Chế độ Sáng / Tối**:
   - Nhấn nút chuyển đổi có icon `Moon` / `Sun` trên góc phải header để chuyển đổi mượt mà giữa nền sáng và nền tối.
7. **Kiểm tra thông báo lỗi API (Yêu cầu 1)**:
   - Nhấn nút **Giả lập lỗi API** trên thanh công cụ để kích hoạt `fetchBooks(true)`: App chuyển sang hiển thị banner báo lỗi và nút **Thử lại ngay**.
