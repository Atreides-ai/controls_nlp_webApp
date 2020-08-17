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
            pdf.setFontSize(11);
            const cellWidth = 90;
            const cellHeight = 50;
            let start = 0;

            for (const [key, value] of Object.entries(descriptions)) {
                const input = document.getElementById(key);
                await html2canvas(input).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    pdf.addImage(imgData, 'PNG', 15, start, cellWidth, cellHeight);
                    pdf.text(value, 15, start + cellHeight + 5);
                    if (start < 270) {
                        start = start + 55;
                    } else if (start > 270) {
                        start = 0;
                        pdf.addPage('p');
                    }
                });
            }
            pdf.save('Atreides Controls Report.pdf');
        }}
    >
        {label}{' '}
    </Button>
);

export default PrintButton;
