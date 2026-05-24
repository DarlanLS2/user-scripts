// ==UserScript==
// @name         LinkedIn Estágio Highlight
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description vai se foder
// @match        https://www.linkedin.com/jobs/*
// @grant        none
// @run-at document-idle
// ==/UserScript==

(function () {
  'use strict';

  function highlight() {
    const spans = document.querySelectorAll("span");

    spans.forEach(span => {
      const text = span.textContent.trim();

      if (text.includes("Estágio")) {
        span.style.setProperty("color", "red", "important");
      }
    });
  }

  // roda uma vez
  highlight();

  // roda novamente quando o DOM mudar
  const observer = new MutationObserver(() => {
    highlight();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
