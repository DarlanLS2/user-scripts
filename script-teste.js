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
      const regex_estagio = /Estágio|Estagio|Estagiário|Estagiario/i;
      const regex_assistente = /Assistente/i;
      
      if (text.length > 150) {
        return;
      }

      if (regex_estagio.test(text)) {
        span.style.setProperty("color", "#00FF19", "important");
      } else if (regex_assistente.test(text)) {
        span.style.setProperty("color", "#FFF200", "important");
      }
    });

    const mainDiv = document.querySelector("[componentkey='SearchResultsMainContent']");

    mainDiv.querySelectorAll("hr").forEach(hr => {
      hr.style.setProperty("display", "none", "important");
    })

    // console.log(mainDiv.querySelectorAll(":scope > *"))
  }

  
  highlight();

  // Cria observador que vigia o DOM e roda uma função quando algo muda
  const observer = new MutationObserver(() => {
    highlight();
  });

  observer.observe(document.body, { // Starta observação do body
    childList: true, // Detecta elementos adicionados ou removidos
    subtree: true // Observa elementos internos
  });

})();
