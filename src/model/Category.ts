export interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
}

export interface CategoryTable {
  [key: number]: Category;
}
