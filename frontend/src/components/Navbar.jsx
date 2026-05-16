import React, { useContext } from 'react';
import { Menu, Bell, User, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const firstName = user?.name ? user.name.split(' ')[0] : 'Member';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 sm:px-8 bg-white/70 backdrop-blur-md border-b border-slate-200/60 shrink-0 shadow-sm transition-all">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-xl lg:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex items-center gap-3 max-w-md w-full px-4 py-2.5 bg-slate-100/50 rounded-2xl border border-slate-200 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search tasks, projects, or team members..." 
            className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors group">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{user?.name || 'Profile'}</span>
            <span className="text-xs font-bold text-slate-400 capitalize leading-tight mt-0.5">{user?.role || 'Member'}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-sm border-2 border-white ring-2 ring-transparent group-hover:ring-blue-200 transition-all duration-300">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
