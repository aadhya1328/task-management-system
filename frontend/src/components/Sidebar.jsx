import { NavLink } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import {
  LayoutDashboard,
  Users,
  Database,
  Settings,
  FolderLock,
  ListTodo,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  const getSidebarLinks = (role) => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'System Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
          { to: '/admin/users', label: 'User Directory', icon: <Users className="w-5 h-5" /> },
          { to: '/admin/logs', label: 'Security & Logs', icon: <FolderLock className="w-5 h-5" /> },
          { to: '/admin/db', label: 'Database Health', icon: <Database className="w-5 h-5" /> },
          { to: '/admin/settings', label: 'Global Settings', icon: <Settings className="w-5 h-5" /> }
        ];
      case 'manager':
        return [
          { to: '/manager/dashboard', label: 'Team Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
          { to: '/manager/tasks', label: 'Task Assigner', icon: <ListTodo className="w-5 h-5" /> },
          { to: '/manager/expenses', label: 'Expense Approvals', icon: <Receipt className="w-5 h-5" /> },
          { to: '/manager/performance', label: 'Performance Indicators', icon: <TrendingUp className="w-5 h-5" /> },
          { to: '/manager/settings', label: 'Team Settings', icon: <Settings className="w-5 h-5" /> }
        ];
      default: // employee
        return [
          { to: '/employee/dashboard', label: 'My Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { to: '/employee/tasks', label: 'My Task Board', icon: <ListTodo className="w-5 h-5" /> },
          { to: '/employee/expenses', label: 'Reimbursements', icon: <Receipt className="w-5 h-5" /> },
          { to: '/employee/docs', label: 'Resource Files', icon: <FileSpreadsheet className="w-5 h-5" /> },
          { to: '/employee/settings', label: 'Personal Settings', icon: <Settings className="w-5 h-5" /> }
        ];
    }
  };

  const links = getSidebarLinks(user?.role);

  return (
    <aside className="w-64 border-r border-[#2d211f] bg-[#1c1412] flex flex-col h-[calc(100vh-4rem)] sticky top-16 z-30">
      {/* User Quick Info */}
      <div className="p-5 border-b border-[#2d211f]">
        <div className="flex items-center gap-3 bg-stone-900/40 border border-[#2d211f] p-3 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-stone-200 truncate leading-none mb-1">
              {user?.full_name}
            </h4>
            <p className="text-[10px] text-rose-455 truncate uppercase tracking-wider font-extrabold">
              {user?.role} Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
        <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500 px-3 mb-2">
          Navigation
        </p>
        
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-md shadow-rose-950/20'
                  : 'text-stone-400 hover:bg-stone-850 hover:text-stone-200 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active left indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-rose-500" />
                )}
                <span className={`transition-colors duration-150 ${isActive ? 'text-rose-400' : 'text-stone-400 group-hover:text-stone-300'}`}>
                  {link.icon}
                </span>
                {link.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Action Footer */}
      <div className="p-4 border-t border-[#2d211f]">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-[#2d211f] text-sm font-medium text-stone-400 hover:bg-stone-850 hover:text-stone-200 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-450" />
          Logout System
        </button>
      </div>
    </aside>
  );
}
