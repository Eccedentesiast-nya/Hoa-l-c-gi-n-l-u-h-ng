import React from 'react';

interface CuteStarIconProps {
  className?: string;
  size?: number;
}

export const CuteStarIcon: React.FC<CuteStarIconProps> = ({
  className = "w-7 h-7",
  size = 32
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center animate-star-float ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Soft Glow */}
      <div className="absolute inset-0 rounded-full bg-[#E892A0]/40 blur-md animate-pulse"></div>
      
      {/* Cute Star Image from Pin */}
      <img
        src="https://i.pinimg.com/1200x/e9/86/b6/e986b6e704bd2431d1393d6bcff91044.jpg"
        alt="Star Icon"
        className="relative z-10 w-full h-full object-cover rounded-full shadow-sm filter drop-shadow-md border border-[#F3B8C2]"
      />
    </div>
  );
};

