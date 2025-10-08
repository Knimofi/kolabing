import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

export type ButtonVariant = "outline" | "filled" | "ghost" | "link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  borderColor?: string;
  textColor?: string;
  backgroundColor?: string;
}

const getVariantStyles = ({
  variant = "outline",
  borderColor = "#000",
  textColor = "#000",
  backgroundColor = "transparent",
}: {
  variant?: ButtonVariant;
  borderColor?: string;
  textColor?: string;
  backgroundColor?: string;
}) => {
  switch (variant) {
    case "filled":
      return {
        border: `2px solid ${borderColor}`,
        color: "#fff",
        background: borderColor,
      };
    case "ghost":
      return {
        border: "none",
        color: textColor,
        background: "transparent",
      };
    case "link":
      return {
        border: "none",
        color: borderColor,
        background: "transparent",
        textDecoration: "underline",
        padding: 0,
      };
    case "outline":
    default:
      return {
        border: `2px solid ${borderColor}`,
        color: textColor,
        background: backgroundColor,
      };
  }
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      asChild = false,
      variant = "outline",
      borderColor = "#000",
      textColor = "#000",
      backgroundColor = "transparent",
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const variantStyles = getVariantStyles({ variant, borderColor, textColor, backgroundColor });
    return (
      <Comp
        ref={ref}
        className={`inline-flex items-center justify-center px-12 py-5 whitespace-nowrap rounded-md text-lg uppercase transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium ${className || ""}`}
        style={{
          fontFamily: "Darker Grotesque, sans-serif",
          letterSpacing: "1px",
          ...variantStyles,
          ...style,
        }}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button };
