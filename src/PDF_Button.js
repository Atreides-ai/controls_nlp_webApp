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
            pdf.text('Atreides Controls Analysis Report', 80, 10);
            pdf.setFontSize(10);
            const cellHeight = 60;
            let start = 20;
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
                    if (counter < 9) {
                        pdf.addImage(imgData, 'PNG', 15, start, 100, cellHeight);
                    } else {
                        pdf.addImage(imgData, 'PNG', 15, start, 60, cellHeight);
                    }
                    const textLines = pdf.splitTextToSize(value, 180);
                    pdf.text(textLines, 15, start + cellHeight + 5);
                    if (start + cellHeight + 20 < 230) {
                        start = start + 90;
                    } else {
                        start = 0;
                        pdf.addPage('p');
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
