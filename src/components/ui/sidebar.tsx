"use client";
import { cn } from "../../lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

export interface Links {
  label: string;
  href?: string;
  icon: React.JSX.Element | React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  badge?: string | number;
  active?: boolean;
}

export interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as any)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "64px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
      )}
      {...(props as any)}
    >
      <div className="flex justify-end z-20 w-full">
        <Menu
          className="text-neutral-800 dark:text-neutral-200 cursor-pointer w-5 h-5"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-8 z-[100] flex flex-col justify-between",
              className
            )}
          >
            <div
              className="absolute right-6 top-6 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer p-2 hover:opacity-70 transition-opacity"
              onClick={() => setOpen(!open)}
            >
              <X className="w-6 h-6" />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  [key: string]: any;
}) => {
  const { open, animate } = useSidebar();
  return (
    <a
      href={link.href || "#"}
      onClick={(e) => {
        if (link.onClick) {
          e.preventDefault();
          link.onClick(e);
        }
      }}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-2.5 px-2 rounded-md hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-200",
        link.active && "bg-neutral-200/80 dark:bg-neutral-700/80 font-semibold text-black dark:text-white",
        className
      )}
      {...props}
    >
      <div className="shrink-0 flex items-center justify-center">
        {link.icon}
      </div>

      <motion.div
        animate={{
          display: animate ? (open ? "flex" : "none") : "flex",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="flex-1 items-center justify-between text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre overflow-hidden"
      >
        <span className="truncate">{link.label}</span>
        {link.badge !== undefined && (
          <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-300 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300">
            {link.badge}
          </span>
        )}
      </motion.div>
    </a>
  );
};
