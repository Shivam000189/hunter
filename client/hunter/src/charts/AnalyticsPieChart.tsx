import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

type AnalyticsPieChartProps = {
  labels: string[];
  values: number[];
};

export function AnalyticsPieChart({ labels, values }: AnalyticsPieChartProps) {
  const { isDark } = useTheme();

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#f43f5e"],
        borderColor: isDark ? "#141c2e" : "#ffffff",
        borderWidth: 3,
      },
    ],
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: "60%",
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: isDark ? "#cbd5e1" : "#334155",
              font: { weight: 600, size: 12 },
              padding: 12,
            },
          },
          tooltip: {
            backgroundColor: isDark ? "#1e293b" : "#0f172a",
            titleColor: "#f8fafc",
            bodyColor: "#f8fafc",
            padding: 10,
            cornerRadius: 8,
          },
        },
      }}
    />
  );
}
