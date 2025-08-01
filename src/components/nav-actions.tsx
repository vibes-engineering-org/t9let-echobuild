"use client";

import * as React from "react";
import { Home, MoreHorizontal, User, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import sdk from "@farcaster/miniapp-sdk";

import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { PROJECT_CREATOR } from "~/lib/constants";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";

type NavItem = {
  label: string;
  icon: LucideIcon | (() => React.JSX.Element);
} & (
  | {
      href: string;
      action?: never;
    }
  | {
      href?: never;
      action: () => void;
    }
);

const data: NavItem[][] = [
  [
    {
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      label: `Made by ${PROJECT_CREATOR}`,
      icon: User,
      href: `https://farcaster.xyz/${PROJECT_CREATOR}`,
    },
    {
      label: "Built with Vibes",
      icon: () => (
        <img
          src="https://vibes.engineering/icon.png"
          className="h-5 w-5"
          alt="Vibes"
        />
      ),
      href: "https://vibes.engineering",
    },
  ],
  [
    {
      label: "Close",
      icon: X,
      action: () => sdk.actions.close(),
    },
  ],
];

export function NavActions() {
  const { isMiniApp } = useMiniAppSdk();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2 text-sm">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-neutral-800"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton
                            onClick={() => {
                              if (item.href) {
                                if (isMiniApp) {
                                  sdk.actions.openUrl(item.href);
                                } else {
                                  router.push(item.href);
                                }
                              } else if (item.action) {
                                item.action();
                              }
                              setIsOpen(false);
                            }}
                          >
                            <item.icon /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
