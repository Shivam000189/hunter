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
        borderColor: "#7E8D98",
        backgroundColor: "rgba(126,141,152,0.16)",
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
        scales: {
          x: {
            grid: { color: "rgba(25,25,25,0.06)" },
            ticks: { color: "rgba(25,25,25,0.54)" },
          },
          y: {
            grid: { color: "rgba(25,25,25,0.06)" },
            ticks: { color: "rgba(25,25,25,0.54)" },
          },
        },
      }}
    />
  );
}
