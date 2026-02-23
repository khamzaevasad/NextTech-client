"use client";
import { use } from "react";
import { format, isValid } from "date-fns";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { GET_BOARD_ARTICLE } from "@/apollo/user/user-query";
import { Calendar, Eye, Heart, MessageCircle, User } from "lucide-react";
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
import { Card } from "@/components/ui/card";

interface ArticleDetailProps {
  params: Promise<{ _id: string }>;
}

export default function ArticleDetailPage({ params }: ArticleDetailProps) {
  const { _id } = use(params);
  const user = useReactiveVar(userVar);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const [LikeTargetArticle] = useMutation(LIKE_TARGET_ARTICLE);

  const {
    data: articleData,
    loading: articleLoading,
    refetch: articleRefetch,
  } = useQuery(GET_BOARD_ARTICLE, {
    variables: { input: _id },
    fetchPolicy: "cache-and-network",
    skip: !_id,
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const article: BoardArticle = articleData?.getBoardArticle ?? {};

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

  const date = new Date(createdAt);
  const formattedDate = isValid(date)
    ? format(date, "MMM dd, yyyy")
    : "Date unknown";

  const isLiked = article?.meLiked && article?.meLiked[0]?.myFavorite;

  const likeArticleHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await LikeTargetArticle({
        variables: { input: id },
      });
      await articleRefetch({ input: _id });
      toast.success("Success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("LikeArticleHandler error", err.message);
        toast.error(err.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  return (
    <>
      <LoadingBar loading={articleLoading} />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <Link
              href="/community"
              className="hover:text-foreground transition-colors"
            >
              Community
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{articleTitle}</span>
          </nav>

          <article className="space-y-8">
            {/* Header Section */}
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="font-medium">
                  {articleCategory}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formattedDate}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {articleTitle}
              </h1>

              {/* Author Card */}
              <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`${API_URL}/${memberData?.memberImage}`}
                        alt={memberData?.memberNick}
                      />
                      <AvatarFallback className="bg-pink-500 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href={
                          memberData?._id === user._id
                            ? "/profile/me"
                            : `/profile/${memberData?._id}`
                        }
                        className="font-semibold text-foreground"
                      >
                        {memberData?.memberNick}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {memberData?.memberArticles} articles ·{" "}
                        {memberData?.memberFollowers} followers
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </header>

            {/* Featured Image */}
            {articleImage && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted border">
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

            {/* Content */}
            <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
              <div
                className="text-foreground/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: articleContent }}
              />
            </div>

            {/* Stats Bar */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => likeArticleHandler(user, _id)}
                    className="flex items-center gap-2 group"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors cursor-pointer ${
                        isLiked
                          ? "fill-pink-500 text-pink-500"
                          : "text-muted-foreground group-hover:text-pink-500"
                      }`}
                    />
                    <span className="text-sm font-medium text-muted-foreground">
                      {articleLikes}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {articleComments}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-5 w-5" />
                    <span className="text-sm font-medium">{articleViews}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Comments Section */}
            <div className="pt-8">
              <ArticleReviews id={_id} />
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
