import { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { Bell, User, LogOut, ChevronDown, Shield, Briefcase, UserCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'manager':
        return <Briefcase className="w-4 h-4 text-amber-450" />;
      default:
        return <UserCheck className="w-4 h-4 text-rose-400" />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'manager':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-450';
      default:
        return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
    }
  };

  return (
    <header className="h-16 border-b border-[#2d211f] bg-[#1c1412]/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand logo / title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-mocha-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-rose-500/20">
          A
        </div>
        <div>
          <h1 className="text-md font-semibold text-stone-100 leading-tight">Antigravity Suite</h1>
          <p className="text-xs text-stone-400 font-medium">Enterprise Operations Platform</p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-stone-400 hover:bg-stone-850 hover:text-stone-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#140e0d]" />
        </button>

        {/* Vertical Separator */}
        <div className="h-6 w-px bg-[#2d211f]" />

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-stone-850 border border-transparent hover:border-stone-800/80 transition-all text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500/10 to-mocha-500/10 border border-rose-500/20 flex items-center justify-center text-rose-350 font-bold text-sm">
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="hidden md:block">
              <div className="text-sm font-medium text-stone-200 leading-none">{user?.full_name}</div>
              <div className={`inline-flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded border mt-1 ${getRoleBadgeClass(user?.role)}`}>
                {getRoleIcon(user?.role)}
                {user?.role}
              </div>
            </div>
            
            <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay to close on outside click */}
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1c1412] border border-[#2d211f] shadow-2xl p-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-[#2d211f]/50 mb-1">
                  <p className="text-xs text-stone-450 font-medium">Signed in as</p>
                  <p className="text-sm font-semibold text-stone-200 truncate">{user?.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    // Add interactive navigation to Settings if wanted
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-stone-300 hover:bg-stone-850 hover:text-stone-100 transition-colors text-sm flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-rose-450" />
                  My Profile
                </button>
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
