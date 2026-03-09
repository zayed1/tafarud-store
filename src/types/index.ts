export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  image_url: string | null;
  category_id: string | null;
  featured: boolean;
  created_at: string;
  category?: Category;
  purchase_links?: PurchaseLink[];
}

export interface PurchaseLink {
  id: string;
  product_id: string;
  platform_name: string;
  url: string;
  country_code: string;
  icon_url: string | null;
  is_enabled: boolean;
  sort_order: number;
}
