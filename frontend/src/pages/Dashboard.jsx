import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ClipboardList, Clock, CheckCircle2, AlertOctagon, Loader2, ArrowRight, MoreHorizontal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/tasks')
      ]);
      setStats(statsRes.data);
      const sortedTasks = tasksRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentTasks(sortedTasks.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data', err);
      setError(err.message || 'Connection to server failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse tracking-wide">SYNCING WORKSPACE</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-6 text-center px-4 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100 shadow-sm">
          <AlertOctagon className="w-10 h-10 text-rose-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Syncing Failed</h2>
          <p className="text-slate-500 mt-2 font-medium max-w-sm">
            We couldn't reach the backend server. {error}. Ensure your Node server is running on port 5000.
          </p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { title: 'Total Tasks', value: stats.totalTasks, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', shadow: 'shadow-blue-500/10' },
    { title: 'In Progress', value: stats.tasksByStatus['In Progress'] || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', shadow: 'shadow-amber-500/10' },
    { title: 'Completed', value: stats.completedTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', shadow: 'shadow-emerald-500/10' },
    { title: 'Overdue', value: stats.overdueTasks, icon: AlertOctagon, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', shadow: 'shadow-rose-500/10' },
  ];

  const pieData = [
    { name: 'Todo', value: stats.tasksByStatus['Todo'] || 0, color: '#94a3b8' },
    { name: 'In Progress', value: stats.tasksByStatus['In Progress'] || 0, color: '#f59e0b' },
    { name: 'Done', value: stats.tasksByStatus['Done'] || 0, color: '#10b981' },
  ].filter(item => item.value > 0);

  if (pieData.length === 0) {
    pieData.push({ name: 'No Tasks', value: 1, color: '#f1f5f9' });
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base">Track your team's overall progress and recent activity.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((item) => (
          <div key={item.title} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-50 blur-2xl group-hover:blur-3xl transition-all duration-500 ${item.bg}`}></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`p-3.5 rounded-2xl ${item.bg} border ${item.border} ${item.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{item.title}</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black text-slate-800 tracking-tight">{item.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts & Tasks Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Distribution Chart */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 flex flex-col hover:shadow-md transition-shadow duration-300">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-slate-800 tracking-tight">Status Overview</h3>
             <button className="text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal className="w-5 h-5"/></button>
           </div>
           
           <div className="flex-1 w-full min-h-[250px] relative flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData}
                   cx="50%"
                   cy="50%"
                   innerRadius={75}
                   outerRadius={100}
                   paddingAngle={4}
                   dataKey="value"
                   stroke="none"
                   cornerRadius={6}
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm" />
                   ))}
                 </Pie>
                 <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', fontWeight: 'bold', padding: '12px 20px' }}
                   itemStyle={{ color: '#1e293b' }}
                 />
                 <Legend verticalAlign="bottom" height={40} iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }} />
               </PieChart>
             </ResponsiveContainer>
             
             {/* Center Text */}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
               <span className="text-4xl font-black text-slate-800">{stats.totalTasks}</span>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
             </div>
           </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 lg:col-span-2 flex flex-col hover:shadow-md transition-shadow duration-300">
           <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-xl font-bold text-slate-800 tracking-tight">Recent Activity</h3>
               <p className="text-sm font-medium text-slate-500 mt-1">Latest tasks added to your workspace.</p>
             </div>
             <button className="hidden sm:flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors">
               View All <ArrowRight className="w-4 h-4" />
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto">
             {recentTasks.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <CheckCircle2 className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="font-bold text-slate-600">No recent tasks</p>
                  <p className="text-sm mt-1">Start collaborating to see activity here.</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {recentTasks.map(task => (
                   <div key={task._id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-0.5 group">
                     <div className="flex items-center gap-5">
                       <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                         <div className={`w-3.5 h-3.5 rounded-full ${task.status === 'Done' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : task.status === 'In Progress' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-slate-400'}`}></div>
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-blue-600 transition-colors">{task.title}</h4>
                         <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
                           <span className="truncate max-w-[120px] sm:max-w-none">{task.project?.title || 'Independent Task'}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                           <span className="text-slate-400">{new Date(task.createdAt).toLocaleDateString()}</span>
                         </p>
                       </div>
                     </div>
                     <div className="flex items-center gap-4 shrink-0">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider ${task.priority === 'High' ? 'text-red-700 bg-red-100' : task.priority === 'Medium' ? 'text-amber-700 bg-amber-100' : 'text-emerald-700 bg-emerald-100'}`}>
                          {task.priority}
                        </span>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
