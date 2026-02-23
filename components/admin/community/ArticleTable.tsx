import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { EmptyState } from "@/components/web/EmptyState";
import { BookImage } from "lucide-react";
import { BoardArticle } from "@/lib/types/articles/article";
import { ArticleRow } from "./ArticleRow";

interface StoreTableProps {
  articles: BoardArticle[];
  onUpdate: () => void;
}

export function ArticleTable({ articles, onUpdate }: StoreTableProps) {
  return (
    <div className="rounded border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="md:table-cell">Title</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Writer</TableHead>
            <TableHead className="hidden md:table-cell">Views</TableHead>
            <TableHead className="hidden md:table-cell">Likes</TableHead>
            <TableHead className="hidden md:table-cell">
              Register Date
            </TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-muted-foreground"
              >
                <EmptyState
                  icon={<BookImage size={"40"} />}
                  title="Article Not Found"
                />
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article: BoardArticle) => (
              <ArticleRow
                key={article._id}
                article={article}
                onUpdate={onUpdate}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
