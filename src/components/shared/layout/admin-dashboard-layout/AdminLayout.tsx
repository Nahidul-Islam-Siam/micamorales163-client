"use client";

import AdminLayout from "@/components/shared/layout/Layout";

import Link from "next/link";
import { ReactNode } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { getItem, MenuItem } from "../Layout";
import { SlCalender } from "react-icons/sl";
import { LuClipboardList } from "react-icons/lu";
import { CiSettings } from "react-icons/ci";
import { BsPeople } from "react-icons/bs";
import { RiContactsBook2Line } from "react-icons/ri";
const navItems: MenuItem[] = [
  getItem(
    <Link href="/dashboard">Dashboard</Link>,
    "/dashboard",
    <LuLayoutDashboard />
  ),
  getItem(
    <Link href="/dashboard/booking-list">Booking List</Link>,
    "/dashboard/booking-list",
<SlCalender />
  ),
  getItem(
    <Link href="/dashboard/my-listing">My Listing</Link>,
    "/dashboard/my-listing",
<LuClipboardList />
  ),
  getItem(
    <Link href="/dashboard/subscription">Subscription</Link>,
    "/dashboard/subscription",
    <LuLayoutDashboard />
  ),
  getItem(
    <Link href="/dashboard/user">User</Link>,
    "/dashboard/user",
<BsPeople />
  ),
    getItem(
    <Link href="/dashboard/contact-request">Contact Request</Link>,
    "/dashboard/contact-request",
    <RiContactsBook2Line />
  ),
      getItem(
    <Link href="/dashboard/contact-setting">Setting</Link>,
    "/dashboard/contact-setting",
    <CiSettings />
  ),
];

const SuperAdminLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default SuperAdminLayout;
