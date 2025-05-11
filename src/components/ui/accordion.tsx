"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AccordionProps {
  className?: string
  type?: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string
  children?: React.ReactNode
}

interface AccordionItemProps {
  className?: string
  value: string
  children?: React.ReactNode
}

interface AccordionTriggerProps {
  className?: string
  children?: React.ReactNode
}

interface AccordionContentProps {
  className?: string
  children?: React.ReactNode
}

// Definisce il contesto dell'Accordion
const AccordionContext = React.createContext<{
  expanded: string[]
  toggle: (value: string) => void
}>({
  expanded: [],
  toggle: () => {},
})

// Definisce il contesto dell'AccordionItem
const AccordionItemContext = React.createContext<string>("")

export function Accordion({
  className,
  type = "single",
  collapsible = false,
  defaultValue,
  children,
}: AccordionProps) {
  const [expanded, setExpanded] = React.useState<string[]>(defaultValue ? [defaultValue] : [])

  const toggle = React.useCallback((value: string) => {
    if (type === "single") {
      if (expanded.includes(value)) {
        setExpanded(collapsible ? [] : [value])
      } else {
        setExpanded([value])
      }
    } else {
      if (expanded.includes(value)) {
        setExpanded(expanded.filter((item) => item !== value))
      } else {
        setExpanded([...expanded, value])
      }
    }
  }, [expanded, type, collapsible])

  return (
    <AccordionContext.Provider value={{ expanded, toggle }}>
      <div className={cn("space-y-1", className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

export function AccordionItem({ className, value, children }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div
        data-state={useAccordionItemState(value) ? "open" : "closed"}
        className={cn("border-b", className)}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

// Hook di utilità per verificare lo stato di espansione di un item
function useAccordionItemState(value: string) {
  const { expanded } = React.useContext(AccordionContext)
  return expanded.includes(value)
}

export function AccordionTrigger({ className, children }: AccordionTriggerProps) {
  const { toggle } = React.useContext(AccordionContext)
  const value = React.useContext(AccordionItemContext)
  const isExpanded = useAccordionItemState(value)

  return (
    <button
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline",
        className
      )}
      onClick={() => toggle(value)}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
          isExpanded ? "rotate-180" : ""
        }`}
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  )
}

export function AccordionContent({ className, children }: AccordionContentProps) {
  const value = React.useContext(AccordionItemContext)
  const isExpanded = useAccordionItemState(value)

  return (
    <div
      className={cn(
        "overflow-hidden transition-all",
        isExpanded ? "h-auto pb-4 pt-0" : "h-0",
        className
      )}
    >
      {isExpanded && children}
    </div>
  )
}