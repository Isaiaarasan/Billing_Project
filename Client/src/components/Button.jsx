import React from "react";

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}) => {
  const baseStyles =
    "w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200",
    secondary:
      "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    outline:
      "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
