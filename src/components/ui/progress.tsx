"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  showLabel?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, showLabel, ...props }, ref) => {
    let colorClass = "bg-green-500"
    if (value < 40) colorClass = "bg-red-500"
    else if (value < 70) colorClass = "bg-orange-500"

    return (
      <div className={cn("flex flex-col space-y-1.5", className)} {...props} ref={ref}>
        {showLabel && (
          <div className="flex justify-between text-xs text-slate-400">
            <span>Progress</span>
            <span>{Math.round(value)}%</span>
          </div>
        )}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#2a2a3a]">
          <div
            className={cn("h-full w-full flex-1 transition-all duration-500 ease-in-out", colorClass)}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
