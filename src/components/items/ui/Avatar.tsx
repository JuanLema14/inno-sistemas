import * as React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image";

export function Avatar({
  src,
  alt,
  className,
}: {
  src?: string
  alt?: string
  className?: string
}) {
  return (
    <div className={cn("relative h-10 w-10 rounded-full overflow-hidden bg-muted", className)}>
      {src ? (
        <Image src={src} alt={alt || "avatar"} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          {alt?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}
    </div>
  )
}
