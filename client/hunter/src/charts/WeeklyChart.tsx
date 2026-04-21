import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { weeklyApplications } from "../data/mockAnalytics";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export function WeeklyChart() {
  const data = {
    labels: weeklyApplications.labels,
    datasets: [
      {
        label: "Applications",
        data: weeklyApplications.data,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  return <Line data={data} options={{ plugins: { legend: { display: false } } }} />;
}