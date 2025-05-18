
import { NavLink } from "react-router-dom";
import { Home, User, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  return (
    <div className="h-screen bg-white border-r border-border flex flex-col w-64 fixed">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full aurum-gradient flex items-center justify-center text-white font-bold">
            N
          </div>
          <h1 className="text-xl font-bold text-primary">Notica</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          <NavItem to="/" icon={<Home size={18} />} label="Dashboard" />
          <NavItem to="/patients" icon={<User size={18} />} label="Patients" />
          <NavItem to="/consultation/new" icon={<Plus size={18} />} label="New Consultation" />
        </div>
      </nav>
      
      <div className="p-4 border-t border-border">
        <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
      </div>
    </div>
  );
};

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-white"
            : "text-foreground hover:bg-accent"
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};

export default Sidebar;
