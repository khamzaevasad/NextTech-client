import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Category } from "@/lib/types/category/category";
import { EmptyState } from "@/components/web/EmptyState";
import { LayoutGrid } from "lucide-react";
import { CategoryRow } from "./CategoryRow";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export function CategoryTable({ categories, onEdit }: CategoryTableProps) {
  return (
    <div className="rounded border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="hidden md:table-cell w-16">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Slug</TableHead>
            <TableHead className="hidden md:table-cell">Filter Keys</TableHead>
            <TableHead className="text-right w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-muted-foreground"
              >
                <EmptyState
                  icon={<LayoutGrid size={40} />}
                  title="No Categories Found"
                />
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <CategoryRow
                key={category._id}
                category={category}
                onEdit={onEdit}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
