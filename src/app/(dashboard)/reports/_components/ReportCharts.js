"use client";

export default function ReportCharts({ monthlyData }) {
  // ຊອກຫາຄ່າສູງສຸດເພື່ອເອົາມາຄຳນວນຄວາມສູງຂອງແທ່ງກຣາຟແບບ Dynamic
  const maxExpense = Math.max(...monthlyData.map(d => d.expense));

  return (
    <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
      <div className="mb-6">
        <h3 className="font-bold text-slate-800 text-lg">Payroll Expense Trends (ແນວໂນ້ມລາຍຈ່າຍເງິນເດືອນ)</h3>
        <p className="text-xs text-slate-400 mt-0.5">ປຽບທຽບງົບປະມານລາຍຈ່າຍໃນແຕ່ລະເດືອນຂອງປີ 2026</p>
      </div>

      {/* ແຖບສະແດງກຣາຟ */}
      <div className="h-64 flex items-end gap-4 md:gap-8 pt-4 px-4 border-b border-slate-100">
        {monthlyData.map((item, index) => {
          // ຄຳນວນເປີເຊັນຄວາມສູງ
          const barHeight = maxExpense > 0 ? (item.expense / maxExpense) * 100 : 0;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
              
              {/* Tooltip ສະແດງຕົວເລກເວລາເອົາເມົ້າໄປຊີ້ */}
              <div className="absolute -top-4 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono">
                {(item.expense / 1000000).toFixed(1)}M
              </div>

              {/* ແທ່ງກຣາຟ */}
              <div 
                style={{ height: `${barHeight}%` }}
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-t-xl transition-all duration-500 shadow-lg shadow-blue-100 group-hover:scale-x-105"
              ></div>

              {/* ຊື່ເດືອນ */}
              <span className="text-xs font-bold text-slate-400 mt-2 block group-hover:text-slate-700 transition-colors">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* ບອກລາຍລະອຽດເພີ່ມເຕີມ */}
      <div className="flex justify-end gap-4 mt-4 text-xs font-bold text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-blue-600 rounded-sm block"></span> ງົບປະມານທີ່ຈ່າຍຈິງ (LAK)
        </div>
      </div>
    </div>
  );
}