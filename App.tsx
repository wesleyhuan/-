
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  Library, 
  Users, 
  QrCode, 
  BookOpen, 
  PlusCircle, 
  UserPlus, 
  History,
  LayoutDashboard,
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { StorageService } from './services/storage';
import { Book, User, BorrowRecord, BookStatus } from './types';
import Scanner from './components/Scanner';
import QRCodeView from './components/QRCodeView';

// --- Pages ---

const Dashboard: React.FC = () => {
  const books = StorageService.getBooks();
  const users = StorageService.getUsers();
  const records = StorageService.getRecords();
  const borrowedCount = books.filter(b => b.status === BookStatus.BORROWED).length;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">管理總覽</h1>
        <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
          {new Date().toLocaleDateString('zh-TW')}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '藏書總數', value: books.length, icon: BookOpen, color: 'bg-blue-500' },
          { label: '借出書籍', value: borrowedCount, icon: ArrowRightLeft, color: 'bg-amber-500' },
          { label: '註冊用戶', value: users.length, icon: Users, color: 'bg-emerald-500' },
          { label: '借閱人次', value: records.length, icon: History, color: 'bg-indigo-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="text-indigo-500" size={20} />
            近期借閱動態
          </h2>
          <div className="space-y-4">
            {records.slice(-5).reverse().map(record => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${record.returnDate ? 'bg-green-400' : 'bg-amber-400'}`}></div>
                  <div>
                    <p className="text-sm font-semibold">{record.userName} {record.returnDate ? '歸還' : '借閱'}</p>
                    <p className="text-xs text-gray-500">{record.bookTitle}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{new Date(record.borrowDate).toLocaleDateString()}</span>
              </div>
            ))}
            {records.length === 0 && <p className="text-center text-gray-400 py-4">尚無借閱紀錄</p>}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">快速掃描操作</h2>
            <p className="text-indigo-100 mb-6">點擊下方按鈕啟動相機，進行書籍借出或歸還流程。</p>
          </div>
          <Link to="/scan" className="bg-white text-indigo-600 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all shadow-md active:scale-95">
            <QrCode size={24} />
            立即掃描 QR Code
          </Link>
        </div>
      </div>
    </div>
  );
};

const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    setBooks(StorageService.getBooks());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newTitle.trim()) return;
    
    const result = StorageService.addBook(newTitle);
    if (result.success) {
      setBooks(StorageService.getBooks());
      setNewTitle('');
      setShowAdd(false);
    } else {
      setError(result.message || '新增失敗');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">書籍管理</h1>
        <button 
          onClick={() => {
            setShowAdd(!showAdd);
            setError(null);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-sm no-print"
        >
          <PlusCircle size={20} />
          新增書籍
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 no-print space-y-4">
          <form onSubmit={handleAdd}>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                placeholder="輸入書名..." 
                className={`flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${error ? 'border-rose-300' : 'border-gray-300'}`}
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  setError(null);
                }}
                required
              />
              <button type="submit" className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-600 transition">
                確認存檔
              </button>
            </div>
          </form>
          {error && (
            <div className="flex items-center gap-2 text-rose-600 text-sm font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 no-print">
        {books.map(book => (
          <div 
            key={book.id} 
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-all cursor-pointer group"
            onClick={() => setSelectedBook(book)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${book.status === BookStatus.AVAILABLE ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {book.status === BookStatus.AVAILABLE ? '在館中' : '借出中'}
              </span>
              <QrCode size={16} className="text-gray-400 group-hover:text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{book.title}</h3>
            <p className="text-xs font-mono text-gray-400 mt-1">{book.id}</p>
          </div>
        ))}
      </div>

      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={24} />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6">書籍 QR Code</h2>
              <QRCodeView value={selectedBook.id} label={selectedBook.title} subLabel="掃描此碼以借閱或歸還" />
            </div>
          </div>
        </div>
      )}

      {books.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <Library size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">目前尚無書籍紀錄</p>
        </div>
      )}
    </div>
  );
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    setUsers(StorageService.getUsers());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newName.trim()) return;
    
    const result = StorageService.addUser(newName);
    if (result.success) {
      setUsers(StorageService.getUsers());
      setNewName('');
      setShowAdd(false);
    } else {
      setError(result.message || '註冊失敗');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">使用者管理</h1>
        <button 
          onClick={() => {
            setShowAdd(!showAdd);
            setError(null);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-sm no-print"
        >
          <UserPlus size={20} />
          註冊新使用者
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 no-print space-y-4">
          <form onSubmit={handleAdd}>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                placeholder="輸入使用者姓名或員編..." 
                className={`flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${error ? 'border-rose-300' : 'border-gray-300'}`}
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError(null);
                }}
                required
              />
              <button type="submit" className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-600 transition">
                完成註冊
              </button>
            </div>
          </form>
          {error && (
            <div className="flex items-center gap-2 text-rose-600 text-sm font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden no-print">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">姓名</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">ID</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">註冊時間</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-sm font-mono text-gray-400">{user.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
                  >
                    <QrCode size={16} />
                    查看 QR Code
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">尚無註冊使用者</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={24} />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6">使用者識別 QR Code</h2>
              <QRCodeView value={selectedUser.id} label={selectedUser.name} subLabel="借書前請先掃描此識別碼" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ScanPage: React.FC = () => {
  const [step, setStep] = useState<'IDLE' | 'SCAN_USER' | 'SCAN_BOOK'>('SCAN_USER');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [result, setResult] = useState<{ success: boolean, message: string } | null>(null);
  const navigate = useNavigate();

  const handleScan = (code: string) => {
    if (result) return; // Wait until result cleared

    if (step === 'SCAN_USER') {
      const users = StorageService.getUsers();
      const user = users.find(u => u.id === code);
      if (user) {
        setCurrentUser(user);
        setStep('SCAN_BOOK');
      } else {
        // Might be a book code scanned early? Or wrong code.
        const books = StorageService.getBooks();
        const book = books.find(b => b.id === code);
        if (book) {
          // If a book is scanned without user, maybe they want to return it?
          // Or just handle direct book scan.
          const res = StorageService.returnBook(book.id);
          setResult(res);
        } else {
          setResult({ success: false, message: '無效的 QR Code 或查無此用戶' });
        }
      }
    } else if (step === 'SCAN_BOOK') {
      const books = StorageService.getBooks();
      const book = books.find(b => b.id === code);
      if (book && currentUser) {
        if (book.status === BookStatus.BORROWED) {
           // If scanning a borrowed book, maybe returning it?
           const res = StorageService.returnBook(book.id);
           setResult(res);
        } else {
           const res = StorageService.borrowBook(book.id, currentUser.id);
           setResult(res);
        }
      } else {
        setResult({ success: false, message: '找不到書籍紀錄' });
      }
    }
  };

  const reset = () => {
    setResult(null);
    setCurrentUser(null);
    setStep('SCAN_USER');
  };

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6">
      <div className="flex justify-between items-center px-2">
        <button onClick={() => navigate('/')} className="text-gray-500 flex items-center gap-1 hover:text-gray-800 transition">
          <XCircle size={20} /> 取消操作
        </button>
        <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
           Step {step === 'SCAN_USER' ? '1' : '2'} of 2
        </span>
      </div>

      {!result ? (
        <Scanner 
          title={step === 'SCAN_USER' ? '掃描使用者 QR Code' : '掃描書籍 QR Code'}
          description={step === 'SCAN_USER' ? '請掃描員工證或手機上的個人條碼' : `已辨識使用者：${currentUser?.name}，請對準書本上的條碼`}
          onScan={handleScan}
        />
      ) : (
        <div className={`bg-white rounded-3xl shadow-xl p-10 text-center space-y-6 border-t-8 ${result.success ? 'border-emerald-500' : 'border-rose-500'}`}>
          <div className="flex justify-center">
            {result.success ? (
              <div className="bg-emerald-100 text-emerald-600 p-6 rounded-full">
                <CheckCircle size={64} />
              </div>
            ) : (
              <div className="bg-rose-100 text-rose-600 p-6 rounded-full">
                <XCircle size={64} />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">{result.success ? '操作成功' : '操作失敗'}</h2>
            <p className="mt-4 text-xl text-gray-600 leading-relaxed">{result.message}</p>
          </div>
          <button 
            onClick={reset}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            完成並返回
          </button>
        </div>
      )}

      {step === 'SCAN_BOOK' && !result && (
        <div className="text-center">
          <button onClick={reset} className="text-indigo-600 text-sm font-medium underline underline-offset-4">
            重新選擇使用者
          </button>
        </div>
      )}
    </div>
  );
};

const HistoryPage: React.FC = () => {
  const records = [...StorageService.getRecords()].reverse();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900">借閱歷史</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">借閱者</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">書籍名稱</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">借出時間</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">歸還狀態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map(record => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{record.userName}</td>
                  <td className="px-6 py-4">{record.bookTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(record.borrowDate).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {record.returnDate ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        已歸還於 {new Date(record.returnDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        借閱中
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400">尚無歷史紀錄</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main Layout ---

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar - Navigation */}
      <nav className="w-full lg:w-64 bg-white border-b lg:border-r border-gray-200 lg:fixed lg:h-full z-40 no-print">
        <div className="h-full flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3 text-indigo-600">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Library size={24} />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 uppercase">LibraryQR</span>
            </div>
          </div>
          
          <div className="flex-1 px-4 py-4 space-y-1">
            {[
              { to: '/', label: '管理儀表板', icon: LayoutDashboard },
              { to: '/books', label: '書籍管理', icon: BookOpen },
              { to: '/users', label: '用戶管理', icon: Users },
              { to: '/history', label: '借閱紀錄', icon: History },
              { to: '/scan', label: '開啟掃描器', icon: QrCode, highlight: true },
            ].map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  link.highlight 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600'
                }`}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">HR 管理系統</p>
              <p className="text-sm font-semibold text-gray-600">內部限定服務</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<BookManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/scan" element={<ScanPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
