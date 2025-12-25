
export enum BookStatus {
  AVAILABLE = 'available',
  BORROWED = 'borrowed',
}

export interface Book {
  id: string;
  title: string;
  author?: string;
  category?: string;
  status: BookStatus;
  currentBorrowerId?: string;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  createdAt: number;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  bookTitle: string;
  borrowDate: number;
  returnDate?: number;
}
