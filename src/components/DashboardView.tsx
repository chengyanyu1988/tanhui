import React, { useState, useEffect, useRef } from 'react';
import { UserRole, CarbonProject } from '../types';
import { CARBON_PROJECTS, INITIAL_TELEMETRY, METHODOLOGY_STANDARDS } from '../data/carbonData';
import {
  TreePine,
  LogOut,
  Activity,
  Layers,
  Search,
  Download,
  ShieldCheck,
  TrendingUp,
  MapPin,
  RefreshCw,
  Cpu,
  BarChart3,
  Calendar,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface DashboardViewProps {
  user: {
    username: string;
    role: UserRole;
    roleName: string;
    department: string;
  };
  onLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ user, onLogout }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<CarbonProject[]>(CARBON_PROJECTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Draw 24-Hour Carbon Flux Dynamic Chart on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = 200);

    // Mock 24-hour eddy covariance flux data (photosynthesis peak at midday)
    const hours = 24;
    const points: Array<{ x: number; y: number; flux: number }> = [];

    for (let h = 0; h < hours; h++) {
      // Negative NEE means carbon uptake/sink (absorption), positive means release
      // Daytime (6am - 18pm) shows strong negative NEE (carbon absorption)
      let flux = 0;
      if (h >= 6 && h <= 18) {
        const peak = Math.sin(((h - 6) / 12) * Math.PI);
        flux = -6.8 * peak - 1.2 + (Math.sin(h) * 0.4);
      } else {
        flux = 1.8 + Math.cos(h) * 0.5;
      }

      // Map flux from [-10 to +4] to canvas Y
      // zero line at y = 60
      const zeroY = height * 0.35;
      const y = zeroY - flux * 14;
      const x = (h / (hours - 1)) * (width - 40) + 20;
      points.push({ x, y, flux });
    }

    ctx.clearRect(0, 0, width, height);

    // Draw zero reference line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, height * 0.35);
    ctx.lineTo(width - 20, height * 0.35);
    ctx.stroke();
    ctx.setLineDash([]);

    // Fill gradient under curve
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, height - 10);
    ctx.lineTo(points[0].x, height - 10);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw main line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw data points
    points.forEach((p, idx) => {
      if (idx % 3 === 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#07130d] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-3 bg-emerald-950 border border-emerald-500 rounded-xl text-xs text-white shadow-xl flex items-center gap-2 animate-in fade-in">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/90 border-b border-emerald-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-700/40 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
            <TreePine className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight whitespace-nowrap shrink-0">
                EcoCarbon 碳汇智管协同平台
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                工作台
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-sm">
              {user.department}
            </div>
          </div>
        </div>

        {/* Current Active User Profile & Actions */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-white">{user.username}</div>
            <div className="text-[11px] text-emerald-400">{user.roleName}</div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <button
            onClick={onLogout}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>退出系统</span>
          </button>
        </div>
      </header>

      {/* Main Console Viewport */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/70 border border-emerald-950/80 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>全域生物质固碳总量</span>
              <TreePine className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              1,485.4 <span className="text-xs font-sans text-slate-400">万吨 CO₂e</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>较上季度新增 +4.8%</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900/70 border border-emerald-950/80 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>在管高分卫星遥感面积</span>
              <Layers className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              171,100 <span className="text-xs font-sans text-slate-400">公顷</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              覆盖塞罕坝、胶州湾、若尔盖样地
            </div>
          </div>

          <div className="p-4 bg-slate-900/70 border border-emerald-950/80 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>已核定可交易 CCER 配额</span>
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-300 tabular-nums">
              3,824,500 <span className="text-xs font-sans text-slate-400">tCO₂e</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              第三方 MRV 权威机构全额签发
            </div>
          </div>

          <div className="p-4 bg-slate-900/70 border border-emerald-950/80 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>地面涡度通量塔在线率</span>
              <Cpu className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              99.8% <span className="text-xs font-sans text-slate-400">(1,684/1,688)</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-2">
              实时数据流稳定 · 延迟 &lt; 2s
            </div>
          </div>
        </div>

        {/* Dynamic 24-Hour Carbon Flux Curve */}
        <div className="p-5 bg-slate-900/70 border border-emerald-950/80 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                24小时森林生物圈净碳交换量（NEE / Eddy Covariance Flux）
              </h3>
              <p className="text-xs text-slate-400">
                日间光合作用强吸收（负值代表下行碳汇增量），夜间呼吸微弱释放
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">当前基准:</span>
              <span className="font-mono text-emerald-400 font-semibold">-5.42 µmol·m⁻²·s⁻¹</span>
            </div>
          </div>

          <div className="relative w-full h-[180px] bg-slate-950/60 rounded-lg p-2 border border-slate-800">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 px-4">
            <span>00:00 夜间呼吸</span>
            <span>06:00 晨曦启动</span>
            <span>12:00 正午光合吸收波峰</span>
            <span>18:00 日落平缓</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Carbon Projects Table */}
        <div className="bg-slate-900/70 border border-emerald-950/80 rounded-xl overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">在管国家级碳汇样地清单</h3>
              <p className="text-xs text-slate-400">
                支持林权边界、高光谱植被指数与减排量实测复核
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                {['all', '林业碳汇', '海洋蓝碳', '湿地草地'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'all' ? '全部项目' : cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索项目名称或地区..."
                  className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44"
                />
              </div>

              {/* Export Button */}
              <button
                type="button"
                onClick={() => showToast('已成功导出《2026年度碳汇MRV合规核算台账.xlsx》')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>导出清单</span>
              </button>
            </div>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-medium">项目编码与名称</th>
                  <th className="py-3 px-4 font-medium">所属生态类型</th>
                  <th className="py-3 px-4 font-medium text-right">核定面积 (公顷)</th>
                  <th className="py-3 px-4 font-medium text-right">年固碳量 (tCO₂e)</th>
                  <th className="py-3 px-4 font-medium text-center">遥感 NDVI 指数</th>
                  <th className="py-3 px-4 font-medium">资产状态</th>
                  <th className="py-3 px-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      没有匹配的项目数据
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{project.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{project.location}</span>
                          <span>·</span>
                          <span>{project.id}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium">{project.category}</td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        {project.areaHectares.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-semibold tabular-nums">
                        {project.annualCO2Sequestration.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-medium tabular-nums">
                        {project.ndvIndex}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs">
                          {project.status === 'trading' && (
                            <span className="text-emerald-400 font-medium">挂牌交易中</span>
                          )}
                          {project.status === 'verifying' && (
                            <span className="text-amber-400 font-medium">第三方核证中</span>
                          )}
                          {project.status === 'active' && (
                            <span className="text-teal-300 font-medium">遥感在轨监测</span>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => showToast(`已启动 [${project.name}] 样地通量数据复查`)}
                          className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                        >
                          查看通量
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
