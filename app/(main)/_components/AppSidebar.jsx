"use client";

import Image from "next/image";
import NextLink from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SideBarOptions } from "@/app/services/constants";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center mt-5">
        <Image
          src="/logo.jpg"
          width={200}
          height={100}
          className="w-[150px]"
          alt="Logo"
        />
        <NextLink href="/dashboard/create-interview" passHref>
          <Button className="w-full mt-5 cursor-pointer" as="a">
            <Plus className="mr-2" /> Create New Interview
          </Button>
        </NextLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option, index) => (
              <SidebarMenuItem key={index} className="p-1">
                <SidebarMenuButton
                  asChild
                  className={`p-1 ${path === option.path ? "bg-blue-50" : ""}`}
                >
                  <NextLink
                    href={option.path}
                    className="flex items-center space-x-2"
                  >
                    <option.icon
                      className={`text-[16px] ${
                        path === option.path ? "text-primary" : ""
                      }`}
                    />
                    <span
                      className={`text-[16px] font-medium ${
                        path === option.path ? "text-primary" : ""
                      }`}
                    >
                      {option.name}
                    </span>
                  </NextLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
