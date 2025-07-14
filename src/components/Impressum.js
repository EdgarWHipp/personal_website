import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Impressum() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center min-h-screen py-12 relative main-dark-bg">
      {/* Back button top left */}
      <button
        onClick={() => navigate('/cv')}
        className="absolute left-8 top-8 text-xs md:text-sm px-6 py-2 border-b border-neutral-400 text-neutral-500 hover:text-orange-500 hover:border-orange-500 transition-colors bg-transparent focus:outline-none z-20"
        style={{ letterSpacing: "0.08em" }}
      >
        &#8592;
      </button>
      
      <div className="w-full max-w-2xl mx-auto px-8 mt-16">
        <h1 className="text-2xl font-bold text-neutral-800 mb-8 text-center">Impressum</h1>
        
        <div className="space-y-6 text-sm text-neutral-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">Angaben gemäß § 5 TMG</h2>
            <p>
              Edgar Hipp<br />
              E-Mail: edgarhpp@protonmail.com
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Edgar Hipp<br />
              E-Mail: edgarhpp@protonmail.com
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">Hosting & Technik</h2>
            <p>
              Diese Website wird gehostet mit:<br />
              - <strong>Coolify</strong> - Open-source & self-hostable Heroku / Netlify alternative<br />
              - <strong>Cloudflare</strong> - Content Delivery Network und Sicherheitsdienste<br />
              - Entwickelt mit React.js, Tailwind CSS<br />
              - Quellcode verfügbar auf GitHub
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">Haftungsausschluss</h2>
            
            <h3 className="font-medium text-neutral-800 mt-4 mb-2">Haftung für Inhalte</h3>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
              allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
              unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach 
              Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>

            <h3 className="font-medium text-neutral-800 mt-4 mb-2">Haftung für Links</h3>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
              Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>

            <h3 className="font-medium text-neutral-800 mt-4 mb-2">Urheberrecht</h3>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
              Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
              Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">Datenschutz</h2>
            <p>
              Diese Website verwendet keine Cookies und sammelt keine personenbezogenen Daten. Alle Inhalte werden 
              statisch bereitgestellt. Bei der Nutzung von Cloudflare können standardmäßige Server-Logs erstellt werden, 
              die IP-Adressen und Zugriffsdaten enthalten. Für weitere Informationen siehe die 
              <a href="https://www.cloudflare.com/privacypolicy/" className="text-orange-500 hover:text-orange-600 underline" target="_blank" rel="noopener noreferrer">
                Cloudflare Datenschutzerklärung
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr/" className="text-orange-500 hover:text-orange-600 underline" target="_blank" rel="noopener noreferrer">
                https://ec.europa.eu/consumers/odr/
              </a><br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section className="border-t border-neutral-200 pt-6 mt-8">
            <p className="text-xs text-neutral-500 text-center">
              Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}<br />
              © {new Date().getFullYear()} Edgar H. - Alle Rechte vorbehalten
            </p>
          </section>
        </div>
      </div>
      
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H. Site by Coolify, Cloudflare
      </footer>
    </div>
  );
} 