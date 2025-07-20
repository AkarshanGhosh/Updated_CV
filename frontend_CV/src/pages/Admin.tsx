import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Edit, Save, X, Loader2, Github, ExternalLink } from "lucide-react"; // Added Edit, Save, X
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Type Definitions (matching your backend models) ---
interface Project {
  _id: string;
  name: string;
  description: string;
  images: string[]; // URLs
  githubLink: string;
  demoLink?: string; // Optional
  createdAt: string;
  updatedAt: string;
}

interface BlogPost {
  _id: string;
  title: string;
  body: string; // Full content
  createdAt: string;
  updatedAt: string;
}

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // --- New Project States ---
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectGithubLink, setNewProjectGithubLink] = useState("");
  const [newProjectDemoLink, setNewProjectDemoLink] = useState("");
  const [newProjectImageUrls, setNewProjectImageUrls] = useState<string>(""); // For comma-separated URLs

  // --- Editing Project States ---
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [currentProjectEditData, setCurrentProjectEditData] = useState<Project | null>(null);
  const [editProjectImageUrls, setEditProjectImageUrls] = useState<string>("");

  // --- New Blog Post States ---
  const [newBlogPostTitle, setNewBlogPostTitle] = useState("");
  const [newBlogPostContent, setNewBlogPostContent] = useState("");

  // --- Editing Blog Post States ---
  const [editingBlogPostId, setEditingBlogPostId] = useState<string | null>(null);
  const [currentBlogPostEditData, setCurrentBlogPostEditData] = useState<BlogPost | null>(null);

  // --- API Functions ---

  // Projects API Calls
  const fetchProjects = async (): Promise<Project[]> => {
    const response = await fetch("https://cvbackend-production-f378.up.railway.app/api/projects");
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    const data = await response.json();
    return data.data.projects || [];
  };

  const createProjectMutation = useMutation({
    mutationFn: async (newProjectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch("https://cvbackend-production-f378.up.railway.app/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProjectData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Project added successfully!", variant: "success" });
      queryClient.invalidateQueries(["projects"]);
      setNewProjectName("");
      setNewProjectDescription("");
      setNewProjectGithubLink("");
      setNewProjectDemoLink("");
      setNewProjectImageUrls("");
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: Partial<Omit<Project, '_id' | 'createdAt' | 'updatedAt'>> }) => {
      const response = await fetch(`https://cvbackend-production-f378.up.railway.app/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Project updated successfully!", variant: "success" });
      queryClient.invalidateQueries(["projects"]); // Refetch projects list
      setEditingProjectId(null); // Exit editing mode
      setCurrentProjectEditData(null);
      setEditProjectImageUrls("");
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`https://cvbackend-production-f378.up.railway.app/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete project");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Project deleted successfully!", variant: "success" });
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Blog Posts API Calls
  const fetchBlogPosts = async (): Promise<BlogPost[]> => {
    const response = await fetch("https://cvbackend-production-f378.up.railway.app/api/blog");
    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }
    const data = await response.json();
    return data.data.blogPosts || [];
  };

  const createBlogPostMutation = useMutation({
    mutationFn: async (newPost: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch("https://cvbackend-production-f378.up.railway.app/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog post");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Blog post added successfully!", variant: "success" });
      queryClient.invalidateQueries(["blogPosts"]);
      setNewBlogPostTitle("");
      setNewBlogPostContent("");
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateBlogPostMutation = useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: Partial<Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt'>> }) => {
      const response = await fetch(`https://cvbackend-production-f378.up.railway.app/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update blog post");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Blog post updated successfully!", variant: "success" });
      queryClient.invalidateQueries(["blogPosts"]);
      setEditingBlogPostId(null); // Exit editing mode
      setCurrentBlogPostEditData(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteBlogPostMutation = useMutation({
    mutationFn: async (blogPostId: string) => {
      const response = await fetch(`https://cvbackend-production-f378.up.railway.app/api/blog/${blogPostId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete blog post");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Blog post deleted successfully!", variant: "success" });
      queryClient.invalidateQueries(["blogPosts"]);
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // --- useQuery Hooks for fetching data ---
  const { data: projects, isLoading: isLoadingProjects, isError: isErrorProjects, error: projectsError } = useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { data: blogPosts, isLoading: isLoadingBlogPosts, isError: isErrorBlogPosts, error: blogPostsError } = useQuery<BlogPost[], Error>({
    queryKey: ["blogPosts"],
    queryFn: fetchBlogPosts,
  });

  // --- Handlers ---

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrlsArray = newProjectImageUrls.split(',').map(url => url.trim()).filter(url => url !== '');

    if (!newProjectName || !newProjectDescription || !newProjectGithubLink || imageUrlsArray.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Name, Description, GitHub Link) and provide at least one image URL.",
        variant: "destructive",
      });
      return;
    }

    const projectData = {
      name: newProjectName,
      description: newProjectDescription,
      images: imageUrlsArray,
      githubLink: newProjectGithubLink,
      demoLink: newProjectDemoLink,
    };

    createProjectMutation.mutate(projectData);
  };

  const handleEditProjectClick = (project: Project) => {
    setEditingProjectId(project._id);
    setCurrentProjectEditData(project);
    setEditProjectImageUrls(project.images.join(', ')); // Convert array to comma-separated string for input
  };

  const handleCancelEditProject = () => {
    setEditingProjectId(null);
    setCurrentProjectEditData(null);
    setEditProjectImageUrls("");
  };

  const handleUpdateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProjectEditData) return;

    const imageUrlsArray = editProjectImageUrls.split(',').map(url => url.trim()).filter(url => url !== '');

    if (!currentProjectEditData.name || !currentProjectEditData.description || !currentProjectEditData.githubLink || imageUrlsArray.length === 0) {
      toast({
        title: "Error",
        description: "Please ensure all required fields are filled and at least one image URL is provided for update.",
        variant: "destructive",
      });
      return;
    }

    const updatedData = {
      name: currentProjectEditData.name,
      description: currentProjectEditData.description,
      images: imageUrlsArray, // Send updated array of URLs
      githubLink: currentProjectEditData.githubLink,
      demoLink: currentProjectEditData.demoLink,
    };

    updateProjectMutation.mutate({ id: currentProjectEditData._id, updatedData });
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project? This will also delete associated images from Cloudinary.")) {
      deleteProjectMutation.mutate(id);
    }
  };

  const handleAddBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogPostTitle || !newBlogPostContent) {
      toast({
        title: "Error",
        description: "Please fill in title and content for the blog post.",
        variant: "destructive",
      });
      return;
    }
    createBlogPostMutation.mutate({ title: newBlogPostTitle, body: newBlogPostContent });
  };

  const handleEditBlogPostClick = (post: BlogPost) => {
    setEditingBlogPostId(post._id);
    setCurrentBlogPostEditData(post);
  };

  const handleCancelEditBlogPost = () => {
    setEditingBlogPostId(null);
    setCurrentBlogPostEditData(null);
  };

  const handleUpdateBlogPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBlogPostEditData) return;

    if (!currentBlogPostEditData.title || !currentBlogPostEditData.body) {
      toast({
        title: "Error",
        description: "Please fill in title and content for the blog post update.",
        variant: "destructive",
      });
      return;
    }

    const updatedData = {
      title: currentBlogPostEditData.title,
      body: currentBlogPostEditData.body,
    };

    updateBlogPostMutation.mutate({ id: currentBlogPostEditData._id, updatedData });
  };

  const handleDeleteBlogPost = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteBlogPostMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your projects and blog posts</p>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          {/* Project Management */}
          <TabsContent value="projects" className="space-y-6">
            {/* Add New Project */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
                <CardDescription>Add a new project by providing details and image URLs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div>
                    <Label htmlFor="projectName">Project Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="projectName"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectDescription">Description <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="projectDescription"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="Enter project description"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectImageUrls">Project Image URLs <span className="text-red-500">*</span></Label>
                    <Input
                      id="projectImageUrls"
                      type="text"
                      value={newProjectImageUrls}
                      onChange={(e) => setNewProjectImageUrls(e.target.value)}
                      placeholder="Paste image URLs, separated by commas (e.g., url1.jpg, url2.png)"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">Provide one or more image URLs, separated by commas.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="githubLink">GitHub Link <span className="text-red-500">*</span></Label>
                      <Input
                        id="githubLink"
                        value={newProjectGithubLink}
                        onChange={(e) => setNewProjectGithubLink(e.target.value)}
                        placeholder="https://github.com/..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="demoLink">Demo Link</Label>
                      <Input
                        id="demoLink"
                        value={newProjectDemoLink}
                        onChange={(e) => setNewProjectDemoLink(e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={createProjectMutation.isLoading}>
                    {createProjectMutation.isLoading ? (
                      <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Project... </>
                    ) : (
                      <> <Plus className="w-4 h-4 mr-2" /> Add Project </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Projects</CardTitle>
                <CardDescription>Manage your uploaded projects</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingProjects ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Loading projects...</p>
                  </div>
                ) : isErrorProjects ? (
                  <div className="text-center text-destructive py-8">
                    Error loading projects: {projectsError?.message}
                  </div>
                ) : projects && projects.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No projects found. Add one above!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects?.map((project) => (
                      <div key={project._id} className="border rounded-lg p-4 space-y-3">
                        {editingProjectId === project._id ? (
                          // --- Edit Project Form ---
                          <form onSubmit={handleUpdateProjectSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor={`editName-${project._id}`}>Project Name <span className="text-red-500">*</span></Label>
                              <Input
                                id={`editName-${project._id}`}
                                value={currentProjectEditData?.name || ""}
                                onChange={(e) => setCurrentProjectEditData({ ...currentProjectEditData!, name: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor={`editDescription-${project._id}`}>Description <span className="text-red-500">*</span></Label>
                              <Textarea
                                id={`editDescription-${project._id}`}
                                value={currentProjectEditData?.description || ""}
                                onChange={(e) => setCurrentProjectEditData({ ...currentProjectEditData!, description: e.target.value })}
                                rows={3}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor={`editImageUrls-${project._id}`}>Project Image URLs <span className="text-red-500">*</span></Label>
                              <Input
                                id={`editImageUrls-${project._id}`}
                                type="text"
                                value={editProjectImageUrls}
                                onChange={(e) => setEditProjectImageUrls(e.target.value)}
                                placeholder="Paste image URLs, separated by commas"
                                required
                              />
                              <p className="text-xs text-muted-foreground mt-1">Provide one or more image URLs, separated by commas.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`editGithubLink-${project._id}`}>GitHub Link <span className="text-red-500">*</span></Label>
                                <Input
                                  id={`editGithubLink-${project._id}`}
                                  value={currentProjectEditData?.githubLink || ""}
                                  onChange={(e) => setCurrentProjectEditData({ ...currentProjectEditData!, githubLink: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor={`editDemoLink-${project._id}`}>Demo Link</Label>
                                <Input
                                  id={`editDemoLink-${project._id}`}
                                  value={currentProjectEditData?.demoLink || ""}
                                  onChange={(e) => setCurrentProjectEditData({ ...currentProjectEditData!, demoLink: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button type="submit" className="flex-1" disabled={updateProjectMutation.isLoading}>
                                {updateProjectMutation.isLoading ? (
                                  <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving... </>
                                ) : (
                                  <> <Save className="w-4 h-4 mr-2" /> Save Changes </>
                                )}
                              </Button>
                              <Button type="button" variant="outline" className="flex-1" onClick={handleCancelEditProject}>
                                <X className="w-4 h-4 mr-2" /> Cancel
                              </Button>
                            </div>
                          </form>
                        ) : (
                          // --- Display Project Details ---
                          <>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{project.name}</h3>
                                <p className="text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
                                <div className="flex gap-2">
                                  {project.githubLink && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                                        <Github className="w-3 h-3 mr-1" />
                                        GitHub
                                      </a>
                                    </Button>
                                  )}
                                  {project.demoLink && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        Demo
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleEditProjectClick(project)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteProject(project._id)}
                                  disabled={deleteProjectMutation.isLoading}
                                >
                                  {deleteProjectMutation.isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            {project.images && project.images.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {project.images.map((imgUrl, idx) => (
                                        <img
                                            key={idx}
                                            src={imgUrl}
                                            alt={`Project image ${idx + 1}`}
                                            className="w-20 h-20 object-cover rounded-md border border-border"
                                            onError={(e) => { e.currentTarget.src = "https://placehold.co/80x80/e0e0e0/333333?text=Img"; }}
                                        />
                                    ))}
                                </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Management */}
          <TabsContent value="blog" className="space-y-6">
            {/* Add New Blog Post */}
            <Card>
              <CardHeader>
                <CardTitle>Write New Blog Post</CardTitle>
                <CardDescription>Create a new blog post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddBlogPost} className="space-y-4">
                  <div>
                    <Label htmlFor="blogTitle">Blog Title <span className="text-red-500">*</span></Label>
                    <Input
                      id="blogTitle"
                      value={newBlogPostTitle}
                      onChange={(e) => setNewBlogPostTitle(e.target.value)}
                      placeholder="Enter blog title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="blogContent">Content <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="blogContent"
                      value={newBlogPostContent}
                      onChange={(e) => setNewBlogPostContent(e.target.value)}
                      placeholder="Write your blog content here..."
                      rows={8}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createBlogPostMutation.isLoading}>
                    {createBlogPostMutation.isLoading ? (
                      <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing... </>
                    ) : (
                      <> <Plus className="w-4 h-4 mr-2" /> Publish Blog Post </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Blog Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Blog Posts</CardTitle>
                <CardDescription>Manage your published blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingBlogPosts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Loading blog posts...</p>
                  </div>
                ) : isErrorBlogPosts ? (
                  <div className="text-center text-destructive py-8">
                    Error loading blog posts: {blogPostsError?.message}
                  </div>
                ) : blogPosts && blogPosts.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No blog posts found. Add one above!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogPosts?.map((post) => (
                      <div key={post._id} className="border rounded-lg p-4">
                        {editingBlogPostId === post._id ? (
                          // --- Edit Blog Post Form ---
                          <form onSubmit={handleUpdateBlogPostSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor={`editBlogTitle-${post._id}`}>Blog Title <span className="text-red-500">*</span></Label>
                              <Input
                                id={`editBlogTitle-${post._id}`}
                                value={currentBlogPostEditData?.title || ""}
                                onChange={(e) => setCurrentBlogPostEditData({ ...currentBlogPostEditData!, title: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor={`editBlogContent-${post._id}`}>Content <span className="text-red-500">*</span></Label>
                              <Textarea
                                id={`editBlogContent-${post._id}`}
                                value={currentBlogPostEditData?.body || ""}
                                onChange={(e) => setCurrentBlogPostEditData({ ...currentBlogPostEditData!, body: e.target.value })}
                                rows={8}
                                required
                              />
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button type="submit" className="flex-1" disabled={updateBlogPostMutation.isLoading}>
                                {updateBlogPostMutation.isLoading ? (
                                  <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving... </>
                                ) : (
                                  <> <Save className="w-4 h-4 mr-2" /> Save Changes </>
                                )}
                              </Button>
                              <Button type="button" variant="outline" className="flex-1" onClick={handleCancelEditBlogPost}>
                                <X className="w-4 h-4 mr-2" /> Cancel
                              </Button>
                            </div>
                          </form>
                        ) : (
                          // --- Display Blog Post Details ---
                          <>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">Published on {new Date(post.createdAt).toLocaleDateString()}</p>
                                <p className="text-muted-foreground mb-2 line-clamp-3">{post.body}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleEditBlogPostClick(post)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteBlogPost(post._id)}
                                  disabled={deleteBlogPostMutation.isLoading}
                                >
                                  {deleteBlogPostMutation.isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;