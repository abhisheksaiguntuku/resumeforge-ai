import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30",
        success: "border-transparent bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30",
        warning: "border-transparent bg-amber-600/20 text-amber-400 hover:bg-amber-600/30",
        error: "border-transparent bg-red-600/20 text-red-400 hover:bg-red-600/30",
        info: "border-transparent bg-blue-600/20 text-blue-400 hover:bg-blue-600/30",
        extracted: "border-transparent bg-purple-600/20 text-purple-400 hover:bg-purple-600/30",
        verified: "border-transparent bg-green-600/20 text-green-400 hover:bg-green-600/30",
        conflict: "border-transparent bg-orange-600/20 text-orange-400 hover:bg-orange-600/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
