import React from 'react';

export default function StreakCalendar({ history = [] }: { history: string[] }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  
  const historySet = new Set(history);
  
  const renderDays = () => {
    const days = [];
    
    // empty slots for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isLogged = historySet.has(dateStr);
      const isToday = dateStr === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      days.push(
        <div 
          key={d} 
          className={`flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full text-sm font-bold mx-auto transition-all ${
            isLogged 
              ? 'bg-rose-500 text-white shadow-sm shadow-rose-200 text-base' 
              : isToday 
                ? 'border-2 border-slate-300 text-slate-800' 
                : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          {isLogged ? '🔥' : d}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex flex-col h-fit">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">Kalender Aktif</h3>
        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
          {monthNames[currentMonth]} {currentYear}
        </span>
      </div>
      
      <div className="flex flex-col justify-center">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {dayNames.map(day => (
            <div key={day} className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {renderDays()}
        </div>
      </div>
    </div>
  );
}
