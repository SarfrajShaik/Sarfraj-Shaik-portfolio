export interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: 'Design' | 'Optimization' | 'Development' | 'Business';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  image: string;
  link?: string;
  starred?: boolean;
}

export interface ResumeItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}
