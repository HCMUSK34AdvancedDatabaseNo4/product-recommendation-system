export class ProductCategoryModel {
    id: string;
    name: string;
    description: string;

    constructor(data: Partial<ProductCategoryModel>) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.description = data.description || "";
    }
}