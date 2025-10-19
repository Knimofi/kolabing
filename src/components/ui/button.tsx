import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-white text-[#232323] border border-[#EBEBEB] rounded-lg shadow-[0_1.5px_3px_0_rgba(55,73,87,0.08)] hover:bg-[#f9f9f9]",
        primary: "bg-[#FFD861] text-white font-bold rounded-lg shadow-[0_1.5px_4px_0_rgba(55,73,87,0.11)] hover:opacity-90 border-none",
        secondary: "bg-white text-[#232323] border border-[#EBEBEB] rounded-lg shadow-[0_1.5px_3px_0_rgba(55,73,87,0.08)] hover:bg-[#f9f9f9]",
        outline: "bg-transparent border border-[#EBEBEB] text-[#232323] rounded-lg hover:bg-[#F7F8FA]",
        ghost: "bg-transparent text-[#232323] hover:bg-[#F7F8FA] rounded-lg",
        destructive: "bg-[#EF4444] text-white rounded-lg shadow-sm hover:bg-[#DC2626]",
        link: "text-[#232323] underline-offset-4 hover:underline",
        selected: "bg-[#FFD861] text-black border border-[#FFD861] rounded-none shadow-none",
        unselected: "bg-white text-black border border-[#D9D9D9] rounded-none shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
