export interface SearchCategory {
  text?: string;
  parentId?: string | null;
}

export interface CategoriesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search: SearchCategory;
}

export interface CreateCategoryInput {
  categoryName: string;
  categoryImage?: string;
  categoryDesc?: string;
  parentId?: string;
  categoryFilterKeys?: string[];
}
