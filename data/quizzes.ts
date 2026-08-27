import { ZoneType } from "@/config/game";

export interface QuizItem {
  id: number;
  zone: ZoneType;
  question: string;
  options: [string, string, string, string];
  answer: number; // 0, 1, 2, or 3
  explanation?: string;
  difficulty: "easy" | "normal" | "hard";
}

export const QUIZ_DATABASE: QuizItem[] = [
  // ==========================================
  // ZONE 01 — TECHNOLOGY (Teknologi Informasi)
  // ==========================================
  {
    id: 101,
    zone: "technology",
    question: "Apa kepanjangan dari CPU pada sistem komputer?",
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Program Utility",
      "Control Processing Unit"
    ],
    answer: 0,
    explanation: "CPU adalah singkatan dari Central Processing Unit, otak utama komputer.",
    difficulty: "easy"
  },
  {
    id: 102,
    zone: "technology",
    question: "Bahasa pemrograman apa yang banyak digunakan untuk pengembangan web interaktif?",
    options: ["Python", "JavaScript", "C++", "Assembly"],
    answer: 1,
    explanation: "JavaScript adalah bahasa utama yang berjalan secara native di browser web.",
    difficulty: "easy"
  },
  {
    id: 103,
    zone: "technology",
    question: "Struktur data mana yang menganut prinsip LIFO (Last In First Out)?",
    options: ["Queue (Antrean)", "Stack (Tumpukan)", "Array", "Linked List"],
    answer: 1,
    explanation: "Stack menggunakan prinsip LIFO, di mana elemen terakhir yang masuk adalah yang pertama keluar.",
    difficulty: "easy"
  },
  {
    id: 104,
    zone: "technology",
    question: "Protokol standar untuk transfer web yang aman dengan enkripsi SSL/TLS adalah...",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    answer: 2,
    explanation: "HTTPS (Hypertext Transfer Protocol Secure) menggunakan enkripsi untuk mengamankan data.",
    difficulty: "easy"
  },
  {
    id: 105,
    zone: "technology",
    question: "Manakah di bawah ini yang merupakan sistem basis data relasional (RDBMS)?",
    options: ["MongoDB", "PostgreSQL", "Redis", "Neo4j"],
    answer: 1,
    explanation: "PostgreSQL adalah contoh populer dari Relational Database Management System (RDBMS).",
    difficulty: "normal"
  },
  {
    id: 106,
    zone: "technology",
    question: "Sistem bilangan yang hanya menggunakan angka 0 dan 1 disebut...",
    options: ["Desimal", "Heksadesimal", "Biner", "Oktal"],
    answer: 2,
    explanation: "Sistem biner berbasis 2 hanya terdiri dari digit 0 dan 1.",
    difficulty: "easy"
  },
  {
    id: 107,
    zone: "technology",
    question: "Istilah 'Cloud Computing' mengacu pada...",
    options: [
      "Layanan komputasi melalui internet",
      "Komputer dengan sistem pendingin udara",
      "Jaringan tanpa kabel lokal",
      "Perangkat keras komputer transparan"
    ],
    answer: 0,
    explanation: "Cloud computing menyediakan resource komputasi via internet secara on-demand.",
    difficulty: "easy"
  },
  {
    id: 108,
    zone: "technology",
    question: "Kompleksitas waktu terbaik untuk algoritma Binary Search pada array terurut adalah...",
    options: ["O(n)", "O(n^2)", "O(log n)", "O(1)"],
    answer: 2,
    explanation: "Binary Search membagi pencarian menjadi dua setiap langkah, sehingga memiliki kompleksitas O(log n).",
    difficulty: "hard"
  },
  {
    id: 109,
    zone: "technology",
    question: "Apa fungsi utama dari Git dalam pembuatan perangkat lunak?",
    options: [
      "Desain antarmuka",
      "Version Control System (VCS)",
      "Kompilasi kode program",
      "Testing otomatis"
    ],
    answer: 1,
    explanation: "Git adalah sistem pengendali versi distributed terpopuler untuk melacak perubahan kode.",
    difficulty: "normal"
  },
  {
    id: 110,
    zone: "technology",
    question: "Format data ringan berbasis teks yang sering digunakan untuk pertukaran API adalah...",
    options: ["XML", "JSON", "CSV", "YAML"],
    answer: 1,
    explanation: "JSON (JavaScript Object Notation) sangat populer karena ringan dan mudah dibaca.",
    difficulty: "normal"
  },

  // ==========================================
  // ZONE 02 — INFORMATICS (Pendidikan Teknik Informatika)
  // ==========================================
  {
    id: 201,
    zone: "electronics",
    question: "Komponen elektronika yang berfungsi untuk membatasi arus listrik dinamakan...",
    options: ["Kapasitor", "Resistor", "Dioda", "Transistor"],
    answer: 1,
    explanation: "Resistor digunakan untuk menghambat atau membatasi arus listrik dalam rangkaian.",
    difficulty: "easy"
  },
  {
    id: 202,
    zone: "electronics",
    question: "Satuan standar internasional (SI) untuk mengukur nilai resistansi resistor adalah...",
    options: ["Farad", "Volt", "Ohm", "Ampere"],
    answer: 2,
    explanation: "Nilai hambatan/resistansi diukur dalam Ohm (Ω).",
    difficulty: "easy"
  },
  {
    id: 203,
    zone: "electronics",
    question: "Komponen semikonduktor yang hanya mengalirkan arus ke satu arah adalah...",
    options: ["Dioda", "Induktor", "Kapasitor", "Transformator"],
    answer: 0,
    explanation: "Dioda berfungsi sebagai katup satu arah bagi arus listrik.",
    difficulty: "easy"
  },
  {
    id: 204,
    zone: "electronics",
    question: "Papan pengembangan mikrokontroler open-source yang sangat populer untuk pemula adalah...",
    options: ["Arduino", "Intel Core i7", "Nvidia RTX", "Raspberry Pi Pico"],
    answer: 0,
    explanation: "Arduino adalah platform mikrokontroler paling populer dalam proyek elektronika awal.",
    difficulty: "easy"
  },
  {
    id: 205,
    zone: "electronics",
    question: "Sensor yang umum digunakan untuk mengukur jarak dengan gelombang suara ultra adalah...",
    options: ["DHT11", "HC-SR04", "LDR", "MQ-2"],
    answer: 1,
    explanation: "HC-SR04 adalah sensor ultrasonik jarak yang sering digunakan pada robotika.",
    difficulty: "normal"
  },
  {
    id: 206,
    zone: "electronics",
    question: "Komponen yang berfungsi menyimpan muatan listrik sementara adalah...",
    options: ["Resistor", "Kapasitor", "Dioda Zener", "Transistor NPN"],
    answer: 1,
    explanation: "Kapasitor menyerap dan menyimpan energi dalam bentuk medan elektrostatik.",
    difficulty: "easy"
  },
  {
    id: 207,
    zone: "electronics",
    question: "Sinyal PWM (Pulse Width Modulation) sering digunakan dalam elektronika untuk...",
    options: [
      "Mengontrol kecepatan motor & kecerahan LED",
      "Mengubah tegangan AC ke DC",
      "Menyimpan data permanen",
      "Memperbesar sinyal audio secara murni"
    ],
    answer: 0,
    explanation: "PWM mengatur lebar pulsa digital untuk mengendalikan daya rata-rata ke beban.",
    difficulty: "normal"
  },
  {
    id: 208,
    zone: "electronics",
    question: "Sensitivitas komponen LDR (Light Dependent Resistor) berubah berdasarkan...",
    options: ["Suhu udara", "Intensitas cahaya", "Tekanan udara", "Kelembaban"],
    answer: 1,
    explanation: "Nilai hambatan LDR akan menurun seiring meningkatnya intensitas cahaya.",
    difficulty: "easy"
  },
  {
    id: 209,
    zone: "electronics",
    question: "IC (Integrated Circuit) pewaktu legendaris dengan 8 pin yang sangat terkenal adalah...",
    options: ["NE555", "LM7805", "ATmega328", "MAX232"],
    answer: 0,
    explanation: "IC 555 adalah chip timer/oscillator klasik dalam dunia elektronika.",
    difficulty: "normal"
  },
  {
    id: 210,
    zone: "electronics",
    question: "Komponen yang bekerja sebagai sakelar elektronik berkecepatan tinggi atau penguat sinyal adalah...",
    options: ["Transistor", "Sekering", "Transformator", "Potensiometer"],
    answer: 0,
    explanation: "Transistor (BJT / MOSFET) adalah blok bangunan utama sakelar digital dan penguat sinyal.",
    difficulty: "normal"
  },

  // ==========================================
  // ZONE 03 — ELECTRONICS (Pendidikan Teknik Elektronika)
  // ==========================================
  {
    id: 301,
    zone: "electrical",
    question: "Hukum Ohm merumuskan hubungan antara tegangan (V), arus (I), dan hambatan (R) yaitu...",
    options: ["V = I × R", "V = I / R", "V = I + R", "V = R / I"],
    answer: 0,
    explanation: "Hukum Ohm menyatakan Tegangan (V) sama dengan Arus (I) dikali Hambatan (R).",
    difficulty: "easy"
  },
  {
    id: 302,
    zone: "electrical",
    question: "Satuan untuk mengukur daya listrik dalam sistem internasional adalah...",
    options: ["Joule", "Volt", "Watt", "Coulomb"],
    answer: 2,
    explanation: "Daya listrik dihitung dan dinyatakan dalam Watt (W).",
    difficulty: "easy"
  },
  {
    id: 303,
    zone: "electrical",
    question: "Jenis arus listrik yang mengalir dari jaringan PLN ke rumah-rumah pemukiman adalah...",
    options: [
      "DC (Direct Current)",
      "AC (Alternating Current)",
      "Static Current",
      "Pulse Current"
    ],
    answer: 1,
    explanation: "Listrik PLN mengalirkan arus bolak-balik (Alternating Current / AC).",
    difficulty: "easy"
  },
  {
    id: 304,
    zone: "electrical",
    question: "Perangkat listrik yang digunakan untuk menaikkan atau menurunkan tegangan AC adalah...",
    options: ["Inverter", "Transformator (Trafo)", "Generator", "Kapasitor Bank"],
    answer: 1,
    explanation: "Transformator mengubah tingkat tegangan AC melalui induksi elektromagnetik.",
    difficulty: "easy"
  },
  {
    id: 305,
    zone: "electrical",
    question: "Rumus perhitungan daya listrik (P) sederhana arus searah adalah...",
    options: ["P = V × I", "P = V / I", "P = I² / V", "P = V² × I"],
    answer: 0,
    explanation: "Daya listrik P dihitung dengan mengalikan Tegangan V dengan Arus I.",
    difficulty: "easy"
  },
  {
    id: 306,
    zone: "electrical",
    question: "Alat pengaman rangkaian yang akan meleleh/terputus saat terjadi arus lebih (short circuit) adalah...",
    options: ["Sakelar", "Sekering (Fuse)", "Voltmeter", "Kontaktor"],
    answer: 1,
    explanation: "Sekering (Fuse) melindungi peralatan dari lonjakan arus berbahaya dengan memutus kawat lebur.",
    difficulty: "easy"
  },
  {
    id: 307,
    zone: "electrical",
    question: "Frekuensi standar listrik AC PLN di Indonesia adalah...",
    options: ["60 Hz", "50 Hz", "100 Hz", "24 Hz"],
    answer: 1,
    explanation: "Frekuensi standar daya listrik AC di Indonesia adalah 50 Hertz.",
    difficulty: "normal"
  },
  {
    id: 308,
    zone: "electrical",
    question: "Kombinasi tiga fase arus AC yang berjarak sudut fase 120° dinamakan listrik...",
    options: ["1 Fase", "2 Fase", "3 Fase", "Multi Fase"],
    answer: 2,
    explanation: "Sistem 3 Fase memanfaatkan tiga kawat konduktor dengan beda fase 120° untuk daya industri besar.",
    difficulty: "normal"
  },
  {
    id: 309,
    zone: "electrical",
    question: "Alat ukur kombinasi yang dapat mengukur Volt, Ampere, dan Ohm sekaligus adalah...",
    options: ["Oscilloscope", "Multimeter (Avometer)", "Wattmeter", "Frequency Counter"],
    answer: 1,
    explanation: "Multimeter atau AVO-meter mengukur Ampere, Volt, dan Ohm.",
    difficulty: "easy"
  },
  {
    id: 310,
    zone: "electrical",
    question: "Hukum Kirchoff Pertama (KCL - Current Law) menyatakan bahwa jumlah arus masuk titik cabang...",
    options: [
      "Sama dengan jumlah arus keluar",
      "Selalu dua kali lipat arus keluar",
      "Selalu nol",
      "Tergantung pada nilai resistansi"
    ],
    answer: 0,
    explanation: "KCL menyatakan total arus yang masuk ke suatu titik percabangan sama dengan total arus yang keluar.",
    difficulty: "normal"
  }
];

const LOCAL_STORAGE_QUIZ_KEY = "himanika_custom_quizzes";

export const getQuizzes = (): QuizItem[] => {
  if (typeof window === "undefined") return QUIZ_DATABASE;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load custom quizzes from localStorage", e);
  }
  return QUIZ_DATABASE;
};

export const saveQuizzes = (quizzes: QuizItem[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_QUIZ_KEY, JSON.stringify(quizzes));
  } catch (e) {
    console.error("Failed to save custom quizzes", e);
  }
};

export const resetQuizzesToDefault = (): QuizItem[] => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_QUIZ_KEY);
  }
  return QUIZ_DATABASE;
};

export const addQuizItem = (newQuiz: Omit<QuizItem, "id">): QuizItem[] => {
  const quizzes = getQuizzes();
  const nextId = quizzes.length > 0 ? Math.max(...quizzes.map((q) => q.id)) + 1 : 101;
  const created: QuizItem = { ...newQuiz, id: nextId };
  const updated = [created, ...quizzes];
  saveQuizzes(updated);
  return updated;
};

export const updateQuizItem = (id: number, updatedQuiz: Omit<QuizItem, "id">): QuizItem[] => {
  const quizzes = getQuizzes();
  const updated = quizzes.map((q) => (q.id === id ? { ...updatedQuiz, id } : q));
  saveQuizzes(updated);
  return updated;
};

export const deleteQuizItem = (id: number): QuizItem[] => {
  const quizzes = getQuizzes();
  const updated = quizzes.filter((q) => q.id !== id);
  saveQuizzes(updated);
  return updated;
};

export const getRandomQuizForZone = (zone: ZoneType, excludeIds: number[] = []): QuizItem => {
  const allQuizzes = getQuizzes();
  const available = allQuizzes.filter(
    (q) => q.zone === zone && !excludeIds.includes(q.id)
  );

  if (available.length === 0) {
    // If all used, fallback to any in zone
    const zoneQuizzes = allQuizzes.filter((q) => q.zone === zone);
    if (zoneQuizzes.length === 0) {
      return QUIZ_DATABASE[0];
    }
    return zoneQuizzes[Math.floor(Math.random() * zoneQuizzes.length)];
  }

  return available[Math.floor(Math.random() * available.length)];
};

