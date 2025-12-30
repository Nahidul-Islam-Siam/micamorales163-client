// components/dashboard/StatCards.tsx

import { useGetAnalyticsOverviewQuery } from "@/redux/service/Analytics/analyticsApi";
import { 
  DollarSign, 
  WalletCards, 
  Users,
  UserCheck
} from "lucide-react";

export default function StatCards() {
  const { data: analyticsData, isLoading } = useGetAnalyticsOverviewQuery();

  const {
    totalRevenue = 0,
    activeUsers = 0,
    complatePayments = 0,
    totalSubscriptions = 0,
  } = analyticsData?.data || {};

  const formatRevenue = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const renderStat = (value: number | string) => {
    if (isLoading) return <span className="h-6 w-20 bg-gray-200 animate-pulse rounded"></span>;
    return <span className="text-3xl text-[#0D0D0D] md:text-2xl font-bold">{value}</span>;
  };

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-6 mb-10 w-full font-inter">
      {/* 1. Total Revenue */}
      <div className="p-6 min-w-[250px] flex-1 border border-[#F9EEE4] bg-[#FFE2E5] shadow-[0_2px_8px_rgba(0,0,0,0.10)] rounded-xl">
        <div className="space-y-2">
          <span className="text-[#333333] font-normal text-sm md:text-base">Total Revenue</span>
          <div className="flex justify-between items-center">
            {renderStat(formatRevenue(totalRevenue))}
            <div className="bg-[#328736] rounded-full w-14 h-14 flex items-center justify-center">
              <DollarSign className="text-white w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Completed Payments */}
      <div className="p-6 min-w-[250px] flex-1 border border-[#F9EEE4] bg-[#DCFCE7] shadow-[0_2px_8px_rgba(0,0,0,0.10)] rounded-xl">
        <div className="space-y-2">
          <span className="text-[#333333] font-normal text-sm md:text-base">Completed Payments</span>
          <div className="flex justify-between items-center">
            {renderStat(complatePayments)}
            <div className="bg-[#E57931] rounded-full w-14 h-14 flex items-center justify-center">
              <WalletCards className="text-white w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Active Users */}
      <div className="p-6 min-w-[250px] flex-1 border border-[#E0F2FE] bg-[#E0F2FE] shadow-[0_2px_8px_rgba(0,0,0,0.10)] rounded-xl">
        <div className="space-y-2">
          <span className="text-[#333333] font-normal text-sm md:text-base">Active Users</span>
          <div className="flex justify-between items-center">
            {renderStat(activeUsers)}
            <div className="bg-[#03A9F4] rounded-full w-14 h-14 flex items-center justify-center">
              <UserCheck className="text-white w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Total Subscriptions */}
      <div className="p-6 min-w-[250px] flex-1 border border-[#F3E8FF] bg-[#F3E8FF] shadow-[0_2px_8px_rgba(0,0,0,0.10)] rounded-xl">
        <div className="space-y-2">
          <span className="text-[#333333] font-normal text-sm md:text-base">Total Subscriptions</span>
          <div className="flex justify-between items-center">
            {renderStat(totalSubscriptions)}
            <div className="bg-[#1C2A47] rounded-full w-14 h-14 flex items-center justify-center">
              <Users className="text-white w-7 h-7" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}