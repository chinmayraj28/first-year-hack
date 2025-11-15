"use client"

import type React from "react"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "primary" | "secondary" | "ghost"
  size?: "default" | "lg"
  onClick?: () => void
  disabled?: boolean
}

export function MagneticButton({
  children,
  className = "",
  variant = "primary",
  size = "default",
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const variants = {
    primary:
      "bg-foreground/95 text-background hover:bg-foreground backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-foreground/5 text-foreground hover:bg-foreground/10 backdrop-blur-xl border border-foreground/10 hover:border-foreground/20",
    ghost: "bg-transparent text-foreground hover:bg-foreground/5 backdrop-blur-sm",
  }

  const sizes = {
    default: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-full font-medium
        transition-transform transition-colors duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}
