import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { NoticeRow } from "./NoticeRow";
import { Notice } from "@/lib/types/notice/notice";
import { EmptyState } from "@/components/web/EmptyState";
import { Bell } from "lucide-react";

interface NoticeTableProps {
  notices: Notice[];
  onEdit: (notice: Notice) => void;
  onUpdate: () => void;
}

export function NoticeTable({ notices, onEdit, onUpdate }: NoticeTableProps) {
  return (
    <div className="rounded border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Views</TableHead>
            <TableHead className="hidden md:table-cell">Author</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notices.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-muted-foreground"
              >
                <EmptyState
                  icon={<Bell size={40} />}
                  title="No Notices Found"
                />
              </TableCell>
            </TableRow>
          ) : (
            notices.map((notice) => (
              <NoticeRow
                key={notice._id}
                notice={notice}
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
