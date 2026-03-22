interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "danger";
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const variants = {
    primary: "bg-primary/10 text-primary border border-primary/20 dark:bg-primary/15 dark:text-primary",
    secondary: "bg-secondary/10 text-secondary border border-secondary/20 dark:text-secondary-light",
    accent: "bg-accent/20 text-secondary border border-accent/30 dark:bg-accent/15 dark:text-accent dark:border-accent/25",
    danger: "bg-red-500/10 text-red-600 border border-red-500/20 dark:bg-red-500/15 dark:text-red-400",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
