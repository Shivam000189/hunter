import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { statusDistribution } from "../data/mockAnalytics";

ChartJS.register(ArcElement, Tooltip, Legend);

export function StatusChart() {
  const data = {
    labels: statusDistribution.labels,
    datasets: [
      {
        data: statusDistribution.data,
        backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#F43F5E"],
      },
    ],
  };

  return <Doughnut data={data} options={{ cutout: "60%" }} />;
}