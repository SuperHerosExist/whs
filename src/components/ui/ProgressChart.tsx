import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface DataPoint {
  label: string;
  value: number;
  date?: Date;
}

export interface ProgressChartProps {
  data: DataPoint[];
  title?: string;
  showTrend?: boolean;
  height?: number;
  color?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  showTrend = true,
  height = 200,
  color = 'tiger-primary-black'
}) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-tiger-neutral-500">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  // Calculate trend
  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;
  const change = lastValue - firstValue;
  const percentChange = firstValue > 0 ? ((change / firstValue) * 100).toFixed(1) : '0';
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

  return (
    <div className="space-y-4">
      {(title || showTrend) && (
        <div className="flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-bold text-tiger-primary-black">{title}</h3>
          )}
          {showTrend && data.length > 1 && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-tiger-neutral-500'
            }`}>
              {trend === 'up' && <TrendingUp className="w-4 h-4" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4" />}
              {trend === 'neutral' && <Minus className="w-4 h-4" />}
              {trend !== 'neutral' && `${Math.abs(parseFloat(percentChange))}%`}
            </div>
          )}
        </div>
      )}

      <div className="relative" style={{ height: `${height}px` }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-tiger-neutral-500 font-medium">
          <span>{maxValue}</span>
          <span>{Math.round((maxValue + minValue) / 2)}</span>
          <span>{minValue}</span>
        </div>

        {/* Chart area */}
        <div className="absolute left-14 right-0 top-0 bottom-8 border-l-2 border-b-2 border-tiger-neutral-200">
          {/* Grid lines */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 right-0 border-t border-tiger-neutral-100" />
            <div className="absolute top-1/2 left-0 right-0 border-t border-tiger-neutral-100" />
            <div className="absolute bottom-0 left-0 right-0 border-t border-tiger-neutral-100" />
          </div>

          {/* Line chart */}
          <svg className="absolute inset-0 overflow-visible" preserveAspectRatio="none">
            {/* Area fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className={`text-${color}`} stopOpacity="0.2" />
                <stop offset="100%" className={`text-${color}`} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {data.length > 1 && (
              <>
                {/* Area path */}
                <path
                  d={generatePath(data, minValue, range, true)}
                  fill="url(#areaGradient)"
                  className={`text-${color}`}
                />

                {/* Line path */}
                <path
                  d={generatePath(data, minValue, range, false)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-${color}`}
                />
              </>
            )}

            {/* Data points */}
            {data.map((point, index) => {
              const x = (index / (data.length - 1 || 1)) * 100;
              const y = ((point.value - minValue) / range) * 100;

              return (
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={`${100 - y}%`}
                    r="4"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-${color}`}
                  />
                  <circle
                    cx={`${x}%`}
                    cy={`${100 - y}%`}
                    r="12"
                    fill="transparent"
                    className="hover:fill-black hover:fill-opacity-5 cursor-pointer transition-all"
                  >
                    <title>{`${point.label}: ${point.value}`}</title>
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="absolute left-14 right-0 bottom-0 h-8 flex justify-between items-end text-xs text-tiger-neutral-500 font-medium">
          {data.map((point, index) => {
            // Show labels for first, last, and middle points to avoid crowding
            if (data.length <= 5 || index === 0 || index === data.length - 1 || index === Math.floor(data.length / 2)) {
              return (
                <span key={index} className="flex-1 text-center">
                  {point.label}
                </span>
              );
            }
            return <span key={index} className="flex-1" />;
          })}
        </div>
      </div>
    </div>
  );
};

function generatePath(data: DataPoint[], minValue: number, range: number, area: boolean): string {
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return { x, y };
  });

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }

  if (area) {
    path += ` L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`;
  }

  return path;
}
