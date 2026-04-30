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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

type WeeklyChartProps = {
  labels: string[];
  values: number[];
};

export function WeeklyChart({ labels, values }: WeeklyChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Applications",
        data: values,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: { legend: { display: false } },
      }}
    />
  );
}
