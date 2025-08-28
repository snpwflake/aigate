interface HeaderProps {
  user: {
    name: string;
    email: string;
  };
  balance: number;
}

export default function Header({ user, balance }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6 h-21">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">{user.name}</span>
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Баланс: {balance.toFixed(2)} ₸
          </div>
        </div>
      </div>
    </header>
  );
}
