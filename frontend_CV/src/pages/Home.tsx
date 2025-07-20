import { ArrowRight, Download, Code, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Import the resume PDF file
import resumePdf from "@/resume/resume.pdf"; 

const Home = () => {
  const navigate = useNavigate();

  // Your actual LinkedIn profile URL
  const linkedInUrl = "https://www.linkedin.com/in/akarshan-ghosh/"; 

  const skills = [
    { icon: Code, name: "Web Development", description: "Modern web applications with React, Node.js" },
    { icon: Zap, name: "IoT Projects", description: "Internet of Things solutions and embedded systems" },
    { icon: Globe, name: "AI/ML", description: "Machine learning models and AI applications" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="space-y-4 fade-in">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Hi, I'm{" "}
                  <span className="text-primary glow">Akarshan</span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground">
                  Passionate Developer & Tech Enthusiast
                </p>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  I create innovative solutions through web development, IoT projects, 
                  and AI/ML applications. Always learning, always building something amazing.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="group hover-scale" onClick={() => navigate('/projects')}>
                  View My Work
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                {/* Download CV Button - Made Functional */}
                <Button variant="outline" size="lg" className="hover-scale" asChild>
                  <a href={resumePdf} download="Akarshan_Ghosh_CV.pdf" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 w-4 h-4" />
                    Download CV
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full hero-gradient opacity-20 blur-3xl absolute -top-10 -left-10"></div>
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-2xl glass-card p-4 overflow-hidden float">
                  <img 
                    src="/lovable-uploads/3d288141-2232-4517-8c8f-8a3baabe3bc7.png" 
                    alt="Akarshan Ghosh"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">What I Do</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              I specialize in creating innovative solutions across multiple domains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <Card key={skill.name} className="group hover-scale transition-smooth">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-smooth">
                    <skill.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold">{skill.name}</h3>
                  <p className="text-muted-foreground">{skill.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="glass-card border-primary/20">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">Ready to Work Together?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                I'm always excited about new opportunities and interesting projects. 
                Let's discuss how we can bring your ideas to life.
              </p>
              {/* Get In Touch Button - Now redirects to LinkedIn */}
              <Button size="lg" className="hover-scale" asChild>
                <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
                  Get In Touch
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;