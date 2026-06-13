"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange>
        {children}
        <Toaster position="bottom-right" richColors />
      </ThemeProvider>
    </SessionProvider>
  );
};
