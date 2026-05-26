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

  function getJobsDiv() {
    return document.querySelector("[componentkey='SearchResultsMainContent']");
  }

  function getElements(jobsDiv) {
    return jobsDiv.querySelectorAll(":scope > *");
  }

  function getSpanOfElement(element) {
    return element.querySelectorAll("span[aria-hidden='true']");
  }

  function getTextOfSpan(span) {
    if (!span) return "";
    return span.textContent.trim();
  }

  function getTimeOfText(text) {
    return text.match(/[0-9]+/);
  }

  function getSortedJobDivs(elements) {
    const jobsSortedByHourList = [];
    const jobsSortedByMinuteList = [];
    const allJobsDivsSortedList = [];

    elements.forEach((element, index) => {
      const spans = getSpanOfElement(element);

      spans.forEach(span => {
        const text = getTextOfSpan(span);
        const time = getTimeOfText(text);
        const hourRegex = /hora|horas/i;
        const minuteRegex = /minuto|minutos/i;

        if (hourRegex.test(text)) {
          jobsSortedByHourList.push({ index, time: Number(time[0]) });
        } else if (minuteRegex.test(text)) {
          jobsSortedByMinuteList.push({ index, time: Number(time[0]) });
        }
      });
    });

    jobsSortedByMinuteList.sort((a, b) => a.time - b.time);
    jobsSortedByHourList.sort((a, b) => a.time - b.time);

    const allJobsSortedList = [...jobsSortedByMinuteList, ...jobsSortedByHourList];

    allJobsSortedList.forEach(job => {
      allJobsDivsSortedList.push(elements[job.index]);
    });

    return allJobsDivsSortedList;
  }

  function main() {
    const jobsDiv = getJobsDiv();
    if (!jobsDiv) return;

    const elements = getElements(jobsDiv);
    const sortedJobsDiv = getSortedJobDivs(elements);

    sortedJobsDiv.forEach(jobDiv => {
      jobsDiv.appendChild(jobDiv);
    });
  }

  const observer = new MutationObserver(() => {
    main();
  });

  setTimeout(() => {
    main();
    const targetNode = document.querySelector("[componentkey='SearchResultsMainContent']").parentNode;
    observer.observe(targetNode, {
      childList: true,
      subtree: false
    });
  }, 100);

})();
