"use client";
import React, { useState } from "react";
import { ViewType } from "../types";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import {
  ShoppingBag,
  Package,
  Sparkles,
  X,
  Shield,
  Layers,
  LogOut,
  Film,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import type { User } from "@supabase/supabase-js";
import { signOut } from "../lib/supabase";
import { SidebarDemo } from "./SidebarDemo";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  onSelectCategory: (category: string) => void;
  onOpenAccount?: () => void;
  user?: User | null;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  setCurrentView,
  onSelectCategory,
  onOpenAccount,
  user,
}) => {
  const [open, setOpen] = useState(true);
  const [showDemoModal, setShowDemoModal] = useState(false);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    {
      label: "System Index",
      badge: "01",
      active: currentView === "home",
      icon: (
        <IconBrandTabler
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            currentView === "home" ? "text-white" : "text-neutral-400 group-hover/sidebar:text-white"
          )}
        />
      ),
      onClick: () => {
        setCurrentView("home");
        onClose();
      },
    },
    {
      label: "Collections Catalog",
      badge: "02",
      active: currentView === "collection",
      icon: (
        <ShoppingBag
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            currentView === "collection" ? "text-white" : "text-neutral-400 group-hover/sidebar:text-white"
          )}
        />
      ),
      onClick: () => {
        setCurrentView("collection");
        onClose();
      },
    },
    {
      label: "Community Archive",
      badge: "03",
      active: currentView === "community",
      icon: (
        <Sparkles
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            currentView === "community" ? "text-white" : "text-neutral-400 group-hover/sidebar:text-white"
          )}
        />
      ),
      onClick: () => {
        setCurrentView("community");
        onClose();
      },
    },
    {
      label: "Orders & Telemetry",
      badge: "04",
      active: currentView === "my-orders",
      icon: (
        <Package
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            currentView === "my-orders" ? "text-white" : "text-neutral-400 group-hover/sidebar:text-white"
          )}
        />
      ),
      onClick: () => {
        setCurrentView("my-orders");
        onClose();
      },
    },
    {
      label: "Rider Identity",
      badge: user ? "VERIFIED" : "AUTH",
      active: false,
      icon: (
        <IconUserBolt
          className="h-5 w-5 shrink-0 text-neutral-400 group-hover/sidebar:text-white transition-colors"
        />
      ),
      onClick: () => {
        onClose();
        if (onOpenAccount) onOpenAccount();
      },
    },
    {
      label: "Terminal Settings",
      badge: "SYS",
      active: false,
      icon: (
        <IconSettings
          className="h-5 w-5 shrink-0 text-neutral-400 group-hover/sidebar:text-white transition-colors"
        />
      ),
      onClick: () => {
        onClose();
        if (onOpenAccount) onOpenAccount();
      },
    },
  ];

  const userAvatar = user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";
  const userDisplayName = user?.user_metadata?.full_name || (user?.email ? user.email.split("@")[0].toUpperCase() : "GUEST RIDER #048");

  return (
    <>
      <AnimatePresence>
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md transition-opacity"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="h-full flex flex-col w-fit max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                "h-full flex flex-col border-r border-[#27272a] bg-[#0c0c0e] text-white shadow-2xl overflow-hidden select-none"
              )}
            >
              <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-6 bg-[#0c0c0e] dark:bg-[#0c0c0e] text-white border-r border-[#27272a] h-full">
                  <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto hide-scrollbar">
                    {/* Header Logo */}
                    <div className="flex items-center justify-between pb-4 border-b border-[#202024] mb-4">
                      {open ? (
                        <Logo onClose={onClose} />
                      ) : (
                        <div className="w-full flex justify-center">
                          <LogoIcon />
                        </div>
                      )}
                    </div>

                    {/* Telemetry Status badge */}
                    {open && (
                      <div className="mb-3 px-3 py-2 rounded bg-[#131316] border border-[#202026] flex items-center justify-between text-[10px] font-mono text-[#888]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                          <span className="text-[#bbb]">STATUS: ONLINE</span>
                        </div>
                        <span className="text-[#666]">AES-256</span>
                      </div>
                    )}

                    {/* Navigation Links using SidebarLink */}
                    <div className="flex flex-col gap-1">
                      {navLinks.map((link, idx) => (
                        <SidebarLink
                          key={idx}
                          link={link}
                          className={cn(
                            "hover:bg-[#18181c] text-neutral-300 hover:text-white transition-all font-body font-medium",
                            link.active && "bg-[#18181c] text-white border-l-2 border-white pl-2 font-semibold"
                          )}
                        />
                      ))}
                    </div>

                    {/* Category Quick Filter Sub-menu */}
                    {open && (
                      <div className="mt-5 pt-4 border-t border-[#1e1e24] px-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-body uppercase tracking-wider text-[#8e8e98] font-semibold">
                            COLLECTIONS INDEX
                          </span>
                          <span className="text-[10px] font-body text-[#666]">4 TIERS</span>
                        </div>
                        <div className="flex flex-col gap-1 font-body text-xs">
                          {["ALL", "HOODIES", "TEES", "SHIRTS", "KNITS"].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => {
                                onSelectCategory(cat);
                                setCurrentView("collection");
                                onClose();
                              }}
                              className="text-left px-2.5 py-1.5 rounded-none text-neutral-400 hover:text-white hover:bg-[#16161a] transition-colors flex items-center justify-between cursor-pointer group"
                            >
                              <span className="group-hover:translate-x-1 transition-transform">
                                — {cat}
                              </span>
                              <span className="text-[10px] text-[#555] group-hover:text-white">
                                ↗
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Aceternity Demo Preview Trigger */}
                    {open && (
                      <div className="mt-4 pt-3 border-t border-[#1e1e24] px-1">
                        <button
                          onClick={() => setShowDemoModal(true)}
                          className="w-full flex items-center justify-between p-2 rounded-none bg-[#111115] hover:bg-[#18181f] border border-[#22222a] text-xs font-body font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-[#9e1b24]" />
                            <span className="tracking-wide uppercase text-[11px]">SIDEBAR SYSTEM VIEW</span>
                          </div>
                          <span className="text-[10px] text-[#888]">EXPAND</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer User Profile Section */}
                  <div className="pt-4 border-t border-[#202024] flex flex-col gap-2">
                    <SidebarLink
                      link={{
                        label: userDisplayName,
                        href: "#",
                        icon: (
                          <img
                            src={userAvatar}
                            className="h-7 w-7 shrink-0 rounded-full object-cover border border-[#444]"
                            width={50}
                            height={50}
                            alt="User Avatar"
                          />
                        ),
                        onClick: () => {
                          onClose();
                          if (onOpenAccount) onOpenAccount();
                        },
                      }}
                      className="hover:bg-[#18181c]"
                    />

                    {user && open && (
                      <button
                        onClick={handleSignOut}
                        className="w-full mt-1 px-3 py-1.5 rounded text-left font-mono text-xs text-red-400/80 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <IconArrowLeft className="w-4 h-4" />
                        <span>DISCONNECT SESSION</span>
                      </button>
                    )}

                    {open && (
                      <div className="px-2 pt-2 text-[9px] font-mono text-[#555] flex justify-between items-center">
                        <span>UNDERGROUNDZ SYNDICATE</span>
                        <span>v2.4.0</span>
                      </div>
                    )}
                  </div>
                </SidebarBody>
              </Sidebar>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Standalone Sidebar Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-[#111114] border border-[#333] rounded-xl overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#16161b]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00ff88]" />
                <span className="font-mono text-xs text-white uppercase tracking-wider font-bold">
                  Aceternity UI Sidebar Demo
                </span>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <SidebarDemo />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const Logo = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="relative z-20 flex items-center justify-between py-1 text-sm font-normal text-white w-full">
      <div className="flex items-center space-x-2.5">
        <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-display font-extrabold tracking-wider whitespace-pre text-white text-base"
        >
          UNDERGROUNDZ
        </motion.span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
          title="Close Navigation"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
    </div>
  );
};
