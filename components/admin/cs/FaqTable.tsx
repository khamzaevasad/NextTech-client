import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FaqRow } from "./FaqRow";
import { Faq } from "@/lib/types/faq/faq";
import { EmptyState } from "@/components/web/EmptyState";
import { HelpCircle } from "lucide-react";

interface FaqTableProps {
  faqs: Faq[];
  onEdit: (faq: Faq) => void;
  onUpdate: () => void;
}

export function FaqTable({ faqs, onEdit, onUpdate }: FaqTableProps) {
  return (
    <div className="rounded border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Answer</TableHead>
            <TableHead className="hidden md:table-cell">Order</TableHead>
            <TableHead className="hidden md:table-cell">Active</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-muted-foreground"
              >
                <EmptyState
                  icon={<HelpCircle size={40} />}
                  title="No FAQs Found"
                />
              </TableCell>
            </TableRow>
          ) : (
            faqs.map((faq) => (
              <FaqRow
                key={faq._id}
                faq={faq}
                onEdit={onEdit}
                onUpdate={onUpdate}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
