import React, { useEffect } from 'react';
import "../../assets/css/navbar.css"

const Footer = () => {
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement({
      pageLanguage: 'fr', // Définissez ici la langue par défaut de votre page
      autoDisplay: false
    }, 'google_translate_element');
  };

  useEffect(() => {
    var addScript = document.createElement('script');
    addScript.setAttribute(
        'src',
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  return (
      <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
        <div id="google_translate_element"></div>
        <h5 className="mb-4 text-center text-sm font-medium text-gray-600 sm:!mb-0 md:text-lg">
          <p className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base">
            ©{1900 + new Date().getYear()} SAE 4.01.
          </p>
        </h5>
        <div>
          <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
            <li>
              <a
                  target="_blank"
                  href="mailto:rayane.khatim@etu.u-pec.fr"
                  className="text-base font-medium text-gray-600 hover:text-gray-600"
              >
                Support
              </a>
            </li>
            <li>
              <a
                  target="_blank"
                  href="https://simmmple.com/licenses"
                  className="text-base font-medium text-gray-600 hover:text-gray-600"
              >
                License
              </a>
            </li>
            <li>
              <a
                  target="_blank"
                  href="https://simmmple.com/terms-of-service"
                  className="text-base font-medium text-gray-600 hover:text-gray-600"
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a
                  target="_blank"
                  href="https://blog.horizon-ui.com/"
                  className="text-base font-medium text-gray-600 hover:text-gray-600"
              >
                Blog
              </a>
            </li>
          </ul>
        </div>
      </div>
  );
};

export default Footer;
