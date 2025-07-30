import type { Ref, RefObject } from "react";
import type { Route } from "./+types/home";
import { useRef } from "react";
import { SiJavascript, SiTypescript, SiPython, SiReact, SiElectron, SiEndeavouros, SiCplusplus, SiNeovim, SiNodedotjs, SiFirebase, SiGit, SiGithub, SiOpencv, SiC, SiCloudflare, SiLinkedin } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}


export default function Home() {

  const aboutRef = useRef<HTMLHeadingElement>(null);
  const skillsRef = useRef<HTMLHeadingElement>(null);
  const projectsRef = useRef<HTMLHeadingElement>(null);

  const icons = [
    { icon: SiPython, name: "Python" },
    { icon: SiTypescript, name: "TypeScript" },
    { icon: SiJavascript, name: "JavaScript" },
    { icon: SiReact, name: "React" },
    { icon: SiElectron, name: "Electron" },
    { icon: SiEndeavouros, name: "EndeavourOS" },
    { icon: SiC, name: "C" },
    { icon: SiCplusplus, name: "C++" },
    { icon: SiNeovim, name: "Neovim" },
    { icon: SiNodedotjs, name: "Node.js" },
    { icon: SiFirebase, name: "Firebase" },
    { icon: SiGit, name: "Git" },
    { icon: SiGithub, name: "GitHub" },
    { icon: SiOpencv, name: "OpenCV" },
    { icon: VscVscode, name: "VS Code" },
    { icon: SiCloudflare, name: "Cloudflare" },
  ];

  const socialIcons = [
    { icon: SiGithub, name: "GitHub", link: "https://github.com/codebyjossaya" },
    { icon: SiLinkedin, name: "LinkedIn", link: "https://www.linkedin.com/in/jossayacamille" },
  ]

  const handleScroll = (e: any, element: RefObject<HTMLHeadingElement | null>) => {
    e.preventDefault(); // Prevent default anchor behavior
    element?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const projects = [
    {
      name: "VaultTune",
      background: "linear-gradient(135deg, rgba(54, 0, 248, 0.3), rgba(0, 255, 64, 0.3))",
      description: "VaultTune is your self-hosted music library, built with React, Electron, and Firebase. It allows you to listen to your music hosted on your computer anywhere, anytime, with a sleek interface and powerful features. ",
      images: [
        "/vaulttune/vaulttune-1.png",
        "/vaulttune/vaulttune-2.png",
        "/vaulttune/vaulttune-3.png",
        "/vaulttune/vaulttune-4.png",
      ],
      links: [
        {
          href: "https://github.com/codebyjossaya/vt_server",
          text: "View on GitHub",
        },
        {
          href: "https://vaulttune.jcamille.dev",
          text: "Try VaultTune",

        }
      ]

    },
    {
      name: "Monocular 3D Human Pose Estimation for Gait Analysis",
      description: "Traditional methods of gait analysis require expensive equipment and/or are often limited to controlled environments. This project applies state-of-the-art human pose estimation models to estimate gait metrics from monocular video, enabling more accessible and flexible gait analysis. This project was awarded a grant in the amount of $1,200 by FAU's Office of Undergraduate Research and Inquiry and placed 3rd at the 2024 Palm Beach Regional Science and Engineering Fair.",
      background: "#1f1235",
      images: [
        "/hpe/hpe-1.jpg",
        "/hpe/hpe-2.jpg",
        "/hpe/hpe-3.png",
      ],
      links: [
        {
          href: "https://github.com/codebyjossaya/3DHPE_GaitAnalysis",
          text: "View on GitHub",
        },
        {
          href: "https://www.fau.edu/ouri/documents/fau-ouri-15-urs-sp-25-final-4-2.pdf",
          text: "Read the Abstract",
        },
      ]
    },
    {
      name: "ALSET Solar Cybersedan Software",
      description: "Florida's first four-door solar sedan of any high school or university team to compete in the Solar Car Challenge is powered by a comprehensive full-stack ecosystem enabling seamless integration and operation of various hardware components such as the Thunderstruck BMS, cameras, GPS module, and custom sound horn. Sponsored by the Cane Institute, the Solar Cybersedan won the Lockheed Martin Award for Excellence in Engineering at the 2024 Solar Car Challenge.",
      images: [
        '/alset/alset-1.jpg',
        '/alset/alset-2.png',
      ],
      background: "linear-gradient(135deg, rgba(255, 0, 0, 0.3), rgba(0, 0, 255, 0.3))",
      links: [
        {
          href: "https://www.fau.edu/research/research-daily/2024/shine-on-fa/",
          text: "Read more about the Solar Cybersedan",
        },
        {
          href: "https://github.com/YamanDevelopment/AEV-Software?tab=readme-ov-file",
          text: "View on GitHub",
        }
      ],
    }
  ]
  return (
    <div className="">
      
      <div className="h-[95vh] flex flex-col justify-end items-start
                    text-white bg-[url('/IMG_1796.jpg')] 
                      bg-no-repeat bg-cover bg-contain bg-[center_top_30%] ">
        <p
          className="px-4 py-2 rounded-xl shadow-lg m-3"
          style={{
            background: "radial-gradient(circle at 10% 80%, #4a0292, #000000)",
          }}
        >
         April 2025 - Research presentation at FAU Wilkes Honors College Symposium
        </p>
      </div>
      <header className="sticky top-0 flex bg-black/30 shadow z-50 p-4 gap-4">
        <div className="ml-auto flex gap-4">
          <a onClick={(event) => {
            aboutRef ? handleScroll(event, aboutRef) : null;
          }}>About</a>
          <a onClick={(event) => {
            skillsRef ? handleScroll(event, skillsRef) : null;
          }}>Skills</a>
          <a onClick={(event) => {
            projectsRef ? handleScroll(event, projectsRef) : null;
          }}>Projects</a>

        </div>
      </header>
      <div className="p-8">
        <h2 className="" ref={aboutRef}>About me</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center my-5 w-full max-w-5xl mx-auto overflow-x-auto">
          <div className="flex-1 text-center min-w-0">
            <h3 className="text-2xl font-bold">Hi, I'm Jossaya</h3>
              <p className="break-words">
                I'm a freshman at the University of Florida studying Computer Engineering with research interests in machine learning, computer vision, and robotics. I graduated from FAU High School in 2025, where I won a research grant for my work to apply human pose estimation models to estimate gait metrics.
              </p>
              <span className="flex justify-center items-center mt-4 gap-4">
                {socialIcons.map(({ icon: Icon, name, link }) => (
                  <a
                    key={name}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="inline-block text-2xl mx-2" />
                  </a>
                ))}
              </span>
          </div>
          <div className="flex-1 flex justify-center items-center min-w-0 max-w-xs">
            <img
              src="5581743_7783294_84_62569047.JPG"
              className="object-cover rounded-lg w-full max-h-full no-hover"
              alt="Jossaya"
              style={{ maxWidth: "100%", height: "100%" }}
            />
          </div>
        </div>
          
        <div>
          <h2 ref={skillsRef}>Technical Skills</h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {icons.map(({ icon: Icon, name }) => (
              <div key={name} className="flex flex-col items-center">
                <Icon className="text-4xl mb-2" />
                <span className="text-sm">{name}</span>
              </div>
            ))}

          </div>
        </div>
        <h2 ref={projectsRef}>Projects</h2>
        <div className="flex flex-col gap-0 m-0 overflow-x-auto w-full">
            {projects.map((project) => (
              <div key={project.name}className="text-white p-4 flex flex-col sm:flex-row w-full gap-4 items-center " style={{ background: project.background }}>
                <div className="max-w-1/2 flex text-start flex-col lg:p-30 sm:p-0">
                  <h2>{project.name}</h2>
                  <p className="word-break-all">
                    {project.description}
                  </p>
                  <div className="flex gap-2">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-4 ml-auto lg:mr-30 w-full">
                  {project.images.map((image, index) => {
                  // If odd number of images and this is the last image, make it span two columns
                  const isLast =
                    index === project.images.length - 1 &&
                    project.images.length % 2 !== 0;
                  return (
                    <div
                    key={index}
                    className={`overflow-hidden rounded-lg shadow-lg ${isLast ? "lg:col-span-2" : ""}`}
                    style={isLast ? { width: "100%" } : {}}
                    >
                    <a href={image} target="_blank" rel="noopener noreferrer">
                      <img
                      src={image}
                      alt={`${project.name} screenshot ${index + 1}`}
                      className="w-full h-30 object-cover"
                      style={{ width: "100%", height: "300px" }}
                      />
                    </a>
                    </div>
                  );
                  })}
                </div>
                </div>
            ))}
          </div>
        </div>
        <footer className="bg-black p-20 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-gray-400 text-start">
            <div>
              <p>Made with ❤️ by Jossaya Camille</p>
              <p>Built with React Router</p>
              <a className="footer-link" href="github.com/codebyjossaya/codebyjossaya/tree/main/newsite">GitHub Repo</a>
            </div>
            <div>
              <p>Frequent collaborators</p>
              <ul className="list-disc">
                <li>
                  <a className="footer-link" href="https://zachl.tech" target="_blank" rel="noopener noreferrer">
                    Zachary Lopez
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="https://str1ke.codes" target="_blank" rel="noopener noreferrer">
                    Thandi Menelas
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="http://apatel.co/" target="_blank" rel="noopener noreferrer">
                    Amarnath Patel
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="https://makaip.com" target="_blank" rel="noopener noreferrer">
                    Makai Pindell
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="https://alexcastronovo.com" target="_blank" rel="noopener noreferrer">
                    Alex Castronovo
                  </a>
                </li>
              </ul>
            </div>
            <div>
                <p className="font-semibold mb-2">Contact</p>
                <ul className="list-none p-0 m-0">
                <li>
                  <a className="footer-link" href="mailto:jossayacamille@gmail.com">jossayacamille@gmail.com</a>
                </li>
                <li className="flex gap-2 mt-2">
                  {socialIcons.map(({ icon: Icon, name, link }) => (
                  <a
                    key={name}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                  >
                    <Icon className="inline-block text-2xl" />
                  </a>
                  ))}
                </li>
                </ul>
            </div>
          </div>
        </footer>
      </div>
  );
}
