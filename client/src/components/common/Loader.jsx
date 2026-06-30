import { Loader2 } from 'lucide-react';

export default function Loader({ size = 'md', center = true, text }) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClass} animate-spin text-emergency-600`} />
      {text && <p className="text-sm text-subtle font-medium">{text}</p>}
    </div>
  );

  if (center) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[200px]">
        {content}
      </div>
    );
  }

  return content;
}

export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`}></div>;
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <Loader size="lg" text="Loading RAHAT..." />
    </div>
  );
}
