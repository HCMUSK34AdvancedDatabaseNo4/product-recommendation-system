export class ProductModel {
  id: string;
  productName: string;
  description: string;
  price: number;
  images: string[];

  constructor(data: Partial<ProductModel>) {
    this.id = data.id || "";
    this.productName = data.productName || "";
    this.description = data.description || "";
    this.price = data.price || 0;
    this.images = data.images || [];
  }
}