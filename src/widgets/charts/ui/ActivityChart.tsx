"use client";

import type { ActivityDataPoint } from "@/entities/user";
import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";

interface ActivityChartProps {
  data: ActivityDataPoint[];
}

/**
 * ActivityChart Widget
 * @description Chart.js bar chart for activity visualization
 */
export function ActivityChart({ data }: ActivityChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"bar", number[], string> | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: "Задачи",
            data: data.map((d) => d.tasks),
            backgroundColor: "#36F79A",
            borderRadius: 8,
            barThickness: 12,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#404040",
            },
            ticks: {
              color: "#737373",
              font: { size: 10 },
              stepSize: 5,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#737373",
              font: { size: 9 },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#171717",
            titleColor: "#fff",
            bodyColor: "#a3a3a3",
            padding: 8,
            cornerRadius: 8,
            displayColors: false,
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
