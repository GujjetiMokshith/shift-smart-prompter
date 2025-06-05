import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'gradient' | 'glow' | 'shimmer';
  delay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  children, 
  className, 
  variant = 'gradient',
  delay = 0 
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x';
      case 'glow':
        return 'text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]';
      case 'shimmer':
        return 'bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent animate-shimmer';
      default:
        return 'text-white';
    }
  };

  return (
    <div 
      ref={textRef}
      className={cn(
        'opacity-0 translate-y-8 transition-all duration-1000 ease-out',
        getVariantClasses(),
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedText;