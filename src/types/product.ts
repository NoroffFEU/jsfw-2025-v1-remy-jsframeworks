export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductReview {
  id: string;
  rating: number;
  description?: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  discountedPrice: number;
  rating?: number;          
  image?: ProductImage;     
  reviews?: ProductReview[]; 
  tags?: string[];
}


export interface ApiListResponse<T> {
  data: T[];
}

export interface ApiItemResponse<T> {
  data: T;
}