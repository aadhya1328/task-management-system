import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader2, TrendingUp, CheckCircle, XCircle, FileText, Send, UserPlus, ClipboardList, Briefcase } from 'lucide-react';

export default function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Tasks state
  const [tasks, setTasks] = useState([
    { id: 101, title: "Optimize index assets caching", assignee: "Alice Smith", priority: "High", status: "In Progress" },
    { id: 102, title: "Standardize backend response structures", assignee: "Bob Johnson", priority: "Medium", status: "Pending Approval" }
  ]);
  
  // Expense items state
  const [expenses, setExpenses] = useState([]);
  
  // Form fields
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchManagerData = async () => {
    try {
      const response = await api.get('/users/manager/data');
      setData(response.data);
      setExpenses(response.data.pending_expenses);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch manager system data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchManagerData();
  }, []);

  const handleExpenseAction = (expenseId, action) => {
    // Optimistic UI state update to simulate approval/rejection
    setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    alert(`Expense Reimbursement Request #${expenseId} has been successfully ${action}d!`);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskAssignee) return;

    const newTask = {
      id: Date.now(),
      title: taskTitle,
      assignee: taskAssignee,
      priority: taskPriority,
      status: 'Assigned'
    };

    setTasks([newTask, ...tasks]);
    setTaskTitle('');
    setTaskAssignee('');
    setTaskPriority('Medium');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-12 bg-[#140e0d] min-h-screen text-stone-100">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500 mx-auto mb-4" />
          <p className="text-stone-400">Loading management data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 text-stone-100 bg-[#140e0d] min-h-screen">
      {/* Header bar */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-stone-100 to-rose-300 bg-clip-text text-transparent">Team Operations Console</h2>
        <p className="text-stone-400 text-sm">Assign work items, audit reimbursement vouchers, and monitor performance indices.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#1c1412]/50 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450 flex items-center justify-center shadow-inner">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Assigned Tasks</p>
            <p className="text-2xl font-bold text-stone-200">{data?.stats.assigned_tasks || 0}</p>
          </div>
        </div>

        <div className="bg-[#1c1412]/50 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Pending Audits</p>
            <p className="text-2xl font-bold text-stone-200">{expenses.length}</p>
          </div>
        </div>

        <div className="bg-[#1c1412]/50 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 flex items-center justify-center shadow-inner">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Team Efficiency</p>
            <p className="text-2xl font-bold text-stone-200">{data?.stats.team_efficiency || '90%'}</p>
          </div>
        </div>

        <div className="bg-[#1c1412]/50 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-350 flex items-center justify-center shadow-inner">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Active Projects</p>
            <p className="text-2xl font-bold text-stone-200">{data?.stats.active_projects || 0}</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Expenses and Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expenses list */}
          <div className="bg-[#1c1412]/40 border border-[#2d211f]/60 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-stone-100 mb-4 flex items-center gap-2">
              Expense Reimbursement Requests
              <span className="bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20 px-2.5 py-0.5 rounded-full font-mono">
                {expenses.length} Pending
              </span>
            </h3>
            
            <div className="space-y-3">
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-sm border border-dashed border-[#2d211f]/60 rounded-xl">
                  No pending expenses require your authorization.
                </div>
              ) : (
                expenses.map(exp => (
                  <div key={exp.id} className="p-4 bg-[#140e0d] border border-[#2d211f]/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#1c1412] border border-[#2d211f]/60 text-stone-300">
                          #{exp.id}
                        </span>
                        <span className="text-sm font-semibold text-stone-200">
                          {exp.employee_name}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400">{exp.description}</p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <span className="font-mono font-bold text-stone-100 text-lg">
                        ${exp.amount.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleExpenseAction(exp.id, 'Approve')}
                          className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                          title="Approve Reimbursement"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleExpenseAction(exp.id, 'Reject')}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Reject Reimbursement"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Tasks Feed */}
          <div className="bg-[#1c1412]/40 border border-[#2d211f]/60 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-stone-100 mb-4">Live Team Task Activity</h3>
            
            <div className="overflow-hidden border border-[#2d211f]/60 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1c1412]/30 text-xs font-semibold text-stone-400 border-b border-[#2d211f]/60">
                    <th className="p-4">Task Description</th>
                    <th className="p-4">Assigned Member</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d211f]/40 text-sm">
                  {tasks.map(task => (
                    <tr key={task.id} className="hover:bg-stone-850/20 transition-all duration-200">
                      <td className="p-4 font-medium text-stone-200">{task.title}</td>
                      <td className="p-4 text-stone-400">{task.assignee}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          task.priority === 'High' 
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : task.priority === 'Medium'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-450'
                            : 'bg-[#1c1412] border border-[#2d211f] text-stone-400'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-xs text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Task Creator Form */}
        <div className="space-y-6">
          <div className="bg-[#1c1412]/40 border border-[#2d211f]/60 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-stone-100 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-rose-500" />
              Delegate Team Task
            </h3>

            {submitSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-450 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Work item has been successfully dispatched!
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-450 mb-1.5">
                  Task Specification
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build API token middleware..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#140e0d] border border-[#2d211f] rounded-xl text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-sm transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-455 mb-1.5">
                  Assignee
                </label>
                <select
                  required
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#140e0d] border border-[#2d211f] rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-sm transition-all cursor-pointer shadow-inner"
                >
                  <option value="">Select Employee...</option>
                  {data?.team.map(emp => (
                    <option key={emp.id} value={emp.full_name}>{emp.full_name}</option>
                  ))}
                  {/* Default backup option if team empty */}
                  {(!data?.team || data.team.length === 0) && (
                    <>
                      <option value="Alice Smith">Alice Smith</option>
                      <option value="Bob Johnson">Bob Johnson</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-450 mb-1.5">
                  Priority Rating
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'High'].map(prio => (
                    <button
                      key={prio}
                      type="button"
                      onClick={() => setTaskPriority(prio)}
                      className={`py-2 text-xs font-semibold border rounded-lg transition-all ${
                        taskPriority === prio
                          ? 'bg-gradient-to-r from-rose-500 to-mocha-600 border-transparent text-white font-bold shadow-md shadow-rose-500/10'
                          : 'bg-[#140e0d] border border-[#2d211f] text-stone-400 hover:bg-stone-850/50 hover:text-stone-300'
                      }`}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-rose-500 to-mocha-600 hover:from-rose-600 hover:to-mocha-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                Dispatch Assignment
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
