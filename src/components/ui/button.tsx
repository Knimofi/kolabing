import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Update this for your color and font choices!
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg uppercase font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-darker-grotesque [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-neutral-800 border-2 border-black",
        outline: "border-2 border-black bg-transparent text-black hover:bg-black hover:text-white",
        yellow: "border-2 border-[#FFD861] text-[#FFD861] bg-transparent hover:bg-[#FFD861] hover:text-black",
        ghost: "bg-transparent text-black hover:bg-neutral-100",
        link: "text-black underline-offset-4 hover:underline border-none bg-transparent",
      },
      size: {
        default: "h-11 px-8 py-4",
        sm: "h-9 rounded-md px-4 py-2 text-base",
        lg: "h-14 px-12 py-6 text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  },
);

// Make sure to extend your Tailwind config to include "font-darker-grotesque" with the proper font stack!

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
