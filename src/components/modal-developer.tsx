"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Code2, Briefcase, User2 } from "lucide-react";
import { motion } from "framer-motion";

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal = ({ isOpen, onClose }: DeveloperModalProps) => {
  const skills = ["Next.js 14", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Framer Motion", "Node.js"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background border-border overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -ml-16 -mb-16" />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <User2 className="w-6 h-6 text-primary" />
            Prince Parmar
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/80 pt-2">
            Full-Stack Developer specializing in premium web experiences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4 relative z-10">
          <section className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge variant="secondary" className="px-3 py-1 bg-secondary/10 text-secondary border-secondary/20">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Experience
            </h4>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Passionate about building scalable applications with focus on UI/UX and performance. 
              Experienced in E-commerce, SaaS, and custom web solutions.
            </p>
          </section>

          <Button 
            asChild 
            className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold h-12 shadow-lg shadow-[#25D366]/20 group"
          >
            <a 
              href="https://wa.me/your-whatsapp-number" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
