import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

type AnalyticsLineChartProps = {
  labels: string[];
  values: number[];
};

export function AnalyticsLineChart({ labels, values }: AnalyticsLineChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Response Time",
        data: values,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
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
