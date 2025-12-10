import AdministratorSection from "@/components/Dashboard/Setting/AdministratioSection";
import ChangePassword from "@/components/Dashboard/Setting/ChangePasswordForm";
import UserProfile from "@/components/Dashboard/Setting/UserProfile";


export default function SettingsPage() {
  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <UserProfile />
        <AdministratorSection />
        <ChangePassword/>
      </div>
    </div>
  );
}
