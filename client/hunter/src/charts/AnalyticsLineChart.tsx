import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

import { analyticsTrend } from "../data/mockAnalytics";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export function AnalyticsLineChart() {
  const data = {
    labels: analyticsTrend.labels,
    datasets: [
      {
        label: "Response Time",
        data: analyticsTrend.data,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  return <Line data={data} options={{ plugins: { legend: { display: false } } }} />;
}