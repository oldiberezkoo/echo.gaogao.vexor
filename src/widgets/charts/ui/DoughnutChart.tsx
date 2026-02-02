"use client";

import type { KnowledgeBlock } from "@/entities/block";
import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";

interface DoughnutChartProps {
  data: KnowledgeBlock[];
}

/**
 * DoughnutChart Widget
 * @description Chart.js doughnut chart for knowledge distribution
 */
export function DoughnutChart({ data }: DoughnutChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"doughnut", number[], string> | null>(
    null,
  );

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.map((b) => b.label),
        datasets: [
          {
            data: data.map((b) => b.value),
            backgroundColor: data.map((b) => b.color),
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "70%",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#171717",
            titleColor: "#fff",
            bodyColor: "#a3a3a3",
            padding: 12,
            cornerRadius: 12,
            displayColors: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
}
