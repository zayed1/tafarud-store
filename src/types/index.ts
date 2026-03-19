export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image_url: string | null;
  created_at: string;
}

export interface Author {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  bio_ar: string;
  bio_en: string;
  image_url: string | null;
  social_links: { platform: string; url: string }[] | null;
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
  gallery_urls?: string[] | null;
  category_id: string | null;
  author_id: string | null;
  featured: boolean;
  created_at: string;
  category?: Category;
  author?: Author;
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

export interface Banner {
  id: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  image_url: string | null;
  link: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: "added" | "updated" | "deleted";
  entity_type: "product" | "category" | "banner" | "settings" | "coupon";
  entity_name: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}
