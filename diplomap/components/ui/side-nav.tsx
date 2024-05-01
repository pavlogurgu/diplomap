"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDENAV_ITEMS } from "@/constants";
import { SideNavItem } from "@/types";
import { Icon } from "@iconify/react";

const SideNav = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-black border-gray-600"
          : "bg-white border-zinc-200"
      } md:w-60 h-screen flex-1 fixed border-r hidden md:flex`}
    >
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/"
          className={`${
            theme === "dark" ? "border-gray-600" : "border-zinc-200"
          } flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b h-12 w-full`}
        >
          <span className="diplomap-logo text-4xl text-black-800 ">
            diplomap
          </span>
        </Link>

        <div className="flex flex-col space-y-2  md:px-6 ">
          {SIDENAV_ITEMS.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`${
              theme === "dark" ? "hover:bg-gray-600" : "hover:bg-zinc-100"
            } flex flex-row items-center p-2 rounded-lg w-full justify-between ${
              pathname.includes(item.path) && theme === "dark"
                ? "bg-gray-600"
                : "bg-zinc-100"
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-xl  flex">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? "font-bold" : ""
                    }`}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`${
            theme === "dark"
              ? `flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-gray-800 ${
                  item.path === pathname ? "bg-gray-800" : ""
                }`
              : `flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${
                  item.path === pathname ? "bg-zinc-100" : ""
                }`
          } `}
        >
          {item.icon}
          <span className="font-semibold text-xl flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
