import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type StatusChartProps = {
  labels: string[];
  values: number[];
};

export function StatusChart({ labels, values }: StatusChartProps) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#7E8D98", "#8DA89A", "#C8AA78", "#B79192"],
        borderColor: ["#F4F4F3"],
        borderWidth: 6,
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
            labels: {
              color: "rgba(25,25,25,0.62)",
            },
          },
        },
      }}
    />
  );
}
