import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-primary-400 mb-4">AIGATE</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Проблемасыз және VPN-сіз GPT пайдалану мүмкіндігін алыңыз,
              теңгемен төлем жасаңыз.
            </p>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-sm text-gray-400 mb-1">
                <strong>ИП ИМАНШАРТОВ</strong>
              </p>
              <p className="text-sm text-gray-400 mb-1">ИНН 931231350871</p>
              <p className="text-sm text-gray-400">
                Мекенжай: Г.АСТАНА, РАЙОН ЕСИЛЬ
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Байланыс</h4>
            <div className="space-y-2">
              <Link
                href="mailto:contact@aigate.kz"
                className="block text-gray-300 hover:text-primary-400 transition-colors"
              >
                contact@aigate.kz
              </Link>
              {/* <Link
                href="https://t.me/aigate_support"
                className="block text-gray-300 hover:text-primary-400 transition-colors"
              >
                Telegram қолдау
              </Link> */}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Құжаттар</h4>
            <div className="space-y-2">
              <Link
                href="/docs/terms"
                className="block text-gray-300 hover:text-primary-400 transition-colors"
              >
                Пайдаланушы келісімі
              </Link>
              <Link
                href="/docs/privacy"
                className="block text-gray-300 hover:text-primary-400 transition-colors"
              >
                Құпиялылық саясаты
              </Link>
              <Link
                href="/docs/api"
                className="block text-gray-300 hover:text-primary-400 transition-colors"
              >
                API документациясы
              </Link>
              <Link
                href="/docs/integration"
                className="block text-gray-300 hover:text-primary-400 transition-colors"
              >
                Интеграция
              </Link>
              {/* <Link
                href="/status"
                className="block text-gray-300 hover:text-primary-400 transition-colors"
              >
                Қызмет мәртебесі
              </Link> */}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 AIGATE. Барлық құқықтар қорғалған.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
