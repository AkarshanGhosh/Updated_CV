import React from "react";
import { Calendar, Clock, ArrowRight, ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Define the type for a blog post based on your backend response
interface BlogPost {
  _id: string; // MongoDB's default ID
  title: string;
  body: string; // This is the full content from your backend
  createdAt: string; // Date string from backend
  // imageUrl, readTime, tags are NOT coming from backend, so they are removed/handled as placeholders
}

const Blog = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to fetch blog posts from your backend
  const fetchBlogPosts = async (): Promise<BlogPost[]> => {
    const response = await fetch("http://localhost:5000/api/blog"); // Your backend API endpoint
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(errorData.message || "Failed to fetch blog posts from server.");
    }
    const data = await response.json();

    if (data && data.data && Array.isArray(data.data.blogPosts)) {
      return data.data.blogPosts;
    } else {
      console.warn("API response did not contain an array at data.data.blogPosts:", data);
      return [];
    }
  };

  // Use useQuery to fetch data
  const { data: posts, isLoading, isError, error } = useQuery<BlogPost[], Error>({
    queryKey: ["blogPosts"],
    queryFn: fetchBlogPosts,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 1,
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Invalid date string:", dateString, e);
      return "Invalid Date";
    }
  };

  // Helper function to generate an excerpt from the full body
  const generateExcerpt = (body: string, maxLength: number = 150) => {
    if (!body) return "";
    const cleanBody = body.replace(/#+\s/g, '').replace(/\n/g, ' ').trim(); // Remove markdown headers and newlines for excerpt
    if (cleanBody.length <= maxLength) return cleanBody;
    return cleanBody.substring(0, cleanBody.lastIndexOf(" ", maxLength)) + "...";
  };

  // Helper function to estimate read time (very basic)
  const estimateReadTime = (body: string) => {
    if (!body) return "1 min read";
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = body.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleFeatureClick = (feature: string) => {
    toast({
      title: `${feature} Feature`,
      description: "This feature will be updated soon!",
      variant: "default",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading blog posts...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center text-center">
        <p className="text-lg text-destructive">Error: {error?.message || "Could not load blog posts."}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please ensure your backend server is running and the `/api/blog` endpoint is correctly implemented.
        </p>
      </div>
    );
  }

  const featuredPost = posts && posts.length > 0 ? posts[0] : null;
  const otherPosts = posts ? posts.slice(1) : [];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold fade-in">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore a track record of my projects, deep dives into development methods, and insights into my tech journey.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Card className="mb-12 overflow-hidden hover-scale transition-smooth">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={"https://placehold.co/400x300/e0e0e0/333333?text=Featured+Blog"} // Placeholder image
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(featuredPost.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {estimateReadTime(featuredPost.body)}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl lg:text-3xl font-bold">{featuredPost.title}</h2>
                  <p className="text-muted-foreground">{generateExcerpt(featuredPost.body)}</p>
                  
                  {/* Tags section removed as tags are not in backend response */}
                  
                  <Button className="w-fit group" onClick={() => navigate(`/blog/${featuredPost._id}`)}>
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  {/* Like and Comment Buttons for Featured Post */}
                  <div className="flex gap-4 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleFeatureClick("Like")}>
                      <ThumbsUp className="w-4 h-4 mr-1" /> Like
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleFeatureClick("Comment")}>
                      <MessageCircle className="w-4 h-4 mr-1" /> Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts && posts.length === 0 ? (
            <p className="text-lg text-muted-foreground col-span-full text-center">No blog posts found. Check back later!</p>
          ) : (
            otherPosts.map((post) => (
              <Card key={post._id} className="group hover-scale transition-smooth overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={"https://placehold.co/400x300/e0e0e0/333333?text=Blog+Post"} // Placeholder image
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {estimateReadTime(post.body)}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-smooth">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {generateExcerpt(post.body)}
                  </p>
                  
                  {/* Tags section removed as tags are not in backend response */}
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <Button variant="outline" className="w-full group" onClick={() => navigate(`/blog/${post._id}`)}>
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  {/* Like and Comment Buttons for Grid Posts */}
                  <div className="flex gap-4 mt-4 w-full">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleFeatureClick("Like")}>
                      <ThumbsUp className="w-4 h-4 mr-1" /> Like
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleFeatureClick("Comment")}>
                      <MessageCircle className="w-4 h-4 mr-1" /> Comment
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* CTA Section */}
        <Card className="mt-16 glass-card border-primary/20">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Subscribe to my newsletter to get the latest articles about web development, 
              IoT, and technology trends delivered to your inbox.
            </p>
            <Button size="lg" className="hover-scale">
              Subscribe to Newsletter
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blog;