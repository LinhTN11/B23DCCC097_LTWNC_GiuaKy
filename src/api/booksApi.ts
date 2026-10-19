import type { Book, ApiResponse } from '../types/book';

// Dữ liệu mẫu danh sách sách chuyên ngành
const INITIAL_BOOKS: Book[] = [
  {
    id: 'b-01',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'CNTT',
    publishedYear: 2008,
    availableCopies: 3,
    coverUrl: '/covers/clean-code.jpg',
  },
  {
    id: 'b-02',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    category: 'CNTT',
    publishedYear: 1994,
    availableCopies: 1,
    coverUrl: '/covers/design-patterns.jpg',
  },
  {
    id: 'b-03',
    title: 'Kinh Tế Học Vi Mô',
    author: 'N. Gregory Mankiw',
    category: 'Kinh tế',
    publishedYear: 2020,
    availableCopies: 2,
    coverUrl: '/covers/kinh-te-hoc-vi-mo.jpg',
  },
  {
    id: 'b-04',
    title: 'Tư Duy Nhanh Và Chậm (Thinking, Fast and Slow)',
    author: 'Daniel Kahneman',
    category: 'Kinh tế',
    publishedYear: 2011,
    availableCopies: 0, // 0 bản còn lại để kiểm tra trạng thái vô hiệu hoá nút Mượn
    coverUrl: '/covers/thinking-fast-and-slow.jpg',
  },
  {
    id: 'b-05',
    title: 'English Grammar in Use',
    author: 'Raymond Murphy',
    category: 'Ngoại ngữ',
    publishedYear: 2019,
    availableCopies: 4,
    coverUrl: '/covers/english-grammar-in-use.jpg',
  },
  {
    id: 'b-06',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'CNTT',
    publishedYear: 2017,
    availableCopies: 2,
    coverUrl: '/covers/ddia.jpg',
  },
  {
    id: 'b-07',
    title: 'Chiến Lược Đại Dương Xanh',
    author: 'W. Chan Kim, Renée Mauborgne',
    category: 'Kinh tế',
    publishedYear: 2015,
    availableCopies: 1,
    coverUrl: '/covers/chien-luoc-dai-duong-xanh.jpg',
  },
  {
    id: 'b-08',
    title: 'Cambridge English IELTS Academic 18',
    author: 'Cambridge University Press',
    category: 'Ngoại ngữ',
    publishedYear: 2023,
    availableCopies: 3,
    coverUrl: '/covers/ielts-18.jpg',
  },
  {
    id: 'b-09',
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    author: 'David Thomas, Andrew Hunt',
    category: 'CNTT',
    publishedYear: 2019,
    availableCopies: 2,
    coverUrl: '/covers/pragmatic-programmer.jpg',
  },
  {
    id: 'b-10',
    title: 'Refactoring: Improving the Design of Existing Code',
    author: 'Martin Fowler',
    category: 'CNTT',
    publishedYear: 2018,
    availableCopies: 3,
    coverUrl: '/covers/refactoring.jpg',
  },
  {
    id: 'b-11',
    title: 'Kinh Tế Học Vĩ Mô',
    author: 'N. Gregory Mankiw',
    category: 'Kinh tế',
    publishedYear: 2021,
    availableCopies: 2,
    coverUrl: '/covers/kinh-te-hoc-vi-mo-macro.jpg',
  },
  {
    id: 'b-12',
    title: 'Tài Chính Doanh Nghiệp Căn Bản',
    author: 'Stephen A. Ross, Randolph W. Westerfield',
    category: 'Kinh tế',
    publishedYear: 2022,
    availableCopies: 4,
    coverUrl: '/covers/tai-chinh-doanh-nghiep.jpg',
  },
  {
    id: 'b-13',
    title: "Oxford Advanced Learner's Dictionary (10th Edition)",
    author: 'Oxford University Press',
    category: 'Ngoại ngữ',
    publishedYear: 2020,
    availableCopies: 1,
    coverUrl: '/covers/oxford-dictionary.jpg',
  },
  {
    id: 'b-14',
    title: 'Destination B2: Grammar & Vocabulary',
    author: 'Malcolm Mann, Steve Taylore-Knowles',
    category: 'Ngoại ngữ',
    publishedYear: 2018,
    availableCopies: 2,
    coverUrl: '/covers/destination-b2.jpg',
  },
];

/**
 * Giả lập API lấy danh sách sách
 * @param shouldFail Tham số tuỳ chọn để giả lập trường hợp API thất bại
 * @param delay Độ trễ mặc định 500ms
 * @returns Promise<ApiResponse<Book[]>>
 */
export function fetchBooksApi(
  shouldFail: boolean = false,
  delay: number = 500
): Promise<ApiResponse<Book[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Không thể kết nối đến máy chủ thư viện. Vui lòng thử lại sau!',
        });
      } else {
        // Deep copy để tránh mutation trực tiếp vào mock data
        resolve({
          ok: true,
          data: JSON.parse(JSON.stringify(INITIAL_BOOKS)),
        });
      }
    }, delay);
  });
}
