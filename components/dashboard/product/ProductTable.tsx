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
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { MemberType } from "@/lib/enums/member.enum";

interface ProductTableProps {
  products: Product[];
  onUpdate: () => void;
}

export function ProductTable({ products, onUpdate }: ProductTableProps) {
  const user = useReactiveVar(userVar);
  return (
    <div className="rounded border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="hidden md:table-cell">Image</TableHead>
            <TableHead>Product Name</TableHead>
            {user.memberType === MemberType.ADMIN && (
              <TableHead className="hidden md:table-cell">Store</TableHead>
            )}
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead className="hidden md:table-cell">Stock</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            {user.memberType === MemberType.SELLER && (
              <TableHead className="text-right">Actions</TableHead>
            )}
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
