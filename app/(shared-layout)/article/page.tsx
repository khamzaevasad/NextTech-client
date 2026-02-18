"use client";

import React, { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Image as ImageIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";
import { useMutation, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { useRouter } from "next/navigation";
import { BoardArticleCategory } from "@/lib/enums/board-article.enum";
import {
  CREATE_BOARD_ARTICLE,
  IMAGE_UPLOADER,
} from "@/apollo/user/user-mutation";
import { toast } from "sonner";
import { AuthGuard } from "@/app/auth/AuthGuard";

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}

const ToolbarButton = ({ onClick, active, children }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`p-2 rounded-md transition-colors ${
      active
        ? "bg-foreground text-background"
        : "text-muted-foreground hover:bg-muted"
    }`}
  >
    {children}
  </button>
);

export default function WriteArticlePage() {
  const user = useReactiveVar(userVar);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<BoardArticleCategory>(
    BoardArticleCategory.FREE,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const [createArticle] = useMutation(CREATE_BOARD_ARTICLE);
  const [uploadImage] = useMutation(IMAGE_UPLOADER);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: true }),
      Placeholder.configure({
        placeholder: "Write your article content here...",
      }),
      Link.configure({ openOnClick: false }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none focus:outline-none min-h-[450px] p-6 text-foreground",
      },
    },
  });

  /* ---------------------------- handleImageChange --------------------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        editor
          .chain()
          .focus()
          .setImage({ src: reader.result as string })
          .run();
      };
      reader.readAsDataURL(file);
    }
  };

  /* ------------------------------ handlePublish ----------------------------- */
  const handlePublish = async () => {
    try {
      if (!user._id) {
        return toast.error("Please login first to write an article!");
      }

      if (!title.trim()) return toast.error("Please enter a title!");
      if (!editor || editor.isEmpty)
        return toast.error("Please write some content!");

      let uploadedImageUrl = "";

      if (imageFile) {
        toast.info("Uploading image...");
        const { data: uploadData } = await uploadImage({
          variables: {
            file: imageFile,
            target: "article",
          },
        });
        uploadedImageUrl = uploadData.imageUploader;
        editor.commands.setImage({
          src: `${process.env.NEXT_PUBLIC_API_URL}/${uploadedImageUrl}`,
        });
      }

      const { data } = await createArticle({
        variables: {
          input: {
            articleCategory: category,
            articleTitle: title,
            articleContent: editor.getText(),
            articleImage: uploadedImageUrl,
          },
        },
      });

      if (data.createBoardArticle) {
        toast.success("Article published successfully!");
        router.push(`/community/${data.createBoardArticle._id}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Publish Error:", err);
        toast.error(err.message || "Failed to publish article");
      } else {
        toast("Unexpected error occurred");
      }
    }
  };

  if (!editor) return null;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background py-10 px-4">
        <main className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Article
            </h1>
            <p className="text-muted-foreground">
              Share your thoughts and expertise.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block ml-1">
                Category
              </label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as BoardArticleCategory)}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">Free Board</SelectItem>
                  <SelectItem value="RECOMMEND">Recommendation</SelectItem>
                  <SelectItem value="NEWS">News</SelectItem>
                  <SelectItem value="HUMOR">Humor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-2/3">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block ml-1">
                Article Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title here..."
                className="h-11 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="border border-input rounded-xl overflow-hidden bg-card shadow-sm">
            <div className="flex items-center flex-wrap gap-1 p-2 border-b border-input bg-muted/20">
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                active={editor.isActive("heading", { level: 1 })}
              >
                <Heading1 size={18} />
              </ToolbarButton>

              <div className="w-px h-4 bg-border mx-1" />

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive("bold")}
              >
                <Bold size={18} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive("italic")}
              >
                <Italic size={18} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                active={editor.isActive("strike")}
              >
                <Strikethrough size={18} />
              </ToolbarButton>

              <div className="w-px h-4 bg-border mx-1" />

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive("bulletList")}
              >
                <List size={18} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive("orderedList")}
              >
                <ListOrdered size={18} />
              </ToolbarButton>

              <div className="w-px h-4 bg-border mx-1" />

              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
              />
              <ToolbarButton onClick={() => fileInputRef.current?.click()}>
                <ImageIcon size={18} />
              </ToolbarButton>

              <ToolbarButton onClick={() => {}}>
                <LinkIcon size={18} />
              </ToolbarButton>
            </div>

            <div className="bg-transparent">
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              className="px-6 h-11"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              className="px-10 h-11 font-semibold shadow-sm"
              onClick={handlePublish}
              disabled={!user._id}
            >
              Publish Article
            </Button>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
