import Link from "next/link";
import { Article } from "@/types";
import { formatDate, truncateText } from "@/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  isAdmin?: boolean;
}

export function ArticleCard({ article, isAdmin = false }: ArticleCardProps) {
  const linkHref = isAdmin
    ? `/admin/articles/${article.id}`
    : `/user/articles/${article.id}`;

  return (
    <Card className="flex flex-col h-full article-card border-t-4 border-t-primary hover:border-t-accent overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-all duration-300">
            <Link href={linkHref}>{article.title}</Link>
          </CardTitle>
          {article.category && (
            <Badge
              variant="secondary"
              className="whitespace-nowrap font-medium text-xs shadow-sm group-hover:bg-accent/10 transition-all duration-300"
            >
              {article.category.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        <p className="text-muted-foreground line-clamp-4 text-sm">
          {truncateText(article.content, 200)}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3 text-xs border-t border-border/30">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar size={12} />
          <span>{formatDate(article.createdAt)}</span>
        </div>
        <Link
          href={linkHref}
          className="text-primary hover:text-accent font-medium transition-colors flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
        >
          <span>Read more</span>
          <ArrowRight
            size={14}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300"
          />
        </Link>
      </CardFooter>
    </Card>
  );
}
