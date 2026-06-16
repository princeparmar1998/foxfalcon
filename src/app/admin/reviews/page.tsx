"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MoreVertical,
  Trash2,
  Star,
  Loader2,
  MessageSquare,
  Package,
  Users,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getReviews();
      setReviews(data);
    } catch (err) {
      showToast.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

    const toastId = showToast.loading("Deleting review...");
    try {
      await adminApi.deleteReview(id);
      showToast.dismiss(toastId);
      showToast.success("Review deleted successfully");
      fetchReviews();
    } catch (err) {
      showToast.dismiss(toastId);
      showToast.error("Failed to delete review", err);
    }
  };

  const filteredReviews = reviews.filter((review) =>
    review.comment.toLowerCase().includes(search.toLowerCase()) ||
    review.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
    review.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    review.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Statistics calculations
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";
  const positiveReviews = reviews.filter((r) => r.rating >= 4).length;
  const negativeReviews = reviews.filter((r) => r.rating <= 2).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Review Moderation</h1>
        <p className="text-muted-foreground">Manage customer feedback, ratings, and testimonials system-wide.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-border relative overflow-hidden bg-card/50">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Reviews</span>
              <div className="text-2xl font-black">{totalReviews}</div>
            </div>
            <MessageSquare className="w-5 h-5 text-primary shrink-0" />
          </div>
        </Card>

        <Card className="p-6 border-border relative overflow-hidden bg-card/50">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Average Rating</span>
              <div className="text-2xl font-black flex items-center gap-1.5">
                <span>{avgRating}</span>
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500 inline shrink-0" />
              </div>
            </div>
            <Star className="w-5 h-5 text-yellow-500 shrink-0" />
          </div>
        </Card>

        <Card className="p-6 border-border relative overflow-hidden bg-card/50">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Positive (4-5 ★)</span>
              <div className="text-2xl font-black text-green-500">{positiveReviews}</div>
            </div>
            <ThumbsUp className="w-5 h-5 text-green-500 shrink-0" />
          </div>
        </Card>

        <Card className="p-6 border-border relative overflow-hidden bg-card/50">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Negative (1-2 ★)</span>
              <div className="text-2xl font-black text-red-500">{negativeReviews}</div>
            </div>
            <ThumbsDown className="w-5 h-5 text-red-500 shrink-0" />
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border bg-card">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews by comments, products, customers..."
              className="pl-10 bg-muted/30 border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="font-bold">Fetching customer reviews...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <ShieldAlert className="w-16 h-16 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground font-medium">No reviews found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-bold">Product</TableHead>
                  <TableHead className="font-bold">Customer</TableHead>
                  <TableHead className="font-bold">Rating</TableHead>
                  <TableHead className="font-bold max-w-md">Comment</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => {
                  const reviewDate = new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });

                  return (
                    <TableRow key={review.id} className="border-border hover:bg-muted/50 transition-colors group">
                      <TableCell className="font-bold text-foreground">
                        <div className="max-w-[200px] truncate" title={review.product?.name || "Product"}>
                          {review.product?.name || "Deleted Product"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold">{review.user?.name || "Anonymous"}</div>
                        <div className="text-xs text-muted-foreground">{review.user?.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={cn(
                                "w-3.5 h-3.5",
                                star <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/40"
                              )} 
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-md">
                        <p className="line-clamp-2 leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{reviewDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem 
                              onClick={() => handleDeleteReview(review.id)}
                              className="font-bold text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete Review
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
