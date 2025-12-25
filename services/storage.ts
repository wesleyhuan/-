
import { Book, User, BorrowRecord, BookStatus } from '../types';

const STORAGE_KEYS = {
  BOOKS: 'lib_books',
  USERS: 'lib_users',
  RECORDS: 'lib_records'
};

export const StorageService = {
  getBooks: (): Book[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
    return data ? JSON.parse(data) : [];
  },

  saveBooks: (books: Book[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  },

  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getRecords: (): BorrowRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },

  saveRecords: (records: BorrowRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  },

  addBook: (title: string, author?: string, category?: string): { success: boolean, book?: Book, message?: string } => {
    const books = StorageService.getBooks();
    
    // Check for duplicate titles
    const isDuplicate = books.some(b => b.title.trim().toLowerCase() === title.trim().toLowerCase());
    if (isDuplicate) {
      return { success: false, message: '書庫中已存在相同書名的書籍，請確認是否重複輸入。' };
    }

    const newBook: Book = {
      id: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      title,
      author,
      category,
      status: BookStatus.AVAILABLE,
      createdAt: Date.now()
    };
    StorageService.saveBooks([...books, newBook]);
    return { success: true, book: newBook };
  },

  addUser: (name: string): { success: boolean, user?: User, message?: string } => {
    const users = StorageService.getUsers();

    // Check for duplicate user names
    const isDuplicate = users.some(u => u.name.trim().toLowerCase() === name.trim().toLowerCase());
    if (isDuplicate) {
      return { success: false, message: '此姓名已被註冊，請輸入不同的姓名或加上識別編號。' };
    }

    const newUser: User = {
      id: `USR-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      name,
      createdAt: Date.now()
    };
    StorageService.saveUsers([...users, newUser]);
    return { success: true, user: newUser };
  },

  borrowBook: (bookId: string, userId: string): { success: boolean, message: string } => {
    const books = StorageService.getBooks();
    const users = StorageService.getUsers();
    const records = StorageService.getRecords();

    const bookIndex = books.findIndex(b => b.id === bookId);
    const user = users.find(u => u.id === userId);

    if (bookIndex === -1) return { success: false, message: '找不到該書籍' };
    if (!user) return { success: false, message: '找不到該使用者' };
    if (books[bookIndex].status === BookStatus.BORROWED) return { success: false, message: '該書已被借出' };

    // Update Book
    books[bookIndex].status = BookStatus.BORROWED;
    books[bookIndex].currentBorrowerId = userId;

    // Create Record
    const newRecord: BorrowRecord = {
      id: `REC-${Date.now()}`,
      bookId: bookId,
      userId: userId,
      userName: user.name,
      bookTitle: books[bookIndex].title,
      borrowDate: Date.now()
    };

    StorageService.saveBooks(books);
    StorageService.saveRecords([...records, newRecord]);

    return { success: true, message: `借閱成功！由 ${user.name} 借出 ${books[bookIndex].title}` };
  },

  returnBook: (bookId: string): { success: boolean, message: string } => {
    const books = StorageService.getBooks();
    const records = StorageService.getRecords();

    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return { success: false, message: '找不到該書籍' };
    if (books[bookIndex].status === BookStatus.AVAILABLE) return { success: false, message: '該書目前在館內' };

    // Update Book
    books[bookIndex].status = BookStatus.AVAILABLE;
    books[bookIndex].currentBorrowerId = undefined;

    // Update Record
    const recordIndex = records.findIndex(r => r.bookId === bookId && !r.returnDate);
    if (recordIndex !== -1) {
      records[recordIndex].returnDate = Date.now();
    }

    StorageService.saveBooks(books);
    StorageService.saveRecords(records);

    return { success: true, message: `歸還成功！${books[bookIndex].title} 已回到圖庫` };
  }
};
