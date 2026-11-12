export interface PortalModule {
  id: string;
  name: string;
  nameEn: string;
  tagline: string;
  iconName: string;
  category: string;
  keyMetric: {
    label: string;
    value: string;
    unit?: string;
  };
  features: string[];
  systemStatus: 'normal' | 'active' | 'syncing';
}

export const PORTAL_MODULES: PortalModule[] = [
  {
    id: 'one_map',
    name: '碳汇一张图',
    nameEn: 'Carbon Sink One Map',
    tagline: '高分遥感与GIS时空一体化一张图',
    iconName: 'Globe',
    category: '空间遥感',
    keyMetric: {
      label: '实时在轨遥感样地',
      value: '74,600',
      unit: '公顷',
    },
    features: ['高光谱植被NDVI反演', '样地地理信息红线', '通量塔热力网格', '生物量遥感反演'],
    systemStatus: 'normal',
  },
  {
    id: 'project_dev',
    name: '碳汇项目开发管理',
    nameEn: 'Project Development & Lifecycle',
    tagline: '全生命周期立项、样地实测与备案管理',
    iconName: 'Code',
    category: '资产管理',
    keyMetric: {
      label: '全流程在管项目',
      value: '18',
      unit: '个',
    },
    features: ['项目立项与可行性研判', '额外性与基准线论证', '样地外业调查表录入', 'MRV监测实施计划'],
    systemStatus: 'normal',
  },
  {
    id: 'value_calc',
    name: '碳汇价值核算',
    nameEn: 'Carbon Value Accounting',
    tagline: '遵循CCER与IPCC导则的精密量化核算模型',
    iconName: 'Calculator',
    category: '智能核算',
    keyMetric: {
      label: '已核算固碳总量',
      value: '1,485.4',
      unit: '万吨',
    },
    features: ['生物量蓄积膨胀转换法', '地下生物质与土壤碳库', '自然干扰扣减模型', '经济现值敏感性分析'],
    systemStatus: 'normal',
  },
  {
    id: 'trading',
    name: '碳汇产品交易',
    nameEn: 'Carbon Product Trading',
    tagline: '国家自愿减排量(CCER)与碳票资产流通撮合',
    iconName: 'Trees',
    category: '市场交易',
    keyMetric: {
      label: '今日挂牌均价',
      value: '78.50',
      unit: '元/吨',
    },
    features: ['CCER电子配额竞价大厅', '大宗点对点协议转让', '注销履约减排凭证', '区块链不可篡改存证'],
    systemStatus: 'active',
  },
  {
    id: 'finance',
    name: '碳汇金融服务',
    nameEn: 'Green Carbon Finance',
    tagline: '碳汇质押增信、绿色碳保与ESG信贷对接',
    iconName: 'Coins',
    category: '绿色金融',
    keyMetric: {
      label: '累计授信支持',
      value: '1.85',
      unit: '亿元',
    },
    features: ['碳汇预期收益权质押贷款', '生态碳汇指数气象保险', '绿色可持续发展债券', '商业银行授信评级'],
    systemStatus: 'normal',
  },
  {
    id: 'assessment',
    name: '碳汇评估',
    nameEn: 'Assessment & Certification',
    tagline: '具备资质的独立第三方MRV核证合规审计',
    iconName: 'FileCheck',
    category: '权威核证',
    keyMetric: {
      label: '已签发核证报告',
      value: '42',
      unit: '份',
    },
    features: ['第三方核查报告签署', '现场抽样样地实地复测', '防重计电子指纹核对', '减排量争议仲裁备案'],
    systemStatus: 'normal',
  },
  {
    id: 'industry',
    name: '碳汇产业服务',
    nameEn: 'Industrial Ecosystem',
    tagline: '生态经济融合、零碳共建与产业协同',
    iconName: 'Handshake',
    category: '产业协同',
    keyMetric: {
      label: '生态联盟生态企业',
      value: '126',
      unit: '家',
    },
    features: ['生态种植增汇赋能', '企业碳中和声明服务', '零碳示范与乡村振兴', '区域碳普惠积分互联'],
    systemStatus: 'normal',
  },
  {
    id: 'settings',
    name: '碳汇系统设置',
    nameEn: 'System Administration',
    tagline: '多租户权限控制、国密算法配置与运维审计',
    iconName: 'Settings',
    category: '安全运维',
    keyMetric: {
      label: '安全等级保护',
      value: '等保三级',
    },
    features: ['RBAC分级权限管理', '国密SM2/SM3算法参数', '卫星遥感数据源配置', '全链路操作审计日志'],
    systemStatus: 'normal',
  },
];
