"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader className="text-left">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="py-4">{children}</div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        {/* Collapsed sidebar with icons */}
        <aside
          className={cn(
            "hidden lg:flex h-screen flex-col border-r bg-background transition-all duration-300",
            isDesktopOpen ? "w-[300px]" : "w-[60px]"
          )}
        >
          <div className="p-4 flex justify-between items-center">
            <h2 className={cn("font-semibold transition-opacity", isDesktopOpen ? "opacity-100" : "opacity-0 hidden")}>
              Navigation
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setIsDesktopOpen(!isDesktopOpen)} className="h-8 w-8">
              {isDesktopOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              <span className="sr-only">{isDesktopOpen ? "Collapse sidebar" : "Expand sidebar"}</span>
            </Button>
          </div>
          <div className={cn("py-4", !isDesktopOpen && "items-center")}>
            {isDesktopOpen ? (
              children
            ) : (
              <div className="flex flex-col items-center space-y-2">
                {/* You can add icon-only versions of your navigation here */}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
