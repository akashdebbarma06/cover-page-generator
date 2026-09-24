import React from "react";

interface AppLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AppLogo({ className = "", size = "md" }: AppLogoProps) {
  const sizeClasses = {
    sm: "w-7 h-7 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-14 h-14 rounded-2xl",
    xl: "w-20 h-20 rounded-3xl",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div
      className={`bg-crimson-brand flex items-center justify-center text-white shadow-sm flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <svg
        className={`${iconSizes[size]} fill-current`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Open book academic insignia per architecture.pdf */}
        <circle cx="12" cy="4" r="1.5" />
        <path d="M4 7.5C4 6.67 4.67 6 5.5 6H11V16.5C10.2 16.5 7.5 17 4 18.5V7.5Z" />
        <path d="M20 7.5C20 6.67 19.33 6 18.5 6H13V16.5C13.8 16.5 16.5 17 20 18.5V7.5Z" />
        <path d="M4.5 20.5C8 19 11.2 19 12 21C12.8 19 16 19 19.5 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}
