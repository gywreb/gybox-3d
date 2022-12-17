import React from "react";
import { classNames } from "../../lib/helper";

const Button = ({ children, className = "", ...rest }) => {
  return (
    <button
      {...rest}
      className={classNames(
        "inline-flex items-center font-bold hover:text-primary-500 animated-underline",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
