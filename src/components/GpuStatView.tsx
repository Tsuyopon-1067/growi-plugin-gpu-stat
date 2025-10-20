import { useContext, useState } from "react";
import { GpuStatsProvider } from "./GpuStatsProvider";
import { GpuStatsContext, GpuStatsContextType } from "./GpuStatsContext";
import { GpuStatsTable } from "./GpuStatsTable";
import { HostStats } from "./HostStats";
import "./GpuStatView.css";

const GpuStatusDisplay = () => {
  const context = useContext(GpuStatsContext);
  const [activeTab, setActiveTab] = useState<string>("all");

  if (!context) {
    throw new Error("GpuStatusDisplay must be used within a GpuStatsProvider");
  }

  const { stats, error, lastApiUpdate, refresh } =
    context as GpuStatsContextType;

  const hostnames = [
    "all",
    ...new Set(stats.map((stat) => stat.hostname).filter((h) => h) as string[]),
  ];

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleString() : "N/A";
  const formatApiDate = (dateString: string | null) =>
    dateString ? formatDate(new Date(dateString)) : "N/A";

  const tabStyle = (tabName: string) =>
    `px-4 py-2 text-2xl font-semibold border-b-2${
      activeTab === tabName
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;

  const selectedStat =
    activeTab === "all" ? null : stats.find((s) => s.hostname === activeTab);

  return (
    <>
      <div className="flex items-center mb-2">
        <button
          onClick={refresh}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <img src="/refresh.svg" alt="Refresh" className="w-6 h-6" />
        </button>
        <div className="ml-1 text-lg text-gray-600">
          <p className="m-0">Last Updated: {formatApiDate(lastApiUpdate)}</p>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="border-b-2 border-stone-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          {hostnames.map((hostname) => (
            <button
              key={hostname}
              onClick={() => setActiveTab(hostname)}
              className={tabStyle(hostname)}
            >
              {hostname === "all" ? "All" : hostname}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {activeTab === "all" ? (
          <GpuStatsTable stats={stats} />
        ) : selectedStat ? (
          <HostStats stat={selectedStat} />
        ) : (
          <p>Host not found.</p>
        )}
      </div>
    </>
  );
};

export const GpuStatView = () => {
  return (
    <GpuStatsProvider>
      <GpuStatusDisplay />
    </GpuStatsProvider>
  );
};
