export class ProductCategoryModel {
    id: string;
    name: string;
    description: string;
    createdDate: Date;
    updatedDate: Date;
    active: boolean;

    constructor(data: Partial<ProductCategoryModel>) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.description = data.description || "";
        this.createdDate = data.createdDate ? new Date(data.createdDate) : new Date();
        this.updatedDate = data.updatedDate ? new Date(data.updatedDate) : new Date();
        this.active = data.active ?? true;
    }
}