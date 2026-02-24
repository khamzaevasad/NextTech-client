"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

interface FaqListProps {
  faqs: Faq[];
}

export function FaqList({ faqs }: FaqListProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {faqs.map((faq) => (
        <AccordionItem
          key={faq._id}
          value={faq._id}
          className="border rounded-lg px-4 data-[state=open]:border-pink-200"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <span className="text-left font-medium">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-4">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
