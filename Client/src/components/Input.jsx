import React from "react";

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  ...props
}) => (
  <div className={`flex flex-col ${className}`}>
    {label && (
      <label className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1.5 ml-1">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
      {...props}
    />
  </div>
);

export default Input;
