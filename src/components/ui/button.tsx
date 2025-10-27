import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "ghost" | "destructive";

type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-glow",
  secondary: "bg-card/70 text-foreground border border-white/10",
  ghost: "bg-transparent text-foreground hover:bg-white/10",
  destructive: "bg-red-500/90 text-white hover:bg-red-600"
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
  icon: "h-10 w-10 flex items-center justify-center"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", loading = false, children, ...props }, ref) => (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      <span className={cn("flex items-center gap-2", loading && "opacity-70")}>{children}</span>
      {loading ? (
        <motion.span
          className="absolute inset-0 grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </motion.span>
      ) : null}
    </motion.button>
  )
);

Button.displayName = "Button";
