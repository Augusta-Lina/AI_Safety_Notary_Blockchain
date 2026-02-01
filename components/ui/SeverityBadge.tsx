import { SeverityLevel } from "@/lib/types";

interface SeverityBadgeProps {
  level: SeverityLevel;
  className?: string;
}

const severityConfig = {
  1: { color: "bg-green-100 text-green-800", label: "Minor" },
  2: { color: "bg-green-200 text-green-900", label: "Low" },
  3: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
  4: { color: "bg-orange-100 text-orange-800", label: "High" },
  5: { color: "bg-red-100 text-red-800", label: "Critical" },
};

export function SeverityBadge({ level, className = "" }: SeverityBadgeProps) {
  const config = severityConfig[level];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}
      title={`Severity Level ${level}: ${config.label}`}
    >
      {config.label} ({level})
    </span>
  );
}
