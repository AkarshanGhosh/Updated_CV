import React, { useState } from "react";
import { Search, Github, ExternalLink, ArrowRight } from "lucide-react"; // Added ArrowRight
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
// Removed Badge as tags are not in backend
// Removed Select components as category is gone
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// Define the type for a project item from your backend
interface Project {
  _id: string;
  name: string;
  description: string;
  images: string[]; // Array of image URLs
  githubLink: string;
  demoLink?: string; // Optional
  createdAt: string;
}

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Function to fetch projects from your backend
  const fetchProjects = async (): Promise<Project[]> => {
    // Construct URL with search term
    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.append("search", searchTerm);
    }
    const url = `https://cvbackend-production-f378.up.railway.app/api/projects?${queryParams.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(errorData.message || "Failed to fetch projects from server.");
    }
    const data = await response.json();
    
    // Adjust based on your actual backend response structure for getAllProjects
    // Assuming data.data.projects is an array
    if (data && data.data && Array.isArray(data.data.projects)) {
      return data.data.projects;
    } else {
      console.warn("API response did not contain an array at data.data.projects:", data);
      return []; // Return empty array to prevent issues
    }
  };

  // Use useQuery to fetch data
  const { data: projects, isLoading, isError, error, refetch } = useQuery<Project[], Error>({
    queryKey: ["projects", searchTerm], // Query key includes searchTerm to refetch on search change
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Trigger refetch when search term changes
  React.useEffect(() => {
    const handler = setTimeout(() => {
      refetch();
    }, 300); // Debounce search to avoid too many requests
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, refetch]);


  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center text-center">
        <p className="text-lg text-destructive">Error: {error?.message || "Could not load projects."}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please ensure your backend server is running and the `/api/projects` endpoint is correctly implemented.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold fade-in">My Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my portfolio of innovative solutions and their development methods
          </p>
        </div>

        {/* Search Input (Category filter removed) */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {/* Removed Select for categories */}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects && projects.length === 0 ? (
            <div className="text-center py-20 col-span-full">
              <h3 className="text-2xl font-semibold mb-4">No projects found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or add new projects via the admin panel.
              </p>
            </div>
          ) : (
            projects?.map((project) => (
              <Card 
                key={project._id} 
                className="group hover-scale transition-smooth overflow-hidden"
                // Removed onClick from Card to allow button to handle navigation
              >
                <div className="relative overflow-hidden">
                  <img
                    // Use the first image as thumbnail, or a placeholder if no images
                    src={project.images && project.images.length > 0 ? project.images[0] : "https://placehold.co/400x300/e0e0e0/333333?text=Project+Image"}
                    alt={project.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300/e0e0e0/333333?text=Image+Error"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-smooth">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Tags section removed as tags are not in backend response */}
                </CardContent>
                
                <CardFooter className="p-6 pt-0 flex flex-col gap-2"> {/* Changed to flex-col for better button stacking */}
                  <Button 
                    variant="outline" 
                    className="w-full group" 
                    onClick={() => navigate(`/projects/${project._id}`)} // Read More button
                  >
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <div className="flex gap-2 w-full mt-2"> {/* Container for GitHub and Demo buttons */}
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    {project.demoLink && (
                      <Button size="sm" asChild className="flex-1">
                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;