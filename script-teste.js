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

  function getJobsDiv() {
    const jobsDiv = document.querySelector("[componentkey='SearchResultsMainContent']");

    jobsDiv.style.display = "none";

    return jobsDiv; 
  }

  function getMainDiv(jobsDiv) {
    return jobsDiv.parentNode;
  }

  function getJobsDivClone(jobsDiv) {
    const oldClone = document.querySelector("#clone");

    if (oldClone) {
      oldClone.remove();
    }

    const clone = jobsDiv.cloneNode(true);

    clone.id = "clone"

    if (clone.style.display != "flex") {
      clone.style.display = "flex";
    }

    return clone;
  }

  function mockJobsDiv(mainDiv, jobsDivClone) {
    mainDiv.appendChild(jobsDivClone)
  }

  function getElements(jobsDivClone) {
    return jobsDivClone.querySelectorAll(":scope > *");
  }

  function getHr(elements) {
    return elements[1];
  }

  function getSpanOfElement(element) {
    return element.querySelector("span[aria-hidden='true']");
  }

  function getTextOfSpan(span) {
    if (!span) {
      return "";
    }

    return span.textContent.trim();
  }

  function getTimeOfText(text) {
    return text.match(/[0-9]+/);
  }

  function getSortedJobDivs(elements) {
    const jobsSortedByHourList = [];
    const jobsSortedByMinuteList = [];
    const allJobsDivsSortedList = []

    elements.forEach((element, index) => {
      const span = getSpanOfElement(element);
      const text = getTextOfSpan(span);
      const time = getTimeOfText(text);

      const hourRegex = /hora|horas/i
      const minuteRegex = /minuto|minutos/i

      if (hourRegex.test(text)) {
        jobsSortedByHourList.push({
          index : index,
          time : Number(time[0])
        })
      } else if (minuteRegex.test(text)) {
        jobsSortedByMinuteList.push({
          index : index,
          time : Number(time[0])
        })
      }

    })

    if (jobsSortedByMinuteList.length > 0) {
      jobsSortedByMinuteList.sort((a, b) => a.time - b.time)
    }

    if (jobsSortedByHourList.length > 0) {
      jobsSortedByHourList.sort((a, b) => a.time - b.time)
    }

    
    const allJobsSortedList = [...jobsSortedByMinuteList, ...jobsSortedByHourList];


    allJobsSortedList.forEach(job => {
      allJobsDivsSortedList.push(elements[job.index])
    })

    return allJobsDivsSortedList;
  }

  function main() {
    const jobsDiv = getJobsDiv();
    const jobsDivClone = getJobsDivClone(jobsDiv);
    const mainDiv = getMainDiv(jobsDiv);
    const elements = getElements(jobsDivClone);
    const hr = getHr(elements)

    mockJobsDiv(mainDiv, jobsDivClone)

    const sortedJobsDiv = getSortedJobDivs(elements)

    jobsDivClone.innerHTML = "";

    // observer.disconnect();

    sortedJobsDiv.forEach(jobDiv => {
      jobsDivClone.appendChild(jobDiv)
      jobsDivClone.appendChild(hr)
    })

    // observer.observe(document.body, { childList: true, subtree: true });
  }

  let debounceTimer = null;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(main, 500);
  });




  // // Cria observador que vigia o DOM e roda uma função quando algo muda
  // const observer = new MutationObserver(() => {
  //   // highlight();
  //   main()
  // });


  
  // highlight();
  main();


  observer.observe(document.body, { // Starta observação do body
    childList: true, // Detecta elementos adicionados ou removidos
    subtree: true // Observa elementos internos
  });

})();
