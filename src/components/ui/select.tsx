"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  className?: string
}

function Select({
  options,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  placeholder = "Seçiniz...",
  label,
  error,
  disabled = false,
  className,
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const selectRef = React.useRef<HTMLDivElement>(null)

  const isControlled = controlledValue !== undefined
  const selectedValue = isControlled ? controlledValue : uncontrolledValue
  const selectedLabel = options.find((o) => o.value === selectedValue)?.label || ""

  const handleSelect = (value: string) => {
    if (!isControlled) {
      setUncontrolledValue(value)
    }
    onValueChange?.(value)
    setOpen(false)
  }

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectId = React.useId()

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
        </label>
      )}
      <div ref={selectRef} className="relative">
        <button
          id={selectId}
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors duration-200",
            "placeholder:text-neutral-400",
            "focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-400",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500",
            "dark:focus:ring-neutral-300/20 dark:focus:border-neutral-600",
            error && "border-red-500 focus:ring-red-500/20 dark:border-red-500",
            className
          )}
        >
          <span
            className={cn(
              "truncate",
              !selectedLabel && "text-neutral-400 dark:text-neutral-500"
            )}
          >
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950 animate-in fade-in-0 zoom-in-95">
            <div className="max-h-60 overflow-auto p-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-150",
                    "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    selectedValue === option.value &&
                      "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50",
                    "cursor-pointer"
                  )}
                >
                  <span className="flex-1 text-left truncate">{option.label}</span>
                  {selectedValue === option.value && (
                    <Check className="h-4 w-4 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

export { Select }
