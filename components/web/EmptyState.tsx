interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="flex flex-col items-center gap-3">
        {icon && <div className="text-muted-foreground/30">{icon}</div>}
        <p className="text-muted-foreground font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors text-sm"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
