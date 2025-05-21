"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface EssentialLinkProps {
  title: string;
  link: string;
  icon: LucideIcon;
}

const EssentialLink = ({ title, link, icon: Icon }: EssentialLinkProps) => {
  const pathname = usePathname();
  const normalize = (path?: string) => (path ?? "").replace(/\/$/, "");
  const isActive = normalize(pathname) === normalize(link);

  return (
    <Link href={link} className="block my-2">
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "p-3 rounded-xl transition-colors",
            isActive ? "bg-dark" : "bg-secondary"
          )}
        >
          <Icon size={24} color={isActive ? "#3260ab" : "#fff"} />
        </div>

        <div>
          <div
            className={clsx(
              isActive
                ? "border-b-2 border-primary w-[5vmax] text-third font-bold"
                : "text-third font-bold"
            )}
          >
            {title}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EssentialLink;
