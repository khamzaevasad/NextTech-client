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
