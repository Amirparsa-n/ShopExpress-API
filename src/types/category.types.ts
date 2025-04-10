export interface Category {
    _id: string;
    title: string;
    slug: string;
    description: string;
    icon: { filename: string; path: string };
    parent: Category;
    filters: CategoryFilter[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CategoryFilter {
    name: string;
    slug: string;
    description?: string;
    type: 'checkbox' | 'radio';
    options: string[];
    min?: number;
    max?: number;
}

export interface Subcategory {
    _id: string;
    title: string;
    slug: string;
    description: string;
    parent: Category;
    filters: CategoryFilter[];
    createdAt?: Date;
    updatedAt?: Date;
}
