import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('cập nhật giá trị sau khi hết thời gian debounce bằng fake timers', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce<string>(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    // Giá trị khởi tạo được gán ngay lập tức
    expect(result.current).toBe('initial');

    // Thay đổi giá trị thành 'updated'
    rerender({ value: 'updated', delay: 300 });

    // Trước 300ms, giá trị debounced vẫn là giá trị cũ 'initial'
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial');

    // Sau khi đủ 300ms, giá trị debounced được cập nhật thành 'updated'
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('updated');
  });

  it('hoạt động chính xác với kiểu dữ liệu generic khác (ví dụ: number)', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce<number>(value, delay),
      {
        initialProps: { value: 10, delay: 500 },
      }
    );

    expect(result.current).toBe(10);

    rerender({ value: 99, delay: 500 });

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe(10);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe(99);
  });
});
