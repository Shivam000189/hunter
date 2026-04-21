import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { analyticsPie } from "../data/mockAnalytics";

ChartJS.register(ArcElement, Tooltip, Legend);

export function AnalyticsPieChart() {
  const data = {
    labels: analyticsPie.labels,
    datasets: [
      {
        data: analyticsPie.data,
        backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#F43F5E"],
      },
    ],
  };

  return <Doughnut data={data} options={{ cutout: "55%" }} />;
}