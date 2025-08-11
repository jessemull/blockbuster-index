export const CHART_OPTIONS = {
  BAR: {
    indexAxis: 'y' as const,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#ffffff' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0)' },
        ticks: { color: '#ffffff' },
      },
    },
  },
  RADAR: {
    maintainAspectRatio: false,
    layout: { padding: 0 },
    plugins: { legend: { display: false } },
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.1)' },
        grid: { color: 'rgba(255,255,255,0.15)' },
        pointLabels: { color: '#ffffff', font: { size: 12 }, padding: 0 },
        ticks: { display: false },
      },
    },
  },
} as const;

export const CHART_COLORS = {
  BAR_BACKGROUND: 'rgba(244, 221, 50, 0.35)',
  RADAR_BACKGROUND: 'rgba(244, 221, 50, 0.15)',
} as const;
