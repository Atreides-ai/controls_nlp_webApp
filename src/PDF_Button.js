import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Button from '@material-ui/core/Button';

const PrintButton = ({ descriptions, label }) => (
    <Button
        variant="outlined"
        color="secondary"
        onClick={async () => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(12);
            pdf.text('Atreides Controls Analysis Report', 70, 10);
            pdf.setFontSize(12);
            pdf.text('Overall Control Score', 70, 20);
            pdf.setFontSize(10);
            let cellHeight = 0;
            const margin = 5;
            const pageWidth = 210;
            const pageHeight = 297;
            let start = 30;
            let counter = 0;
            const svgElements = document.body.querySelectorAll('svg');
            svgElements.forEach(function(item) {
                item.setAttribute('width', item.getBoundingClientRect().width);
                item.style.width = null;
            });
            for (const [key, value] of Object.entries(descriptions)) {
                const input = document.getElementById(key);
                await html2canvas(input, { allowTaint: true }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    if (counter < 5) {
                        cellHeight = 30;
                        pdf.addImage(imgData, 'PNG', 15, start, 55, cellHeight);
                        const textLines = pdf.splitTextToSize(value, pageWidth - margin * 3 - 65);
                        pdf.text(textLines, 70, start + 10);
                    } else if (counter === 6) {
                        cellHeight = 30;
                        pdf.addImage(imgData, 'PNG', 15, start + 10, 60, cellHeight);
                        const textLines = pdf.splitTextToSize(value, pageWidth - margin * 3 - 75);
                        pdf.text(textLines, 80, start + 20);
                    } else if (counter < 9) {
                        cellHeight = 30;
                        pdf.addImage(imgData, 'PNG', 15, start, 60, cellHeight);
                        const textLines = pdf.splitTextToSize(value, pageWidth - margin * 3 - 75);
                        pdf.text(textLines, 80, start + 10);
                    } else {
                        cellHeight = 80;
                        pdf.addImage(imgData, 'PNG', 15, start, 100, cellHeight);
                        const textLines = pdf.splitTextToSize(value, pageWidth - margin * 3 - 90);
                        pdf.text(textLines, 95, start + 10);
                    }

                    if (counter === 5) {
                        pdf.setFontSize(12);
                        pdf.text('Atreides Controls Analysis Report', 70, 10);
                        pdf.setFontSize(12);
                        pdf.text('Control Relevance to Risk', 70, 20);
                        pdf.setFontSize(10);
                        start = 15;
                    }

                    if (counter === 8) {
                        pdf.addPage('p');
                        pdf.setFontSize(12);
                        pdf.text('Atreides Controls Analysis Report', 70, 10);
                        pdf.setFontSize(12);
                        pdf.text('Core Design Metrics', 70, 20);
                        pdf.setFontSize(10);
                        start = 30;
                    } else if (start + cellHeight + 20 < 230) {
                        start = start + cellHeight + 10;
                    } else if (counter < 17) {
                        start = 30;
                        pdf.addPage('p');
                        pdf.setFontSize(12);
                        pdf.text('Atreides Controls Analysis Report', 70, 10);
                        pdf.setFontSize(10);
                    }
                    counter++;
                });
            }
            pdf.save('Atreides Controls Report.pdf');
        }}
    >
        {label}{' '}
    </Button>
);

export default PrintButton;
