"use client";
import { use } from "react";
import { format, isValid } from "date-fns";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { GET_BOARD_ARTICLE } from "@/apollo/user/user-query";
import { GridPattern } from "@/components/ui/grid-pattern";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL } from "@/lib/config";
import Image from "next/image";
import { BoardArticle } from "@/lib/types/articles/article";
import { LoadingBar } from "@/components/web/LoadingBar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LIKE_TARGET_ARTICLE } from "@/apollo/user/user-mutation";
import { T } from "@/lib/types/common";
import { Message } from "@/lib/enums/common.enum";
import { toast } from "sonner";
import { userVar } from "@/apollo/store";
import ArticleReviews from "@/components/community/ArticleReviews";

interface ArticleDetailProps {
  params: Promise<{ _id: string }>;
}

export default function ArticleDetailpage({ params }: ArticleDetailProps) {
  const { _id } = use(params);
  const user = useReactiveVar(userVar);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const [LikeTargetArticle] = useMutation(LIKE_TARGET_ARTICLE, {});

  const {
    data: articleData,
    loading: articleLoading,
    refetch: articleRefetch,
  } = useQuery(GET_BOARD_ARTICLE, {
    variables: { input: _id },
    fetchPolicy: "cache-and-network",
    skip: !_id,
  });

  const article: BoardArticle = articleData?.getBoardArticle ?? [];

  const {
    articleTitle,
    articleContent,
    articleImage,
    articleCategory,
    articleViews,
    articleLikes,
    articleComments,
    createdAt,
    memberData,
  } = article;

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */
  const date = new Date(createdAt);
  const formattedDate = isValid(date)
    ? format(date, "MMM dd, yyyy")
    : "Date unknown";

  const isLiked = article?.meLiked && article?.meLiked[0]?.myFavorite;

  /* --------------------------- likeArticleHandler --------------------------- */
  const likeArticleHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await LikeTargetArticle({
        variables: {
          input: id,
        },
      });
      await articleRefetch({ input: _id });
      toast("success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("LikeProductHandler error", err.message);
        toast(err.message);
      } else {
        toast("Unexpected error occurred");
      }
    }
  };

  return (
    <>
      <LoadingBar loading={articleLoading} />
      <div className="relative bg-background">
        <div className="relative bg-background overflow-x-hidden"></div>
        {/* BG Grid Pattern */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
          <GridPattern
            className="absolute inset-0 size-full stroke-border"
            height={30}
            width={30}
            x={0}
            y={0}
          />
        </div>

        <main className="relative z-10 my-8">
          <div className="text-sm text-gray-400 mb-8">
            <Link
              href="/community"
              className="hover:text-pink-500 text-muted-foreground cursor-pointer"
            >
              Community
            </Link>
            <span className="mx-2">/</span>
            <span>{article.articleTitle}</span>
          </div>
          <article className="space-y-8">
            {/*  Meta info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant={"secondary"}>{articleCategory}</Badge>
                <span className="text-muted-foreground text-xs flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {formattedDate}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                {articleTitle}
              </h1>
            </div>

            {/* author */}
            <div className="flex items-center justify-between py-6 border-y border-border/60">
              <div className="flex items-center gap-3">
                <Avatar className="size-12 border-2 border-background shadow-sm">
                  <AvatarImage
                    src={`${API_URL}/${memberData?.memberImage}`}
                    alt={memberData?.memberNick}
                  />
                  <AvatarFallback className="bg-rose-500 text-white">
                    {memberData?.memberNick?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {memberData?.memberNick}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {memberData?.memberArticles} articles ·{" "}
                    {memberData?.memberFollowers} followers
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-5 hover:bg-rose-500 hover:text-white transition-colors"
              >
                Follow
              </Button>
            </div>

            {/* article image */}
            {articleImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] border bg-muted shadow-sm">
                <Image
                  src={`${API_URL}/${articleImage}`}
                  alt={articleTitle}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            )}

            {/* article title */}
            <div className="prose prose-rose max-w-none">
              <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {articleContent}
              </p>
            </div>

            {/* stats */}
            <div className="flex items-center pt-10 border-t">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      likeArticleHandler(user, _id);
                    }}
                    className="flex items-center gap-1.5 text-rose-500 ml-auto"
                  >
                    {isLiked ? (
                      <Heart className="size-5 fill-current" />
                    ) : (
                      <Heart className="size-5" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {articleLikes}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full">
                    <MessageCircle className="size-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {articleComments}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full">
                    <Eye className="size-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {articleViews}
                  </span>
                </div>
              </div>
            </div>

            {/* reviews */}
            <div className="my-8">
              <ArticleReviews id={_id} />
            </div>
          </article>
        </main>
      </div>
    </>
  );
}
