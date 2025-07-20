import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

// Define the type for a single blog post based on your backend response
interface BlogPostDetailType {
  _id: string;
  title: string;
  body: string; // Full content from your backend
  createdAt: string; // Date string from backend
  updatedAt: string; // Also available from backend, though not used in display
}

const BlogPostDetail = () => {
  const { id } = useParams<{ id: string }>(); // Get the blog post ID from the URL parameters
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to fetch a single blog post by its ID from the backend
  const fetchSingleBlogPost = async (): Promise<BlogPostDetailType> => {
    // Construct the API URL using the ID from useParams
    const response = await fetch(`https://cvbackend-production-f378.up.railway.app/api/blog/${id}`);
    
    // Check if the network response was successful
    if (!response.ok) {
      // Attempt to parse error message from response body, or use a generic one
      const errorData = await response.json().catch(() => ({ message: "Unknown error fetching blog post" }));
      throw new Error(errorData.message || "Failed to fetch blog post.");
    }
    
    const data = await response.json();
    
    // Validate the structure of the incoming data
    if (data && data.data && data.data.blogPost) {
      return data.data.blogPost; // Return the specific blogPost object
    } else {
      // If the expected data structure is not found, throw an error
      throw new Error("Blog post data not found in API response.");
    }
  };

  // Use useQuery hook to manage fetching, caching, and re-fetching of the blog post data
  const { data: blogPost, isLoading, isError, error } = useQuery<BlogPostDetailType, Error>({
    queryKey: ["blogPost", id], // Unique query key (includes ID so different posts have different cache entries)
    queryFn: fetchSingleBlogPost, // The function that performs the data fetching
    enabled: !!id, // Only run this query if 'id' is defined (prevents query from running on initial render if ID is missing)
    retry: 1, // Retry the fetch operation once on failure
  });

  // Helper function to format the date string into a readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Invalid date string for formatting:", dateString, e);
      return "Invalid Date";
    }
  };

  // Helper function to estimate the reading time of the blog post content
  const estimateReadTime = (body: string) => {
    if (!body) return "1 min read";
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = body.split(/\s+/).length; // Split by whitespace to count words
    const minutes = Math.ceil(wordCount / wordsPerMinute); // Round up to the nearest minute
    return `${minutes} min read`;
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading blog post...</p>
      </div>
    );
  }

  // --- Error State ---
  if (isError) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center text-center">
        <p className="text-lg text-destructive">Error: {error?.message || "Could not load blog post."}</p>
        <Button onClick={() => navigate('/blog')} className="mt-4 hover-scale">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Blog
        </Button>
      </div>
    );
  }

  // --- Not Found State (if blogPost is null/undefined after loading) ---
  if (!blogPost) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center text-center">
        <p className="text-lg text-muted-foreground">Blog post not found.</p>
        <Button onClick={() => navigate('/blog')} className="mt-4 hover-scale">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Blog
        </Button>
      </div>
    );
  }

  // --- Success State: Render Blog Post Details ---
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Button to navigate back to the main blog list */}
        <Button variant="outline" onClick={() => navigate('/blog')} className="mb-8 hover-scale">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Blog Posts
        </Button>

        {/* Main Card for Blog Post Content */}
        <Card className="glass-card p-8 space-y-6">
          {/* Blog Post Title */}
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">{blogPost.title}</h1>
          
          {/* Metadata: Date and Read Time */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(blogPost.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {estimateReadTime(blogPost.body)}
            </div>
          </div>

          {/* Blog Post Content */}
          {/* The 'prose' class from Tailwind Typography plugin helps style raw HTML/Markdown content.
              If 'body' contains Markdown, you'd typically use a Markdown rendering library (e.g., react-markdown).
              For now, we're splitting by newline and rendering as paragraphs. */}
          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
            {blogPost.body.split('\n').map((paragraph, index) => (
              // Use a key for list rendering
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlogPostDetail;