import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Құпиялылық саясаты - AIGATE",
  description: "AIGATE жеке деректерді өңдеу және қорғау саясаты",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Басты бетке оралу
          </Link>

          <div className="text-center mb-12 pb-8 border-b-2 border-gray-100">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ҚҰПИЯЛЫЛЫҚ САЯСАТЫ
            </h1>
            <p className="text-lg text-gray-600">
              Жеке деректерді өңдеу және қорғау саясаты
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                1. ЖАЛПЫ ЕРЕЖЕЛЕР
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  {`Осы Құпиялылық саясаты (бұдан әрі - "Саясат") AIGATE қызметін
                  пайдалану кезінде жеке деректерді жинау, өңдеу және сақтау
                  тәртібін белгілейді.`}
                </p>
                <p>
                  Деректерді өңдеуші: ИП ИМАНШАРТОВ, ИНН: 931231350871,
                  мекенжайы: Г.АСТАНА, РАЙОН ЕСИЛЬ.
                </p>
                <p>
                  Біз сіздің жеке деректеріңіздің қауіпсіздігін қамтамасыз етуге
                  міндеттенеміз.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                2. ЖИНАЛАТЫН ДЕРЕКТЕР
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>Біз келесі деректерді жинаймыз:</p>

                <div className="ml-4">
                  <h4 className="font-semibold mb-2">Тіркелу кезінде:</h4>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Электрондық пошта мекенжайы</li>
                    <li>Компания немесе ұйым атауы</li>
                    <li>Байланыс ақпараты</li>
                    <li>Заңды тұлға үшін: ИИН/БИН, мекенжай</li>
                  </ul>
                </div>

                <div className="ml-4">
                  <h4 className="font-semibold mb-2">
                    Қызметті пайдалану кезінде:
                  </h4>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>API сұрауларының статистикасы</li>
                    <li>Пайдаланылған токендер саны</li>
                    <li>Қызмет пайдалану уақыты</li>
                    <li>IP мекенжайы (қауіпсіздік мақсатында)</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <strong>Маңызды:</strong> Біз сіздің API арқылы жіберетін
                  мазмұныңызды сақтамаймыз және үшінші тұлғаларға бермейміз.
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                3. ДЕРЕКТЕРДІ ПАЙДАЛАНУ МАҚСАТТАРЫ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>Жеке деректер келесі мақсаттарда пайдаланылады:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>AIGATE қызметін көрсету</li>
                  <li>API кілтін беру және басқару</li>
                  <li>Төлем есептеулерін жүргізу</li>
                  <li>Техникалық қолдау көрсету</li>
                  <li>Қызметтің қауіпсіздігін қамтамасыз ету</li>
                  <li>Заңды талаптарды орындау</li>
                  <li>Статистика жасау (жеке тұлғаны анықтамайтын түрде)</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                4. ДЕРЕКТЕРДІ САҚТАУ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>Деректерді сақтау шарттары:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Деректер қауіпсіз серверлерде сақталады</li>
                  <li>Шифрлау технологиялары қолданылады</li>
                  <li>
                    Қолжетімділік тек уәкілетті қызметкерлерге ғана беріледі
                  </li>
                  <li>Сақтау мерзімі: қызметті пайдалану кезеңі + 3 жыл</li>
                </ul>

                <p>Қауіпсіздік шаралары:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>SSL/TLS шифрлауы</li>
                  <li>Қолжетімділікті бақылау</li>
                  <li>Деректерді резервтік көшіру</li>
                  <li>Қауіпсіздік аудиті</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                5. ДЕРЕКТЕРДІ ҮШІНШІ ТҰЛҒАЛАРҒА БЕРУ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  Біз сіздің жеке деректеріңізді үшінші тұлғаларға бермейміз,
                  келесі жағдайларды қоспағанда:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Сіздің жазбаша келісіміңізбен</li>
                  <li>
                    Заң талаптары бойынша (сот шешімі, мемлекеттік органдардың
                    сұрауы)
                  </li>
                  <li>
                    Қызметті көрсету үшін қажетті жағдайларда (төлем жүйелері,
                    хостинг провайдерлері)
                  </li>
                </ul>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <strong>Назар аударыңыз:</strong> API арқылы үшінші тарап
                  қызметтеріне (OpenAI, Google, т.б.) жіберілетін деректер сол
                  қызметтердің құпиялылық саясатына сәйкес өңделеді.
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                6. ПАЙДАЛАНУШЫНЫҢ ҚҰҚЫҚТАРЫ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>Сіздің құқықтарыңыз:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Өзіңіз туралы деректерге қолжетімділік алу</li>
                  <li>Деректерді түзету немесе жаңарту</li>
                  <li>Деректерді өңдеуге келісімді кері қайтарып алу</li>
                  <li>Деректерді жою туралы сұрау жасау</li>
                  <li>Деректерді өңдеуді шектеу</li>
                  <li>Деректерді басқа қызмет көрсетушіге көшіру</li>
                </ul>

                <p>
                  Құқықтарыңызды жүзеге асыру үшін{" "}
                  <a
                    href="mailto:contact@aigate.kz"
                    className="text-primary-600 hover:underline"
                  >
                    contact@aigate.kz
                  </a>{" "}
                  мекенжайына хат жазыңыз.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                7. COOKIES ЖӘНЕ ТРЕКИНГ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>Біздің веб-сайт келесі технологияларды пайдаланады:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Қажетті cookies (сайттың жұмысы үшін)</li>
                  <li>Статистика cookies (Google Analytics сияқты)</li>
                  <li>Сайттың өнімділігін бақылау</li>
                </ul>

                <p>
                  Сіз браузер параметрлері арқылы cookies-ті өшіре аласыз, бірақ
                  бұл сайттың жұмысына әсер етуі мүмкін.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                8. БАЛАЛАРДЫҢ ДЕРЕКТЕРІ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  Біздің қызметіміз 18 жасқа толмаған тұлғаларға арналмаған. Біз
                  санаулы түрде 18 жасқа толмаған тұлғалардан деректер
                  жинамаймыз.
                </p>
                <p>
                  Егер сіз 18 жасқа толмаған тұлғаның деректерін табсаңыз, дереу
                  бізге хабарласыңыз.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                9. САЯСАТТЫ ӨЗГЕРТУ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  Біз осы Саясатты кез келген уақытта өзгерту құқығын сақтаймыз.
                  Маңызды өзгерістер туралы пайдаланушыларға алдын ала
                  хабарланады.
                </p>
                <p>Өзгерістер сайтта жарияланған сәттен бастап күшіне енеді.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                10. ШАҒЫМДАР ЖӘНЕ СҰРАҚТАР
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  Құпиялылыққа қатысты сұрақтарыңыз немесе шағымдарыңыз болса,
                  бізге хабарласыңыз:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>
                    Электрондық пошта:{" "}
                    <a
                      href="mailto:contact@aigate.kz"
                      className="text-primary-600 hover:underline"
                    >
                      contact@aigate.kz
                    </a>
                  </li>
                  <li>Жауап беру уақыты: 3 жұмыс күні ішінде</li>
                </ul>

                <p>
                  Егер сіз біздің жауабымызбен келіспесеңіз, сіз Қазақстан
                  Республикасының уәкілетті органдарына шағым жаса аласыз.
                </p>
              </div>
            </section>

            <div className="bg-gray-50 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Байланыс ақпараты:
              </h3>
              <div className="text-gray-700 space-y-2">
                <p>
                  <strong>ИП ИМАНШАРТОВ</strong>
                </p>
                <p>ИНН: 931231350871</p>
                <p>Мекенжай: Г.АСТАНА, РАЙОН ЕСИЛЬ</p>
                <p>
                  Электрондық пошта:{" "}
                  <a
                    href="mailto:contact@aigate.kz"
                    className="text-primary-600 hover:underline"
                  >
                    contact@aigate.kz
                  </a>
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Саясат соңғы жаңартылған күні: 2025 жыл
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
