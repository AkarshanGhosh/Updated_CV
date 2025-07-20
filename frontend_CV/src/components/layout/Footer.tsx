import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/akarshan-ghosh/",
      icon: Linkedin,
    },
    {
      name: "GitHub", 
      url: "https://github.com/AkarshanGhosh",
      icon: Github,
    },
    {
      name: "Email",
      url: "mailto:akarshanghosh28@gmail.com",
      icon: Mail,
    },
  ];

  return (
    <footer className="bg-card border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">Akarshan Ghosh</h3>
            <p className="text-muted-foreground leading-relaxed">
              Passionate developer crafting innovative solutions with modern technologies. 
              Always learning, always building.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              <a href="/" className="text-muted-foreground hover:text-primary transition-smooth">
                Home
              </a>
              <a href="/about" className="text-muted-foreground hover:text-primary transition-smooth">
                About Me
              </a>
              <a href="/projects" className="text-muted-foreground hover:text-primary transition-smooth">
                Projects
              </a>
              <a href="/blog" className="text-muted-foreground hover:text-primary transition-smooth">
                Blog
              </a>
              <a href="/contact" className="text-muted-foreground hover:text-primary transition-smooth">
                Contact
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Connect With Me</h4>
            <div className="flex space-x-3">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="outline"
                  size="icon"
                  asChild
                  className="hover:bg-primary hover:border-primary hover:text-primary-foreground transition-smooth hover-scale"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                  >
                    <link.icon size={20} />
                  </a>
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              akarshanghosh28@gmail.com
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 animate-pulse-glow" /> by Akarshan Ghosh
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            © 2024 All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;