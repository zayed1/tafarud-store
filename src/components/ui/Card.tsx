interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-2xl border border-border overflow-hidden ${
        hover ? "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-border/80" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
