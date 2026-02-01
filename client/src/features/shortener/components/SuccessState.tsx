import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Copy, ExternalLink, Check, BarChart3, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { ShortenResponse } from "../services/url.service";

function SkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="w-full bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="flex-1 w-full space-y-6">
          <div className="space-y-2">
            <div className="h-4 bg-zinc-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-zinc-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="h-10 bg-zinc-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-zinc-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-zinc-200 rounded w-40 animate-pulse"></div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-40 h-40 bg-zinc-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
}

interface SuccessStateProps {
  data: ShortenResponse;
}

export function SuccessState({ data }: SuccessStateProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas") as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.slug}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    // Simulate loading for 0.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll to this element when it's fully loaded
    if (!isLoading && ref.current) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [isLoading]);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.short_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewDashboard = () => {
    navigate(`/dashboard/${data.slug}`);
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="w-full bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="flex-1 w-full space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
              Successfully Shortened
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={data.short_url}
                target="_blank"
                rel="noopener"
                className="text-2xl md:text-3xl font-bold text-indigo-600 hover:text-indigo-700 tracking-tight transition-colors break-all"
              >
                {data.short_url.replace(/^https?:\/\//, "")}
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                copied
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={data.short_url}
              target="_blank"
              rel="noopener"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
            >
              <ExternalLink size={16} />
              Open
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewDashboard}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
            >
              <BarChart3 size={16} />
              Visit Dashboard
            </motion.button>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div
            ref={qrRef}
            className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm group cursor-pointer hover:border-indigo-200 transition-colors"
            onClick={handleDownloadQR}
          >
            <div className="w-32 h-32 bg-zinc-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              <QRCodeCanvas
                value={data.short_url}
                size={128}
                level="H"
                includeMargin={false}
                className="w-full h-full"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-1 text-center text-xs font-medium text-zinc-500 mt-2 hover:text-indigo-600 transition-colors"
            >
              <Download size={14} />
              Download QR
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
