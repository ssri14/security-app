import React, { useState } from "react";
import PrintContext from "./printContext";
import html2pdf from 'html2pdf.js';

const PrintState = (props) => {
  const printData = async (/*data*/htmlTemplate, filename) => {
    const pdfPromises = [];
    pdfPromises.push(
      new Promise((resolve) => {
        const pdfElement = document.createElement('div');
        pdfElement.innerHTML = htmlTemplate;
        html2pdf(pdfElement, {
          margin: 10,
          filename: `${filename}.pdf`, // Adjust filename dynamically
          image: { type: 'jpeg', quality: 1.0 },
          html2canvas: { scale: 3 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        }).output('blob').then(resolve);
      })
    );

  };
  return (
    <PrintContext.Provider value={{ printData }}>
      {props.children}
    </PrintContext.Provider>
  )
}

export default PrintState;
