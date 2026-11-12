import React, { useState } from 'react';
import {
  Layers,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  MapPin,
  X,
  RotateCcw,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  CheckCircle2,
  TreePine,
  Activity,
  BarChart3,
  Globe,
  Map as MapIcon,
  Ruler,
  Crosshair,
  Gauge,
  TrendingUp,
  Sparkles,
  Factory,
  Flame,
  Download,
} from 'lucide-react';

interface OneMapViewProps {
  onBackToPortal: () => void;
  username: string;
  onNavigateToProjectDev?: () => void;
}

export interface CityCarbonStock {
  id: string;
  name: string;
  stock: number; // 碳储备量 (万吨)
  sink: number;  // 碳汇量 (万吨)
  forestArea: number; // 森林面积 (万亩)
  projectCount: number; // 碳汇项目数
  density: number; // 固碳密度 (吨/亩)
  x: number; // percentage on map
  y: number; // percentage on map
  colorRange: string;
  fillColor: string;
  pathD: string; // SVG path of city boundary
}

export const CARBON_STOCK_LEGEND = [
  { label: '>= 150', color: '#047857', bg: 'bg-emerald-700', text: 'text-emerald-300', desc: '特高碳储区' },
  { label: '120 ~ 150', color: '#0d9488', bg: 'bg-teal-600', text: 'text-teal-300', desc: '高碳储区' },
  { label: '100 ~ 120', color: '#14b8a6', bg: 'bg-teal-500', text: 'text-teal-200', desc: '中高碳储区' },
  { label: '80 ~ 100', color: '#0284c7', bg: 'bg-sky-600', text: 'text-sky-300', desc: '中度碳储区' },
  { label: '60 ~ 80', color: '#0891b2', bg: 'bg-cyan-600', text: 'text-cyan-300', desc: '次中碳储区' },
  { label: '40 ~ 60', color: '#38bdf8', bg: 'bg-sky-400', text: 'text-sky-200', desc: '低碳储区' },
  { label: '20 ~ 40', color: '#84cc16', bg: 'bg-lime-500', text: 'text-lime-300', desc: '少林碳储区' },
  { label: '< 20', color: '#eab308', bg: 'bg-amber-500', text: 'text-amber-300', desc: '微量碳储区' },
];

export const CITY_CARBON_DATA: CityCarbonStock[] = [
  {
    id: 'hefei',
    name: '合肥市',
    stock: 158,
    sink: 162,
    forestArea: 68.5,
    projectCount: 38,
    density: 2.31,
    x: 60,
    y: 53,
    colorRange: '>= 150',
    fillColor: 'rgba(5, 150, 105, 0.48)',
    pathD: 'M 870,430 L 970,420 L 1020,490 L 1000,580 L 890,580 L 850,510 Z',
  },
  {
    id: 'wuhu',
    name: '芜湖市',
    stock: 121,
    sink: 105,
    forestArea: 42.0,
    projectCount: 24,
    density: 2.88,
    x: 66,
    y: 67,
    colorRange: '120 ~ 150',
    fillColor: 'rgba(13, 148, 136, 0.45)',
    pathD: 'M 1010,560 L 1080,570 L 1100,640 L 1020,670 L 980,620 Z',
  },
  {
    id: 'huaibei',
    name: '淮北市',
    stock: 98,
    sink: 102,
    forestArea: 32.5,
    projectCount: 18,
    density: 3.01,
    x: 52,
    y: 22,
    colorRange: '80 ~ 100',
    fillColor: 'rgba(2, 132, 199, 0.42)',
    pathD: 'M 780,140 L 840,110 L 850,220 L 810,240 L 770,190 Z',
  },
  {
    id: 'anqing',
    name: '安庆市',
    stock: 158,
    sink: 162,
    forestArea: 86.4,
    projectCount: 32,
    density: 1.83,
    x: 50,
    y: 75,
    colorRange: '>= 150',
    fillColor: 'rgba(5, 150, 105, 0.45)',
    pathD: 'M 820,630 L 920,640 L 910,750 L 800,800 L 700,770 L 710,680 Z',
  },
  {
    id: 'luan',
    name: '六安市',
    stock: 158,
    sink: 162,
    forestArea: 102.8,
    projectCount: 36,
    density: 1.54,
    x: 48,
    y: 56,
    colorRange: '>= 150',
    fillColor: 'rgba(5, 150, 105, 0.45)',
    pathD: 'M 770,420 L 860,450 L 870,550 L 830,640 L 680,650 L 650,540 L 730,460 Z',
  },
  {
    id: 'chuzhou',
    name: '滁州市',
    stock: 158,
    sink: 162,
    forestArea: 64.2,
    projectCount: 28,
    density: 2.46,
    x: 67,
    y: 44,
    colorRange: '>= 150',
    fillColor: 'rgba(5, 150, 105, 0.45)',
    pathD: 'M 1030,310 L 1150,340 L 1180,450 L 1120,520 L 980,480 L 940,400 L 960,350 Z',
  },
  {
    id: 'huainan',
    name: '淮南市',
    stock: 158,
    sink: 162,
    forestArea: 36.8,
    projectCount: 20,
    density: 4.29,
    x: 54,
    y: 42,
    colorRange: '>= 150',
    fillColor: 'rgba(5, 150, 105, 0.45)',
    pathD: 'M 780,330 L 880,330 L 910,400 L 860,440 L 770,420 Z',
  },
  {
    id: 'fuyang',
    name: '阜阳市',
    stock: 158,
    sink: 162,
    forestArea: 48.0,
    projectCount: 22,
    density: 3.29,
    x: 41,
    y: 38,
    colorRange: '>= 150',
    fillColor: 'rgba(5, 150, 105, 0.45)',
    pathD: 'M 670,300 L 780,310 L 770,400 L 660,430 L 570,380 L 600,320 Z',
  },
  {
    id: 'suzhou',
    name: '宿州市',
    stock: 158,
    sink: 162,
    forestArea: 55.6,
    projectCount: 25,
    density: 2.84,
    x: 58,
    y: 18,
    colorRange: '>= 150',
    fillColor: 'rgba(5, 150, 105, 0.45)',
    pathD: 'M 840,110 L 980,100 L 1050,150 L 1020,230 L 910,240 L 840,180 Z',
  },
  {
    id: 'huangshan',
    name: '黄山市',
    stock: 186,
    sink: 192,
    forestArea: 124.0,
    projectCount: 42,
    density: 1.50,
    x: 64,
    y: 88,
    colorRange: '>= 150',
    fillColor: 'rgba(4, 120, 87, 0.55)',
    pathD: 'M 970,770 L 1120,770 L 1160,860 L 1080,895 L 980,885 L 940,820 Z',
  },
  {
    id: 'xuancheng',
    name: '宣城市',
    stock: 142,
    sink: 148,
    forestArea: 78.5,
    projectCount: 30,
    density: 1.81,
    x: 73,
    y: 74,
    colorRange: '120 ~ 150',
    fillColor: 'rgba(20, 184, 166, 0.45)',
    pathD: 'M 1050,600 L 1150,610 L 1220,700 L 1180,780 L 1060,750 L 1020,670 Z',
  },
  {
    id: 'bozhou',
    name: '亳州市',
    stock: 85,
    sink: 88,
    forestArea: 31.0,
    projectCount: 15,
    density: 2.74,
    x: 46,
    y: 28,
    colorRange: '80 ~ 100',
    fillColor: 'rgba(2, 132, 199, 0.42)',
    pathD: 'M 680,180 L 780,150 L 810,240 L 780,310 L 670,300 L 640,240 Z',
  },
  {
    id: 'bengbu',
    name: '蚌埠市',
    stock: 112,
    sink: 118,
    forestArea: 39.4,
    projectCount: 19,
    density: 2.84,
    x: 60,
    y: 32,
    colorRange: '100 ~ 120',
    fillColor: 'rgba(13, 148, 136, 0.42)',
    pathD: 'M 850,230 L 1020,230 L 1030,310 L 960,350 L 870,340 L 840,280 Z',
  },
  {
    id: 'maanshan',
    name: '马鞍山市',
    stock: 92,
    sink: 96,
    forestArea: 28.6,
    projectCount: 16,
    density: 3.22,
    x: 68,
    y: 62,
    colorRange: '80 ~ 100',
    fillColor: 'rgba(2, 132, 199, 0.42)',
    pathD: 'M 1020,500 L 1120,520 L 1140,590 L 1050,600 L 1010,540 Z',
  },
  {
    id: 'tongling',
    name: '铜陵市',
    stock: 76,
    sink: 82,
    forestArea: 24.5,
    projectCount: 14,
    density: 3.10,
    x: 59,
    y: 70,
    colorRange: '60 ~ 80',
    fillColor: 'rgba(8, 145, 178, 0.42)',
    pathD: 'M 940,600 L 1010,610 L 990,680 L 920,670 L 920,620 Z',
  },
  {
    id: 'chizhou',
    name: '池州市',
    stock: 138,
    sink: 144,
    forestArea: 68.2,
    projectCount: 26,
    density: 2.02,
    x: 58,
    y: 79,
    colorRange: '120 ~ 150',
    fillColor: 'rgba(20, 184, 166, 0.45)',
    pathD: 'M 920,670 L 1000,680 L 1010,780 L 920,800 L 890,740 Z',
  },
];

export interface CityEmissionData {
  id: string;
  name: string;
  enterprise: number; // 重点企业排放 (万吨) (Green bar in screenshot)
  sector: number;     // 重点领域排放 (万吨) (Blue bar in screenshot)
  total: number;      // 综合排放/配额 (万吨) (Orange bar in screenshot)
  reduction: number;  // 治理累计减排量 (万吨)
  compliance: number; // 履约达成率 (%)
  x: number;
  y: number;
  colorRange: string;
}

export const CITY_EMISSION_DATA: CityEmissionData[] = [
  { id: 'hefei', name: '合肥市', enterprise: 158, sector: 142, total: 175, reduction: 58, compliance: 99.2, x: 60, y: 53, colorRange: '>= 150' },
  { id: 'wuhu', name: '芜湖市', enterprise: 135, sector: 118, total: 152, reduction: 45, compliance: 98.6, x: 66, y: 67, colorRange: '120 ~ 150' },
  { id: 'huaibei', name: '淮北市', enterprise: 120, sector: 105, total: 138, reduction: 38, compliance: 97.4, x: 52, y: 22, colorRange: '80 ~ 100' },
  { id: 'anqing', name: '安庆市', enterprise: 148, sector: 132, total: 168, reduction: 52, compliance: 98.1, x: 50, y: 75, colorRange: '>= 150' },
  { id: 'luan', name: '六安市', enterprise: 140, sector: 126, total: 156, reduction: 46, compliance: 97.8, x: 47, y: 55, colorRange: '>= 150' },
  { id: 'chuzhou', name: '滁州市', enterprise: 152, sector: 138, total: 170, reduction: 54, compliance: 98.5, x: 67, y: 44, colorRange: '>= 150' },
  { id: 'huainan', name: '淮南市', enterprise: 130, sector: 115, total: 146, reduction: 40, compliance: 96.9, x: 54, y: 42, colorRange: '>= 150' },
  { id: 'fuyang', name: '阜阳市', enterprise: 145, sector: 128, total: 162, reduction: 50, compliance: 97.5, x: 41, y: 38, colorRange: '>= 150' },
  { id: 'suzhou', name: '宿州市', enterprise: 138, sector: 122, total: 154, reduction: 44, compliance: 97.2, x: 58, y: 18, colorRange: '>= 150' },
  { id: 'huangshan', name: '黄山市', enterprise: 95, sector: 82, total: 108, reduction: 62, compliance: 99.8, x: 64, y: 88, colorRange: '80 ~ 100' },
  { id: 'xuancheng', name: '宣城市', enterprise: 128, sector: 114, total: 142, reduction: 48, compliance: 98.7, x: 73, y: 74, colorRange: '120 ~ 150' },
  { id: 'bozhou', name: '亳州市', enterprise: 115, sector: 98, total: 128, reduction: 35, compliance: 96.5, x: 46, y: 28, colorRange: '80 ~ 100' },
  { id: 'bengbu', name: '蚌埠市', enterprise: 125, sector: 110, total: 140, reduction: 42, compliance: 97.6, x: 60, y: 32, colorRange: '100 ~ 120' },
  { id: 'maanshan', name: '马鞍山市', enterprise: 155, sector: 140, total: 172, reduction: 55, compliance: 98.3, x: 68, y: 62, colorRange: '>= 150' },
  { id: 'tongling', name: '铜陵市', enterprise: 110, sector: 95, total: 124, reduction: 36, compliance: 97.0, x: 59, y: 70, colorRange: '60 ~ 80' },
  { id: 'chizhou', name: '池州市', enterprise: 118, sector: 102, total: 132, reduction: 44, compliance: 98.2, x: 58, y: 79, colorRange: '100 ~ 120' },
];

export const EMISSION_CATEGORIES = [
  { id: 'enterprise', name: '重点企业', value: 570, percent: 10.0, color: '#10b981', bg: 'bg-emerald-500' },
  { id: 'sector', name: '重点领域', value: 563, percent: 9.9, color: '#84cc16', bg: 'bg-lime-500' },
  { id: 'cities', name: '重点地市', value: 563, percent: 9.9, color: '#eab308', bg: 'bg-amber-500' },
  { id: 'units', name: '重点单位', value: 563, percent: 9.9, color: '#06b6d4', bg: 'bg-cyan-500' },
  { id: 'dept', name: '责任部门', value: 563, percent: 9.9, color: '#6366f1', bg: 'bg-indigo-500' },
  { id: 'other', name: '其他排放', value: 100, percent: 1.8, color: '#f97316', bg: 'bg-orange-500' },
];

export const EMISSION_TREND_DATA = [
  { year: 2021, actual: 280, quota: 400 },
  { year: 2022, actual: 560, quota: 680 },
  { year: 2023, actual: 780, quota: 910 },
  { year: 2024, actual: 920, quota: 1120 },
  { year: 2025, actual: 1050, quota: 1310 },
  { year: 2026, actual: 1180, quota: 1520 },
];

export const GOVERNANCE_TREND_DATA = [
  { year: 2025, reduction: 820 },
  { year: 2026, reduction: 1050 },
  { year: 2027, reduction: 860 },
  { year: 2028, reduction: 1220 },
  { year: 2029, reduction: 780 },
  { year: 2030, reduction: 1140 },
];

interface SpatialFeature {
  id: number;
  name: string;
  level: string;
  type: string;
  location: string;
  x: number; // percentage on map
  y: number; // percentage on map
  desc: string;
  areaMu: number; // 万亩
  ndvi: number;
  annualCO2: number; // 吨
}

const INITIAL_FEATURES: SpatialFeature[] = [
  {
    id: 1,
    name: '观湖亭',
    level: '一级',
    type: '湿地生态景观样地',
    location: '合肥市 · 巢湖国家湿地公园',
    x: 61,
    y: 53,
    desc: '环巢湖森林生态防护林带与水生植被碳库观测点',
    areaMu: 12.8,
    ndvi: 0.88,
    annualCO2: 14200,
  },
  {
    id: 2,
    name: '芷岸花汀',
    level: '一级',
    type: '阔叶水源涵养林',
    location: '六安市 · 大别山北麓森林样地',
    x: 48,
    y: 58,
    desc: '淠河水源地高郁闭度落叶阔叶红松混交固碳区',
    areaMu: 24.5,
    ndvi: 0.91,
    annualCO2: 28600,
  },
  {
    id: 3,
    name: '湿地遗址',
    level: '一级',
    type: '泥炭沼泽与泛区样地',
    location: '蚌埠市 · 淮河水系生态廊道',
    x: 58,
    y: 33,
    desc: '淮河中游湿地生态蓄水碳汇与草本沼泽监测区',
    areaMu: 18.2,
    ndvi: 0.84,
    annualCO2: 19800,
  },
  {
    id: 4,
    name: '文化园',
    level: '一级',
    type: '近自然群落示范样地',
    location: '芜湖市 · 鸠兹生态林斑',
    x: 69,
    y: 61,
    desc: '沿江丘陵次生常绿落叶阔叶混交林生物量观测站',
    areaMu: 15.6,
    ndvi: 0.86,
    annualCO2: 17500,
  },
  {
    id: 5,
    name: '百鸟滩',
    level: '二级',
    type: '湿地候鸟栖息水禽林',
    location: '安庆市 · 菜子湖湿地自然保护区',
    x: 52,
    y: 71,
    desc: '长江下游浅水湖泊湿地植被与滩涂蓝碳通量塔',
    areaMu: 31.4,
    ndvi: 0.89,
    annualCO2: 34200,
  },
  {
    id: 6,
    name: '杨树林',
    level: '二级',
    type: '速生防护用材林',
    location: '宿州市 · 黄河故道防风固沙林',
    x: 56,
    y: 19,
    desc: '淮北平原农田防护林网与深根系速生杨高蓄积区',
    areaMu: 22.0,
    ndvi: 0.82,
    annualCO2: 23100,
  },
];

export const OneMapView: React.FC<OneMapViewProps> = ({ onBackToPortal, username, onNavigateToProjectDev }) => {
  // Top Tabs: 林业资源 | 碳储备 | 碳排放 (DEFAULT)
  const [activeTab, setActiveTab] = useState<'resource' | 'carbon_stock' | 'emission'>('emission');

  // Selected City in Carbon Stock mode
  const [selectedCity, setSelectedCity] = useState<CityCarbonStock | null>(CITY_CARBON_DATA[0]);
  const [selectedEmissionCity, setSelectedEmissionCity] = useState<CityEmissionData | null>(CITY_EMISSION_DATA[0]);
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
  const [activeLegendTier, setActiveLegendTier] = useState<string | null>(null);
  const [stockViewType, setStockViewType] = useState<'quadrant' | 'dial' | 'spectrum'>('quadrant');

  // Emission View Specific States
  const [isBasemapSettingOpen, setIsBasemapSettingOpen] = useState(false);
  const [showToponyms, setShowToponyms] = useState(true);
  const [hoveredEmissionYear, setHoveredEmissionYear] = useState<number | null>(null);
  const [hoveredGovernanceYear, setHoveredGovernanceYear] = useState<number | null>(null);
  const [selectedEmissionCategory, setSelectedEmissionCategory] = useState<string | null>(null);
  const [hoveredEmissionCatId, setHoveredEmissionCatId] = useState<string | null>(null);

  // Search & Query Panel States
  const [queryLayer, setQueryLayer] = useState('景点');
  const [queryMode, setQueryMode] = useState<'attr' | 'spatial'>('attr');
  const [featureNameInput, setFeatureNameInput] = useState('');
  const [featureDescInput, setFeatureDescInput] = useState('');
  const [levelSelect, setLevelSelect] = useState('all');
  const [typeSelect, setTypeSelect] = useState('all');
  const [isQueryPanelOpen, setIsQueryPanelOpen] = useState(false); // default closed so full choropleth is visible

  // Selected pinpoint for map inspector in resource mode
  const [selectedFeature, setSelectedFeature] = useState<SpatialFeature | null>(null);

  // Map Tools State
  const [mapScale, setMapScale] = useState(1);
  const [mapBaseType, setMapBaseType] = useState<'satellite' | 'terrain' | 'night'>('satellite');
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureToast, setMeasureToast] = useState('');

  // Tree species donut page toggle (1/2 in screenshot)
  const [treeSpeciesPage, setTreeSpeciesPage] = useState<1 | 2>(1);

  // Detail modal state for "明细 >"
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [hoveredCityIndex, setHoveredCityIndex] = useState<number | null>(null);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);

  // Filter features based on search
  const filteredFeatures = INITIAL_FEATURES.filter((f) => {
    const matchesName = !featureNameInput || f.name.includes(featureNameInput);
    const matchesDesc = !featureDescInput || f.desc.includes(featureDescInput);
    const matchesLevel = levelSelect === 'all' || f.level === levelSelect;
    return matchesName && matchesDesc && matchesLevel;
  });

  const handleResetQuery = () => {
    setFeatureNameInput('');
    setFeatureDescInput('');
    setLevelSelect('all');
    setTypeSelect('all');
  };

  const handleMeasureArea = () => {
    setIsMeasuring(true);
    setMeasureToast('已开启空间多边形测面工具：当前选中林班估算面积为 8,642.5 亩 (576.2 公顷)');
    setTimeout(() => {
      setIsMeasuring(false);
      setTimeout(() => setMeasureToast(''), 4000);
    }, 1200);
  };

  return (
    <div className="relative w-full h-screen bg-[#07130c] text-slate-100 overflow-hidden font-sans select-none flex flex-col">
      {/* Toast alert */}
      {measureToast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-950/95 border border-emerald-400 text-xs text-white rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{measureToast}</span>
        </div>
      )}

      {/* Top Header Navigation matching screenshot */}
      <header className="relative z-30 h-16 px-6 bg-gradient-to-b from-[#031c12] via-[#051f15] to-[#03150e]/95 border-b border-emerald-800/60 backdrop-blur-md flex items-center justify-between">
        {/* Left: Brand title & pinyin */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPortal}
            type="button"
            className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 hover:text-white transition-colors"
            title="返回功能大厅"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                碳汇一张图
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/90 border border-emerald-800/80 px-2 py-0.5 rounded">
                GIS 遥感底座
              </span>
            </div>
            <div className="text-[9px] font-mono text-emerald-400/70 tracking-widest uppercase">
              TAN HUI YI ZHANG TU · SPATIAL REMOTE SENSING
            </div>
          </div>
        </div>

        {/* Center: 3 Business Dimension Tabs (林业资源 / 碳储备 / 碳排放) */}
        <div className="flex items-center gap-2 p-1 bg-black/40 border border-emerald-900/60 rounded-xl">
          <button
            onClick={() => setActiveTab('resource')}
            className={`px-5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'resource'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            林业资源
          </button>
          <button
            onClick={() => setActiveTab('carbon_stock')}
            className={`px-5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'carbon_stock'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            碳储备
          </button>
          <button
            onClick={() => setActiveTab('emission')}
            className={`px-5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'emission'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            碳排放
          </button>
        </div>

        {/* Right: User info & return portal */}
        <div className="flex items-center gap-3 text-xs">
          {onNavigateToProjectDev && (
            <button
              onClick={onNavigateToProjectDev}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 rounded-lg text-emerald-300 hover:text-white transition-colors"
              title="前往碳汇项目开发管理"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>项目开发管理</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400">操作员:</span>
            <span className="font-mono text-emerald-400 font-semibold">{username || 'admin'}</span>
          </div>

          <button
            onClick={onBackToPortal}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-600/60 rounded-lg text-emerald-200 hover:text-white transition-colors"
          >
            <span>返回中枢</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Interactive Map & Floating Overlay Panels */}
      <div className="relative flex-1 w-full h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Full-bleed Geographic Satellite Map Canvas with Realistic Relief */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${mapScale})` }}
        >
          {/* Authentic satellite terrain backdrop representation (Anhui watershed & forestry belt) */}
          <div className="absolute inset-0 bg-[#0d2217]">
            {/* Satellite topographic landform raster texture */}
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 1600 900"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Mountainous texture gradients */}
                <linearGradient id="terrainGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e3a2b" />
                  <stop offset="40%" stopColor="#2e4e39" />
                  <stop offset="70%" stopColor="#1c3325" />
                  <stop offset="100%" stopColor="#284433" />
                </linearGradient>

                <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0b2c3d" />
                  <stop offset="100%" stopColor="#081e2b" />
                </linearGradient>

                <linearGradient id="mountainRidge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d6349" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#12271c" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Base terrain */}
              <rect width="1600" height="900" fill="url(#terrainGrad)" />

              {/* Dabie Mountain & Southern Anhui forest ridges */}
              <path
                d="M100,550 Q300,480 500,520 T900,600 T1200,750 L1600,850 L1600,900 L0,900 Z"
                fill="url(#mountainRidge)"
                opacity="0.9"
              />
              <path
                d="M50,650 Q280,590 580,630 T980,720 L1300,900 L0,900 Z"
                fill="#163122"
                opacity="0.85"
              />
              <path
                d="M0,0 Q400,80 800,40 T1600,100 L1600,280 Q1200,220 800,260 T0,240 Z"
                fill="#254231"
                opacity="0.6"
              />

              {/* Yangtze River & Huai River Waterways */}
              <path
                d="M0,320 Q400,340 700,310 T1300,360 L1600,380"
                fill="none"
                stroke="url(#waterGrad)"
                strokeWidth="14"
                opacity="0.75"
              />
              <path
                d="M400,700 Q800,620 1100,600 T1600,650"
                fill="none"
                stroke="url(#waterGrad)"
                strokeWidth="20"
                opacity="0.85"
              />

              {/* Chaohu Lake & Major Lakes */}
              <ellipse cx="980" cy="480" rx="60" ry="32" fill="url(#waterGrad)" opacity="0.9" />
              <ellipse cx="1200" cy="240" rx="45" ry="24" fill="url(#waterGrad)" opacity="0.8" />

              {/* Elevation isoline topo contour waves */}
              <g stroke="rgba(52,211,153,0.12)" strokeWidth="0.8" fill="none">
                <path d="M200,700 C400,640 600,660 800,720 S1100,780 1300,740" />
                <path d="M150,730 C350,670 550,690 750,750 S1050,810 1250,770" />
                <path d="M100,760 C300,700 500,720 700,780 S1000,840 1200,800" />
                <path d="M400,200 C600,160 800,190 1000,220 S1300,210 1500,250" />
              </g>

              {/* Remote Sensing NDVI Heatmap Tint Overlay */}
              <circle cx="980" cy="740" r="160" fill="rgba(16,185,129,0.16)" filter="blur(25px)" />
              <circle cx="480" cy="620" r="180" fill="rgba(16,185,129,0.14)" filter="blur(30px)" />
              <circle cx="950" cy="250" r="140" fill="rgba(52,211,153,0.12)" filter="blur(20px)" />
            </svg>

            {/* [CHOROPLETH THEMATIC LAYER] Active when activeTab === 'carbon_stock' */}
            {/* [CHOROPLETH THEMATIC LAYER] Active when activeTab === 'carbon_stock' || activeTab === 'emission' */}
            {(activeTab === 'carbon_stock' || activeTab === 'emission') && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-auto"
                viewBox="0 0 1600 900"
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id="cityGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 16 Administrative City Choropleth Region Polygons */}
                <g id="choropleth-polygons">
                  {CITY_CARBON_DATA.map((city) => {
                    const isSelectedStock = activeTab === 'carbon_stock' && selectedCity?.id === city.id;
                    const isSelectedEmission = activeTab === 'emission' && selectedEmissionCity?.id === city.id;
                    const isSelected = isSelectedStock || isSelectedEmission;
                    const isHovered = hoveredCityId === city.id;
                    const isLegendMatched = !activeLegendTier || city.colorRange === activeLegendTier;

                    return (
                      <path
                        key={city.id}
                        d={city.pathD}
                        fill={city.fillColor}
                        fillOpacity={isLegendMatched ? (isSelected || isHovered ? 0.75 : 0.48) : 0.15}
                        stroke={isSelected || isHovered ? '#34d399' : 'rgba(52,211,153,0.7)'}
                        strokeWidth={isSelected || isHovered ? 3 : 1.5}
                        strokeDasharray={isSelected ? 'none' : undefined}
                        filter={isSelected || isHovered ? 'url(#cityGlow)' : undefined}
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredCityId(city.id)}
                        onMouseLeave={() => setHoveredCityId(null)}
                        onClick={() => {
                          if (activeTab === 'emission') {
                            const em = CITY_EMISSION_DATA.find((e) => e.id === city.id);
                            if (em) setSelectedEmissionCity(em);
                          } else {
                            setSelectedCity(city);
                          }
                        }}
                      />
                    );
                  })}
                </g>
              </svg>
            )}

            {/* Geographic Cities & Toponyms / Micro-Pillars Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {CITY_CARBON_DATA.map((city) => {
                const isSelectedStock = activeTab === 'carbon_stock' && selectedCity?.id === city.id;
                const isSelectedEmission = activeTab === 'emission' && selectedEmissionCity?.id === city.id;
                const isSelected = isSelectedStock || isSelectedEmission;
                const isHovered = hoveredCityId === city.id;
                const emData = CITY_EMISSION_DATA.find((e) => e.id === city.id) || CITY_EMISSION_DATA[0];

                return (
                  <div
                    key={city.id}
                    style={{ top: `${city.y}%`, left: `${city.x}%` }}
                    onClick={() => {
                      if (activeTab === 'emission') {
                        setSelectedEmissionCity(emData);
                      } else {
                        setSelectedCity(city);
                      }
                    }}
                    onMouseEnter={() => setHoveredCityId(city.id)}
                    onMouseLeave={() => setHoveredCityId(null)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer z-10 group"
                  >
                    {/* Ripple ping for selected city */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-emerald-400 animate-ping opacity-60" />
                    )}

                    {/* Clean Unified GIS City Tag Badge (Replaces cluttered 3-column micro bars) */}
                    {showToponyms && (
                      <div className={`px-2.5 py-1 rounded-xl border backdrop-blur-md shadow-xl transition-all flex flex-col items-center select-none ${
                        isSelected
                          ? 'bg-emerald-950/95 border-emerald-400 scale-110 shadow-emerald-500/50 ring-2 ring-emerald-400/50 z-20'
                          : isHovered
                          ? 'bg-slate-900/95 border-emerald-500 scale-105 z-10'
                          : 'bg-black/80 border-emerald-900/80 hover:bg-slate-900/90 hover:border-emerald-700'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            activeTab === 'emission' ? 'bg-teal-400' : 'bg-emerald-400'
                          } ${isSelected ? 'animate-ping' : ''}`} />
                          <span className={`text-xs font-bold leading-tight ${
                            isSelected ? 'text-emerald-200' : 'text-slate-100'
                          }`}>
                            {city.name}
                          </span>
                        </div>

                        {activeTab === 'emission' && (
                          <div className="flex items-center gap-1 text-[9px] font-mono mt-0.5">
                            <span className="text-teal-300 font-bold">{emData.total}万t</span>
                          </div>
                        )}

                        {activeTab === 'carbon_stock' && (
                          <div className="flex items-center gap-1 text-[9px] font-mono mt-0.5">
                            <span className="text-emerald-400 font-bold">{city.stock}万t</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Interactive Spatial Plot Markers on Map (When in Resource Mode) */}
            {activeTab === 'resource' && INITIAL_FEATURES.map((feature) => {
              const isSelected = selectedFeature?.id === feature.id;
              return (
                <div
                  key={feature.id}
                  onClick={() => setSelectedFeature(feature)}
                  style={{ top: `${feature.y}%`, left: `${feature.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                >
                  {/* Ping ripple effect */}
                  {isSelected && (
                    <span className="absolute -inset-2 rounded-full bg-emerald-400 animate-ping opacity-60" />
                  )}

                  {/* Marker Pin Icon */}
                  <div className={`p-1.5 rounded-full border shadow-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-emerald-500 border-white scale-125 shadow-emerald-400/80 ring-4 ring-emerald-500/30'
                      : 'bg-slate-900/90 border-emerald-400/80 hover:bg-emerald-800 hover:scale-110'
                  }`}>
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-300'}`} />
                  </div>

                  {/* Marker Text Label */}
                  <div className="mt-1 px-2 py-0.5 rounded bg-black/80 border border-emerald-800 text-[10px] text-white font-medium whitespace-nowrap shadow-md">
                    {feature.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected City Emission Dossier Inspector Card (Center Popup for Emission Mode) */}
        {activeTab === 'emission' && selectedEmissionCity && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-88 bg-slate-950/95 border border-emerald-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2.5 border-b border-emerald-900/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
                  <Factory className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{selectedEmissionCity.name}</span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      {selectedEmissionCity.colorRange}梯队
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">重点工业控排与年度减排治理监测点</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmissionCity(null)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-3 space-y-2.5 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="bg-emerald-950/40 border border-emerald-900/60 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-sans">重点企业排放</div>
                  <div className="text-lg font-black text-emerald-400 mt-0.5">{selectedEmissionCity.enterprise} <span className="text-xs font-normal text-slate-400">万吨</span></div>
                </div>
                <div className="bg-sky-950/40 border border-sky-900/60 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-sans">重点领域排放</div>
                  <div className="text-lg font-black text-sky-400 mt-0.5">{selectedEmissionCity.sector} <span className="text-xs font-normal text-slate-400">万吨</span></div>
                </div>
                <div className="bg-amber-950/40 border border-amber-900/60 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-sans">综合基准配额</div>
                  <div className="text-lg font-black text-amber-400 mt-0.5">{selectedEmissionCity.total} <span className="text-xs font-normal text-slate-400">万吨</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900 text-center font-mono text-[11px]">
                <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[9px] text-slate-400 font-sans">治理累计减排量</div>
                  <div className="text-teal-300 font-bold">{selectedEmissionCity.reduction} 万吨</div>
                </div>
                <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[9px] text-slate-400 font-sans">综合履约达成率</div>
                  <div className="text-emerald-300 font-bold">{selectedEmissionCity.compliance}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected City Carbon Dossier Inspector Card (Center Popup for Carbon Stock Mode) */}
        {activeTab === 'carbon_stock' && selectedCity && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-88 bg-slate-950/95 border border-emerald-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2.5 border-b border-emerald-900/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
                  <TreePine className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{selectedCity.name}</span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      {selectedCity.colorRange}万吨级
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">安徽省碳汇资源与储备考核节点</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-3 space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="bg-emerald-950/40 border border-emerald-900/60 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-sans">现存碳储备量</div>
                  <div className="text-xl font-black text-emerald-400 mt-0.5">{selectedCity.stock} <span className="text-xs font-normal text-slate-400">万吨</span></div>
                </div>
                <div className="bg-teal-950/40 border border-teal-900/60 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-sans">年碳汇产出量</div>
                  <div className="text-xl font-black text-teal-300 mt-0.5">{selectedCity.sink} <span className="text-xs font-normal text-slate-400">万吨/年</span></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-900 text-center font-mono text-[11px]">
                <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[9px] text-slate-400 font-sans">森林面积</div>
                  <div className="text-white font-bold">{selectedCity.forestArea} 万亩</div>
                </div>
                <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[9px] text-slate-400 font-sans">碳汇项目数</div>
                  <div className="text-amber-300 font-bold">{selectedCity.projectCount} 个</div>
                </div>
                <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800/80">
                  <div className="text-[9px] text-slate-400 font-sans">固碳密度</div>
                  <div className="text-teal-300 font-bold">{selectedCity.density} t/亩</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Sample Plot Inspector Card (When in Resource Mode) */}
        {activeTab === 'resource' && selectedFeature && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-80 bg-slate-950/90 border border-emerald-500/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-950">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-sm">{selectedFeature.name}</span>
                <span className="text-[10px] text-emerald-300 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                  {selectedFeature.level}
                </span>
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 space-y-1.5 text-xs text-slate-300">
              <div className="text-[11px] text-slate-400">{selectedFeature.location}</div>
              <div className="text-[11px] text-slate-300 leading-relaxed">{selectedFeature.desc}</div>
              
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono">
                <div className="bg-slate-900/80 p-1.5 rounded">
                  <div className="text-[9px] text-slate-400">样地规模</div>
                  <div className="text-emerald-400 font-bold">{selectedFeature.areaMu} 万亩</div>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded">
                  <div className="text-[9px] text-slate-400">植被 NDVI</div>
                  <div className="text-white font-bold">{selectedFeature.ndvi}</div>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded">
                  <div className="text-[9px] text-slate-400">年碳吸收</div>
                  <div className="text-teal-300 font-bold">{(selectedFeature.annualCO2 / 1000).toFixed(1)}k t</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEFT PANEL: 一体化碳汇综合态势控制台 */}
        {isLeftPanelOpen ? (
          <div className="absolute top-4 left-4 bottom-4 w-[360px] z-20 bg-[#04150e]/95 border border-emerald-800/80 rounded-2xl p-4 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* [HEADER] Master Console Header */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/80 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm tracking-wide">
                      {activeTab === 'resource' ? '碳汇资源态势' : activeTab === 'carbon_stock' ? '碳储量综合统计' : '减排量成效'}
                    </span>
                    <span className="text-[9px] font-mono font-semibold text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                      实时核算
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {activeTab === 'carbon_stock' ? '活立木碳库与土壤碳汇空间盘查' : '空间栅格遥感与通量在线监测'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowDetailModal(true)}
                  className="px-2 py-1 text-[11px] font-medium text-emerald-300 hover:text-white bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-800/80 rounded-md transition-colors flex items-center gap-1"
                  title="查看明细台账"
                >
                  <span>明细</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsLeftPanelOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="收起态势看板"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* VIEW MODE A: 碳储备 (Carbon Stock) - Matches Screenshot */}
            {/* ========================================================= */}
            {activeTab === 'carbon_stock' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden pt-2 space-y-3">
                {/* [SECTION 1]: 碳储量统计 */}
                <div className="pb-3 border-b border-emerald-950/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-3 bg-emerald-400 rounded-sm" />
                      <span className="font-bold text-white text-xs tracking-wide">碳储量统计</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDetailModal(true)}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                    >
                      <span>明细</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* 3 Metric Cards Matching Screenshot: 880万亩 / 563万吨 / 256项目数 */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Card 1: 森林总面积 */}
                    <div className="bg-slate-950/80 border border-emerald-950 hover:border-emerald-700/80 rounded-xl p-2.5 flex flex-col justify-between transition-all group">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black font-mono text-emerald-400 tabular-nums">
                          880
                        </span>
                        <span className="text-[10px] text-slate-300 font-sans">万亩</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">森林总面积</div>
                      <div className="text-[8px] font-mono text-emerald-500/80 mt-0.5">占全省面积30.2%</div>
                    </div>

                    {/* Card 2: 总碳储量 */}
                    <div className="bg-slate-950/80 border border-emerald-950 hover:border-emerald-700/80 rounded-xl p-2.5 flex flex-col justify-between transition-all group">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black font-mono text-teal-300 tabular-nums">
                          563
                        </span>
                        <span className="text-[10px] text-slate-300 font-sans">万吨</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">总碳储量</div>
                      <div className="text-[8px] font-mono text-teal-400/80 mt-0.5">密度 2.19 t/亩</div>
                    </div>

                    {/* Card 3: 碳汇项目数 */}
                    <div className="bg-slate-950/80 border border-emerald-950 hover:border-amber-700/80 rounded-xl p-2.5 flex flex-col justify-between transition-all group">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black font-mono text-amber-300 tabular-nums">
                          256
                        </span>
                        <span className="text-[10px] text-slate-300 font-sans">个</span>
                      </div>
                      <div className="text-[10px] text-amber-300/90 mt-1">碳汇项目数</div>
                      <div className="text-[8px] font-mono text-amber-400/70 mt-0.5">已核准备案在管</div>
                    </div>
                  </div>
                </div>

                {/* [SECTION 2]: 区域统计与碳效平衡矩阵 (彻底摒弃横向柱状图，采用四象限散点平衡盘与微极表盘) */}
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  {/* Section Title & View Switcher */}
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-950">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-3 bg-teal-400 rounded-sm" />
                      <span className="font-bold text-white text-xs tracking-wide">区域统计与碳效平衡</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px]">
                      {/* View Mode Toggle: Quadrant vs Polar Dials vs Spline Wave */}
                      <div className="flex p-0.5 bg-slate-950 border border-emerald-900/60 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setStockViewType('quadrant')}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all font-medium ${
                            stockViewType === 'quadrant'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="四象限碳效平衡散点矩阵"
                        >
                          <Crosshair className="w-3 h-3" />
                          <span>象限散点</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setStockViewType('dial')}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all font-medium ${
                            stockViewType === 'dial'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="极坐标微型环形表盘阵列"
                        >
                          <Gauge className="w-3 h-3" />
                          <span>微表盘</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setStockViewType('spectrum')}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all font-medium ${
                            stockViewType === 'spectrum'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="碳流连续波谱曲线"
                        >
                          <Activity className="w-3 h-3" />
                          <span>流谱波峰</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowDetailModal(true)}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 ml-1"
                      >
                        <span>明细</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* DISPLAY MODE 1 (DEFAULT): 碳效平衡四象限散点矩阵 (No bars!) */}
                  {/* ========================================================= */}
                  {stockViewType === 'quadrant' && (
                    <div className="flex-1 flex flex-col justify-between overflow-hidden py-1.5 space-y-2">
                      {/* Quadrant Legend & Coordinate Header */}
                      <div className="flex items-center justify-between text-[9px] text-slate-400 px-0.5">
                        <span className="flex items-center gap-1.5 text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>X轴: 碳储备量(万t) · Y轴: 碳汇量(万t/年)</span>
                        </span>
                        <span className="font-mono text-[9px] text-teal-300 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-800/60">
                          双维平衡态
                        </span>
                      </div>

                      {/* Interactive 2D Quadrant Canvas */}
                      <div className="relative w-full h-[185px] bg-[#02110a]/90 border border-emerald-900/60 rounded-xl p-1.5 overflow-hidden shadow-inner">
                        <svg viewBox="0 0 324 175" className="w-full h-full select-none overflow-visible">
                          <defs>
                            {/* Radial Glow Gradient for Quadrant I */}
                            <radialGradient id="quad1Glow" cx="80%" cy="20%" r="60%">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </radialGradient>
                            <radialGradient id="quadActiveGlow" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.6" />
                              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
                            </radialGradient>
                          </defs>

                          {/* Quadrant Tint Backgrounds */}
                          <rect x="135" y="10" width="180" height="75" fill="url(#quad1Glow)" rx="4" />

                          {/* Reference Gridlines */}
                          <line x1="30" y1="20" x2="315" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 3" />
                          <line x1="30" y1="52" x2="315" y2="52" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 3" />
                          <line x1="30" y1="120" x2="315" y2="120" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 3" />
                          <line x1="30" y1="150" x2="315" y2="150" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 3" />

                          <line x1="75" y1="10" x2="75" y2="155" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 3" />
                          <line x1="195" y1="10" x2="195" y2="155" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 3" />
                          <line x1="255" y1="10" x2="255" y2="155" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 3" />

                          {/* Central Quadrant Crosshair Dividing Axis: X=135 (115万吨), Y=85 (115万吨) */}
                          <line x1="30" y1="85" x2="315" y2="85" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                          <line x1="135" y1="10" x2="135" y2="155" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

                          {/* Quadrant Strategic Zone Badges */}
                          <text x="310" y="22" textAnchor="end" fill="#34d399" fontSize="8" fontWeight="bold" opacity="0.85">
                            Ⅰ 储汇双优·领跑区
                          </text>
                          <text x="38" y="22" textAnchor="start" fill="#38bdf8" fontSize="8" fontWeight="bold" opacity="0.7">
                            Ⅱ 碳汇高潜·成长区
                          </text>
                          <text x="38" y="148" textAnchor="start" fill="#94a3b8" fontSize="8" fontWeight="bold" opacity="0.65">
                            Ⅲ 潜力攻坚·培育区
                          </text>
                          <text x="310" y="148" textAnchor="end" fill="#f59e0b" fontSize="8" fontWeight="bold" opacity="0.75">
                            Ⅳ 稳态储备·压舱区
                          </text>

                          {/* Diagonal Equilibrium Balance Line (Sink = Stock line) */}
                          <line x1="45" y1="145" x2="295" y2="25" stroke="#2dd4bf" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.35" />
                          <text x="270" y="38" textAnchor="end" fill="#2dd4bf" fontSize="7" opacity="0.6" fontStyle="italic">
                            平衡等位线 (汇=储)
                          </text>

                          {/* Coordinate Axis Labels */}
                          <text x="25" y="16" textAnchor="start" fill="#6ee7b7" fontSize="7" fontFamily="sans-serif">
                            ↑年碳汇(万t)
                          </text>
                          <text x="315" y="166" textAnchor="end" fill="#6ee7b7" fontSize="7" fontFamily="sans-serif">
                            碳储备(万t)→
                          </text>

                          {/* City Coordinate Points Rendering */}
                          {CITY_CARBON_DATA.map((c, idx) => {
                            const isSelected = selectedCity?.id === c.id;
                            const isHovered = hoveredCityId === c.id;

                            // Calculate coordinate positions
                            // Stock: range 50 ~ 200 -> mapped to X: 45 ~ 300 (dx=255)
                            const baseRatioX = Math.max(0, Math.min(1, (c.stock - 50) / 150));
                            // Sink: range 50 ~ 200 -> mapped to Y: 145 ~ 25 (dy=120, inverted)
                            const baseRatioY = Math.max(0, Math.min(1, (c.sink - 50) / 150));

                            // Distinct jitter offset to separate cities with identical data
                            const jitterX = ((idx % 4) - 1.5) * 5.5;
                            const jitterY = (Math.floor(idx / 4) - 1.5) * 4.5;

                            const cx = 45 + baseRatioX * 245 + jitterX;
                            const cy = 145 - baseRatioY * 115 + jitterY;

                            // Tier color matching legend
                            const nodeColor =
                              c.stock >= 150 ? '#10b981' : c.stock >= 120 ? '#14b8a6' : c.stock >= 100 ? '#06b6d4' : '#0284c7';

                            return (
                              <g
                                key={c.id}
                                className="cursor-pointer transition-transform duration-200"
                                onMouseEnter={() => setHoveredCityId(c.id)}
                                onMouseLeave={() => setHoveredCityId(null)}
                                onClick={() => setSelectedCity(c)}
                              >
                                {/* Outer pulsing ring if selected or hovered */}
                                {(isSelected || isHovered) && (
                                  <>
                                    <circle
                                      cx={cx}
                                      cy={cy}
                                      r="11"
                                      fill="none"
                                      stroke={nodeColor}
                                      strokeWidth="1.2"
                                      opacity="0.8"
                                      className="animate-ping"
                                    />
                                    <circle
                                      cx={cx}
                                      cy={cy}
                                      r="8"
                                      fill="url(#quadActiveGlow)"
                                    />
                                  </>
                                )}

                                {/* Main Node Circle */}
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={isSelected || isHovered ? 4.8 : 3.6}
                                  fill={nodeColor}
                                  stroke={isSelected || isHovered ? '#ffffff' : '#022c22'}
                                  strokeWidth={isSelected || isHovered ? 1.5 : 1}
                                  className="transition-all"
                                />

                                {/* City Short Label */}
                                <text
                                  x={cx}
                                  y={cy - 6}
                                  textAnchor="middle"
                                  fill={isSelected || isHovered ? '#ffffff' : '#cbd5e1'}
                                  fontSize={isSelected || isHovered ? '8.5' : '7.5'}
                                  fontWeight={isSelected || isHovered ? 'bold' : 'normal'}
                                  style={{
                                    textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                                    pointerEvents: 'none',
                                  }}
                                >
                                  {c.name.replace('市', '')}
                                </text>
                              </g>
                            );
                          })}
                        </svg>

                        {/* Floating Tooltip HUD inside canvas when city is hovered */}
                        {hoveredCityId && (() => {
                          const hCity = CITY_CARBON_DATA.find((c) => c.id === hoveredCityId);
                          if (!hCity) return null;
                          const netDelta = hCity.sink - hCity.stock;
                          return (
                            <div className="absolute top-2 right-2 pointer-events-none bg-slate-950/95 border border-emerald-500 rounded-lg px-2 py-1 shadow-xl text-[9px] backdrop-blur-md animate-in fade-in duration-100">
                              <div className="flex items-center gap-1.5 font-bold text-white">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>{hCity.name}</span>
                                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950 px-1 rounded">
                                  {hCity.projectCount}项
                                </span>
                              </div>
                              <div className="text-slate-300 font-mono mt-0.5 space-x-2">
                                <span>储: <strong>{hCity.stock}</strong>万t</span>
                                <span>汇: <strong>{hCity.sink}</strong>万t</span>
                                <span className={netDelta >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                                  净: {netDelta >= 0 ? `+${netDelta}` : netDelta}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* 16-City Quick Switch Matrix Chips (Zero bars, purely micro-chips) */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] text-slate-400 px-0.5">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                            <span>16地市快速聚焦矩阵</span>
                          </span>
                          <span className="text-[8px] font-mono text-slate-500">点击联动空间底图</span>
                        </div>

                        <div className="grid grid-cols-4 gap-1 max-h-[88px] overflow-y-auto pr-0.5">
                          {CITY_CARBON_DATA.map((c, i) => {
                            const isSelected = selectedCity?.id === c.id;
                            const isHovered = hoveredCityId === c.id;
                            const delta = c.sink - c.stock;
                            const isPos = delta >= 0;

                            return (
                              <button
                                key={c.id}
                                type="button"
                                onMouseEnter={() => setHoveredCityId(c.id)}
                                onMouseLeave={() => setHoveredCityId(null)}
                                onClick={() => setSelectedCity(c)}
                                className={`px-1.5 py-1 rounded-lg border text-left transition-all ${
                                  isSelected || isHovered
                                    ? 'bg-emerald-950/90 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/30'
                                    : 'bg-slate-950/70 border-slate-900 text-slate-300 hover:border-emerald-800/80 hover:bg-slate-900/60'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[10px] truncate">{c.name.replace('市', '')}</span>
                                  <span className="text-[8px] font-mono text-slate-500">
                                    {String(i + 1).padStart(2, '0')}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-0.5 text-[8.5px] font-mono">
                                  <span className="text-emerald-400">{c.stock}t</span>
                                  <span className={isPos ? 'text-teal-400' : 'text-amber-400'}>
                                    {isPos ? `+${delta}` : delta}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Selected City Focus Hologram Card */}
                      {selectedCity && (
                        <div className="bg-gradient-to-r from-emerald-950/70 via-slate-950/80 to-teal-950/60 border border-emerald-700/80 rounded-xl p-2 shadow-lg">
                          <div className="flex items-center justify-between pb-1.5 border-b border-emerald-900/60 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="font-bold text-white text-xs">{selectedCity.name} · 通量全息态势</span>
                              <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                                {selectedCity.colorRange}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-slate-400">
                              项目: <strong className="text-amber-300">{selectedCity.projectCount}</strong>个
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5 pt-1.5 text-center font-mono text-[9.5px]">
                            <div className="bg-slate-950/80 p-1 rounded-lg border border-slate-900">
                              <div className="text-[8px] text-slate-400 font-sans">现存碳储</div>
                              <div className="text-emerald-300 font-bold">{selectedCity.stock} <span className="text-[7.5px] text-slate-400 font-normal">万t</span></div>
                            </div>
                            <div className="bg-slate-950/80 p-1 rounded-lg border border-slate-900">
                              <div className="text-[8px] text-slate-400 font-sans">年碳汇量</div>
                              <div className="text-teal-300 font-bold">{selectedCity.sink} <span className="text-[7.5px] text-slate-400 font-normal">万t</span></div>
                            </div>
                            <div className="bg-slate-950/80 p-1 rounded-lg border border-slate-900">
                              <div className="text-[8px] text-slate-400 font-sans">净通量差</div>
                              <div className={`font-bold ${selectedCity.sink - selectedCity.stock >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {selectedCity.sink - selectedCity.stock >= 0 ? `+${selectedCity.sink - selectedCity.stock}` : selectedCity.sink - selectedCity.stock}
                              </div>
                            </div>
                            <div className="bg-slate-950/80 p-1 rounded-lg border border-slate-900">
                              <div className="text-[8px] text-slate-400 font-sans">固碳密度</div>
                              <div className="text-cyan-300 font-bold">{selectedCity.density} <span className="text-[7.5px] text-slate-400 font-normal">t/亩</span></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* DISPLAY MODE 2: 极坐标微型环形表盘阵列 (Radial Polar Dials) */}
                  {/* ========================================================= */}
                  {stockViewType === 'dial' && (
                    <div className="flex-1 flex flex-col justify-between overflow-hidden py-1.5">
                      <div className="flex items-center justify-between text-[9px] text-slate-400 px-1 pb-1">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>外弧: 碳储备量</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                            <span>内弧: 碳汇量</span>
                          </span>
                        </div>
                        <span className="font-mono text-emerald-400">极坐标能量盘</span>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 max-h-[300px]">
                        <div className="grid grid-cols-2 gap-1.5">
                          {CITY_CARBON_DATA.map((c, idx) => {
                            const isSelected = selectedCity?.id === c.id;
                            const isHovered = hoveredCityId === c.id;
                            const netDelta = c.sink - c.stock;
                            const isPositive = netDelta >= 0;

                            // Polar Arc parameters (220-degree speedometer arc)
                            const maxVal = 200;
                            const stockArcPercent = Math.min(1, c.stock / maxVal);
                            const sinkArcPercent = Math.min(1, c.sink / maxVal);

                            // Circumference of circles for SVG dasharray
                            // Outer circle r=18 -> C ≈ 113.1
                            const outerC = 113.1;
                            const outerDash = stockArcPercent * 70; // 220 deg proportion

                            // Inner circle r=13 -> C ≈ 81.68
                            const innerC = 81.68;
                            const innerDash = sinkArcPercent * 50;

                            return (
                              <div
                                key={c.id}
                                onMouseEnter={() => setHoveredCityId(c.id)}
                                onMouseLeave={() => setHoveredCityId(null)}
                                onClick={() => setSelectedCity(c)}
                                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                  isSelected || isHovered
                                    ? 'bg-emerald-950/90 border-emerald-400 shadow-md ring-1 ring-emerald-500/40'
                                    : 'bg-slate-950/70 border-slate-900 hover:border-emerald-800/80 hover:bg-slate-900/60'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {/* Circular Radial Gauge */}
                                  <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                                    <svg className="w-12 h-12 -rotate-110 overflow-visible" viewBox="0 0 44 44">
                                      {/* Outer Track Base */}
                                      <circle
                                        cx="22"
                                        cy="22"
                                        r="18"
                                        fill="none"
                                        stroke="#0b2419"
                                        strokeWidth="3"
                                        strokeDasharray="70 113"
                                      />
                                      {/* Outer Arc: 碳储备量 */}
                                      <circle
                                        cx="22"
                                        cy="22"
                                        r="18"
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="3"
                                        strokeDasharray={`${outerDash} 113`}
                                        strokeLinecap="round"
                                        className="transition-all duration-300"
                                      />

                                      {/* Inner Track Base */}
                                      <circle
                                        cx="22"
                                        cy="22"
                                        r="13"
                                        fill="none"
                                        stroke="#071d22"
                                        strokeWidth="2.5"
                                        strokeDasharray="50 82"
                                      />
                                      {/* Inner Arc: 碳汇量 */}
                                      <circle
                                        cx="22"
                                        cy="22"
                                        r="13"
                                        fill="none"
                                        stroke="#2dd4bf"
                                        strokeWidth="2.5"
                                        strokeDasharray={`${innerDash} 82`}
                                        strokeLinecap="round"
                                        className="transition-all duration-300"
                                      />
                                    </svg>

                                    {/* Center Rank Badge */}
                                    <span className="absolute text-[9px] font-mono font-bold text-slate-300">
                                      {String(idx + 1).padStart(2, '0')}
                                    </span>
                                  </div>

                                  {/* City Info & Metrics */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-white text-xs truncate">{c.name}</span>
                                      <span className={`text-[8.5px] font-mono px-1 py-0.2 rounded ${
                                        isPositive ? 'text-emerald-300 bg-emerald-950' : 'text-amber-300 bg-amber-950'
                                      }`}>
                                        {isPositive ? `+${netDelta}` : netDelta}
                                      </span>
                                    </div>
                                    <div className="text-[9px] font-mono text-slate-400 mt-1 space-y-0.5">
                                      <div className="flex justify-between">
                                        <span>储:</span>
                                        <strong className="text-emerald-300">{c.stock}t</strong>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>汇:</span>
                                        <strong className="text-teal-300">{c.sink}t</strong>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* DISPLAY MODE 3: 连续碳流谱曲线 (Continuous Wave Spectrum) */}
                  {/* ========================================================= */}
                  {stockViewType === 'spectrum' && (
                    <div className="flex-1 flex flex-col justify-between py-2 overflow-hidden">
                      <div className="relative w-full h-40 bg-slate-950/70 border border-slate-900 rounded-xl p-2 flex flex-col justify-between shadow-inner">
                        <div className="flex justify-between items-center text-[9px] text-slate-400">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <span className="w-2 h-0.5 bg-emerald-400" /> 碳储备波峰
                          </span>
                          <span className="flex items-center gap-1 text-teal-300">
                            <span className="w-2 h-0.5 bg-teal-300" /> 碳汇产出波峰
                          </span>
                        </div>

                        {/* Interactive Spline Wave */}
                        <div className="relative w-full h-28">
                          <svg viewBox="0 0 300 85" className="w-full h-full overflow-visible">
                            <defs>
                              <linearGradient id="splineStockGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                              </linearGradient>
                              <linearGradient id="splineSinkGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>

                            {/* Reference Gridlines */}
                            <line x1="10" y1="80" x2="290" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                            <line x1="10" y1="45" x2="290" y2="45" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 2" />

                            {/* Stock Area Fill */}
                            <path
                              d="M 15,28 C 45,34 65,48 95,48 C 125,48 145,18 175,18 C 205,18 225,32 255,32 C 275,32 285,15 295,15 L 295,80 L 15,80 Z"
                              fill="url(#splineStockGrad)"
                            />
                            {/* Stock Stroke Line */}
                            <path
                              d="M 15,28 C 45,34 65,48 95,48 C 125,48 145,18 175,18 C 205,18 225,32 255,32 C 275,32 285,15 295,15"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="2"
                            />

                            {/* Sink Area Fill */}
                            <path
                              d="M 15,24 C 45,40 65,46 95,46 C 125,46 145,15 175,15 C 205,15 225,30 255,30 C 275,30 285,12 295,12 L 295,80 L 15,80 Z"
                              fill="url(#splineSinkGrad)"
                            />
                            {/* Sink Stroke Line */}
                            <path
                              d="M 15,24 C 45,40 65,46 95,46 C 125,46 145,15 175,15 C 205,15 225,30 255,30 C 275,30 285,12 295,12"
                              fill="none"
                              stroke="#2dd4bf"
                              strokeWidth="1.8"
                              strokeDasharray="4 2"
                            />

                            {/* City Data Points */}
                            {[
                              { cx: 15, cy: 28, name: '合肥', stock: 158, sink: 162 },
                              { cx: 55, cy: 38, name: '芜湖', stock: 121, sink: 105 },
                              { cx: 95, cy: 48, name: '淮北', stock: 98, sink: 102 },
                              { cx: 135, cy: 28, name: '安庆', stock: 158, sink: 162 },
                              { cx: 175, cy: 18, name: '六安', stock: 158, sink: 162 },
                              { cx: 215, cy: 28, name: '滁州', stock: 158, sink: 162 },
                              { cx: 255, cy: 32, name: '宿州', stock: 158, sink: 162 },
                              { cx: 295, cy: 12, name: '黄山', stock: 186, sink: 192 },
                            ].map((pt, i) => (
                              <g key={i} className="cursor-pointer" onClick={() => {
                                const matched = CITY_CARBON_DATA.find(c => c.name.includes(pt.name));
                                if (matched) setSelectedCity(matched);
                              }}>
                                <circle cx={pt.cx} cy={pt.cy} r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
                                <text x={pt.cx} y={75} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                                  {pt.name}
                                </text>
                              </g>
                            ))}
                          </svg>
                        </div>
                      </div>

                      {/* City Quick Selector Tags */}
                      <div className="grid grid-cols-4 gap-1.5 pt-2">
                        {CITY_CARBON_DATA.slice(0, 8).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCity(c)}
                            className={`p-1.5 rounded-lg border text-center transition-all ${
                              selectedCity?.id === c.id
                                ? 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold'
                                : 'bg-slate-950/70 border-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            <div className="text-[10px] font-bold">{c.name.replace('市', '')}</div>
                            <div className="text-[9px] font-mono text-emerald-400">{c.stock}t</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW MODE B: 资源态势 (Resource Mode) - Preserved */}
            {/* ========================================================= */}
            {activeTab === 'resource' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden pt-2 space-y-3">
                {/* Block 1: 规模概览与固碳核心指标 */}
                <div className="py-2 border-b border-emerald-950/80">
                  <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900/40 to-slate-950/60 border border-emerald-900/60 rounded-xl p-3 mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                        森林碳汇总规模
                      </span>
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded-full border border-emerald-700/60">
                        覆盖率 30.22%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight tabular-nums">
                          880.0
                        </span>
                        <span className="text-xs text-slate-300 font-medium">万亩</span>
                        <span className="text-[10px] text-slate-500 font-mono ml-1">/ 58.67万公顷</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">年固碳汇量</span>
                        <span className="text-xs font-mono font-bold text-teal-300">135.8 万吨</span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex border border-emerald-950 mt-2.5">
                      <div style={{ width: '64%' }} className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                      <div style={{ width: '29.1%' }} className="h-full bg-gradient-to-r from-amber-400 to-amber-500" />
                      <div style={{ width: '6.9%' }} className="h-full bg-teal-800" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950/60 border border-emerald-950 rounded-lg p-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          生态公益林
                        </span>
                        <span className="font-mono text-emerald-400 font-semibold text-[10px]">64.0%</span>
                      </div>
                      <span className="text-sm font-bold font-mono text-white">563.0 万亩</span>
                    </div>

                    <div className="bg-slate-950/60 border border-emerald-950 rounded-lg p-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          商品用材林
                        </span>
                        <span className="font-mono text-amber-300 font-semibold text-[10px]">29.1%</span>
                      </div>
                      <span className="text-sm font-bold font-mono text-white">256.0 万亩</span>
                    </div>
                  </div>
                </div>

                {/* Block 2: 树种与龄组 */}
                <div className="py-2 border-b border-emerald-950/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white text-xs">植被分类与林相构成</span>
                    <div className="flex p-0.5 bg-slate-950 border border-emerald-900/60 rounded-lg text-[10px]">
                      <button
                        type="button"
                        onClick={() => setTreeSpeciesPage(1)}
                        className={`px-2 py-0.5 rounded ${treeSpeciesPage === 1 ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                      >
                        树种
                      </button>
                      <button
                        type="button"
                        onClick={() => setTreeSpeciesPage(2)}
                        className={`px-2 py-0.5 rounded ${treeSpeciesPage === 2 ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                      >
                        龄组
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    {[
                      { name: '灌木林', area: '143.0', percent: 35, barGrad: 'from-emerald-500 to-teal-400' },
                      { name: '阔叶林', area: '85.0', percent: 17, barGrad: 'from-teal-600 to-teal-400' },
                      { name: '针叶林', area: '78.0', percent: 15, barGrad: 'from-emerald-700 to-emerald-500' },
                      { name: '松柏林', area: '53.0', percent: 13, barGrad: 'from-sky-600 to-sky-400' },
                    ].map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300 w-14">{s.name}</span>
                        <div className="flex-1 mx-2 h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div style={{ width: `${s.percent}%` }} className={`h-full bg-gradient-to-r ${s.barGrad}`} />
                        </div>
                        <span className="font-mono text-emerald-400 w-14 text-right">{s.area}万 ({s.percent}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Block 3: 区域流谱 */}
                <div className="pt-1">
                  <div className="text-[11px] font-semibold text-white mb-1">区域自然林与人工林比例</div>
                  <div className="text-[10px] text-slate-400 leading-relaxed">
                    大别山区与皖南山区为核心生态固碳屏障，淮北平原主要为速生农田防护林带。
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW MODE C: 碳排放 (Emission Mode) - Matching User Screenshot */}
            {/* ========================================================= */}
            {activeTab === 'emission' && (
              <div className="flex-1 flex flex-col justify-between overflow-y-auto pt-2 space-y-3.5 pr-0.5">
                {/* [SECTION 1]: 碳排放量情况 (5690万吨 + 6大分类构成) */}
                {/* [SECTION 1]: 碳排放量情况 */}
                <div className="pb-3 border-b border-emerald-950/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-3 bg-emerald-400 rounded-sm" />
                      <span className="font-bold text-white text-xs tracking-wide">碳排放量情况</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowDetailModal(true)}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                    >
                      <span>明细</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Clean Visual Overview: Total Volume + Proportional Segment Bar + 2-Column Category Cards */}
                  <div className="space-y-2">
                    {/* Total Emission Stat Card */}
                    <div className="bg-slate-950/80 border border-emerald-950 rounded-xl p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-medium">排放总量</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
                            5,690
                          </span>
                          <span className="text-xs text-slate-400 font-medium">万吨</span>
                        </div>
                      </div>

                      {/* Proportional Segment Bar */}
                      <div className="mt-2 h-1.5 w-full bg-slate-900 rounded-full flex overflow-hidden gap-0.5">
                        {EMISSION_CATEGORIES.map((c) => (
                          <div
                            key={c.id}
                            style={{ width: `${c.percent}%`, backgroundColor: c.color }}
                            className={`h-full transition-all cursor-pointer ${
                              hoveredEmissionCatId === c.id ? 'brightness-125' : ''
                            }`}
                            onMouseEnter={() => setHoveredEmissionCatId(c.id)}
                            onMouseLeave={() => setHoveredEmissionCatId(null)}
                            title={`${c.name}: ${c.value}万吨 (${c.percent}%)`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* 6 Category Items (2 Columns) */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {EMISSION_CATEGORIES.map((cat) => {
                        const isHovered = hoveredEmissionCatId === cat.id;
                        const isSelected = selectedEmissionCategory === cat.id;

                        return (
                          <div
                            key={cat.id}
                            onMouseEnter={() => setHoveredEmissionCatId(cat.id)}
                            onMouseLeave={() => setHoveredEmissionCatId(null)}
                            onClick={() => setSelectedEmissionCategory(isSelected ? null : cat.id)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              isSelected || isHovered
                                ? 'bg-slate-900 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                                : 'bg-slate-950/70 border-emerald-950/70 hover:border-emerald-800/80 hover:bg-slate-900/60'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span
                                  style={{ backgroundColor: cat.color }}
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                />
                                <span className="font-bold text-[11px] text-slate-200 truncate">
                                  {cat.name}
                                </span>
                              </div>
                              <span
                                style={{ color: cat.color }}
                                className="text-[10px] font-mono font-bold"
                              >
                                {cat.percent}%
                              </span>
                            </div>

                            <div className="flex items-baseline justify-between mt-1">
                              <span className="text-base font-bold font-mono text-white">
                                {cat.value}
                              </span>
                              <span className="text-[9px] text-slate-400 font-sans">万吨</span>
                            </div>

                            {/* Proportion Track */}
                            <div className="mt-1.5 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div
                                style={{
                                  width: `${Math.min(100, (cat.value / 600) * 100)}%`,
                                  backgroundColor: cat.color,
                                }}
                                className="h-full rounded-full"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* [SECTION 2]: 碳排放趋势 (2021 ~ 2026 双曲线走势) */}
                <div className="pb-3 border-b border-emerald-950/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-3 bg-teal-400 rounded-sm" />
                      <span className="font-bold text-white text-xs tracking-wide">碳排放趋势</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-[9px]">
                        <span className="flex items-center gap-1 text-teal-300">
                          <span className="w-2 h-0.5 bg-teal-300 rounded" />
                          <span>重点领域实际</span>
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <span className="w-2 h-0.5 bg-emerald-400 rounded" />
                          <span>履约基准</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowDetailModal(true)}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                      >
                        <span>明细</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-400 mb-1">
                    <span>单位: 万吨</span>
                  </div>

                  {/* Interactive Dual-Column Vertical Comparison Chart (2026 -> 2021, 近期在前) */}
                  <div className="relative w-full h-32 bg-slate-950/80 border border-emerald-950 rounded-xl p-2 select-none overflow-hidden shadow-inner">
                    <svg viewBox="0 0 320 92" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="colActualGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.95" />
                          <stop offset="100%" stopColor="#0f766e" stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="colQuotaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.95" />
                          <stop offset="100%" stopColor="#064e3b" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>

                      {/* Y-axis Gridlines & Labels (0, 400, 800, 1200, 1600) */}
                      {[
                        { val: 1600, y: 14 },
                        { val: 1200, y: 29 },
                        { val: 800, y: 44 },
                        { val: 400, y: 59 },
                        { val: 0, y: 74 },
                      ].map((grid, i) => (
                        <g key={i}>
                          <line
                            x1="30"
                            y1={grid.y}
                            x2="310"
                            y2={grid.y}
                            stroke="rgba(255,255,255,0.06)"
                            strokeDasharray={grid.val === 0 ? undefined : '2 3'}
                          />
                          <text
                            x="24"
                            y={grid.y + 3}
                            textAnchor="end"
                            fill="#64748b"
                            fontSize="7"
                            fontFamily="monospace"
                          >
                            {grid.val}
                          </text>
                        </g>
                      ))}

                      {/* Dual-Column Pillars (Ordered Recent First: 2026 -> 2021) */}
                      {[...EMISSION_TREND_DATA]
                        .sort((a, b) => b.year - a.year)
                        .map((pt, i) => {
                          const center = 58 + i * 46;
                          const hActual = Math.max(3, (pt.actual / 1600) * 60);
                          const hQuota = Math.max(3, (pt.quota / 1600) * 60);
                          const yActual = 74 - hActual;
                          const yQuota = 74 - hQuota;
                          const isHovered = hoveredEmissionYear === pt.year;

                          return (
                            <g
                              key={pt.year}
                              className="cursor-pointer transition-all"
                              onMouseEnter={() => setHoveredEmissionYear(pt.year)}
                              onMouseLeave={() => setHoveredEmissionYear(null)}
                            >
                              {/* Background Slot Track */}
                              <rect
                                x={center - 9.5}
                                y={14}
                                width={19}
                                height={60}
                                rx={3}
                                fill={isHovered ? 'rgba(52, 211, 153, 0.08)' : 'rgba(255,255,255,0.02)'}
                                stroke={isHovered ? 'rgba(52, 211, 153, 0.3)' : 'transparent'}
                                strokeWidth="0.8"
                              />

                              {/* Actual Column (Teal / 重点领域实际) */}
                              <rect
                                x={center - 7.5}
                                y={yActual}
                                width={6.5}
                                height={hActual}
                                rx={2}
                                fill="url(#colActualGrad)"
                                stroke={isHovered ? '#5eead4' : 'rgba(45, 212, 191, 0.4)'}
                                strokeWidth={isHovered ? 1 : 0.5}
                              />
                              {/* Highlight Cap for Actual */}
                              <line
                                x1={center - 7.5}
                                y1={yActual}
                                x2={center - 1}
                                y2={yActual}
                                stroke="#5eead4"
                                strokeWidth="1.2"
                              />

                              {/* Quota Column (Emerald / 履约基准) */}
                              <rect
                                x={center + 1}
                                y={yQuota}
                                width={6.5}
                                height={hQuota}
                                rx={2}
                                fill="url(#colQuotaGrad)"
                                stroke={isHovered ? '#6ee7b7' : 'rgba(16, 185, 129, 0.4)'}
                                strokeWidth={isHovered ? 1 : 0.5}
                              />
                              {/* Highlight Cap for Quota */}
                              <line
                                x1={center + 1}
                                y1={yQuota}
                                x2={center + 7.5}
                                y2={yQuota}
                                stroke="#6ee7b7"
                                strokeWidth="1.2"
                              />

                              {/* Year Label (Recent First) */}
                              <text
                                x={center}
                                y={86}
                                textAnchor="middle"
                                fill={isHovered ? '#ffffff' : '#94a3b8'}
                                fontSize="8"
                                fontFamily="monospace"
                                fontWeight={isHovered ? 'bold' : 'normal'}
                              >
                                {pt.year}
                              </text>
                            </g>
                          );
                        })}
                    </svg>

                    {/* Hover HUD Badge for Trend */}
                    {hoveredEmissionYear && (() => {
                      const item = EMISSION_TREND_DATA.find((d) => d.year === hoveredEmissionYear);
                      if (!item) return null;
                      return (
                        <div className="absolute top-1.5 right-2 bg-slate-950/95 border border-emerald-500 rounded-md px-2 py-0.5 text-[9px] font-mono text-white flex items-center gap-2 shadow-xl animate-in fade-in">
                          <span className="text-emerald-400 font-bold">{item.year}年:</span>
                          <span className="text-teal-300">实际: {item.actual}万t</span>
                          <span className="text-emerald-300">基准: {item.quota}万t</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* [SECTION 3]: 治理情况 (按近期的往前: 2030 -> 2025) */}
                <div className="pb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-3 bg-cyan-400 rounded-sm" />
                      <span className="font-bold text-white text-xs tracking-wide">治理情况</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowDetailModal(true)}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                    >
                      <span>明细</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-[9px] text-slate-400 mb-1">
                    <span>单位: 万吨</span>
                  </div>

                  {/* Interactive Vertical Energy Capsule Pillars (2030 -> 2025, 近期在前) */}
                  <div className="relative w-full h-28 bg-slate-950/80 border border-emerald-950 rounded-xl p-2 select-none overflow-hidden shadow-inner">
                    <svg viewBox="0 0 320 80" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="govPillarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.95" />
                          <stop offset="100%" stopColor="#047857" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>

                      {/* Y-axis Gridlines (0, 400, 800, 1200, 1600) */}
                      {[
                        { val: 1600, y: 12 },
                        { val: 1200, y: 25 },
                        { val: 800, y: 38 },
                        { val: 400, y: 51 },
                        { val: 0, y: 64 },
                      ].map((g, idx) => (
                        <g key={idx}>
                          <line
                            x1="30"
                            y1={g.y}
                            x2="310"
                            y2={g.y}
                            stroke="rgba(255,255,255,0.06)"
                            strokeDasharray={g.val === 0 ? undefined : '2 3'}
                          />
                          <text
                            x="24"
                            y={g.y + 3}
                            textAnchor="end"
                            fill="#64748b"
                            fontSize="7"
                            fontFamily="monospace"
                          >
                            {g.val}
                          </text>
                        </g>
                      ))}

                      {/* Peak Contour Spline Connecting Pillars */}
                      <path
                        d={[...GOVERNANCE_TREND_DATA]
                          .sort((a, b) => b.year - a.year)
                          .map((pt, i) => {
                            const x = 58 + i * 46;
                            const y = 64 - (pt.reduction / 1600) * 50;
                            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                          })
                          .join(' ')}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                        strokeOpacity="0.45"
                      />

                      {/* Vertical Energy Capsule Pillars (Ordered Recent First: 2030 -> 2025) */}
                      {[...GOVERNANCE_TREND_DATA]
                        .sort((a, b) => b.year - a.year)
                        .map((pt, i) => {
                          const center = 58 + i * 46;
                          const h = Math.max(4, (pt.reduction / 1600) * 50);
                          const y = 64 - h;
                          const isHovered = hoveredGovernanceYear === pt.year;

                          return (
                            <g
                              key={pt.year}
                              className="cursor-pointer transition-all"
                              onMouseEnter={() => setHoveredGovernanceYear(pt.year)}
                              onMouseLeave={() => setHoveredGovernanceYear(null)}
                            >
                              {/* Background Slot Track */}
                              <rect
                                x={center - 6.5}
                                y={12}
                                width={13}
                                height={52}
                                rx={4}
                                fill={isHovered ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255,255,255,0.02)'}
                                stroke={isHovered ? 'rgba(6, 182, 212, 0.3)' : 'transparent'}
                                strokeWidth="0.8"
                              />

                              {/* Vertical Energy Bar */}
                              <rect
                                x={center - 5}
                                y={y}
                                width={10}
                                height={h}
                                rx={3}
                                fill="url(#govPillarGrad)"
                                stroke={isHovered ? '#67e8f9' : 'rgba(6, 182, 212, 0.4)'}
                                strokeWidth={isHovered ? 1 : 0.5}
                              />

                              {/* Top Glowing Beacon Node */}
                              <circle
                                cx={center}
                                cy={y}
                                r={isHovered ? 4 : 2.5}
                                fill="#38bdf8"
                                stroke="#ffffff"
                                strokeWidth={isHovered ? 1.5 : 0.8}
                                className="transition-all"
                              />

                              {/* Exact Value Label Above Pillar */}
                              <text
                                x={center}
                                y={y - 3}
                                textAnchor="middle"
                                fill={isHovered ? '#38bdf8' : '#94a3b8'}
                                fontSize="7"
                                fontFamily="monospace"
                                fontWeight={isHovered ? 'bold' : 'normal'}
                              >
                                {pt.reduction}
                              </text>

                              {/* Year Label Below (Recent First) */}
                              <text
                                x={center}
                                y={75}
                                textAnchor="middle"
                                fill={isHovered ? '#ffffff' : '#64748b'}
                                fontSize="8"
                                fontFamily="monospace"
                                fontWeight={isHovered ? 'bold' : 'normal'}
                              >
                                {pt.year}
                              </text>
                            </g>
                          );
                        })}
                    </svg>

                    {/* Hover HUD Badge for Governance */}
                    {hoveredGovernanceYear && (() => {
                      const item = GOVERNANCE_TREND_DATA.find((d) => d.year === hoveredGovernanceYear);
                      if (!item) return null;
                      return (
                        <div className="absolute top-1.5 right-2 bg-slate-950/95 border border-cyan-400 rounded-md px-2 py-0.5 text-[9px] font-mono text-white flex items-center gap-1.5 shadow-xl animate-in fade-in">
                          <span className="text-cyan-400 font-bold">{item.year}年减排:</span>
                          <span className="text-emerald-300 font-bold">{item.reduction} 万吨</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsLeftPanelOpen(true)}
            className="absolute top-4 left-4 z-20 px-3 py-2 bg-[#04150e]/92 hover:bg-emerald-950 border border-emerald-800 text-xs text-emerald-300 rounded-xl shadow-xl flex items-center gap-2 backdrop-blur-md transition-all"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>展开态势看板</span>
          </button>
        )}

        {/* [SELECTOR 4] RIGHT PANEL: 图层查询 & 空间要素检索面板 */}
        {isQueryPanelOpen && (
          <div className="absolute top-4 right-16 bottom-4 w-[360px] z-20 bg-[#04150e]/95 border border-emerald-800/80 rounded-2xl p-4 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/80 flex items-center justify-center text-emerald-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm tracking-wide">图层要素检索</span>
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                        {filteredFeatures.length} / {INITIAL_FEATURES.length}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">样地属性与空间坐标实时联动</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsQueryPanelOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="收起检索面板"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search & Filter Form Layout */}
              <div className="space-y-2.5 mt-3">
                {/* Search Input Box */}
                <div className="relative">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={featureNameInput}
                    onChange={(e) => setFeatureNameInput(e.target.value)}
                    placeholder="按样地名称检索 (如: 观湖亭, 杨树林)..."
                    className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-emerald-900/80 focus:border-emerald-500 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none transition-colors"
                  />
                  {featureNameInput && (
                    <button
                      type="button"
                      onClick={() => setFeatureNameInput('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Level Quick-Filter Pills */}
                <div>
                  <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>样地保护等级</span>
                    <span className="text-[9px] text-emerald-400/80">点击标签快速筛选</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {[
                      { id: 'all', label: '全部等级' },
                      { id: '一级', label: '一级核心样地' },
                      { id: '二级', label: '二级扩展样地' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setLevelSelect(lvl.id)}
                        className={`py-1 px-1 text-[11px] font-medium rounded-lg border transition-all text-center truncate ${
                          levelSelect === lvl.id
                            ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layer and Query Mode Bar */}
                <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-950/70 border border-slate-900 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] pl-1">
                    <Layers className="w-3.5 h-3.5 text-teal-400" />
                    <span>图层:</span>
                    <select
                      value={queryLayer}
                      onChange={(e) => setQueryLayer(e.target.value)}
                      className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="景点" className="bg-slate-900 text-white">生态样地</option>
                      <option value="林班" className="bg-slate-900 text-white">权属林班</option>
                      <option value="通量塔" className="bg-slate-900 text-white">通量观测塔</option>
                    </select>
                  </div>

                  <div className="flex p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setQueryMode('attr')}
                      className={`px-2 py-0.5 rounded transition-all font-medium ${
                        queryMode === 'attr' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      属性
                    </button>
                    <button
                      type="button"
                      onClick={() => setQueryMode('spatial')}
                      className={`px-2 py-0.5 rounded transition-all font-medium ${
                        queryMode === 'spatial' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      空间
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Interactive Spatial Card List */}
            <div className="flex-1 mt-3 flex flex-col justify-between overflow-hidden">
              <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                <span>检索结果清单</span>
                <button
                  type="button"
                  onClick={handleResetQuery}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>重置条件</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredFeatures.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    未检索到符合条件的样地要素
                  </div>
                ) : (
                  filteredFeatures.map((item, idx) => {
                    const isSelected = selectedFeature?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedFeature(item)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-500/40'
                            : 'bg-slate-950/70 border-slate-800/80 hover:border-emerald-700 hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-white text-xs">{item.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                              item.level === '一级'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-slate-900 text-teal-300 border border-slate-700'
                            }`}>
                              {item.level}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400 group-hover:text-emerald-300 transition-colors">
                              地图定位
                            </span>
                            <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'}`} />
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 mb-2 truncate">
                          {item.location} · {item.type}
                        </div>

                        {/* Micro Stats Row */}
                        <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px] bg-slate-900/60 rounded-lg p-1.5 border border-slate-900">
                          <div>
                            <span className="text-slate-500 block text-[8px]">样地规模</span>
                            <span className="text-slate-200 font-bold">{item.areaMu}万亩</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[8px]">NDVI植被</span>
                            <span className="text-emerald-400 font-bold">{item.ndvi}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[8px]">年吸收量</span>
                            <span className="text-teal-300 font-bold">{(item.annualCO2 / 1000).toFixed(1)}kt</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        )}

        {/* Reopen button if panel closed */}
        {!isQueryPanelOpen && (
          <button
            onClick={() => setIsQueryPanelOpen(true)}
            className="absolute top-4 right-16 z-20 px-3 py-2 bg-slate-950/90 border border-emerald-700 text-xs text-emerald-300 rounded-lg shadow-xl flex items-center gap-1.5 hover:bg-emerald-950"
          >
            <Search className="w-3.5 h-3.5" />
            <span>打开图层查询</span>
          </button>
        )}

        {/* [BASEMAP SETTINGS CARD] Floating Panel - Matching Screenshot */}
        {isBasemapSettingOpen && (
          <div className="absolute top-4 right-16 z-30 w-80 bg-slate-950/95 border border-emerald-800/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-emerald-400 rounded-sm" />
                <span className="font-bold text-white text-xs tracking-wide">底图设置</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBasemapSettingOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Map Style Cards: 矢量地图 / 卫星地图 / 无底图 */}
            <div className="grid grid-cols-3 gap-2.5 pt-3">
              {/* Option 1: 矢量地图 */}
              <button
                type="button"
                onClick={() => setMapBaseType('terrain')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  mapBaseType === 'terrain'
                    ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 hover:border-emerald-700/80'
                }`}
              >
                <div className="w-full h-12 rounded-lg bg-emerald-900/40 border border-emerald-800/60 flex items-center justify-center overflow-hidden">
                  <MapIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <span className={`text-[11px] font-medium ${mapBaseType === 'terrain' ? 'text-emerald-300 font-bold' : 'text-slate-300'}`}>
                  矢量地图
                </span>
              </button>

              {/* Option 2: 卫星地图 */}
              <button
                type="button"
                onClick={() => setMapBaseType('satellite')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  mapBaseType === 'satellite'
                    ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 hover:border-emerald-700/80'
                }`}
              >
                <div className="w-full h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                  <Globe className="w-6 h-6 text-teal-400" />
                </div>
                <span className={`text-[11px] font-medium ${mapBaseType === 'satellite' ? 'text-emerald-300 font-bold' : 'text-slate-300'}`}>
                  卫星地图
                </span>
              </button>

              {/* Option 3: 无底图 */}
              <button
                type="button"
                onClick={() => setMapBaseType('night')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  mapBaseType === 'night'
                    ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 hover:border-emerald-700/80'
                }`}
              >
                <div className="w-full h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                  <SlidersHorizontal className="w-6 h-6 text-slate-500" />
                </div>
                <span className={`text-[11px] font-medium ${mapBaseType === 'night' ? 'text-emerald-300 font-bold' : 'text-slate-300'}`}>
                  无底图
                </span>
              </button>
            </div>

            {/* Bottom Row: 显示地名 Toggle */}
            <div className="mt-3 pt-3 border-t border-slate-900 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">显示地名</span>
              <button
                type="button"
                onClick={() => setShowToponyms(!showToponyms)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  showToponyms ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    showToponyms ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* RIGHT FLOATING MAP TOOLBAR (底图 / 图层 / 放大 / 缩小 / 测面) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {/* Basemap Switch Button */}
          <button
            type="button"
            onClick={() => setIsBasemapSettingOpen(!isBasemapSettingOpen)}
            className={`w-10 h-10 rounded-xl border flex flex-col items-center justify-center text-[9px] shadow-xl transition-all ${
              isBasemapSettingOpen
                ? 'bg-emerald-600 border-white text-white'
                : 'bg-slate-950/90 hover:bg-emerald-950 border-emerald-800/80 text-slate-300 hover:text-emerald-300'
            }`}
            title="底图设置"
          >
            <Globe className="w-4 h-4 mb-0.5 text-emerald-400" />
            <span>底图</span>
          </button>

          {/* Layer Controls */}
          <button
            type="button"
            onClick={() => setIsQueryPanelOpen(!isQueryPanelOpen)}
            className="w-10 h-10 rounded-xl bg-slate-950/90 hover:bg-emerald-950 border border-emerald-800/80 text-slate-300 hover:text-emerald-300 flex flex-col items-center justify-center text-[9px] shadow-xl transition-all"
            title="图层控制"
          >
            <Layers className="w-4 h-4 mb-0.5 text-teal-400" />
            <span>图层</span>
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={() => setMapScale((prev) => Math.min(prev + 0.15, 1.6))}
            className="w-10 h-10 rounded-xl bg-slate-950/90 hover:bg-emerald-950 border border-emerald-800/80 text-slate-300 hover:text-emerald-300 flex flex-col items-center justify-center text-[9px] shadow-xl transition-all"
            title="放大地图"
          >
            <ZoomIn className="w-4 h-4 mb-0.5 text-emerald-400" />
            <span>放大</span>
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => setMapScale((prev) => Math.max(prev - 0.15, 0.85))}
            className="w-10 h-10 rounded-xl bg-slate-950/90 hover:bg-emerald-950 border border-emerald-800/80 text-slate-300 hover:text-emerald-300 flex flex-col items-center justify-center text-[9px] shadow-xl transition-all"
            title="缩小地图"
          >
            <ZoomOut className="w-4 h-4 mb-0.5 text-emerald-400" />
            <span>缩小</span>
          </button>

          {/* Measure Area */}
          <button
            type="button"
            onClick={handleMeasureArea}
            className={`w-10 h-10 rounded-xl border flex flex-col items-center justify-center text-[9px] shadow-xl transition-all ${
              isMeasuring
                ? 'bg-emerald-500 border-white text-white'
                : 'bg-slate-950/90 hover:bg-emerald-950 border-emerald-800/80 text-slate-300 hover:text-emerald-300'
            }`}
            title="测算林班面积"
          >
            <Ruler className="w-4 h-4 mb-0.5" />
            <span>测面</span>
          </button>
        </div>

        {/* [THEMATIC CHOROPLETH LEGEND] Bottom Right - Matching Screenshot */}
        {(activeTab === 'carbon_stock' || activeTab === 'emission') && (
          <div className="absolute bottom-6 right-16 z-20 bg-slate-950/95 border border-emerald-900/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md w-48">
            <div className="text-[11px] font-bold text-white mb-2 flex items-center justify-between pb-1.5 border-b border-emerald-950">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {activeTab === 'emission' ? '碳排放量 (万吨)' : '碳储备量 (万吨)'}
              </span>
              {activeLegendTier && (
                <button
                  type="button"
                  onClick={() => setActiveLegendTier(null)}
                  className="text-[9px] text-emerald-400 hover:text-white"
                >
                  全部
                </button>
              )}
            </div>

            <div className="space-y-1 text-[10px]">
              {CARBON_STOCK_LEGEND.map((item, idx) => {
                const isActive = activeLegendTier === item.label;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveLegendTier(isActive ? null : item.label)}
                    className={`flex items-center justify-between px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-emerald-900/80 text-white font-bold ring-1 ring-emerald-400'
                        : 'hover:bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        style={{ backgroundColor: item.color }}
                        className="w-3.5 h-2.5 rounded-sm shadow-sm"
                      />
                      <span className="font-mono">{item.label}</span>
                    </div>
                    <span className="text-[9px] text-slate-500">{item.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Detail Breakdown Modal for "明细 >" */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl bg-[#071d13] border border-emerald-600 rounded-2xl p-6 shadow-2xl max-h-[85vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/80">
              <div className="flex items-center gap-2">
                {activeTab === 'emission' ? (
                  <Factory className="w-5 h-5 text-emerald-400" />
                ) : (
                  <TreePine className="w-5 h-5 text-emerald-400" />
                )}
                <h3 className="text-base font-bold text-white">
                  {activeTab === 'emission'
                    ? '全省重点碳排放与减排治理考核明细台账'
                    : activeTab === 'carbon_stock'
                    ? '全省各市碳储备与碳汇量核算明细台账'
                    : '全省林相与碳汇资源规模明细台账'}
                </h3>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-white p-1 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-slate-300">
              {/* Summary Stats Strip for Emission Mode */}
              {activeTab === 'emission' ? (
                <div className="grid grid-cols-4 gap-2.5 p-3 bg-slate-950/80 rounded-xl border border-emerald-950 text-center font-mono">
                  <div>
                    <div className="text-[10px] text-slate-400 font-sans">全省碳排放总量</div>
                    <div className="text-white font-black text-sm mt-0.5">5,690.0 <span className="text-[10px] text-slate-400 font-normal">万吨</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-sans">重点企业排放</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">570.0 <span className="text-[10px] text-slate-400 font-normal">万吨</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-sans">治理累计减排量</div>
                    <div className="text-teal-300 font-bold text-sm mt-0.5">754.0 <span className="text-[10px] text-slate-400 font-normal">万吨</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-sans">综合履约达成率</div>
                    <div className="text-amber-300 font-bold text-sm mt-0.5">98.1%</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2.5 p-3 bg-slate-950/80 rounded-xl border border-emerald-950 text-center font-mono">
                  <div>
                    <div className="text-[10px] text-slate-400 font-sans">森林总面积</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">880.0 万亩</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-sans">总碳储备量</div>
                    <div className="text-teal-300 font-bold text-sm mt-0.5">563.0 万吨</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-sans">年固碳产出</div>
                    <div className="text-cyan-300 font-bold text-sm mt-0.5">135.8 万吨/年</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-sans">碳汇在管项目</div>
                    <div className="text-amber-300 font-bold text-sm mt-0.5">256 个</div>
                  </div>
                </div>
              )}

              {/* Data Table */}
              <div className="border border-emerald-950 rounded-xl overflow-hidden bg-slate-950/60">
                {activeTab === 'emission' ? (
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">序号</th>
                        <th className="py-2 px-3">行政区市</th>
                        <th className="py-2 px-3 font-mono text-emerald-400">重点企业 (万t)</th>
                        <th className="py-2 px-3 font-mono text-sky-300">重点领域 (万t)</th>
                        <th className="py-2 px-3 font-mono text-amber-300">综合配额 (万t)</th>
                        <th className="py-2 px-3 font-mono text-teal-300">治理减排量 (万t)</th>
                        <th className="py-2 px-3 font-mono text-emerald-300">履约率</th>
                        <th className="py-2 px-3">梯队评级</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300 text-[11px] font-mono">
                      {CITY_EMISSION_DATA.map((c, idx) => (
                        <tr key={c.id} className="hover:bg-emerald-950/40 transition-colors">
                          <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                          <td className="py-2 px-3 font-sans font-bold text-white">{c.name}</td>
                          <td className="py-2 px-3 text-emerald-300 font-bold">{c.enterprise}.0</td>
                          <td className="py-2 px-3 text-sky-300 font-bold">{c.sector}.0</td>
                          <td className="py-2 px-3 text-amber-300 font-bold">{c.total}.0</td>
                          <td className="py-2 px-3 text-teal-300 font-bold">{c.reduction}.0</td>
                          <td className="py-2 px-3 text-emerald-400 font-bold">{c.compliance}%</td>
                          <td className="py-2 px-3 text-slate-400 font-sans">{c.colorRange}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">序号</th>
                        <th className="py-2 px-3">行政区市</th>
                        <th className="py-2 px-3 font-mono text-emerald-400">碳储备量 (万吨)</th>
                        <th className="py-2 px-3 font-mono text-cyan-300">年碳汇量 (万吨)</th>
                        <th className="py-2 px-3 font-mono text-slate-300">森林面积 (万亩)</th>
                        <th className="py-2 px-3 font-mono text-amber-300">在管项目</th>
                        <th className="py-2 px-3">固碳密度</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300 text-[11px] font-mono">
                      {CITY_CARBON_DATA.map((c, idx) => (
                        <tr key={c.id} className="hover:bg-emerald-950/40 transition-colors">
                          <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                          <td className="py-2 px-3 font-sans font-bold text-white">{c.name}</td>
                          <td className="py-2 px-3 text-emerald-300 font-bold">{c.stock}.0</td>
                          <td className="py-2 px-3 text-cyan-300 font-bold">{c.sink}.0</td>
                          <td className="py-2 px-3 text-slate-200">{c.forestArea}</td>
                          <td className="py-2 px-3 text-amber-400">{c.projectCount} 个</td>
                          <td className="py-2 px-3 text-slate-400 font-sans">{c.density} t/亩</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-emerald-950/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                {activeTab === 'emission'
                  ? '数据来源: 省生态环境厅重点用能单位碳排放在线监测直报网络 · 2026年度'
                  : '数据来源: 国家林业与草原局森林资源清查数据库 · 2026年度基线'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    let csvContent = '';
                    if (activeTab === 'emission') {
                      csvContent =
                        '序号,城市,重点企业排放(万吨),重点领域排放(万吨),综合配额(万吨),治理累计减排量(万吨),履约达成率(%)\n' +
                        CITY_EMISSION_DATA.map(
                          (c, i) =>
                            `${i + 1},${c.name},${c.enterprise},${c.sector},${c.total},${c.reduction},${c.compliance}%`
                        ).join('\n');
                    } else {
                      csvContent =
                        '序号,城市,碳储备量(万吨),年碳汇量(万吨),森林面积(万亩),在管项目数,固碳密度(t/亩)\n' +
                        CITY_CARBON_DATA.map(
                          (c, i) =>
                            `${i + 1},${c.name},${c.stock},${c.sink},${c.forestArea},${c.projectCount},${c.density}`
                        ).join('\n');
                    }

                    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute(
                      'download',
                      activeTab === 'emission'
                        ? 'anhui_carbon_emission_audit_2026.csv'
                        : 'anhui_carbon_stock_audit_2026.csv'
                    );
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出台账报表 (CSV)</span>
                </button>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
