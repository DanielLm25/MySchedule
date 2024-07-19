// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#010010] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center flex-col space-y-4">
        <p className="text-lg">© 2024 Your Company. All rights reserved.</p>
        <a
          href="https://www.freepik.com/free-ai-image/countdown-begins-antique-timer-sand-flowing-endlessly-generated-by-ai_41640167.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Image by vecstock on Freepik
        </a>
      </div>
    </footer>
  );
};

export default Footer;
