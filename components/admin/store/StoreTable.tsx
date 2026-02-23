import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { EmptyState } from "@/components/web/EmptyState";
import { Store } from "lucide-react";
import { _Store } from "@/lib/types/store/store";
import { StoreRow } from "./StoreRow";

interface StoreTableProps {
  stores: _Store[];
  onUpdate: () => void;
}

export function StoreTable({ stores, onUpdate }: StoreTableProps) {
  return (
    <div className="rounded border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Store Logo</TableHead>
            <TableHead>Store Name</TableHead>
            <TableHead className="hidden md:table-cell">Owner Name</TableHead>
            <TableHead className="hidden md:table-cell">
              Store Location
            </TableHead>
            <TableHead className="hidden md:table-cell">Store Rating</TableHead>
            <TableHead className="hidden md:table-cell">
              Product Count
            </TableHead>
            <TableHead className="hidden md:table-cell">Store Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-muted-foreground"
              >
                <EmptyState
                  icon={<Store size={"40"} />}
                  title="Store Not Found"
                />
              </TableCell>
            </TableRow>
          ) : (
            stores.map((store: _Store) => (
              <StoreRow key={store._id} store={store} onUpdate={onUpdate} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
