import React from 'react';

const infoText = `I'm currently studying Business Administration at ECUST in Shanghai, and I've got a solid background in Computer Science, DevOps and Automation. I've competed in multiple AI hackathons in Berlin, been an IT Consulting Intern at PwC and a Cloud Software Engineer at SAP SE. I've also been a Microsoft Student Learn Ambassador and a Data Analyst at 1&1, where I gained experience in all kinds of technologies and industries.
\nI'm skilled in Java, Python, Bash, Go and Groovy, and I'm fluent in English and German, with good knowledge in French.`

export default function Info() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center gap-8">
        <div className="text-xs md:text-sm font-normal text-neutral-700 whitespace-pre-line text-center leading-relaxed" style={{ maxWidth: '32rem' }}>
          {infoText}
        </div>
        <div className="text-xs md:text-sm text-neutral-500 mt-4">
          <a
            href="/cv.pdf"
            download
            className="underline hover:text-primary-600 transition-colors duration-200"
          >
            Download my CV (PDF)
          </a>
        </div>
      </div>
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H.
      </footer>
    </div>
  );
} 