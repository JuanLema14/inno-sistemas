'use client'

import * as React from "react"
import * as RadixPopover from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"

const Popover = RadixPopover.Root

const PopoverTrigger = RadixPopover.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Content>,
  React.ComponentPropsWithoutRef<typeof RadixPopover.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <RadixPopover.Portal>
    <RadixPopover.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        className
      )}
      {...props}
    />
  </RadixPopover.Portal>
))
PopoverContent.displayName = RadixPopover.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
