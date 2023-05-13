import React from "react";
import { Link } from "react-router-dom";

type ButtonPropsType = {
  size: "md";
  variant: "primary" | "transparent" | "bordered";
  to?: string;
  widthFull?: boolean;
};

const variants: { [key: string]: string } = {
  primary:
    "bg-[#1B4ACB] border border-transparent text-[18px] font-semibold text-white rounded-[3px] disabled:bg-secondary-200",
  bordered:
    "bg-white border border-[#598CF4] text-[18px] font-semibold rounded-[3px] text-[#1B4ACB]",
  transparent:
    "bg-transparent text-black hover:text-primary-700 hover:bg-primary-50 active:text-secondary-800 disabled:text-secondary-300",
};

const sizes: { [key: string]: string } = {
  md: "py-2 px-6",
};

const Button = ({
  size,
  variant,
  widthFull,
  to,
  children,
  className,
  ...rest
}: ButtonPropsType & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  if (to) {
    return (
      <Link
        className={`${
          variants[variant]
        } ${className} flex justify-center items-center transition-all inline-block ${
          sizes[size]
        } ${widthFull ? "w-full" : ""}`}
        to={to}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`${variants[variant]} ${
        sizes[size]
      } ${className} transition-colors flex justify-center items-center text-center focus:outline-0 ${
        widthFull ? "w-full" : ""
      }`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
