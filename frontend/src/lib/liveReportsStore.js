// src/lib/liveReportsStore.js
let liveReports = [];

// Add or update live report in memory
export const addLiveReport = (report) => {
  const exists = liveReports.some((r) => r._id === report._id);
  if (!exists) {
    liveReports = [report, ...liveReports].slice(0, 10); // keep latest 10
  }
};

// Get the current live reports
export const getLiveReports = () => {
  return [...liveReports]; // return a copy
};
