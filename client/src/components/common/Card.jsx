export default function Card({ children, className = '', hover = false, padding = 'md' }) {
  const pClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }[padding];

  return (
    <div className={`bg-white rounded-lg border border-border shadow-card ${hover ? 'transition-shadow hover:shadow-card-md' : ''} ${pClasses} ${className}`}>
      {children}
    </div>
  );
}
