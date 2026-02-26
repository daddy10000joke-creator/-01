export interface PortfolioItem {
  id: number;
  category: 'apartment' | 'commercial' | 'house';
  title: string;
  location: string;
  size: string;
  scope: string;
  intent: string;
  points: string;
  images: string[];
  created_at: string;
}

export interface TodayDesignItem {
  id: number;
  title: string;
  before_img: string;
  after_img: string;
  material: string;
  intent: string;
  created_at: string;
}

export interface SiteSettings {
  phone: string;
  philosophy_design: string;
  philosophy_const: string;
  about_name: string;
  about_bio: string;
  [key: string]: string;
}
