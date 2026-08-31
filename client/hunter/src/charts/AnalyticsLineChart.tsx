import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
} from "chart.js";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip);

type AnalyticsLineChartProps = {
  labels: string[];
  values: number[];
};

export function AnalyticsLineChart({ labels, values }: AnalyticsLineChartProps) {
  const { isDark } = useTheme();

  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.06)";
  const tickColor = isDark ? "#94a3b8" : "#475569";

  const data = {
    labels,
    datasets: [
      {
        label: "Applications Submitted",
        data: values,
        borderColor: "#6366f1",
        backgroundColor: isDark ? "rgba(99, 102, 241, 0.22)" : "rgba(79, 70, 229, 0.12)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? "#1e293b" : "#0f172a",
            titleColor: "#f8fafc",
            bodyColor: "#f8fafc",
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: tickColor,
              font: { weight: 600, size: 11 },
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: {
              color: tickColor,
              font: { weight: 600, size: 11 },
              stepSize: 2,
            },
          },
        },
      }}
    />
  );
}
