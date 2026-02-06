export interface ICategory {
  categoryName: string;
  categorySlug: string;
  categoryImage?: string;
  categoryDesc?: string;
  parentId?: string | null;
  categoryFilterKeys: string[];
}
