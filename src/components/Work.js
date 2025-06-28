import React from 'react';

const Work = () => {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution built with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
      image: "🛒",
      link: "#",
      github: "#"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      technologies: ["React", "Socket.io", "Express", "PostgreSQL", "Tailwind CSS"],
      image: "📋",
      link: "#",
      github: "#"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "A responsive weather application that displays current weather and forecasts using OpenWeatherMap API with beautiful visualizations.",
      technologies: ["React", "Chart.js", "OpenWeatherMap API", "CSS3"],
      image: "🌤️",
      link: "#",
      github: "#"
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "A modern, responsive portfolio website built with React and Tailwind CSS, featuring smooth animations and clean design.",
      technologies: ["React", "Tailwind CSS", "Framer Motion", "Vite"],
      image: "💼",
      link: "#",
      github: "#"
    },
    {
      id: 5,
      title: "Chat Application",
      description: "Real-time chat application with user authentication, message history, and file sharing capabilities.",
      technologies: ["React", "Socket.io", "Node.js", "MongoDB", "JWT"],
      image: "💬",
      link: "#",
      github: "#"
    },
    {
      id: 6,
      title: "Recipe Finder",
      description: "A recipe discovery app that allows users to search for recipes, save favorites, and create meal plans.",
      technologies: ["React", "Spoonacular API", "LocalStorage", "CSS Grid"],
      image: "🍳",
      link: "#",
      github: "#"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">My Work</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Here are some of the projects I've worked on. Each project represents different 
          challenges and learning opportunities in my journey as a developer.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">{project.image}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{project.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
              
              {/* Technologies */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex space-x-3">
                <a
                  href={project.link}
                  className="flex-1 bg-primary-600 text-white text-center py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
                >
                  Live Demo
                </a>
                <a
                  href={project.github}
                  className="flex-1 bg-gray-600 text-white text-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Work Section */}
      <div className="mt-16 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
          Other Contributions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Open Source Contributions</h3>
            <p className="text-gray-600 mb-3">Active contributor to various open-source projects including React libraries and developer tools.</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">React</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Node.js</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">TypeScript</span>
            </div>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Technical Writing</h3>
            <p className="text-gray-600 mb-3">Published articles on Medium and Dev.to about React best practices and modern web development.</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">React</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">JavaScript</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Web Dev</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-md p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Interested in Working Together?</h2>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
          I'm always open to discussing new opportunities and exciting projects. 
          Let's create something amazing together!
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="mailto:john.doe@email.com"
            className="bg-white text-primary-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
          >
            Get In Touch
          </a>
          <a
            href="/"
            className="border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-primary-600 transition-colors duration-200"
          >
            View CV
          </a>
        </div>
      </div>
    </div>
  );
};

export default Work; 