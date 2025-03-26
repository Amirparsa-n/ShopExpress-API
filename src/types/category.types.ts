export interface ICategory {
    _id: number;
    title: string;
    slug: string;
    description: string;
    icon: { filename: string; path: string };
    parent: ICategory;
    filters: CategoryFilter[];
    createdAt?: Date;
    updatedAt?: Date;
}

export type CategoryFilter = {
    name: string;
    slug: string;
    description?: string;
    type: 'radio' | 'checkbox';
    options: string[];
    min?: number;
    max?: number;
};

export interface ISubcategory {
    _id: number;
    title: string;
    slug: string;
    description: string;
    parent: ICategory;
    filters: CategoryFilter[];
    createdAt?: Date;
    updatedAt?: Date;
}
