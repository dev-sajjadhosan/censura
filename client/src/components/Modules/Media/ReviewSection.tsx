"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, ThumbsUp, Trash2, Edit } from "lucide-react";
import { createReview, getMediaReviews } from "@/services/media.service";
import { toast } from "sonner";

export default function ReviewSection({ mediaId, initialReviews, user }: { mediaId: string, initialReviews: any[], user: any }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(10);
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to post a review");
      return;
    }
    setIsSubmitting(true);
    try {
      await createReview({
        mediaId,
        content,
        rating,
        hasSpoiler,
        tags: [], // Could add tag selection UI
        status: "PENDING", // Default on backend
        userId: user.id
      });
      toast.success("Review submitted for approval!");
      setContent("");
      // Ideally refresh reviews here or just show a message
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Review Form */}
      {user && (
        <section className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-medium">Your Rating</label>
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className={`transition-all ${rating >= i + 1 ? 'text-yellow-500 scale-110' : 'text-neutral-600 hover:text-neutral-400'}`}
                  >
                    <Star className={`w-6 h-6 ${rating >= i + 1 ? 'fill-yellow-500' : ''}`} />
                  </button>
                ))}
              </div>
              <span className="text-lg font-bold text-yellow-500">{rating}/10</span>
            </div>

            <Textarea
              placeholder="What did you think of this title? (Share your thoughts...)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] bg-black/40 border-neutral-800"
              required
            />

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={hasSpoiler}
                  onChange={(e) => setHasSpoiler(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors">Contains Spoilers</span>
              </label>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-8">
              {isSubmitting ? "Submitting..." : "Post Review"}
            </Button>
          </form>
        </section>
      )}

      {/* Reviews List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <h2 className="text-3xl font-bold">User Reviews</h2>
        </div>

        <div className="grid gap-6">
          {reviews?.map((review: any) => (
            <ReviewCard key={review.id} review={review} isOwn={user?.id === review.userId} />
          ))}
          {reviews?.length === 0 && (
            <div className="py-12 text-center bg-neutral-900/20 rounded-xl border border-dashed border-neutral-800">
              <p className="text-neutral-500">No approved reviews yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review, isOwn }: { review: any, isOwn: boolean }) {
  const [reveal, setReveal] = useState(false);

  return (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 space-y-4 hover:shadow-lg hover:shadow-primary/5 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20 text-xs">
            {review.user?.name?.[0] || "U"}
          </div>
          <div>
            <h4 className="font-bold">{review.user?.name || "Anonymous"}</h4>
            <p className="text-xs text-neutral-500">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full flex items-center gap-1 font-bold text-sm">
            <Star className="w-4 h-4 fill-yellow-500" />
            {review.rating}/10
          </div>
          {isOwn && review.status === 'UNPUBLISHED' && (
             <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="w-8 h-8 text-neutral-400 hover:text-white">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-neutral-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
             </div>
          )}
        </div>
      </div>
      
      <div className="relative">
        {review.hasSpoiler && !reveal && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-lg cursor-pointer" onClick={() => setReveal(true)}>
             <span className="text-red-500 font-bold uppercase tracking-widest text-xs">Spoiler Alert</span>
             <span className="text-[10px] text-neutral-400 mt-1">Click to reveal</span>
          </div>
        )}
        <p className={`text-neutral-300 leading-relaxed ${review.hasSpoiler && !reveal ? 'select-none blur-sm' : ''}`}>
          {review.content}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {review.tags?.map((tag: string) => (
          <span key={tag} className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-6 pt-2 border-t border-neutral-800/50">
        <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary transition-colors">
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
}
