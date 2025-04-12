
import React, { useEffect, useRef, ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const FadeIn = ({ children, delay = 0, className = '' }: FadeInProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('opacity-100');
              entry.target.classList.remove('translate-y-10');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out opacity-0 translate-y-10 ${className}`}
    >
      {children}
    </div>
  );
};

export default FadeIn;
