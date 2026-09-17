import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ label, value, icon: Icon, color = 'blue', trend, trendLabel, subtitle }) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', iconBg: 'bg-blue-100', value: 'text-blue-700' },
    green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', iconBg: 'bg-emerald-100', value: 'text-emerald-700' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', iconBg: 'bg-purple-100', value: 'text-purple-700' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', iconBg: 'bg-orange-100', value: 'text-orange-700' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', iconBg: 'bg-red-100', value: 'text-red-700' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center`}>
          {Icon && <Icon size={24} className={c.icon} />}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
            trend >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
          }`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 mb-1 stat-number">{value?.toLocaleString?.() ?? value}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {(trendLabel || subtitle) && (
          <p className="text-xs text-gray-400 mt-1">{trendLabel || subtitle}</p>
        )}
      </div>
    </div>
  );
}
