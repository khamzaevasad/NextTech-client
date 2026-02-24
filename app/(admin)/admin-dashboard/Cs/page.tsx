"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { LoadingBar } from "@/components/web/LoadingBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, HelpCircle } from "lucide-react";

import { Notice } from "@/lib/types/notice/notice";
import { Faq } from "@/lib/types/faq/faq";
import { NoticeStatus } from "@/lib/enums/notice.enum";
import { FaqCategory } from "@/lib/enums/faq.enum";

import {
  GET_FAQS_BY_ADMIN,
  GET_NOTICE_BY_ADMIN,
} from "@/apollo/admin/admin-query";
import {
  CREATE_NOTICE,
  UPDATE_NOTICE,
  CREATE_FAQ,
  UPDATE_FAQ,
} from "@/apollo/admin/admin-mutation";
import { toast } from "sonner";
import { NoticeSearchPanel } from "@/components/admin/cs/NoticeSearchPanel";
import { NoticeTable } from "@/components/admin/cs/NoticeTable";
import { FaqSearchPanel } from "@/components/admin/cs/FaqSearchPanel";
import { FaqTable } from "@/components/admin/cs/FaqTable";
import { NoticeFormModal } from "@/components/admin/cs/NoticeFormModal";
import { FaqFormModal } from "@/components/admin/cs/FaqFormModal";

const LIMIT = 5;

export default function CSPage() {
  /* --------------------------------- NOTICE --------------------------------- */
  const [noticePage, setNoticePage] = useState(1);
  const [noticeStatus, setNoticeStatus] = useState<NoticeStatus | "ALL">("ALL");
  const [noticeFormOpen, setNoticeFormOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  /* ---------------------------------- FAQ ----------------------------------- */
  const [faqPage, setFaqPage] = useState(1);
  const [faqCategory, setFaqCategory] = useState<FaqCategory | "ALL">("ALL");
  const [faqFormOpen, setFaqFormOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                               APOLLO - NOTICE                              */
  /* -------------------------------------------------------------------------- */

  const {
    data: noticeData,
    loading: noticeLoading,
    refetch: noticeRefetch,
  } = useQuery(GET_NOTICE_BY_ADMIN, {
    variables: {
      input: {
        page: noticePage,
        limit: LIMIT,
        search: {
          noticeStatus: noticeStatus !== "ALL" ? noticeStatus : undefined,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const [createNotice] = useMutation(CREATE_NOTICE, {
    onCompleted: () => {
      toast.success("Notice created successfully");
      noticeRefetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const [updateNotice] = useMutation(UPDATE_NOTICE, {
    onCompleted: () => {
      toast.success("Notice updated successfully");
      noticeRefetch();
    },
    onError: (err) => toast.error(err.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO - FAQ                                */
  /* -------------------------------------------------------------------------- */

  const {
    data: faqData,
    loading: faqLoading,
    refetch: faqRefetch,
  } = useQuery(GET_FAQS_BY_ADMIN, {
    variables: {
      input: {
        page: faqPage,
        limit: LIMIT,
        search: {
          faqCategory: faqCategory !== "ALL" ? faqCategory : undefined,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const [createFaq] = useMutation(CREATE_FAQ, {
    onCompleted: () => {
      toast.success("FAQ created successfully");
      faqRefetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const [updateFaq] = useMutation(UPDATE_FAQ, {
    onCompleted: () => {
      toast.success("FAQ updated successfully");
      faqRefetch();
    },
    onError: (err) => toast.error(err.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const notices: Notice[] = noticeData?.getNoticesByAdmin?.list || [];
  const noticeTotalCount =
    noticeData?.getNoticesByAdmin?.metaCounter?.[0]?.total || notices.length;
  const noticeTotalPages = Math.ceil(noticeTotalCount / LIMIT);

  const faqs: Faq[] = faqData?.getFaqsByAdmin?.list || [];
  const faqTotalCount =
    faqData?.getFaqsByAdmin?.metaCounter?.[0]?.total || faqs.length;
  const faqTotalPages = Math.ceil(faqTotalCount / LIMIT);

  const handleNoticePageChange = (newPage: number) => {
    setNoticePage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFaqPageChange = (newPage: number) => {
    setFaqPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNoticeEdit = (notice: Notice) => {
    setSelectedNotice(notice);
    setNoticeFormOpen(true);
  };

  const handleNoticeFormClose = () => {
    setNoticeFormOpen(false);
    setSelectedNotice(null);
  };

  const handleFaqEdit = (faq: Faq) => {
    setSelectedFaq(faq);
    setFaqFormOpen(true);
  };

  const handleFaqFormClose = () => {
    setFaqFormOpen(false);
    setSelectedFaq(null);
  };

  const handleNoticeSubmit = (input: Record<string, unknown>) => {
    if (selectedNotice) {
      updateNotice({
        variables: { input: { _id: selectedNotice._id, ...input } },
      });
    } else {
      createNotice({ variables: { input } });
    }
    handleNoticeFormClose();
  };

  const handleFaqSubmit = (input: Record<string, unknown>) => {
    if (selectedFaq) {
      updateFaq({ variables: { input: { _id: selectedFaq._id, ...input } } });
    } else {
      createFaq({ variables: { input } });
    }
    handleFaqFormClose();
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <LoadingBar loading={noticeLoading || faqLoading} />
      <div className="space-y-6 animate-in fade-in duration-500">
        <h1 className="text-2xl font-bold tracking-tight">
          Customer Support Management
        </h1>

        <Tabs defaultValue="notices">
          <TabsList>
            <TabsTrigger value="notices" className="gap-2">
              <Bell className="w-4 h-4" />
              Notices
            </TabsTrigger>
            <TabsTrigger value="faqs" className="gap-2">
              <HelpCircle className="w-4 h-4" />
              FAQs
            </TabsTrigger>
          </TabsList>

          {/* ─── NOTICES TAB ─────────────────────────────────────────────── */}
          <TabsContent value="notices" className="space-y-6 mt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <NoticeSearchPanel
                onStatusChange={(val) => {
                  setNoticeStatus(val as NoticeStatus | "ALL");
                  setNoticePage(1);
                }}
              />
              <Button
                className="bg-pink-500 hover:bg-pink-600 text-white cursor-pointer"
                onClick={() => setNoticeFormOpen(true)}
              >
                + New Notice
              </Button>
            </div>

            <NoticeTable
              notices={notices}
              onEdit={handleNoticeEdit}
              onUpdate={noticeRefetch}
            />

            {noticeTotalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={noticePage === 1}
                  onClick={() => handleNoticePageChange(noticePage - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: noticeTotalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      variant={noticePage === p ? "default" : "outline"}
                      className={cn(
                        "w-10 h-10",
                        noticePage === p && "bg-pink-500 hover:bg-pink-600",
                      )}
                      onClick={() => handleNoticePageChange(p)}
                    >
                      {p}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={noticePage === noticeTotalPages}
                  onClick={() => handleNoticePageChange(noticePage + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ─── FAQS TAB ────────────────────────────────────────────────── */}
          <TabsContent value="faqs" className="space-y-6 mt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <FaqSearchPanel
                onCategoryChange={(val) => {
                  setFaqCategory(val as FaqCategory | "ALL");
                  setFaqPage(1);
                }}
              />
              <Button
                className="bg-pink-500 hover:bg-pink-600 text-white cursor-pointer"
                onClick={() => setFaqFormOpen(true)}
              >
                + New FAQ
              </Button>
            </div>

            <FaqTable
              faqs={faqs}
              onEdit={handleFaqEdit}
              onUpdate={faqRefetch}
            />

            {faqTotalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={faqPage === 1}
                  onClick={() => handleFaqPageChange(faqPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: faqTotalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      variant={faqPage === p ? "default" : "outline"}
                      className={cn(
                        "w-10 h-10",
                        faqPage === p && "bg-pink-500 hover:bg-pink-600",
                      )}
                      onClick={() => handleFaqPageChange(p)}
                    >
                      {p}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={faqPage === faqTotalPages}
                  onClick={() => handleFaqPageChange(faqPage + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* MODALS */}
        <NoticeFormModal
          key={`notice-${noticeFormOpen}-${selectedNotice?._id ?? "new"}`}
          open={noticeFormOpen}
          notice={selectedNotice}
          onClose={handleNoticeFormClose}
          onSubmit={handleNoticeSubmit}
        />

        <FaqFormModal
          key={`faq-${faqFormOpen}-${selectedFaq?._id ?? "new"}`}
          open={faqFormOpen}
          faq={selectedFaq}
          onClose={handleFaqFormClose}
          onSubmit={handleFaqSubmit}
        />
      </div>
    </>
  );
}
