import {
  Model,
  Service,
  FAQItem,
  Testimonial,
  Technology,
  UseCase,
  Advantage,
  Stat,
} from "@/types";

export const MODELS: Model[] = [
  {
    name: "gpt-4o-mini",
    provider: "OPENAI",
    inputPrice: 27,
    outputPrice: 108,
  },
  {
    name: "gpt-4o",
    provider: "OPENAI",
    inputPrice: 450,
    outputPrice: 1800,
  },
  {
    name: "deepseek-r1",
    provider: "DEEPSEEK",
    inputPrice: 99,
    outputPrice: 394,
  },
  {
    name: "deepseek-chat",
    provider: "DEEPSEEK",
    inputPrice: 25,
    outputPrice: 50,
  },
  {
    name: "claude-3.5-sonnet",
    provider: "ANTHROPIC",
    inputPrice: 540,
    outputPrice: 2700,
  },
  {
    name: "gemini-2.0-flash",
    provider: "GOOGLE",
    inputPrice: 54,
    outputPrice: 450,
  },
];

export const SERVICES: Service[] = [
  {
    name: "dall-e-3",
    provider: "OPENAI",
    price: 1440,
    unit: "standard 1024x1024",
    quality: "standard",
  },
  {
    name: "dall-e-3",
    provider: "OPENAI",
    price: 2880,
    unit: "hd 1024x1024",
    quality: "hd",
  },
  {
    name: "tts-1",
    provider: "OPENAI",
    price: 5400,
    unit: "1M символ",
  },
  {
    name: "tts-1-hd",
    provider: "OPENAI",
    price: 10800,
    unit: "1M символ",
  },
  {
    name: "whisper-1",
    provider: "OPENAI",
    price: 216,
    unit: "60 сек",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question:
      "Бизнеспен жұмыс істейсіз бе? Чектер мен жабылатын құжаттарды ұсынасыз ба?",
    answer:
      "Иә, біз заңды тұлғалармен жұмыс істейміз. Клиенттеріміз үшін біз ыңғайлы және мөлдір ынтымақтастық үшін барлық қажетті жағдайларды ұсынамыз: автоматтандырылған төлем, жабылатын құжаттар, үлкен көлемдер үшін жеңілдіктер.",
  },
  {
    question: "max_tokens параметрі және алдын ала есептеу",
    answer:
      "max_tokens — бұл модель жауабында қайтаратын токендердің максималды санын белгілейтін параметр. Сұрау алдында AIGATE сізде ең қымбат сценарий үшін көрсетілген максималды токендер санын генерациялау үшін жеткілікті қаражат бар-жоғын тексереді.",
  },
  {
    question: "Баланс пен статистиканы алу үшін API бар ма?",
    answer:
      "GET https://api.aigate.kz/v1/aigate/balance - балансты алу. GET https://api.aigate.kz/v1/aigate/stats - шығын статистикасын алу. Authorization тақырыбында токенді көрсетуді ұмытпаңыз.",
  },
  {
    question: "Минутына қанша сұрау жасауға болады?",
    answer:
      "Сұраулар саны сіздің балансыңызға байланысты: 1000₸-ден төмен баланс — 10 секундта 10 сұрауға дейін, 1000-ден 4999₸-ға дейін — 10 секундта 50 сұрауға дейін, 5000₸ және одан жоғары — 10 секундта 100 сұрауға дейін.",
  },
  {
    question: "OpenAI кітапханасын қалай пайдалануға болады?",
    answer:
      "AIGATE толық OpenAI үйлесімді. Қолданыстағы кодыңызда тек base_url өзгертіңіз: openai.api_base = 'https://api.aigate.kz/v1' және API кілтіңізді көрсетіңіз. Барлық OpenAI кітапханалары (Python, JavaScript, PHP) қолдау көрсетіледі.",
  },
  {
    question:
      "Балансты қалай толтыруға болады? Қандай төлем әдістері қабылданады?",
    answer:
      "Баланс толтыру үшін contact@aigate.kz мекенжайына хат жазыңыз. Біз Kaspi, банк карталары, банк аударымдарын қабылдаймыз. Заңды тұлғалар үшін ресми есеп-шот беріледі. Қаражат 1-2 сағат ішінде есептеледі.",
  },
  {
    question:
      "Streaming режимі қолдау көрсетіледі ме? Веб-чатта жауаптар неге бірден келеді?",
    answer:
      "Қазіргі уақытта streaming режимі әзірлеу сатысында. Веб-чатта жауаптар толық генерацияланғаннан кейін бірден көрсетіледі. Streaming режимі жақын арада қосылады және токендер нақты пайдаланған мөлшерде есептеледі.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    content:
      "AIGATE арқылы біздің чат-бот жобасын жылдам іске қосып, клиенттер қызметін автоматтандырдық. VPN-сіз жұмыс істеуі өте ыңғайлы!",
    author: "Әлия К.",
    position: "IT компания директоры",
  },
  {
    content:
      "Теңгемен төлем жасау мүмкіндігі және мөлдір баға саясаты үлкен артықшылық. Басқа провайдерлерге қарағанда әлдеқайда тиімді.",
    author: "Марат Б.",
    position: "Стартап негізін қалаушы",
  },
  {
    content:
      "API интеграциясы өте қарапайым болды. Ескі кодты өзгертуге тура келмеді, тек base_url ауыстырдым.",
    author: "Дина С.",
    position: "Бағдарламашы",
  },
];

export const TECHNOLOGIES: Technology[] = [
  { name: "Python", icon: "🐍", description: "OpenAI кітапханасы" },
  { name: "JavaScript", icon: "📱", description: "Node.js, React, Vue" },
  { name: "Java", icon: "☕", description: "Spring Boot, Android" },
  { name: "C#", icon: "🔷", description: ".NET, Unity" },
  { name: "Rust", icon: "🦀", description: "Async HTTP clients" },
  { name: "Go", icon: "🐹", description: "HTTP клиенттер" },
  { name: "Ruby", icon: "💎", description: "Rails қосымшалары" },
  { name: "PHP", icon: "🐘", description: "Laravel, WordPress" },
];

export const USE_CASES: UseCase[] = [
  {
    title: "Чат-боттар",
    description:
      "Клиенттермен қарым-қатынас үшін ақылды чат-боттар құру. 24/7 қолдау көрсету автоматтандыру.",
    icon: "💬",
    models: ["gpt-4o", "claude-3.5-sonnet"],
  },
  {
    title: "Мәтін генерациясы",
    description:
      "Мақалалар, блог жазбалары, өнім сипаттамалары және басқа да мәтіндерді автоматты түрде жасау.",
    icon: "📝",
    models: ["deepseek-chat", "gemini-2.0-flash"],
  },
  {
    title: "Деректерді талдау",
    description:
      "Үлкен көлемдегі мәтіндік деректерді талдау, қорытынды жасау және инсайттар алу.",
    icon: "🔍",
    models: ["deepseek-r1", "gpt-4o"],
  },
  {
    title: "Аударма",
    description:
      "Жоғары сапалы аударма қызметі. Контекстті ескере отырып дәл аударма.",
    icon: "🌐",
    models: ["gpt-4o", "claude-3.5-sonnet"],
  },
  {
    title: "Креативті жұмыс",
    description:
      "Суреттер генерациясы, креативті мәтіндер жазу, дизайн идеялары ұсыну.",
    icon: "🎨",
    models: ["dall-e-3", "gpt-4o"],
  },
  {
    title: "Білім беру",
    description:
      "Интерактивті оқыту жүйелері, тапсырмаларды тексеру, персоналдандырылған оқу жоспарлары.",
    icon: "🎓",
    models: ["gpt-4o-mini", "gemini-2.0-flash"],
  },
];

export const ADVANTAGES: Advantage[] = [
  {
    title: "VPN қажет емес",
    description:
      "Қазақстаннан тікелей қолжетімділік. Қосымша құралдар қажет емес.",
    icon: "🚫",
  },
  {
    title: "Теңгемен төлем",
    description:
      "Қазақстандық банк карталарымен ыңғайлы төлем. Валюталық операциялар жоқ.",
    icon: "💰",
  },
  {
    title: "Жылдам жауап",
    description: "Қазақстандағы серверлер арқылы оңтайландырылған жылдамдық.",
    icon: "⚡",
  },
  {
    title: "Қауіпсіздік",
    description: "Сіздің деректеріңіз сақталмайды. Толық құпиялылық кепілдігі.",
    icon: "🔒",
  },
  {
    title: "Оңай интеграция",
    description:
      "OpenAI форматымен толық үйлесімділік. Кодты өзгерту қажет емес.",
    icon: "🔧",
  },
  {
    title: "Мөлдір есептілік",
    description:
      "Нақты уақыт режимінде шығын статистикасы мен баланс мониторингі.",
    icon: "📊",
  },
];

export const HERO_STATS: Stat[] = [
  { number: "99.9%", label: "Қолжетімділік" },
  { number: "15+", label: "AI модельдер" },
  { number: "24/7", label: "Қолдау көрсету" },
];

export const MAIN_STATS: Stat[] = [
  { number: "50M+", label: "Өңделген токендер" },
  { number: "500+", label: "Белсенді клиенттер" },
  { number: "99.9%", label: "Қызмет көрсету уақыты" },
  { number: "24/7", label: "Техникалық қолдау" },
];
