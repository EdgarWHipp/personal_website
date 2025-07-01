import React, { useEffect, useState } from 'react';

const infoText = `I'm currently studying Business Administration at ECUST in Shanghai, and I've got a solid background in Computer Science, DevOps and Automation. I've competed in multiple AI hackathons in Berlin, been an IT Consulting Intern at PwC and a Cloud Software Engineer at SAP SE. I've also been a Microsoft Student Learn Ambassador and a Data Analyst at 1&1, where I gained experience in all kinds of technologies and industries.`;

export default function Info() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center gap-8">
        <div className="text-xs md:text-sm font-normal text-neutral-700 whitespace-pre-line text-center leading-relaxed" style={{ maxWidth: '32rem' }}>
          {infoText}
        </div>
        <div className="text-xs md:text-sm text-neutral-500 mt-4">
          <a
            href="/e_hipp.pdf"
            download
            className="underline hover:text-primary-600 transition-colors duration-200"
          >
            Download my CV (PDF)
          </a>
        </div>
      </div>
      {/* Three-column footer, centered and width-matched to content, lifted up */}
      <footer className="absolute left-0 w-full flex justify-center select-none" style={{ bottom: '4.5rem' }}>
        <div className="w-full max-w-xl mx-auto flex flex-row justify-between items-end px-2 text-xs text-neutral-500">
          <div className="text-left leading-tight">
            Edgar H.<br />
            Student, Software Engineer<br />
            Shanghai, China <br />
            edgarhpp@protonmail.com<br />
          </div>
          <div className="text-right self-end" style={{ minWidth: '70px' }}>{time}</div>
        </div>
      </footer>
      {/* Normal single-line footer at the very bottom */}
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H.      Site by Coolify, Cloudflare
      </footer>
    </div>
  );
}

