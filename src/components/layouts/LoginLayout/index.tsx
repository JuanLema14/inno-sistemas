import { ReactNode } from "react";

interface LoginLayoutProps {
  children: ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="min-h-screen bg-fondo flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
        {children}
      </div>
    </div>
  );
}
