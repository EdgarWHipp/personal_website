import React from 'react';

const CV = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">John Doe</h1>
          <p className="text-xl text-gray-600 mb-2">Software Developer</p>
          <p className="text-gray-500 mb-4">Passionate about creating innovative solutions</p>
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <span>📧 john.doe@email.com</span>
            <span>📱 +1 (555) 123-4567</span>
            <span>📍 San Francisco, CA</span>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Experienced software developer with 5+ years of expertise in full-stack development, 
          specializing in React, Node.js, and cloud technologies. Proven track record of delivering 
          scalable solutions and leading development teams. Passionate about clean code, user experience, 
          and continuous learning.
        </p>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Technical Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Frontend</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js'].map((skill) => (
                <span key={skill} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Backend</h3>
            <div className="flex flex-wrap gap-2">
              {['Node.js', 'Python', 'Express.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker'].map((skill) => (
                <span key={skill} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Work Experience
        </h2>
        <div className="space-y-6">
          <div className="border-l-4 border-primary-500 pl-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-800">Senior Software Developer</h3>
              <span className="text-gray-500 text-sm">2021 - Present</span>
            </div>
            <p className="text-primary-600 font-medium mb-2">TechCorp Inc.</p>
            <ul className="text-gray-700 space-y-1">
              <li>• Led development of microservices architecture serving 1M+ users</li>
              <li>• Mentored junior developers and conducted code reviews</li>
              <li>• Implemented CI/CD pipelines reducing deployment time by 60%</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-primary-500 pl-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-800">Full Stack Developer</h3>
              <span className="text-gray-500 text-sm">2019 - 2021</span>
            </div>
            <p className="text-primary-600 font-medium mb-2">StartupXYZ</p>
            <ul className="text-gray-700 space-y-1">
              <li>• Built and maintained React-based web applications</li>
              <li>• Developed RESTful APIs using Node.js and Express</li>
              <li>• Collaborated with design team to implement responsive UI/UX</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Education
        </h2>
        <div className="border-l-4 border-primary-500 pl-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800">Bachelor of Science in Computer Science</h3>
            <span className="text-gray-500 text-sm">2015 - 2019</span>
          </div>
          <p className="text-primary-600 font-medium">University of Technology</p>
          <p className="text-gray-700">GPA: 3.8/4.0</p>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Certifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800">AWS Certified Developer</h3>
            <p className="text-gray-600 text-sm">Amazon Web Services</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800">MongoDB Certified Developer</h3>
            <p className="text-gray-600 text-sm">MongoDB University</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CV; 