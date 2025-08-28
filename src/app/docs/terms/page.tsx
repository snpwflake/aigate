import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Пайдаланушы келісімі - AIGATE",
  description: "AIGATE қызметін пайдалану туралы келісім",
};

export default function TermsPage() {
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
              ПАЙДАЛАНУШЫ КЕЛІСІМІ
            </h1>
            <p className="text-lg text-gray-600">
              AIGATE қызметін пайдалану туралы келісім
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                1. ЖАЛПЫ ЕРЕЖЕЛЕР
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>1.1.</strong>{" "}
                  {`Осы Пайдаланушы келісімі (бұдан әрі -
                  "Келісім") AIGATE API қызметін пайдалану шарттары мен тәртібін
                  реттейді.`}
                </p>
                <p>
                  <strong>1.2.</strong>{" "}
                  {`Қызмет көрсетуші: Жеке кәсіпкер
                  ИМАНШАРТОВ, мекенжайы: Астана қаласы, Есіл ауданы (бұдан әрі -
                  "Қызмет көрсетуші").`}
                </p>
                <p>
                  <strong>1.3.</strong> Қызметті пайдалану, API кілтін алу
                  немесе тіркелу арқылы сіз осы Келісімнің барлық шарттарын
                  толық көлемде қабылдайсыз.
                </p>
                <p>
                  <strong>1.4.</strong> Егер сіз осы Келісімнің шарттарымен
                  келіспесеңіз, қызметті пайдалануды тоқтатыңыз.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                2. ТЕРМИНДЕР МЕН АНЫҚТАМАЛАР
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>2.1.</strong> AIGATE - жасанды интеллект модельдеріне
                  қолжетімділік беретін API платформасы.
                </p>
                <p>
                  <strong>2.2.</strong> API кілті - қызметке қолжетімділік үшін
                  жеке идентификатор.
                </p>
                <p>
                  <strong>2.3.</strong> Токен - API сұрауларын есептеу бірлігі.
                </p>
                <p>
                  <strong>2.4.</strong> Пайдаланушы - қызметті пайдаланатын жеке
                  немесе заңды тұлға.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                3. ҚЫЗМЕТ СИПАТТАМАСЫ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>3.1.</strong> AIGATE келесі жасанды интеллект
                  модельдеріне қолжетімділік ұсынады:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>
                    OpenAI ChatGPT модельдері (GPT-4, GPT-3.5-turbo және т.б.)
                  </li>
                  <li>Google Gemini модельдері</li>
                  <li>DeepSeek модельдері</li>
                  <li>Anthropic Claude модельдері</li>
                  <li>Meta Llama модельдері</li>
                  <li>Өзге жасанды интеллект модельдері</li>
                </ul>
                <p>
                  <strong>3.2.</strong> Қызмет REST API арқылы көрсетіледі және
                  токендер негізінде есептеледі.
                </p>
                <p>
                  <strong>3.3.</strong> Қызмет көрсетуші қызметтің 99.5%
                  қолжетімділігін қамтамасыз етуге тырысады.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                4. ТІРКЕЛУ ЖӘНЕ API КІЛТІН АЛУ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>4.1.</strong> API кілтін алу үшін:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>
                    <a
                      href="mailto:contact@aigate.kz"
                      className="text-primary-600 hover:underline"
                    >
                      contact@aigate.kz
                    </a>{" "}
                    электрондық поштасына өтініш жіберіңіз
                  </li>
                  <li>
                    Келесі мәліметтерді көрсетіңіз: толық аты-жөніңіз/компания
                    атауы, байланыс деректері, пайдалану мақсаты
                  </li>
                  <li>
                    Сұрау қаралғаннан кейін API кілті электрондық пошта арқылы
                    жіберіледі
                  </li>
                </ul>
                <p>
                  <strong>4.2.</strong> API кілті жеке және құпия болып
                  табылады. Оны үшінші тұлғаларға беру, жария ету немесе ортақ
                  пайдалануға беру қатаң тыйым салынады.
                </p>
                <p>
                  <strong>4.3.</strong> API кілтін жоғалту немесе
                  компрометациялау жағдайында дереу қызмет көрсетушіге
                  хабарлаңыз.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                5. ТӨЛЕМ ЖӘНЕ ТАРИФТЕР
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>5.1.</strong> Төлем шарттары:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Төлем қазақстандық теңгемен (KZT) жүзеге асырылады</li>
                  <li>Бағалар токендер саны бойынша есептеледі</li>
                  <li>Төлем алдын ала (prepaid) негізінде жүргізіледі</li>
                  <li>Қаражат түсуден кейін балансқа есептеледі</li>
                </ul>

                <p>
                  <strong>5.2.</strong> Заңды тұлғалар үшін:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Ресми есеп-шот беріледі</li>
                  <li>Толық құжат пакеті (шарт, актілер) ұсынылады</li>
                  <li>ҚҚС қосымша есептеледі</li>
                </ul>

                <p>
                  <strong>5.3.</strong> Тарифтер:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Ағымдағы тарифтер веб-сайтта жарияланады</li>
                  <li>
                    Тарифтер 30 күн алдын ала ескерту арқылы өзгертілуі мүмкін
                  </li>
                  <li>
                    Баланс аяқталған жағдайда қызмет автоматты түрде тоқтатылады
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                6. ПАЙДАЛАНУШЫНЫҢ ҚҰҚЫҚТАРЫ МЕН МІНДЕТТЕРІ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>6.1.</strong> Пайдаланушының құқықтары:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Қызметті келісім шарттарына сәйкес пайдалану</li>
                  <li>Сапалы техникалық қолдау алу</li>
                  <li>Деректердің қауіпсіздігін талап ету</li>
                  <li>Қызмет сапасына шағым жасау</li>
                  <li>Кез келген уақытта қызметтен бас тарту</li>
                </ul>

                <p>
                  <strong>6.2.</strong> Пайдаланушының міндеттері:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Қызметті заңды мақсаттарда ғана пайдалану</li>
                  <li>API кілтінің құпиялылығын сақтау</li>
                  <li>Уақтылы төлем жасау</li>
                  <li>Қызмет шарттарын сақтау</li>
                  <li>Техникалық талаптарды орындау</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                7. ТЫЙЫМ САЛЫНҒАН ӘРЕКЕТТЕР
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>7.1.</strong> Қызметті пайдалану кезінде мына
                  әрекеттер қатаң тыйым салынады:
                </p>

                <p>
                  <strong>7.2.</strong> Заңсыз мазмұн:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Терроризм, экстремизм, зорлық-зомбылық насихаттау</li>
                  <li>Жынысты мазмұн, балалар порнографиясы</li>
                  <li>Нәсілшілдік, кемсітушілік мазмұн</li>
                  <li>Есірткі, қару сату туралы ақпарат</li>
                </ul>

                <p>
                  <strong>7.3.</strong> Техникалық бұзушылықтар:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Қызметке DDoS шабуыл жасау</li>
                  <li>API кілтін заңсыз пайдалану</li>
                  <li>Жүйені бұзуға әрекет жасау</li>
                  <li>Басқа пайдаланушыларға кедергі келтіру</li>
                </ul>

                <p>
                  <strong>7.4.</strong> Заңнамалық бұзушылықтар:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Авторлық құқықтарды бұзу</li>
                  <li>Жеке деректерді заңсыз өңдеу</li>
                  <li>Алаяқтық, жалған ақпарат тарату</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                8. ЖЕКЕ ДЕРЕКТЕРДІ ҚОРҒАУ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>8.1.</strong> Қызмет көрсетуші Қазақстан
                  Республикасының жеке деректерді қорғау туралы заңнамасын
                  сақтайды.
                </p>
                <p>
                  <strong>8.2.</strong> Жинақталатын деректер:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Байланыс ақпараты (email, телефон)</li>
                  <li>API пайдалану статистикасы</li>
                  <li>Төлем мәліметтері</li>
                </ul>
                <p>
                  <strong>8.3.</strong> Деректер үшінші тұлғаларға берілмейді
                  (заң талабынсыз).
                </p>
                <p>
                  <strong>8.4.</strong> Пайдаланушы өз деректерін өшіру құқығына
                  ие.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                9. ЖАУАПКЕРШІЛІК ШЕКТЕУЛЕРІ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>9.1.</strong> Қызмет көрсетушінің жауапкершілігі:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Қызметтің сапалы көрсетілуін қамтамасыз ету</li>
                  <li>Деректердің қауіпсіздігін сақтау</li>
                  <li>Техникалық қолдау көрсету</li>
                  <li>Заңнамалық талаптарды сақтау</li>
                </ul>

                <p>
                  <strong>9.2.</strong> Қызмет көрсетуші жауапты емес:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>
                    Үшінші тарап қызметтерінің (OpenAI, Google т.б.) жұмысына
                  </li>
                  <li>Пайдаланушының қызметті дұрыс пайдаланбауына</li>
                  <li>Жанама зиянға (кіріс жоғалту, беделдің нұқсануы)</li>
                  <li>Форс-мажор жағдайларына</li>
                </ul>

                <p>
                  <strong>9.3.</strong> Жауапкершіліктің максималды мөлшері
                  төленген сомамен шектеледі.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                10. ИНТЕЛЛЕКТУАЛДЫ МЕНШІК
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>10.1.</strong> AIGATE платформасының барлық құқықтары
                  қызмет көрсетушіге тиесілі.
                </p>
                <p>
                  <strong>10.2.</strong> Пайдаланушы қызметті пайдалану арқылы
                  жасаған мазмұнға толық құқық иеленеді.
                </p>
                <p>
                  <strong>10.3.</strong> Үшінші тарап модельдері (OpenAI, Google
                  т.б.) өз лицензиялық шарттарына бағынады.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                11. ҚЫЗМЕТТІ ТОҚТАТУ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>11.1.</strong> Қызмет көрсетуші қызметті тоқтату
                  құқығын сақтайды:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Келісім шарттарын елеулі бұзу жағдайында</li>
                  <li>30 күн төлем жасамау кезінде</li>
                  <li>Тыйым салынған әрекеттер жасау жағдайында</li>
                  <li>Техникалық себептермен (7 күн алдын ала ескерту)</li>
                </ul>
                <p>
                  <strong>11.2.</strong> Пайдаланушы кез келген уақытта
                  қызметтен бас тарта алады.
                </p>
                <p>
                  <strong>11.3.</strong> Тоқтату кезінде пайдаланылмаған қаражат
                  қайтарылады (комиссияны шегере отырып).
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                12. ФОРС-МАЖОР
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>12.1.</strong> Табиғи апаттар, соғыс, үкімет
                  шешімдері, интернет провайдерлерінің ақаулықтары және басқа да
                  бақылаудан тыс жағдайлар форс-мажор болып табылады.
                </p>
                <p>
                  <strong>12.2.</strong> Форс-мажор кезінде тараптар өз
                  міндеттемелерін орындамауға құқылы.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                13. КЕЛІСІМДІ ӨЗГЕРТУ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>13.1.</strong> Қызмет көрсетуші келісімді бір жақты
                  өзгерту құқығын сақтайды.
                </p>
                <p>
                  <strong>13.2.</strong> Өзгерістер туралы пайдаланушыларға
                  кемінде 15 күн алдын ала электрондық пошта арқылы хабарланады.
                </p>
                <p>
                  <strong>13.3.</strong> Өзгерістермен келіспеген жағдайда
                  пайдаланушы қызметтен бас тарта алады.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                14. ДАУЛАРДЫ ШЕШУ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>14.1.</strong> Барлық дауларды шешу Қазақстан
                  Республикасының заңнамасына сәйкес жүзеге асырылады.
                </p>
                <p>
                  <strong>14.2.</strong> Алдымен дауларды келіссөздер арқылы
                  шешуге тырысу қажет (30 күн мерзімде).
                </p>
                <p>
                  <strong>14.3.</strong> Келіссөздер нәтиже бермеген жағдайда
                  дау сотта қаралады.
                </p>
                <p>
                  <strong>14.4.</strong> Соттылық - Астана қаласының соттары.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                15. ҚОСЫМША ЕРЕЖЕЛЕР
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>15.1.</strong> Егер Келісімнің жекелеген ережелері
                  заңсыз деп танылса, қалған ережелер күшінде қалады.
                </p>
                <p>
                  <strong>15.2.</strong> Келісім қазақ және орыс тілдерінде
                  жасалған. Қайшылық жағдайында қазақ тіліндегі мәтін басымдыққа
                  ие.
                </p>
                <p>
                  <strong>15.3.</strong> Барлық хабарламалар электрондық пошта
                  арқылы жіберіледі және жіберілген күні жеткен болып
                  есептеледі.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                16. БАЙЛАНЫС АҚПАРАТЫ
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>Қызмет көрсетуші:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Жеке кәсіпкер ИМАНШАРТОВ</li>
                  <li>Мекенжай: Астана қаласы, Есіл ауданы</li>
                  <li>
                    Электрондық пошта:{" "}
                    <a
                      href="mailto:contact@aigate.kz"
                      className="text-primary-600 hover:underline"
                    >
                      contact@aigate.kz
                    </a>
                  </li>
                  <li>Веб-сайт: aigate.kz</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                17. ҚОРЫТЫНДЫ ЕРЕЖЕЛЕР
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>17.1.</strong> Келісім қолданысқа енгізілген күні:
                  2025 жыл
                </p>
                <p>
                  <strong>17.2.</strong> Келісім пайдаланушы қызметті пайдалана
                  бастаған сәттен бастап қолданылады
                </p>
                <p>
                  <strong>17.3.</strong> Келісім екі тарап үшін де міндетті
                  болып табылады
                </p>
              </div>
            </section>

            <div className="bg-gray-50 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Байланыс ақпараты:
              </h3>
              <div className="text-gray-700 space-y-2">
                <p>
                  <strong>Жеке кәсіпкер ИМАНШАРТОВ</strong>
                </p>
                <p>Мекенжай: Астана қаласы, Есіл ауданы</p>
                <p>
                  Электрондық пошта:{" "}
                  <a
                    href="mailto:contact@aigate.kz"
                    className="text-primary-600 hover:underline"
                  >
                    contact@aigate.kz
                  </a>
                </p>
                <p>Веб-сайт: aigate.kz</p>
                <p className="text-sm text-gray-500 mt-4">
                  Келісім күші: 2025 жылдан бастап
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
