import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type AnalyticsPieChartProps = {
  labels: string[];
  values: number[];
};

export function AnalyticsPieChart({ labels, values }: AnalyticsPieChartProps) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#F43F5E"],
      },
    ],
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: "55%",
        maintainAspectRatio: false,
        responsive: true,
      }}
    />
  );
}
