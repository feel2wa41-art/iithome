export type Locale = 'en' | 'id';

export interface ProductCategory {
  id: string;
  slug: string;
  name_en: string;
  name_id: string;
  description_en: string | null;
  description_id: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  category_id: string | null;
  slug: string;
  name_en: string;
  name_id: string;
  short_en: string | null;
  short_id: string | null;
  description_en: string | null;
  description_id: string | null;
  specs: Record<string, string> | null;
  image_url: string | null;
  gallery: string[] | null;
  is_active: boolean;
  sort_order: number;
}

export interface CareerPosting {
  id: string;
  slug: string;
  title_en: string;
  title_id: string;
  location: string | null;
  type: string | null;
  description_en: string | null;
  description_id: string | null;
  requirements_en: string | null;
  requirements_id: string | null;
  is_active: boolean;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  created_at: string;
}
