import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = ({
  children,
  ...props
}: DialogPrimitive.DialogContentProps) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay asChild>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    </DialogPrimitive.Overlay>
    <DialogPrimitive.Content asChild {...props}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className={cn(
          "glass-panel fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 p-6 shadow-glass",
          "bg-card/90"
        )}
      >
        <DialogPrimitive.Close asChild>
          <button
            className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/10 p-2 text-sm"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogPrimitive.Close>
        {children}
      </motion.div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

export const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={cn("mb-6 space-y-2", className)} />
);

export const DialogTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h2 {...props} className={cn("text-2xl font-semibold", className)} />
);

export const DialogDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p {...props} className={cn("text-sm text-foreground/70", className)} />
);
