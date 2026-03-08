type BadgeVariant = "Active" | "Stock Out" | "Pending" | "Suspended" | "Verified";

const variantStyles: Record<BadgeVariant, string> = {
  Active: "bg-green-100 text-green-700",
  "Stock Out": "bg-red-100 text-red-700",
  Pending: "bg-amber-100 text-amber-700",
  Suspended: "bg-gray-100 text-gray-600",
  Verified: "bg-blue-100 text-blue-700",
};

interface StatusBadgeProps {
  status: BadgeVariant;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${variantStyles[status]}`}
    >
      {status}
    </span>
  );
}
