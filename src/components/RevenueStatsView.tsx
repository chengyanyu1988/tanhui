import React, { useState } from 'react';
import { ChevronDown, TrendingUp, RotateCcw, LineChart, BarChart3, AlignLeft } from 'lucide-react';

// 计算三阶贝塞尔曲线平滑路径
function createSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

// 计算平滑面积闭合路径
function createSmoothAreaPath(points: { x: number; y: number }[], baseY: number): string {
  if (points.length === 0) return '';
  const linePath = createSmoothPath(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${linePath} L ${last.x.toFixed(1)} ${baseY} L ${first.x.toFixed(1)} ${baseY} Z`;
}


interface CityStat {
  id: string;
  name: string;
  forestryIncome: number; // 育林活动增收金额 (万元)
  socialIncome: number;   // 社会增收金额 (万元)
  forestryArea: number;   // 闲散林地育林面积 (亩)
  socialArea: number;     // 社会增收面积 (万元/亩)
  growthRate: string;     // 环比增长率
  color: string;          // 地图分层设色
  mapPath: string;        // SVG 轮廓路径
  labelX: number;
  labelY: number;
}

// 对应截图 image_54c4ebe8.png 中的安徽省各行政区划林业增收真实数据 (近期 2026 年)
const CITY_STATS: CityStat[] = [
  {
    id: 'hefei',
    name: '合肥市',
    forestryIncome: 158,
    socialIncome: 126,
    forestryArea: 12500,
    socialArea: 610,
    growthRate: '+32.4%',
    color: '#2fa883',
    mapPath: 'M 225 245 L 265 235 L 295 245 L 320 270 L 315 305 L 285 330 L 255 335 L 230 310 L 220 275 Z',
    labelX: 265,
    labelY: 280,
  },
  {
    id: 'wuhu',
    name: '芜湖市',
    forestryIncome: 194,
    socialIncome: 105,
    forestryArea: 14200,
    socialArea: 520,
    growthRate: '+28.9%',
    color: '#3ec89e',
    mapPath: 'M 315 335 L 350 330 L 375 355 L 365 395 L 335 410 L 310 380 L 320 350 Z',
    labelX: 345,
    labelY: 365,
  },
  {
    id: 'bengbu',
    name: '蚌埠市',
    forestryIncome: 180,
    socialIncome: 70,
    forestryArea: 11800,
    socialArea: 360,
    growthRate: '+24.5%',
    color: '#5cdbb4',
    mapPath: 'M 255 160 L 310 150 L 335 175 L 325 210 L 280 215 L 245 195 Z',
    labelX: 290,
    labelY: 185,
  },
  {
    id: 'huainan',
    name: '淮南市',
    forestryIncome: 52,
    socialIncome: 78,
    forestryArea: 4200,
    socialArea: 280,
    growthRate: '+18.2%',
    color: '#7eebd0',
    mapPath: 'M 215 195 L 255 190 L 275 220 L 255 245 L 210 240 L 205 215 Z',
    labelX: 235,
    labelY: 220,
  },
  {
    id: 'maanshan',
    name: '马鞍山市',
    forestryIncome: 34,
    socialIncome: 62,
    forestryArea: 2800,
    socialArea: 210,
    growthRate: '+15.7%',
    color: '#7eebd0',
    mapPath: 'M 335 285 L 375 275 L 400 305 L 385 340 L 345 335 L 330 305 Z',
    labelX: 365,
    labelY: 305,
  },
  {
    id: 'huaibei',
    name: '淮北市',
    forestryIncome: 116,
    socialIncome: 96,
    forestryArea: 8900,
    socialArea: 430,
    growthRate: '+31.1%',
    color: '#3ec89e',
    mapPath: 'M 265 65 L 305 60 L 325 90 L 305 125 L 270 120 L 255 90 Z',
    labelX: 288,
    labelY: 90,
  },
  {
    id: 'tongling',
    name: '铜陵市',
    forestryIncome: 82,
    socialIncome: 70,
    forestryArea: 6100,
    socialArea: 290,
    growthRate: '+21.3%',
    color: '#5cdbb4',
    mapPath: 'M 285 345 L 315 345 L 325 380 L 295 395 L 275 375 Z',
    labelX: 300,
    labelY: 365,
  },
  {
    id: 'anqing',
    name: '安庆市',
    forestryIncome: 105,
    socialIncome: 126,
    forestryArea: 9400,
    socialArea: 590,
    growthRate: '+35.8%',
    color: '#1b6b55',
    mapPath: 'M 175 350 L 225 340 L 265 355 L 275 405 L 255 450 L 195 460 L 155 415 L 150 375 Z',
    labelX: 215,
    labelY: 400,
  },
  {
    id: 'huangshan',
    name: '黄山市',
    forestryIncome: 180,
    socialIncome: 88,
    forestryArea: 15200,
    socialArea: 460,
    growthRate: '+33.6%',
    color: '#d2fbf0',
    mapPath: 'M 285 455 L 340 445 L 385 470 L 375 530 L 330 560 L 285 535 L 270 485 Z',
    labelX: 325,
    labelY: 505,
  },
  {
    id: 'chuzhou',
    name: '滁州市',
    forestryIncome: 95,
    socialIncome: 82,
    forestryArea: 7600,
    socialArea: 380,
    growthRate: '+26.2%',
    color: '#a8f4e2',
    mapPath: 'M 305 210 L 365 200 L 415 230 L 410 280 L 350 285 L 315 250 Z',
    labelX: 365,
    labelY: 245,
  },
  {
    id: 'luan',
    name: '六安市',
    forestryIncome: 120,
    socialIncome: 92,
    forestryArea: 11000,
    socialArea: 480,
    growthRate: '+29.4%',
    color: '#d2fbf0',
    mapPath: 'M 135 240 L 210 235 L 225 295 L 210 345 L 165 350 L 125 310 L 120 265 Z',
    labelX: 168,
    labelY: 290,
  },
  {
    id: 'bozhou',
    name: '亳州市',
    forestryIncome: 88,
    socialIncome: 75,
    forestryArea: 6800,
    socialArea: 310,
    growthRate: '+22.1%',
    color: '#3ec89e',
    mapPath: 'M 185 85 L 245 75 L 260 115 L 235 155 L 180 145 L 165 110 Z',
    labelX: 215,
    labelY: 115,
  },
  {
    id: 'suzhou',
    name: '宿州市',
    forestryIncome: 102,
    socialIncome: 84,
    forestryArea: 8100,
    socialArea: 370,
    growthRate: '+25.0%',
    color: '#7eebd0',
    mapPath: 'M 295 70 L 365 65 L 385 110 L 360 160 L 310 150 L 300 110 Z',
    labelX: 340,
    labelY: 110,
  },
  {
    id: 'fuyang',
    name: '阜阳市',
    forestryIncome: 76,
    socialIncome: 68,
    forestryArea: 5900,
    socialArea: 290,
    growthRate: '+20.5%',
    color: '#d2fbf0',
    mapPath: 'M 145 155 L 215 150 L 225 195 L 195 235 L 140 225 L 125 185 Z',
    labelX: 175,
    labelY: 190,
  },
  {
    id: 'chizhou',
    name: '池州市',
    forestryIncome: 110,
    socialIncome: 95,
    forestryArea: 8600,
    socialArea: 420,
    growthRate: '+31.8%',
    color: '#268568',
    mapPath: 'M 245 405 L 285 395 L 315 425 L 295 470 L 255 460 L 240 430 Z',
    labelX: 275,
    labelY: 430,
  },
  {
    id: 'xuancheng',
    name: '宣城市',
    forestryIncome: 135,
    socialIncome: 86,
    forestryArea: 10500,
    socialArea: 440,
    growthRate: '+27.6%',
    color: '#a8f4e2',
    mapPath: 'M 345 385 L 395 365 L 435 400 L 415 465 L 365 470 L 335 425 Z',
    labelX: 385,
    labelY: 415,
  },
];

export const RevenueStatsView: React.FC = () => {
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('2026');
  const [barMetric, setBarMetric] = useState<string>('按增收金额 (万元)');
  const [mapMetric, setMapMetric] = useState<string>('按社会增收金额 (万元)');
  const [hoveredCity, setHoveredCity] = useState<CityStat | null>(null);
  const [chartStyle, setChartStyle] = useState<'area' | 'horizontal' | 'bar'>('area');

  const chartCities = CITY_STATS.slice(0, 9);

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 左侧栏: 筛选条 + 4 KPI指标卡 + 环比卡 + 参保行政区域柱状图 */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          {/* 1. 顶部筛选条 */}
          <div className="bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <span className="font-normal text-slate-300">所属行政区划</span>
              <div className="relative min-w-[170px]">
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#101a36] border border-[#1d2d57] text-slate-100 rounded focus:outline-none focus:border-[#00c88c] cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="合肥市">合肥市</option>
                  <option value="芜湖市">芜湖市</option>
                  <option value="蚌埠市">蚌埠市</option>
                  <option value="淮南市">淮南市</option>
                  <option value="马鞍山市">马鞍山市</option>
                  <option value="淮北市">淮北市</option>
                  <option value="铜陵市">铜陵市</option>
                  <option value="安庆市">安庆市</option>
                  <option value="黄山市">黄山市</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-normal text-slate-300">年份</span>
              <div className="relative min-w-[150px]">
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#101a36] border border-[#1d2d57] text-slate-100 rounded focus:outline-none focus:border-[#00c88c] cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="2026">2026年 (近期)</option>
                  <option value="2025">2025年</option>
                  <option value="2024">2024年</option>
                </select>
              </div>
            </div>

            {districtFilter && (
              <button
                onClick={() => setDistrictFilter('')}
                className="ml-auto flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置筛选</span>
              </button>
            )}
          </div>

          {/* 2. KPI 指标统计组 (4个指标卡 + 1个环比圆环卡) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* 4个基础指标卡 (2x2 布局) */}
            <div className="sm:col-span-8 grid grid-cols-2 gap-3">
              {/* 卡片 1: 闲散林地育林面积 */}
              <div className="bg-[#091126] border border-[#18284c] rounded-xl p-3.5 shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-slate-300">闲散林地育林面积</span>
                  <div
                    className="w-5 h-6 bg-[#00c88c] flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 75%, 0% 100%)' }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 -mt-1 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline">
                  <span className="text-2xl font-bold font-mono text-[#00c88c] tracking-tight">58312</span>
                  <span className="text-xs text-slate-300 ml-1.5">亩</span>
                </div>
              </div>

              {/* 卡片 2: 社会增收面积 */}
              <div className="bg-[#091126] border border-[#18284c] rounded-xl p-3.5 shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-slate-300">社会增收面积</span>
                  <div
                    className="w-5 h-6 bg-[#00c88c] flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 75%, 0% 100%)' }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 -mt-1 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline">
                  <span className="text-2xl font-bold font-mono text-[#00c88c] tracking-tight">2823</span>
                  <span className="text-xs text-slate-300 ml-1.5">万元</span>
                </div>
              </div>

              {/* 卡片 3: 育林活动增收金额 */}
              <div className="bg-[#091126] border border-[#18284c] rounded-xl p-3.5 shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-slate-300">育林活动增收金额</span>
                  <div
                    className="w-5 h-6 bg-[#00c88c] flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 75%, 0% 100%)' }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 -mt-1 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline">
                  <span className="text-2xl font-bold font-mono text-[#00c88c] tracking-tight">231312</span>
                  <span className="text-xs text-slate-300 ml-1.5">万元</span>
                </div>
              </div>

              {/* 卡片 4: 育林活动收入金额 */}
              <div className="bg-[#091126] border border-[#18284c] rounded-xl p-3.5 shadow-xl relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-slate-300">育林活动收入金额</span>
                  <div
                    className="w-5 h-6 bg-[#00c88c] flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 75%, 0% 100%)' }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 -mt-1 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline">
                  <span className="text-2xl font-bold font-mono text-[#00c88c] tracking-tight">5512</span>
                  <span className="text-xs text-slate-300 ml-1.5">万元</span>
                </div>
              </div>
            </div>

            {/* 卡片 5: 增收环比情况 */}
            <div className="sm:col-span-4 bg-[#091126] border border-[#18284c] rounded-xl p-3.5 shadow-xl flex flex-col justify-between items-center hover:border-emerald-500/40 transition-colors">
              <div className="w-full text-left">
                <span className="text-xs font-medium text-slate-300">增收环比情况</span>
              </div>

              <div className="relative w-28 h-28 flex items-center justify-center my-1">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#00c88c"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - 0.72)}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-bold font-mono text-[#38bdf8] tracking-tight">30.66%</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#38bdf8] mt-0.5" />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pb-0.5">
                育林增收环比去年
              </div>
            </div>
          </div>

          {/* 3. 参保行政区域统计 (支持平滑折线面积图、横向对比条形图、双柱对比图) */}
          <div className="bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl flex-1 flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-200">参保行政区域统计</span>
                {/* 图表样式切换器 */}
                <div className="flex items-center bg-[#101a36] border border-[#1d2d57] p-0.5 rounded-lg text-[11px]">
                  <button
                    type="button"
                    onClick={() => setChartStyle('area')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                      chartStyle === 'area'
                        ? 'bg-[#00c88c] text-[#091126] font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="平滑面积折线图"
                  >
                    <LineChart className="w-3 h-3" />
                    <span>平滑面积图</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartStyle('horizontal')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                      chartStyle === 'horizontal'
                        ? 'bg-[#00c88c] text-[#091126] font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="横向对比条形图"
                  >
                    <AlignLeft className="w-3 h-3" />
                    <span>横向对比条</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartStyle('bar')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                      chartStyle === 'bar'
                        ? 'bg-[#00c88c] text-[#091126] font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="双柱对比图"
                  >
                    <BarChart3 className="w-3 h-3" />
                    <span>柱状对比</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <select
                  value={barMetric}
                  onChange={(e) => setBarMetric(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-[#101a36] border border-[#1d2d57] text-slate-200 rounded focus:outline-none focus:border-[#00c88c] cursor-pointer"
                >
                  <option value="按增收金额 (万元)">按增收金额 (万元)</option>
                  <option value="按面积 (亩)">按面积 (亩)</option>
                </select>
              </div>
            </div>

            {/* 图例 */}
            <div className="flex items-center justify-center gap-6 mb-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-2 rounded-xs bg-[#00c88c]" />
                <span>{barMetric === '按面积 (亩)' ? '闲散林地育林面积 (亩)' : '育林活动增收金额 (万元)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-2 rounded-xs bg-[#38bdf8]" />
                <span>{barMetric === '按面积 (亩)' ? '社会增收面积 (万元)' : '社会增收金额 (万元)'}</span>
              </div>
            </div>

            {/* 图表展示区域 */}
            <div className="relative flex-1 min-h-[220px] flex flex-col justify-end pt-2 pb-1">
              {/* 样式 1: 平滑折线面积图 (默认选中的全新图表样式) */}
              {chartStyle === 'area' && (() => {
                const isArea = barMetric === '按面积 (亩)';
                const maxVal = isArea ? 16000 : 200;
                const yTicks = isArea ? [16000, 12000, 8000, 4000, 0] : [200, 150, 100, 50, 0];

                const ptsForestry = chartCities.map((c, i) => {
                  const val = isArea ? c.forestryArea : c.forestryIncome;
                  const x = 38 + i * 65;
                  const y = 165 - Math.min(Math.max((val / maxVal) * 140, 0), 140);
                  return { x, y, city: c, val };
                });

                const ptsSocial = chartCities.map((c, i) => {
                  const val = isArea ? c.socialArea * 25 : c.socialIncome; // 面积模式下展示社会效益对应量
                  const realVal = isArea ? c.socialArea : c.socialIncome;
                  const x = 38 + i * 65;
                  const y = 165 - Math.min(Math.max((val / maxVal) * 140, 0), 140);
                  return { x, y, city: c, val: realVal };
                });

                const forestryLine = createSmoothPath(ptsForestry);
                const forestryAreaPath = createSmoothAreaPath(ptsForestry, 165);
                const socialLine = createSmoothPath(ptsSocial);
                const socialAreaPath = createSmoothAreaPath(ptsSocial, 165);

                const activeCityX = hoveredCity
                  ? ptsForestry.find((p) => p.city.id === hoveredCity.id)?.x
                  : null;

                return (
                  <div className="relative w-full h-[210px] flex flex-col justify-between">
                    <svg className="w-full h-[185px] overflow-visible" viewBox="0 0 590 190">
                      <defs>
                        {/* 翡翠绿渐变 */}
                        <linearGradient id="forestryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00c88c" stopOpacity="0.45" />
                          <stop offset="85%" stopColor="#00c88c" stopOpacity="0.05" />
                          <stop offset="100%" stopColor="#00c88c" stopOpacity="0.0" />
                        </linearGradient>

                        {/* 天蓝色渐变 */}
                        <linearGradient id="socialAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.38" />
                          <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.04" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                        </linearGradient>

                        {/* 滤镜发光 */}
                        <filter id="glowForestry" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00c88c" floodOpacity="0.6" />
                        </filter>
                        <filter id="glowSocial" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.6" />
                        </filter>
                      </defs>

                      {/* 背景网格线与 Y 轴刻度 */}
                      {yTicks.map((val, idx) => {
                        const y = 25 + idx * 35;
                        return (
                          <g key={val}>
                            <text
                              x="32"
                              y={y + 3}
                              textAnchor="end"
                              className="fill-slate-500 text-[10px] font-mono select-none"
                            >
                              {val}
                            </text>
                            <line
                              x1="36"
                              y1={y}
                              x2="570"
                              y2={y}
                              stroke="#18284c"
                              strokeDasharray={idx === 4 ? 'none' : '3 3'}
                              strokeWidth={idx === 4 ? '1.5' : '1'}
                            />
                          </g>
                        );
                      })}

                      {/* 面积填充 */}
                      <path d={forestryAreaPath} fill="url(#forestryAreaGrad)" />
                      <path d={socialAreaPath} fill="url(#socialAreaGrad)" />

                      {/* 折线 */}
                      <path
                        d={forestryLine}
                        fill="none"
                        stroke="#00c88c"
                        strokeWidth="2.5"
                        filter="url(#glowForestry)"
                      />
                      <path
                        d={socialLine}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        filter="url(#glowSocial)"
                      />

                      {/* 激活指示垂线 */}
                      {activeCityX !== undefined && activeCityX !== null && (
                        <line
                          x1={activeCityX}
                          y1="25"
                          x2={activeCityX}
                          y2="165"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          className="animate-pulse"
                        />
                      )}

                      {/* 数据节点: 育林活动 */}
                      {ptsForestry.map((pt) => {
                        const isHovered = hoveredCity?.id === pt.city.id;
                        const isFiltered = districtFilter === pt.city.name;
                        return (
                          <g
                            key={`f-${pt.city.id}`}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredCity(pt.city)}
                            onMouseLeave={() => setHoveredCity(null)}
                            onClick={() => setDistrictFilter((prev) => (prev === pt.city.name ? '' : pt.city.name))}
                          >
                            {(isHovered || isFiltered) && (
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r="8"
                                fill="#00c88c"
                                fillOpacity="0.3"
                                className="animate-ping"
                              />
                            )}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isHovered || isFiltered ? '5.5' : '3.5'}
                              fill="#091126"
                              stroke="#00c88c"
                              strokeWidth="2.5"
                            />
                          </g>
                        );
                      })}

                      {/* 数据节点: 社会增收 */}
                      {ptsSocial.map((pt) => {
                        const isHovered = hoveredCity?.id === pt.city.id;
                        const isFiltered = districtFilter === pt.city.name;
                        return (
                          <g
                            key={`s-${pt.city.id}`}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredCity(pt.city)}
                            onMouseLeave={() => setHoveredCity(null)}
                            onClick={() => setDistrictFilter((prev) => (prev === pt.city.name ? '' : pt.city.name))}
                          >
                            {(isHovered || isFiltered) && (
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r="8"
                                fill="#38bdf8"
                                fillOpacity="0.3"
                                className="animate-ping"
                              />
                            )}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isHovered || isFiltered ? '5.5' : '3.5'}
                              fill="#091126"
                              stroke="#38bdf8"
                              strokeWidth="2.5"
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* X 轴城市名称标签 */}
                    <div className="flex items-center justify-between pl-9 pr-4 text-[10px] text-slate-400 select-none">
                      {chartCities.map((c) => {
                        const isHovered = hoveredCity?.id === c.id;
                        const isFiltered = districtFilter === c.name;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            className={`transition-colors cursor-pointer hover:text-emerald-300 ${
                              isHovered || isFiltered ? 'text-[#38bdf8] font-bold scale-105' : 'text-slate-400'
                            }`}
                            onMouseEnter={() => setHoveredCity(c)}
                            onMouseLeave={() => setHoveredCity(null)}
                            onClick={() => setDistrictFilter((prev) => (prev === c.name ? '' : c.name))}
                          >
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* 样式 2: 横向对比条形图 */}
              {chartStyle === 'horizontal' && (
                <div className="space-y-1.5 max-h-[210px] overflow-y-auto pr-1">
                  {chartCities.map((c, index) => {
                    const isHovered = hoveredCity?.id === c.id;
                    const isFiltered = districtFilter === c.name;
                    const maxVal = barMetric === '按面积 (亩)' ? 16000 : 200;
                    const val1 = barMetric === '按面积 (亩)' ? c.forestryArea : c.forestryIncome;
                    const val2 = barMetric === '按面积 (亩)' ? c.socialArea : c.socialIncome;
                    const pct1 = Math.min((val1 / maxVal) * 100, 100);
                    const pct2 = Math.min((val2 / (barMetric === '按面积 (亩)' ? 700 : 200)) * 100, 100);

                    return (
                      <div
                        key={c.id}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isHovered || isFiltered
                            ? 'bg-[#101a36] border-[#00c88c]/60 shadow-md'
                            : 'bg-[#0a142e]/60 border-[#18284c]/60 hover:border-[#1d2d57]'
                        }`}
                        onMouseEnter={() => setHoveredCity(c)}
                        onMouseLeave={() => setHoveredCity(null)}
                        onClick={() => setDistrictFilter((prev) => (prev === c.name ? '' : c.name))}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded text-[9px] flex items-center justify-center font-bold ${
                                index === 0
                                  ? 'bg-amber-500 text-slate-900'
                                  : index === 1
                                  ? 'bg-slate-300 text-slate-900'
                                  : index === 2
                                  ? 'bg-amber-700 text-white'
                                  : 'bg-[#18284c] text-slate-400'
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span className={isHovered || isFiltered ? 'text-[#38bdf8] font-bold' : 'text-slate-200'}>
                              {c.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-[10px]">
                            <span className="text-[#00c88c] font-semibold">
                              育林: {val1} {barMetric === '按面积 (亩)' ? '亩' : '万'}
                            </span>
                            <span className="text-[#38bdf8] font-semibold">
                              社会: {val2} {barMetric === '按面积 (亩)' ? '万/亩' : '万'}
                            </span>
                            <span className="text-emerald-400">{c.growthRate}</span>
                          </div>
                        </div>

                        {/* 双横向进度条 */}
                        <div className="space-y-1">
                          <div className="w-full bg-[#101a36] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-[#00c88c] rounded-full transition-all duration-500"
                              style={{ width: `${pct1}%` }}
                            />
                          </div>
                          <div className="w-full bg-[#101a36] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-[#38bdf8] rounded-full transition-all duration-500"
                              style={{ width: `${pct2}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 样式 3: 柱状对比图 (经典保留) */}
              {chartStyle === 'bar' && (
                <div className="relative flex-1 min-h-[200px] flex flex-col justify-end">
                  <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-mono pr-2">
                    {[200, 150, 100, 50, 0].map((val) => (
                      <div key={val} className="flex items-center w-full">
                        <span className="w-6 text-right pr-2">{val}</span>
                        <div className="flex-1 border-b border-[#18284c]/60" />
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 flex items-end justify-between pl-8 pr-3 h-[175px]">
                    {chartCities.map((c) => {
                      const isHovered = hoveredCity?.id === c.id;
                      const isFiltered = districtFilter === c.name;
                      const forestryHeight = (c.forestryIncome / 200) * 160;
                      const socialHeight = (c.socialIncome / 200) * 160;

                      return (
                        <div
                          key={c.id}
                          className="flex-1 flex flex-col items-center group cursor-pointer transition-transform"
                          onMouseEnter={() => setHoveredCity(c)}
                          onMouseLeave={() => setHoveredCity(null)}
                          onClick={() => setDistrictFilter((prev) => (prev === c.name ? '' : c.name))}
                        >
                          <div className="flex items-end gap-1 h-[160px]">
                            <div
                              className={`w-2.5 sm:w-3.5 rounded-t-xs transition-all duration-300 ${
                                isHovered || isFiltered ? 'bg-[#00e699] shadow-lg shadow-emerald-500/50 scale-y-105' : 'bg-[#00c88c]'
                              }`}
                              style={{ height: `${forestryHeight}px` }}
                              title={`${c.name} 育林活动增收: ${c.forestryIncome}万元`}
                            />
                            <div
                              className={`w-2.5 sm:w-3.5 rounded-t-xs transition-all duration-300 ${
                                isHovered || isFiltered ? 'bg-[#99f6e4] shadow-lg shadow-teal-400/50 scale-y-105' : 'bg-[#38bdf8]'
                              }`}
                              style={{ height: `${socialHeight}px` }}
                              title={`${c.name} 社会增收: ${c.socialIncome}万元`}
                            />
                          </div>

                          <span
                            className={`text-[10px] mt-2 whitespace-nowrap transition-colors ${
                              isHovered || isFiltered ? 'text-[#38bdf8] font-bold' : 'text-slate-400'
                            }`}
                          >
                            {c.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 悬浮数据卡片 */}
              {hoveredCity && (
                <div className="absolute top-2 right-4 bg-[#0a142e] border border-[#00c88c] rounded-lg p-2.5 shadow-2xl text-[11px] text-slate-200 z-20 pointer-events-none animate-in fade-in">
                  <div className="font-bold text-white mb-1 border-b border-[#18284c] pb-1 flex justify-between gap-4">
                    <span>{hoveredCity.name}</span>
                    <span className="text-[#38bdf8]">{hoveredCity.growthRate} 环比</span>
                  </div>
                  <div className="space-y-0.5 font-mono text-[10px]">
                    <div className="flex justify-between gap-3">
                      <span className="text-[#00c88c]">育林活动增收:</span>
                      <span className="font-bold">{hoveredCity.forestryIncome} 万元</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-[#38bdf8]">社会增收金额:</span>
                      <span className="font-bold">{hoveredCity.socialIncome} 万元</span>
                    </div>
                    <div className="flex justify-between gap-3 text-slate-400">
                      <span>育林面积:</span>
                      <span>{hoveredCity.forestryArea.toLocaleString()} 亩</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧栏: 地域分布统计 (安徽省林业增收分层设色地图) */}
        <div className="lg:col-span-5 bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2 z-10">
            <span className="text-xs font-bold text-slate-200">地域分布统计</span>
            <div className="relative">
              <select
                value={mapMetric}
                onChange={(e) => setMapMetric(e.target.value)}
                className="px-2.5 py-1 text-xs bg-[#101a36] border border-[#1d2d57] text-slate-200 rounded focus:outline-none focus:border-[#00c88c] cursor-pointer"
              >
                <option value="按社会增收金额 (万元)">按社会增收金额 (万元)</option>
                <option value="按育林增收金额 (万元)">按育林增收金额 (万元)</option>
                <option value="按闲荒地面积 (亩)">按闲荒地面积 (亩)</option>
              </select>
            </div>
          </div>

          {/* 右上角分层设色图例 */}
          <div className="absolute top-14 right-4 z-10 bg-[#0a142e]/90 backdrop-blur-xs border border-[#18284c] rounded-md p-2 text-[10px] space-y-1 shadow-md">
            <div className="text-slate-400 font-medium mb-1">增收金额</div>
            <div className="space-y-0.5">
              {[
                { color: '#1b6b55', label: '200' },
                { color: '#268568', label: '171~200' },
                { color: '#2fa883', label: '143~171' },
                { color: '#3ec89e', label: '114~143' },
                { color: '#5cdbb4', label: '86~114' },
                { color: '#7eebd0', label: '57~86' },
                { color: '#a8f4e2', label: '29~57' },
                { color: '#d2fbf0', label: '0~29' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 font-mono text-[9px] text-slate-300">
                  <span className="w-3.5 h-2 rounded-2xs inline-block" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 地图矢量渲染区 */}
          <div className="relative w-full flex-1 flex items-center justify-center min-h-[380px] my-2">
            <svg
              viewBox="90 40 370 530"
              className="w-full h-full max-h-[460px] filter drop-shadow-[0_10px_20px_rgba(0,200,140,0.15)]"
            >
              {CITY_STATS.map((c) => {
                const isHovered = hoveredCity?.id === c.id;
                const isSelected = districtFilter === c.name;

                return (
                  <g
                    key={c.id}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredCity(c)}
                    onMouseLeave={() => setHoveredCity(null)}
                    onClick={() => setDistrictFilter((prev) => (prev === c.name ? '' : c.name))}
                  >
                    <path
                      d={c.mapPath}
                      fill={c.color}
                      stroke={isSelected ? '#ffffff' : isHovered ? '#00e699' : '#091126'}
                      strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1'}
                      className="transition-colors hover:brightness-110"
                    />
                  </g>
                );
              })}
            </svg>

            {hoveredCity && (
              <div className="absolute bottom-4 left-4 bg-[#0a142e]/95 border border-[#00c88c] rounded-lg p-2.5 shadow-2xl text-[11px] text-slate-100 z-20 pointer-events-none animate-in fade-in">
                <div className="font-bold text-emerald-400 mb-1 border-b border-[#18284c] pb-1 flex justify-between gap-4">
                  <span>{hoveredCity.name}</span>
                  <span className="text-[#38bdf8]">{hoveredCity.growthRate} 环比</span>
                </div>
                <div className="space-y-0.5 font-mono text-[10px]">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-400">育林活动增收:</span>
                    <span className="font-bold text-white">{hoveredCity.forestryIncome} 万元</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-400">社会增收金额:</span>
                    <span className="font-bold text-[#7eead8]">{hoveredCity.socialIncome} 万元</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-400">闲散林地育林:</span>
                    <span className="font-bold text-emerald-400">{hoveredCity.forestryArea} 亩</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-[#18284c] pt-2 mt-1">
            <span>支持点击地图地块与左侧图表实时聚焦联动</span>
            <span className="text-emerald-400 font-mono">近期监测更新: 2026-10</span>
          </div>
        </div>
      </div>
    </div>
  );
};
