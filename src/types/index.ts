export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Model {
  name: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
}

export interface Service {
  name: string;
  provider: string;
  price: number;
  unit: string;
  quality?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  content: string;
  author: string;
  position: string;
}

export interface Technology {
  name: string;
  icon: string;
  description: string;
}

export interface UseCase {
  title: string;
  description: string;
  icon: string;
  models: string[];
}

export interface Advantage {
  title: string;
  description: string;
  icon: string;
}

export interface Stat {
  number: string;
  label: string;
}
