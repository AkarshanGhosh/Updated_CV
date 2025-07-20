import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Define the type for a single project based on your backend response
interface ProjectDetailType {
  _id: string;
  name: string;
  description: string;
  images: string[]; // Array of image URLs
  githubLink: string;
  demoLink?: string; // Optional
  createdAt: string;
  updatedAt: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>(); // Get the project ID from the URL
  const navigate = useNavigate();

  // Function to fetch a single project by ID
  const fetchSingleProject = async (): Promise<ProjectDetailType> => {
    const response = await fetch(`http://localhost:5000/api/projects/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error fetching project" }));
      throw new Error(errorData.message || "Failed to fetch project.");
    }
    const data = await response.json();
    if (data && data.data && data.data.project) { // Backend returns data.data.project for single fetch
      return data.data.project;
    } else {
      throw new Error("Project data not found in response.");
    }
  };

  const { data: project, isLoading, isError, error } = useQuery<ProjectDetailType, Error>({
    queryKey: ["project", id], // Query key includes the ID to refetch for different projects
    queryFn: fetchSingleProject,
    enabled: !!id, // Only run the query if ID is available
    retry: 1, // Retry once on failure
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading project details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center text-center">
        <p className="text-lg text-destructive">Error: {error?.message || "Could not load project details."}</p>
        <Button onClick={() => navigate('/projects')} className="mt-4 hover-scale">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center text-center">
        <p className="text-lg text-muted-foreground">Project not found.</p>
        <Button onClick={() => navigate('/projects')} className="mt-4 hover-scale">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button variant="outline" onClick={() => navigate('/projects')} className="mb-8 hover-scale">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Projects
        </Button>

        <Card className="glass-card p-8 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">{project.name}</h1>
          
          {/* Carousel for Project Images */}
          {project.images && project.images.length > 0 ? (
            <Carousel className="w-full mx-auto">
              <CarouselContent>
                {project.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="aspect-video flex items-center justify-center overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${project.name} image ${index + 1}`} 
                          className="w-full h-full object-cover rounded-lg" 
                          onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400/e0e0e0/333333?text=Image+Error"; }}
                        />
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            // Placeholder if no images are available
            <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-lg">
              <p className="text-muted-foreground">No images available for this project.</p>
            </div>
          )}

          {/* Project Description */}
          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
            {project.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>

          {/* GitHub and Live Demo Links */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Button asChild className="hover-scale">
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
            {project.demoLink && (
              <Button variant="outline" asChild className="hover-scale">
                <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetail;