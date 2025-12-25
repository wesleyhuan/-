
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { Download, Printer, Image as ImageIcon, FileText } from 'lucide-react';

interface QRCodeViewProps {
  value: string;
  label: string;
  subLabel?: string;
  size?: number;
}

const QRCodeView: React.FC<QRCodeViewProps> = ({ value, label, subLabel, size = 180 }) => {
  const handlePrint = () => {
    window.print();
  };

  const getCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const svgElement = document.getElementById(`qr-svg-${value}`) as unknown as SVGSVGElement;
    if (!svgElement) return null;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const svgSize = size * 4; // Higher resolution for export
    canvas.width = svgSize;
    canvas.height = svgSize + 120; // Extra space for labels
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Fill white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Center the QR code
        const qrSize = svgSize * 0.8;
        const xOffset = (canvas.width - qrSize) / 2;
        ctx.drawImage(img, xOffset, 20, qrSize, qrSize);
        
        // Add label text
        ctx.fillStyle = "#111827"; // gray-900
        ctx.font = "bold 48px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, canvas.width / 2, qrSize + 80);
        
        ctx.font = "32px monospace";
        ctx.fillStyle = "#6B7280"; // gray-500
        ctx.fillText(value, canvas.width / 2, qrSize + 130);
        
        resolve(canvas);
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    });
  };

  const handleDownloadPNG = async () => {
    const canvas = await getCanvas();
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${label}-QR.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 80]
    });

    const canvas = await getCanvas();
    if (!canvas) return;

    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, 'PNG', 5, 5, 70, 70);
    doc.save(`${label}-QR.pdf`);
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
      <div className="bg-white p-3 border-2 border-gray-900 rounded-lg">
        <QRCodeSVG id={`qr-svg-${value}`} value={value} size={size} level="M" />
      </div>
      <div className="mt-4 text-center">
        <p className="font-bold text-lg text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-wider">{value}</p>
        {subLabel && <p className="text-sm text-gray-600 mt-1 italic">{subLabel}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-6 w-full no-print">
        <button 
          onClick={handlePrint}
          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-bold flex items-center justify-center gap-2"
        >
          <Printer size={14} />
          直接列印
        </button>
        <button 
          onClick={handleDownloadPNG}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-bold flex items-center justify-center gap-2"
        >
          <ImageIcon size={14} />
          PNG 下載
        </button>
        <button 
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-xs font-bold flex items-center justify-center gap-2 col-span-2"
        >
          <FileText size={14} />
          產生 PDF 標籤檔
        </button>
      </div>

      {/* Print View Helper */}
      <div className="print-only fixed inset-0 bg-white flex items-center justify-center">
         <div className="border-2 border-black p-4 inline-block text-center">
            <QRCodeSVG value={value} size={250} level="M" />
            <div className="mt-4">
              <p className="text-2xl font-bold">{label}</p>
              <p className="text-lg font-mono">{value}</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default QRCodeView;
