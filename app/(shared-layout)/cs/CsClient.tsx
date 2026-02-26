"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoticeSection } from "@/components/cs/NoticeSection";
import { FaqSection } from "@/components/cs/FaqSection";
import { Bell, MessageCircleQuestion } from "lucide-react";

export default function CsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-2">Customer Support</h1>
          <p className="text-muted-foreground">
            Find answers and stay updated with our latest announcements
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Tabs defaultValue="notice" className="w-full">
          {/* Tabs - Centered */}
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="notice" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notices
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <MessageCircleQuestion className="h-4 w-4" />
                FAQ
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="notice" className="mt-0">
            <NoticeSection />
          </TabsContent>

          <TabsContent value="faq" className="mt-0">
            <FaqSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
