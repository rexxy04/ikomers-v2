import { forwardRef } from "react";
import { Lock } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isPassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, isPassword, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="relative">
          <input
            ref={ref}
            type={isPassword ? "password" : "text"}
            className={`w-full px-4 py-3 rounded-xl border border-yellow-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-300 ${className}`}
            {...props}
          />
          {isPassword && (
            <Lock className="absolute right-4 top-3.5 text-gray-400" size={18} />
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;