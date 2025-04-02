export class ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;

  constructor(data: Partial<ProductModel>) {
    this.id = data.id || "";
    this.name = data.name || "";
    this.description = data.description || "";
    this.price = data.price || 0;
    this.images = data.images || [];
    this.category = data.category || "";
  }
}