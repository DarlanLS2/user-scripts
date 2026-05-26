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

  // Procurar por todos os spans esta deixando lento pae
  function highlight() {
    const spans = document.querySelectorAll("span");

    spans.forEach(span => {
      const text = span.textContent.trim();
      const regex_estagio = /Estágio|Estagio|Estagiário|Estagiario|Estagiária|Estagiaria/i;
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

  }

  var list = []

  function t(index, spans) {
    spans.forEach(span => {
      const text = span.textContent.trim();
      const numero = text.match(/[0-9]+/);
      const hourRegex = /hora|horas/i

      if (hourRegex.test(text)) {
        list.push({
          index : index,
          hr : Number(numero[0])
        })
      }
    })

  }
  function getJobsSortedByHour() {

  }
  
  function getJobsDiv() {
    return mainDiv = document.querySelector("[componentkey='SearchResultsMainContent']");
  }

  function getJobsDivClone() {
    
  }

  function divSort() {
    list = [];

    const mainDiv = getJobsDiv();

    mainDiv.style.display = "none";

    const oldClone = document.querySelector("#clone");

    if (oldClone) {
      oldClone.remove();
    }

    const mainDivClone = mainDiv.cloneNode(true);

    mainDivClone.id = "clone"
    
    if (mainDivClone.style.display != "flex") {
      mainDivClone.style.display = "flex";
    }

    mainDiv.parentNode.appendChild(mainDivClone)

    const elements = mainDivClone.querySelectorAll(":scope > *");

    const hr = elements[1]

    elements.forEach((element, index) => {
      const spans = element.querySelectorAll("span[aria-hidden='true']")

      spans.forEach(span => {
        const text = span.textContent.trim();
        const numero = text.match(/[0-9]+/);
        const hourRegex = /hora|horas/i

        if (hourRegex.test(text)) {
          list.push({
            index : index,
            hr : Number(numero[0])
          })
        }
      })
    })

    list.sort((a, b) => a.hr - b.hr)

    const jobsSortedByHour = []

    list.forEach(element => {
      jobsSortedByHour.push(elements[el.index])
    })

    mainDivClone.innerHTML = "";

    observer.disconnect();

    jobsSortedByHour.forEach(el => {
      mainDivClone.appendChild(el)
      mainDivClone.appendChild(hr)
    })



    observer.observe(document.body, { childList: true, subtree: true });

    // mainDivClone.querySelectorAll("hr").forEach(hr => {
    //   hr.style.setProperty("display", "none", "important");
    // })
    //
    // console.log(mainDivClone.querySelectorAll(":scope > *"))
  }

  // Cria observador que vigia o DOM e roda uma função quando algo muda
  const observer = new MutationObserver(() => {
    // highlight();
    divSort()
  });
  
  // highlight();
  divSort();


  observer.observe(document.body, { // Starta observação do body
    childList: true, // Detecta elementos adicionados ou removidos
    subtree: true // Observa elementos internos
  });

})();
