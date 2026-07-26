import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  label?: string
  iconPrefix?: React.ReactNode
  iconSuffix?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, iconPrefix, iconSuffix, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {iconPrefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              {iconPrefix}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-[#2a2a3a] bg-[#12121a] px-3 py-2 text-sm text-slate-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus-visible:ring-red-500",
              iconPrefix && "pl-10",
              iconSuffix && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {iconSuffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              {iconSuffix}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
