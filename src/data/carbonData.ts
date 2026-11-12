import { CarbonProject, DemoAccount, RealtimeTelemetry, UserRoleInfo } from '../types';

export const USER_ROLES: UserRoleInfo[] = [
  {
    id: 'admin',
    name: '碳汇项目业主',
    nameEn: 'Project Developer',
    tag: '林权/开发方',
    desc: '负责林班地块录入、通量塔传感运维与生物质蓄积量盘查',
  },
  {
    id: 'auditor',
    name: '第三方MRV核查机构',
    nameEn: 'MRV Verification Body',
    tag: '核算/认证方',
    desc: '执行卫星遥感NDVI复核、现场样地实测与减排量核证报告签署',
  },
  {
    id: 'trader',
    name: '控排履约/交易企业',
    nameEn: 'Compliance Entity / Trader',
    tag: '资产/配额买方',
    desc: 'CCER碳配额询价竞买、注销减排凭证与ESG双碳信息披露',
  },
  {
    id: 'regulator',
    name: '生态环境监管部门',
    nameEn: 'Regulatory Authority',
    tag: '主管/监管方',
    desc: '区域双碳考核基准线跟踪、碳交易市场合规监察与防重计核验',
  },
];

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'admin',
    roleName: '超级管理员',
    username: 'admin',
    password: 'admin',
    phone: '13800108866',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    department: '国家碳汇管理智能运营中心',
  },
  {
    role: 'auditor',
    roleName: '高级MRV核查评估专家',
    username: 'auditor.lin@mrv-cert.org',
    password: 'Verify@2026Carbon',
    phone: '13910223344',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    department: '中环联合碳中和认证研究院',
  },
  {
    role: 'trader',
    roleName: '能源集团碳资产交易员',
    username: 'trader.wang@chinapower.com',
    password: 'Trade#Carbon2026',
    phone: '13766889900',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    department: '华能碳资产管理投资事业部',
  },
];

export const INITIAL_TELEMETRY: RealtimeTelemetry = {
  co2FluxPPM: 418.6,
  totalForestBiomass: 1485.4, // 1485.4 万吨
  annualReductionTons: 3824500, // 382.45 万吨 CO2e
  todayIncrementalCO2: 12480, // 今日吸收固碳量 吨
  sensorCount: 1684,
  ndviAverage: 0.842,
};

export const CARBON_PROJECTS: CarbonProject[] = [
  {
    id: 'PRJ-2026-F01',
    name: '塞罕坝百万亩机械林场碳汇示范工程',
    location: '河北承德 · 塞罕坝',
    category: '林业碳汇',
    areaHectares: 74600,
    annualCO2Sequestration: 864000,
    ndvIndex: 0.885,
    status: 'trading',
    updateTime: '10分钟前',
  },
  {
    id: 'PRJ-2026-B02',
    name: '胶州湾海草床与盐沼蓝碳增汇试验区',
    location: '山东青岛 · 胶州湾',
    category: '海洋蓝碳',
    areaHectares: 12400,
    annualCO2Sequestration: 215000,
    ndvIndex: 0.762,
    status: 'active',
    updateTime: '24分钟前',
  },
  {
    id: 'PRJ-2026-W03',
    name: '若尔盖高寒泥炭湿地碳库保护修复项目',
    location: '四川阿坝 · 若尔盖',
    category: '湿地草地',
    areaHectares: 48900,
    annualCO2Sequestration: 540000,
    ndvIndex: 0.814,
    status: 'verifying',
    updateTime: '1小时前',
  },
  {
    id: 'PRJ-2026-F04',
    name: '武夷山国家公园阔叶红松林碳通量观测区',
    location: '福建南平 · 武夷山',
    category: '林业碳汇',
    areaHectares: 35200,
    annualCO2Sequestration: 412000,
    ndvIndex: 0.912,
    status: 'active',
    updateTime: '2小时前',
  },
];

export const METHODOLOGY_STANDARDS = [
  { name: 'CCER-01-001', title: '造林碳汇方法学 (v2.1)' },
  { name: 'ISO 14064-2', title: '项目温室气体减排量核证标准' },
  { name: 'IPCC GPG-LULUCF', title: '国家土地利用碳汇清单指南' },
  { name: 'VCS VM0007', title: '湿地与红树林修复碳计量导则' },
];
