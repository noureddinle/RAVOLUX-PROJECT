"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

const mockReviews = [
  {
    id: "1",
    author: "John Smith",
    rating: 5,
    date: "2024-01-10",
    content:
      "Excellent product! The build quality is outstanding and the light output is incredible. Perfect for our theater productions.",
  },
  {
    id: "2",
    author: "Sarah Johnson",
    rating: 4,
    date: "2024-01-05",
    content:
      "Great moving head light. Easy to set up and control. The only minor issue is the fan noise, but it's not too bad.",
  },
]

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState(mockReviews)
  const [newReview, setNewReview] = useState({ rating: 5, content: "" })

  const handleSubmitReview = () => {
    if (!newReview.content.trim()) return

    const review = {
      id: Date.now().toString(),
      author: "Anonymous User",
      rating: newReview.rating,
      date: new Date().toISOString().split("T")[0],
      content: newReview.content,
    }

    setReviews([review, ...reviews])
    setNewReview({ rating: 5, content: "" })
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Customer Reviews</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-600">({reviews.length} reviews)</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Write Review */}
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center space-x-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            i < newReview.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review-content">Your Review</Label>
                  <Textarea
                    id="review-content"
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    placeholder="Share your experience with this product..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleSubmitReview} className="w-full">
                  Submit Review
                </Button>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{review.author}</h4>
                        <p className="text-sm text-gray-600">{review.date}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
