"use client";

import { useState } from "react";
import { Faq } from "@/lib/types/faq/faq";
import { FaqCategory } from "@/lib/enums/faq.enum";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface FaqFormModalProps {
  open: boolean;
  faq: Faq | null;
  onClose: () => void;
  onSubmit: (input: Record<string, unknown>) => void; // majburiy
  onSuccess?: () => void; // ixtiyoriy
}

const FAQ_CATEGORIES: { value: FaqCategory; label: string }[] = [
  { value: "GENERAL", label: "General" },
  { value: "PAYMENT", label: "Payment" },
  { value: "ACCOUNT", label: "Account" },
  { value: "SERVICE", label: "Service" },
  { value: "SELLER", label: "Seller" },
];

export function FaqFormModal({
  open,
  faq,
  onClose,
  onSubmit,
  onSuccess,
}: FaqFormModalProps) {
  const isEdit = !!faq;

  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [category, setCategory] = useState<FaqCategory>(
    faq?.category ?? "GENERAL",
  );
  const [isActive, setIsActive] = useState(faq?.isActive ?? true);
  const [order, setOrder] = useState(faq?.order ?? 0);

  const handleSubmit = () => {
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }

    // logic o‘zgarmagan
    if (isEdit) {
      onSubmit({ question, answer, category, isActive, order });
    } else {
      onSubmit({ question, answer, category });
    }

    onSuccess?.(); // ✅ FIX: tashqi refetch/side-effect uchun
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit FAQ" : "Create FAQ"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as FaqCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FAQ_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="Enter question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              placeholder="Enter answer"
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          {isEdit && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  min={0}
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Active</Label>
                <div className="flex items-center gap-2 pt-2">
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                  <span className="text-sm text-muted-foreground">
                    {isActive ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-pink-500 hover:bg-pink-600 text-white"
            onClick={handleSubmit}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
