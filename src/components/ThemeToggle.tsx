"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[104px] h-9 bg-secondary/30 rounded-full border border-border/40 animate-pulse" />
    );
  }

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Laptop, label: "System" },
  ];

  return (
    <div className="relative flex items-center bg-secondary/30 border border-border/60 p-0.5 rounded-full w-[108px] h-9 select-none">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;

        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            title={`Set theme to ${opt.label}`}
            className={cn(
              "relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {isActive && (
              <motion.div
                layoutId="theme-active-indicator"
                className="absolute inset-0 bg-background border border-border/80 shadow-sm rounded-full -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
