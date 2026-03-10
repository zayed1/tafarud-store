interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
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
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
