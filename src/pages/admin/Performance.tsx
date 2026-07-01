import { TrendingUp, Package, Clock, AlertTriangle, BarChart3 } from 'lucide-react';
import { mockShipments, mockBranches, mockDashboardStats } from '../../data/mockData';
import Card, { StatCard } from '../../components/ui/Card';

export default function Performance() {
  const stats = mockDashboardStats;
  const total = mockShipments.length;
  const deliveryRate = total ? Math.round((mockShipments.filter(s => s.status === 'delivered').length / total) * 100) : 0;
  const delayRate = total ? Math.round((mockShipments.filter(s => s.status === 'delayed').length / total) * 100) : 0;
  const returnRate = total ? Math.round((mockShipments.filter(s => s.status === 'returned').length / total) * 100) : 0;

  const byType = ['standard', 'express', 'document', 'fragile', 'bulk', 'international'].map(type => ({
    type, count: mockShipments.filter(s => s.type === type).length,
  }));

  const byBranch = mockBranches.map(b => ({
    branch: b.name, city: b.city, count: mockShipments.filter(s => s.branchId === b.id).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Delivery Performance</h1>
        <p className="text-slate-500 text-sm">System-wide metrics and branch performance analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Delivery Rate" value={`${deliveryRate}%`} icon={<TrendingUp size={22} />} color="green" sub="Successful deliveries" />
        <StatCard label="Avg. Delivery Time" value={`${stats.avgDeliveryDays} days`} icon={<Clock size={22} />} color="blue" />
        <StatCard label="Delay Rate" value={`${delayRate}%`} icon={<AlertTriangle size={22} />} color="red" />
        <StatCard label="Return Rate" value={`${returnRate}%`} icon={<Package size={22} />} color="gray" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By type */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={16} /> Shipments by Service Type</h3>
          <div className="space-y-3">
            {byType.filter(b => b.count > 0).map(b => {
              const pct = total ? Math.round((b.count / total) * 100) : 0;
              return (
                <div key={b.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 capitalize">{b.type}</span>
                    <span className="font-semibold text-slate-800">{b.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* By branch */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={16} /> Shipments by Branch</h3>
          <div className="space-y-3">
            {byBranch.map(b => {
              const pct = total ? Math.round((b.count / total) * 100) : 0;
              return (
                <div key={b.branch}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 truncate max-w-xs">{b.city}</span>
                    <span className="font-semibold text-slate-800 shrink-0 ml-2">{b.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Monthly summary */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">Monthly Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200">
              <tr className="text-xs text-slate-500 uppercase">
                {['Month', 'Shipments', 'Delivered', 'Delayed', 'Revenue (est.)'].map(h => (
                  <th key={h} className="pb-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { month: 'January 2024', sent: 812, delivered: 780, delayed: 22, revenue: 65_000 },
                { month: 'February 2024', sent: 734, delivered: 701, delayed: 18, revenue: 58_000 },
                { month: 'March 2024', sent: 891, delivered: 856, delayed: 25, revenue: 72_000 },
                { month: 'April 2024', sent: 1024, delivered: 981, delayed: 32, revenue: 84_500 },
              ].map(row => (
                <tr key={row.month} className="text-sm">
                  <td className="py-2 text-slate-700">{row.month}</td>
                  <td className="py-2 font-semibold text-slate-800">{row.sent.toLocaleString()}</td>
                  <td className="py-2 text-emerald-600">{row.delivered.toLocaleString()}</td>
                  <td className="py-2 text-red-500">{row.delayed}</td>
                  <td className="py-2 text-slate-700">${row.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
