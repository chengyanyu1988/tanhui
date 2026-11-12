import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  RotateCcw,
  Check,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';

interface ScenarioDetail {
  priceDesc: string;
  annualSink: number;
  years: number;
  totalSink: number;
  totalValueWan: number;
  irr: number;
  npvWan: number;
  paybackYears: number;
}

interface ProjectOption {
  id: string;
  name: string;
  district: string;
  enterprise: string;
  projectType: string;
  treeSpecies: string;
  areaMu: number;
  // Quality Assessment Metrics
  overallScore: number;
  grade: string;
  dimensions: {
    authenticity: { score: number; grade: string };
    additionality: { score: number; grade: string };
    permanence: { score: number; grade: string };
    consistency: { score: number; grade: string };
    completeness: { score: number; grade: string };
  };
  // Value Assessment Metrics (Matching image_19410877.png, image_56b68066.png, image_6a27124b.png)
  valueMetrics: {
    totalCarbonStock: number; // 碳汇总量 (tCO₂e)
    currentValueWan: number;   // 当前价值 (万元)
    annualValueWan: number;    // 年均价值 (万元/年)
    carbonPrice: number;       // 碳价 (元/tCO₂e)
    irr: number;               // IRR (%)
    npvWan: number;            // NPV (万元)
    paybackYears: number;      // 投资回收期 (年)
    scenarios: {
      conservative: ScenarioDetail;
      baseline: ScenarioDetail;
      optimistic: ScenarioDetail;
    };
  };
}

const PRESET_PROJECTS: ProjectOption[] = [
  {
    id: 'p1',
    name: '黄山市新安江流域常绿针阔混交造林碳汇示范项目',
    district: '黄山市',
    enterprise: '黄山生态林业发展集团有限公司',
    projectType: 'CCER造林碳汇 (林业类温室气体自愿减排项目)',
    treeSpecies: '马尾松、杉木、麻栎、毛竹混交林 (林龄12~18年)',
    areaMu: 12500,
    overallScore: 87,
    grade: 'AAA (优秀)',
    dimensions: {
      authenticity: { score: 92, grade: 'A+' },
      additionality: { score: 85, grade: 'A-' },
      permanence: { score: 80, grade: 'B+' },
      consistency: { score: 90, grade: 'A' },
      completeness: { score: 88, grade: 'A-' },
    },
    valueMetrics: {
      totalCarbonStock: 129.36,
      currentValueWan: 782.12,
      annualValueWan: 89.09,
      carbonPrice: 50.0,
      irr: 9.2,
      npvWan: 86.0,
      paybackYears: 12,
      scenarios: {
        conservative: {
          priceDesc: '¥30/tCO2e (CCER底部价)',
          annualSink: 128.65,
          years: 30,
          totalSink: 3859.5,
          totalValueWan: 115.89,
          irr: 5.8,
          npvWan: 23.5,
          paybackYears: 17.2,
        },
        baseline: {
          priceDesc: '¥50/tCO2e (现货基准价)',
          annualSink: 156.4,
          years: 30,
          totalSink: 4692.0,
          totalValueWan: 234.6,
          irr: 9.2,
          npvWan: 86.0,
          paybackYears: 12.0,
        },
        optimistic: {
          priceDesc: '¥80/tCO2e (绿色金融溢价)',
          annualSink: 185.2,
          years: 30,
          totalSink: 5556.0,
          totalValueWan: 444.48,
          irr: 13.8,
          npvWan: 165.2,
          paybackYears: 8.5,
        },
      },
    },
  },
  {
    id: 'p2',
    name: '六安市大别山金寨水土涵养林生态增汇工程',
    district: '六安市',
    enterprise: '安徽省金寨林业生态开发总公司',
    projectType: 'CCER森林抚育碳汇 (国家核证自愿减排量)',
    treeSpecies: '落叶松、油茶、黄山松、栓皮栎混交林',
    areaMu: 18200,
    overallScore: 91,
    grade: 'AAA (卓越)',
    dimensions: {
      authenticity: { score: 95, grade: 'A+' },
      additionality: { score: 89, grade: 'A' },
      permanence: { score: 88, grade: 'A-' },
      consistency: { score: 92, grade: 'A+' },
      completeness: { score: 91, grade: 'A+' },
    },
    valueMetrics: {
      totalCarbonStock: 188.5,
      currentValueWan: 1120.45,
      annualValueWan: 132.8,
      carbonPrice: 52.5,
      irr: 11.4,
      npvWan: 124.6,
      paybackYears: 10,
      scenarios: {
        conservative: {
          priceDesc: '¥35/tCO2e (CCER底部保底价)',
          annualSink: 165.0,
          years: 30,
          totalSink: 4950.0,
          totalValueWan: 173.25,
          irr: 6.8,
          npvWan: 38.2,
          paybackYears: 15.6,
        },
        baseline: {
          priceDesc: '¥52.5/tCO2e (现货基准均价)',
          annualSink: 198.5,
          years: 30,
          totalSink: 5955.0,
          totalValueWan: 312.64,
          irr: 11.4,
          npvWan: 124.6,
          paybackYears: 10.0,
        },
        optimistic: {
          priceDesc: '¥85/tCO2e (碳金融创新溢价)',
          annualSink: 235.0,
          years: 30,
          totalSink: 7050.0,
          totalValueWan: 599.25,
          irr: 15.6,
          npvWan: 218.4,
          paybackYears: 7.6,
        },
      },
    },
  },
  {
    id: 'p3',
    name: '宣城市敬亭山中幼林抚育碳汇增量提升项目',
    district: '宣城市',
    enterprise: '宣城市敬亭山国家森林经营开发公司',
    projectType: 'VCS/CCER双认证森林经营碳汇项目',
    treeSpecies: '杉木人工林、湿地松、毛竹立体经营林',
    areaMu: 9600,
    overallScore: 84,
    grade: 'AA+ (优良)',
    dimensions: {
      authenticity: { score: 88, grade: 'A-' },
      additionality: { score: 82, grade: 'B+' },
      permanence: { score: 79, grade: 'B+' },
      consistency: { score: 87, grade: 'A-' },
      completeness: { score: 84, grade: 'B+' },
    },
    valueMetrics: {
      totalCarbonStock: 96.2,
      currentValueWan: 568.3,
      annualValueWan: 68.5,
      carbonPrice: 48.0,
      irr: 8.5,
      npvWan: 62.4,
      paybackYears: 13,
      scenarios: {
        conservative: {
          priceDesc: '¥28/tCO2e (CCER底部保底价)',
          annualSink: 95.0,
          years: 30,
          totalSink: 2850.0,
          totalValueWan: 79.8,
          irr: 5.2,
          npvWan: 18.5,
          paybackYears: 18.4,
        },
        baseline: {
          priceDesc: '¥48/tCO2e (现货基准均价)',
          annualSink: 118.0,
          years: 30,
          totalSink: 3540.0,
          totalValueWan: 169.92,
          irr: 8.5,
          npvWan: 62.4,
          paybackYears: 13.0,
        },
        optimistic: {
          priceDesc: '¥75/tCO2e (区域碳普惠溢价)',
          annualSink: 142.0,
          years: 30,
          totalSink: 4260.0,
          totalValueWan: 319.5,
          irr: 12.2,
          npvWan: 118.0,
          paybackYears: 9.8,
        },
      },
    },
  },
  {
    id: 'p4',
    name: '合肥市环巢湖湿地与水源涵养林碳汇工程',
    district: '合肥市',
    enterprise: '庐江县汤池林场林业碳汇合作社',
    projectType: '湿地与防护林综合碳汇提升项目',
    treeSpecies: '池杉、水杉、枫杨、芦苇湿地复合植被',
    areaMu: 8500,
    overallScore: 89,
    grade: 'AAA (优秀)',
    dimensions: {
      authenticity: { score: 91, grade: 'A' },
      additionality: { score: 88, grade: 'A-' },
      permanence: { score: 85, grade: 'A-' },
      consistency: { score: 92, grade: 'A+' },
      completeness: { score: 89, grade: 'A' },
    },
    valueMetrics: {
      totalCarbonStock: 110.8,
      currentValueWan: 685.2,
      annualValueWan: 79.6,
      carbonPrice: 51.0,
      irr: 9.8,
      npvWan: 78.5,
      paybackYears: 11,
      scenarios: {
        conservative: {
          priceDesc: '¥32/tCO2e (CCER底部保底价)',
          annualSink: 108.0,
          years: 30,
          totalSink: 3240.0,
          totalValueWan: 103.68,
          irr: 6.0,
          npvWan: 26.2,
          paybackYears: 16.8,
        },
        baseline: {
          priceDesc: '¥51/tCO2e (现货基准均价)',
          annualSink: 135.0,
          years: 30,
          totalSink: 4050.0,
          totalValueWan: 206.55,
          irr: 9.8,
          npvWan: 78.5,
          paybackYears: 11.0,
        },
        optimistic: {
          priceDesc: '¥82/tCO2e (生态补偿政策溢价)',
          annualSink: 162.0,
          years: 30,
          totalSink: 4860.0,
          totalValueWan: 398.52,
          irr: 14.2,
          npvWan: 148.6,
          paybackYears: 8.0,
        },
      },
    },
  },
];

// 碳价趋势预测数据点 (2026 ~ 2033 近期及未来趋势预测，对应 image_6a27124b.png)
const PRICE_TREND_YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];
const PRICE_TREND_DATA = {
  conservative: [15, 22, 28, 45, 52, 58, 68, 80],
  baseline: [20, 32, 38, 50, 60, 68, 78, 90],
  optimistic: [28, 42, 52, 60, 70, 78, 88, 100],
};

interface CarbonAssessmentViewProps {
  username?: string;
  onBackToPortal?: () => void;
  onNavigateToValueCalc?: () => void;
}

export const CarbonAssessmentView: React.FC<CarbonAssessmentViewProps> = ({
  username = 'admin',
  onBackToPortal,
  onNavigateToValueCalc,
}) => {
  // Top nav active tab: 'quality' (碳汇质量评估) | 'value' (碳汇价值评估 - 当前用户截图请求页面)
  const [topTab, setTopTab] = useState<'quality' | 'value'>('value');

  // Form selections
  const [selectedDistrict, setSelectedDistrict] = useState<string>('黄山市');
  const [selectedEnterprise, setSelectedEnterprise] = useState<string>('黄山生态林业发展集团有限公司');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('p1');

  // Currently loaded project
  const currentProject = PRESET_PROJECTS.find((p) => p.id === selectedProjectId) || PRESET_PROJECTS[0];

  // Active dimension filter for quality tab
  const [activeDimension, setActiveDimension] = useState<string>('all');

  // Hover state for price forecast chart
  const [hoveredYearIndex, setHoveredYearIndex] = useState<number | null>(null);

  // Evaluation trigger state
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleStartEvaluation = () => {
    setIsEvaluating(true);
    triggerToast(
      topTab === 'value'
        ? '正在测算碳汇资产现金流贴现模型 (DCF)、敏感性权重与价格预测...'
        : '正在调度卫星遥感监测数据与三维激光雷达点云，开始质量核证评估...'
    );
    setTimeout(() => {
      setIsEvaluating(false);
      triggerToast(
        topTab === 'value'
          ? '碳汇价值评估完成！核心指标与3大情景已更新至最新贴现参数'
          : '碳汇质量评估完成！综合评分已更新，报告凭证已生成'
      );
    }, 700);
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const matched = PRESET_PROJECTS.find((p) => p.district === dist);
    if (matched) {
      setSelectedEnterprise(matched.enterprise);
      setSelectedProjectId(matched.id);
    }
  };

  const handleProjectChange = (projId: string) => {
    setSelectedProjectId(projId);
    const proj = PRESET_PROJECTS.find((p) => p.id === projId);
    if (proj) {
      setSelectedDistrict(proj.district);
      setSelectedEnterprise(proj.enterprise);
    }
  };

  return (
    <div className="min-h-screen bg-[#040e09] text-slate-100 flex flex-col font-sans select-none animate-in fade-in">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-950/95 border border-emerald-500 rounded-xl text-xs text-emerald-200 shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{showToast}</span>
        </div>
      )}

      {/* 顶部主横幅导航 (对应截图: 林业碳汇评估系统 + 碳汇质量评估 / 碳汇价值评估 + 返回按钮) */}
      <header className="relative z-20 h-16 px-6 lg:px-8 bg-gradient-to-r from-[#031d13] via-[#05261a] to-[#041910] border-b border-emerald-800/60 shadow-lg flex items-center justify-between">
        {/* 左侧系统标题 */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-wide text-white drop-shadow-md">
            碳汇评估系统
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400/80 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
            {topTab === 'value' ? '资产估值与敏感性分析' : 'MRV 权威质量核证评级'}
          </span>
        </div>

        {/* 中间子系统切换 Tab (按截图样式: 碳汇质量评估 / 碳汇价值评估) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setTopTab('quality');
              triggerToast('已切换至碳汇质量评估板块');
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              topTab === 'quality'
                ? 'bg-white text-emerald-800 shadow-md scale-105'
                : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>碳汇质量评估</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTopTab('value');
              triggerToast('已切换至碳汇价值评估板块');
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              topTab === 'value'
                ? 'bg-white text-emerald-800 shadow-md scale-105'
                : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>碳汇价值评估</span>
          </button>
        </div>

        {/* 右侧返回中枢按钮 (对应截图右上角的绿色返回按钮) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToPortal}
            className="w-8 h-8 rounded-lg bg-[#00c88c] hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-105"
            title="返回系统功能中枢"
          >
            <ChevronLeft className="w-5 h-5 font-bold" />
          </button>
        </div>
      </header>

      {/* 主体内容区域 (背景颜色与全站暗色科技统一样式统一) */}
      <main className="flex-1 p-4 lg:p-6 space-y-4 max-w-[1720px] w-full mx-auto">
        {/* ===================== 1. 评估项目表单区域 (公用模块) ===================== */}
        <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl transition-all">
          {/* 模块标题 */}
          <div className="flex items-center justify-between mb-4 border-b border-[#18284c] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
              <h2 className="text-sm font-bold text-slate-100 tracking-wide">评估项目</h2>
            </div>
            <div className="text-[11px] text-slate-400">
              数据源: 全国碳市场 CCER 现货行情 / 国家林草局造林调查库 (2026近期数据)
            </div>
          </div>

          {/* 表单栅格输入 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 text-xs">
            {/* 行 1: 所属行政区划 & 所属企业 */}
            <div className="flex items-center gap-3">
              <label className="w-24 text-right text-slate-300 shrink-0">
                <span className="text-red-500 mr-1">*</span>所属行政区划
              </label>
              <div className="relative flex-1">
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] text-slate-100 rounded-lg focus:outline-none focus:border-[#00c88c] cursor-pointer"
                >
                  <option value="黄山市">黄山市</option>
                  <option value="六安市">六安市</option>
                  <option value="宣城市">宣城市</option>
                  <option value="合肥市">合肥市</option>
                  <option value="安庆市">安庆市</option>
                  <option value="池州市">池州市</option>
                  <option value="滁州市">滁州市</option>
                  <option value="蚌埠市">蚌埠市</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="w-20 text-right text-slate-300 shrink-0">
                <span className="text-red-500 mr-1">*</span>所属企业
              </label>
              <div className="relative flex-1">
                <select
                  value={selectedEnterprise}
                  onChange={(e) => setSelectedEnterprise(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] text-slate-100 rounded-lg focus:outline-none focus:border-[#00c88c] cursor-pointer"
                >
                  <option value="黄山生态林业发展集团有限公司">黄山生态林业发展集团有限公司</option>
                  <option value="安徽省金寨林业生态开发总公司">安徽省金寨林业生态开发总公司</option>
                  <option value="宣城市敬亭山国家森林经营开发公司">宣城市敬亭山国家森林经营开发公司</option>
                  <option value="庐江县汤池林场林业碳汇合作社">庐江县汤池林场林业碳汇合作社</option>
                  <option value="岳西县大别山翠兰林业专业合作社">岳西县大别山翠兰林业专业合作社</option>
                </select>
              </div>
            </div>

            {/* 行 2: 项目名称 & 项目类型 */}
            <div className="flex items-center gap-3">
              <label className="w-24 text-right text-slate-300 shrink-0">
                <span className="text-red-500 mr-1">*</span>项目名称
              </label>
              <div className="relative flex-1">
                <select
                  value={selectedProjectId}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] text-slate-100 rounded-lg focus:outline-none focus:border-[#00c88c] cursor-pointer"
                >
                  {PRESET_PROJECTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="w-20 text-right text-slate-400 shrink-0">项目类型</label>
              <div className="flex-1">
                <input
                  type="text"
                  readOnly
                  value={currentProject.projectType}
                  placeholder="选择项目后自动带出项目信息"
                  className="w-full px-3 py-2 bg-[#0c152e] border border-[#18284c] text-slate-300 rounded-lg cursor-not-allowed text-xs"
                />
              </div>
            </div>

            {/* 行 3: 林业树种 & 林业面积 */}
            <div className="flex items-center gap-3">
              <label className="w-24 text-right text-slate-400 shrink-0">林业树种</label>
              <div className="flex-1">
                <input
                  type="text"
                  readOnly
                  value={currentProject.treeSpecies}
                  placeholder="选择项目后自动带出项目信息"
                  className="w-full px-3 py-2 bg-[#0c152e] border border-[#18284c] text-slate-300 rounded-lg cursor-not-allowed text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="w-20 text-right text-slate-400 shrink-0">林业面积</label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  readOnly
                  value={currentProject.areaMu.toLocaleString()}
                  placeholder="选择项目后自动带出项目信息"
                  className="w-full px-3 py-2 pr-10 bg-[#0c152e] border border-[#18284c] text-slate-300 rounded-lg cursor-not-allowed font-mono text-xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  亩
                </span>
              </div>
            </div>
          </div>

          {/* 开始评估按钮 */}
          <div className="mt-5 pl-24 flex items-center gap-4">
            <button
              type="button"
              disabled={isEvaluating}
              onClick={handleStartEvaluation}
              className={`px-6 py-2 rounded-lg font-bold text-xs text-slate-950 transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                isEvaluating
                  ? 'bg-emerald-600/50 cursor-not-allowed text-slate-300'
                  : 'bg-[#00c88c] hover:bg-emerald-400 hover:shadow-emerald-500/30 hover:scale-[1.02]'
              }`}
            >
              {isEvaluating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>正在智能测算价值模型...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>开始评估</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedDistrict('黄山市');
                setSelectedEnterprise('黄山生态林业发展集团有限公司');
                setSelectedProjectId('p1');
                triggerToast('已重置项目参数至基准示范工程');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#101a36] hover:bg-[#18284c] border border-[#1d2d57] text-slate-300 text-xs cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>重置条件</span>
            </button>
          </div>
        </div>

        {/* ===================== 2. 评估结果区域 ===================== */}
        {/* 如果当前是【碳汇价值评估】(用户截图所请求的完整视图) */}
        {topTab === 'value' && (
          <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl space-y-6 transition-all">
            {/* 模块标题 */}
            <div className="flex items-center justify-between border-b border-[#18284c] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                <h2 className="text-sm font-bold text-slate-100 tracking-wide">评估结果</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => triggerToast('《2026年度林业碳汇资产价值评估与敏感性预测报告.pdf》已生成并开始下载')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#101a36] hover:bg-[#18284c] border border-[#1d2d57] text-emerald-400 hover:text-emerald-300 text-xs cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出价值评估报告</span>
                </button>
              </div>
            </div>

            {/* ---------- 部分 1: 核心价值指标 (对应截图 image_19410877.png) ---------- */}
            <div className="flex items-stretch gap-4">
              {/* 左侧绿色竖向标签: 核心价值指标 */}
              <div className="w-32 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center justify-center p-3 text-center shrink-0">
                <span className="text-xs font-bold text-[#00c88c] tracking-wider leading-relaxed">
                  核心价值指标
                </span>
              </div>

              {/* 6 个核心指标卡片 (碳汇总量、当前价值、年均价值、碳价、投资回报、投资回收期) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 flex-1">
                {/* 卡片 1: 碳汇总量 */}
                <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-3.5 flex flex-col justify-between items-center text-center hover:border-emerald-500/40 transition-colors">
                  <div className="text-xs text-slate-300">碳汇总量</div>
                  <div className="my-2">
                    <span className="text-2xl font-bold font-mono text-[#00c88c]">
                      {currentProject.valueMetrics.totalCarbonStock.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">tCO₂e</div>
                </div>

                {/* 卡片 2: 当前价值 */}
                <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-3.5 flex flex-col justify-between items-center text-center hover:border-emerald-500/40 transition-colors">
                  <div className="text-xs text-slate-300">当前价值</div>
                  <div className="my-2">
                    <span className="text-2xl font-bold font-mono text-[#00c88c]">
                      ¥{currentProject.valueMetrics.currentValueWan.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">万元</div>
                </div>

                {/* 卡片 3: 年均价值 */}
                <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-3.5 flex flex-col justify-between items-center text-center hover:border-emerald-500/40 transition-colors">
                  <div className="text-xs text-slate-300">年均价值</div>
                  <div className="my-2">
                    <span className="text-2xl font-bold font-mono text-[#00c88c]">
                      ¥{currentProject.valueMetrics.annualValueWan.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">万元/年</div>
                </div>

                {/* 卡片 4: 碳价 */}
                <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-3.5 flex flex-col justify-between items-center text-center hover:border-emerald-500/40 transition-colors">
                  <div className="text-xs text-slate-300">碳价</div>
                  <div className="my-2">
                    <span className="text-2xl font-bold font-mono text-[#00c88c]">
                      {currentProject.valueMetrics.carbonPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">元/tCO₂e</div>
                </div>

                {/* 卡片 5: 投资回报 */}
                <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-3.5 flex flex-col justify-between items-center text-center hover:border-emerald-500/40 transition-colors">
                  <div className="text-xs text-slate-300">投资回报</div>
                  <div className="my-2">
                    <span className="text-xl font-bold font-mono text-[#00c88c]">
                      IRR={currentProject.valueMetrics.irr.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    NPV=¥{currentProject.valueMetrics.npvWan.toFixed(0)}万
                  </div>
                </div>

                {/* 卡片 6: 投资回收期 */}
                <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-3.5 flex flex-col justify-between items-center text-center hover:border-emerald-500/40 transition-colors">
                  <div className="text-xs text-slate-300">投资回收期</div>
                  <div className="my-2">
                    <span className="text-2xl font-bold font-mono text-[#00c88c]">
                      {currentProject.valueMetrics.paybackYears}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">年</div>
                </div>
              </div>
            </div>

            {/* ---------- 部分 2: 价值评估模型 (对应截图 image_56b68066.png，重新更新为真实合理对比数据) ---------- */}
            <div className="flex items-stretch gap-4">
              {/* 左侧绿色竖向标签: 价值评估模型 */}
              <div className="w-32 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center justify-center p-3 text-center shrink-0">
                <span className="text-xs font-bold text-[#00c88c] tracking-wider leading-relaxed">
                  价值评估模型
                </span>
              </div>

              {/* 右侧 3 大情景对比堆叠卡片 (保守估计、基准估计、乐观估计) */}
              <div className="flex-1 space-y-3">
                {/* 场景 1: 保守估计 */}
                <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-3.5 hover:border-emerald-500/40 transition-colors">
                  <div className="text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>场景1: 保守估计</span>
                    </span>
                    <span className="text-[11px] text-blue-400 font-normal">底部支撑假设</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 font-mono text-slate-300">
                      <div>碳价: {currentProject.valueMetrics.scenarios.conservative.priceDesc}</div>
                      <div>
                        碳汇量: {currentProject.valueMetrics.scenarios.conservative.annualSink} tCO2e x {currentProject.valueMetrics.scenarios.conservative.years}年 = {currentProject.valueMetrics.scenarios.conservative.totalSink.toLocaleString()} tCO2e
                      </div>
                    </div>
                    <div className="space-y-1.5 font-mono text-slate-300 md:text-right">
                      <div>总价值: ¥{currentProject.valueMetrics.scenarios.conservative.totalValueWan.toFixed(2)} 万元</div>
                      <div className="text-slate-400 text-[11px]">
                        IRR: {currentProject.valueMetrics.scenarios.conservative.irr}% &nbsp;&nbsp;
                        NPV: ¥{currentProject.valueMetrics.scenarios.conservative.npvWan}万 &nbsp;&nbsp;
                        回收期: {currentProject.valueMetrics.scenarios.conservative.paybackYears}年
                      </div>
                    </div>
                  </div>
                </div>

                {/* 场景 2: 基准估计 (更新为真实基准模型测算参数) */}
                <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-3.5 hover:border-emerald-500/40 transition-colors">
                  <div className="text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00c88c]" />
                      <span>场景2: 基准估计</span>
                    </span>
                    <span className="text-[11px] text-[#00c88c] font-normal">现货市场公允价</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 font-mono text-slate-300">
                      <div>碳价: {currentProject.valueMetrics.scenarios.baseline.priceDesc}</div>
                      <div>
                        碳汇量: {currentProject.valueMetrics.scenarios.baseline.annualSink} tCO2e x {currentProject.valueMetrics.scenarios.baseline.years}年 = {currentProject.valueMetrics.scenarios.baseline.totalSink.toLocaleString()} tCO2e
                      </div>
                    </div>
                    <div className="space-y-1.5 font-mono text-slate-300 md:text-right">
                      <div className="text-emerald-400 font-bold">总价值: ¥{currentProject.valueMetrics.scenarios.baseline.totalValueWan.toFixed(2)} 万元</div>
                      <div className="text-slate-400 text-[11px]">
                        IRR: {currentProject.valueMetrics.scenarios.baseline.irr}% &nbsp;&nbsp;
                        NPV: ¥{currentProject.valueMetrics.scenarios.baseline.npvWan}万 &nbsp;&nbsp;
                        回收期: {currentProject.valueMetrics.scenarios.baseline.paybackYears}年
                      </div>
                    </div>
                  </div>
                </div>

                {/* 场景 3: 乐观估计 (更新为流动性溢价参数) */}
                <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-3.5 hover:border-emerald-500/40 transition-colors">
                  <div className="text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>场景3: 乐观估计</span>
                    </span>
                    <span className="text-[11px] text-amber-400 font-normal">绿色金融溢价</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 font-mono text-slate-300">
                      <div>碳价: {currentProject.valueMetrics.scenarios.optimistic.priceDesc}</div>
                      <div>
                        碳汇量: {currentProject.valueMetrics.scenarios.optimistic.annualSink} tCO2e x {currentProject.valueMetrics.scenarios.optimistic.years}年 = {currentProject.valueMetrics.scenarios.optimistic.totalSink.toLocaleString()} tCO2e
                      </div>
                    </div>
                    <div className="space-y-1.5 font-mono text-slate-300 md:text-right">
                      <div className="text-amber-300 font-bold">总价值: ¥{currentProject.valueMetrics.scenarios.optimistic.totalValueWan.toFixed(2)} 万元</div>
                      <div className="text-slate-400 text-[11px]">
                        IRR: {currentProject.valueMetrics.scenarios.optimistic.irr}% &nbsp;&nbsp;
                        NPV: ¥{currentProject.valueMetrics.scenarios.optimistic.npvWan}万 &nbsp;&nbsp;
                        回收期: {currentProject.valueMetrics.scenarios.optimistic.paybackYears}年
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------- 部分 3: 敏感性分析 & 碳价趋势预测 (对应截图 image_6a27124b.png) ---------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* 左栏: 敏感性分析 (tornado 图 / 敏感性排序) */}
              <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-4 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-[#18284c] pb-2">
                    <span className="text-xs font-bold text-slate-200">敏感性分析</span>
                    <span className="text-[11px] text-slate-400 font-mono">tornado图 (敏感性排序)</span>
                  </div>

                  {/* 4 大关键变量敏感性条形格图 (按截图样式: 碳价、碳汇量、成本、风险) */}
                  <div className="space-y-3.5 text-xs">
                    {/* 变量 1: 碳价 (影响度 45%) */}
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-slate-300 text-right">碳价</span>
                      <div className="flex-1 flex items-center gap-2">
                        {/* 10 个方块 (深灰实心格模拟截图视觉) */}
                        <div className="flex gap-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-3.5 h-6 rounded-xs bg-[#18284c] border border-[#233866] hover:bg-emerald-500/70 transition-colors"
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#00c88c] font-mono ml-auto">
                          影响度: 45%
                        </span>
                      </div>
                    </div>

                    {/* 变量 2: 碳汇量 (影响度 30%) */}
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-slate-300 text-right">碳汇量</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex gap-1">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-3.5 h-6 rounded-xs bg-[#18284c] border border-[#233866] hover:bg-emerald-500/70 transition-colors"
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#00c88c] font-mono ml-auto">
                          影响度: 30%
                        </span>
                      </div>
                    </div>

                    {/* 变量 3: 抚育贴现率 (影响度 15%) */}
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-slate-300 text-right">贴现率</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex gap-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-3.5 h-6 rounded-xs bg-[#18284c] border border-[#233866] hover:bg-emerald-500/70 transition-colors"
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#00c88c] font-mono ml-auto">
                          影响度: 15%
                        </span>
                      </div>
                    </div>

                    {/* 变量 4: 气候折损率 (影响度 10%) */}
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-slate-300 text-right">气候风险</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex gap-1">
                          {Array.from({ length: 2 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-3.5 h-6 rounded-xs bg-[#18284c] border border-[#233866] hover:bg-emerald-500/70 transition-colors"
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#00c88c] font-mono ml-auto">
                          影响度: 10%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 底部黄色提示框 (对应截图) */}
                <div className="mt-5 p-2.5 rounded-lg bg-amber-500/10 border-l-4 border-amber-500 flex items-center gap-2 text-xs text-amber-200">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>结论: 碳价是最大变量，价格波动 ±20% → NPV 波动 ±90%</span>
                </div>
              </div>

              {/* 右栏: 碳价趋势预测 (折线图，时间同步为 2026 ~ 2033 近期及未来年份) */}
              <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-4 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">碳价趋势预测</span>
                    <span className="text-[11px] text-slate-400 font-mono">碳价 (元/tCO2e)</span>
                  </div>

                  {/* 图例 (按截图: 保守 蓝色、基准 绿色、乐观 橙色) */}
                  <div className="flex items-center justify-end gap-5 mb-2 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span>保守</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00c88c]" />
                      <span>基准</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>乐观</span>
                    </div>
                  </div>

                  {/* SVG 趋势折线图 (8 个年份点: 2026 ~ 2033) */}
                  <div className="relative w-full h-[180px]">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 540 160">
                      {/* 背景网格线与 Y 轴 (0, 20, 40, 60, 80, 100) */}
                      {[100, 80, 60, 40, 20, 0].map((val, idx) => {
                        const y = 15 + idx * 24;
                        return (
                          <g key={val}>
                            <text
                              x="24"
                              y={y + 3}
                              textAnchor="end"
                              className="fill-slate-500 text-[9px] font-mono select-none"
                            >
                              {val}
                            </text>
                            <line
                              x1="28"
                              y1={y}
                              x2="530"
                              y2={y}
                              stroke="#18284c"
                              strokeDasharray={idx === 5 ? 'none' : '2 2'}
                              strokeWidth={idx === 5 ? '1.5' : '1'}
                            />
                          </g>
                        );
                      })}

                      {/* 计算三条折线折点: x 从 38 到 520 (共7个间距, 间距 = 482 / 7 = 68.8) */}
                      {(() => {
                        const getCoords = (dataArr: number[]) =>
                          dataArr.map((v, i) => ({
                            x: 40 + i * 68.5,
                            y: 135 - (v / 100) * 120,
                            val: v,
                            year: PRICE_TREND_YEARS[i],
                          }));

                        const ptsConservative = getCoords(PRICE_TREND_DATA.conservative);
                        const ptsBaseline = getCoords(PRICE_TREND_DATA.baseline);
                        const ptsOptimistic = getCoords(PRICE_TREND_DATA.optimistic);

                        const makePath = (pts: { x: number; y: number }[]) =>
                          pts.reduce(
                            (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                            ''
                          );

                        return (
                          <>
                            {/* 活跃指示垂线 */}
                            {hoveredYearIndex !== null && (
                              <line
                                x1={ptsBaseline[hoveredYearIndex].x}
                                y1="15"
                                x2={ptsBaseline[hoveredYearIndex].x}
                                y2="135"
                                stroke="#38bdf8"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                              />
                            )}

                            {/* 1. 保守曲线 (蓝色) */}
                            <path
                              d={makePath(ptsConservative)}
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2.5"
                            />
                            {ptsConservative.map((p, i) => (
                              <circle
                                key={`c-${i}`}
                                cx={p.x}
                                cy={p.y}
                                r={hoveredYearIndex === i ? 4.5 : 3}
                                fill="#3b82f6"
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredYearIndex(i)}
                                onMouseLeave={() => setHoveredYearIndex(null)}
                              />
                            ))}

                            {/* 2. 基准曲线 (绿色 #00c88c) */}
                            <path
                              d={makePath(ptsBaseline)}
                              fill="none"
                              stroke="#00c88c"
                              strokeWidth="2.5"
                            />
                            {ptsBaseline.map((p, i) => (
                              <circle
                                key={`b-${i}`}
                                cx={p.x}
                                cy={p.y}
                                r={hoveredYearIndex === i ? 4.5 : 3}
                                fill="#00c88c"
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredYearIndex(i)}
                                onMouseLeave={() => setHoveredYearIndex(null)}
                              />
                            ))}

                            {/* 3. 乐观曲线 (橙色 #f59e0b) */}
                            <path
                              d={makePath(ptsOptimistic)}
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="2.5"
                            />
                            {ptsOptimistic.map((p, i) => (
                              <circle
                                key={`o-${i}`}
                                cx={p.x}
                                cy={p.y}
                                r={hoveredYearIndex === i ? 4.5 : 3}
                                fill="#f59e0b"
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredYearIndex(i)}
                                onMouseLeave={() => setHoveredYearIndex(null)}
                              />
                            ))}
                          </>
                        );
                      })()}
                    </svg>

                    {/* X 轴年份标签 (2026 ~ 2033 近期及未来年份) */}
                    <div className="flex items-center justify-between pl-8 pr-3 text-[10px] text-slate-400 font-mono select-none">
                      {PRICE_TREND_YEARS.map((yr, idx) => (
                        <span
                          key={yr}
                          className={`transition-colors cursor-pointer ${
                            hoveredYearIndex === idx ? 'text-[#00c88c] font-bold' : ''
                          }`}
                          onMouseEnter={() => setHoveredYearIndex(idx)}
                          onMouseLeave={() => setHoveredYearIndex(null)}
                        >
                          {yr}
                        </span>
                      ))}
                    </div>

                    {/* 悬浮数值浮窗 */}
                    {hoveredYearIndex !== null && (
                      <div className="absolute top-1 right-2 bg-[#061026] border border-[#00c88c] rounded-lg p-2 shadow-xl text-[10px] text-slate-200 z-10 pointer-events-none">
                        <div className="font-bold text-white mb-0.5">
                          {PRICE_TREND_YEARS[hoveredYearIndex]} 年碳价预测
                        </div>
                        <div className="flex gap-2 font-mono">
                          <span className="text-blue-400">
                            保守: ¥{PRICE_TREND_DATA.conservative[hoveredYearIndex]}
                          </span>
                          <span className="text-emerald-400">
                            基准: ¥{PRICE_TREND_DATA.baseline[hoveredYearIndex]}
                          </span>
                          <span className="text-amber-400">
                            乐观: ¥{PRICE_TREND_DATA.optimistic[hoveredYearIndex]}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 底部黄色提示框 (对应截图) */}
                <div className="mt-5 p-2.5 rounded-lg bg-amber-500/10 border-l-4 border-amber-500 flex items-center gap-2 text-xs text-amber-200">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>预测方法: ARIMA模型 + 政策因子 + 市场情绪</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 如果当前是【碳汇质量评估】(上一轮实现的高保真核证视图) */}
        {topTab === 'quality' && (
          <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl transition-all">
            {/* 模块标题 */}
            <div className="flex items-center justify-between mb-4 border-b border-[#18284c] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                <h2 className="text-sm font-bold text-slate-100 tracking-wide">评估结果</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => triggerToast('《2026年度林业碳汇质量等级评定与审定报告(可信区块链存证).pdf》已生成并开始下载')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#101a36] hover:bg-[#18284c] border border-[#1d2d57] text-emerald-400 hover:text-emerald-300 text-xs cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出评估报告</span>
                </button>
              </div>
            </div>

            {/* 左右分栏布局 */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
              {/* 左侧评分卡片 (xl:col-span-5) */}
              <div className="xl:col-span-5 bg-[#0a142e] border border-[#18284c] rounded-xl p-4 flex flex-col justify-between shadow-inner">
                <div>
                  <div className="flex justify-center mb-3">
                    <span className="px-5 py-1 bg-[#101a36] border border-[#1d2d57] text-slate-200 text-xs font-bold rounded-md shadow-sm">
                      总体评分
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#18284c]/80 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">质量等级:</span>
                      <span className="text-emerald-400 font-bold tracking-wide">
                        {currentProject.grade}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">综合得分:</span>
                      <span className="text-2xl font-bold font-mono text-[#38bdf8]">
                        {currentProject.overallScore}
                      </span>
                      <span className="text-xs text-slate-400">分</span>
                    </div>
                  </div>
                </div>

                {/* 5 个核心维度卡片 */}
                <div className="grid grid-cols-5 gap-2 mt-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveDimension((prev) => (prev === 'authenticity' ? 'all' : 'authenticity'))}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeDimension === 'authenticity'
                        ? 'bg-[#101a36] border-[#00c88c] shadow-lg shadow-emerald-500/20'
                        : 'bg-[#091126] border-[#18284c] hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="text-[11px] text-slate-300 font-medium mb-1">真实性</div>
                    <div className="text-lg font-bold font-mono text-emerald-400">
                      {currentProject.dimensions.authenticity.score}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {currentProject.dimensions.authenticity.grade}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDimension((prev) => (prev === 'additionality' ? 'all' : 'additionality'))}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeDimension === 'additionality'
                        ? 'bg-[#101a36] border-[#00c88c] shadow-lg shadow-emerald-500/20'
                        : 'bg-[#091126] border-[#18284c] hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="text-[11px] text-slate-300 font-medium mb-1">额外性</div>
                    <div className="text-lg font-bold font-mono text-[#38bdf8]">
                      {currentProject.dimensions.additionality.score}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {currentProject.dimensions.additionality.grade}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDimension((prev) => (prev === 'permanence' ? 'all' : 'permanence'))}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeDimension === 'permanence'
                        ? 'bg-[#101a36] border-[#00c88c] shadow-lg shadow-emerald-500/20'
                        : 'bg-[#091126] border-[#18284c] hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="text-[11px] text-slate-300 font-medium mb-1">持久性</div>
                    <div className="text-lg font-bold font-mono text-teal-300">
                      {currentProject.dimensions.permanence.score}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {currentProject.dimensions.permanence.grade}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDimension((prev) => (prev === 'consistency' ? 'all' : 'consistency'))}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeDimension === 'consistency'
                        ? 'bg-[#101a36] border-[#00c88c] shadow-lg shadow-emerald-500/20'
                        : 'bg-[#091126] border-[#18284c] hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="text-[11px] text-slate-300 font-medium mb-1">一致性</div>
                    <div className="text-lg font-bold font-mono text-cyan-400">
                      {currentProject.dimensions.consistency.score}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {currentProject.dimensions.consistency.grade}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDimension((prev) => (prev === 'completeness' ? 'all' : 'completeness'))}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      activeDimension === 'completeness'
                        ? 'bg-[#101a36] border-[#00c88c] shadow-lg shadow-emerald-500/20'
                        : 'bg-[#091126] border-[#18284c] hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="text-[11px] text-slate-300 font-medium mb-1">完整性</div>
                    <div className="text-lg font-bold font-mono text-emerald-300">
                      {currentProject.dimensions.completeness.score}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {currentProject.dimensions.completeness.grade}
                    </div>
                  </button>
                </div>

                <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-[#18284c]/60 pt-2">
                  <span>符合生态环境部 CCER 森林碳汇权威核验标准规范</span>
                  <span className="text-emerald-400">已通过 CMA / CNAS 双重认证</span>
                </div>
              </div>

              {/* 中间指示器 (>> 双箭头) */}
              <div className="hidden xl:flex xl:col-span-1 items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-emerald-400/80">
                  <div className="flex items-center -space-x-1.5 text-2xl font-black">
                    <ChevronRight className="w-6 h-6 stroke-[3]" />
                    <ChevronRight className="w-6 h-6 stroke-[3]" />
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                    VERIFY
                  </span>
                </div>
              </div>

              {/* 右侧证据表格 */}
              <div className="xl:col-span-6 space-y-4">
                {/* 维度 1: 真实性评估 */}
                <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-3.5 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">维度1: 真实性评估</span>
                      <div className="w-4 h-4 rounded-full bg-[#00c88c] flex items-center justify-center text-slate-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      得分: {currentProject.dimensions.authenticity.score} / 100
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#101a36] text-slate-300 border-b border-[#18284c]">
                          <th className="py-2 px-3 font-semibold border-r border-[#18284c]">评估项</th>
                          <th className="py-2 px-3 font-semibold text-center w-20 border-r border-[#18284c]">得分</th>
                          <th className="py-2 px-3 font-semibold border-r border-[#18284c]">证据</th>
                          <th className="py-2 px-3 font-semibold text-center w-16">状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#18284c]/80 text-slate-200">
                        <tr className="hover:bg-[#101a36]/60 transition-colors">
                          <td className="py-2 px-3 border-r border-[#18284c]/80">数据来源可靠性</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-emerald-400 border-r border-[#18284c]/80">95</td>
                          <td className="py-2 px-3 text-slate-300 border-r border-[#18284c]/80">二类清单+遥感验证 (高分六号空间分辨率2米)</td>
                          <td className="py-2 px-3 text-center">
                            <div className="w-4 h-4 mx-auto rounded-full bg-[#00c88c] flex items-center justify-center text-slate-950">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#101a36]/60 transition-colors">
                          <td className="py-2 px-3 border-r border-[#18284c]/80">监测方案完整性</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-emerald-400 border-r border-[#18284c]/80">90</td>
                          <td className="py-2 px-3 text-slate-300 border-r border-[#18284c]/80">12个固定标准样地监测站 + 涡度通量微气象站</td>
                          <td className="py-2 px-3 text-center">
                            <div className="w-4 h-4 mx-auto rounded-full bg-[#00c88c] flex items-center justify-center text-slate-950">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#101a36]/60 transition-colors">
                          <td className="py-2 px-3 border-r border-[#18284c]/80">MRV体系完备性</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-emerald-400 border-r border-[#18284c]/80">88</td>
                          <td className="py-2 px-3 text-slate-300 border-r border-[#18284c]/80">已通过国家资质第三方审定机构独立核签</td>
                          <td className="py-2 px-3 text-center">
                            <div className="w-4 h-4 mx-auto rounded-full bg-[#00c88c] flex items-center justify-center text-slate-950">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#101a36]/60 transition-colors">
                          <td className="py-2 px-3 border-r border-[#18284c]/80">数据时效性</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-emerald-400 border-r border-[#18284c]/80">92</td>
                          <td className="py-2 px-3 text-emerald-300 font-medium border-r border-[#18284c]/80">2026年第3季度外业样地复核实测数据 (近期)</td>
                          <td className="py-2 px-3 text-center">
                            <div className="w-4 h-4 mx-auto rounded-full bg-[#00c88c] flex items-center justify-center text-slate-950">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 维度 2: 额外性评估 */}
                <div className="bg-[#0a142e] border border-[#18284c] rounded-xl p-3.5 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">维度2: 额外性评估</span>
                      <div className="w-4 h-4 rounded-full bg-[#00c88c] flex items-center justify-center text-slate-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#38bdf8]">
                      得分: {currentProject.dimensions.additionality.score} / 100
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#101a36] text-slate-300 border-b border-[#18284c]">
                          <th className="py-2 px-3 font-semibold border-r border-[#18284c]">评估项</th>
                          <th className="py-2 px-3 font-semibold text-center w-20 border-r border-[#18284c]">得分</th>
                          <th className="py-2 px-3 font-semibold border-r border-[#18284c]">证据</th>
                          <th className="py-2 px-3 font-semibold text-center w-16">状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#18284c]/80 text-slate-200">
                        <tr className="hover:bg-[#101a36]/60 transition-colors">
                          <td className="py-2 px-3 border-r border-[#18284c]/80">基线情景合理性</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-[#38bdf8] border-r border-[#18284c]/80">82</td>
                          <td className="py-2 px-3 text-slate-300 border-r border-[#18284c]/80">历史森林砍伐情景建模与自发生长基准线论证充分</td>
                          <td className="py-2 px-3 text-center">
                            <div className="w-4 h-4 mx-auto rounded-full bg-[#00c88c] flex items-center justify-center text-slate-950">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#101a36]/60 transition-colors">
                          <td className="py-2 px-3 border-r border-[#18284c]/80">财务额外性</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-[#38bdf8] border-r border-[#18284c]/80">90</td>
                          <td className="py-2 px-3 text-slate-300 border-r border-[#18284c]/80">财务内部收益率IRR (4.8%) 低于行业基准收益率 (8.0%)</td>
                          <td className="py-2 px-3 text-center">
                            <div className="w-4 h-4 mx-auto rounded-full bg-[#00c88c] flex items-center justify-center text-slate-950">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#101a36]/60 transition-colors">
                          <td className="py-2 px-3 border-r border-[#18284c]/80">政策与法规额外性</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-[#38bdf8] border-r border-[#18284c]/80">85</td>
                          <td className="py-2 px-3 text-slate-300 border-r border-[#18284c]/80">非国家强制法定义务绿化工程，属自主自愿投资</td>
                          <td className="py-2 px-3 text-center">
                            <div className="w-4 h-4 mx-auto rounded-full bg-[#00c88c] flex items-center justify-center text-slate-950">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#101a36]/60 transition-colors">
                          <td className="py-2 px-3 border-r border-[#18284c]/80">普遍实践与技术壁垒</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-[#38bdf8] border-r border-[#18284c]/80">88</td>
                          <td className="py-2 px-3 text-slate-300 border-r border-[#18284c]/80">突破喀斯特与高陡坡立地造林技术瓶颈，专家评审通过</td>
                          <td className="py-2 px-3 text-center">
                            <div className="w-4 h-4 mx-auto rounded-full bg-[#00c88c] flex items-center justify-center text-slate-950">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
