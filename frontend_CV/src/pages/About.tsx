import { Download, Code, Star, StarHalf, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import resumePdf from "@/resume/resume.pdf";

const About = () => {
  const experience = [
    {
      title: "Full Stack Developer Intern",
      company: "IIT Guwahati – TIDF",
      period: "September 2024 – Present",
      description:
        "Developed a MERN stack-based web application for Indian Railways to monitor emergency brake systems, showing real-time chain status, location, and temperature. Optimized backend APIs and managed secure IoT data integration.",
    },
    {
      title: "IoT & Web Development Intern",
      company: "IIT Guwahati – TIDF",
      period: "June 2024 – July 2024",
      description:
        "Built a flood monitoring system using NodeMCU ESP8266, sonar sensor, and GSM. Handled backend with Django and SQL, and built interactive frontend with JavaScript and Tailwind CSS.",
    },
  ];

  const skills = [
    { name: "Full Stack (MERN)", rating: 4 },
    { name: "Python", rating: 4.5 },
    { name: "Django", rating: 4 },
    { name: "AI/ML", rating: 3 },
    { name: "IoT", rating: 4 },
    { name: "Robotics", rating: 2 },
    { name: "VLSI", rating: 1.5 },
  ];

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <span className="inline-flex">
        {[...Array(full)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 text-yellow-500" />
        ))}
        {half && <StarHalf className="w-4 h-4 text-yellow-500" />}
        {[...Array(empty)].map((_, i) => (
          <StarOff key={`empty-${i}`} className="w-4 h-4 text-muted-foreground" />
        ))}
      </span>
    );
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold fade-in">About Me</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Electronics & Communication Engineer | Full Stack Developer | AI/ML Enthusiast
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Bio */}
          <div className="space-y-8">
            <Card className="glass-card">
              <CardContent className="p-8 space-y-6">
                <div className="w-32 h-32 mx-auto rounded-full hero-gradient flex items-center justify-center">
                  <Code className="w-16 h-16 text-white" />
                </div>

                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Akarshan Ghosh</h2>
                  <p className="text-primary font-semibold">
                    ECE Engineer | Developer | Research-Oriented Innovator
                  </p>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Electronics and Communication Engineering student at <strong>GIMT</strong>,
                      under <strong>Assam Science and Technology University (ASTU)</strong>.
                    </li>
                    <li>
                      Practical experience as an intern at <strong>IIT Guwahati – TIDF</strong>,
                      where I developed real-time monitoring systems and scalable full-stack web applications.
                    </li>
                    <li>
                      Skilled in MERN stack, Django, and embedded IoT development using NodeMCU, GSM, and sensors.
                    </li>
                    <li>
                      Developed AI/ML-based projects focused on image recognition using CNN models built from scratch.
                    </li>
                    <li>
                      Passionate about VLSI design, robotics, and embedded systems, and continuously expanding my skills
                      through academic learning and personal projects.
                    </li>
                    <li>
                      Curious and self-driven, always exploring new technologies, building prototypes,
                      and sharing my learning through technical blogs and open-source contributions.
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Button className="hover-scale" asChild>
                    <a
                      href={resumePdf}
                      download="Akarshan_Ghosh_Resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 w-4 h-4" />
                      Download Resume
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Skills then Experience */}
          <div className="space-y-8">
            {/* Skills Section First */}
            <Card>
              <CardContent className="p-8 space-y-4">
                <h3 className="text-2xl font-bold mb-4">Skills & Ratings</h3>
                <ul className="space-y-2">
                  {skills.map((skill, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{skill.name}</span>
                      {renderStars(skill.rating)}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Experience Section Below */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Experience</h3>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div
                      key={index}
                      className="relative pl-6 border-l-2 border-primary/20 last:border-l-0"
                    >
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg">{exp.title}</h4>
                        <p className="text-primary font-medium">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.period}</p>
                        <p className="text-muted-foreground">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
