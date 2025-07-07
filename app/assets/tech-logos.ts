import { TechItem } from "../components/TechCarousel";

// Tech stack configuration
// To add new tech logos:
// 1. Add your PNG file to the /public/tech-logos/ folder
// 2. Add a new TechItem object to this array
// 3. The carousel will automatically include it

export const techStack: TechItem[] = [
  {
    name: "React",
    logo: "/tech-logos/react.png",
    alt: "React Logo"
  },
  {
    name: "Next.js",
    logo: "/tech-logos/nextjs.png",
    alt: "Next.js Logo"
  },
  {
    name: "TypeScript",
    logo: "/tech-logos/typescript.png",
    alt: "TypeScript Logo"
  },
  {
    name: "Node.js",
    logo: "/tech-logos/nodejs.png",
    alt: "Node.js Logo"
  },
  {
    name: "Docker",
    logo: "/tech-logos/docker.png",
    alt: "Docker Logo"
  },
  {
    name: "AWS",
    logo: "/tech-logos/aws.png",
    alt: "AWS Logo"
  },
  {
    name: "Redux",
    logo: "/tech-logos/redux.png",
    alt: "Redux Logo"
  },
  {
    name: "MongoDB",
    logo: "/tech-logos/mongodb.png",
    alt: "MongoDB Logo"
  },
  {
    name: "Angular",
    logo: "/tech-logos/angular.png",
    alt: "Angular Logo"
  },
  {
    name: "Jenkins",
    logo: "/tech-logos/jenkins.png",
    alt: "Jenkins Logo"
  },
  {
    name: "Python",
    logo: "/tech-logos/python.png",
    alt: "Python Logo"
  },
  {
    name: "Claude",
    logo: "/tech-logos/claude.png",
    alt: "Claude AI Logo"
  }
];