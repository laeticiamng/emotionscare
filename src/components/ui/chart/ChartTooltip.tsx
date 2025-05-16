
import { TooltipProps } from 'recharts';
import { Card } from '@/components/ui/card';

export interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function getPayloadConfigFromPayload(payload: any) {
  return {
    value: payload.value,
    name: payload.name,
    color: payload.color,
    fill: payload.fill,
    stroke: payload.stroke,
  };
}

export const ChartTooltip = ({
  active,
  payload,
  label,
}: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Card className="border shadow-md">
        <div className="p-2">
          <div className="text-sm font-medium">{label}</div>
          <div className="py-1">
            {payload.map((entry, index) => (
              <div
                key={index}
                className="flex items-center text-xs py-0.5"
              >
                <div
                  className="w-3 h-3 rounded-sm mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground mr-1">
                  {entry.name}:
                </span>
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return null;
};

export default ChartTooltip;
