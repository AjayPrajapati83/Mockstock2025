import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'ghost'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-gray-800 hover:bg-gray-700 text-white',
      primary: 'bg-neon-blue hover:bg-neon-blue/80 text-black glow-blue',
      success: 'bg-neon-green hover:bg-neon-green/80 text-black glow-green',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      ghost: 'bg-transparent hover:bg-gray-800 text-white border border-gray-700',
    }

    return (
      <button
        className={cn(
          'px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
