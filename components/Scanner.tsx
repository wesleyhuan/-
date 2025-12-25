
import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScannerProps {
  onScan: (decodedText: string) => void;
  title: string;
  description?: string;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, title, description }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText);
        // We don't necessarily stop it here unless we want to, 
        // but typically for "one-off" we might.
      },
      (error) => {
        // Silently ignore scan errors (they happen every frame if no QR is found)
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error("Failed to clear scanner", e));
      }
    };
  }, [onScan]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>
      <div id="qr-reader" className="w-full"></div>
      <div className="mt-4 text-center text-xs text-gray-400">
        請對準 QR Code 進行掃描
      </div>
    </div>
  );
};

export default Scanner;
