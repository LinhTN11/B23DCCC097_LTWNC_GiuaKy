import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from './BookCard';
import type { Book } from '../../types/book';

describe('BookCard component', () => {
  const sampleBook: Book = {
    id: 'book-123',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'CNTT',
    publishedYear: 2008,
    availableCopies: 2,
  };

  const sampleOutOfStockBook: Book = {
    ...sampleBook,
    id: 'book-456',
    title: 'Tư Duy Nhanh Và Chậm',
    author: 'Daniel Kahneman',
    category: 'Kinh tế',
    availableCopies: 0,
  };

  // Test 1: Hiển thị đúng thông tin sách
  it('1. hiển thị đúng toàn bộ thông tin của sách (tên, tác giả, thể loại, năm xuất bản, số bản còn lại)', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    // Kiểm tra tên sách
    expect(screen.getByText('Clean Code: A Handbook of Agile Software Craftsmanship')).toBeInTheDocument();
    // Kiểm tra tác giả
    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
    // Kiểm tra thể loại
    expect(screen.getByText('CNTT')).toBeInTheDocument();
    // Kiểm tra năm xuất bản
    expect(screen.getByText(/Năm XB: 2008/i)).toBeInTheDocument();
    // Kiểm tra số bản còn lại
    expect(screen.getByTestId('copies-book-123')).toHaveTextContent('2');
  });

  // Test 2: Click "Mượn" gọi đúng hàm với đúng id
  it('2. click nút "Mượn" gọi đúng hàm callback onBorrow với đúng id sách', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowButton = screen.getByRole('button', { name: /Mượn/i });
    expect(borrowButton).toBeEnabled();

    await user.click(borrowButton);

    expect(handleBorrow).toHaveBeenCalledTimes(1);
    expect(handleBorrow).toHaveBeenCalledWith('book-123');
    expect(handleReturn).not.toHaveBeenCalled();
  });

  // Test 3: Nút bị vô hiệu hoá khi hết bản (availableCopies === 0)
  it('3. nút "Mượn" bị vô hiệu hoá khi sách đã hết bản (availableCopies === 0)', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleOutOfStockBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowButton = screen.getByRole('button', { name: /Mượn/i });
    expect(borrowButton).toBeDisabled();
  });

  // Test 4 (Bonus): Hiển thị nút "Trả" khi sách đang được mượn và click gọi đúng onReturn
  it('4. hiển thị nút "Trả" khi sách đang được mượn và click gọi đúng onReturn với đúng id', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBook}
        isBorrowed={true}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const returnButton = screen.getByRole('button', { name: /Trả/i });
    expect(returnButton).toBeInTheDocument();
    expect(returnButton).toBeEnabled();

    await user.click(returnButton);

    expect(handleReturn).toHaveBeenCalledTimes(1);
    expect(handleReturn).toHaveBeenCalledWith('book-123');
    expect(handleBorrow).not.toHaveBeenCalled();
  });
});
