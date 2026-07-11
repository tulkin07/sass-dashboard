"use client";

import { memo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_COLORS,
  axisTickStyle,
  chartMargins,
  formatCategoryLabel,
  formatChartValue,
  formatCompactAxisValue,
} from "./chart-config";

export const ANALYTICS_CHART_HEIGHT = 200;

interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

interface CategoryData {
  category: string;
  count: number;
}

interface CountryData {
  country: string;
  count: number;
}

interface TopProductData {
  title: string;
  sales: number;
  revenue: number;
}

function ChartTooltip({
  active,
  payload,
  label,
  valueType = "number",
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  valueType?: "currency" | "number";
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-lg border border-border bg-popover px-3 py-2 text-xs"
      style={{ boxShadow: "none" }}
    >
      {label && <p className="mb-1.5 font-medium text-foreground">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">
              {formatChartValue(entry.value, valueType)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutLegend({ data }: { data: CategoryData[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
      {data.map((item, index) => {
        const percent = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";
        return (
          <div key={item.category} className="flex items-center gap-1.5 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <span className="text-muted-foreground">
              {formatCategoryLabel(item.category)}
            </span>
            <span className="font-medium text-foreground">{percent}%</span>
          </div>
        );
      })}
    </div>
  );
}

export const RevenueChart = memo(function RevenueChart({ data }: { data: RevenueData[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={chartMargins.default}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2065D1" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#2065D1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="month"
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
          width={40}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <ChartTooltip
              active={active}
              label={String(label)}
              valueType="currency"
              payload={payload?.map((p) => ({
                name: "Revenue",
                value: Number(p.value),
                color: "#2065D1",
              }))}
            />
          )}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#2065D1"
          fill="url(#revenueGradient)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0, fill: "#2065D1" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
});

export const OrdersCountChart = memo(function OrdersCountChart({ data }: { data: RevenueData[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={chartMargins.withBottomLabels}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="month"
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          width={40}
          allowDecimals={false}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <ChartTooltip
              active={active}
              label={String(label)}
              valueType="number"
              payload={payload?.map((p) => ({
                name: "Orders",
                value: Number(p.value),
                color: "#FFAB00",
              }))}
            />
          )}
        />
        <Bar dataKey="orders" name="orders" fill="#FFAB00" radius={[6, 6, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export const OrdersChart = memo(function OrdersChart({ data }: { data: RevenueData[] }) {
  const chartData = data.map((item) => ({
    month: item.month,
    revenue: item.revenue,
    orders: item.orders,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={chartMargins.withBottomLabels} barGap={6} barCategoryGap="20%">
        <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="month"
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <ChartTooltip
              active={active}
              label={String(label)}
              valueType="number"
              payload={payload?.map((p) => ({
                name: p.name === "revenue" ? "Revenue" : "Orders",
                value: Number(p.value),
                color: String(p.color),
              }))}
            />
          )}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "11px", paddingBottom: "12px" }}
          formatter={(value) => (value === "revenue" ? "Revenue" : "Orders")}
        />
        <Bar dataKey="revenue" name="revenue" fill="#2065D1" radius={[6, 6, 0, 0]} maxBarSize={14} />
        <Bar dataKey="orders" name="orders" fill="#FFAB00" radius={[6, 6, 0, 0]} maxBarSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export const CategoryChart = memo(function CategoryChart({ data }: { data: CategoryData[] }) {
  if (!data.length) {
    return <p className="py-12 text-center text-sm text-muted-foreground">No data</p>;
  }

  const top5 = data.slice(0, 5).map((item) => ({
    ...item,
    label: formatCategoryLabel(item.category),
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={top5}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={88}
            paddingAngle={2}
            stroke="var(--card)"
            strokeWidth={2}
          >
            {top5.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map((p) => ({
                  name: String(p.name),
                  value: Number(p.value),
                  color: String(p.payload?.fill || CHART_COLORS[0]),
                }))}
              />
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <DonutLegend data={top5} />
    </div>
  );
});

export const CountryChart = memo(function CountryChart({
  data,
  height = 240,
}: {
  data: CountryData[];
  height?: number;
}) {
  if (!data.length) {
    return <p className="py-12 text-center text-sm text-muted-foreground">No data</p>;
  }

  const chartData = data.slice(0, 6).map((item) => ({
    ...item,
    shortCountry: item.country.length > 14 ? `${item.country.slice(0, 14)}…` : item.country,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 20, left: 4, bottom: 4 }}
        barCategoryGap="20%"
        barSize={10}
      >
        <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" horizontal={false} />
        <XAxis
          type="number"
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="shortCountry"
          tick={{ ...axisTickStyle, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={100}
        />
        <Tooltip
          content={({ active, payload }) => (
            <ChartTooltip
              active={active}
              label={payload?.[0]?.payload?.country as string}
              payload={payload?.map((p) => ({
                name: "Users",
                value: Number(p.value),
                color: "#00AB55",
              }))}
            />
          )}
        />
        <Bar dataKey="count" fill="#00AB55" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export const TopProductsChart = memo(function TopProductsChart({
  data,
}: {
  data: TopProductData[];
}) {
  const chartData = data
    .slice(0, 6)
    .map((p) => ({
      name: p.title.length > 28 ? `${p.title.slice(0, 28)}…` : p.title,
      sales: p.sales,
    }))
    .reverse();

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }} barSize={12}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" horizontal={false} />
        <XAxis type="number" tick={axisTickStyle} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ ...axisTickStyle, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={120}
        />
        <Tooltip
          content={({ active, payload }) => (
            <ChartTooltip
              active={active}
              payload={payload?.map((p) => ({
                name: "Sales",
                value: Number(p.value),
                color: "#7635DC",
              }))}
            />
          )}
        />
        <Bar dataKey="sales" fill="#7635DC" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export const LineChartWidget = memo(function LineChartWidget({
  data,
  dataKey,
  xKey = "month",
  height = 280,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey?: string;
  height?: number;
}) {
  const compact = height <= ANALYTICS_CHART_HEIGHT;
  const margin = compact ? chartMargins.compact : chartMargins.default;
  const valueType = dataKey === "revenue" ? "currency" : "number";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={margin}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2065D1" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#2065D1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey={xKey} tick={axisTickStyle} axisLine={false} tickLine={false} />
        <YAxis
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          width={compact ? 44 : 48}
          tickFormatter={(value) => formatCompactAxisValue(Number(value), valueType)}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <ChartTooltip
              active={active}
              label={label != null ? String(label) : undefined}
              valueType={valueType}
              payload={payload?.map((p) => ({
                name: String(p.name || dataKey),
                value: Number(p.value),
                color: String(p.color || "#2065D1"),
              }))}
            />
          )}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="#2065D1"
          fill="url(#lineGradient)"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
});

export const PureLineChart = memo(function PureLineChart({
  data,
  dataKey,
  xKey = "month",
  height = 280,
  color = "#2065D1",
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey?: string;
  height?: number;
  color?: string;
}) {
  const compact = height <= ANALYTICS_CHART_HEIGHT;
  const margin = compact ? chartMargins.compact : chartMargins.default;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={margin}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey={xKey} tick={axisTickStyle} axisLine={false} tickLine={false} />
        <YAxis
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          width={compact ? 44 : 48}
          tickFormatter={(value) => formatCompactAxisValue(Number(value))}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <ChartTooltip
              active={active}
              label={label != null ? String(label) : undefined}
              valueType="number"
              payload={payload?.map((p) => ({
                name: String(p.name || dataKey),
                value: Number(p.value),
                color: String(p.color || color),
              }))}
            />
          )}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

export const AnalyticsBarChart = memo(function AnalyticsBarChart({
  data,
  dataKey,
  xKey,
  height = 280,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey: string;
  height?: number;
}) {
  const compact = height <= ANALYTICS_CHART_HEIGHT;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={compact ? chartMargins.compactWithBottomLabels : chartMargins.withBottomLabels}
      >
        <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          dy={8}
          interval={compact ? "preserveStartEnd" : 0}
        />
        <YAxis
          tick={axisTickStyle}
          axisLine={false}
          tickLine={false}
          width={compact ? 44 : 48}
          tickFormatter={(value) => formatCompactAxisValue(Number(value))}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <ChartTooltip
              active={active}
              label={label != null ? String(label) : undefined}
              valueType="number"
              payload={payload?.map((p) => ({
                name: String(p.name || dataKey),
                value: Number(p.value),
                color: String(p.color || "#00B8D9"),
              }))}
            />
          )}
        />
        <Bar
          dataKey={dataKey}
          fill="#00B8D9"
          radius={[6, 6, 0, 0]}
          maxBarSize={compact ? 22 : 28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
});

export const AnalyticsPieChart = memo(function AnalyticsPieChart({
  data,
  dataKey,
  nameKey,
  height = 240,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  nameKey: string;
  height?: number;
}) {
  const formatted = data.map((item) => ({
    ...item,
    label: formatCategoryLabel(String(item[nameKey])),
  }));
  const compact = height <= ANALYTICS_CHART_HEIGHT;
  const innerRadius = compact ? 38 : 50;
  const outerRadius = compact ? 68 : 85;

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={formatted}
            dataKey={dataKey}
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            stroke="var(--card)"
            strokeWidth={2}
          >
            {formatted.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                valueType="number"
                payload={payload?.map((p) => ({
                  name: String(p.name),
                  value: Number(p.value),
                  color: String(p.payload?.fill || CHART_COLORS[0]),
                }))}
              />
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export const PopularCategoriesChart = memo(function PopularCategoriesChart({
  data,
  totalLabel = "products",
}: {
  data: CategoryData[];
  totalLabel?: string;
  height?: number;
}) {
  if (!data.length) {
    return <p className="py-12 text-center text-sm text-muted-foreground">No data</p>;
  }

  const topCategories = data.slice(0, 4);
  const total = topCategories.reduce((sum, item) => sum + item.count, 0);
  const chartSize = 76;

  return (
    <div className="flex h-full flex-col items-center gap-3 sm:flex-row sm:items-center">
      <div
        className="relative shrink-0"
        style={{ width: chartSize, height: chartSize }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={topCategories}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={chartSize * 0.32}
              outerRadius={chartSize * 0.44}
              paddingAngle={3}
              stroke="var(--card)"
              strokeWidth={2}
            >
              {topCategories.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => (
                <ChartTooltip
                  active={active}
                  valueType="number"
                  payload={payload?.map((p) => ({
                    name: formatCategoryLabel(String(p.name)),
                    value: Number(p.value),
                    color: String(p.payload?.fill || CHART_COLORS[0]),
                  }))}
                />
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold leading-none tabular-nums text-foreground">
            {formatChartValue(total)}
          </span>
          <span className="mt-0.5 text-[9px] text-muted-foreground">{totalLabel}</span>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        {topCategories.map((item, index) => {
          const percent = total > 0 ? (item.count / total) * 100 : 0;
          const color = CHART_COLORS[index % CHART_COLORS.length];

          return (
            <div key={item.category}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="truncate text-[11px] font-medium text-foreground">
                    {formatCategoryLabel(item.category)}
                  </span>
                </div>
                <span className="shrink-0 text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {percent.toFixed(0)}%
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percent}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
