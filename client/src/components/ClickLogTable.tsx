import { motion } from "framer-motion";
import { Globe, Monitor, Smartphone, Clock } from "lucide-react";

interface ClickLog {
  id: string;
  timestamp: string;
  referrer: string;
  referrerIcon?: string;
  device: "desktop" | "mobile";
  browser: string;
  location: string;
  countryCode: string;
}

const mockLogs: ClickLog[] = [
  {
    id: "1",
    timestamp: "2 mins ago",
    referrer: "Twitter",
    device: "mobile",
    browser: "Safari",
    location: "San Francisco, US",
    countryCode: "US",
  },
  {
    id: "2",
    timestamp: "15 mins ago",
    referrer: "Direct",
    device: "desktop",
    browser: "Chrome",
    location: "London, UK",
    countryCode: "GB",
  },
  {
    id: "3",
    timestamp: "42 mins ago",
    referrer: "LinkedIn",
    device: "desktop",
    browser: "Firefox",
    location: "Berlin, DE",
    countryCode: "DE",
  },
  {
    id: "4",
    timestamp: "1 hour ago",
    referrer: "Slack",
    device: "desktop",
    browser: "Chrome",
    location: "Toronto, CA",
    countryCode: "CA",
  },
  {
    id: "5",
    timestamp: "3 hours ago",
    referrer: "Instagram",
    device: "mobile",
    browser: "Instagram",
    location: "Sydney, AU",
    countryCode: "AU",
  },
];

export function ClickLogTable() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
        <h3 className="font-semibold text-zinc-900">Recent Activity</h3>
        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50 border-b border-zinc-100">
            <tr>
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-6 py-3 font-medium">Referrer</th>
              <th className="px-6 py-3 font-medium">Device</th>
              <th className="px-6 py-3 font-medium">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {mockLogs.map((log, index) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-zinc-50/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-zinc-500 flex items-center gap-2">
                  <Clock size={14} className="text-zinc-400" />
                  {log.timestamp}
                </td>
                <td className="px-6 py-4 font-medium text-zinc-900">
                  {log.referrer}
                </td>
                <td className="px-6 py-4 text-zinc-600">
                  <div className="flex items-center gap-2">
                    {log.device === "desktop" ? (
                      <Monitor size={14} />
                    ) : (
                      <Smartphone size={14} />
                    )}
                    <span>{log.browser}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Globe size={14} />
                    <span>{log.location}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
