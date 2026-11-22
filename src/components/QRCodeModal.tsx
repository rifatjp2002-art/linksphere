import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, QrCode as QrIcon, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  username: string;
  displayName: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  url,
  username,
  displayName,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [dotColor, setDotColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');

  useEffect(() => {
    if (isOpen && url) {
      QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: {
          dark: dotColor,
          light: bgColor,
        },
      })
        .then((dataUri) => setQrDataUrl(dataUri))
        .catch((err) => console.error(err));
    }
  }, [isOpen, url, dotColor, bgColor]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `${username}-linksphere-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5 px-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <QrIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Scan & Connect
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">
            @{username} • {displayName}
          </p>
        </div>

        {/* QR Preview Box */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800 mb-5">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Profile QR Code"
              className="w-52 h-52 rounded-lg shadow-md"
            />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center bg-slate-200 animate-pulse rounded-lg" />
          )}

          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Theme Color:
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { label: 'Slate', dark: '#0f172a', light: '#ffffff' },
                { label: 'Indigo', dark: '#4f46e5', light: '#ffffff' },
                { label: 'Emerald', dark: '#059669', light: '#ffffff' },
                { label: 'Rose', dark: '#e11d48', light: '#ffffff' },
              ].map((c) => (
                <button
                  key={c.label}
                  onClick={() => {
                    setDotColor(c.dark);
                    setBgColor(c.light);
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    dotColor === c.dark ? 'scale-110 border-indigo-600' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.dark }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            Download QR
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm rounded-xl transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
          Put this QR code on business cards, posters, or event badges.
        </p>
      </div>
    </div>
  );
};
