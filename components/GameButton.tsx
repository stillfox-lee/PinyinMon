import React from 'react';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
}

const GameButton: React.FC<GameButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "font-cartoon rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-400 text-white border-b-blue-700",
    secondary: "bg-yellow-400 hover:bg-yellow-300 text-yellow-900 border-b-yellow-600",
    success: "bg-green-500 hover:bg-green-400 text-white border-b-green-700",
    danger: "bg-red-500 hover:bg-red-400 text-white border-b-red-700",
    neutral: "bg-white hover:bg-gray-50 text-slate-700 border-b-slate-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl w-full",
    xl: "px-10 py-6 text-2xl w-full",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

export default GameButton;