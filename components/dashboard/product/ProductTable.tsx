import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ProductRow } from "./ProductRow";
import { Product } from "@/lib/types/product/product";
import { EmptyState } from "@/components/web/EmptyState";
import { Package } from "lucide-react";

export function ProductTable({ products, onUpdate }: any) {
  return (
    <div className="rounded border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-muted-foreground"
              >
                <EmptyState
                  icon={<Package size={"40"} />}
                  title="Product Not Found"
                />
              </TableCell>
            </TableRow>
          ) : (
            products.map((product: Product) => (
              <ProductRow
                key={product._id}
                product={product}
                onUpdate={onUpdate}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
