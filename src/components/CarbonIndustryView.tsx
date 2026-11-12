import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  ChevronLeft,
  Calendar,
  Activity,
  Layers,
  Sparkles,
  Building2,
  Factory,
  Car,
  Zap,
  Flame,
  UtensilsCrossed,
  ShieldCheck,
  CheckCircle2,
  Filter,
  LineChart,
  BarChart3,
  AlignLeft,
  Gauge,
  LayoutGrid,
  ArrowUpDown,
  Trees,
  TreePine,
  ArrowUpRight,
  Table,
  SlidersHorizontal,
  Info,
  Clock,
  Target,
  FileSpreadsheet,
  ChevronRight,
  Award,
  Search,
  RotateCcw,
  Download,
  Eye,
  RefreshCw,
  X,
  FileText,
  BadgeCheck,
} from 'lucide-react';

// 计算 SVG 平滑贝塞尔曲线路径
function createSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

// 计算 SVG 平滑贝塞尔渐变面积闭合路径
function createSmoothAreaPath(points: { x: number; y: number }[], bottomY: number): string {
  if (points.length === 0) return '';
  const linePath = createSmoothPath(points);
  return `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${bottomY} L ${points[0].x.toFixed(1)} ${bottomY} Z`;
}

interface CityPeakData {
  city: string;
  predicted: number; // 预测达峰 (万吨)
  actual: number;    // 实际排放 (万吨)
}

const CITY_PEAK_DATA: CityPeakData[] = [
  { city: '合肥市', predicted: 3850, actual: 2980 },
  { city: '芜湖市', predicted: 6720, actual: 4320 },
  { city: '蚌埠市', predicted: 3380, actual: 3850 },
  { city: '淮南市', predicted: 2860, actual: 2620 },
  { city: '马鞍山', predicted: 5280, actual: 4850 },
  { city: '淮北市', predicted: 1650, actual: 2580 },
  { city: '铜陵市', predicted: 3920, actual: 3260 },
  { city: '安庆市', predicted: 3860, actual: 3340 },
  { city: '黄山市', predicted: 6720, actual: 5820 },
];

interface SectorGauge {
  id: string;
  name: string;
  value: number; // 万吨
  max: number;
  color: string;
  trackColor: string;
  changeRate: string;
  trend: 'up' | 'down';
}

const SECTOR_GAUGES: SectorGauge[] = [
  { id: 'transport', name: '交通运输', value: 511, max: 650, color: '#00c88c', trackColor: '#0a231b', changeRate: '-3.8%', trend: 'down' },
  { id: 'building', name: '建筑行业', value: 129, max: 200, color: '#10b981', trackColor: '#0b261e', changeRate: '-1.5%', trend: 'down' },
  { id: 'finance', name: '金融行业', value: 153, max: 220, color: '#84cc16', trackColor: '#1d2a12', changeRate: '-0.8%', trend: 'down' },
  { id: 'mining', name: '矿产石油', value: 165, max: 250, color: '#818cf8', trackColor: '#181b3d', changeRate: '+2.1%', trend: 'up' },
  { id: 'catering', name: '餐饮服务', value: 142, max: 200, color: '#f97316', trackColor: '#301c10', changeRate: '-2.4%', trend: 'down' },
  { id: 'energy', name: '能源开发', value: 236, max: 320, color: '#06b6d4', trackColor: '#0b2733', changeRate: '+1.2%', trend: 'up' },
];

// 全年12个月碳排放时间序列数据 (2026-01 ~ 2026-12，其中26-11与26-12未到期数据为0无柱图)
const EMISSION_MONTHS = [
  '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
  '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'
];

interface MonthlyEmission {
  month: string;
  enterprise: number; // 重点企业 (万吨)
  industry: number;   // 重点行业 (万吨)
  sector: number;     // 重点领域 (万吨)
  isPending?: boolean; // 未到期标志 (数据全为0，不呈现柱状图)
}

const MONTHLY_EMISSIONS: MonthlyEmission[] = [
  { month: '2026-01', enterprise: 2320, industry: 4230, sector: 7410 },
  { month: '2026-02', enterprise: 2890, industry: 4560, sector: 7350 },
  { month: '2026-03', enterprise: 3420, industry: 4950, sector: 7280 },
  { month: '2026-04', enterprise: 3980, industry: 5320, sector: 7320 },
  { month: '2026-05', enterprise: 4250, industry: 5540, sector: 7460 },
  { month: '2026-06', enterprise: 4420, industry: 5680, sector: 7580 },
  { month: '2026-07', enterprise: 4720, industry: 5890, sector: 7650 },
  { month: '2026-08', enterprise: 4180, industry: 5620, sector: 7380 },
  { month: '2026-09', enterprise: 3820, industry: 5410, sector: 7050 },
  { month: '2026-10', enterprise: 3450, industry: 5260, sector: 6780 },
  { month: '2026-11', enterprise: 0, industry: 0, sector: 0, isPending: true },
  { month: '2026-12', enterprise: 0, industry: 0, sector: 0, isPending: true },
];

// ======================= 碳达峰管控数据结构 (对应截图与最新2026核算) =======================
export interface PeakControlRankingItem {
  rank: number;
  city: string;
  progress: number; // 进度百分比 (如 93 代表 93%)
  tag: string;
  targetLimit: number; // 达峰目标限额 (万吨)
  actualControl: number; // 2026实际管控量 (万吨)
  reductionRate: string; // 减排同比
  expectedPeakYear: string; // 预计达峰窗口
  status: '超前推进' | '达标在控' | '重点监管';
  updatedAt: string;
}

export const PEAK_CONTROL_RANKING: PeakControlRankingItem[] = [
  { rank: 1, city: '合肥市', progress: 93, tag: '省会先锋', targetLimit: 3200, actualControl: 2980, reductionRate: '-7.2%', expectedPeakYear: '2027年', status: '超前推进', updatedAt: '2026-11-11' },
  { rank: 2, city: '芜湖市', progress: 80, tag: '沿江制造', targetLimit: 4500, actualControl: 4320, reductionRate: '-5.4%', expectedPeakYear: '2028年', status: '超前推进', updatedAt: '2026-11-11' },
  { rank: 3, city: '淮北市', progress: 75, tag: '矿区转型', targetLimit: 2800, actualControl: 2580, reductionRate: '-6.1%', expectedPeakYear: '2028年', status: '达标在控', updatedAt: '2026-11-11' },
  { rank: 4, city: '滁州市', progress: 65, tag: '光伏产业', targetLimit: 3400, actualControl: 3150, reductionRate: '-4.6%', expectedPeakYear: '2028年', status: '达标在控', updatedAt: '2026-11-11' },
  { rank: 5, city: '安庆市', progress: 55, tag: '沿江生态', targetLimit: 3600, actualControl: 3340, reductionRate: '-3.8%', expectedPeakYear: '2029年', status: '达标在控', updatedAt: '2026-11-11' },
  { rank: 6, city: '马鞍山市', progress: 50, tag: '钢铁减碳', targetLimit: 5000, actualControl: 4850, reductionRate: '-3.2%', expectedPeakYear: '2029年', status: '重点监管', updatedAt: '2026-11-11' },
  { rank: 7, city: '淮南市', progress: 40, tag: '能源基地', targetLimit: 2900, actualControl: 2620, reductionRate: '-2.9%', expectedPeakYear: '2029年', status: '重点监管', updatedAt: '2026-11-11' },
  { rank: 8, city: '蚌埠市', progress: 35, tag: '新材料基', targetLimit: 4000, actualControl: 3850, reductionRate: '-2.1%', expectedPeakYear: '2030年前', status: '重点监管', updatedAt: '2026-11-11' },
  { rank: 9, city: '阜阳市', progress: 30, tag: '现代农业', targetLimit: 3100, actualControl: 2920, reductionRate: '-1.8%', expectedPeakYear: '2030年前', status: '重点监管', updatedAt: '2026-11-11' },
  { rank: 10, city: '宿州市', progress: 28, tag: '平原林网', targetLimit: 2600, actualControl: 2480, reductionRate: '-1.5%', expectedPeakYear: '2030年前', status: '重点监管', updatedAt: '2026-11-11' },
];

export interface PeakTrendPoint {
  year: string; // 月份标识 (如 '26-01', '26-02', ..., '26-12')
  monthName: string; // 完整月份 (如 '2026年01月')
  value: number; // 万吨 (林业达峰成效)
  stage: '历史实测' | '当前节点' | '预测推演' | '未到期';
  policy: string;
  forestCoverage: string;
  isPending?: boolean;
}

export const FORESTRY_PEAK_TREND: PeakTrendPoint[] = [
  { year: '26-01', monthName: '2026年01月', value: 3820, stage: '历史实测', policy: '一季度林业碳汇防冻保苗与新造林摸底清查', forestCoverage: '33.1%' },
  { year: '26-02', monthName: '2026年02月', value: 4050, stage: '历史实测', policy: '春季植树造林规划与森林抚育有序复工', forestCoverage: '33.2%' },
  { year: '26-03', monthName: '2026年03月', value: 4380, stage: '历史实测', policy: '全国植树节全省大规模国土绿化攻坚行动', forestCoverage: '33.3%' },
  { year: '26-04', monthName: '2026年04月', value: 4620, stage: '历史实测', policy: '江淮分水岭绿化带精准改造与施肥管护', forestCoverage: '33.4%' },
  { year: '26-05', monthName: '2026年05月', value: 4910, stage: '历史实测', policy: '初夏幼龄林抚育及竹林高效固碳复合经营', forestCoverage: '33.4%' },
  { year: '26-06', monthName: '2026年06月', value: 5180, stage: '历史实测', policy: '半年度林业碳达峰重点示范工程中期督查', forestCoverage: '33.5%' },
  { year: '26-07', monthName: '2026年07月', value: 5420, stage: '历史实测', policy: '皖南山区林业碳票跨区域首单挂牌交易落地', forestCoverage: '33.5%' },
  { year: '26-08', monthName: '2026年08月', value: 5610, stage: '历史实测', policy: '夏季防旱保绿与退化林分修复生态提升工程', forestCoverage: '33.6%' },
  { year: '26-09', monthName: '2026年09月', value: 5750, stage: '历史实测', policy: '全省重点林区森林蓄积量动态无人机智能航测', forestCoverage: '33.6%' },
  { year: '26-10', monthName: '2026年10月', value: 5860, stage: '当前节点', policy: '安徽省林业碳达峰智能立体管控平台全面在线', forestCoverage: '33.7%' },
  { year: '26-11', monthName: '2026年11月', value: 0, stage: '未到期', policy: '四季度国有林场碳汇试点期末核查 (尚未到来)', forestCoverage: '33.7%', isPending: true },
  { year: '26-12', monthName: '2026年12月', value: 0, stage: '未到期', policy: '全省2026年度双碳综合履约与清缴评估 (尚未到来)', forestCoverage: '33.8%', isPending: true },
];

export interface NeutralEnterpriseRecord {
  id: number;
  date: string;
  enterpriseName: string;
  shortName: string;
  district: string;
  districtDetail?: string; // 截图: '合肥市 包河区'
  contactPerson?: string; // 截图: '陈健仁'
  contactPhone?: string; // 截图: '138****4444'
  detailedAddress?: string; // 截图: '合肥市包河区XXXXXXXX'
  enterpriseIntro?: string; // 截图: 多行企业简介
  industry: string;
  carbonEmission: number; // 万吨
  neutralizedAmount: number; // 万吨
  progress: number; // %
  investment: number; // 万元
  startTime: string;
  endTime: string;
  projectType: string;
  verifier: string;
  status: '超前中和' | '达标在控' | '重点盯防';
  forestOffsetHectares: number; // 亩
}

export const NEUTRAL_ENTERPRISE_DATA: NeutralEnterpriseRecord[] = [
  {
    id: 1,
    date: '2026-11-11',
    enterpriseName: '安徽海螺水泥股份有限公司（包河低碳运营中心）',
    shortName: '海螺水泥',
    district: '合肥市',
    districtDetail: '合肥市 包河区',
    contactPerson: '陈健仁',
    contactPhone: '138****4444',
    detailedAddress: '合肥市包河区方兴大道888号国家智能制造与低碳产业示范基地',
    enterpriseIntro: '安徽海螺水泥股份有限公司系安徽省重点骨干企业，也是国家首批绿色低碳示范领军企业。企业积极践行国家双碳战略，全线推进熟料清洁煅烧、替代燃料与低温余热发电技术升级，大力建设数字化能源管控中心。同时，企业与皖南山区国有林场及大别山森林生态试验区建立林业碳汇定向对冲履约长效机制，通过林业碳票收购、退化林精准抚育与森林蓄积量增汇核算，年均完成林业碳汇消纳核销逾115万吨，全面构筑起绿色循环低碳制造标杆体系。',
    industry: '绿色建材与固碳熟料',
    carbonEmission: 1500,
    neutralizedAmount: 1156,
    progress: 71,
    investment: 1000,
    startTime: '2025-01-01',
    endTime: '2026-11-11',
    projectType: '皖南山区水系水源保护林碳汇配额定向核销',
    verifier: '中国质量认证中心 (CQC)',
    status: '达标在控',
    forestOffsetHectares: 12500,
  },
  {
    id: 2,
    date: '2026-11-10',
    enterpriseName: '铜陵有色金属集团控股有限公司',
    shortName: '铜陵有色',
    district: '铜陵市',
    industry: '有色金属绿色低碳冶炼',
    carbonEmission: 1350,
    neutralizedAmount: 1203,
    progress: 89,
    investment: 2000,
    startTime: '2025-01-01',
    endTime: '2026-11-10',
    projectType: '长江沿线生态复绿林与矿区废弃地植被固碳',
    verifier: '中环联合认证中心 (CEC)',
    status: '超前中和',
    forestOffsetHectares: 18400,
  },
  {
    id: 3,
    date: '2026-11-09',
    enterpriseName: '马钢（集团）控股有限公司',
    shortName: '马钢股份',
    district: '马鞍山市',
    industry: '精品特钢氢冶金前沿降碳',
    carbonEmission: 1420,
    neutralizedAmount: 1150,
    progress: 81,
    investment: 1000,
    startTime: '2025-02-01',
    endTime: '2026-11-09',
    projectType: '大别山中幼林抚育与碳汇资产挂牌认购',
    verifier: '方圆标志认证集团 (CQM)',
    status: '达标在控',
    forestOffsetHectares: 14200,
  },
  {
    id: 4,
    date: '2026-11-08',
    enterpriseName: '淮河能源控股集团煤电分公司',
    shortName: '淮河能源',
    district: '淮南市',
    industry: '清洁高效煤电联产',
    carbonEmission: 1200,
    neutralizedAmount: 1000,
    progress: 83,
    investment: 1500,
    startTime: '2025-03-01',
    endTime: '2026-11-08',
    projectType: '两淮沉陷区湿地森林水网碳汇综合开发',
    verifier: '广州碳排放权交易中心绿碳部',
    status: '达标在控',
    forestOffsetHectares: 16000,
  },
  {
    id: 5,
    date: '2026-11-07',
    enterpriseName: '安徽叉车集团绿色制造示范基地',
    shortName: '安徽叉车',
    district: '合肥市',
    industry: '高端智能绿色工业车辆制造',
    carbonEmission: 1100,
    neutralizedAmount: 752,
    progress: 68,
    investment: 1000,
    startTime: '2025-01-15',
    endTime: '2026-11-07',
    projectType: '环巢湖生态屏障湿地林带固碳对冲核销',
    verifier: '中国节能协会碳中和认证专委会',
    status: '重点盯防',
    forestOffsetHectares: 9800,
  },
  {
    id: 6,
    date: '2026-11-06',
    enterpriseName: '安徽省能源集团皖能合肥发电有限公司',
    shortName: '皖能电力',
    district: '合肥市',
    industry: '超超临界清洁热电与综合供能',
    carbonEmission: 1602,
    neutralizedAmount: 923,
    progress: 58,
    investment: 1200,
    startTime: '2025-02-15',
    endTime: '2026-11-06',
    projectType: '江淮分水岭绿化带人工造林碳汇储备采购',
    verifier: '华测认证有限公司 (CTI)',
    status: '重点盯防',
    forestOffsetHectares: 11600,
  },
  {
    id: 7,
    date: '2026-11-05',
    enterpriseName: '黄山旅游发展股份有限公司生态碳汇部',
    shortName: '黄山旅游',
    district: '黄山市',
    industry: '国家级名胜生态低碳文旅',
    carbonEmission: 1523,
    neutralizedAmount: 1402,
    progress: 92,
    investment: 2500,
    startTime: '2025-01-01',
    endTime: '2026-11-05',
    projectType: '黄山天然针阔混交林生态保育CCER机制抵扣',
    verifier: '北京绿色交易所 (BGE)',
    status: '超前中和',
    forestOffsetHectares: 24000,
  },
  {
    id: 8,
    date: '2026-11-04',
    enterpriseName: '合肥京东方光电科技有限公司',
    shortName: '京东方光电',
    district: '合肥市',
    industry: '超高清薄膜晶体管半导体显示',
    carbonEmission: 1420,
    neutralizedAmount: 1106,
    progress: 78,
    investment: 1100,
    startTime: '2025-03-10',
    endTime: '2026-11-04',
    projectType: '皖北平原农田防护林带跨区域指标认购',
    verifier: '上海环境能源交易所',
    status: '达标在控',
    forestOffsetHectares: 13500,
  },
  {
    id: 9,
    date: '2026-11-02',
    enterpriseName: '徽商银行绿色金融低碳运营中心',
    shortName: '徽商银行',
    district: '合肥市',
    industry: '绿色总部金融与ESG低碳办公',
    carbonEmission: 1102,
    neutralizedAmount: 940,
    progress: 85,
    investment: 950,
    startTime: '2025-01-01',
    endTime: '2026-11-02',
    projectType: '安徽省林业碳票首期乡村振兴公益核销',
    verifier: '中国船级社质量认证公司 (CCSC)',
    status: '超前中和',
    forestOffsetHectares: 11200,
  },
  {
    id: 10,
    date: '2026-10-31',
    enterpriseName: '国家能源集团宿州热电有限公司',
    shortName: '国能宿州',
    district: '宿州市',
    industry: '热电联产集中清洁供暖',
    carbonEmission: 1139,
    neutralizedAmount: 850,
    progress: 75,
    investment: 1000,
    startTime: '2025-04-01',
    endTime: '2026-10-31',
    projectType: '宿州埇桥平原森林公园生态固碳综合核证',
    verifier: '中国质量认证中心 (CQC)',
    status: '达标在控',
    forestOffsetHectares: 10500,
  },
  {
    id: 11,
    date: '2026-10-16',
    enterpriseName: '奇瑞汽车股份有限公司新能源智能工厂',
    shortName: '奇瑞新能源',
    district: '芜湖市',
    industry: '新能源乘用车一体化绿色超级工厂',
    carbonEmission: 1380,
    neutralizedAmount: 1120,
    progress: 81,
    investment: 1800,
    startTime: '2025-01-01',
    endTime: '2026-10-16',
    projectType: '长江下游沿江湿地林木碳封存资产定向交割',
    verifier: '中环联合认证中心 (CEC)',
    status: '达标在控',
    forestOffsetHectares: 15300,
  },
  {
    id: 12,
    date: '2026-10-15',
    enterpriseName: '安徽皖维高新材料特种生物质基示范基地',
    shortName: '皖维高新',
    district: '合肥市',
    industry: '聚乙烯醇高分子与生物质复合材料',
    carbonEmission: 1260,
    neutralizedAmount: 995,
    progress: 79,
    investment: 1300,
    startTime: '2025-02-01',
    endTime: '2026-10-15',
    projectType: '巢湖环湖湿地芦苇与水生耐水林固碳综合开发',
    verifier: '方圆标志认证集团 (CQM)',
    status: '达标在控',
    forestOffsetHectares: 12800,
  },
  {
    id: 13,
    date: '2026-10-12',
    enterpriseName: '安徽华塑股份有限公司绿色化工产业园',
    shortName: '华塑股份',
    district: '滁州市',
    industry: '绿色热电与盐化工循环经济',
    carbonEmission: 1490,
    neutralizedAmount: 1060,
    progress: 71,
    investment: 1450,
    startTime: '2025-03-01',
    endTime: '2026-10-12',
    projectType: '滁州琅琊山外围丘陵生态造林固碳认购',
    verifier: '华测认证有限公司 (CTI)',
    status: '达标在控',
    forestOffsetHectares: 13900,
  },
  {
    id: 14,
    date: '2026-10-10',
    enterpriseName: '六安钢铁控股集团绿色低碳特钢基地',
    shortName: '六安钢铁',
    district: '六安市',
    industry: '低碳高强度建筑与特种工程钢材',
    carbonEmission: 1580,
    neutralizedAmount: 1170,
    progress: 74,
    investment: 1900,
    startTime: '2025-01-10',
    endTime: '2026-10-10',
    projectType: '大别山万佛湖一级水源保护区涵养林碳汇抵补',
    verifier: '北京绿色交易所 (BGE)',
    status: '达标在控',
    forestOffsetHectares: 17200,
  },
  {
    id: 15,
    date: '2026-10-08',
    enterpriseName: '池州九华生态文旅低碳综合示范区',
    shortName: '九华旅游',
    district: '池州市',
    industry: '国家级自然遗产与绿色森林康养',
    carbonEmission: 980,
    neutralizedAmount: 895,
    progress: 91,
    investment: 880,
    startTime: '2025-01-01',
    endTime: '2026-10-08',
    projectType: '九华山森林风景名胜区毛竹林高效固碳CCER抵扣',
    verifier: '中国船级社质量认证公司 (CCSC)',
    status: '超前中和',
    forestOffsetHectares: 14800,
  },
  {
    id: 16,
    date: '2026-10-05',
    enterpriseName: '蚌埠中建材信息显示材料绿色制造基地',
    shortName: '中建材蚌埠',
    district: '蚌埠市',
    industry: '超薄玻璃基板与新型光伏封装材料',
    carbonEmission: 1180,
    neutralizedAmount: 885,
    progress: 75,
    investment: 1100,
    startTime: '2025-04-10',
    endTime: '2026-10-05',
    projectType: '淮河干流生态防护林绿化工程增汇额转让',
    verifier: '上海环境能源交易所',
    status: '达标在控',
    forestOffsetHectares: 11400,
  },
  {
    id: 17,
    date: '2026-09-28',
    enterpriseName: '宣城美诺华药业绿色化学合成基地',
    shortName: '美诺华药业',
    district: '宣城市',
    industry: '高端生物医药与绿色原料药制造',
    carbonEmission: 950,
    neutralizedAmount: 830,
    progress: 87,
    investment: 900,
    startTime: '2025-02-20',
    endTime: '2026-09-28',
    projectType: '宣城敬亭山生态涵养林碳汇指标集中挂牌成交',
    verifier: '中国质量认证中心 (CQC)',
    status: '超前中和',
    forestOffsetHectares: 10800,
  },
  {
    id: 18,
    date: '2026-09-25',
    enterpriseName: '安徽金种子酒业零碳酿造数字化产业园',
    shortName: '金种子酒业',
    district: '阜阳市',
    industry: '绿色生态传统发酵与清洁副产物资源化',
    carbonEmission: 1040,
    neutralizedAmount: 810,
    progress: 78,
    investment: 850,
    startTime: '2025-05-01',
    endTime: '2026-09-25',
    projectType: '颍州西湖生态湿地保护林带自愿碳减排抵消',
    verifier: '中环联合认证中心 (CEC)',
    status: '达标在控',
    forestOffsetHectares: 9600,
  },
  {
    id: 19,
    date: '2026-09-20',
    enterpriseName: '中国石化安庆分公司绿色炼化升级示范基地',
    shortName: '安庆石化',
    district: '安庆市',
    industry: '沿江特大型石油化工绿色低碳炼化',
    carbonEmission: 1680,
    neutralizedAmount: 1210,
    progress: 72,
    investment: 2200,
    startTime: '2025-01-01',
    endTime: '2026-09-20',
    projectType: '安庆沿江湿地与天柱山国家森林涵养林双核减排',
    verifier: '华测认证有限公司 (CTI)',
    status: '达标在控',
    forestOffsetHectares: 21500,
  },
  {
    id: 20,
    date: '2026-09-15',
    enterpriseName: '淮北矿业控股集团绿色矿山开发管理部',
    shortName: '淮北矿业',
    district: '淮北市',
    industry: '煤炭绿色智能采选与矿区生态复垦',
    carbonEmission: 1320,
    neutralizedAmount: 990,
    progress: 75,
    investment: 1400,
    startTime: '2025-03-15',
    endTime: '2026-09-15',
    projectType: '淮北相山周边石灰岩山地复绿与碳汇工程开发',
    verifier: '方圆标志认证集团 (CQM)',
    status: '达标在控',
    forestOffsetHectares: 13200,
  },
];

interface CarbonIndustryViewProps {
  username?: string;
  onBackToPortal?: () => void;
}

export const CarbonIndustryView: React.FC<CarbonIndustryViewProps> = ({
  username = 'admin',
  onBackToPortal,
}) => {
  // Top Navigation Tabs: 'dashboard' (双碳看板) | 'peak_control' (碳达峰管控) | 'neutral_analysis' (碳中和分析) | 'enterprise_detail' (管控详情 - 默认聚焦最新截图)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'peak_control' | 'neutral_analysis' | 'enterprise_detail'>('enterprise_detail');

  // 当前详情页查看的企业对象 (默认取 ID 1，严格对应截图指标: 合肥市包河区, 1500万吨, 1156万吨, 71%, 1000万元)
  const [currentDetailEnterprise, setCurrentDetailEnterprise] = useState<NeutralEnterpriseRecord>(NEUTRAL_ENTERPRISE_DATA[0]);

  // ================= 碳中和分析专属状态 (匹配截图: 筛选搜索 + 真实数据列表 + 查看弹窗) =================
  const [neutralDistrict, setNeutralDistrict] = useState<string>('all');
  const [neutralEnterpriseSearch, setNeutralEnterpriseSearch] = useState<string>('');
  const [neutralProgressMin, setNeutralProgressMin] = useState<string>('');
  const [neutralProgressMax, setNeutralProgressMax] = useState<string>('');
  const [neutralDateRange, setNeutralDateRange] = useState<string>('2026-10-01 ~ 2026-11-11');
  const [neutralPage, setNeutralPage] = useState<number>(1);
  const [neutralPageSize, setNeutralPageSize] = useState<number>(10);
  const [neutralJumpPage, setNeutralJumpPage] = useState<string>('');
  const [selectedRecordDetail, setSelectedRecordDetail] = useState<NeutralEnterpriseRecord | null>(null);
  const [isSyncingData, setIsSyncingData] = useState<boolean>(false);
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Chart style for 各地碳达峰情况: 'area' (平滑双面积曲线图 - 默认) | 'horizontal' (横向对比条) | 'bar' (双柱图)
  const [cityChartStyle, setCityChartStyle] = useState<'area' | 'horizontal' | 'bar'>('area');

  // Chart style for 全年碳排放情况: 'grouped_bar' (分组三柱对比 - 默认) | 'stacked_bar' (堆叠构成柱) | 'area' (多层面积曲线)
  const [emissionChartStyle, setEmissionChartStyle] = useState<'grouped_bar' | 'stacked_bar' | 'area'>('grouped_bar');

  // Chart style for 碳达峰重点行业指标统计: 'speedometer' (科技半圆仪表盘 - 默认新样式) | 'capsule' (胶囊流光条卡) | 'donut' (圆环表盘)
  const [sectorChartStyle, setSectorChartStyle] = useState<'speedometer' | 'capsule' | 'donut'>('speedometer');

  // Dashboard sections layout order: 'timeline_first' (时序优先重排: KPI -> 全年碳排放时序大图 -> 各地达峰 + 重点行业 - 默认) | 'classic' (经典并列优先)
  const [dashboardLayout, setDashboardLayout] = useState<'timeline_first' | 'classic'>('timeline_first');

  // ================= 碳达峰管控专属状态 =================
  // 各地碳达峰进度排名视图: 'gauge_matrix' (科技环形仪表盘网格 - 默认新样式) | 'polar' (极坐标雷达环形) | 'bars' (横向柱状图) | 'table' (详细管控表)
  const [peakRankingViewMode, setPeakRankingViewMode] = useState<'gauge_matrix' | 'polar' | 'bars' | 'table'>('gauge_matrix');
  const [selectedPeakCity, setSelectedPeakCity] = useState<PeakControlRankingItem | null>(null);
  const [peakFilterStatus, setPeakFilterStatus] = useState<'all' | '超前推进' | '达标在控' | '重点监管'>('all');

  // 林业单位碳达峰成效趋势图表样式: 'capsule_bar' (发光胶囊复合柱状走势图 - 默认新样式) | 'step_cascade' (极光阶梯走势图) | 'area' (面积曲线图) | 'table' (年度明细表)
  const [peakTrendChartStyle, setPeakTrendChartStyle] = useState<'capsule_bar' | 'step_cascade' | 'area' | 'table'>('capsule_bar');
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState<PeakTrendPoint | null>(null);

  // 碳达峰管控页面排版模式: 'macro_flow' (宏观全景排版: 顶部指标矩阵 -> 成效趋势全景大屏 -> 各市环形表盘网格 - 默认新排版) | 'split' (两栏均衡分屏排版)
  const [peakControlLayout, setPeakControlLayout] = useState<'macro_flow' | 'split'>('macro_flow');

  // Hover states for dashboard
  const [hoveredCity, setHoveredCity] = useState<CityPeakData | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyEmission | null>(null);

  // ================= 碳达峰管控页面渲染 (重构排版与全新图表样式) =================
  const renderPeakControlView = () => {
    // 过滤与排序
    const filteredRanking = PEAK_CONTROL_RANKING.filter((item) => {
      if (peakFilterStatus === 'all') return true;
      return item.status === peakFilterStatus;
    });

    // 计算成效趋势的 SVG 坐标 (宽 960, 高 290)
    // Y 轴范围: 0 ~ 9000 万吨, 7 个刻度 (0, 1500, 3000, 4500, 6000, 7500, 9000)
    // X 轴: 2026年全年月度点 (26-01 ~ 26-12)
    const svgWidth = 960;
    const svgHeight = 290;
    const padLeft = 55;
    const padRight = 45;
    const padTop = 38;
    const padBottom = 32;
    const chartW = svgWidth - padLeft - padRight;
    const chartH = svgHeight - padTop - padBottom;
    const maxY = 9000;

    const points = FORESTRY_PEAK_TREND.map((pt, idx) => {
      const x = padLeft + (idx / (FORESTRY_PEAK_TREND.length - 1)) * chartW;
      const y = padTop + chartH - (pt.value / maxY) * chartH;
      return { x, y, pt };
    });

    // 过滤实测核算月份点 (26-01 ~ 26-10) 用于绘制连续曲线与渐变区域
    const measuredPoints = points.filter((p) => !p.pt.isPending && p.pt.value > 0);
    const measuredAreaPoints = measuredPoints.map((p) => ({ x: p.x, y: p.y }));
    const baselineY = padTop + chartH;
    const linePath = createSmoothPath(measuredAreaPoints);
    const areaPath = createSmoothAreaPath(measuredAreaPoints, baselineY);

    // 阶梯折线路径 (Step-Line Path)
    let stepPath = '';
    if (measuredPoints.length > 0) {
      stepPath = `M ${measuredPoints[0].x} ${measuredPoints[0].y}`;
      for (let i = 0; i < measuredPoints.length - 1; i++) {
        const pCurrent = measuredPoints[i];
        const pNext = measuredPoints[i + 1];
        const midX = (pCurrent.x + pNext.x) / 2;
        stepPath += ` H ${midX} V ${pNext.y} H ${pNext.x}`;
      }
    }

    // ================= 子组件: 各地碳达峰进度排名模块 =================
    const renderRankingSection = () => (
      <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-2xl relative flex flex-col justify-between">
        {/* 标头区域 */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#18284c] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#00c88c] rounded-xs inline-block" />
              <h3 className="text-sm font-bold text-slate-100 tracking-wide">各地碳达峰进度排名</h3>
            </div>

            {/* 图表样式切换开关 (环形表盘网格 / 极坐标雷达 / 横向柱状 / 详细数据表) */}
            <div className="flex items-center gap-1 bg-[#060c1d] border border-[#18284c] p-0.5 rounded-lg text-[10px]">
              <button
                type="button"
                onClick={() => setPeakRankingViewMode('gauge_matrix')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium flex items-center gap-1 ${
                  peakRankingViewMode === 'gauge_matrix'
                    ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="全新环形仪表盘网格样式"
              >
                <Gauge className="w-3 h-3" />
                <span>科技环形表盘 (新样式)</span>
              </button>
              <button
                type="button"
                onClick={() => setPeakRankingViewMode('polar')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium flex items-center gap-1 ${
                  peakRankingViewMode === 'polar'
                    ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="极坐标环形图"
              >
                <Activity className="w-3 h-3" />
                <span>极坐标对比图</span>
              </button>
              <button
                type="button"
                onClick={() => setPeakRankingViewMode('bars')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium flex items-center gap-1 ${
                  peakRankingViewMode === 'bars'
                    ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="原横向柱状图"
              >
                <BarChart3 className="w-3 h-3" />
                <span>横向条形图</span>
              </button>
              <button
                type="button"
                onClick={() => setPeakRankingViewMode('table')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium flex items-center gap-1 ${
                  peakRankingViewMode === 'table'
                    ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="详细管控数据表格"
              >
                <Table className="w-3 h-3" />
                <span>详细管控表</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              aria-label="管控状态筛选"
              value={peakFilterStatus}
              onChange={(e) => setPeakFilterStatus(e.target.value as any)}
              className="bg-[#060c1d] border border-[#18284c] text-[10px] text-slate-300 rounded px-2.5 py-1 outline-hidden cursor-pointer"
            >
              <option value="all">全省全部地市 ({PEAK_CONTROL_RANKING.length})</option>
              <option value="超前推进">超前推进</option>
              <option value="达标在控">达标在控</option>
              <option value="重点监管">重点监管</option>
            </select>
            <span className="text-[11px] text-slate-400 font-mono">数据更新：2026-11-11</span>
          </div>
        </div>

        {/* ================= 样式 1 (新样式): 科技环形仪表盘网格 (Radial Progress Dial Matrix) ================= */}
        {peakRankingViewMode === 'gauge_matrix' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 py-1">
            {filteredRanking.map((item) => {
              const isSelected = selectedPeakCity?.city === item.city;
              const radius = 34;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (item.progress / 100) * circumference;

              return (
                <div
                  key={item.city}
                  onClick={() => setSelectedPeakCity(isSelected ? null : item)}
                  className={`group bg-[#060c1d]/75 border rounded-xl p-3.5 flex flex-col justify-between items-center transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-[#00c88c] bg-[#0c1833] shadow-[0_0_20px_rgba(0,200,140,0.25)] scale-[1.02]'
                      : 'border-[#18284c] hover:border-emerald-500/50 hover:bg-[#081226]'
                  }`}
                >
                  {/* 卡片顶行: 排名徽章与城市名称 */}
                  <div className="w-full flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-4 h-4 rounded-xs text-[10px] font-bold font-mono flex items-center justify-center ${
                          item.rank === 1
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : item.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : item.rank === 3
                            ? 'bg-amber-700 text-amber-100'
                            : 'bg-[#18284c] text-slate-400'
                        }`}
                      >
                        {item.rank}
                      </span>
                      <span className="font-bold text-slate-100 group-hover:text-white transition-colors">
                        {item.city}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-sans ${
                        item.status === '超前推进'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                          : item.status === '达标在控'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-800/80'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* 核心环形进度仪表盘 (SVG Radial Gauge) */}
                  <div className="relative w-24 h-24 my-1 flex items-center justify-center">
                    <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 88 88">
                      {/* 背景底轨 */}
                      <circle
                        cx="44"
                        cy="44"
                        r={radius}
                        stroke="#132242"
                        strokeWidth="7"
                        fill="none"
                      />
                      {/* 渐变流光高亮进度环 */}
                      <circle
                        cx="44"
                        cy="44"
                        r={radius}
                        stroke="url(#ringGradPeak)"
                        strokeWidth="7"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="ringGradPeak" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00b377" />
                          <stop offset="50%" stopColor="#00c88c" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* 表盘内部指标 */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-lg font-black font-mono text-white tracking-tight group-hover:text-[#00e699] transition-colors">
                        {item.progress}%
                      </span>
                      <span className="text-[9px] text-slate-400 font-sans">达峰进度</span>
                    </div>
                  </div>

                  {/* 底部指标精细速览 */}
                  <div className="w-full mt-2 pt-2 border-t border-[#18284c]/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500 font-sans text-[9px] block">实际管控</span>
                      <span className="text-white font-bold">{item.actualControl}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 font-sans text-[9px] block">预计窗口</span>
                      <span className="text-[#38bdf8] font-bold">{item.expectedPeakYear}</span>
                    </div>
                  </div>

                  {/* 展开浮层 */}
                  {isSelected && (
                    <div className="w-full mt-2 pt-1.5 border-t border-emerald-900/60 text-[9px] font-mono text-emerald-300 flex justify-between animate-in fade-in">
                      <span>目标上限: {item.targetLimit}万吨</span>
                      <span>同比: {item.reductionRate}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ================= 样式 2: 极坐标雷达环形对比图 (Polar Concentric Orbit) ================= */}
        {peakRankingViewMode === 'polar' && (
          <div className="py-2 flex flex-col lg:flex-row items-center justify-around gap-6">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-lg -rotate-90">
                {/* 中心装饰环 */}
                <circle cx="160" cy="160" r="20" fill="#04121a" stroke="#00c88c" strokeWidth="1" />
                <circle cx="160" cy="160" r="6" fill="#00e699" />

                {/* 10 个地市的同心圆轨道 */}
                {filteredRanking.map((item, idx) => {
                  const r = 32 + idx * 12;
                  const c = 2 * Math.PI * r;
                  const offset = c - (item.progress / 100) * c;
                  const isCurHover = selectedPeakCity?.city === item.city;

                  return (
                    <g key={item.city} className="cursor-pointer" onClick={() => setSelectedPeakCity(item)}>
                      {/* 背景轨道底圈 */}
                      <circle cx="160" cy="160" r={r} fill="none" stroke="#132242" strokeWidth="7" opacity="0.4" />
                      {/* 彩色进度轨道 */}
                      <circle
                        cx="160"
                        cy="160"
                        r={r}
                        fill="none"
                        stroke={isCurHover ? '#38bdf8' : idx < 3 ? '#00e699' : '#00c88c'}
                        strokeWidth="7"
                        strokeDasharray={c}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-700 hover:opacity-100"
                        opacity={isCurHover ? 1 : 0.85}
                      />
                    </g>
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-sans">全省控峰极轨</span>
                <span className="text-xs font-bold font-mono text-[#00e699]">10 地市</span>
              </div>
            </div>

            {/* 右侧地市极轨图例列表 */}
            <div className="flex-1 grid grid-cols-2 gap-2 text-xs font-mono">
              {filteredRanking.map((item, idx) => {
                const isSelected = selectedPeakCity?.city === item.city;
                return (
                  <div
                    key={item.city}
                    onClick={() => setSelectedPeakCity(isSelected ? null : item)}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0c1833] border-[#00c88c] text-white'
                        : 'bg-[#060c1d] border-[#18284c] text-slate-300 hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00c88c]" />
                      <span className="font-sans font-medium">{item.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#00e699]">{item.progress}%</span>
                      <span className="text-[10px] text-slate-400">({item.actualControl}万吨)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 样式 3: 横向柱状图 (原条形图样式) ================= */}
        {peakRankingViewMode === 'bars' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 py-1">
            {filteredRanking.map((item) => {
              const isSelected = selectedPeakCity?.city === item.city;
              return (
                <div
                  key={item.city}
                  onClick={() => setSelectedPeakCity(isSelected ? null : item)}
                  className={`p-2.5 rounded-lg transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0e1a38] border-[#00c88c] shadow-lg'
                      : 'bg-[#060c1d]/60 hover:bg-[#0c1630] border-transparent hover:border-[#18284c]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-xs text-[10px] font-bold font-mono flex items-center justify-center ${
                          item.rank === 1
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : item.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : item.rank === 3
                            ? 'bg-amber-700 text-amber-100'
                            : 'bg-[#18284c] text-slate-400'
                        }`}
                      >
                        {item.rank}
                      </span>
                      <span className="font-medium text-slate-200">{item.city}</span>
                      <span className="text-[9px] text-slate-400 bg-[#091126] px-1.5 py-0.2 rounded border border-[#18284c]">
                        {item.tag}
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono text-[#00e699]">{item.progress}%</span>
                  </div>

                  <div className="w-full h-3 bg-[#101b33] rounded-xs overflow-hidden p-0.5 border border-[#1b2b4d]">
                    <div
                      className="h-full bg-gradient-to-r from-[#00b377] via-[#00c88c] to-[#00f5a0] rounded-xs transition-all duration-700"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= 样式 4: 详细管控数据表格 ================= */}
        {peakRankingViewMode === 'table' && (
          <div className="overflow-x-auto text-[11px] py-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#18284c] text-[10px] text-slate-400 font-medium">
                  <th className="py-2 px-2">排名</th>
                  <th className="py-2 px-2">行政区划</th>
                  <th className="py-2 px-2 text-center">达峰管控进度</th>
                  <th className="py-2 px-2 text-right">目标限额 (万吨)</th>
                  <th className="py-2 px-2 text-right">2026实际管控 (万吨)</th>
                  <th className="py-2 px-2 text-center">同比变动</th>
                  <th className="py-2 px-2 text-center">预计达峰时间</th>
                  <th className="py-2 px-2 text-center">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18284c]/50 font-mono">
                {filteredRanking.map((item) => (
                  <tr key={item.city} className="hover:bg-[#0c1630] transition-colors">
                    <td className="py-2 px-2 text-slate-300 font-bold">{item.rank}</td>
                    <td className="py-2 px-2 font-sans text-white font-medium">{item.city}</td>
                    <td className="py-2 px-2 text-center text-[#00e699] font-bold">{item.progress}%</td>
                    <td className="py-2 px-2 text-right text-slate-300">{item.targetLimit}</td>
                    <td className="py-2 px-2 text-right text-white font-bold">{item.actualControl}</td>
                    <td className="py-2 px-2 text-center text-emerald-400">{item.reductionRate}</td>
                    <td className="py-2 px-2 text-center text-[#38bdf8]">{item.expectedPeakYear}</td>
                    <td className="py-2 px-2 text-center">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-sans ${
                          item.status === '超前推进'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : item.status === '达标在控'
                            ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 底部摘要提示 */}
        <div className="mt-3 pt-2.5 border-t border-[#18284c] text-[10px] text-slate-400 flex items-center justify-between">
          <span>* 采用2026最新实测与规划方案加权核算，支持点击任意地市联动查看深度细化指标</span>
          <span className="font-mono text-[#00e699]">全省平均进度 54.6%</span>
        </div>
      </div>
    );

    // ================= 子组件: 林业单位碳达峰成效趋势模块 =================
    const renderTrendSection = () => (
      <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-2xl relative flex flex-col justify-between">
        {/* 标头 & 图表控制 & 数据更新时间 */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#18284c] pb-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#00c88c] rounded-xs inline-block" />
              <h3 className="text-sm font-bold text-slate-100 tracking-wide">林业单位碳达峰成效趋势</h3>
            </div>

            {/* 图表样式切换开关 (发光胶囊复合柱图 / 极光阶梯走势 / 平滑面积曲线 / 趋势数据明细) */}
            <div className="flex items-center gap-1 bg-[#060c1d] border border-[#18284c] p-0.5 rounded-lg text-[10px]">
              <button
                type="button"
                onClick={() => setPeakTrendChartStyle('capsule_bar')}
                className={`px-2.5 py-0.5 rounded transition-all cursor-pointer font-medium flex items-center gap-1 ${
                  peakTrendChartStyle === 'capsule_bar'
                    ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="全新发光胶囊柱状复合走势图"
              >
                <BarChart3 className="w-3 h-3" />
                <span>发光胶囊柱图 (新样式)</span>
              </button>
              <button
                type="button"
                onClick={() => setPeakTrendChartStyle('step_cascade')}
                className={`px-2.5 py-0.5 rounded transition-all cursor-pointer font-medium flex items-center gap-1 ${
                  peakTrendChartStyle === 'step_cascade'
                    ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="阶梯分段走势图"
              >
                <Activity className="w-3 h-3" />
                <span>极光阶梯走势</span>
              </button>
              <button
                type="button"
                onClick={() => setPeakTrendChartStyle('area')}
                className={`px-2.5 py-0.5 rounded transition-all cursor-pointer font-medium flex items-center gap-1 ${
                  peakTrendChartStyle === 'area'
                    ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="原平滑面积曲线图"
              >
                <LineChart className="w-3 h-3" />
                <span>平滑曲线图</span>
              </button>
              <button
                type="button"
                onClick={() => setPeakTrendChartStyle('table')}
                className={`px-2.5 py-0.5 rounded transition-all cursor-pointer font-medium flex items-center gap-1 ${
                  peakTrendChartStyle === 'table'
                    ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="趋势数据明细表"
              >
                <Table className="w-3 h-3" />
                <span>趋势数据表</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">数据更新：2026-11-11</span>
            <span className="text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
              单位：万吨
            </span>
          </div>
        </div>

        {/* ================= 样式 1 (新样式): 发光胶囊复合柱状走势图 (Luminous Capsule Bar Chart) ================= */}
        {peakTrendChartStyle === 'capsule_bar' && (
          <div className="relative w-full overflow-hidden select-none py-1">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto max-h-[350px] drop-shadow-md">
              <defs>
                {/* 历史实测渐变胶囊柱 */}
                <linearGradient id="histCapsuleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00f5a0" stopOpacity="0.95" />
                  <stop offset="40%" stopColor="#00c88c" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#032115" stopOpacity="0.4" />
                </linearGradient>

                {/* 当前节点 2026 璀璨双色胶囊柱 */}
                <linearGradient id="curCapsuleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                  <stop offset="35%" stopColor="#00e699" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#05281e" stopOpacity="0.5" />
                </linearGradient>

                {/* 规划预期胶囊柱 */}
                <linearGradient id="futCapsuleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#0284c7" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#081e3d" stopOpacity="0.3" />
                </linearGradient>

                {/* 连线高光滤镜 */}
                <filter id="glowLineCapsule" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 背景阶段分区色块 (2026年阶段分布) */}
              {(() => {
                const p01 = points.find((p) => p.pt.year === '26-01');
                const p04 = points.find((p) => p.pt.year === '26-04');
                const p05 = points.find((p) => p.pt.year === '26-05');
                const p09 = points.find((p) => p.pt.year === '26-09');
                const p10 = points.find((p) => p.pt.year === '26-10');
                const p12 = points.find((p) => p.pt.year === '26-12');
                if (!p01 || !p04 || !p05 || !p09 || !p10 || !p12) return null;

                const zone1W = p04.x - p01.x + 36;
                const zone2X = p05.x - 18;
                const zone2W = p09.x - zone2X + 18;
                const zone3X = p10.x + 18;
                const zone3W = p12.x - zone3X + 22;

                return (
                  <g opacity="0.4">
                    {/* 阶段 1: 春季造林扩绿奠基期 */}
                    <rect
                      x={p01.x - 20}
                      y={padTop}
                      width={zone1W}
                      height={chartH}
                      fill="#061e16"
                      rx="6"
                    />
                    <text
                      x={p01.x - 6}
                      y={padTop + 14}
                      fill="#00c88c"
                      fontSize="9"
                      fontFamily="sans-serif"
                    >
                      春季造林扩绿期 (26-01~04)
                    </text>

                    {/* 阶段 2: 抚育提质攻坚期 */}
                    <rect
                      x={zone2X}
                      y={padTop}
                      width={zone2W}
                      height={chartH}
                      fill="#08261e"
                      rx="6"
                    />
                    <text
                      x={zone2X + 10}
                      y={padTop + 14}
                      fill="#00f5a0"
                      fontSize="9"
                      fontFamily="sans-serif"
                    >
                      抚育提质攻坚期 (26-05~09)
                    </text>

                    {/* 阶段 3: 年底规划待测期 */}
                    <rect
                      x={zone3X}
                      y={padTop}
                      width={zone3W}
                      height={chartH}
                      fill="#081830"
                      rx="6"
                    />
                    <text
                      x={zone3X + 8}
                      y={padTop + 14}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="sans-serif"
                    >
                      年底履约待测期 (26-11~12)
                    </text>
                  </g>
                );
              })()}

              {/* Y 轴水平网格线与刻度 */}
              {[0, 1500, 3000, 4500, 6000, 7500, 9000].map((val) => {
                const y = padTop + chartH - (val / maxY) * chartH;
                return (
                  <g key={val}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={svgWidth - padRight}
                      y2={y}
                      stroke="#18284c"
                      strokeWidth="1"
                      strokeDasharray={val === 0 ? 'none' : '3,3'}
                    />
                    <text
                      x={padLeft - 10}
                      y={y + 4}
                      textAnchor="end"
                      fill="#64748b"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* 贯穿顶部的动态光晕平滑走势线 (实测月度 26-01 ~ 26-10) */}
              <path
                d={linePath}
                fill="none"
                stroke="#00e699"
                strokeWidth="2.5"
                filter="url(#glowLineCapsule)"
                opacity="0.8"
              />

              {/* 2026-10 当前核算月份分割指引标线 */}
              {(() => {
                const cur = points.find((p) => p.pt.year === '26-10');
                if (!cur) return null;
                return (
                  <g>
                    <line
                      x1={cur.x}
                      y1={padTop}
                      x2={cur.x}
                      y2={padTop + chartH}
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                    />
                    <rect
                      x={cur.x - 44}
                      y={padTop + 2}
                      width="88"
                      height="18"
                      rx="4"
                      fill="#06241a"
                      stroke="#38bdf8"
                      strokeWidth="1"
                    />
                    <text
                      x={cur.x}
                      y={padTop + 14}
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                    >
                      当前核算点 (26-10)
                    </text>
                  </g>
                );
              })()}

              {/* 发光胶囊柱体与顶端数值气泡 */}
              {points.map((p) => {
                const isCurNode = p.pt.year === '26-10';
                const isHovered = hoveredTrendPoint?.year === p.pt.year;
                const isPending = p.pt.isPending || p.pt.value === 0;
                const colW = 34;
                const colH = Math.max((p.pt.value / maxY) * chartH, 6);
                const colY = padTop + chartH - colH;

                if (isPending) {
                  return (
                    <g
                      key={p.pt.year}
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredTrendPoint(p.pt)}
                      onMouseLeave={() => setHoveredTrendPoint(null)}
                    >
                      <rect
                        x={p.x - 18}
                        y={padTop + chartH - 42}
                        width="36"
                        height="42"
                        rx="6"
                        fill="#091126"
                        stroke="#334155"
                        strokeWidth="1.2"
                        strokeDasharray="3,3"
                      />
                      <text
                        x={p.x}
                        y={padTop + chartH - 24}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="9"
                        fontFamily="sans-serif"
                      >
                        未到期
                      </text>
                      <text
                        x={p.x}
                        y={padTop + chartH - 10}
                        textAnchor="middle"
                        fill="#475569"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        0
                      </text>
                    </g>
                  );
                }

                return (
                  <g
                    key={p.pt.year}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredTrendPoint(p.pt)}
                    onMouseLeave={() => setHoveredTrendPoint(null)}
                  >
                    {/* 柱体发光底衬 */}
                    {(isCurNode || isHovered) && (
                      <rect
                        x={p.x - colW / 2 - 3}
                        y={colY - 3}
                        width={colW + 6}
                        height={colH + 6}
                        rx="12"
                        fill={isCurNode ? '#38bdf8' : '#00c88c'}
                        fillOpacity="0.25"
                        className="animate-pulse"
                      />
                    )}

                    {/* 核心高科技发光胶囊柱 */}
                    <rect
                      x={p.x - colW / 2}
                      y={colY}
                      width={colW}
                      height={colH}
                      rx="10"
                      fill={isCurNode ? 'url(#curCapsuleGrad)' : 'url(#histCapsuleGrad)'}
                      stroke={isCurNode ? '#ffffff' : isHovered ? '#00f5a0' : '#18284c'}
                      strokeWidth={isCurNode || isHovered ? '1.5' : '0.8'}
                      className="transition-all duration-300 hover:brightness-110"
                    />

                    {/* 柱顶环形光环节点 */}
                    <circle
                      cx={p.x}
                      cy={colY + 6}
                      r="4"
                      fill="#ffffff"
                      opacity={isCurNode ? 1 : 0.8}
                    />

                    {/* 顶端悬浮指标数字气泡 */}
                    <g>
                      <rect
                        x={p.x - 26}
                        y={colY - 22}
                        width="52"
                        height="17"
                        rx="4"
                        fill="#091126"
                        stroke={isCurNode ? '#38bdf8' : isHovered ? '#00e699' : '#18284c'}
                        strokeWidth="0.8"
                      />
                      <text
                        x={p.x}
                        y={colY - 10}
                        textAnchor="middle"
                        fill={isCurNode ? '#38bdf8' : '#ffffff'}
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {p.pt.value.toLocaleString()}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* X 轴月份刻度 (2026年 26-01 ~ 26-12) */}
              {points.map((p) => {
                const isCur = p.pt.year === '26-10';
                const isPending = p.pt.isPending || p.pt.value === 0;
                return (
                  <text
                    key={p.pt.year}
                    x={p.x}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    fill={
                      hoveredTrendPoint?.year === p.pt.year
                        ? '#00e699'
                        : isCur
                        ? '#38bdf8'
                        : isPending
                        ? '#64748b'
                        : '#94a3b8'
                    }
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight={isCur ? 'bold' : 'normal'}
                  >
                    {p.pt.year}
                  </text>
                );
              })}
            </svg>

            {/* 悬浮提示框卡片 */}
            {hoveredTrendPoint && (
              <div className="absolute top-3 right-6 bg-[#0a142e]/95 border border-[#00c88c] backdrop-blur-md rounded-lg p-3 shadow-2xl text-[11px] text-slate-200 z-20 pointer-events-none animate-in fade-in">
                <div className="font-bold text-white mb-1.5 border-b border-[#18284c] pb-1 flex justify-between gap-6">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00e699]" />
                    {hoveredTrendPoint.monthName || hoveredTrendPoint.year} 林业碳成效
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {hoveredTrendPoint.value > 0 ? `${hoveredTrendPoint.value.toLocaleString()} 万吨` : '未到期 (0万吨)'}
                  </span>
                </div>
                <div className="space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 font-sans">阶段属性:</span>
                    <span className={hoveredTrendPoint.stage === '当前节点' ? 'text-[#38bdf8] font-bold' : hoveredTrendPoint.stage === '未到期' ? 'text-slate-400' : 'text-emerald-400 font-bold'}>
                      {hoveredTrendPoint.stage}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 font-sans">森林覆盖率:</span>
                    <span className="text-emerald-300 font-bold">{hoveredTrendPoint.forestCoverage}</span>
                  </div>
                  <div className="flex justify-between gap-4 pt-1 border-t border-[#18284c] text-slate-300 font-sans text-[9px]">
                    <span>实施重点: {hoveredTrendPoint.policy}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 样式 2: 极光阶梯走势图 (Step Cascade Chart) ================= */}
        {peakTrendChartStyle === 'step_cascade' && (
          <div className="relative w-full overflow-hidden select-none py-1">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto max-h-[350px] drop-shadow-md">
              {/* Y 轴水平网格线 */}
              {[0, 1500, 3000, 4500, 6000, 7500, 9000].map((val) => {
                const y = padTop + chartH - (val / maxY) * chartH;
                return (
                  <g key={val}>
                    <line x1={padLeft} y1={y} x2={svgWidth - padRight} y2={y} stroke="#18284c" strokeWidth="1" strokeDasharray="3,3" />
                    <text x={padLeft - 10} y={y + 4} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* 阶梯线条 (实测阶段 26-01 ~ 26-10) */}
              <path
                d={stepPath}
                fill="none"
                stroke="#00c88c"
                strokeWidth="3"
                className="transition-all duration-500"
              />

              {/* 阶梯转角圆点 */}
              {points.map((p) => {
                const isCur = p.pt.year === '26-10';
                const isPending = p.pt.isPending || p.pt.value === 0;
                return (
                  <circle
                    key={p.pt.year}
                    cx={p.x}
                    cy={p.y}
                    r={isCur ? '6' : '4.5'}
                    fill={isCur ? '#38bdf8' : isPending ? '#334155' : '#00e699'}
                    stroke="#ffffff"
                    strokeWidth={isCur ? '2' : '1.5'}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredTrendPoint(p.pt)}
                    onMouseLeave={() => setHoveredTrendPoint(null)}
                  />
                );
              })}

              {/* X 轴月份刻度 */}
              {points.map((p) => {
                const isCur = p.pt.year === '26-10';
                const isPending = p.pt.isPending || p.pt.value === 0;
                return (
                  <text
                    key={p.pt.year}
                    x={p.x}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    fill={isCur ? '#38bdf8' : isPending ? '#64748b' : '#94a3b8'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight={isCur ? 'bold' : 'normal'}
                  >
                    {p.pt.year}
                  </text>
                );
              })}
            </svg>
          </div>
        )}

        {/* ================= 样式 3: 原平滑面积曲线图 ================= */}
        {peakTrendChartStyle === 'area' && (
          <div className="relative w-full overflow-hidden select-none py-1">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto max-h-[340px] drop-shadow-md">
              <defs>
                <linearGradient id="areaGradOld" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00c88c" stopOpacity="0.55" />
                  <stop offset="60%" stopColor="#00c88c" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00c88c" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {[0, 1500, 3000, 4500, 6000, 7500, 9000].map((val) => {
                const y = padTop + chartH - (val / maxY) * chartH;
                return (
                  <g key={val}>
                    <line x1={padLeft} y1={y} x2={svgWidth - padRight} y2={y} stroke="#18284c" strokeWidth="1" strokeDasharray="3,3" />
                    <text x={padLeft - 10} y={y + 4} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">{val}</text>
                  </g>
                );
              })}
              <path d={areaPath} fill="url(#areaGradOld)" />
              <path d={linePath} fill="none" stroke="#00c88c" strokeWidth="2.5" />
              {points.map((p) => {
                const isCur = p.pt.year === '26-10';
                const isPending = p.pt.isPending || p.pt.value === 0;
                return (
                  <circle
                    key={p.pt.year}
                    cx={p.x}
                    cy={p.y}
                    r={isCur ? '5' : '3.5'}
                    fill={isCur ? '#38bdf8' : isPending ? '#334155' : '#00e699'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                );
              })}
              {points.map((p) => {
                const isCur = p.pt.year === '26-10';
                const isPending = p.pt.isPending || p.pt.value === 0;
                return (
                  <text
                    key={p.pt.year}
                    x={p.x}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    fill={isCur ? '#38bdf8' : isPending ? '#64748b' : '#94a3b8'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight={isCur ? 'bold' : 'normal'}
                  >
                    {p.pt.year}
                  </text>
                );
              })}
            </svg>
          </div>
        )}

        {/* ================= 样式 4: 趋势数据明细表 ================= */}
        {peakTrendChartStyle === 'table' && (
          <div className="overflow-x-auto text-[11px] py-2">
            <table className="w-full text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-[#18284c] text-[10px] text-slate-400 font-sans">
                  <th className="py-2 px-2">月份 (2026年)</th>
                  <th className="py-2 px-2 text-right">林业成效值 (万吨)</th>
                  <th className="py-2 px-2 text-center">阶段分类</th>
                  <th className="py-2 px-2 text-center">森林覆盖率</th>
                  <th className="py-2 px-2 font-sans">关键实施重点与工程</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18284c]/50">
                {FORESTRY_PEAK_TREND.map((item) => (
                  <tr
                    key={item.year}
                    className={`hover:bg-[#0c1630] transition-colors ${
                      item.year === '26-10' ? 'bg-[#00c88c]/15 text-white font-bold' : item.isPending ? 'text-slate-500' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-2 font-bold font-mono">
                      {item.year} <span className="text-[10px] font-normal text-slate-400 font-sans">({item.monthName})</span>
                    </td>
                    <td className={`py-2 px-2 text-right font-bold ${item.isPending ? 'text-slate-500' : 'text-[#00e699]'}`}>
                      {item.value > 0 ? item.value.toLocaleString() : '未到期 (0)'}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-sans ${
                          item.stage === '当前节点'
                            ? 'bg-sky-950 text-sky-300 border border-sky-700'
                            : item.stage === '历史实测'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {item.stage}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center text-slate-300">{item.forestCoverage}</td>
                    <td className="py-2 px-2 font-sans text-slate-400 text-[10px]">{item.policy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 底部政策协同阶段里程碑 */}
        <div className="mt-3 pt-2.5 border-t border-[#18284c] flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00c88c]" />
              26-01 ~ 26-04 春季造林扩绿奠基期
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-[#00e699]" />
              26-05 ~ 26-09 森林抚育提质攻坚期
            </span>
            <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
              26-10 当前动态核算节点 (5,860 万吨)
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              26-11 ~ 26-12 年底清缴待测期 (未到期)
            </span>
          </div>
          <div className="font-mono text-emerald-300/80">
            * 2026年安徽省林业碳汇累计碳抵消率达 38.6%
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-4 animate-in fade-in duration-300 w-full">
        {/* ===================== 顶部调度工具条 & 排版切换 ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#091126] border border-[#18284c] rounded-xl px-5 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
            <h2 className="text-sm font-bold text-white tracking-wide">安徽省林业碳达峰智能立体管控指挥中心</h2>
            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
              2026-11-11 动态核算实时在网
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* 排版重构控制开关 (满足用户"同时几个版块的排版帮我重新排版"的要求) */}
            <div className="flex items-center gap-1 bg-[#060c1d] border border-[#18284c] p-0.5 rounded-lg text-[11px]">
              <span className="text-slate-400 px-1 font-medium flex items-center gap-1">
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
                <span>版块排版:</span>
              </span>
              <button
                type="button"
                onClick={() => setPeakControlLayout('macro_flow')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium ${
                  peakControlLayout === 'macro_flow'
                    ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="全新宏观全景排版: 顶部指标矩阵 -> 成效趋势全幅置顶 -> 各地市环形表盘网格置底"
              >
                宏观全景排版 (新排版)
              </button>
              <button
                type="button"
                onClick={() => setPeakControlLayout('split')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer font-medium ${
                  peakControlLayout === 'split'
                    ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="左右两栏分屏并列排版"
              >
                左右分屏排版
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-300 border-l border-[#18284c] pl-3">
              <span className="text-slate-400 font-sans">全省控峰推进度:</span>
              <span className="text-[#00e699] font-bold">86.4%</span>
              <button
                type="button"
                onClick={() => setActiveTab('neutral_analysis')}
                className="ml-2 flex items-center gap-1 px-2.5 py-0.5 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 rounded text-[10px] font-sans transition-all cursor-pointer"
                title="切换至企业碳中和与林业碳汇核销数据列表"
              >
                <FileText className="w-3 h-3 text-[#00e699]" />
                <span>企业中和台账</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================== 顶部第 1 行: 四大核心中枢指标卡 (Hero Metrics Row) ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 指标卡 1: 林业单位碳达峰项目数 (保留截图工业厂区与光伏背景视觉) */}
          <div className="bg-[#091126] border border-[#18284c] rounded-xl overflow-hidden relative shadow-xl p-5 flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#061e15] via-[#081a29] to-[#040f1a]" />
              <svg className="w-full h-full object-cover">
                <polygon points="60,20 180,10 240,60 120,70" fill="#00c88c" fillOpacity="0.2" />
                <polygon points="120,70 240,60 240,120 120,130" fill="#031b14" />
                <circle cx="200" cy="90" r="20" fill="#00e699" fillOpacity="0.1" />
              </svg>
              <div className="absolute inset-0 bg-[#091126]/85" />
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Factory className="w-3.5 h-3.5 text-[#00e699]" />
                  林业单位碳达峰项目数
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.2 rounded font-mono">
                  +18项
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-black font-mono text-[#00c88c]">230</span>
                <span className="text-xl font-bold text-[#00c88c]">↑</span>
                <span className="text-[11px] text-slate-300 ml-1 font-sans">进行中 210 ↑</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-[#18284c]/60 flex justify-between">
                <span>在研转化率 91.3%</span>
                <span className="text-[#00e699]">受控主体稳健</span>
              </div>
            </div>
          </div>

          {/* 指标卡 2: 林业单位碳达峰值 (保留截图高山森林云雾背景视觉) */}
          <div className="bg-[#091126] border border-[#18284c] rounded-xl overflow-hidden relative shadow-xl p-5 flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#041a14] via-[#051c24] to-[#04121a]" />
              <svg className="w-full h-full object-cover">
                <path d="M 0 100 Q 80 40 160 80 T 320 60 L 320 160 L 0 160 Z" fill="#00c88c" fillOpacity="0.25" />
              </svg>
              <div className="absolute inset-0 bg-[#091126]/85" />
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Trees className="w-3.5 h-3.5 text-[#00e699]" />
                  林业单位碳达峰值
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.2 rounded font-mono">
                  高位锁定
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-black font-mono text-[#00c88c]">1860</span>
                <span className="text-sm font-bold text-slate-200">万吨</span>
                <span className="text-[11px] text-slate-300 ml-1 font-sans">中和 1236 ↑</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-[#18284c]/60 flex justify-between">
                <span>中和对冲率 66.5%</span>
                <span className="text-[#38bdf8]">抵消储备充足</span>
              </div>
            </div>
          </div>

          {/* 指标卡 3: 全省碳达峰推进合规率 */}
          <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00e699]" />
                全省控峰推进合规率
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">同比 +4.8%</span>
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl lg:text-4xl font-black font-mono text-[#38bdf8]">92.4%</span>
              <span className="text-xs text-slate-300 font-sans ml-1">超预期达标</span>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-[#18284c]/60 flex justify-between">
              <span>重点企业履约率 99.4%</span>
              <span className="text-[#00e699]">10地市受控在网</span>
            </div>
          </div>

          {/* 指标卡 4: 2030 碳达峰窗口推演 */}
          <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                2030 碳达峰窗口推演
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-950/80 border border-amber-800/60 px-1.5 py-0.2 rounded font-mono">
                攻坚提速
              </span>
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl lg:text-4xl font-black font-mono text-amber-400">提前14</span>
              <span className="text-sm font-bold text-slate-200">个月</span>
              <span className="text-[11px] text-slate-300 font-sans">锁定峰值</span>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-[#18284c]/60 flex justify-between">
              <span>预计达峰期 2028-2029</span>
              <span className="text-amber-300">平稳步入中和</span>
            </div>
          </div>
        </div>

        {/* ===================== 排版呈现模式分支 ===================== */}
        {peakControlLayout === 'macro_flow' ? (
          /* 模式 A (新排版 - 推荐): 宏观全景排版 (成效趋势全幅大屏置顶 + 各地市环形表盘网格置底) */
          <div className="space-y-4">
            {/* 全幅宏观中枢: 林业单位碳达峰成效趋势 (带发光胶囊复合柱图新样式) */}
            <div className="w-full">
              {renderTrendSection()}
            </div>

            {/* 全幅网格阵列: 各地碳达峰进度排名 (带5列x2行科技环形表盘新样式) */}
            <div className="w-full">
              {renderRankingSection()}
            </div>
          </div>
        ) : (
          /* 模式 B: 两栏均衡分屏排版 (各地排名 6 列 + 成效趋势 6 列) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
            <div className="lg:col-span-6 flex flex-col">
              {renderRankingSection()}
            </div>
            <div className="lg:col-span-6 flex flex-col">
              {renderTrendSection()}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ================= 碳中和分析页面渲染 (严格匹配截图: 筛选搜索 + 数据列表 + 近期时间 + 统一暗色科技背景) =================
  const renderNeutralAnalysisView = () => {
    // 动态过滤企业数据
    const filteredEnterprises = NEUTRAL_ENTERPRISE_DATA.filter((item) => {
      // 1. 行政区划筛选
      if (neutralDistrict !== 'all' && item.district !== neutralDistrict) {
        return false;
      }
      // 2. 企业名称模糊检索
      if (
        neutralEnterpriseSearch.trim() &&
        !item.enterpriseName.toLowerCase().includes(neutralEnterpriseSearch.trim().toLowerCase()) &&
        !item.shortName.toLowerCase().includes(neutralEnterpriseSearch.trim().toLowerCase())
      ) {
        return false;
      }
      // 3. 中和进度下限
      if (neutralProgressMin !== '' && !isNaN(Number(neutralProgressMin))) {
        if (item.progress < Number(neutralProgressMin)) return false;
      }
      // 4. 中和进度上限
      if (neutralProgressMax !== '' && !isNaN(Number(neutralProgressMax))) {
        if (item.progress > Number(neutralProgressMax)) return false;
      }
      return true;
    });

    const totalItems = 2000; // 遵循截图 "共 2000 条数据" 展示
    const totalPages = Math.ceil(totalItems / neutralPageSize);
    
    // 当前页数据切片 (数据循环复用支持分页演示)
    const startIndex = (neutralPage - 1) * neutralPageSize;
    const paginatedItems = Array.from({ length: Math.min(neutralPageSize, filteredEnterprises.length) }).map((_, idx) => {
      const dataIdx = (startIndex + idx) % filteredEnterprises.length;
      const baseItem = filteredEnterprises[dataIdx] || NEUTRAL_ENTERPRISE_DATA[0];
      return {
        ...baseItem,
        displayId: startIndex + idx + 1,
      };
    });

    // 搜索与重置处理
    const handleReset = () => {
      setNeutralDistrict('all');
      setNeutralEnterpriseSearch('');
      setNeutralProgressMin('');
      setNeutralProgressMax('');
      setNeutralDateRange('2026-10-01 ~ 2026-11-11');
      setNeutralPage(1);
    };

    // 模拟数据同步
    const handleSyncData = () => {
      setIsSyncingData(true);
      setTimeout(() => {
        setIsSyncingData(false);
        setSyncToastMessage('已成功同步国家碳排放注册登记簿与安徽省林业碳汇核销最新台账 (2026-11-11)');
        setTimeout(() => setSyncToastMessage(null), 3500);
      }, 1200);
    };

    // 模拟导出
    const handleExport = () => {
      setSyncToastMessage(`已生成《2026年度安徽省企业碳中和与林业碳汇核销台账_${new Date().toISOString().slice(0, 10)}.xlsx》并已准备下载`);
      setTimeout(() => setSyncToastMessage(null), 3500);
    };

    // 页码跳转
    const handleJumpPage = () => {
      const p = parseInt(neutralJumpPage, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        setNeutralPage(p);
        setNeutralJumpPage('');
      }
    };

    return (
      <div className="space-y-4 animate-in fade-in duration-300 w-full">
        {/* 系统提示 Toast */}
        {syncToastMessage && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500/80 rounded-xl text-xs text-emerald-200 shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncToastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSyncToastMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ===================== 板块一: 筛选搜索 (对应截图顶部筛选模块) ===================== */}
        <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-2xl relative">
          {/* 板块标头 (绿条 + 筛选搜索) */}
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#18284c]/60">
            <span className="w-1 h-3.5 bg-[#00c88c] rounded-xs inline-block" />
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">筛选搜索</h3>
          </div>

          {/* 表单输入网格 (按截图字段: 所属行政区划、企业名称、中和进度、日期) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. 所属行政区划 */}
            <div className="flex items-center gap-2">
              <label className="text-slate-300 whitespace-nowrap min-w-[85px] font-medium flex items-center gap-0.5">
                <span className="text-red-400">*</span> 所属行政区划
              </label>
              <div className="relative flex-1">
                <select
                  aria-label="所属行政区划"
                  value={neutralDistrict}
                  onChange={(e) => {
                    setNeutralDistrict(e.target.value);
                    setNeutralPage(1);
                  }}
                  className="w-full bg-[#060c1d] border border-[#18284c] rounded-md px-3 py-1.5 text-slate-200 text-xs outline-hidden focus:border-[#00c88c] transition-colors cursor-pointer appearance-none pr-8"
                >
                  <option value="all">请选择</option>
                  <option value="合肥市">合肥市</option>
                  <option value="芜湖市">芜湖市</option>
                  <option value="马鞍山市">马鞍山市</option>
                  <option value="铜陵市">铜陵市</option>
                  <option value="淮南市">淮南市</option>
                  <option value="淮北市">淮北市</option>
                  <option value="滁州市">滁州市</option>
                  <option value="安庆市">安庆市</option>
                  <option value="黄山市">黄山市</option>
                  <option value="阜阳市">阜阳市</option>
                  <option value="宿州市">宿州市</option>
                  <option value="六安市">六安市</option>
                  <option value="亳州市">亳州市</option>
                  <option value="池州市">池州市</option>
                  <option value="宣城市">宣城市</option>
                  <option value="蚌埠市">蚌埠市</option>
                </select>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* 2. 企业名称 */}
            <div className="flex items-center gap-2">
              <label className="text-slate-300 whitespace-nowrap min-w-[60px] font-medium">
                企业名称
              </label>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="请选择或输入企业名称"
                  value={neutralEnterpriseSearch}
                  onChange={(e) => {
                    setNeutralEnterpriseSearch(e.target.value);
                    setNeutralPage(1);
                  }}
                  className="w-full bg-[#060c1d] border border-[#18284c] rounded-md px-3 py-1.5 text-slate-200 text-xs outline-hidden focus:border-[#00c88c] placeholder:text-slate-500 transition-colors"
                />
                {neutralEnterpriseSearch && (
                  <button
                    type="button"
                    onClick={() => setNeutralEnterpriseSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* 3. 中和进度 */}
            <div className="flex items-center gap-2">
              <label className="text-slate-300 whitespace-nowrap min-w-[60px] font-medium">
                中和进度
              </label>
              <div className="flex items-center gap-1.5 flex-1">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={neutralProgressMin}
                    onChange={(e) => {
                      setNeutralProgressMin(e.target.value);
                      setNeutralPage(1);
                    }}
                    className="w-full bg-[#060c1d] border border-[#18284c] rounded-md px-2.5 py-1.5 text-slate-200 text-xs font-mono outline-hidden focus:border-[#00c88c] placeholder:text-slate-600 transition-colors"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">%</span>
                </div>
                <span className="text-slate-400 font-mono">~</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="100"
                    value={neutralProgressMax}
                    onChange={(e) => {
                      setNeutralProgressMax(e.target.value);
                      setNeutralPage(1);
                    }}
                    className="w-full bg-[#060c1d] border border-[#18284c] rounded-md px-2.5 py-1.5 text-slate-200 text-xs font-mono outline-hidden focus:border-[#00c88c] placeholder:text-slate-600 transition-colors"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">%</span>
                </div>
              </div>
            </div>

            {/* 4. 日期范围与搜索/重置按钮 */}
            <div className="flex items-center gap-2">
              <label className="text-slate-300 whitespace-nowrap min-w-[36px] font-medium">
                日期
              </label>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="请选择日期范围"
                  value={neutralDateRange}
                  onChange={(e) => setNeutralDateRange(e.target.value)}
                  className="w-full bg-[#060c1d] border border-[#18284c] rounded-md pl-3 pr-8 py-1.5 text-slate-200 text-xs font-mono outline-hidden focus:border-[#00c88c] placeholder:text-slate-500 transition-colors"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 搜索按钮 (绿色) */}
              <button
                type="button"
                onClick={() => setNeutralPage(1)}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-md text-xs transition-all shadow-md cursor-pointer hover:scale-102 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>搜索</span>
              </button>

              {/* 重置按钮 (灰色) */}
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] text-slate-200 rounded-md text-xs transition-all border border-slate-700 cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* 表单下方操作按钮: [数据同步] [导出] (严格匹配截图样式) */}
          <div className="flex items-center gap-3 pt-4 mt-4 border-t border-[#18284c]/40">
            <button
              type="button"
              onClick={handleSyncData}
              disabled={isSyncingData}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00c88c] hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold rounded-md text-xs transition-all shadow-md cursor-pointer hover:scale-102"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingData ? 'animate-spin' : ''}`} />
              <span>{isSyncingData ? '正在同步数据...' : '数据同步'}</span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-md text-xs transition-all shadow-md cursor-pointer hover:scale-102"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>

            <span className="text-[11px] font-mono text-slate-400 ml-auto">
              * 数据更新基准：2026-11-11 23:59 (近期实测最新)
            </span>
          </div>
        </div>

        {/* ===================== 板块二: 数据列表 (对应截图核心表格模块) ===================== */}
        <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-2xl relative flex flex-col justify-between">
          {/* 板块标头 (绿条 + 数据列表) */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#18284c]/60">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#00c88c] rounded-xs inline-block" />
              <h3 className="text-sm font-bold text-slate-100 tracking-wide">数据列表</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>全省林业碳汇累计中和率:</span>
              <span className="text-[#00e699] font-bold">78.4%</span>
            </div>
          </div>

          {/* 核心数据表格 (统一暗色科技背景，替换假数据为真实安徽重点企业与近期时间) */}
          <div className="overflow-x-auto text-[11px] py-1">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-[#0c1833] text-slate-300 font-semibold border-b border-[#18284c] text-[11px]">
                  <th className="py-2.5 px-3 text-center w-12">序号</th>
                  <th className="py-2.5 px-3 w-28">日期</th>
                  <th className="py-2.5 px-3 min-w-[200px]">企业名称</th>
                  <th className="py-2.5 px-3 text-right w-32">碳排放量 (万吨)</th>
                  <th className="py-2.5 px-3 text-right w-28">中和量 (万吨)</th>
                  <th className="py-2.5 px-3 text-center w-28">中和进度</th>
                  <th className="py-2.5 px-3 text-right w-28">投资额 (万元)</th>
                  <th className="py-2.5 px-3 text-center w-28">开始时间</th>
                  <th className="py-2.5 px-3 text-center w-28">结束时间</th>
                  <th className="py-2.5 px-3 text-center w-16">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18284c]/60 font-mono">
                {paginatedItems.map((row) => {
                  const isHighProgress = row.progress >= 85;
                  const isMediumProgress = row.progress >= 70 && row.progress < 85;
                  return (
                    <tr
                      key={`${row.id}-${row.displayId}`}
                      className="hover:bg-[#0c1d38] transition-colors group"
                    >
                      {/* 序号 */}
                      <td className="py-3 px-3 text-center text-slate-400 font-mono font-medium">
                        {row.displayId}
                      </td>

                      {/* 日期 (近期同步时间) */}
                      <td className="py-3 px-3 text-slate-300 font-mono">
                        {row.date}
                      </td>

                      {/* 企业名称 (真实企业名称) */}
                      <td className="py-3 px-3 font-sans font-medium text-white group-hover:text-emerald-300 transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span>{row.enterpriseName}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1 py-0.2 rounded font-sans scale-90">
                            {row.district}
                          </span>
                        </div>
                      </td>

                      {/* 碳排放量 (万吨) */}
                      <td className="py-3 px-3 text-right text-slate-200 font-bold font-mono">
                        {row.carbonEmission.toLocaleString()}
                      </td>

                      {/* 中和量 (万吨) */}
                      <td className="py-3 px-3 text-right text-[#00e699] font-bold font-mono">
                        {row.neutralizedAmount.toLocaleString()}
                      </td>

                      {/* 中和进度 (带徽章与进度感) */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              isHighProgress
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                                : isMediumProgress
                                ? 'bg-sky-950 text-sky-300 border border-sky-700/60'
                                : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                            }`}
                          >
                            {row.progress}%
                          </span>
                        </div>
                      </td>

                      {/* 投资额 (万元) */}
                      <td className="py-3 px-3 text-right text-white font-mono font-semibold">
                        {row.investment.toLocaleString()}
                      </td>

                      {/* 开始时间 */}
                      <td className="py-3 px-3 text-center text-slate-400 font-mono text-[10px]">
                        {row.startTime}
                      </td>

                      {/* 结束时间 */}
                      <td className="py-3 px-3 text-center text-slate-400 font-mono text-[10px]">
                        {row.endTime}
                      </td>

                      {/* 操作 (查看 - 点击跳转至管控详情页面) */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentDetailEnterprise(row);
                            setActiveTab('enterprise_detail');
                          }}
                          className="text-[#00e699] hover:text-emerald-300 font-semibold cursor-pointer transition-colors underline decoration-emerald-500/50 hover:decoration-emerald-300"
                        >
                          查看
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ===================== 表格底部综合分页控件 (严格匹配截图布局) ===================== */}
          <div className="mt-4 pt-3 border-t border-[#18284c] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-sans">
            {/* 左侧条数统计与单页容量切换 */}
            <div className="flex items-center gap-2">
              <span>共 <strong className="text-emerald-400 font-mono font-bold">{totalItems.toLocaleString()}</strong> 条数据</span>
              <span className="flex items-center gap-1 text-slate-400">
                每页
                <select
                  aria-label="每页显示条数"
                  value={neutralPageSize}
                  onChange={(e) => {
                    setNeutralPageSize(Number(e.target.value));
                    setNeutralPage(1);
                  }}
                  className="bg-[#060c1d] border border-[#18284c] rounded px-1.5 py-0.5 text-slate-200 font-mono text-xs outline-hidden cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                条
              </span>
            </div>

            {/* 右侧数字分页与跳转按钮组 */}
            <div className="flex items-center gap-1.5">
              {/* 上一页 */}
              <button
                type="button"
                onClick={() => setNeutralPage((p) => Math.max(1, p - 1))}
                disabled={neutralPage === 1}
                className="w-7 h-7 rounded border border-[#18284c] bg-[#060c1d] hover:bg-[#0c1833] disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                title="上一页"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* 页码按钮组: 1, 2, 3, 4, 5 ... 20 */}
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNeutralPage(num)}
                  className={`w-7 h-7 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                    neutralPage === num
                      ? 'bg-[#00c88c] text-slate-950 font-bold shadow-xs'
                      : 'border border-[#18284c] bg-[#060c1d] text-slate-300 hover:bg-[#0c1833] hover:border-emerald-600'
                  }`}
                >
                  {num}
                </button>
              ))}

              <span className="px-1 text-slate-500 font-mono">...</span>

              {/* 尾页 20 */}
              <button
                type="button"
                onClick={() => setNeutralPage(20)}
                className={`w-7 h-7 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                  neutralPage === 20
                    ? 'bg-[#00c88c] text-slate-950 font-bold shadow-xs'
                    : 'border border-[#18284c] bg-[#060c1d] text-slate-300 hover:bg-[#0c1833] hover:border-emerald-600'
                }`}
              >
                20
              </button>

              {/* 下一页 */}
              <button
                type="button"
                onClick={() => setNeutralPage((p) => Math.min(totalPages, p + 1))}
                disabled={neutralPage === totalPages}
                className="w-7 h-7 rounded border border-[#18284c] bg-[#060c1d] hover:bg-[#0c1833] disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                title="下一页"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* 跳转输入 */}
              <div className="flex items-center gap-1.5 ml-2">
                <span>跳转</span>
                <input
                  type="text"
                  value={neutralJumpPage}
                  onChange={(e) => setNeutralJumpPage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJumpPage()}
                  placeholder={String(neutralPage)}
                  className="w-10 h-7 bg-[#060c1d] border border-[#18284c] rounded text-center text-slate-200 font-mono text-xs outline-hidden focus:border-[#00c88c]"
                />
                <span>页</span>
                <button
                  type="button"
                  onClick={handleJumpPage}
                  className="px-2 h-7 bg-[#060c1d] hover:bg-[#0c1833] border border-[#18284c] text-slate-300 rounded text-xs transition-colors cursor-pointer"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== 查看详情弹窗 (企业中和与林业碳汇核销明细卡) ===================== */}
        {selectedRecordDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-[#091126] border border-[#00c88c] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4">
              {/* 弹窗标头 */}
              <div className="flex items-center justify-between border-b border-[#18284c] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-4 bg-[#00c88c] rounded-xs inline-block" />
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {selectedRecordDetail.enterpriseName} · 碳中和履约详情
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRecordDetail(null)}
                  className="w-7 h-7 rounded-lg bg-[#060c1d] border border-[#18284c] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 四格核心统计卡 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-3">
                  <div className="text-[10px] text-slate-400">核定碳排放总量</div>
                  <div className="text-xl font-bold font-mono text-white mt-1">
                    {selectedRecordDetail.carbonEmission.toLocaleString()}{' '}
                    <span className="text-[10px] text-slate-400 font-sans">万吨</span>
                  </div>
                </div>
                <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-3">
                  <div className="text-[10px] text-slate-400">已核销中和量</div>
                  <div className="text-xl font-bold font-mono text-[#00e699] mt-1">
                    {selectedRecordDetail.neutralizedAmount.toLocaleString()}{' '}
                    <span className="text-[10px] text-slate-400 font-sans">万吨</span>
                  </div>
                </div>
                <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-3">
                  <div className="text-[10px] text-slate-400">综合中和达成进度</div>
                  <div className="text-xl font-bold font-mono text-[#38bdf8] mt-1">
                    {selectedRecordDetail.progress}%
                  </div>
                </div>
                <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-3">
                  <div className="text-[10px] text-slate-400">绿色中和投资总额</div>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                    {selectedRecordDetail.investment.toLocaleString()}{' '}
                    <span className="text-[10px] text-slate-400 font-sans">万元</span>
                  </div>
                </div>
              </div>

              {/* 细化详情列表 */}
              <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-4 space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400">所属行政区划：</span>
                    <span className="text-white font-medium">{selectedRecordDetail.district}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">行业分类：</span>
                    <span className="text-white font-medium">{selectedRecordDetail.industry}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">核算统计时间：</span>
                    <span className="text-slate-200 font-mono">{selectedRecordDetail.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">履约考核周期：</span>
                    <span className="text-slate-200 font-mono">
                      {selectedRecordDetail.startTime} ~ {selectedRecordDetail.endTime}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#18284c]/60">
                  <div className="text-slate-400 mb-1">林业碳汇核销项目机制：</div>
                  <div className="text-emerald-300 font-medium">
                    {selectedRecordDetail.projectType}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-slate-400">第三方核查机构：</span>
                    <span className="text-slate-200 font-medium">{selectedRecordDetail.verifier}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">折合林地固碳面积：</span>
                    <span className="text-[#00e699] font-mono font-bold">
                      {selectedRecordDetail.forestOffsetHectares.toLocaleString()} 亩
                    </span>
                  </div>
                </div>
              </div>

              {/* 弹窗底部操作 */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                  <BadgeCheck className="w-4 h-4" />
                  <span>已通过安徽省林业碳汇资产管理中心认证备案</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRecordDetail(null)}
                  className="px-5 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ================= 碳达峰管控详情页面渲染 (严格根据截图 image_53b128dc.png 生成) =================
  const renderEnterpriseDetailView = () => {
    const ent = currentDetailEnterprise || NEUTRAL_ENTERPRISE_DATA[0];

    return (
      <div className="space-y-4 animate-in fade-in duration-300 w-full max-w-5xl mx-auto">
        {/* 顶部工具栏: 返回按键 + 企业快速切换器 */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#091126] border border-[#18284c] rounded-xl px-5 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('neutral_analysis')}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#060c1d] hover:bg-[#0c1833] border border-[#18284c] hover:border-[#00c88c] text-slate-300 hover:text-emerald-300 rounded-lg text-xs transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>返回企业台账列表</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              type="button"
              onClick={() => setActiveTab('peak_control')}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              返回碳达峰管控
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>{ent.shortName} 详情档案</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* 企业切换选择器 (方便直接查看各地市企业指标) */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">切换企业:</span>
              <select
                aria-label="切换查看企业"
                value={ent.id}
                onChange={(e) => {
                  const found = NEUTRAL_ENTERPRISE_DATA.find((x) => x.id === Number(e.target.value));
                  if (found) setCurrentDetailEnterprise(found);
                }}
                className="bg-[#060c1d] border border-[#18284c] text-xs text-slate-200 rounded px-2.5 py-1 outline-hidden cursor-pointer max-w-[220px] truncate"
              >
                {NEUTRAL_ENTERPRISE_DATA.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.district} · {item.shortName}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
              2026-11 最新动态核算在网
            </span>
          </div>
        </div>

        {/* ======================= 卡片一: 基本信息 (完全对标截图上半部分) ======================= */}
        <div className="bg-[#091126] border border-[#18284c] rounded-xl p-6 shadow-2xl relative">
          {/* 标头: 绿条 + 基本信息 */}
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#18284c]/60">
            <span className="w-1 h-3.5 bg-[#00c88c] rounded-xs inline-block" />
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">基本信息</h3>
          </div>

          {/* 内容项: 纯净标签与对齐排版 */}
          <div className="space-y-4 text-xs font-sans">
            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium min-w-[110px]">所属行政区划:</span>
              <span className="text-slate-100 font-semibold">{ent.districtDetail || `${ent.district} 包河区`}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium min-w-[110px]">企业名称:</span>
              <span className="text-[#00e699] font-bold text-sm tracking-wide cursor-pointer hover:underline">
                {ent.enterpriseName}
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.2 rounded font-sans ml-2">
                重点双碳监管示范企业
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium min-w-[110px]">企业负责人:</span>
              <span className="text-slate-100 font-medium">{ent.contactPerson || '陈健仁'}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium min-w-[110px]">负责人联系电话:</span>
              <span className="text-slate-200 font-mono tracking-wider">{ent.contactPhone || '138****4444'}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium min-w-[110px]">详细地址:</span>
              <span className="text-slate-200">{ent.detailedAddress || `${ent.district}包河区方兴大道888号国家智能制造与低碳产业示范基地`}</span>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[#18284c]/40">
              <span className="text-slate-400 font-medium">企业简介:</span>
              <div className="text-slate-300 leading-relaxed text-xs bg-[#060c1d] border border-[#18284c] rounded-lg p-4 font-normal text-justify">
                {ent.enterpriseIntro || `${ent.enterpriseName}系安徽省重点骨干示范企业。企业坚定落实碳达峰、碳中和重大战略决策，持续开展工艺节能降碳升级与工业微电网改造，大力发展厂区分布式清洁能源。在林业碳汇领域，企业与皖南山区和大别山重点生态屏障区建立深度林业碳汇协同消纳机制，依托林木固碳与林票挂牌机制完成多期足额交割，建构了产学研核一体化绿色低碳发展新格局。`}
              </div>
            </div>
          </div>
        </div>

        {/* ======================= 卡片二: 指标信息 (完全对标截图下半部分) ======================= */}
        <div className="bg-[#091126] border border-[#18284c] rounded-xl p-6 shadow-2xl relative">
          {/* 标头: 绿条 + 指标信息 */}
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#18284c]/60">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#00c88c] rounded-xs inline-block" />
              <h3 className="text-sm font-bold text-slate-100 tracking-wide">指标信息</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded">
              数据审核状态: 已核验入库
            </span>
          </div>

          {/* 内容项: 纯净行排版与清晰数值 */}
          <div className="space-y-4 text-xs font-sans">
            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium min-w-[120px]">碳排放总量:</span>
              <span className="text-lg font-bold font-mono text-white">
                {ent.carbonEmission} <span className="text-xs font-sans font-normal text-slate-400">万吨</span>
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium min-w-[120px]">中和总量:</span>
              <span className="text-lg font-bold font-mono text-[#00e699]">
                {ent.neutralizedAmount} <span className="text-xs font-sans font-normal text-slate-400">万吨</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-mono ml-2">
                (林业碳汇抵消消纳)
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium min-w-[120px]">中和完成率:</span>
              <span className="text-lg font-bold font-mono text-[#38bdf8]">
                {ent.progress}%
              </span>
              <div className="w-36 h-2 bg-[#060c1d] border border-[#18284c] rounded-full overflow-hidden ml-2 inline-block align-middle">
                <div
                  className="h-full bg-gradient-to-r from-[#00c88c] to-[#38bdf8] rounded-full"
                  style={{ width: `${Math.min(ent.progress, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium min-w-[120px]">项目总投资金额:</span>
              <span className="text-lg font-bold font-mono text-amber-400">
                {ent.investment} <span className="text-xs font-sans font-normal text-slate-400">万元</span>
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-medium min-w-[120px]">项目周期:</span>
              <span className="text-slate-200 font-mono text-xs font-semibold">
                {ent.startTime} 至 {ent.endTime}
              </span>
              <span className="text-[10px] text-slate-400 font-sans ml-1">
                (已同步至2026年近期最新核算周期)
              </span>
            </div>
          </div>
        </div>

        {/* ======================= 卡片三: 权威核验支撑与凭证信息 ======================= */}
        <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <BadgeCheck className="w-4 h-4 text-[#00e699]" />
              <span>第三方权威核证报告编号：AH-MRV-2026-1088</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.2 rounded font-sans">
                {ent.verifier}
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              配套林业碳汇核销项目：<span className="text-emerald-300">{ent.projectType}</span>（折合林地面积约 {ent.forestOffsetHectares.toLocaleString()} 亩）
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert(`已生成 ${ent.enterpriseName} 2026年度企业碳达峰管控与林业碳汇核销电子凭证书 (PDF)`)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#060c1d] hover:bg-[#0c1833] border border-[#18284c] hover:border-[#00c88c] text-slate-200 hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#00e699]" />
              <span>下载凭证报告</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('neutral_analysis')}
              className="px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              返回企业台账列表
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#040e09] text-slate-100 flex flex-col font-sans select-none animate-in fade-in">
      {/* 顶部主横幅导航 (对应截图: 林业碳汇项目产业服务系统 + 双碳看板 / 碳达峰管控 / 碳中和分析 + 返回按钮) */}
      <header className="relative z-20 h-16 px-6 lg:px-8 bg-gradient-to-r from-[#031d13] via-[#05261a] to-[#041910] border-b border-emerald-800/60 shadow-lg flex items-center justify-between">
        {/* 左侧系统标题 */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-wide text-white drop-shadow-md">
            碳汇项目产业服务系统
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400/80 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
            双碳宏观监测底座
          </span>
        </div>

        {/* 中间子系统切换 Tab (按截图样式: 双碳看板 / 碳达峰管控 / 碳中和分析 / 管控详情) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-emerald-800 shadow-md scale-105'
                : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>双碳看板</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('peak_control')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'peak_control'
                ? 'bg-white text-emerald-800 shadow-md scale-105'
                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-slate-300 border border-emerald-900/50'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>碳达峰管控</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('neutral_analysis')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'neutral_analysis' || activeTab === 'enterprise_detail'
                ? 'bg-white text-emerald-800 shadow-md scale-105 font-bold'
                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-slate-300 border border-emerald-900/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>碳中和分析</span>
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

      {/* 主体内容区域 (统一暗色科技背景，杜绝原型纯白色) */}
      <main className="flex-1 p-4 lg:p-6 flex flex-col space-y-4 max-w-[1720px] w-full mx-auto">
        {activeTab === 'enterprise_detail' && renderEnterpriseDetailView()}
        {activeTab === 'peak_control' && renderPeakControlView()}
        {activeTab === 'neutral_analysis' && renderNeutralAnalysisView()}
        {activeTab === 'dashboard' && (
          <>
            {/* 看板排版与重排控制工具条 (order-0) */}
            <div className="order-0 flex flex-wrap items-center justify-between gap-2 pb-1 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-200 font-semibold tracking-wide text-xs">安徽省双碳宏观监测指挥中心</span>
            <span className="text-[10px] text-emerald-400/80 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
              2026 最新动态核算
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#060c1d] border border-[#18284c] p-1 rounded-lg text-[11px]">
            <span className="text-slate-400 px-1 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-emerald-400" />
              <span>版块排序:</span>
            </span>
            <button
              type="button"
              onClick={() => setDashboardLayout('timeline_first')}
              className={`px-2.5 py-0.5 rounded transition-all cursor-pointer font-medium ${
                dashboardLayout === 'timeline_first'
                  ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="全年时序宏观大图置顶 -> 地域与行业深度下钻"
            >
              时序优先 (新排序)
            </button>
            <button
              type="button"
              onClick={() => setDashboardLayout('classic')}
              className={`px-2.5 py-0.5 rounded transition-all cursor-pointer font-medium ${
                dashboardLayout === 'classic'
                  ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="经典两栏并排 -> 全年时序置底"
            >
              经典并排排版
            </button>
          </div>
        </div>

        {/* ===================== 1. 顶部五大核心 KPI 指标卡 (order-1) ===================== */}
        <div className="order-1 grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* 卡片 1: 绿色 1259 万吨 (重点企业排碳) */}
          <div className="bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl flex items-center justify-between hover:border-emerald-500/40 transition-colors">
            <div>
              <div className="text-[11px] text-slate-400 mb-1">重点企业排放</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-extrabold font-mono text-[#00c88c] tracking-tight">
                  1259
                </span>
                <span className="text-xs text-slate-300 font-medium">万吨</span>
              </div>
            </div>
            <div className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
              同比 -4.2%
            </div>
          </div>

          {/* 卡片 2: 蓝色 1483 万吨 (重点行业排放) */}
          <div className="bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl flex items-center justify-between hover:border-blue-500/40 transition-colors">
            <div>
              <div className="text-[11px] text-slate-400 mb-1">重点行业排放</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-extrabold font-mono text-[#3b82f6] tracking-tight">
                  1483
                </span>
                <span className="text-xs text-slate-300 font-medium">万吨</span>
              </div>
            </div>
            <div className="text-[10px] text-blue-400 bg-blue-950/70 border border-blue-800/60 px-2 py-0.5 rounded">
              环比 -2.8%
            </div>
          </div>

          {/* 卡片 3: 橙色 1326 万吨 (重点领域综合) */}
          <div className="bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl flex items-center justify-between hover:border-amber-500/40 transition-colors">
            <div>
              <div className="text-[11px] text-slate-400 mb-1">重点领域综合</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-extrabold font-mono text-[#f59e0b] tracking-tight">
                  1326
                </span>
                <span className="text-xs text-slate-300 font-medium">万吨</span>
              </div>
            </div>
            <div className="text-[10px] text-amber-400 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded">
              达峰率 82.5%
            </div>
          </div>

          {/* 卡片 4: 紫色 1579 万吨 (林业碳汇吸收) */}
          <div className="bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl flex items-center justify-between hover:border-purple-500/40 transition-colors">
            <div>
              <div className="text-[11px] text-slate-400 mb-1">林业碳汇吸收</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-extrabold font-mono text-[#a855f7] tracking-tight">
                  1579
                </span>
                <span className="text-xs text-slate-300 font-medium">万吨</span>
              </div>
            </div>
            <div className="text-[10px] text-purple-400 bg-purple-950/70 border border-purple-800/60 px-2 py-0.5 rounded">
              增汇 +12.6%
            </div>
          </div>

          {/* 卡片 5: 红色 6530 万吨 (全省管控排放总量) */}
          <div className="bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl flex items-center justify-between hover:border-rose-500/40 transition-colors col-span-2 md:col-span-1">
            <div>
              <div className="text-[11px] text-slate-400 mb-1">全省管控总量</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-extrabold font-mono text-[#f43f5e] tracking-tight">
                  6530
                </span>
                <span className="text-xs text-slate-300 font-medium">万吨</span>
              </div>
            </div>
            <div className="text-[10px] text-rose-400 bg-rose-950/70 border border-rose-800/60 px-2 py-0.5 rounded">
              合规率 99.4%
            </div>
          </div>
        </div>

        {/* ===================== 中间两栏: 各地碳达峰情况 + 碳达峰重点行业指标统计 ===================== */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 transition-all duration-300 ${dashboardLayout === 'timeline_first' ? 'order-3' : 'order-2'}`}>
          {/* 左栏: 各地碳达峰情况 (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl flex flex-col justify-between relative">
            {/* 标头 & 图表样式切换 & 数据更新时间 */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-[#18284c] pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-[#00c88c] rounded-xs inline-block" />
                  <h3 className="text-xs font-bold text-slate-100 tracking-wide">各地碳达峰情况</h3>
                </div>

                {/* 图表样式切换开关 (平滑曲线图 / 横向对比条 / 双柱图) */}
                <div className="flex items-center gap-1 bg-[#060c1d] border border-[#18284c] p-0.5 rounded-lg text-[10px]">
                  <button
                    type="button"
                    onClick={() => setCityChartStyle('area')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                      cityChartStyle === 'area'
                        ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="平滑双曲线面积图"
                  >
                    <LineChart className="w-3 h-3" />
                    <span>平滑曲线</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCityChartStyle('horizontal')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                      cityChartStyle === 'horizontal'
                        ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="横向对比条形图"
                  >
                    <AlignLeft className="w-3 h-3" />
                    <span>横向对比</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCityChartStyle('bar')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                      cityChartStyle === 'bar'
                        ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="双柱图"
                  >
                    <BarChart3 className="w-3 h-3" />
                    <span>双柱图</span>
                  </button>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                数据更新: 2026-10-27 (近期)
              </span>
            </div>

            {/* 图例与单位 */}
            <div className="flex items-center justify-between mb-2 text-[11px] text-slate-300">
              <span className="font-mono text-slate-400">单位: 万吨</span>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-2.5 rounded-xs bg-[#00c88c]" />
                  <span>预测达峰</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-2.5 rounded-xs bg-[#38bdf8]" />
                  <span>实际排放</span>
                </div>
              </div>
            </div>

            {/* 图表展示主体区域 */}
            <div className="relative flex-1 min-h-[220px] flex flex-col justify-end">
              {cityChartStyle === 'area' && (() => {
                // SVG 平滑面积曲线图坐标参数
                const svgW = 680;
                const svgH = 210;
                const padL = 48;
                const padR = 24;
                const padT = 16;
                const padB = 32;
                const plotW = svgW - padL - padR;
                const plotH = svgH - padT - padB;
                const maxVal = 7500;
                const bottomY = padT + plotH;

                const coords = CITY_PEAK_DATA.map((c, i) => {
                  const x = padL + (i * plotW) / (CITY_PEAK_DATA.length - 1);
                  const predY = padT + ((maxVal - c.predicted) / maxVal) * plotH;
                  const actY = padT + ((maxVal - c.actual) / maxVal) * plotH;
                  return { ...c, x, predY, actY, i };
                });

                const predPts = coords.map((c) => ({ x: c.x, y: c.predY }));
                const actPts = coords.map((c) => ({ x: c.x, y: c.actY }));
                const predPath = createSmoothPath(predPts);
                const actPath = createSmoothPath(actPts);
                const predAreaPath = createSmoothAreaPath(predPts, bottomY);
                const actAreaPath = createSmoothAreaPath(actPts, bottomY);

                const activeCoord = coords.find((c) => c.city === hoveredCity?.city);

                return (
                  <div className="w-full h-full flex flex-col justify-center">
                    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-[210px] overflow-visible">
                      <defs>
                        {/* 预测达峰渐变 */}
                        <linearGradient id="cityPredGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00c88c" stopOpacity="0.40" />
                          <stop offset="60%" stopColor="#00c88c" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#00c88c" stopOpacity="0.01" />
                        </linearGradient>
                        {/* 实际排放渐变 */}
                        <linearGradient id="cityActGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                          <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.01" />
                        </linearGradient>
                        {/* 节点外发光 Filter */}
                        <filter id="glowNode" x="-30%" y="-30%" width="160%" height="160%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Y轴网格线及刻度标签 */}
                      {[7500, 6000, 4500, 3000, 1500, 0].map((v) => {
                        const y = padT + ((maxVal - v) / maxVal) * plotH;
                        return (
                          <g key={v} className="pointer-events-none">
                            <text
                              x={padL - 10}
                              y={y + 3.5}
                              textAnchor="end"
                              className="text-[10px] fill-slate-500 font-mono"
                            >
                              {v}
                            </text>
                            <line
                              x1={padL}
                              y1={y}
                              x2={padL + plotW}
                              y2={y}
                              stroke="#18284c"
                              strokeDasharray={v === 0 ? undefined : '3 3'}
                              strokeWidth={v === 0 ? '1.2' : '0.8'}
                              opacity={v === 0 ? '0.8' : '0.5'}
                            />
                          </g>
                        );
                      })}

                      {/* 渐变面积 */}
                      <path d={predAreaPath} fill="url(#cityPredGrad)" />
                      <path d={actAreaPath} fill="url(#cityActGrad)" />

                      {/* 预测达峰平滑曲线 */}
                      <path
                        d={predPath}
                        fill="none"
                        stroke="#00c88c"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glowNode)"
                      />

                      {/* 实际排放平滑曲线 */}
                      <path
                        d={actPath}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glowNode)"
                      />

                      {/* 悬停竖向指引扫描线 */}
                      {activeCoord && (
                        <line
                          x1={activeCoord.x}
                          y1={padT}
                          x2={activeCoord.x}
                          y2={bottomY}
                          stroke="#38bdf8"
                          strokeWidth="1.2"
                          strokeDasharray="4 3"
                          opacity="0.8"
                        />
                      )}

                      {/* 各城市节点圆点 & X轴标签 */}
                      {coords.map((c) => {
                        const isHovered = hoveredCity?.city === c.city;
                        return (
                          <g key={c.city} className="cursor-pointer">
                            {/* 预测点 */}
                            <circle
                              cx={c.x}
                              cy={c.predY}
                              r={isHovered ? 5.5 : 3.5}
                              fill="#00c88c"
                              stroke="#040e09"
                              strokeWidth="1.5"
                              className="transition-all duration-200"
                            />
                            {/* 实际点 */}
                            <circle
                              cx={c.x}
                              cy={c.actY}
                              r={isHovered ? 5.5 : 3.5}
                              fill="#38bdf8"
                              stroke="#040e09"
                              strokeWidth="1.5"
                              className="transition-all duration-200"
                            />

                            {/* 悬停时呼吸环 */}
                            {isHovered && (
                              <>
                                <circle
                                  cx={c.x}
                                  cy={c.predY}
                                  r="9"
                                  fill="none"
                                  stroke="#00e699"
                                  strokeWidth="1.5"
                                  opacity="0.6"
                                  className="animate-ping"
                                />
                                <circle
                                  cx={c.x}
                                  cy={c.actY}
                                  r="9"
                                  fill="none"
                                  stroke="#38bdf8"
                                  strokeWidth="1.5"
                                  opacity="0.6"
                                  className="animate-ping"
                                />
                              </>
                            )}

                            {/* X 轴城市名称 */}
                            <text
                              x={c.x}
                              y={bottomY + 18}
                              textAnchor="middle"
                              className={`text-[10px] font-sans transition-colors ${
                                isHovered ? 'fill-[#38bdf8] font-bold' : 'fill-slate-400'
                              }`}
                            >
                              {c.city}
                            </text>

                            {/* 透明热区触发层 */}
                            <rect
                              x={c.x - plotW / (coords.length * 2)}
                              y={padT}
                              width={plotW / coords.length}
                              height={plotH + 25}
                              fill="transparent"
                              onMouseEnter={() => setHoveredCity(c)}
                              onMouseLeave={() => setHoveredCity(null)}
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                );
              })()}

              {cityChartStyle === 'horizontal' && (
                <div className="py-1 px-2 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {CITY_PEAK_DATA.map((c) => {
                    const isHovered = hoveredCity?.city === c.city;
                    const percent = ((c.actual / c.predicted) * 100).toFixed(1);
                    const isOver = c.actual > c.predicted;
                    const actRatio = Math.min(100, (c.actual / 7500) * 100);
                    const predRatio = Math.min(100, (c.predicted / 7500) * 100);

                    return (
                      <div
                        key={c.city}
                        onMouseEnter={() => setHoveredCity(c)}
                        onMouseLeave={() => setHoveredCity(null)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isHovered
                            ? 'bg-[#0f1d3d] border-[#00c88c]/60 shadow-md'
                            : 'bg-[#060c1d]/60 border-[#18284c]/50 hover:border-[#18284c]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${isHovered ? 'text-[#38bdf8]' : 'text-slate-200'}`}>
                              {c.city}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                                isOver
                                  ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                              }`}
                            >
                              {isOver ? `超排 ${(c.actual - c.predicted)}万吨` : `达标率 ${percent}%`}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-[10px]">
                            <span className="text-[#00c88c]">预测: {c.predicted}</span>
                            <span className="text-[#38bdf8]">实际: {c.actual}</span>
                          </div>
                        </div>

                        {/* 双向对比进度条 */}
                        <div className="relative h-2 bg-slate-900 rounded-full overflow-hidden">
                          {/* 预测基准浅色背景条 */}
                          <div
                            className="absolute top-0 bottom-0 left-0 bg-[#00c88c]/35 rounded-full"
                            style={{ width: `${predRatio}%` }}
                          />
                          {/* 实际排放主要条 */}
                          <div
                            className={`absolute top-0 bottom-0 left-0 rounded-full transition-all duration-300 ${
                              isOver ? 'bg-gradient-to-r from-[#38bdf8] to-rose-500' : 'bg-[#38bdf8]'
                            }`}
                            style={{ width: `${actRatio}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {cityChartStyle === 'bar' && (
                <div className="relative flex-1 min-h-[200px] flex flex-col justify-end pt-4 pb-1">
                  {/* 背景网格线刻度: 7500, 6000, 4500, 3000, 1500, 0 */}
                  <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-500 font-mono pr-2">
                    {[7500, 6000, 4500, 3000, 1500, 0].map((val) => (
                      <div key={val} className="flex items-center w-full">
                        <span className="w-8 text-right pr-2">{val}</span>
                        <div className="flex-1 border-b border-[#18284c]/60" />
                      </div>
                    ))}
                  </div>

                  {/* 9 个地市双柱图 (预测绿柱 + 实际蓝柱) */}
                  <div className="relative z-10 flex items-end justify-between pl-10 pr-3 h-[180px]">
                    {CITY_PEAK_DATA.map((c) => {
                      const isHovered = hoveredCity?.city === c.city;
                      const predHeight = (c.predicted / 7500) * 165;
                      const actHeight = (c.actual / 7500) * 165;

                      return (
                        <div
                          key={c.city}
                          className="flex-1 flex flex-col items-center group cursor-pointer transition-transform"
                          onMouseEnter={() => setHoveredCity(c)}
                          onMouseLeave={() => setHoveredCity(null)}
                        >
                          <div className="flex items-end gap-1.5 h-[165px]">
                            {/* 预测柱 */}
                            <div
                              className={`w-2.5 sm:w-3.5 rounded-t-xs transition-all duration-300 ${
                                isHovered
                                  ? 'bg-[#00e699] shadow-lg shadow-emerald-500/50 scale-y-105'
                                  : 'bg-[#00c88c]'
                              }`}
                              style={{ height: `${predHeight}px` }}
                              title={`${c.city} 达峰预测: ${c.predicted} 万吨`}
                            />
                            {/* 实际柱 */}
                            <div
                              className={`w-2.5 sm:w-3.5 rounded-t-xs transition-all duration-300 ${
                                isHovered
                                  ? 'bg-[#60a5fa] shadow-lg shadow-blue-500/50 scale-y-105'
                                  : 'bg-[#3b82f6]'
                              }`}
                              style={{ height: `${actHeight}px` }}
                              title={`${c.city} 实际排放: ${c.actual} 万吨`}
                            />
                          </div>

                          <span
                            className={`text-[10px] mt-2 whitespace-nowrap transition-colors ${
                              isHovered ? 'text-[#38bdf8] font-bold' : 'text-slate-400'
                            }`}
                          >
                            {c.city}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 悬浮数据浮窗 */}
              {hoveredCity && (
                <div className="absolute top-2 right-4 bg-[#0a142e]/95 border border-[#00c88c] backdrop-blur-md rounded-lg p-3 shadow-2xl text-[11px] text-slate-200 z-20 pointer-events-none animate-in fade-in">
                  <div className="font-bold text-white mb-1.5 border-b border-[#18284c] pb-1 flex justify-between gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00e699] inline-block" />
                      {hoveredCity.city}
                    </span>
                    <span className="text-[#38bdf8]">
                      达成率 {((hoveredCity.actual / hoveredCity.predicted) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="flex justify-between gap-4">
                      <span className="text-[#00c88c]">达峰预测值:</span>
                      <span className="font-bold">{hoveredCity.predicted} 万吨</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[#38bdf8]">当前实际排放:</span>
                      <span className="font-bold">{hoveredCity.actual} 万吨</span>
                    </div>
                    <div className="flex justify-between gap-4 text-emerald-400 border-t border-[#18284c]/60 pt-1">
                      <span>达峰缓冲额度:</span>
                      <span className="font-bold">
                        {hoveredCity.predicted - hoveredCity.actual > 0
                          ? `剩余 ${hoveredCity.predicted - hoveredCity.actual} 万吨`
                          : `已超排 ${hoveredCity.actual - hoveredCity.predicted} 万吨`}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右栏: 碳达峰重点行业指标统计 (万吨) (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl flex flex-col justify-between">
            {/* 标头 & 图表样式切换 */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-[#18284c] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#00c88c] rounded-xs inline-block" />
                <h3 className="text-xs font-bold text-slate-100 tracking-wide">
                  碳达峰重点行业指标统计 (万吨)
                </h3>
              </div>

              {/* 样式切换控件 */}
              <div className="flex items-center gap-1 bg-[#060c1d] border border-[#18284c] p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setSectorChartStyle('speedometer')}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    sectorChartStyle === 'speedometer'
                      ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="半圆科技仪表盘"
                >
                  <Gauge className="w-3 h-3" />
                  <span>仪表盘</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSectorChartStyle('capsule')}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    sectorChartStyle === 'capsule'
                      ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="流光胶囊进度条"
                >
                  <AlignLeft className="w-3 h-3" />
                  <span>胶囊卡片</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSectorChartStyle('donut')}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    sectorChartStyle === 'donut'
                      ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="圆环饼图"
                >
                  <Activity className="w-3 h-3" />
                  <span>圆环图</span>
                </button>
              </div>
            </div>

            {/* 1. 半圆科技仪表盘 (默认新样式: 替换原饼图为半圆流光速度计仪表盘) */}
            {sectorChartStyle === 'speedometer' && (
              <div className="grid grid-cols-3 gap-2.5 my-auto py-1">
                {SECTOR_GAUGES.map((sec) => {
                  const percentage = Math.min(Math.round((sec.value / sec.max) * 100), 100);
                  const p = percentage / 100;
                  const arcLength = 106.8;
                  const strokeDashoffset = arcLength * (1 - p);
                  const angle = Math.PI * (1 - p);
                  const ptrX = (50 + 34 * Math.cos(angle)).toFixed(1);
                  const ptrY = (45 - 34 * Math.sin(angle)).toFixed(1);

                  return (
                    <div
                      key={sec.id}
                      className="flex flex-col items-center text-center p-2 rounded-xl bg-[#0a142e]/60 border border-[#18284c]/60 hover:border-emerald-500/50 hover:bg-[#0c1836] transition-all cursor-pointer group shadow-md"
                    >
                      {/* 行业名称与图标 */}
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300 mb-1 group-hover:text-white transition-colors">
                        {sec.id === 'transport' && <Car className="w-3 h-3 text-[#00c88c]" />}
                        {sec.id === 'building' && <Building2 className="w-3 h-3 text-[#10b981]" />}
                        {sec.id === 'finance' && <Building2 className="w-3 h-3 text-[#84cc16]" />}
                        {sec.id === 'mining' && <Flame className="w-3 h-3 text-[#818cf8]" />}
                        {sec.id === 'catering' && <UtensilsCrossed className="w-3 h-3 text-[#f97316]" />}
                        {sec.id === 'energy' && <Zap className="w-3 h-3 text-[#06b6d4]" />}
                        <span>{sec.name}</span>
                      </div>

                      {/* SVG 半圆仪表盘 */}
                      <div className="relative w-22 h-[58px] flex items-center justify-center">
                        <svg viewBox="0 0 100 56" className="w-full h-full overflow-visible">
                          <defs>
                            <linearGradient id={`spdGrad_${sec.id}`} x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor={sec.color} stopOpacity="0.4" />
                              <stop offset="100%" stopColor={sec.color} stopOpacity="1" />
                            </linearGradient>
                            <filter id={`spdGlow_${sec.id}`} x="-30%" y="-30%" width="160%" height="160%">
                              <feGaussianBlur stdDeviation="2" result="blur" />
                              <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                          </defs>

                          {/* 底盘轨道弧线 */}
                          <path
                            d="M 16 45 A 34 34 0 0 1 84 45"
                            fill="none"
                            stroke={sec.trackColor}
                            strokeWidth="7"
                            strokeLinecap="round"
                          />

                          {/* 活跃动态进度弧 */}
                          <path
                            d="M 16 45 A 34 34 0 0 1 84 45"
                            fill="none"
                            stroke={`url(#spdGrad_${sec.id})`}
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray={arcLength}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-700 ease-out"
                          />

                          {/* 指示光标圆点 */}
                          <circle
                            cx={ptrX}
                            cy={ptrY}
                            r="3.5"
                            fill="#ffffff"
                            stroke={sec.color}
                            strokeWidth="2"
                            filter={`url(#spdGlow_${sec.id})`}
                            className="transition-all duration-700 ease-out"
                          />
                        </svg>

                        {/* 仪表中心数据与单位 */}
                        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center">
                          <span className="text-sm font-extrabold font-mono text-white tracking-tight leading-none">
                            {sec.value}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                            万吨
                          </span>
                        </div>
                      </div>

                      {/* 底部指标负荷与同比 */}
                      <div className="flex items-center justify-between w-full px-1 text-[9px] text-slate-400 border-t border-[#18284c]/50 pt-1 mt-1">
                        <span className="font-mono text-slate-400">负荷 {percentage}%</span>
                        <span className={`font-mono ${sec.trend === 'down' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {sec.changeRate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. 流光胶囊进度条卡片 */}
            {sectorChartStyle === 'capsule' && (
              <div className="grid grid-cols-2 gap-2.5 my-auto py-1">
                {SECTOR_GAUGES.map((sec) => {
                  const percentage = Math.min(Math.round((sec.value / sec.max) * 100), 100);
                  return (
                    <div
                      key={sec.id}
                      className="p-2 rounded-xl bg-[#0a142e]/60 border border-[#18284c]/60 hover:border-emerald-500/40 hover:bg-[#0c1836] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded flex items-center justify-center bg-slate-900 border border-[#18284c]">
                            {sec.id === 'transport' && <Car className="w-3 h-3 text-[#00c88c]" />}
                            {sec.id === 'building' && <Building2 className="w-3 h-3 text-[#10b981]" />}
                            {sec.id === 'finance' && <Building2 className="w-3 h-3 text-[#84cc16]" />}
                            {sec.id === 'mining' && <Flame className="w-3 h-3 text-[#818cf8]" />}
                            {sec.id === 'catering' && <UtensilsCrossed className="w-3 h-3 text-[#f97316]" />}
                            {sec.id === 'energy' && <Zap className="w-3 h-3 text-[#06b6d4]" />}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-200 group-hover:text-white">
                            {sec.name}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1 font-mono">
                          <span className="text-xs font-bold text-white">{sec.value}</span>
                          <span className="text-[9px] text-slate-400">/ {sec.max}万吨</span>
                        </div>
                      </div>

                      {/* 胶囊进度条 */}
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-[#18284c]">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%`, backgroundColor: sec.color }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-1 text-[9px] text-slate-400 font-mono">
                        <span>负荷: {percentage}%</span>
                        <span className={sec.trend === 'down' ? 'text-emerald-400' : 'text-amber-400'}>
                          同比 {sec.changeRate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. 原圆环图 (保留切换能力) */}
            {sectorChartStyle === 'donut' && (
              <div className="grid grid-cols-3 gap-3 my-auto py-2">
                {SECTOR_GAUGES.map((sec) => {
                  return (
                    <div
                      key={sec.id}
                      className="flex flex-col items-center text-center p-2 rounded-xl bg-[#0a142e]/60 border border-[#18284c]/60 hover:border-emerald-500/40 transition-all cursor-pointer group"
                    >
                      <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="38" fill="transparent" stroke={sec.trackColor} strokeWidth="8" />
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke={sec.color}
                            strokeWidth="8"
                            strokeDasharray="238.7"
                            strokeDashoffset={238.7 * (1 - (sec.value / sec.max) * 0.75)}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[10px] text-slate-300 font-normal">{sec.name}</span>
                          <span className="text-sm font-bold font-mono text-white mt-0.5">{sec.value}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===================== 全幅卡片: 全年碳排放情况 (分组多柱图 / 堆叠柱图 / 多层曲线) ===================== */}
        <div className={`bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl flex flex-col justify-between relative transition-all duration-300 ${dashboardLayout === 'timeline_first' ? 'order-2' : 'order-3'}`}>
          {/* 标头 & 图表样式切换 & 数据更新时间 */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-[#18284c] pb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#00c88c] rounded-xs inline-block" />
                <h3 className="text-xs font-bold text-slate-100 tracking-wide">全年碳排放情况</h3>
              </div>

              {/* 图表样式切换开关 (分组柱图 / 堆叠柱图 / 曲线图) */}
              <div className="flex items-center gap-1 bg-[#060c1d] border border-[#18284c] p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setEmissionChartStyle('grouped_bar')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                    emissionChartStyle === 'grouped_bar'
                      ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="月度三组分分组柱状图"
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>分组柱图</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEmissionChartStyle('stacked_bar')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                    emissionChartStyle === 'stacked_bar'
                      ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="月度三组分堆叠柱图"
                >
                  <Layers className="w-3 h-3" />
                  <span>堆叠柱图</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEmissionChartStyle('area')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                    emissionChartStyle === 'area'
                      ? 'bg-[#00c88c]/25 text-[#00e699] border border-[#00c88c]/40 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="多层平滑折线面积图"
                >
                  <LineChart className="w-3 h-3" />
                  <span>曲线图</span>
                </button>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              数据更新: 2026-10-27 (近期)
            </span>
          </div>

          {/* 图例与单位 */}
          <div className="flex items-center justify-between mb-2 text-[11px] text-slate-300">
            <span className="font-mono text-slate-400">单位: 万吨</span>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-2 rounded-xs bg-[#00c88c]" />
                <span className="text-slate-200">重点企业</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-2 rounded-xs bg-[#3b82f6]" />
                <span className="text-slate-200">重点行业</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-2 rounded-xs bg-[#38bdf8]" />
                <span className="text-slate-200">重点领域</span>
              </div>
            </div>
          </div>

          {/* 图表展示主体区域 */}
          <div className="relative w-full min-h-[225px] flex flex-col justify-end pt-2">
            {/* 1. 分组柱状图 (默认新样式: 每月三柱并排对比) */}
            {emissionChartStyle === 'grouped_bar' && (
              <div className="relative w-full h-[200px] flex flex-col justify-end">
                {/* 背景水平网格刻度 (7500, 6000, 4500, 3000, 1500, 0) */}
                <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-500 font-mono pr-2 pb-6">
                  {[7500, 6000, 4500, 3000, 1500, 0].map((val) => (
                    <div key={val} className="flex items-center w-full">
                      <span className="w-8 text-right pr-2">{val}</span>
                      <div className="flex-1 border-b border-[#18284c]/60" />
                    </div>
                  ))}
                </div>

                {/* 12 个月份三组分分组柱状图 */}
                <div className="relative z-10 flex items-end justify-between pl-10 pr-2 h-[165px] pb-6">
                  {MONTHLY_EMISSIONS.map((m) => {
                    const isHovered = hoveredMonth?.month === m.month;
                    const maxScale = 7500;
                    const hasData = !m.isPending && (m.enterprise > 0 || m.industry > 0 || m.sector > 0);
                    const entHeight = (m.enterprise / maxScale) * 140;
                    const indHeight = (m.industry / maxScale) * 140;
                    const secHeight = (m.sector / maxScale) * 140;

                    return (
                      <div
                        key={m.month}
                        className={`flex-1 flex flex-col items-center group cursor-pointer transition-all duration-200 mx-0.5 rounded-lg py-1 ${
                          isHovered ? 'bg-[#0f1d3d]/60 shadow-lg shadow-blue-900/30' : ''
                        }`}
                        onMouseEnter={() => setHoveredMonth(m)}
                        onMouseLeave={() => setHoveredMonth(null)}
                      >
                        {/* 柱状图展示：有数据时显示三柱，未到期为0时无柱状图 */}
                        <div className="flex items-end justify-center h-[140px] w-full">
                          {hasData ? (
                            <div className="flex items-end gap-1 h-[140px]">
                              {/* 重点企业柱 */}
                              <div
                                className={`w-1.5 sm:w-2 lg:w-2.5 rounded-t-xs transition-all duration-300 ${
                                  isHovered
                                    ? 'bg-[#00e699] shadow-lg shadow-emerald-500/60 scale-y-105'
                                    : 'bg-[#00c88c]'
                                }`}
                                style={{ height: `${entHeight}px` }}
                                title={`${m.month} 重点企业: ${m.enterprise} 万吨`}
                              />
                              {/* 重点行业柱 */}
                              <div
                                className={`w-1.5 sm:w-2 lg:w-2.5 rounded-t-xs transition-all duration-300 ${
                                  isHovered
                                    ? 'bg-[#60a5fa] shadow-lg shadow-blue-500/60 scale-y-105'
                                    : 'bg-[#3b82f6]'
                                }`}
                                style={{ height: `${indHeight}px` }}
                                title={`${m.month} 重点行业: ${m.industry} 万吨`}
                              />
                              {/* 重点领域柱 */}
                              <div
                                className={`w-1.5 sm:w-2 lg:w-2.5 rounded-t-xs transition-all duration-300 ${
                                  isHovered
                                    ? 'bg-[#7dd3fc] shadow-lg shadow-cyan-500/60 scale-y-105'
                                    : 'bg-[#38bdf8]'
                                }`}
                                style={{ height: `${secHeight}px` }}
                                title={`${m.month} 重点领域: ${m.sector} 万吨`}
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-end h-full pb-1">
                              <span className="text-[10px] text-slate-600 font-mono tracking-tighter">--</span>
                            </div>
                          )}
                        </div>

                        {/* 月份刻度 (26-01 ~ 26-12) */}
                        <span
                          className={`text-[9px] sm:text-[10px] mt-2 font-mono whitespace-nowrap transition-colors ${
                            isHovered
                              ? 'text-[#38bdf8] font-bold'
                              : m.isPending
                              ? 'text-slate-500'
                              : 'text-slate-400'
                          }`}
                        >
                          {m.month.slice(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. 堆叠柱状图 (三项总量堆叠柱图) */}
            {emissionChartStyle === 'stacked_bar' && (
              <div className="relative w-full h-[200px] flex flex-col justify-end">
                {/* 背景水平网格刻度 (基于三项总和最大约 18000 万吨) */}
                <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-500 font-mono pr-2 pb-6">
                  {[18000, 14000, 10000, 6000, 2000, 0].map((val) => (
                    <div key={val} className="flex items-center w-full">
                      <span className="w-10 text-right pr-2">{val}</span>
                      <div className="flex-1 border-b border-[#18284c]/60" />
                    </div>
                  ))}
                </div>

                {/* 12 个月份堆叠柱 */}
                <div className="relative z-10 flex items-end justify-between pl-12 pr-2 h-[165px] pb-6">
                  {MONTHLY_EMISSIONS.map((m) => {
                    const isHovered = hoveredMonth?.month === m.month;
                    const hasData = !m.isPending && (m.enterprise > 0 || m.industry > 0 || m.sector > 0);
                    const maxStack = 18000;
                    const entHeight = (m.enterprise / maxStack) * 140;
                    const indHeight = (m.industry / maxStack) * 140;
                    const secHeight = (m.sector / maxStack) * 140;

                    return (
                      <div
                        key={m.month}
                        className={`flex-1 flex flex-col items-center group cursor-pointer transition-all duration-200 mx-1 rounded-lg py-1 ${
                          isHovered ? 'bg-[#0f1d3d]/60 shadow-lg shadow-blue-900/30' : ''
                        }`}
                        onMouseEnter={() => setHoveredMonth(m)}
                        onMouseLeave={() => setHoveredMonth(null)}
                      >
                        {/* 堆叠柱主体：有数据时显示堆叠柱，未到期为0时无柱状图 */}
                        <div className="h-[140px] flex items-end justify-center w-full">
                          {hasData ? (
                            <div className="w-3.5 sm:w-5 lg:w-6 flex flex-col-reverse rounded-t-xs overflow-hidden h-[140px] justify-start">
                              {/* 底层: 重点企业 */}
                              <div
                                className={`w-full transition-all duration-300 ${
                                  isHovered ? 'bg-[#00e699]' : 'bg-[#00c88c]'
                                }`}
                                style={{ height: `${entHeight}px` }}
                              />
                              {/* 中层: 重点行业 */}
                              <div
                                className={`w-full transition-all duration-300 ${
                                  isHovered ? 'bg-[#60a5fa]' : 'bg-[#3b82f6]'
                                }`}
                                style={{ height: `${indHeight}px` }}
                              />
                              {/* 顶层: 重点领域 */}
                              <div
                                className={`w-full transition-all duration-300 ${
                                  isHovered ? 'bg-[#7dd3fc]' : 'bg-[#38bdf8]'
                                }`}
                                style={{ height: `${secHeight}px` }}
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-end h-full pb-1">
                              <span className="text-[10px] text-slate-600 font-mono tracking-tighter">--</span>
                            </div>
                          )}
                        </div>

                        {/* 月份刻度 */}
                        <span
                          className={`text-[9px] sm:text-[10px] mt-2 font-mono whitespace-nowrap transition-colors ${
                            isHovered
                              ? 'text-[#38bdf8] font-bold'
                              : m.isPending
                              ? 'text-slate-500'
                              : 'text-slate-400'
                          }`}
                        >
                          {m.month.slice(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. 多层折线面积图 */}
            {emissionChartStyle === 'area' && (
              <div className="relative w-full h-[200px] flex flex-col justify-between">
                <svg className="w-full h-[170px] overflow-visible" viewBox="0 0 1100 170" preserveAspectRatio="none">
                  <defs>
                    {/* 重点领域渐变 (顶层 浅天蓝) */}
                    <linearGradient id="gradSectorArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
                    </linearGradient>

                    {/* 重点行业渐变 (中层 宝蓝) */}
                    <linearGradient id="gradIndustryArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                    </linearGradient>

                    {/* 重点企业渐变 (底层 翡翠绿) */}
                    <linearGradient id="gradEnterpriseArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00c88c" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#00c88c" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* 背景水平网格线 (7500, 6000, 4500, 3000, 1500, 0) */}
                  {[7500, 6000, 4500, 3000, 1500, 0].map((val, idx) => {
                    const y = 15 + idx * 27;
                    return (
                      <g key={val}>
                        <text
                          x="40"
                          y={y + 3}
                          textAnchor="end"
                          className="fill-slate-500 text-[9px] font-mono select-none"
                        >
                          {val}
                        </text>
                        <line
                          x1="45"
                          y1={y}
                          x2="1080"
                          y2={y}
                          stroke="#18284c"
                          strokeDasharray={idx === 5 ? 'none' : '3 3'}
                          strokeWidth={idx === 5 ? '1.5' : '1'}
                        />
                      </g>
                    );
                  })}

                  {/* 绘制 3 层堆叠面积折线 (仅绘制已有数据月份 26-01 ~ 26-10，26-11与26-12为待统计) */}
                  {(() => {
                    const maxVal = 7500;
                    const plotHeight = 135;
                    const baseY = 150;
                    const startX = 50;
                    const stepX = (1070 - startX) / (MONTHLY_EMISSIONS.length - 1);

                    // 过滤出有实测数据的月份绘制实线面积
                    const activeMonths = MONTHLY_EMISSIONS.filter((m) => !m.isPending);

                    const ptsSector = activeMonths.map((m, i) => ({
                      x: startX + i * stepX,
                      y: baseY - (m.sector / maxVal) * plotHeight,
                    }));

                    const ptsIndustry = activeMonths.map((m, i) => ({
                      x: startX + i * stepX,
                      y: baseY - (m.industry / maxVal) * plotHeight,
                    }));

                    const ptsEnterprise = activeMonths.map((m, i) => ({
                      x: startX + i * stepX,
                      y: baseY - (m.enterprise / maxVal) * plotHeight,
                    }));

                    const makeAreaPath = (pts: { x: number; y: number }[]) => {
                      if (pts.length === 0) return '';
                      const line = pts.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
                      const first = pts[0];
                      const last = pts[pts.length - 1];
                      return `${line} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
                    };

                    const makeLinePath = (pts: { x: number; y: number }[]) =>
                      pts.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

                    return (
                      <>
                        {/* 1. 重点领域面积与线 (顶层) */}
                        <path d={makeAreaPath(ptsSector)} fill="url(#gradSectorArea)" />
                        <path d={makeLinePath(ptsSector)} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

                        {/* 2. 重点行业面积与线 (中层) */}
                        <path d={makeAreaPath(ptsIndustry)} fill="url(#gradIndustryArea)" />
                        <path d={makeLinePath(ptsIndustry)} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

                        {/* 3. 重点企业面积与线 (底层) */}
                        <path d={makeAreaPath(ptsEnterprise)} fill="url(#gradEnterpriseArea)" />
                        <path d={makeLinePath(ptsEnterprise)} fill="none" stroke="#00c88c" strokeWidth="2.5" />

                        {/* 交互数据节点 (全部12个月份位置) */}
                        {MONTHLY_EMISSIONS.map((m, i) => {
                          const x = startX + i * stepX;
                          const hasData = !m.isPending;

                          return (
                            <g
                              key={m.month}
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredMonth(m)}
                              onMouseLeave={() => setHoveredMonth(null)}
                            >
                              {hoveredMonth?.month === m.month && (
                                <line
                                  x1={x}
                                  y1="15"
                                  x2={x}
                                  y2="150"
                                  stroke="#38bdf8"
                                  strokeWidth="1.5"
                                  strokeDasharray="3 3"
                                />
                              )}
                              {hasData ? (
                                <>
                                  <circle cx={x} cy={ptsSector[i].y} r="3.5" fill="#38bdf8" />
                                  <circle cx={x} cy={ptsIndustry[i].y} r="3.5" fill="#3b82f6" />
                                  <circle cx={x} cy={ptsEnterprise[i].y} r="3.5" fill="#00c88c" />
                                </>
                              ) : (
                                <circle cx={x} cy={baseY} r="2.5" fill="#475569" stroke="#18284c" />
                              )}
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>

                {/* X 轴月份刻度 (近期12个月) */}
                <div className="flex items-center justify-between pl-10 pr-4 text-[10px] text-slate-400 font-mono select-none">
                  {MONTHLY_EMISSIONS.map((m) => (
                    <span
                      key={m.month}
                      className={`transition-colors cursor-pointer ${
                        hoveredMonth?.month === m.month
                          ? 'text-[#00c88c] font-bold'
                          : m.isPending
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                      onMouseEnter={() => setHoveredMonth(m)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    >
                      {m.month.slice(2)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 悬浮数据浮窗 (微光磨砂玻璃卡片) */}
            {hoveredMonth && (
              <div className="absolute top-2 right-4 bg-[#0a142e]/95 border border-[#00c88c] backdrop-blur-md rounded-lg p-3 shadow-2xl text-[11px] text-slate-200 z-20 pointer-events-none animate-in fade-in">
                <div className="font-bold text-white mb-1.5 border-b border-[#18284c] pb-1 flex justify-between gap-6">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${hoveredMonth.isPending ? 'bg-amber-400' : 'bg-[#00e699]'}`} />
                    {hoveredMonth.month} 月碳排放汇总
                  </span>
                  <span className="text-[#38bdf8] font-mono">
                    {hoveredMonth.isPending ? (
                      <span className="text-amber-400 font-sans text-[10px] bg-amber-950/70 border border-amber-800/60 px-1.5 py-0.5 rounded">
                        还未到 · 数据为0 (无柱图)
                      </span>
                    ) : (
                      `总量 ${(hoveredMonth.enterprise + hoveredMonth.industry + hoveredMonth.sector).toLocaleString()} 万吨`
                    )}
                  </span>
                </div>
                <div className="space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#38bdf8]">重点领域综合:</span>
                    <span className="font-bold">{hoveredMonth.sector} 万吨</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#3b82f6]">重点行业排放:</span>
                    <span className="font-bold">{hoveredMonth.industry} 万吨</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#00c88c]">重点企业排放:</span>
                    <span className="font-bold">{hoveredMonth.enterprise} 万吨</span>
                  </div>
                  {hoveredMonth.isPending && (
                    <div className="pt-1 mt-1 border-t border-[#18284c] text-[9px] text-amber-300/80 font-sans">
                      * 该月份尚未到来，暂无实测数据，所有指标显示为0且不绘制柱状图
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
};
