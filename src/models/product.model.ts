

export class ProductModel {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    supplierCode: string;
    createdDate: Date;
    updatedDate: Date;
    active: boolean;
  
    constructor(data: Partial<ProductModel>) {
      this.id = data.id || "";
      this.name = data.name || "";
      this.description = data.description || "";
      this.price = data.price || 0;
      this.images = data.images || [];
      this.category = data.category || "";
      this.supplierCode = data.supplierCode || "";
      this.createdDate = data.createdDate ? new Date(data.createdDate) : new Date();
      this.updatedDate = data.updatedDate ? new Date(data.updatedDate) : new Date();
      this.active = data.active ?? true;
    }
  }