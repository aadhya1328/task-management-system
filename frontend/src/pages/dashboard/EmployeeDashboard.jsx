import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader2, DollarSign, CheckCircle2, Clock, Receipt, Send, ArrowRight } from 'lucide-react';

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Kanban board tasks state
  const [tasks, setTasks] = useState([]);
  
  // Expenses history state
  const [expenses, setExpenses] = useState([]);

  // Expense form state
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [submittingExpense, setSubmittingExpense] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchEmployeeData = async () => {
    try {
      const response = await api.get('/users/employee/data');
      setData(response.data);
      setTasks(response.data.tasks);
      setExpenses(response.data.expenses);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch employee dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmployeeData();
  }, []);

  const handleStatusTransition = (taskId, currentStatus) => {
    let nextStatus = 'To Do';
    if (currentStatus === 'To Do') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Completed';
    else nextStatus = 'To Do';

    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) return;

    setSubmittingExpense(true);
    
    // Simulate API call
    setTimeout(() => {
      const newExpense = {
        id: Date.now(),
        description: expenseTitle,
        amount: parseFloat(expenseAmount),
        status: 'Pending'
      };

      setExpenses([newExpense, ...expenses]);
      setExpenseTitle('');
      setExpenseAmount('');
      setSubmittingExpense(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 800);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-12 bg-[#140e0d] min-h-screen text-stone-100">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500 mx-auto mb-4" />
          <p className="text-stone-400">Loading user environment...</p>
        </div>
      </div>
    );
  }

  // Group tasks for visual presentation
  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  return (
    <div className="p-6 space-y-6 text-stone-100 bg-[#140e0d] min-h-screen">
      {/* Header bar */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-stone-100 to-rose-300 bg-clip-text text-transparent">Workstation Dashboard</h2>
        <p className="text-stone-400 text-sm">Review your task assignments, track project completions, and submit expense vouchers.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#1c1412]/50 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-mocha-500/10 border border-mocha-500/20 text-mocha-400 flex items-center justify-center shadow-inner">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Active Tasks</p>
            <p className="text-2xl font-bold text-stone-200">{todoTasks.length + inProgressTasks.length}</p>
          </div>
        </div>

        <div className="bg-[#1c1412]/50 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[#1c1412] border border-emerald-500/20 text-emerald-450 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Completed Tasks</p>
            <p className="text-2xl font-bold text-stone-200">{completedTasks.length}</p>
          </div>
        </div>

        <div className="bg-[#1c1412]/50 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Hours Logged</p>
            <p className="text-2xl font-bold text-stone-200">{data?.stats.hours_logged || 0} hrs</p>
          </div>
        </div>

        <div className="bg-[#1c1412]/50 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-455 flex items-center justify-center shadow-inner">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Reimbursements</p>
            <p className="text-2xl font-bold text-stone-100">{data?.stats.reimbursements_approved || '$0.00'}</p>
          </div>
        </div>
      </div>

      {/* Kanban Board Section */}
      <div className="bg-[#1c1412]/40 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl shadow-xl">
        <h3 className="text-lg font-semibold text-stone-100 mb-4 flex items-center gap-2">
          My Active Task Board
          <span className="text-xs bg-[#140e0d] border border-[#2d211f] text-stone-400 px-2.5 py-0.5 rounded-full">Interactive Kanban</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* TO DO COLUMN */}
          <div className="bg-[#140e0d]/80 p-4 rounded-xl border border-[#2d211f]/60 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-450">To Do</span>
              <span className="px-2 py-0.5 text-xs rounded bg-[#1c1412] text-stone-300 border border-[#2d211f]/60">{todoTasks.length}</span>
            </div>
            <div className="space-y-3">
              {todoTasks.length === 0 ? (
                <p className="text-center py-6 text-xs text-stone-550">No pending items</p>
              ) : (
                todoTasks.map(t => (
                  <TaskCard key={t.id} task={t} onTransition={handleStatusTransition} />
                ))
              )}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="bg-[#140e0d]/80 p-4 rounded-xl border border-[#2d211f]/60 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-450">In Progress</span>
              <span className="px-2 py-0.5 text-xs rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">{inProgressTasks.length}</span>
            </div>
            <div className="space-y-3">
              {inProgressTasks.length === 0 ? (
                <p className="text-center py-6 text-xs text-stone-550">No active items</p>
              ) : (
                inProgressTasks.map(t => (
                  <TaskCard key={t.id} task={t} onTransition={handleStatusTransition} />
                ))
              )}
            </div>
          </div>

          {/* COMPLETED COLUMN */}
          <div className="bg-[#140e0d]/80 p-4 rounded-xl border border-[#2d211f]/60 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-455">Completed</span>
              <span className="px-2 py-0.5 text-xs rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{completedTasks.length}</span>
            </div>
            <div className="space-y-3">
              {completedTasks.length === 0 ? (
                <p className="text-center py-6 text-xs text-stone-550">No completed items</p>
              ) : (
                completedTasks.map(t => (
                  <TaskCard key={t.id} task={t} onTransition={handleStatusTransition} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Split details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Expense Form */}
        <div className="bg-[#1c1412]/40 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl shadow-xl">
          <h3 className="text-lg font-semibold text-stone-100 mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-500" />
            File Expense Claim
          </h3>

          {submitSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-450 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Expense reimbursement queued successfully!
            </div>
          )}

          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-450 mb-1.5">
                Item Description
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Travel flight or home internet..."
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#140e0d] border border-[#2d211f] rounded-xl text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-sm transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-455 mb-1.5">
                Total Amount ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="e.g. 120.00"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#140e0d] border border-[#2d211f] rounded-xl text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 text-sm transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={submittingExpense}
              className="w-full mt-2 bg-gradient-to-r from-rose-500 to-mocha-600 hover:from-rose-600 hover:to-mocha-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 hover:-translate-y-0.5"
            >
              {submittingExpense ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Claim
                </>
              )}
            </button>
          </form>
        </div>

        {/* Expenses claims history */}
        <div className="lg:col-span-2 bg-[#1c1412]/40 border border-[#2d211f]/60 backdrop-blur-sm p-5 rounded-2xl shadow-xl">
          <h3 className="text-lg font-semibold text-stone-100 mb-4">My Claims History</h3>
          
          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {expenses.length === 0 ? (
              <p className="text-stone-500 text-sm py-6 text-center">No expense claims filed yet.</p>
            ) : (
              expenses.map(exp => (
                <div key={exp.id} className="p-3.5 bg-[#140e0d] border border-[#2d211f]/60 rounded-xl flex items-center justify-between shadow-inner">
                  <div>
                    <h5 className="text-sm font-semibold text-stone-200">{exp.description}</h5>
                    <p className="text-[10px] text-stone-500 font-mono">Claim ID: #{exp.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-stone-200 font-semibold">${exp.amount.toFixed(2)}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${
                      exp.status === 'Approved'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : exp.status === 'Rejected'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      {exp.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Kanban Task Card Component
function TaskCard({ task, onTransition }) {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/20';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-[#1c1412] text-stone-400 border border-[#2d211f]/60';
    }
  };

  const getTransitionText = (status) => {
    if (status === 'To Do') return 'Start Work';
    if (status === 'In Progress') return 'Complete';
    return 'Re-open';
  };

  return (
    <div className="p-3.5 bg-[#140e0d] border border-[#2d211f]/60 hover:border-rose-500/30 rounded-xl space-y-3 shadow-lg shadow-black/20 group transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${getPriorityClass(task.priority)}`}>
            {task.priority} Priority
          </span>
          <span className="text-[10px] text-stone-500 font-mono">#{task.id}</span>
        </div>
        <h4 className="text-sm font-semibold text-stone-200 leading-tight group-hover:text-white transition-colors">
          {task.title}
        </h4>
        <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      <div className="pt-2 border-t border-[#2d211f]/60 flex justify-end">
        <button
          onClick={() => onTransition(task.id, task.status)}
          className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-350 transition-colors bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-2 py-1 rounded-lg"
        >
          {getTransitionText(task.status)}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
