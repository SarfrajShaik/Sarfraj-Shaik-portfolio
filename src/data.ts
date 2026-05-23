import { Post, Service, Project, ResumeItem } from './types';

export const servicesData: Service[] = [
  {
    id: 'core-cs',
    title: 'Computer Science Foundations',
    description: 'Rigorous training in advanced data structures, analysis of algorithms, system engineering, and clean code principles in Python and TypeScript.',
    iconName: 'Workflow'
  },
  {
    id: 'ml-ai',
    title: 'Machine Learning & Predictive Modeling',
    description: 'Building and evaluating statistics-driven models, classification pipelines, and scientific algorithms using PyTorch and Scikit-Learn.',
    iconName: 'Sparkles'
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics & Visualization',
    description: 'Translating complex datasets into actionable narratives. Experienced in exploratory data analysis (EDA), Pandas, and interactive D3/Recharts dashboards.',
    iconName: 'Compass'
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering & Database Systems',
    description: 'Structuring optimal database schemas, formulating complex SQL transactions, and engineering lightweight ETL pipelines for academic and clinical research datasets.',
    iconName: 'Wrench'
  }
];

export const postsData: Post[] = [
  {
    id: 'post-1',
    title: 'Design Systems: Streamlining Collaboration Between Developers and Designers',
    excerpt: 'A well-structured design system is a game-changer for teams working on frontend development and UI design. This article explores how design systems enhance collaboration, promote consistency, and expedite the design-to-development process.',
    date: 'Jul 10',
    readTime: '5 min read',
    category: 'Design'
  },
  {
    id: 'post-2',
    title: 'The Role of Animation in Modern User Interfaces: Enhancing Interactivity and Engagement',
    excerpt: 'Animations can breathe life into static interfaces when used with intent. Discover how motion design coordinates attention, reduces cognitive load, and builds an intuitive flow for interactive products.',
    date: 'Jul 04',
    readTime: '5 min read',
    category: 'Design'
  },
  {
    id: 'post-3',
    title: 'Optimizing Web Performance: Strategies for Faster Load Times and Smooth User Experiences',
    excerpt: 'Performance is crucial in modern web development. This article covers techniques and best practices to optimize frontend code, leverage caching, and improve website performance, resulting in quicker load times and a better user experience.',
    date: 'Jun 28',
    readTime: '6 min read',
    category: 'Optimization'
  },
  {
    id: 'post-4',
    title: 'Modular Frontend Architectures: Organizing Large React Workspaces for Scale',
    excerpt: 'Scaling software requires structuring code logically before issues arise. Explore modular designs, package scopes, and folder structures that foster rapid expansion without codebase friction.',
    date: 'May 16',
    readTime: '8 min read',
    category: 'Development'
  }
];

export const projectsData: Project[] = [
  {
    id: 'proj-1',
    title: 'ClinicaVision: Explainable Radiographic AI Classifier',
    description: 'Developed an ensemble neural network comprising vision transformers and convolutional layers to classify diagnostic patterns. Implemented visual layer activation maps (Grad-CAM) to explain localized statistical decision weights.',
    category: 'Computer Vision, Deep Learning, Healthcare',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=500',
    link: 'https://github.com',
    starred: true
  },
  {
    id: 'proj-2',
    title: 'AeroSense: Spatiotemporal Environmental Forecaster',
    description: 'Designed a telemetry pipeline that ingests particulate sensors and atmospheric logs. Built multi-step LSTM and multivariate Prophet predictors forecasting micro-climate air quality indices for urban zone analytics.',
    category: 'Time-Series Modeling, Predictive Analysis, GIS',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800&h=500',
    link: 'https://github.com',
    starred: true
  },
  {
    id: 'proj-3',
    title: 'DriftSentry: Automated ML Drift Pipeline',
    description: 'Created a modular validation container that evaluates statistical drift and population stability index (PSI) for incoming tabular feature streams. Triggers retraining pipelines when data distributions decay.',
    category: 'MLOps, Statistical Pipeline Engineering',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500',
    starred: false
  }
];

export const resumeData: ResumeItem[] = [
  {
    id: 'res-1',
    role: 'Undergraduate Researcher & Data Science Intern',
    company: 'University CS Research Lab / Tech Partners',
    period: '2023 - Present',
    description: 'Formulating regression metrics, cleaning messy unstructured log outputs, and building machine learning models for prediction utilities.',
    skills: ['Python', 'Pandas/NumPy', 'Scikit-Learn', 'PyTorch', 'SQL / NoSQL']
  },
  {
    id: 'res-2',
    role: 'Computer Science Final-Year Student',
    company: 'School of Information Technology & Engineering',
    period: '2020 - 2024',
    description: 'Cultivating strong computing fundamentals in Big Data architectures, statistical compute modeling, advanced algorithms, and deep neural design.',
    skills: ['Data Structures', 'Statistical Inference', 'Predictive Modeling', 'Interactive Analytics', 'TypeScript']
  },
  {
    id: 'res-3',
    role: 'Data Systems Developer (Academic Projects)',
    company: 'CS Engineering Division Lab Projects',
    period: '2021 - 2023',
    description: 'Designed relational database backends, scraped raw information, and mapped live data queries into responsive diagnostic panels.',
    skills: ['React/Vite', 'Express.js', 'PostgreSQL', 'FastAPI', 'TailwindCSS']
  }
];
