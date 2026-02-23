import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
// import { ProductRow } from "./ProductRow";
import { EmptyState } from "@/components/web/EmptyState";
import { Member } from "@/lib/types/member/member";
import { MemberRow } from "./MemberRow";
import { Users } from "lucide-react";

interface MemberTableProps {
  members: Member[];
  onUpdate: () => void;
}

export function MemberTable({ members, onUpdate }: MemberTableProps) {
  return (
    <div className="rounded border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="md:table-cell">Image</TableHead>
            <TableHead>Nick Name</TableHead>
            <TableHead className="hidden md:table-cell">Full Name</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead className="hidden md:table-cell">Member Type</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-10 text-muted-foreground"
              >
                <EmptyState
                  icon={<Users size={"40"} />}
                  title="Member Not Found"
                />
              </TableCell>
            </TableRow>
          ) : (
            members.map((member: Member) => (
              <MemberRow key={member._id} member={member} onUpdate={onUpdate} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
