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
        borderColor: "#6F7F76",
        backgroundColor: "rgba(111,127,118,0.14)",
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
