import React, { useState } from 'react';
import { PortalModule } from '../data/portalModules';
import {
  X,
  Globe,
  Code,
  Calculator,
  Trees,
  Coins,
  FileCheck,
  Handshake,
  Settings,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Download,
  Layers,
  MapPin,
  Calendar,
  Building,
  Sliders,
  DollarSign,
  Activity,
} from 'lucide-react';

interface ModuleDetailModalProps {
  module: PortalModule | null;
  onClose: () => void;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({ module, onClose }) => {
  // Calculator state for value_calc
  const [treeType, setTreeType] = useState('落叶松');
  const [areaSize, setAreaSize] = useState('500');
  const [forestAge, setForestAge] = useState('15');
  const [carbonPrice, setCarbonPrice] = useState('78');

  // Trade action state for trading
  const [tradeQuantity, setTradeQuantity] = useState('1000');
  const [tradeSuccessToast, setTradeSuccessToast] = useState('');

  // GIS NDVI toggle for one_map
  const [ndviLevel, setNdviLevel] = useState(0.85);
  const [showBoundary, setShowBoundary] = useState(true);

  if (!module) return null;

  // Calculation formula simulation
  const numericArea = parseFloat(areaSize) || 0;
  const growthFactor = treeType === '落叶松' ? 4.2 : treeType === '红松' ? 5.1 : 3.8;
  const estimatedAnnualCO2 = Math.round(numericArea * growthFactor);
  const estimatedValue = Math.round(estimatedAnnualCO2 * (parseFloat(carbonPrice) || 78));

  const handleSimulateTrade = (type: 'buy' | 'sell') => {
    setTradeSuccessToast(`已成功发起 ${type === 'buy' ? '认购' : '挂牌'} ${tradeQuantity} 吨 CCER 申请！`);
    setTimeout(() => setTradeSuccessToast(''), 3500);
  };

  const renderModuleContent = () => {
    switch (module.id) {
      case 'one_map':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/80 border border-emerald-900/50 rounded-xl text-xs">
              <div className="flex items-center gap-4">
                <span className="text-slate-400">在轨卫星：高分六号 / 资源三号</span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-mono">中心坐标: 117°12'E, 42°24'N</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={showBoundary}
                    onChange={(e) => setShowBoundary(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-emerald-500"
                  />
                  <span>林班权属红线</span>
                </label>
              </div>
            </div>

            {/* Interactive Simulated Satellite Map Canvas */}
            <div className="relative h-64 w-full bg-[#051810] border border-emerald-800/40 rounded-xl overflow-hidden flex flex-col justify-between p-4">
              {/* Grid coordinate lines */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Simulated Forest NDVI Contours */}
              <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 400 200">
                <path
                  d="M0,120 Q80,60 180,100 T360,80 L400,110 L400,200 L0,200 Z"
                  fill="url(#forestGradient)"
                />
                <path
                  d="M50,150 Q160,90 260,130 T400,100 L400,200 L50,200 Z"
                  fill="url(#forestGradient2)"
                />
                <defs>
                  <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#042f1a" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="forestGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#022c22" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Sample plot markers */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-emerald-800 text-[11px] text-emerald-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>塞罕坝 01 号机械林场样地</span>
                </div>
                <div className="text-[11px] font-mono bg-black/60 px-2 py-1 rounded text-slate-300">
                  NDVI 反演值: <span className="text-emerald-400 font-bold">{ndviLevel}</span>
                </div>
              </div>

              {/* Center Map Telemetry Pin */}
              <div className="relative z-10 self-center bg-black/80 border border-emerald-500/70 p-3 rounded-xl max-w-sm text-xs shadow-xl">
                <div className="font-semibold text-white mb-1 flex items-center justify-between">
                  <span>林班号: SHB-2026-F14</span>
                  <span className="text-emerald-400 font-mono text-[11px]">82.4% 郁闭度</span>
                </div>
                <div className="text-slate-400 text-[11px] space-y-0.5">
                  <div>主要优势树种: 华北落叶松 / 白桦混交林</div>
                  <div>地表通量塔状态: <span className="text-emerald-400">运行正常 (-5.8 µmol·m⁻²·s⁻¹)</span></div>
                </div>
              </div>

              {/* Bottom slider */}
              <div className="relative z-10 flex items-center gap-3 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                <span>NDVI 植被阈值调节:</span>
                <input
                  type="range"
                  min="0.5"
                  max="0.99"
                  step="0.01"
                  value={ndviLevel}
                  onChange={(e) => setNdviLevel(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-500 cursor-pointer"
                />
                <span className="font-mono text-emerald-400">{ndviLevel}</span>
              </div>
            </div>
          </div>
        );

      case 'value_calc':
        return (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-slate-300">
              采用国家自愿减排（CCER）林业造林碳汇方法学，输入样地实测参数即可动态测算年固碳增量与经济变现估值：
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">主导树种类型</label>
                <select
                  value={treeType}
                  onChange={(e) => setTreeType(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="落叶松">华北落叶松</option>
                  <option value="红松">红松人工林</option>
                  <option value="桦木">白桦天然次生林</option>
                  <option value="杨树">速生杨防护林</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">核算地块面积 (公顷)</label>
                <input
                  type="number"
                  value={areaSize}
                  onChange={(e) => setAreaSize(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">林分平均树龄 (年)</label>
                <input
                  type="number"
                  value={forestAge}
                  onChange={(e) => setForestAge(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">CCER基准单价 (元/t)</label>
                <input
                  type="number"
                  value={carbonPrice}
                  onChange={(e) => setCarbonPrice(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="p-4 bg-gradient-to-r from-emerald-950/70 to-slate-900/90 border border-emerald-500/50 rounded-xl grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">预估年吸收固碳量 (CO₂e)</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {estimatedAnnualCO2.toLocaleString()} <span className="text-xs font-sans text-slate-300">吨 / 年</span>
                </span>
                <div className="text-[10px] text-slate-500 mt-1">含地上生物量 + 地下根系碳储</div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">年度碳汇潜在经济现值</span>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  ¥ {estimatedValue.toLocaleString()} <span className="text-xs font-sans text-slate-300">元</span>
                </span>
                <div className="text-[10px] text-emerald-400 mt-1">支持直接申请绿色碳汇抵押贷款</div>
              </div>
            </div>
          </div>
        );

      case 'trading':
        return (
          <div className="space-y-4 text-xs">
            {tradeSuccessToast && (
              <div className="p-2.5 bg-emerald-950 border border-emerald-500 rounded-lg text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{tradeSuccessToast}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[11px]">最新成交均价</span>
                <span className="text-lg font-bold font-mono text-emerald-400">78.50 元/t</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">今日撮合成交量</span>
                <span className="text-lg font-bold font-mono text-white">42,800 吨</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">交易市场状态</span>
                <span className="text-lg font-bold text-teal-300">连续竞价中</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">快捷现货申报挂单</span>
                <span className="text-slate-400 text-[11px]">标的物: 国家造林核证减排量 (CCER)</span>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-slate-400 mb-1">意向申报数量 (tCO₂e)</label>
                  <input
                    type="number"
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateTrade('buy')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                  >
                    买入认购
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateTrade('sell')}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
                  >
                    挂牌出让
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'project_dev':
        return (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
              <div className="font-semibold text-white mb-2">项目开发生命周期推进流水</div>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 bg-emerald-950/80 border border-emerald-500 rounded-lg text-emerald-300">
                  <div className="font-bold">1. 立项审定</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">已备案 (18项)</div>
                </div>
                <div className="p-2 bg-emerald-950/80 border border-emerald-500 rounded-lg text-emerald-300">
                  <div className="font-bold">2. 外业样地实测</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">完成率 100%</div>
                </div>
                <div className="p-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200">
                  <div className="font-bold">3. MRV第三方核查</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">专家评审中</div>
                </div>
                <div className="p-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-400">
                  <div className="font-bold">4. 配额签发划转</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">排队登账</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">示范项目: 承德塞罕坝机械林场二期增汇工程</span>
                <span className="text-emerald-400 font-mono">CCER-2026-F02</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                建设规模 12,000 公顷，额外性证明文件齐全，已完成基准线碳库扣减计算。
              </p>
            </div>
          </div>
        );

      case 'finance':
        return (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block text-[11px]">绿色信贷质押评估率</span>
                <span className="text-lg font-bold font-mono text-emerald-400">65.0%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">合作金融机构</span>
                <span className="text-white font-medium">国家开发银行 / 农业银行</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 border border-emerald-900/40 rounded-xl space-y-2">
              <div className="font-semibold text-white">碳汇指数气象巨灾保险产品</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                针对低温冻害、森林大火及特大干旱等自然风险，系统实时关联国家气象卫星监测数据，触发自动定损理赔机制。
              </p>
            </div>
          </div>
        );

      case 'assessment':
        return (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">权威资质认定 (CMA / CNAS)</span>
                <span className="text-emerald-400 font-mono text-[11px]">防重计验真通过</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                所有评估报告由具有国家发改委备案资质的审定机构数字化签章，区块链哈希全网可查。
              </p>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
              <span>《2026年度塞罕坝样地碳储量独立核证报告.pdf》</span>
              <span className="text-emerald-400 cursor-pointer hover:underline">查看防伪签章</span>
            </div>
          </div>
        );

      case 'industry':
        return (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="font-semibold text-white">生态共建与碳普惠协同矩阵</div>
              <p className="text-slate-400 text-[11px]">
                推动林下中草药、林禽立体生态经济与企业“碳中和园区”对接，已累计帮助林农户均年增收 1.2 万元。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <div className="font-medium text-white">零碳示范工厂认证</div>
                <div className="text-[10px] text-slate-400 mt-1">已赋能 36 家制造业龙头企业</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <div className="font-medium text-white">公众低碳生活碳积分</div>
                <div className="text-[10px] text-slate-400 mt-1">累计认领生态树木 24,000 株</div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="font-semibold text-white">安全审计与权限管理中心</div>
              <p className="text-slate-400 text-[11px]">
                系统严格采用国密 SM2/SM3/SM4 算法加密，满足国家网络安全等级保护（三级）规范。
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-300">RBAC 角色权限体系</span>
                <span className="text-emerald-400 font-mono">已配置 12 项细粒度策略</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-300">通量塔物联网数据同步周期</span>
                <span className="text-white font-mono">15 分钟 / 次 (已开启)</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#091710] border border-emerald-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-950/90 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{module.name}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {module.category}
                </span>
              </h3>
              <p className="text-xs text-slate-400">{module.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {renderModuleContent()}

          {/* Module Capabilities List */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-xs font-semibold text-slate-300 mb-2">核心支持功能特性</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {module.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-emerald-950/80 bg-slate-900/60 text-xs">
          <span className="text-slate-400">
            状态：<span className="text-emerald-400 font-medium">服务正常运行</span>
          </span>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium"
          >
            返回主导航大厅
          </button>
        </div>
      </div>
    </div>
  );
};
