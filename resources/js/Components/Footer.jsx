// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#010010] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <p className="text-lg md:text-xl">
            © 2024 NOTATIO. Todos os direitos reservados.
          </p>
          <div className="text-base md:text-lg">
            <p>
              Agradecemos por visitar nosso site. Para sugestões ou dúvidas, entre em contato:
            </p>
            <p>
              <a href="mailto:notatio@gmail.com" className="text-blue-400 hover:underline">notatio@gmail.com</a>
            </p>
          </div>
          <p className="text-base md:text-lg">
            Estamos sempre disponíveis para ajudar!
          </p>
          <a
            href="https://www.freepik.com/free-ai-image/countdown-begins-antique-timer-sand-flowing-endlessly-generated-by-ai_41640167.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Imagem por vecstock no Freepik
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
