import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "default" | "sm" | "icon";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "default", isLoading, fullWidth, children, disabled, ...props }, ref) => {
    
    // 1. Base Styles (Selalu dipakai)
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
    
    // 2. Variant Styles (Warna)
    const variants = {
      primary: "bg-yellow-400 text-black hover:bg-yellow-500 shadow-md",
      outline: "border-2 border-gray-200 bg-transparent text-gray-700 hover:border-yellow-400 hover:text-yellow-600",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
      danger: "bg-red-50 text-red-600 hover:bg-red-100",
    };

    // 3. Size Styles (Ukuran)
    const sizes = {
      default: "h-12 px-6 py-3 text-sm",
      sm: "h-9 px-3 text-xs",
      icon: "h-8 w-8 p-0", // Untuk tombol + atau -
    };

    // 4. Gabungkan Class
    const classes = `
      ${baseStyles} 
      ${variants[variant]} 
      ${sizes[size]} 
      ${fullWidth ? "w-full" : ""} 
      ${className}
    `;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;