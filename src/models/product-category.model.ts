export class ProductCategoryModel {
    id: string;
    categoryName: string;
    description: string;

    constructor(data: Partial<ProductCategoryModel>) {
        this.id = data.id || "";
        this.categoryName = data.categoryName || "";
        this.description = data.description || "";
    }
}