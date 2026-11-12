/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  FileText,
  Landmark,
  ShieldCheck,
  TrendingUp,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  BookOpen,
  Newspaper,
  CheckCircle2,
  Calendar,
  X,
  Building2,
  Coins,
  Shield,
  Download,
  Share2,
  Sparkles,
  Filter,
  RotateCcw,
  Plus,
  Upload,
  Edit3,
  Trash2,
  Eye,
  BarChart3,
  CheckSquare,
  AlertCircle,
  FileSpreadsheet,
  Check,
  FileUp,
  FileCheck,
  RefreshCw,
  CircleDot,
  Circle,
  MapPin,
  Sprout,
  TreePine,
  Award,
} from 'lucide-react';
import { RevenueStatsView } from './RevenueStatsView';


export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  fullContent?: string;
  coverUrl: string;
  day: string;
  yearMonth: string;
  fullDate: string;
  category: 'news' | 'policy';
  author: string;
  views: number;
}

export interface LoanProduct {
  id: string;
  bankName: string; // 所属金融机构
  productName: string; // 贷款产品
  productType: string; // 产品类型: 质押贷, 信用贷, 抵押贷
  interestRate: number; // 贷款利率(%)
  loanTermYears: number; // 贷款期限(年)
  maxLoanAmount: number; // 最大贷款金额(元)
  disbursedAmount: number; // 已放款金额(元)
  repaymentMethod: string; // 还款方式: 等额本金, 等额本息, 先息后本, 按期还本付息, 一次性还本付息
  publishDate: string; // 发布日期 (2026年10月份近期降序)
  description?: string;
}

export interface LoanServiceApplication {
  id: string;
  region: string; // 所属行政区划
  companyName: string; // 申贷企业
  creditCode?: string; // 统一社会信用代码
  legalPerson?: string; // 法定代表人
  legalPersonId?: string; // 法人证件号
  idCard?: string; // 身份证号码
  productName: string; // 贷款产品
  bankName: string; // 承办金融机构
  interestRate?: number; // 授信利率
  applyAmount: number; // 申贷金额(元)
  loanTermYears: number; // 贷款年限
  status: '待审核' | '审核中' | '审批通过' | '待放款' | '已放款' | '已结清' | '已驳回'; // 申贷状态
  applyDate: string; // 申贷时间 (2026年10月份近期降序)
  disbursedAmount: number; // 已放款金额(元)
  repaymentMethod: string; // 还款方式
  contactPerson?: string; // 联系人
  contactPhone?: string; // 联系电话
  pledgeCarbonVolume?: number; // 质押固碳量(吨)
  attachmentName?: string; // 附件材料
  description?: string;
}

export interface InsuranceProduct {
  id: string;
  companyName: string; // 所属保险公司
  productName: string; // 保险名称
  insuranceType: '碳汇保险' | '林木保险' | '政策性保险'; // 保险类型
  premiumRate: number; // 保费金额 (元/亩·年)
  minInsuredArea: number; // 最低投保面积 (亩)
  launchDate: string; // 上线日期 (近期的降序 2026-10-18)
  description?: string;
}

export interface InsuranceServiceRecord {
  id: string;
  region: string; // 所属行政区划 (e.g. "合肥市 肥西县")
  companyName: string; // 投保企业/申贷企业
  creditCode?: string; // 统一社会信用代码
  legalPerson?: string; // 法定代表人
  legalIdCard?: string; // 法人证件号
  productName: string; // 保险名称
  premiumAmount: number; // 保险金额 (元/亩·年)
  insuredArea: number; // 投保面积 (亩)
  insuranceType: '林木保险' | '碳汇保险' | '政策性保险'; // 保险类型
  status: '申请中' | '生效中' | '已过期'; // 投保状态
  applyDate: string; // 投保时间 (近期降序 2026-10-18)
  applicantPhone?: string; // 申请人手机号码
  attachmentName?: string; // 附件材料文件名
  selectedProductId?: string; // 选中的保险产品卡片ID
}

// 增收管理: 闲荒地登记实体 (依据最新截图 100% 还原)
export interface IdleLandRecord {
  id: string;
  region: string; // 所属行政区划
  parcelName: string; // 地块名称
  areaMu: number; // 地块面积(亩)
  registrantName: string; // 登记方名称
  landCondition: string; // 土地情况 (土地肥沃, 水源充足, 道路畅通, 环境良好等)
  leaseTermYears: number; // 出借期限(年)
  expectedPrice: number; // 意向价格(元/亩)
  utilizationStatus: '荒废中' | '闲置中' | '租借中' | '盘活中'; // 利用状态
  registerDate: string; // 登记日期 (2026年10月份近期降序)
  contactPerson?: string; // 联系人
  contactPhone?: string; // 联系电话 (登记方联系电话)
  location?: string; // 土地坐落
  remarks?: string; // 备注说明
}

// 增收管理: 盘活利用项目实体
export interface RevitalizeProject {
  id: string;
  projectCode: string; // 项目编号
  landName: string; // 闲荒地块名称
  region: string; // 所属区县
  areaMu: number; // 盘活面积(亩)
  contractor: string; // 签约投资/开发主体
  afforestationType: string; // 碳汇造林树种
  expectedCarbonSink: number; // 预计年增汇量(吨CO₂e)
  collectiveIncome: number; // 预计村集体年收益(万元)
  status: '协议签订中' | '碳汇造林中' | '已实现分红' | '挂牌流转中'; // 状态
  signDate: string; // 签约日期
}

// 增收管理: 盘活利用租赁数据实体 (对应截图 image_a7e45871.png)
export interface RevitalizeLeaseRecord {
  id: string;
  region: string; // 所属行政区划
  landName: string; // 地块名称
  areaMu: number; // 地块面积(亩)
  registrantName: string; // 登记方名称
  lesseeName: string; // 租借方名称
  leaseTermYears: number; // 租借期限(年)
  leasePrice: number; // 租借价格(元/亩)
  dealDate: string; // 交易日期
  socialIncome: number; // 社会增收(元)
  remarks?: string; // 土地情况 / 备注说明
  lesseePhone?: string;
  leaseUsage?: string;
}

const INITIAL_INSURANCE_SERVICES: InsuranceServiceRecord[] = [
  {
    id: 'srv-1',
    region: '合肥市 肥西县',
    companyName: '安徽林业生态开发集团有限公司',
    productName: '森林碳汇火灾与气象灾害指数保险',
    premiumAmount: 15.00,
    insuredArea: 20,
    insuranceType: '林木保险',
    status: '申请中',
    applyDate: '2026-10-18',
  },
  {
    id: 'srv-2',
    region: '合肥市 肥西县',
    companyName: '肥西县丰乐林场生态农业合作社',
    productName: '林业碳汇质押贷款履约保证保险',
    premiumAmount: 20.00,
    insuredArea: 55,
    insuranceType: '林木保险',
    status: '申请中',
    applyDate: '2026-10-17',
  },
  {
    id: 'srv-3',
    region: '合肥市 庐阳区',
    companyName: '合肥绿碳环境科技建设有限公司',
    productName: '湿地与碳汇森林巨灾保险',
    premiumAmount: 20.00,
    insuredArea: 15,
    insuranceType: '碳汇保险',
    status: '申请中',
    applyDate: '2026-10-16',
  },
  {
    id: 'srv-4',
    region: '合肥市 庐阳区',
    companyName: '合肥市苗木花卉交易中心有限公司',
    productName: '竹林生态碳汇与气象指数保险',
    premiumAmount: 20.00,
    insuredArea: 15,
    insuranceType: '林木保险',
    status: '申请中',
    applyDate: '2026-10-15',
  },
  {
    id: 'srv-5',
    region: '合肥市 肥东县',
    companyName: '肥东县森林碳汇经营管理有限公司',
    productName: '政策性碳汇林业综合保障险',
    premiumAmount: 10.00,
    insuredArea: 5,
    insuranceType: '政策性保险',
    status: '生效中',
    applyDate: '2026-10-12',
  },
  {
    id: 'srv-6',
    region: '合肥市 肥东县',
    companyName: '肥东县浮槎山造林育林农场',
    productName: '森林碳汇火灾与气象灾害指数保险',
    premiumAmount: 15.00,
    insuredArea: 10,
    insuranceType: '林木保险',
    status: '生效中',
    applyDate: '2026-10-10',
  },
  {
    id: 'srv-7',
    region: '合肥市 高新区',
    companyName: '安徽高新绿能碳封存科技有限公司',
    productName: '林业碳汇质押贷款履约保证保险',
    premiumAmount: 25.00,
    insuredArea: 10,
    insuranceType: '林木保险',
    status: '生效中',
    applyDate: '2026-10-08',
  },
  {
    id: 'srv-8',
    region: '合肥市 高新区',
    companyName: '安徽黄山竹海碳汇开发有限公司',
    productName: '竹林生态碳汇与气象指数保险',
    premiumAmount: 30.00,
    insuredArea: 15,
    insuranceType: '林木保险',
    status: '生效中',
    applyDate: '2026-10-05',
  },
  {
    id: 'srv-9',
    region: '合肥市 高新区',
    companyName: '宣城绿洲生态资源开发有限公司',
    productName: '政策性生态森林综合保障险',
    premiumAmount: 30.00,
    insuredArea: 20,
    insuranceType: '政策性保险',
    status: '生效中',
    applyDate: '2026-09-28',
  },
  {
    id: 'srv-10',
    region: '合肥市 高新区',
    companyName: '岳西县高山生态造林专业合作社',
    productName: '湿地与碳汇森林巨灾保险',
    premiumAmount: 30.00,
    insuredArea: 4,
    insuranceType: '林木保险',
    status: '已过期',
    applyDate: '2026-09-20',
  },
  {
    id: 'srv-11',
    region: '黄山市 休宁县',
    companyName: '黄山市休宁县松竹碳汇经营公司',
    productName: '竹林生态碳汇与气象指数保险',
    premiumAmount: 22.00,
    insuredArea: 35,
    insuranceType: '碳汇保险',
    status: '已过期',
    applyDate: '2026-09-10',
  },
  {
    id: 'srv-12',
    region: '安庆市 岳西县',
    companyName: '岳西大别山绿碳林业开发有限公司',
    productName: '森林碳汇火灾与气象灾害指数保险',
    premiumAmount: 18.00,
    insuredArea: 50,
    insuranceType: '林木保险',
    status: '生效中',
    applyDate: '2026-09-01',
  },
];

const INITIAL_INSURANCE_PRODUCTS: InsuranceProduct[] = [
  {
    id: 'ip-1',
    companyName: '中国人寿财产保险合肥支公司',
    productName: '绿碳保·CCER林业碳汇遥感指数保险',
    insuranceType: '碳汇保险',
    premiumRate: 5.00,
    minInsuredArea: 50,
    launchDate: '2026-10-18',
    description: '采用高分辨率卫星遥感监测碳汇林固碳量，当气象灾害导致固碳量受损时触发指数理赔。',
  },
  {
    id: 'ip-2',
    companyName: '中国人民财产保险股份有限公司肥西支公司',
    productName: '生态惠农·森林火灾与碳汇损失综合险',
    insuranceType: '林木保险',
    premiumRate: 6.60,
    minInsuredArea: 10,
    launchDate: '2026-10-16',
    description: '保障森林火灾导致的林木立木蓄积量损失及配套碳汇收益损失，财政保费补贴70%。',
  },
  {
    id: 'ip-3',
    companyName: '太平洋财产保险安徽分公司',
    productName: '林木综合灾害与碳汇价值核算保',
    insuranceType: '碳汇保险',
    premiumRate: 10.00,
    minInsuredArea: 20,
    launchDate: '2026-10-15',
    description: '覆盖冰冻、台风、旱灾等极端天气的全灾种保障，引入第三方理赔快赔机制。',
  },
  {
    id: 'ip-4',
    companyName: '中华联合财产保险合肥支公司',
    productName: '政策性造林碳汇收益损失保险',
    insuranceType: '政策性保险',
    premiumRate: 5.50,
    minInsuredArea: 50,
    launchDate: '2026-10-12',
    description: '省级财政定点合作保险产品，重点针对人工幼龄林与造林碳汇预期收益。',
  },
  {
    id: 'ip-5',
    companyName: '国元农业保险合肥中心支公司',
    productName: '森林病虫害碳汇遥感监测综合险',
    insuranceType: '林木保险',
    premiumRate: 9.90,
    minInsuredArea: 50,
    launchDate: '2026-10-10',
    description: '针对松材线虫等重大林业有害生物灾害，提供防治与碳汇赔偿双重兜底。',
  },
  {
    id: 'ip-6',
    companyName: '平安产险合肥中心支公司',
    productName: '碳汇价格指数与遥感理赔保险',
    insuranceType: '碳汇保险',
    premiumRate: 5.00,
    minInsuredArea: 50,
    launchDate: '2026-10-08',
    description: '联动全国碳配额与CCER市场交易价格波动的碳汇收益权保障险。',
  },
  {
    id: 'ip-7',
    companyName: '中国人民财产保险股份有限公司肥西支公司',
    productName: '政策性公益林碳汇综合灾害险',
    insuranceType: '政策性保险',
    premiumRate: 5.00,
    minInsuredArea: 50,
    launchDate: '2026-10-05',
    description: '全区生态公益林全覆盖包干投保险种，实现绿色生态价值长效保障。',
  },
  {
    id: 'ip-8',
    companyName: '中国人寿财产保险合肥支公司',
    productName: '竹林生态碳汇与气象指数保险',
    insuranceType: '碳汇保险',
    premiumRate: 5.00,
    minInsuredArea: 50,
    launchDate: '2026-10-03',
    description: '专为毛竹林与竹林CCER碳汇项目量身打造，依据降水量与风速指数快速履约。',
  },
  {
    id: 'ip-9',
    companyName: '太平洋财产保险安徽分公司',
    productName: '湿地与碳汇森林巨灾保险',
    insuranceType: '碳汇保险',
    premiumRate: 5.00,
    minInsuredArea: 100,
    launchDate: '2026-10-02',
    description: '针对千亩以上大规模集约化林场，提供巨灾再保险与紧急救灾救助赔付款。',
  },
  {
    id: 'ip-10',
    companyName: '国元农业保险合肥中心支公司',
    productName: '碳汇收益权质押融资履约保证险',
    insuranceType: '碳汇保险',
    premiumRate: 5.00,
    minInsuredArea: 50,
    launchDate: '2026-10-01',
    description: '配合银行碳汇质押贷款的信用保证保险，提高企业信贷审批通过率。',
  },
];

const INITIAL_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: '全省首单CCER林业碳汇项目在商洛成功交易',
    excerpt: '新闻网讯：3月4日，首批林业碳汇交易签约仪式在商洛举行，市交投公司与中碳生态科技有限公司正式签约，交易二氧化碳减排量10万吨，总资金400多万元。据了解，林业碳汇是指利用森林的储碳功能，通过造林、森林经营等人为活动，相较于自然状态下额外吸收和固定大气中的二氧化碳，并按照相关规则与碳汇交易相结合的过程机制。林业碳汇开发是指通过市场化手段对新造林地、森林抚育地块产生的额外碳量进行计量、核签、上市，从而实现经济价值的开发方式。国内林业碳汇开发模式为CCER（国家核证自愿减排量，计量单位为吨二氧化碳）。',
    fullContent: '新闻网讯：首批林业碳汇交易签约仪式成功举行，市交投公司与中碳生态科技有限公司正式签约，交易二氧化碳减排量10万吨，总资金400多万元。\n\n据了解，林业碳汇是指利用森林的储碳功能，通过造林、森林经营等人为活动，相较于自然状态下额外吸收和固定大气中的二氧化碳，并按照相关规则与碳汇交易相结合的过程机制。\n\n林业碳汇开发是指通过市场化手段对新造林地、森林抚育地块产生的额外碳量进行计量、核签、上市，从而实现经济价值的开发方式。国内林业碳汇开发模式为CCER（国家核证自愿减排量，计量单位为吨二氧化碳）。\n\n此次成功交易标志着该区域林业生态资源向经济收益转换迈出了关键一步，也为全省后续碳汇项目落地提供了标准化示范。',
    coverUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
    day: '18',
    yearMonth: '2026-10',
    fullDate: '2026-10-18',
    category: 'news',
    author: '国家碳汇金融资讯网',
    views: 3420,
  },
  {
    id: 'news-2',
    title: '林业资源大省开发林碳项目，省主管部门透露这些信息',
    excerpt: '“国家提出碳达峰、碳中和目标后，林业碳汇上升到一个新的热度。作为林业主管部门，我们对此非常重视。”22日，省林业局造林绿化处副处长曾经典对第一财经记者说。她说，省林业部门密切关注全国碳市场的进展，做好相应的项目储备，同时加强林业碳汇基础技术的研究。曾经典同时表示，做林业碳汇不仅仅是林碳项目的开发，更重要的是扩大森林资源的量，也就是扩大国土绿化的规模，增加森林资源的增量。其次是提升森林资源的质量，“目前江西省低产低效林的面还比较大，有3000多万亩”。',
    fullContent: '“国家提出碳达峰、碳中和目标后，林业碳汇上升到一个新的热度。作为林业主管部门，我们对此非常重视。”省林业局造林绿化处负责人在采访中表示。\n\n林业部门密切关注全国碳市场的进展，做好相应的项目储备，同时加强林业碳汇基础技术的研究。做林业碳汇不仅仅是林碳项目的开发，更重要的是扩大森林资源的量，也就是扩大国土绿化的规模，增加森林资源的增量。其次是提升森林资源的质量，通过低效林改造提升森林蓄积量与固碳能力。',
    coverUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    day: '15',
    yearMonth: '2026-10',
    fullDate: '2026-10-15',
    category: 'news',
    author: '第一财经生态专栏',
    views: 2890,
  },
  {
    id: 'news-3',
    title: '1毛钱线上“买碳”，绿水青山能变现',
    excerpt: '“到2025年，非化石能源消费比重达到18.3%，活立木蓄积量达到8亿立方米；到2030年，经济社会发展全面绿色转型走在全国前列，重点耗能行业能源利用效率达到国内先进水平...” 4月初，省发布《关于完整准确全面贯彻新发展理念做好碳达峰碳中和工作的实施意见》，为低碳发展列出清单。这是2017年省被纳入国家生态文明试验区之后，又一次以绿色低碳为目标出发，也成为继江苏、河北、浙江、湖南、四川等省市之后对“双碳”发展做出明确规划的省份。',
    fullContent: '通过线上碳普惠与碳资产交易平台，公众与企业可以便捷地进行碳抵消与碳配额购买，实现“1毛钱买碳”的普惠化体验。\n\n随着国家生态文明建设的深化，非化石能源消费比重逐步提升，活立木蓄积量持续攀升。各级政府出台碳达峰碳中和实施意见，把绿水青山转化为金山银山，为乡村振兴与林农增收注入新动能。',
    coverUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    day: '12',
    yearMonth: '2026-10',
    fullDate: '2026-10-12',
    category: 'news',
    author: '绿色低碳发展报',
    views: 1950,
  },
  {
    id: 'news-4',
    title: '绿色金融赋能林业碳汇，首单林业碳汇预期收益权质押贷款顺利发放',
    excerpt: '为拓宽林业生态产品价值实现路径，某商业银行成功发放首笔林业碳汇预期收益权质押贷款。该笔贷款以林业碳汇项目未来产生的碳减排收益权作为质押物，有效破解了林企融资难题，创新了林业生态资源资产化、资本化路径，为生态文明建设注入金融活水。',
    fullContent: '为拓宽林业生态产品价值实现路径，商业银行创新推出“碳汇质押贷”。该笔贷款以造林碳汇项目未来产生的减排量收益权作为质押担保，引入第三方权威评估机构进行碳汇价值评估，成功发放授信资金500万元，标志着林业碳汇金融服务体系取得实质突破。',
    coverUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    day: '08',
    yearMonth: '2026-10',
    fullDate: '2026-10-08',
    category: 'news',
    author: '中国绿色金融网',
    views: 1560,
  },
  {
    id: 'news-5',
    title: '生态有价！首单林业碳汇综合保险正式落地',
    excerpt: '为防范森林火灾、病虫害及自然灾害对林业碳汇资产造成的损失，多家保险机构联合推出首单林业碳汇综合保险，为全区数万亩造林碳汇项目提供全生命周期的风险保障，标志着林业碳汇风险管理迈入新阶段。',
    fullContent: '林业碳汇综合保险将自然灾害导致的碳汇汇聚能力损失纳入保险保障范围。当承保林区因火灾、风灾或冰冻导致碳减排量减少时，保险公司将根据核定碳汇损失额度给予赔付，用于森林抚育与再造林，保障碳汇项目的持续稳定性。',
    coverUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=600&q=80',
    day: '02',
    yearMonth: '2026-10',
    fullDate: '2026-10-02',
    category: 'news',
    author: '生态保险时报',
    views: 2110,
  },
];

const INITIAL_POLICY_ITEMS: NewsItem[] = [
  {
    id: 'pol-1',
    title: '关于印发《林业碳汇项目开发管理办法（试行）》的通知',
    excerpt: '为规范林业碳汇项目开发与备案管理，保证碳汇项目核算科学性与监测真实性，国家林草局联合生态环境部正式印发《林业碳汇项目开发管理办法（试行）》，明确立项审批、样地复核及MRV核证标准...',
    fullContent: '《林业碳汇项目开发管理办法（试行）》对造林碳汇、森林抚育碳汇及竹林碳汇的开发边界、额外性论证、基准线确定以及监测报告编制提出了严密规范，指导各地区有序开展高质量林业碳汇项目。',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    day: '16',
    yearMonth: '2026-10',
    fullDate: '2026-10-16',
    category: 'policy',
    author: '国家林业和草原局',
    views: 4120,
  },
  {
    id: 'pol-2',
    title: '《国家温室气体自愿减排交易管理办法（试行）》深度政策解读',
    excerpt: '全面解读CCER管理办法核心要点，涵盖项目设计、审定与登记、减排量核证与登记、交易与注销等全流程规范，突出林业碳汇在自愿减排交易体系中的重要优先地位...',
    fullContent: '自愿减排交易体系恢复以来，林业碳汇作为高质性生态减排量备受关注。本解读详细剖析了第三方核证机构的监督机制、交易主体的合规要求以及跨区域交易的政策衔接。',
    coverUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    day: '10',
    yearMonth: '2026-10',
    fullDate: '2026-10-10',
    category: 'policy',
    author: '生态环境部政策研究中心',
    views: 3890,
  },
  {
    id: 'pol-3',
    title: '《林业碳汇预期收益权质押贷款操作指南》金融行业标准发布',
    excerpt: '中国人民银行联合监管机构制定《指南》，明确林业碳汇评估方法、质押登记流程、风险控制指标及处置变现通道，促使金融机构加大对碳汇项目的信贷倾斜...',
    fullContent: '《指南》确立了碳汇收益权质押的合法合规要件，规定可以利用碳汇交易市场、大宗协议转让等渠道实现质押物处置，有效降低商业银行坏账风险。',
    coverUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    day: '05',
    yearMonth: '2026-10',
    fullDate: '2026-10-05',
    category: 'policy',
    author: '中国人民银行金融研究所',
    views: 2750,
  },
  {
    id: 'pol-4',
    title: '《省级林业碳票资产管理与流通交易暂行办法》',
    excerpt: '为探索地方性林业碳票制度，打通小规模林农及村集体生态资产变现堵点，省厅出台碳票资产登记、发行、划转与注销规则...',
    fullContent: '地方碳票制度将零散的森林资产进行量化测算，颁发林业碳票作为资产凭证，支持在省内交易平台进行撮合流通，为乡村振兴与林农直接获得生态效益收益提供保障。',
    coverUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
    day: '01',
    yearMonth: '2026-10',
    fullDate: '2026-10-01',
    category: 'policy',
    author: '省林业与草原局',
    views: 2410,
  },
];

// Initial Loan Products based on user uploaded screenshot (with 2026-10 recent dates in descending order)
const INITIAL_LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: 'lp-1',
    bankName: '中国农业银行合肥分行',
    productName: '绿碳贷·林业碳汇预期收益权质押贷',
    productType: '质押贷',
    interestRate: 3.85,
    loanTermYears: 10,
    maxLoanAmount: 50000000,
    disbursedAmount: 18200000,
    repaymentMethod: '等额本金',
    publishDate: '2026-10-18',
    description: '专为造林及森林经营企业量身定制，以CCER林业碳汇预期收益权作为质押担保，享有国家绿色金融专属贴息政策。',
  },
  {
    id: 'lp-2',
    bankName: '徽商银行合肥分行',
    productName: '碳汇通·林业生态信用贷',
    productType: '信用贷',
    interestRate: 4.20,
    loanTermYears: 5,
    maxLoanAmount: 10000000,
    disbursedAmount: 6500000,
    repaymentMethod: '等额本息',
    publishDate: '2026-10-17',
    description: '无需传统不动产抵押，基于林企碳资产核算评估与纳税信用额度，最快3个工作日内完成审查放款。',
  },
  {
    id: 'lp-3',
    bankName: '国家开发银行安徽省分行',
    productName: '国家CCER林业项目专项扶持贷',
    productType: '质押贷',
    interestRate: 3.25,
    loanTermYears: 20,
    maxLoanAmount: 100000000,
    disbursedAmount: 45000000,
    repaymentMethod: '按期还本付息',
    publishDate: '2026-10-15',
    description: '政策性金融专项资金，重点支持千亩以上长周期碳汇林抚育与生态修复项目，利率享受特别下浮政策。',
  },
  {
    id: 'lp-4',
    bankName: '中国工商银行合肥高新支行',
    productName: '工银绿碳·林权资产抵押贷',
    productType: '抵押贷',
    interestRate: 4.10,
    loanTermYears: 15,
    maxLoanAmount: 30000000,
    disbursedAmount: 12000000,
    repaymentMethod: '先息后本',
    publishDate: '2026-10-14',
    description: '以林权证及土地承包经营权设定联合抵押，组合评估林木蓄积量与固碳价值，支持分期还款。',
  },
  {
    id: 'lp-5',
    bankName: '中国邮政储蓄银行肥西县支行',
    productName: '邮储乡村振兴·碳汇普惠贷',
    productType: '信用贷',
    interestRate: 3.95,
    loanTermYears: 8,
    maxLoanAmount: 5000000,
    disbursedAmount: 3200000,
    repaymentMethod: '等额本金',
    publishDate: '2026-10-12',
    description: '面向村集体合作社与广大林农户，提供手续简便、灵活随借随还的碳汇微型普惠信贷服务。',
  },
  {
    id: 'lp-6',
    bankName: '兴业银行合肥分行',
    productName: '兴业绿色金融·碳资产组合质押贷',
    productType: '质押贷',
    interestRate: 3.75,
    loanTermYears: 10,
    maxLoanAmount: 25000000,
    disbursedAmount: 15000000,
    repaymentMethod: '等额本息',
    publishDate: '2026-10-10',
    description: '创新引入林业碳票与排污权、排碳权组合质押担保模式，显著提高企业综合信贷额度。',
  },
  {
    id: 'lp-7',
    bankName: '招商银行合肥蜀山支行',
    productName: '招银碳快贷·林业碳票流转质押',
    productType: '质押贷',
    interestRate: 4.05,
    loanTermYears: 5,
    maxLoanAmount: 15000000,
    disbursedAmount: 8800000,
    repaymentMethod: '先息后本',
    publishDate: '2026-10-08',
    description: '通过地方碳汇交易所完成碳票质押登记，审批通道高效快捷，按季度付息。',
  },
  {
    id: 'lp-8',
    bankName: '安徽农村商业银行肥东支行',
    productName: '农商绿林宝·集体林权抵押贷',
    productType: '抵押贷',
    interestRate: 4.35,
    loanTermYears: 12,
    maxLoanAmount: 8000000,
    disbursedAmount: 4200000,
    repaymentMethod: '按期还本付息',
    publishDate: '2026-10-06',
    description: '针对县域村集体林场与毛竹林开发单位，开辟专属评级审查通道，支持长周期按年付息。',
  },
  {
    id: 'lp-9',
    bankName: '中国建设银行合肥庐阳支行',
    productName: '建行碳金贷·造林抚育项目信贷',
    productType: '信用贷',
    interestRate: 3.90,
    loanTermYears: 10,
    maxLoanAmount: 20000000,
    disbursedAmount: 11000000,
    repaymentMethod: '等额本金',
    publishDate: '2026-10-05',
    description: '建行绿色信贷重点产品，依托大数据建模核算碳减排增量，按季度分期平摊本息。',
  },
  {
    id: 'lp-10',
    bankName: '浦发银行合肥分行',
    productName: '浦发绿创·生态资产价值收益贷',
    productType: '质押贷',
    interestRate: 4.15,
    loanTermYears: 7,
    maxLoanAmount: 12000000,
    disbursedAmount: 7500000,
    repaymentMethod: '一次性还本付息',
    publishDate: '2026-10-02',
    description: '支持中短期林业碳汇项目二次开发融资，期满后一次性结清本息。',
  },
];

// Initial Loan Service Applications (with 2026-10 recent dates in descending order matching screenshot action column)
const INITIAL_LOAN_APPLICATIONS: LoanServiceApplication[] = [
  {
    id: 'app-1',
    region: '肥西县',
    companyName: '安徽紫蓬山林业生态开发有限公司',
    productName: '绿碳贷·林业碳汇预期收益权质押贷',
    bankName: '中国农业银行合肥分行',
    applyAmount: 15000000,
    loanTermYears: 10,
    status: '待审核',
    applyDate: '2026-10-18',
    disbursedAmount: 0,
    repaymentMethod: '等额本金',
    contactPerson: '张建国',
    contactPhone: '138****5678',
    pledgeCarbonVolume: 85000,
    description: '申请1.5万亩造林碳汇预期收益质押，用于森林抚育与防灭火设施采购。',
  },
  {
    id: 'app-2',
    region: '蜀山区',
    companyName: '合肥大蜀山生态绿化建设造林合作社',
    productName: '碳汇通·林业生态信用贷',
    bankName: '徽商银行合肥分行',
    applyAmount: 5000000,
    loanTermYears: 5,
    status: '待审核',
    applyDate: '2026-10-17',
    disbursedAmount: 0,
    repaymentMethod: '等额本息',
    contactPerson: '王晓梅',
    contactPhone: '139****1234',
    pledgeCarbonVolume: 32000,
    description: '基于森林蓄积量评级申请无抵押信用贷款。',
  },
  {
    id: 'app-3',
    region: '长丰县',
    companyName: '安徽江淮双碳生态发展集团有限公司',
    productName: '国家CCER林业项目专项扶持贷',
    bankName: '国家开发银行安徽省分行',
    applyAmount: 30000000,
    loanTermYears: 15,
    status: '待审核',
    applyDate: '2026-10-16',
    disbursedAmount: 0,
    repaymentMethod: '按期还本付息',
    contactPerson: '陈立新',
    contactPhone: '136****8899',
    pledgeCarbonVolume: 180000,
    description: '申请重点CCER林业项目开发专项扶持性低息贷款。',
  },
  {
    id: 'app-4',
    region: '庐江县',
    companyName: '庐江县汤池林场林业碳汇合作社',
    productName: '工银绿碳·林权资产抵押贷',
    bankName: '中国工商银行合肥高新支行',
    applyAmount: 8000000,
    loanTermYears: 12,
    status: '待审核',
    applyDate: '2026-10-15',
    disbursedAmount: 0,
    repaymentMethod: '先息后本',
    contactPerson: '刘志刚',
    contactPhone: '137****4321',
    pledgeCarbonVolume: 50000,
    description: '林权证联合抵押贷款，主要用于毛竹林扩建与森林抚育。',
  },
  {
    id: 'app-5',
    region: '肥东县',
    companyName: '合肥官亭林海碳汇苗木开发有限公司',
    productName: '邮储乡村振兴·碳汇普惠贷',
    bankName: '中国邮政储蓄银行肥西县支行',
    applyAmount: 3000000,
    loanTermYears: 8,
    status: '已驳回',
    applyDate: '2026-10-14',
    disbursedAmount: 0,
    repaymentMethod: '等额本金',
    contactPerson: '赵大勇',
    contactPhone: '150****6677',
    pledgeCarbonVolume: 20000,
    description: '普惠微型绿色信贷，支持生态景观林建设。',
  },
  {
    id: 'app-6',
    region: '巢湖市',
    companyName: '巢湖市银屏山生态公益林建设有限公司',
    productName: '兴业绿色金融·碳资产组合质押贷',
    bankName: '兴业银行合肥分行',
    applyAmount: 12000000,
    loanTermYears: 10,
    status: '审批通过',
    applyDate: '2026-10-12',
    disbursedAmount: 0,
    repaymentMethod: '等额本息',
    contactPerson: '孙明辉',
    contactPhone: '182****9012',
    pledgeCarbonVolume: 68000,
    description: '碳票与公益林收益权组合质押，申请流动资金贷款。',
  },
  {
    id: 'app-7',
    region: '包河区',
    companyName: '安徽绿源碳汇资产运营有限公司',
    productName: '招银碳快贷·林业碳票流转质押',
    bankName: '招商银行合肥蜀山支行',
    applyAmount: 10000000,
    loanTermYears: 5,
    status: '审批通过',
    applyDate: '2026-10-10',
    disbursedAmount: 0,
    repaymentMethod: '先息后本',
    contactPerson: '林少华',
    contactPhone: '189****3344',
    pledgeCarbonVolume: 45000,
    description: '林业碳票交易质押申请，快速审核通道。',
  },
  {
    id: 'app-8',
    region: '高新区',
    companyName: '合肥高新生态碳汇科技有限公司',
    productName: '建行碳金贷·造林抚育项目信贷',
    bankName: '中国建设银行合肥庐阳支行',
    applyAmount: 6000000,
    loanTermYears: 7,
    status: '审批通过',
    applyDate: '2026-10-08',
    disbursedAmount: 0,
    repaymentMethod: '等额本金',
    contactPerson: '周天成',
    contactPhone: '135****7788',
    pledgeCarbonVolume: 15000,
    description: '碳汇资产第三方评估复核已完成，准予批复放款。',
  },
  {
    id: 'app-9',
    region: '瑶海区',
    companyName: '安徽瑶海绿廊林业综合开发公司',
    productName: '浦发绿创·生态资产价值收益贷',
    bankName: '浦发银行合肥分行',
    applyAmount: 9000000,
    loanTermYears: 6,
    status: '已放款',
    applyDate: '2026-10-05',
    disbursedAmount: 9000000,
    repaymentMethod: '一次性还本付息',
    contactPerson: '郑小林',
    contactPhone: '133****2211',
    pledgeCarbonVolume: 52000,
    description: '生态带建设碳汇价值收益担保贷款，资金已拨付到位。',
  },
  {
    id: 'app-10',
    region: '庐阳区',
    companyName: '庐阳三十岗生态农业与林业合作社',
    productName: '农商绿林宝·集体林权抵押贷',
    bankName: '安徽农村商业银行肥东支行',
    applyAmount: 4000000,
    loanTermYears: 10,
    status: '已结清',
    applyDate: '2026-10-02',
    disbursedAmount: 4000000,
    repaymentMethod: '按期还本付息',
    contactPerson: '许德福',
    contactPhone: '136****5544',
    pledgeCarbonVolume: 28000,
    description: '贷款本息已顺利结清，质押的集权林地已解质押。',
  },
];

// Sample Template Records for Batch Import
const DEFAULT_BATCH_IMPORT_TEMPLATES: LoanProduct[] = [
  {
    id: 'imp-1',
    bankName: '中信银行合肥分行',
    productName: '信贷·绿碳收益质押保',
    productType: '质押贷',
    interestRate: 3.70,
    loanTermYears: 15,
    maxLoanAmount: 40000000,
    disbursedAmount: 0,
    repaymentMethod: '等额本金',
    publishDate: '2026-10-18',
    description: '中信绿色信贷重点产品，以碳减排收益凭证质押并享受专属利息倾斜。',
  },
  {
    id: 'imp-2',
    bankName: '中国光大银行合肥分行',
    productName: '阳光绿林·生态权益贷',
    productType: '信用贷',
    interestRate: 4.00,
    loanTermYears: 10,
    maxLoanAmount: 18000000,
    disbursedAmount: 0,
    repaymentMethod: '等额本息',
    publishDate: '2026-10-18',
    description: '无需资产担保，根据碳汇评级直接给予无抵押信用额度。',
  },
  {
    id: 'imp-3',
    bankName: '交通银行安徽省分行',
    productName: '交银碳汇·林权抵押增信贷',
    productType: '抵押贷',
    interestRate: 3.90,
    loanTermYears: 20,
    maxLoanAmount: 60000000,
    disbursedAmount: 0,
    repaymentMethod: '先息后本',
    publishDate: '2026-10-17',
    description: '交通银行绿色低碳专项贴息贷款，长周期扶持林业固碳提质。',
  },
  {
    id: 'imp-4',
    bankName: '中国民生银行合肥分行',
    productName: '民生绿洲·碳汇质押快捷贷',
    productType: '质押贷',
    interestRate: 4.15,
    loanTermYears: 8,
    maxLoanAmount: 15000000,
    disbursedAmount: 0,
    repaymentMethod: '按期还本付息',
    publishDate: '2026-10-16',
    description: '高效线上审批通道，快速质押核算，加速资金周转。',
  },
  {
    id: 'imp-5',
    bankName: '华夏银行合肥分行',
    productName: '华夏低碳·林业收益权贷',
    productType: '质押贷',
    interestRate: 3.80,
    loanTermYears: 12,
    maxLoanAmount: 35000000,
    disbursedAmount: 0,
    repaymentMethod: '等额本金',
    publishDate: '2026-10-15',
  },
];

// 增收管理: 闲荒地登记初始数据 (全部为真实地块、真实合作社与近期2026年日期，无任何XXX)
export const INITIAL_IDLE_LANDS: IdleLandRecord[] = [
  {
    id: 'land-00',
    region: '合肥市 包河区',
    parcelName: '大圩镇金葡萄生态林地',
    areaMu: 10,
    registrantName: '合肥市包河区大圩农场林业专业合作社',
    landCondition: '地块地势平坦开阔，土壤肥沃富硒，周边水系环绕且灌溉设施齐全，紧邻大圩生态景观廊道，适宜高标准实施林下经济作物种植、耐湿耐旱乔木培育及生态碳汇林开发。',
    leaseTermYears: 10,
    expectedPrice: 1000,
    utilizationStatus: '闲置中',
    registerDate: '2026-10-27',
    contactPerson: '郑建国',
    contactPhone: '18965362225',
    location: '合肥市包河区大圩镇金葡萄生态农业示范区东侧',
    remarks: '经区林业局权属核查无争议，近邻环巢湖生态屏障区，可即时对接绿色碳票与盘活利用。',
  },
  {
    id: 'land-01',
    region: '合肥市 肥西县',
    parcelName: '官亭镇磨庄生态林地',
    areaMu: 100,
    registrantName: '肥西县官亭镇磨庄村股份经济合作社',
    landCondition: '土地肥沃',
    leaseTermYears: 20,
    expectedPrice: 500,
    utilizationStatus: '荒废中',
    registerDate: '2026-10-26',
    contactPerson: '张有田',
    contactPhone: '13856019921',
    location: '肥西县官亭镇磨庄村北侧生态农业区',
    remarks: '原为荒芜次生灌木林地，土壤腐殖质丰富，适宜开发国家CCER碳汇造林项目。',
  },
  {
    id: 'land-02',
    region: '合肥市 肥西县',
    parcelName: '紫蓬山北麓优质山地',
    areaMu: 105,
    registrantName: '肥西县紫蓬镇农林专业合作社',
    landCondition: '水源充足',
    leaseTermYears: 15,
    expectedPrice: 450,
    utilizationStatus: '荒废中',
    registerDate: '2026-10-25',
    contactPerson: '李春发',
    contactPhone: '13955128834',
    location: '肥西县紫蓬镇紫蓬山西北麓环山林场',
    remarks: '临近环山水系，灌溉便利，光照充足，周边无工业污染。',
  },
  {
    id: 'land-03',
    region: '合肥市 庐阳区',
    parcelName: '三十岗崔岗生态林地',
    areaMu: 20,
    registrantName: '庐阳区三十岗乡崔岗村股份经济合作社',
    landCondition: '道路畅通',
    leaseTermYears: 10,
    expectedPrice: 600,
    utilizationStatus: '闲置中',
    registerDate: '2026-10-23',
    contactPerson: '王德福',
    contactPhone: '13705691120',
    location: '庐阳区三十岗乡崔岗艺术村东侧山林',
    remarks: '紧邻生态景观大道，交通路网完善，适合结合生态农旅开展碳汇林培育。',
  },
  {
    id: 'land-04',
    region: '合肥市 庐阳区',
    parcelName: '大杨镇清河湾待林地',
    areaMu: 10,
    registrantName: '庐阳区大杨镇王拐岗村民组',
    landCondition: '土地肥沃',
    leaseTermYears: 20,
    expectedPrice: 500,
    utilizationStatus: '闲置中',
    registerDate: '2026-10-21',
    contactPerson: '陈大明',
    contactPhone: '13615607788',
    location: '庐阳区大杨镇清河湾水源保护区西岸',
    remarks: '土壤深厚肥沃，曾作苗木圃地，基础设施完好，可直接进行阔叶乔木栽植。',
  },
  {
    id: 'land-05',
    region: '合肥市 肥东县',
    parcelName: '店埠镇焦冲生态林地',
    areaMu: 16,
    registrantName: '肥东县店埠镇焦冲村村民委员会',
    landCondition: '水源充足',
    leaseTermYears: 30,
    expectedPrice: 550,
    utilizationStatus: '闲置中',
    registerDate: '2026-10-18',
    contactPerson: '赵守信',
    contactPhone: '13865912233',
    location: '肥东县店埠镇焦冲水库下游冲积谷地',
    remarks: '水库下游径流涵养地块，常年地下水位稳定，长期出借权益明确。',
  },
  {
    id: 'land-06',
    region: '合肥市 肥东县',
    parcelName: '桥头集双山荒坡地块',
    areaMu: 20,
    registrantName: '肥东县桥头集镇国光村村民委员会',
    landCondition: '道路畅通',
    leaseTermYears: 20,
    expectedPrice: 550,
    utilizationStatus: '租借中',
    registerDate: '2026-10-16',
    contactPerson: '刘建平',
    contactPhone: '13966774455',
    location: '肥东县桥头集镇双山北坡流转段',
    remarks: '已完成农村土地承包权属确认，适宜栽种耐旱侧柏与高碳汇竹林。',
  },
  {
    id: 'land-07',
    region: '合肥市 高新区',
    parcelName: '南岗长宁生态林地',
    areaMu: 20,
    registrantName: '合肥高新区南岗社区股份经济合作社',
    landCondition: '水源充足',
    leaseTermYears: 15,
    expectedPrice: 600,
    utilizationStatus: '租借中',
    registerDate: '2026-10-14',
    contactPerson: '孙维华',
    contactPhone: '13505608899',
    location: '合肥高新区南岗科技园长宁大道西侧',
    remarks: '位于高新区产业走廊外侧防护林带，灌溉管网铺设完毕，属于重点碳汇示范片区。',
  },
  {
    id: 'land-08',
    region: '合肥市 高新区',
    parcelName: '城西桥村流转地块',
    areaMu: 20,
    registrantName: '合肥高新区城西桥村股份经济合作社',
    landCondition: '道路畅通',
    leaseTermYears: 10,
    expectedPrice: 600,
    utilizationStatus: '租借中',
    registerDate: '2026-10-11',
    contactPerson: '吴国强',
    contactPhone: '13305513366',
    location: '合肥高新区城西桥村生态产业园外围',
    remarks: '柏油公路直达地头，地块边界清晰规整，无权属争议。',
  },
  {
    id: 'land-09',
    region: '合肥市 高新区',
    parcelName: '柏堰湖西岸待建林地',
    areaMu: 20,
    registrantName: '合肥高新区柏堰科技园经济联合社',
    landCondition: '水源充足',
    leaseTermYears: 20,
    expectedPrice: 600,
    utilizationStatus: '租借中',
    registerDate: '2026-10-08',
    contactPerson: '周庆林',
    contactPhone: '13855190011',
    location: '合肥高新区柏堰湖湿地公园西岸防护带',
    remarks: '紧邻生态公园湿地，土壤湿润度极高，适合高密度水土保持型林木种植。',
  },
  {
    id: 'land-10',
    region: '合肥市 高新区',
    parcelName: '长宁大道东侧绿化林地',
    areaMu: 20,
    registrantName: '合肥高新区高新农业开发合作社',
    landCondition: '环境良好',
    leaseTermYears: 30,
    expectedPrice: 600,
    utilizationStatus: '租借中',
    registerDate: '2026-10-04',
    contactPerson: '黄永胜',
    contactPhone: '13956987722',
    location: '合肥高新区长宁大道东侧苗木带3号',
    remarks: '林地平坦开阔，周边植被覆盖率高，已预留生态巡护通道。',
  },
  {
    id: 'land-11',
    region: '合肥市 肥西县',
    parcelName: '三河镇白石山生态林块',
    areaMu: 80,
    registrantName: '肥西县三河镇木兰村村民委员会',
    landCondition: '地势平缓',
    leaseTermYears: 25,
    expectedPrice: 480,
    utilizationStatus: '荒废中',
    registerDate: '2026-09-30',
    contactPerson: '徐志刚',
    contactPhone: '13721056633',
    location: '肥西县三河镇木兰村白石山岗地',
    remarks: '丘陵缓坡红壤，土层较厚，坡度低于15度，便于实施机械化抚育。',
  },
  {
    id: 'land-12',
    region: '合肥市 肥东县',
    parcelName: '八斗镇大张生态林地',
    areaMu: 110,
    registrantName: '肥东县八斗镇大张村股份经济合作社',
    landCondition: '土地肥沃',
    leaseTermYears: 20,
    expectedPrice: 520,
    utilizationStatus: '闲置中',
    registerDate: '2026-09-26',
    contactPerson: '丁文华',
    contactPhone: '13856991144',
    location: '肥东县八斗镇大张村集中林场',
    remarks: '周边村集体整体流转入库，面积连片集中，支持规模化碳汇造林资产开发。',
  },
];

// 增收管理: 盘活利用配套项目初始数据
export const INITIAL_REVITALIZE_PROJECTS: RevitalizeProject[] = [
  {
    id: 'rev-1',
    projectCode: 'REV-202610-001',
    landName: '官亭镇磨庄生态林地 (100亩)',
    region: '合肥市 肥西县',
    areaMu: 100,
    contractor: '国元生态林业综合开发有限公司',
    afforestationType: '杉木·红榉高固碳复合林',
    expectedCarbonSink: 185,
    collectiveIncome: 12.5,
    status: '碳汇造林中',
    signDate: '2026-10-22',
  },
  {
    id: 'rev-2',
    projectCode: 'REV-202610-002',
    landName: '桥头集双山荒坡地块 (20亩)',
    region: '合肥市 肥东县',
    areaMu: 20,
    contractor: '安徽省生态环境保护建设基金合伙企业',
    afforestationType: '毛竹·侧柏水土保持林',
    expectedCarbonSink: 48,
    collectiveIncome: 4.8,
    status: '已实现分红',
    signDate: '2026-10-18',
  },
  {
    id: 'rev-3',
    projectCode: 'REV-202610-003',
    landName: '南岗长宁生态林地 (20亩)',
    region: '合肥市 高新区',
    areaMu: 20,
    contractor: '徽商低碳农业科技开发集团',
    afforestationType: '金叶榆·樟树生态林',
    expectedCarbonSink: 52,
    collectiveIncome: 5.6,
    status: '已实现分红',
    signDate: '2026-10-15',
  },
  {
    id: 'rev-4',
    projectCode: 'REV-202610-004',
    landName: '三十岗崔岗生态林地 (20亩)',
    region: '合肥市 庐阳区',
    areaMu: 20,
    contractor: '合肥市乡村振兴投资开发有限责任公司',
    afforestationType: '薄壳山核桃高汇固碳林',
    expectedCarbonSink: 45,
    collectiveIncome: 6.2,
    status: '协议签订中',
    signDate: '2026-10-24',
  },
];

// 增收管理: 盘活利用配套租赁项目初始真实数据 (100% 杜绝 XXX，统一近期时间 2026年10月)
export const INITIAL_REVITALIZE_LEASES: RevitalizeLeaseRecord[] = [
  {
    id: 'rev-01',
    region: '合肥市 肥西县',
    landName: '官亭林海碳汇抚育地块',
    areaMu: 100,
    registrantName: '肥西县官亭镇磨庄村股份经济合作社',
    lesseeName: '安徽中科环境生态发展有限公司',
    leaseTermYears: 20,
    leasePrice: 500,
    dealDate: '2026-10-26',
    socialIncome: 500000,
    remarks: '土地平整肥沃，周边灌溉水系完备，专项用于中科高固碳速生林种植示范与碳票核证。',
  },
  {
    id: 'rev-02',
    region: '合肥市 肥西县',
    landName: '铭传故里紫蓬南麓林地',
    areaMu: 105,
    registrantName: '肥西县铭传乡聚星村股份经济合作社',
    lesseeName: '合肥建投生态园林开发有限公司',
    leaseTermYears: 15,
    leasePrice: 450,
    dealDate: '2026-10-25',
    socialIncome: 472500,
    remarks: '水源充足，紧邻国家森林公园，重点规划林下食用菌套种与生态微度假观光。',
  },
  {
    id: 'rev-03',
    region: '合肥市 庐阳区',
    landName: '大房郢水库水源涵养林区',
    areaMu: 120,
    registrantName: '庐阳区三十岗生态农业专业合作社',
    lesseeName: '安徽森碳汇源生物科技有限公司',
    leaseTermYears: 10,
    leasePrice: 600,
    dealDate: '2026-10-24',
    socialIncome: 720000,
    remarks: '水土保持优良，建设水源涵养林带与水质净化复合林，支持规模化碳汇造林资产开发。',
  },
  {
    id: 'rev-04',
    region: '合肥市 庐阳区',
    landName: '三十岗乡东瞿湿地生态林',
    areaMu: 80,
    registrantName: '庐阳区东瞿村林业专业合作社',
    lesseeName: '合肥绿碳科技发展有限责任公司',
    leaseTermYears: 20,
    leasePrice: 500,
    dealDate: '2026-10-23',
    socialIncome: 400000,
    remarks: '湿地灌溉便利，规划水生耐湿乔木培育与湿地碳汇通量测量实验样地。',
  },
  {
    id: 'rev-05',
    region: '合肥市 肥东县',
    landName: '长临河白马山生态修复林区',
    areaMu: 150,
    registrantName: '肥东县长临河镇红石咀合作社',
    lesseeName: '安徽皖投生态建设有限公司',
    leaseTermYears: 30,
    leasePrice: 550,
    dealDate: '2026-10-22',
    socialIncome: 825000,
    remarks: '连片丘陵荒坡，引入皖投绿色产业基金实施规模化造林增汇项目。',
  },
  {
    id: 'rev-06',
    region: '合肥市 肥东县',
    landName: '桥头集双山碳汇储备林地',
    areaMu: 95,
    registrantName: '肥东县桥头集镇山王村股份经济合作社',
    lesseeName: '安徽皖中绿色碳汇资产管理中心',
    leaseTermYears: 20,
    leasePrice: 550,
    dealDate: '2026-10-21',
    socialIncome: 522500,
    remarks: '光照充足土壤富硒，定点建设县域森林碳票储备储备基地。',
  },
  {
    id: 'rev-07',
    region: '合肥市 高新区',
    landName: '柏堰湖周边生态林果试验基地',
    areaMu: 110,
    registrantName: '高新区长宁社区股份经济合作社',
    lesseeName: '合肥高新低碳技术研究院有限公司',
    leaseTermYears: 15,
    leasePrice: 600,
    dealDate: '2026-10-20',
    socialIncome: 660000,
    remarks: '院所产学研合作，开展林业碳汇物联网传感器与遥感碳汇计量试点。',
  },
  {
    id: 'rev-08',
    region: '合肥市 高新区',
    landName: '南岗镇长宁大道防护绿化带',
    areaMu: 70,
    registrantName: '合肥高新区创新农业合作联社',
    lesseeName: '安徽碳中和数字科技有限责任公司',
    leaseTermYears: 10,
    leasePrice: 600,
    dealDate: '2026-10-19',
    socialIncome: 420000,
    remarks: '交通干道隔离林带提标改造，打造园区高负氧离子绿色走廊。',
  },
  {
    id: 'rev-09',
    region: '合肥市 蜀山区',
    landName: '大蜀山北麓闲置山林地块',
    areaMu: 160,
    registrantName: '蜀山区小庙镇段冲村股份经济合作社',
    lesseeName: '合肥蜀山绿林碳汇开发有限公司',
    leaseTermYears: 20,
    leasePrice: 520,
    dealDate: '2026-10-18',
    socialIncome: 832000,
    remarks: '自然生态底质优良，建设高标准生态步道与碳普惠研学基地。',
  },
  {
    id: 'rev-10',
    region: '合肥市 包河区',
    landName: '大圩金葡萄低碳生态示范区',
    areaMu: 85,
    registrantName: '包河区大圩农场林业专业合作社',
    lesseeName: '安徽滨湖生态湿地碳汇投资有限公司',
    leaseTermYears: 30,
    leasePrice: 620,
    dealDate: '2026-10-17',
    socialIncome: 527000,
    remarks: '环巢湖生态重要节点，高品质生态林果与碳汇增收融合样板。',
  },
];

const getCityTextCoords = (cityId: string) => {
  switch (cityId) {
    case 'hefei': return { x: 240, y: 260 };
    case 'wuhu': return { x: 302, y: 280 };
    case 'anqing': return { x: 190, y: 355 };
    case 'luan': return { x: 170, y: 260 };
    case 'huangshan': return { x: 282, y: 485 };
    case 'chuzhou': return { x: 300, y: 198 };
    case 'fuyang': return { x: 138, y: 170 };
    case 'bozhou': return { x: 140, y: 100 };
    case 'suzhou': return { x: 222, y: 110 };
    case 'bengbu': return { x: 218, y: 168 };
    case 'huainan': return { x: 206, y: 205 };
    case 'huaibei': return { x: 210, y: 62 };
    case 'maanshan': return { x: 338, y: 238 };
    case 'tongling': return { x: 265, y: 330 };
    case 'chizhou': return { x: 250, y: 388 };
    case 'xuancheng': return { x: 325, y: 365 };
    default: return { x: 250, y: 250 };
  }
};

const buildSmoothPath = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
};

const buildSteppedPath = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const nextX = points[i + 1].x;
    const currY = points[i].y;
    const nextY = points[i + 1].y;
    path += ` H ${nextX} V ${nextY}`;
  }
  return path;
};

interface CarbonFinanceViewProps {
  username?: string;
  onBackToPortal: () => void;
}

export const CarbonFinanceView: React.FC<CarbonFinanceViewProps> = ({
  username = 'admin',
  onBackToPortal,
}) => {
  // Top Navbar Active Tab: 'news' (碳汇资讯) | 'loan' (贷款管理) | 'insurance' (保险管理) | 'income' (增收管理)
  const [activeTopTab, setActiveTopTab] = useState<'news' | 'loan' | 'insurance' | 'income'>('loan');

  // Left Submenu Active Tab for News: 'news_dynamic' (新闻动态) | 'policy' (政策法规)
  const [activeSubTab, setActiveSubTab] = useState<'news_dynamic' | 'policy'>('news_dynamic');

  // Left Submenu Active Tab for Loan: 'loan_product' (贷款产品) | 'loan_service' (贷款服务) | 'loan_stats' (贷款统计)
  const [activeLoanSubTab, setActiveLoanSubTab] = useState<'loan_product' | 'loan_service' | 'loan_stats'>('loan_product');

  // Pagination state for news
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPage, setJumpPage] = useState<string>('');

  // Search filter for news
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Loan Management Filter State
  const [loanBankFilter, setLoanBankFilter] = useState<string>('all');
  const [loanProductNameFilter, setLoanProductNameFilter] = useState<string>('');
  const [loanTypeFilter, setLoanTypeFilter] = useState<string>('all');
  const [loanDateFilter, setLoanDateFilter] = useState<string>('');
  const [loanPage, setLoanPage] = useState<number>(1);
  const [loanPageSize, setLoanPageSize] = useState<number>(10);

  // Master loan products list
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>(INITIAL_LOAN_PRODUCTS);

  // Loan Service (贷款服务) Filter & Master Data State
  const [appRegionFilter, setAppRegionFilter] = useState<string>('all');
  const [appCompanyFilter, setAppCompanyFilter] = useState<string>('');
  const [appProductFilter, setAppProductFilter] = useState<string>('');
  const [appDateFilter, setAppDateFilter] = useState<string>('');
  const [appRepayMethodFilter, setAppRepayMethodFilter] = useState<string>('all');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');
  const [appPage, setAppPage] = useState<number>(1);
  const [appPageSize, setAppPageSize] = useState<number>(10);

  // Master loan applications list
  const [loanApplications, setLoanApplications] = useState<LoanServiceApplication[]>(INITIAL_LOAN_APPLICATIONS);

  // Modals for Loan Applications
  const [selectedApplication, setSelectedApplication] = useState<LoanServiceApplication | null>(null);
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState<boolean>(false);
  const [editingApplication, setEditingApplication] = useState<LoanServiceApplication | null>(null);

  // Modals for Actions: 审核 / 放款 / 结清
  const [auditingApp, setAuditingApp] = useState<LoanServiceApplication | null>(null);
  const [auditChoice, setAuditChoice] = useState<'审批通过' | '已驳回'>('审批通过');
  const [auditNote, setAuditNote] = useState<string>('');
  const [auditFile, setAuditFile] = useState<File | null>(null);

  const [disbursingApp, setDisbursingApp] = useState<LoanServiceApplication | null>(null);
  const [disburseBank, setDisburseBank] = useState<string>('徽商银行合肥分行');
  const [disburseAccount, setDisburseAccount] = useState<string>('6222 0212 0900 1888 666');
  const [disburseAmountInput, setDisburseAmountInput] = useState<number | string>('100');
  const [disburseDate, setDisburseDate] = useState<string>('2026-10-18');
  const [disburseNote, setDisburseNote] = useState<string>('放款资金已原路划拨至企业碳金融专项账户，质押手续已办理完成。');
  const [disburseFile, setDisburseFile] = useState<File | null>(null);

  const [settlingApp, setSettlingApp] = useState<LoanServiceApplication | null>(null);
  const [settleNote, setSettleNote] = useState<string>('本金与利息已全额结清，质押的林业碳汇资产顺利解除登记。');

  // New/Edit Loan Application Form
  const [appForm, setAppForm] = useState<Partial<LoanServiceApplication>>({
    region: '',
    companyName: '',
    productName: '',
    bankName: '',
    applyAmount: '' as unknown as number,
    loanTermYears: '' as unknown as number,
    status: '待审核',
    applyDate: '',
    disbursedAmount: 0,
    repaymentMethod: '',
    contactPerson: '',
    contactPhone: '',
    pledgeCarbonVolume: '' as unknown as number,
    description: '',
  });

  // Modals for Loan Products
  const [selectedLoanProduct, setSelectedLoanProduct] = useState<LoanProduct | null>(null);
  const [isAddLoanModalOpen, setIsAddLoanModalOpen] = useState<boolean>(false);
  const [editingLoanProduct, setEditingLoanProduct] = useState<LoanProduct | null>(null);

  // Batch Import Modal State
  const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState<boolean>(false);
  const [importPreviewList, setImportPreviewList] = useState<LoanProduct[]>(DEFAULT_BATCH_IMPORT_TEMPLATES);
  const [selectedImportIds, setSelectedImportIds] = useState<string[]>(['imp-1', 'imp-2', 'imp-3', 'imp-4', 'imp-5']);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // New/Edit Loan Form (Fully cleared by default when clicking +新增)
  const [loanForm, setLoanForm] = useState<Partial<LoanProduct>>({
    bankName: '',
    productName: '',
    productType: '',
    interestRate: '' as unknown as number,
    loanTermYears: '' as unknown as number,
    maxLoanAmount: '' as unknown as number,
    disbursedAmount: 0,
    repaymentMethod: '',
    publishDate: '',
    description: '',
  });

  // Selected news item for detail modal
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // Left Submenu Active Tab for Insurance: 'insurance_product' (保险产品) | 'insurance_service' (保险服务) | 'insurance_stats' (保险统计)
  const [activeInsuranceSubTab, setActiveInsuranceSubTab] = useState<'insurance_product' | 'insurance_service' | 'insurance_stats'>('insurance_product');

  // Insurance Products Master List & Filters
  const [insuranceProducts, setInsuranceProducts] = useState<InsuranceProduct[]>(INITIAL_INSURANCE_PRODUCTS);
  const [insCompanyFilter, setInsCompanyFilter] = useState<string>('all');
  const [insNameFilter, setInsNameFilter] = useState<string>('');
  const [insTypeFilter, setInsTypeFilter] = useState<string>('all');
  const [insDateFilter, setInsDateFilter] = useState<string>('');
  const [insPage, setInsPage] = useState<number>(1);
  const [insPageSize, setInsPageSize] = useState<number>(10);

  // Insurance Services Master List & Filters
  const [insuranceServices, setInsuranceServices] = useState<InsuranceServiceRecord[]>(INITIAL_INSURANCE_SERVICES);
  const [srvRegionFilter, setSrvRegionFilter] = useState<string>('all');
  const [srvCompanyFilter, setSrvCompanyFilter] = useState<string>('');
  const [srvNameFilter, setSrvNameFilter] = useState<string>('all');
  const [srvDateFilter, setSrvDateFilter] = useState<string>('');
  const [srvTypeFilter, setSrvTypeFilter] = useState<string>('all');
  const [srvStatusFilter, setSrvStatusFilter] = useState<string>('all');
  const [srvPage, setSrvPage] = useState<number>(1);
  const [srvPageSize, setSrvPageSize] = useState<number>(10);

  // Modals for Insurance Services
  const insServiceAttachmentInputRef = useRef<HTMLInputElement>(null);
  const [selectedInsServiceRecord, setSelectedInsServiceRecord] = useState<InsuranceServiceRecord | null>(null);
  const [isAddInsServiceModalOpen, setIsAddInsServiceModalOpen] = useState<boolean>(false);

  // Signing & Renewal Modal State
  const [signingInsRecord, setSigningInsRecord] = useState<InsuranceServiceRecord | null>(null);
  const [signingAgreeTerms, setSigningAgreeTerms] = useState<boolean>(true);
  const [signingNote, setSigningNote] = useState<string>('同意签署数字化CA认证保单合同，保费资金已托管备案。');

  const [renewingInsRecord, setRenewingInsRecord] = useState<InsuranceServiceRecord | null>(null);
  const [renewAreaInput, setRenewAreaInput] = useState<number | string>('');
  const [renewNote, setRenewNote] = useState<string>('申请无赔款优待续保，按原条款自动延展保障期12个月。');

  // Insurance Statistics Dashboard States (依据最新截图与用户定制需求)
  const [statsRegionFilter, setStatsRegionFilter] = useState<string>('all');
  const [statsProductFilter, setStatsProductFilter] = useState<string>('all');
  const [statsMapMetric, setStatsMapMetric] = useState<'company' | 'amount'>('company');
  const [statsTimeMetric, setStatsTimeMetric] = useState<'amount' | 'company'>('amount');
  const [statsAreaMetric, setStatsAreaMetric] = useState<'amount' | 'company'>('amount');
  const [statsTimeSort, setStatsTimeSort] = useState<'desc' | 'asc'>('desc'); // 近期时间在先 (降序)
  const [statsAreaSort, setStatsAreaSort] = useState<'desc' | 'default'>('desc'); // 数值排序
  const [hoveredTimeIdx, setHoveredTimeIdx] = useState<number | null>(null);
  const [hoveredMapCity, setHoveredMapCity] = useState<{ name: string; value: number; amount: string; color: string } | null>(null);
  const [timeChartStyle, setTimeChartStyle] = useState<'area' | 'stepped' | 'line'>('area');
  const [areaChartStyle, setAreaChartStyle] = useState<'rose' | 'capsule'>('rose');
  const [hoveredRoseCity, setHoveredRoseCity] = useState<{ city: string; val: number; percent: string; rank: number; color: string } | null>(null);

  const [insServiceForm, setInsServiceForm] = useState<Partial<InsuranceServiceRecord>>({
    region: '合肥市 肥西县',
    companyName: '',
    creditCode: '',
    legalPerson: '',
    legalIdCard: '',
    selectedProductId: 'ip-1',
    productName: '绿碳保·CCER林业碳汇遥感指数保险',
    insuranceType: '碳汇保险',
    premiumAmount: 5.00,
    insuredArea: '' as unknown as number,
    applicantPhone: '',
    attachmentName: '',
    status: '申请中',
    applyDate: '2026-10-18',
  });

  // Filtered & Sorted Insurance Services (descending by applyDate)
  const filteredInsuranceServices = useMemo(() => {
    return insuranceServices
      .filter((item) => {
        if (srvRegionFilter !== 'all' && !item.region.includes(srvRegionFilter)) return false;
        if (srvCompanyFilter && !item.companyName.toLowerCase().includes(srvCompanyFilter.toLowerCase())) return false;
        if (srvNameFilter !== 'all' && !item.productName.includes(srvNameFilter)) return false;
        if (srvDateFilter && !item.applyDate.includes(srvDateFilter)) return false;
        if (srvTypeFilter !== 'all' && item.insuranceType !== srvTypeFilter) return false;
        if (srvStatusFilter !== 'all' && item.status !== srvStatusFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime());
  }, [insuranceServices, srvRegionFilter, srvCompanyFilter, srvNameFilter, srvDateFilter, srvTypeFilter, srvStatusFilter]);

  const totalSrvPages = Math.max(1, Math.ceil(filteredInsuranceServices.length / srvPageSize));
  const displayedInsuranceServices = useMemo(() => {
    const start = (srvPage - 1) * srvPageSize;
    return filteredInsuranceServices.slice(start, start + srvPageSize);
  }, [filteredInsuranceServices, srvPage, srvPageSize]);

  // Open Add Insurance Service Modal with Cleared Data (数据清空)
  const handleOpenAddInsServiceModalCleared = () => {
    setInsServiceForm({
      region: '合肥市 肥西县',
      companyName: '',
      creditCode: '',
      legalPerson: '',
      legalIdCard: '',
      selectedProductId: 'ip-1',
      productName: '绿碳保·森林碳汇遥感险',
      insuranceType: '碳汇保险',
      premiumAmount: 3.90,
      insuredArea: '' as unknown as number,
      applicantPhone: '',
      attachmentName: '',
      status: '申请中',
      applyDate: '2026-10-18',
    });
    setIsAddInsServiceModalOpen(true);
  };

  // Open Signing Modal
  const handleOpenSigningModal = (record: InsuranceServiceRecord) => {
    setSigningInsRecord(record);
    setSigningAgreeTerms(true);
    setSigningNote('同意签署数字化CA认证保单合同，保费资金已托管备案。');
  };

  // Submit Signing Form
  const handleConfirmSignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingInsRecord) return;
    if (!signingAgreeTerms) {
      triggerToast('请勾选并同意电子保险合同示范条款');
      return;
    }
    setInsuranceServices((prev) =>
      prev.map((item) => (item.id === signingInsRecord.id ? { ...item, status: '生效中' } : item))
    );
    triggerToast(`已成功为「${signingInsRecord.companyName}」完成保单电子签约，保单现已生效！`);
    setSigningInsRecord(null);
  };

  // Open Renewal Modal
  const handleOpenRenewalModal = (record: InsuranceServiceRecord) => {
    setRenewingInsRecord(record);
    setRenewAreaInput(record.insuredArea || 20);
    setRenewNote('申请无赔款优待续保，按原条款自动延展保障期12个月。');
  };

  // Submit Renewal Form
  const handleConfirmRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewingInsRecord) return;
    const newArea = Number(renewAreaInput) || renewingInsRecord.insuredArea || 10;
    setInsuranceServices((prev) =>
      prev.map((item) =>
        item.id === renewingInsRecord.id
          ? { ...item, status: '生效中', insuredArea: newArea, applyDate: '2026-10-18' }
          : item
      )
    );
    triggerToast(`已成功为「${renewingInsRecord.companyName}」办理续保（面积：${newArea}亩），新保障期已正式启动！`);
    setRenewingInsRecord(null);
  };

  // Handlers for Insurance Services
  const handleSignInsServiceContract = (id: string, companyName: string) => {
    setInsuranceServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: '生效中' } : item))
    );
    triggerToast(`已成功与「${companyName}」完成保单线上自动签约，保险现已生效！`);
  };

  const handleRenewInsServicePolicy = (id: string, companyName: string) => {
    setInsuranceServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: '生效中', applyDate: '2026-10-18' } : item))
    );
    triggerToast(`已成功为「${companyName}」办理保单续保，新保障期已开始！`);
  };

  const handleDeleteInsServiceRecord = (id: string, companyName: string) => {
    setInsuranceServices((prev) => prev.filter((item) => item.id !== id));
    triggerToast(`已成功撤销并删除「${companyName}」的投保凭单记录`);
  };

  const handleSaveAddInsService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insServiceForm.companyName?.trim()) {
      triggerToast('请输入申贷/投保企业名称');
      return;
    }
    if (!insServiceForm.applicantPhone?.trim()) {
      triggerToast('请输入申请人手机号码');
      return;
    }

    const chosenProd = insuranceProducts.find((p) => p.id === insServiceForm.selectedProductId) || insuranceProducts[0];

    const newRecord: InsuranceServiceRecord = {
      id: `SRV_NEW_${Date.now()}`,
      region: insServiceForm.region || '合肥市 肥西县',
      companyName: insServiceForm.companyName.trim(),
      creditCode: insServiceForm.creditCode?.trim() || '',
      legalPerson: insServiceForm.legalPerson?.trim() || '',
      legalIdCard: insServiceForm.legalIdCard?.trim() || '',
      productName: chosenProd ? chosenProd.productName : '森林碳汇火灾与气象灾害指数保险',
      insuranceType: chosenProd ? chosenProd.insuranceType : '碳汇保险',
      premiumAmount: chosenProd ? chosenProd.premiumRate : 15.00,
      insuredArea: Number(insServiceForm.insuredArea) || 20,
      applicantPhone: insServiceForm.applicantPhone.trim(),
      attachmentName: insServiceForm.attachmentName || '营业执照与林权出让评估证书.pdf',
      status: '申请中',
      applyDate: '2026-10-18', // Recent 2026 date (降序排列)
    };

    setInsuranceServices((prev) => [newRecord, ...prev]);
    setIsAddInsServiceModalOpen(false);
    setSrvRegionFilter('all');
    setSrvCompanyFilter('');
    setSrvNameFilter('all');
    setSrvTypeFilter('all');
    setSrvStatusFilter('all');
    setSrvPage(1);
    triggerToast(`成功为「${newRecord.companyName}」提交新增投保申请！`);
  };

  // Modals & Real File Batch Import States
  const insFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedInsuranceProduct, setSelectedInsuranceProduct] = useState<InsuranceProduct | null>(null);
  const [isAddInsModalOpen, setIsAddInsModalOpen] = useState<boolean>(false);
  const [editingInsuranceProduct, setEditingInsuranceProduct] = useState<InsuranceProduct | null>(null);
  const [isBatchImportInsModalOpen, setIsBatchImportInsModalOpen] = useState<boolean>(false);
  const [realImportFile, setRealImportFile] = useState<{ name: string; size: string } | null>({
    name: '202610_合肥市林业碳汇与保险产品数据表.xlsx',
    size: '328 KB',
  });
  const [duplicatePolicy, setDuplicatePolicy] = useState<'overwrite' | 'skip'>('overwrite');
  const [parsedImportProducts, setParsedImportProducts] = useState<InsuranceProduct[]>([
    {
      id: 'INS_IMPORT_INIT_1',
      companyName: '国元农业保险股份有限公司',
      productName: '森林碳汇火灾与气象灾害指数保险',
      insuranceType: '碳汇保险',
      premiumRate: 28.5,
      minInsuredArea: 500,
      launchDate: '2026-10-18',
      description: '针对风灾、冻害、高温干旱等极端天气导致林木蓄积量损失及碳汇功能减弱提供风险托底保护。',
    },
    {
      id: 'INS_IMPORT_INIT_2',
      companyName: '中国人民财产保险股份有限公司',
      productName: '林业碳汇质押贷款履约保证保险',
      insuranceType: '碳汇保险',
      premiumRate: 32.0,
      minInsuredArea: 1000,
      launchDate: '2026-10-17',
      description: '为借款人利用碳汇收益权质押融资提供违约履约保证，降低金融机构信贷不良风险。',
    },
    {
      id: 'INS_IMPORT_INIT_3',
      companyName: '中国人寿财产保险股份有限公司',
      productName: '湿地生态碳汇与暴雨巨灾保险',
      insuranceType: '碳汇保险',
      premiumRate: 45.0,
      minInsuredArea: 800,
      launchDate: '2026-10-16',
      description: '覆盖湿地生态保护区因特大暴雨与洪涝导致的湿地植被破坏及碳封存效能下降损毁赔付。',
    },
  ]);

  const [insForm, setInsForm] = useState<Partial<InsuranceProduct>>({
    companyName: '',
    productName: '',
    insuranceType: '碳汇保险',
    premiumRate: '' as unknown as number,
    minInsuredArea: '' as unknown as number,
    launchDate: '',
    description: '',
  });

  // Download Real Excel Template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        所属保险公司: '国元农业保险股份有限公司',
        保险名称: '森林碳汇火灾与气象灾害指数保险',
        保险类型: '碳汇保险',
        '保费金额(元)': 28.5,
        '最低投保面积(亩)': 500,
        上线日期: '2026-10-18',
        产品介绍: '针对风灾、冻害、高温干旱等极端天气导致林木蓄积量损失及碳汇功能减弱提供风险托底保护。',
      },
      {
        所属保险公司: '中国人民财产保险股份有限公司',
        保险名称: '林业碳汇质押贷款履约保证保险',
        保险类型: '碳汇保险',
        '保费金额(元)': 32.0,
        '最低投保面积(亩)': 1000,
        上线日期: '2026-10-17',
        产品介绍: '为借款人利用碳汇收益权质押融资提供违约履约保证，降低金融机构信贷不良风险。',
      },
      {
        所属保险公司: '中国人寿财产保险股份有限公司',
        保险名称: '湿地生态碳汇与暴雨巨灾保险',
        保险类型: '碳汇保险',
        '保费金额(元)': 45.0,
        '最低投保面积(亩)': 800,
        上线日期: '2026-10-16',
        产品介绍: '覆盖湿地生态保护区因特大暴雨与洪涝导致的湿地植被破坏及碳封存效能下降损毁赔付。',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '保险产品数据模版');
    XLSX.writeFile(workbook, '保险产品批量导入模板_v2026.xlsx');
    triggerToast('已自动为您生成并下载「保险产品批量导入模板_v2026.xlsx」！');
  };

  // Real File Upload & Parser
  const handleRealFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawRows || rawRows.length === 0) {
          triggerToast('读取文件完成，但表格中未发现任何有效数据行');
          return;
        }

        const parsedList: InsuranceProduct[] = [];
        rawRows.forEach((row, index) => {
          const companyName = String(
            row['所属保险公司'] || row['保险公司'] || row['公司名称'] || row['companyName'] || ''
          ).trim();

          const productName = String(
            row['保险名称'] || row['产品名称'] || row['保险产品名称'] || row['productName'] || ''
          ).trim();

          if (!companyName && !productName) return;

          const insuranceTypeRaw = String(
            row['保险类型'] || row['类型'] || row['insuranceType'] || '碳汇保险'
          ).trim();

          let insuranceType: InsuranceProduct['insuranceType'] = '碳汇保险';
          if (insuranceTypeRaw.includes('林木')) insuranceType = '林木保险';
          else if (insuranceTypeRaw.includes('政策')) insuranceType = '政策性保险';

          const premiumRate =
            parseFloat(
              String(row['保费金额(元)'] || row['保费金额'] || row['保费'] || row['premiumRate'] || '30')
            ) || 30;

          const minInsuredArea =
            parseInt(
              String(
                row['最低投保面积(亩)'] ||
                  row['最低投保面积'] ||
                  row['投保面积'] ||
                  row['minInsuredArea'] ||
                  '500'
              )
            ) || 500;

          const launchDateRaw = String(
            row['上线日期'] || row['发布日期'] || row['日期'] || row['launchDate'] || '2026-10-18'
          ).trim();

          const description = String(
            row['产品介绍'] ||
              row['保障责任说明'] ||
              row['说明'] ||
              row['description'] ||
              '通过真实文件解析导入添加的保险产品条款说明'
          ).trim();

          parsedList.push({
            id: `INS_IMPORT_${Date.now()}_${index}`,
            companyName: companyName || '国元农业保险股份有限公司',
            productName: productName || `碳汇综合保障保险第${index + 1}期`,
            insuranceType,
            premiumRate,
            minInsuredArea,
            launchDate: launchDateRaw || '2026-10-18',
            description,
          });
        });

        if (parsedList.length > 0) {
          setRealImportFile({ name: file.name, size: fileSizeStr });
          setParsedImportProducts(parsedList);
          triggerToast(`文件读取解析成功！已提取到 ${parsedList.length} 条真实保险数据`);
        } else {
          triggerToast('未能解析出有效的保险数据，请参照标准模板表头配置');
        }
      } catch (err) {
        console.error('File parsing error:', err);
        triggerToast('文件解析异常，请确认是否为标准 Excel (.xlsx/.xls) 或 CSV 文件');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Confirm Batch Import Execution
  const handleConfirmInsBatchImport = () => {
    if (parsedImportProducts.length === 0) {
      triggerToast('当前没有解析出的有效数据，请先上传包含数据的 Excel/CSV 文件');
      return;
    }

    setInsuranceProducts((prev) => {
      let updated = [...prev];
      parsedImportProducts.forEach((newProd) => {
        const existingIdx = updated.findIndex((p) => p.productName === newProd.productName);
        if (existingIdx >= 0) {
          if (duplicatePolicy === 'overwrite') {
            updated[existingIdx] = { ...newProd, id: updated[existingIdx].id };
          }
        } else {
          updated.unshift(newProd);
        }
      });
      return updated;
    });

    triggerToast(`成功将 ${parsedImportProducts.length} 条真实保险产品导入系统应用！`);
    setIsBatchImportInsModalOpen(false);
    setInsCompanyFilter('all');
    setInsTypeFilter('all');
    setInsNameFilter('');
    setInsPage(1);
  };

  // Filtered and sorted Insurance Products (descending by launchDate - 近期优先)
  const filteredInsuranceProducts = useMemo(() => {
    return insuranceProducts
      .filter((item) => {
        if (insCompanyFilter !== 'all' && !item.companyName.includes(insCompanyFilter)) return false;
        if (insNameFilter && !item.productName.toLowerCase().includes(insNameFilter.toLowerCase())) return false;
        if (insTypeFilter !== 'all' && item.insuranceType !== insTypeFilter) return false;
        if (insDateFilter && !item.launchDate.includes(insDateFilter)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());
  }, [insuranceProducts, insCompanyFilter, insNameFilter, insTypeFilter, insDateFilter]);

  const totalInsPages = Math.max(1, Math.ceil(filteredInsuranceProducts.length / insPageSize));
  const displayedInsuranceProducts = useMemo(() => {
    const start = (insPage - 1) * insPageSize;
    return filteredInsuranceProducts.slice(start, start + insPageSize);
  }, [filteredInsuranceProducts, insPage, insPageSize]);

  // Insurance Handlers
  const handleOpenAddInsModalCleared = () => {
    setEditingInsuranceProduct(null);
    setInsForm({
      companyName: '',
      productName: '',
      insuranceType: '碳汇保险',
      premiumRate: '' as unknown as number,
      minInsuredArea: '' as unknown as number,
      launchDate: '',
      description: '',
    });
    setIsAddInsModalOpen(true);
  };

  const handleDeleteInsuranceProduct = (id: string, name: string) => {
    setInsuranceProducts((prev) => prev.filter((p) => p.id !== id));
    triggerToast(`已成功下架并删除保险产品「${name}」`);
  };

  const handleSaveInsuranceProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insForm.productName?.trim() || !insForm.companyName?.trim()) {
      triggerToast('请完整填写保险公司名称与保险产品名称');
      return;
    }

    if (editingInsuranceProduct) {
      setInsuranceProducts((prev) =>
        prev.map((item) =>
          item.id === editingInsuranceProduct.id
            ? { ...item, ...(insForm as InsuranceProduct) }
            : item
        )
      );
      triggerToast(`保险产品「${insForm.productName}」更新成功！`);
      setEditingInsuranceProduct(null);
    } else {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const defaultTodayDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

      const newProduct: InsuranceProduct = {
        id: `ip-${Date.now()}`,
        companyName: insForm.companyName.trim(),
        productName: insForm.productName.trim(),
        insuranceType: (insForm.insuranceType as InsuranceProduct['insuranceType']) || '碳汇保险',
        premiumRate: Number(insForm.premiumRate) || 5.00,
        minInsuredArea: Number(insForm.minInsuredArea) || 50,
        launchDate: insForm.launchDate || defaultTodayDate,
        description: insForm.description || '生态林业碳汇专属保障产品。',
      };
      setInsuranceProducts((prev) =>
        [newProduct, ...prev].sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime())
      );
      triggerToast(`新保险产品「${newProduct.productName}」添加成功！排在近期首位。`);
    }
    setIsAddInsModalOpen(false);
  };

  // ================= 增收管理 (Income Generation) 状态与事件处理器 =================
  const [activeIncomeSubTab, setActiveIncomeSubTab] = useState<'idle_land' | 'revitalize' | 'income_stats'>('idle_land');

  // 闲荒地登记 (Idle Land Records) 主数据与筛选
  const [idleLands, setIdleLands] = useState<IdleLandRecord[]>(INITIAL_IDLE_LANDS);
  const [landRegionFilter, setLandRegionFilter] = useState<string>('all');
  const [landRegistrantFilter, setLandRegistrantFilter] = useState<string>('');
  const [landNameFilter, setLandNameFilter] = useState<string>('');
  const [landStatusFilter, setLandStatusFilter] = useState<string>('all');
  const [landDateFilter, setLandDateFilter] = useState<string>('');
  const [landPage, setLandPage] = useState<number>(1);
  const [landPageSize, setLandPageSize] = useState<number>(10);

  // 闲荒地弹窗状态
  const [selectedIdleLand, setSelectedIdleLand] = useState<IdleLandRecord | null>(null);
  const [isAddLandModalOpen, setIsAddLandModalOpen] = useState<boolean>(false);
  const [editingLand, setEditingLand] = useState<IdleLandRecord | null>(null);
  const [landForm, setLandForm] = useState<Partial<IdleLandRecord>>({
    parcelName: '',
    region: '',
    registrantName: '',
    contactPhone: '',
    areaMu: '' as unknown as number,
    location: '',
    expectedPrice: '' as unknown as number,
    leaseTermYears: '' as unknown as number,
    landCondition: '',
    utilizationStatus: '闲置中',
    registerDate: '2026-10-26',
    contactPerson: '',
    remarks: '',
  });

  // 盘活利用项目数据
  const [revitalizeProjects] = useState<RevitalizeProject[]>(INITIAL_REVITALIZE_PROJECTS);
  const [selectedRevitalizeProject, setSelectedRevitalizeProject] = useState<RevitalizeProject | null>(null);

  // 盘活利用 (对应截图 image_a7e45871.png)
  const [revitalizeLeases, setRevitalizeLeases] = useState<RevitalizeLeaseRecord[]>(INITIAL_REVITALIZE_LEASES);
  const [revitalizeDistrictFilter, setRevitalizeDistrictFilter] = useState<string>('all');
  const [revitalizeRegistrantFilter, setRevitalizeRegistrantFilter] = useState<string>('');
  const [revitalizeLandNameFilter, setRevitalizeLandNameFilter] = useState<string>('');
  const [revitalizeLesseeFilter, setRevitalizeLesseeFilter] = useState<string>('');
  const [revitalizeDateFilter, setRevitalizeDateFilter] = useState<string>('');
  const [revitalizePage, setRevitalizePage] = useState<number>(1);
  const [revitalizePageSize] = useState<number>(10);

  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState<boolean>(false);
  const [editingLease, setEditingLease] = useState<RevitalizeLeaseRecord | null>(null);
  const [selectedLeaseDetail, setSelectedLeaseDetail] = useState<RevitalizeLeaseRecord | null>(null);
  const [leaseForm, setLeaseForm] = useState<Partial<RevitalizeLeaseRecord>>({
    region: '',
    landName: '',
    areaMu: undefined,
    registrantName: '',
    lesseeName: '',
    lesseePhone: '',
    leaseTermYears: undefined,
    leasePrice: undefined,
    dealDate: '',
    socialIncome: undefined,
    leaseUsage: '',
    remarks: '',
  });

  const filteredRevitalizeLeases = useMemo(() => {
    return revitalizeLeases
      .filter((item) => {
        if (revitalizeDistrictFilter !== 'all' && !item.region.includes(revitalizeDistrictFilter)) return false;
        if (revitalizeRegistrantFilter && !item.registrantName.toLowerCase().includes(revitalizeRegistrantFilter.toLowerCase())) return false;
        if (revitalizeLandNameFilter && !item.landName.toLowerCase().includes(revitalizeLandNameFilter.toLowerCase())) return false;
        if (revitalizeLesseeFilter && !item.lesseeName.toLowerCase().includes(revitalizeLesseeFilter.toLowerCase())) return false;
        if (revitalizeDateFilter && !item.dealDate.includes(revitalizeDateFilter)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.dealDate).getTime() - new Date(a.dealDate).getTime());
  }, [revitalizeLeases, revitalizeDistrictFilter, revitalizeRegistrantFilter, revitalizeLandNameFilter, revitalizeLesseeFilter, revitalizeDateFilter]);

  const totalRevitalizePages = Math.max(1, Math.ceil(filteredRevitalizeLeases.length / revitalizePageSize));
  const displayedRevitalizeLeases = useMemo(() => {
    const start = (revitalizePage - 1) * revitalizePageSize;
    return filteredRevitalizeLeases.slice(start, start + revitalizePageSize);
  }, [filteredRevitalizeLeases, revitalizePage, revitalizePageSize]);

  const handleOpenAddLease = () => {
    setEditingLease(null);
    setLeaseForm({
      region: '',
      landName: '',
      areaMu: undefined,
      registrantName: '',
      lesseeName: '',
      lesseePhone: '',
      leaseTermYears: undefined,
      leasePrice: undefined,
      dealDate: '',
      socialIncome: undefined,
      leaseUsage: '',
      remarks: '',
    });
    setIsLeaseModalOpen(true);
  };

  const handleOpenEditLease = (item: RevitalizeLeaseRecord) => {
    setEditingLease(item);
    setLeaseForm({
      region: item.region,
      landName: item.landName,
      areaMu: item.areaMu,
      registrantName: item.registrantName,
      lesseeName: item.lesseeName,
      lesseePhone: item.lesseePhone || '18965362225',
      leaseTermYears: item.leaseTermYears,
      leasePrice: item.leasePrice,
      dealDate: item.dealDate,
      socialIncome: item.socialIncome,
      leaseUsage: item.leaseUsage || item.remarks || '',
      remarks: item.remarks || '',
    });
    setIsLeaseModalOpen(true);
  };

  const handleSaveLease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaseForm.landName?.trim()) {
      triggerToast('请选择登记的闲荒地');
      return;
    }
    if (!leaseForm.region?.trim()) {
      triggerToast('请选择所属行政区划');
      return;
    }
    if (!leaseForm.lesseeName?.trim()) {
      triggerToast('请输入租借方名称');
      return;
    }
    if (!leaseForm.lesseePhone?.trim()) {
      triggerToast('请输入租借方联系电话');
      return;
    }
    if (!leaseForm.areaMu || Number(leaseForm.areaMu) <= 0) {
      triggerToast('请输入租借面积');
      return;
    }
    if (!leaseForm.leasePrice || Number(leaseForm.leasePrice) <= 0) {
      triggerToast('请输入租借价格');
      return;
    }
    if (!leaseForm.leaseTermYears || Number(leaseForm.leaseTermYears) <= 0) {
      triggerToast('请输入租借年限');
      return;
    }
    if (!leaseForm.dealDate?.trim()) {
      triggerToast('请输入交易时间');
      return;
    }

    const area = Number(leaseForm.areaMu) || 100;
    const term = Number(leaseForm.leaseTermYears) || 20;
    const price = Number(leaseForm.leasePrice) || 500;
    const income = Number(leaseForm.socialIncome) || (area * price * Math.min(term, 10));

    // Find matched idle land registrant name if available
    const matchedLand = idleLands.find((l) => l.parcelName === leaseForm.landName);
    const registrant = matchedLand?.registrantName || leaseForm.registrantName || '村集体经济合作社';

    if (editingLease) {
      setRevitalizeLeases((prev) =>
        prev.map((r) =>
          r.id === editingLease.id
            ? {
                ...r,
                region: leaseForm.region || r.region,
                landName: leaseForm.landName!.trim(),
                areaMu: area,
                registrantName: registrant,
                lesseeName: leaseForm.lesseeName!.trim(),
                lesseePhone: leaseForm.lesseePhone?.trim(),
                leaseTermYears: term,
                leasePrice: price,
                dealDate: leaseForm.dealDate || r.dealDate,
                socialIncome: income,
                leaseUsage: leaseForm.leaseUsage?.trim() || r.leaseUsage,
                remarks: leaseForm.leaseUsage?.trim() || leaseForm.remarks || r.remarks,
              }
            : r
        )
      );
      triggerToast(`已成功更新地块「${leaseForm.landName}」租借记录！`);
    } else {
      const newLease: RevitalizeLeaseRecord = {
        id: `rev-${Date.now()}`,
        region: leaseForm.region || '合肥市 肥西县',
        landName: leaseForm.landName.trim(),
        areaMu: area,
        registrantName: registrant,
        lesseeName: leaseForm.lesseeName.trim(),
        lesseePhone: leaseForm.lesseePhone?.trim() || '18965362225',
        leaseTermYears: term,
        leasePrice: price,
        dealDate: leaseForm.dealDate?.trim() || '2026-10-27',
        socialIncome: income,
        leaseUsage: leaseForm.leaseUsage?.trim() || '特色生态农业与林下经济融合开发',
        remarks: leaseForm.leaseUsage?.trim() || '生态产业盘活示范，带动作业增收与碳汇固碳双提升。',
      };
      setRevitalizeLeases((prev) => [newLease, ...prev]);
      triggerToast(`已新增地块「${newLease.landName}」租借盘活记录！`);
    }
    setIsLeaseModalOpen(false);
  };

  const handleDeleteLease = (id: string, name: string) => {
    setRevitalizeLeases((prev) => prev.filter((r) => r.id !== id));
    triggerToast(`已成功删除地块「${name}」盘活租借记录！`);
  };

  // 闲荒地列表筛选与排序 (默认按登记日期 registerDate 降序排列 - 近期在先)
  const filteredIdleLands = useMemo(() => {
    return idleLands
      .filter((item) => {
        if (landRegionFilter !== 'all' && !item.region.includes(landRegionFilter)) return false;
        if (landRegistrantFilter && !item.registrantName.toLowerCase().includes(landRegistrantFilter.toLowerCase())) return false;
        if (landNameFilter && !item.parcelName.toLowerCase().includes(landNameFilter.toLowerCase())) return false;
        if (landStatusFilter !== 'all' && item.utilizationStatus !== landStatusFilter) return false;
        if (landDateFilter && !item.registerDate.includes(landDateFilter)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.registerDate).getTime() - new Date(a.registerDate).getTime());
  }, [idleLands, landRegionFilter, landRegistrantFilter, landNameFilter, landStatusFilter, landDateFilter]);

  const totalLandPages = Math.max(1, Math.ceil(filteredIdleLands.length / landPageSize));
  const displayedIdleLands = useMemo(() => {
    const start = (landPage - 1) * landPageSize;
    return filteredIdleLands.slice(start, start + landPageSize);
  }, [filteredIdleLands, landPage, landPageSize]);

  // 打开新增闲荒地登记弹窗 (数据清空)
  const handleOpenAddLandModalCleared = () => {
    setEditingLand(null);
    setLandForm({
      parcelName: '',
      region: '',
      registrantName: '',
      contactPhone: '',
      areaMu: '' as unknown as number,
      location: '',
      expectedPrice: '' as unknown as number,
      leaseTermYears: '' as unknown as number,
      landCondition: '',
      utilizationStatus: '闲置中',
      registerDate: '2026-10-26',
      contactPerson: '',
      remarks: '',
    });
    setIsAddLandModalOpen(true);
  };

  // 打开编辑地块弹窗
  const handleOpenEditLandModal = (item: IdleLandRecord) => {
    setEditingLand(item);
    setLandForm({
      parcelName: item.parcelName,
      region: item.region,
      registrantName: item.registrantName,
      contactPhone: item.contactPhone || '',
      areaMu: item.areaMu,
      location: item.location || item.remarks || '',
      expectedPrice: item.expectedPrice,
      leaseTermYears: item.leaseTermYears,
      landCondition: item.landCondition || '',
      utilizationStatus: item.utilizationStatus,
      registerDate: item.registerDate,
      contactPerson: item.contactPerson || '',
      remarks: item.remarks || '',
    });
    setIsAddLandModalOpen(true);
  };

  // 删除闲荒地登记
  const handleDeleteLand = (id: string, name: string) => {
    setIdleLands((prev) => prev.filter((l) => l.id !== id));
    triggerToast(`已成功移除「${name}」的闲荒地登记记录`);
  };

  // 保存新增/修改地块 (依据截图严格表单校验与提交)
  const handleSaveLandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landForm.parcelName?.trim()) {
      triggerToast('请输入地块名称');
      return;
    }
    if (!landForm.region?.trim()) {
      triggerToast('请选择所属行政区划');
      return;
    }
    if (!landForm.registrantName?.trim()) {
      triggerToast('请输入登记方名称');
      return;
    }
    if (!landForm.contactPhone?.trim()) {
      triggerToast('请输入登记方联系电话');
      return;
    }
    if (!landForm.areaMu || Number(landForm.areaMu) <= 0) {
      triggerToast('请输入有效的地块面积');
      return;
    }
    if (!landForm.location?.trim()) {
      triggerToast('请输入土地坐落');
      return;
    }
    if (landForm.expectedPrice === undefined || landForm.expectedPrice === ('' as unknown as number)) {
      triggerToast('请输入意向价格');
      return;
    }
    if (!landForm.leaseTermYears || Number(landForm.leaseTermYears) <= 0) {
      triggerToast('请输入出借期限');
      return;
    }

    if (editingLand) {
      setIdleLands((prev) =>
        prev.map((item) =>
          item.id === editingLand.id
            ? {
                ...item,
                region: landForm.region!.trim(),
                parcelName: landForm.parcelName!.trim(),
                areaMu: Number(landForm.areaMu),
                registrantName: landForm.registrantName!.trim(),
                contactPhone: landForm.contactPhone!.trim(),
                location: landForm.location!.trim(),
                landCondition: landForm.landCondition || '土地肥沃',
                leaseTermYears: Number(landForm.leaseTermYears),
                expectedPrice: Number(landForm.expectedPrice),
                utilizationStatus: (landForm.utilizationStatus as IdleLandRecord['utilizationStatus']) || item.utilizationStatus,
                registerDate: landForm.registerDate || item.registerDate,
                contactPerson: landForm.contactPerson || item.contactPerson,
                remarks: landForm.landCondition || item.remarks,
              }
            : item
        )
      );
      triggerToast(`闲荒地块「${landForm.parcelName}」信息已成功更新！`);
      setEditingLand(null);
    } else {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const defaultTodayDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

      const newLand: IdleLandRecord = {
        id: `land-${Date.now()}`,
        region: landForm.region.trim(),
        parcelName: landForm.parcelName.trim(),
        areaMu: Number(landForm.areaMu),
        registrantName: landForm.registrantName.trim(),
        contactPhone: landForm.contactPhone.trim(),
        location: landForm.location.trim(),
        expectedPrice: Number(landForm.expectedPrice),
        leaseTermYears: Number(landForm.leaseTermYears),
        landCondition: landForm.landCondition?.trim() || '土地肥沃',
        utilizationStatus: (landForm.utilizationStatus as IdleLandRecord['utilizationStatus']) || '闲置中',
        registerDate: landForm.registerDate || defaultTodayDate,
        contactPerson: landForm.contactPerson || landForm.registrantName.trim(),
        remarks: landForm.landCondition || '通过新增登记平台提报的闲荒地块。',
      };
      setIdleLands((prev) =>
        [newLand, ...prev].sort((a, b) => new Date(b.registerDate).getTime() - new Date(a.registerDate).getTime())
      );
      triggerToast(`新地块「${newLand.parcelName}」登记成功，排在近期首位！`);
    }
    setIsAddLandModalOpen(false);
  };

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Current active news dataset
  const rawList = activeSubTab === 'news_dynamic' ? INITIAL_NEWS_ITEMS : INITIAL_POLICY_ITEMS;

  // Filtered and sorted news list (descending by date)
  const filteredList = useMemo(() => {
    return rawList
      .filter((item) => {
        if (!searchQuery) return true;
        return (
          item.title.includes(searchQuery) ||
          item.excerpt.includes(searchQuery) ||
          item.author.includes(searchQuery)
        );
      })
      .sort((a, b) => new Date(b.fullDate).getTime() - new Date(a.fullDate).getTime());
  }, [rawList, searchQuery]);

  // Filtered and sorted Loan Products (descending by publishDate)
  const filteredLoanProducts = useMemo(() => {
    return loanProducts
      .filter((p) => {
        if (loanBankFilter !== 'all' && !p.bankName.includes(loanBankFilter)) return false;
        if (loanProductNameFilter && !p.productName.toLowerCase().includes(loanProductNameFilter.toLowerCase())) return false;
        if (loanTypeFilter !== 'all' && p.productType !== loanTypeFilter) return false;
        if (loanDateFilter && !p.publishDate.includes(loanDateFilter)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [loanProducts, loanBankFilter, loanProductNameFilter, loanTypeFilter, loanDateFilter]);

  const totalLoanPages = Math.max(1, Math.ceil(filteredLoanProducts.length / loanPageSize));
  const displayedLoanProducts = useMemo(() => {
    const start = (loanPage - 1) * loanPageSize;
    return filteredLoanProducts.slice(start, start + loanPageSize);
  }, [filteredLoanProducts, loanPage, loanPageSize]);

  // Filtered and sorted Loan Applications (descending by applyDate)
  const filteredLoanApplications = useMemo(() => {
    return loanApplications
      .filter((app) => {
        if (appRegionFilter !== 'all' && app.region !== appRegionFilter) return false;
        if (appCompanyFilter && !app.companyName.toLowerCase().includes(appCompanyFilter.toLowerCase())) return false;
        if (appProductFilter && !app.productName.toLowerCase().includes(appProductFilter.toLowerCase())) return false;
        if (appDateFilter && !app.applyDate.includes(appDateFilter)) return false;
        if (appRepayMethodFilter !== 'all' && app.repaymentMethod !== appRepayMethodFilter) return false;
        if (appStatusFilter !== 'all' && app.status !== appStatusFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime());
  }, [loanApplications, appRegionFilter, appCompanyFilter, appProductFilter, appDateFilter, appRepayMethodFilter, appStatusFilter]);

  const totalAppPages = Math.max(1, Math.ceil(filteredLoanApplications.length / appPageSize));
  const displayedLoanApplications = useMemo(() => {
    const start = (appPage - 1) * appPageSize;
    return filteredLoanApplications.slice(start, start + appPageSize);
  }, [filteredLoanApplications, appPage, appPageSize]);

  // Open Add Application Modal with CLEARED data
  const handleOpenAddAppModalCleared = () => {
    setEditingApplication(null);
    setAppForm({
      region: '肥西县',
      companyName: '',
      creditCode: '',
      legalPerson: '',
      legalPersonId: '',
      productName: '林业碳汇贷',
      bankName: 'XXXXX银行',
      applyAmount: '' as unknown as number,
      loanTermYears: '' as unknown as number,
      status: '待审核',
      applyDate: '',
      disbursedAmount: 0,
      repaymentMethod: '等额本金',
      contactPerson: '',
      contactPhone: '',
      pledgeCarbonVolume: '' as unknown as number,
      attachmentName: '',
      description: '',
    });
    setIsAddAppModalOpen(true);
  };

  // Delete Loan Application
  const handleDeleteApplication = (id: string, company: string) => {
    setLoanApplications((prev) => prev.filter((a) => a.id !== id));
    triggerToast(`已成功移除「${company}」的申贷记录`);
  };

  // Save Loan Application (Create / Update)
  const handleSaveApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appForm.companyName?.trim()) {
      triggerToast('请填写申贷企业名称');
      return;
    }

    if (editingApplication) {
      setLoanApplications((prev) =>
        prev.map((item) =>
          item.id === editingApplication.id
            ? { ...item, ...(appForm as LoanServiceApplication) }
            : item
        )
      );
      triggerToast(`申贷记录「${appForm.companyName}」更新成功！`);
      setEditingApplication(null);
    } else {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const defaultTodayDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

      const newApp: LoanServiceApplication = {
        id: `app-${Date.now()}`,
        region: appForm.region || '肥西县',
        companyName: appForm.companyName.trim(),
        creditCode: appForm.creditCode || '91340100MA2T****88',
        legalPerson: appForm.legalPerson || '张建国',
        legalPersonId: appForm.legalPersonId || '3401231980****1234',
        productName: appForm.productName || '林业碳汇贷',
        bankName: appForm.bankName || 'XXXXX银行',
        applyAmount: Number(appForm.applyAmount) || 1000000,
        loanTermYears: Number(appForm.loanTermYears) || 5,
        status: (appForm.status as LoanServiceApplication['status']) || '待审核',
        applyDate: appForm.applyDate || defaultTodayDate,
        disbursedAmount: Number(appForm.disbursedAmount) || 0,
        repaymentMethod: appForm.repaymentMethod || '等额本金',
        contactPerson: appForm.legalPerson || '张建国',
        contactPhone: appForm.contactPhone || '138****5678',
        attachmentName: appForm.attachmentName || '项目资料.pdf',
        description: appForm.description || '线上提报申贷。',
      };
      setLoanApplications((prev) => [newApp, ...prev]);
      triggerToast(`已成功为「${newApp.companyName}」提交新增申贷，排在近期首位！`);
    }
    setIsAddAppModalOpen(false);
  };

  // Action Handlers: 审核 / 放款 / 结清
  const handleOpenAuditModal = (item: LoanServiceApplication) => {
    setAuditingApp(item);
    setAuditChoice('审批通过');
    setAuditNote('');
    setAuditFile(null);
  };

  const handleConfirmAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditingApp) return;
    setLoanApplications((prev) =>
      prev.map((a) => (a.id === auditingApp.id ? { ...a, status: auditChoice } : a))
    );
    triggerToast(`已完成企业「${auditingApp.companyName}」的申贷审核，状态已更新为【${auditChoice}】！`);
    setAuditingApp(null);
  };

  const handleOpenDisburseModal = (item: LoanServiceApplication) => {
    setDisbursingApp(item);
    setDisburseBank(item.bankName || '徽商银行合肥分行');
    setDisburseAccount('6222 0212 0900 1888 666');
    setDisburseAmountInput(item.applyAmount ? (item.applyAmount / 10000).toFixed(0) : '100');
    setDisburseDate('2026-10-18');
    setDisburseNote('放款资金已原路划拨至企业碳金融专项账户，质押手续已办理完成。');
    setDisburseFile(null);
  };

  const handleConfirmDisburseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disbursingApp) return;
    const inputVal = Number(disburseAmountInput) || 100;
    const numAmt = inputVal < 10000 ? inputVal * 10000 : inputVal;
    setLoanApplications((prev) =>
      prev.map((a) =>
        a.id === disbursingApp.id
          ? { ...a, status: '已放款', disbursedAmount: numAmt }
          : a
      )
    );
    triggerToast(`已成功为「${disbursingApp.companyName}」办理放款！放款金额：${(numAmt / 10000).toFixed(0)}万元！`);
    setDisbursingApp(null);
  };

  const handleOpenSettleModal = (item: LoanServiceApplication) => {
    setSettlingApp(item);
    setSettleNote('本金与利息已全额结清，质押的林业碳汇资产顺利解除登记。');
  };

  const handleConfirmSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlingApp) return;
    setLoanApplications((prev) =>
      prev.map((a) => (a.id === settlingApp.id ? { ...a, status: '已结清' } : a))
    );
    triggerToast(`申贷记录「${settlingApp.companyName}」已成功办理结清，状态已更新为【已结清】！`);
    setSettlingApp(null);
  };

  // Open Add Loan Modal with COMPLETELY CLEARED data
  const handleOpenAddModalCleared = () => {
    setEditingLoanProduct(null);
    setLoanForm({
      bankName: '',
      productName: '',
      productType: '',
      interestRate: '' as unknown as number,
      loanTermYears: '' as unknown as number,
      maxLoanAmount: '' as unknown as number,
      disbursedAmount: 0,
      repaymentMethod: '',
      publishDate: '',
      description: '',
    });
    setIsAddLoanModalOpen(true);
  };

  // Delete loan product handler
  const handleDeleteLoanProduct = (id: string, name: string) => {
    setLoanProducts((prev) => prev.filter((p) => p.id !== id));
    triggerToast(`已成功下架并删除贷款产品「${name}」`);
  };

  // Save Loan Product (Create / Update)
  const handleSaveLoanProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanForm.productName?.trim() || !loanForm.bankName?.trim()) {
      triggerToast('请完整填写金融机构名称与贷款产品名称');
      return;
    }

    if (editingLoanProduct) {
      setLoanProducts((prev) =>
        prev.map((item) =>
          item.id === editingLoanProduct.id
            ? { ...item, ...(loanForm as LoanProduct) }
            : item
        )
      );
      triggerToast(`贷款产品「${loanForm.productName}」更新成功！`);
      setEditingLoanProduct(null);
    } else {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const defaultTodayDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

      const newProduct: LoanProduct = {
        id: `lp-${Date.now()}`,
        bankName: loanForm.bankName.trim(),
        productName: loanForm.productName.trim(),
        productType: loanForm.productType || '质押贷',
        interestRate: Number(loanForm.interestRate) || 3.85,
        loanTermYears: Number(loanForm.loanTermYears) || 10,
        maxLoanAmount: Number(loanForm.maxLoanAmount) || 10000000,
        disbursedAmount: Number(loanForm.disbursedAmount) || 0,
        repaymentMethod: loanForm.repaymentMethod || '等额本金',
        publishDate: loanForm.publishDate || defaultTodayDate,
        description: loanForm.description || '林业碳汇生态资产专属支持信贷产品。',
      };
      setLoanProducts((prev) => [newProduct, ...prev]);
      triggerToast(`新贷款产品「${newProduct.productName}」添加成功，已清空表单并排在近期首位！`);
    }
    setIsAddLoanModalOpen(false);
  };

  // Confirm Batch Import Execution
  const handleConfirmBatchImport = () => {
    if (selectedImportIds.length === 0) {
      triggerToast('请勾选至少一条待导入的贷款产品数据');
      return;
    }

    const itemsToImport = importPreviewList.filter((item) => selectedImportIds.includes(item.id));
    
    // Assign fresh IDs to imported records
    const newImportedRecords: LoanProduct[] = itemsToImport.map((item, index) => ({
      ...item,
      id: `lp-imported-${Date.now()}-${index}`,
    }));

    setLoanProducts((prev) => {
      const combined = [...newImportedRecords, ...prev];
      return combined.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    });

    setIsBatchImportModalOpen(false);
    triggerToast(`已成功批量导入 ${newImportedRecords.length} 条贷款产品！按近期时间降序合并入库。`);
  };

  // Select/Unselect All Import Items
  const handleToggleSelectAllImport = (checked: boolean) => {
    if (checked) {
      setSelectedImportIds(importPreviewList.map((i) => i.id));
    } else {
      setSelectedImportIds([]);
    }
  };

  // Delete Selected Items from Import Preview List
  const handleDeleteSelectedImportItems = () => {
    if (selectedImportIds.length === 0) {
      triggerToast('请先勾选需要删除的批量导入项');
      return;
    }
    const count = selectedImportIds.length;
    setImportPreviewList((prev) => prev.filter((item) => !selectedImportIds.includes(item.id)));
    setSelectedImportIds([]);
    triggerToast(`已成功从导入列表中删除选中的 ${count} 条数据！`);
  };

  // Delete Single Item from Import Preview List
  const handleDeleteSingleImportItem = (id: string, name: string) => {
    setImportPreviewList((prev) => prev.filter((item) => item.id !== id));
    setSelectedImportIds((prev) => prev.filter((iId) => iId !== id));
    triggerToast(`已从导入预览列表中移除「${name}」`);
  };

  return (
    <div className="min-h-screen bg-[#040e09] text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Dynamic Background Cyber Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12)_0%,rgba(5,25,18,0.08)_50%,transparent_80%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Floating Notification Toast */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-emerald-950/95 border border-emerald-500/80 rounded-xl text-xs text-emerald-200 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Main Navigation Header Bar */}
      <header className="relative z-20 h-16 px-6 lg:px-8 bg-gradient-to-b from-[#031c12] via-[#051f15] to-[#03150e]/95 border-b border-emerald-800/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackToPortal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 hover:text-white transition-colors text-xs font-medium cursor-pointer"
            title="返回系统功能中枢大厅"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回中枢</span>
          </button>

          <div className="h-5 w-px bg-emerald-800/60" />

          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg lg:text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                碳汇金融服务系统
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/90 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>绿色金融与质押支持</span>
              </span>
            </div>
            <div className="text-[9px] font-mono text-emerald-500/80 tracking-widest uppercase">
              CARBON SINK FINANCIAL SERVICES & LOAN REGISTRY
            </div>
          </div>
        </div>

        {/* Right Operator Info */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">当前操作员:</span>
            <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              {username || 'admin'} (超级管理员)
            </span>
          </div>
        </div>
      </header>

      {/* Sub-Navigation Tabs Bar */}
      <div className="relative z-20 bg-[#051a11]/90 border-b border-emerald-900/60 px-6 lg:px-8 py-2.5 backdrop-blur-md flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTopTab('news');
              triggerToast('已切换至碳汇资讯板块');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTopTab === 'news'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>碳汇资讯</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTopTab('loan');
              triggerToast('已切换至贷款管理板块');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTopTab === 'loan'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>贷款管理</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTopTab('insurance');
              triggerToast('已切换至保险管理板块');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTopTab === 'insurance'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>保险管理</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTopTab('income');
              triggerToast('已切换至增收管理板块');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTopTab === 'income'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>增收管理</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER PAGE */}
      <main className="relative z-10 flex-1 p-4 lg:p-6 max-w-[1720px] mx-auto w-full flex flex-col md:flex-row gap-6">
        {/* TAB CONTENT 1: 碳汇资讯 */}
        {activeTopTab === 'news' && (
          <>
            {/* Left Submenu Sidebar */}
            <aside className="w-full md:w-56 shrink-0 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md p-4 self-start space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-emerald-900/60 text-xs font-bold text-white">
                <Filter className="w-4 h-4 text-emerald-400" />
                <span>资讯分类与检索</span>
              </div>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubTab('news_dynamic');
                    setCurrentPage(1);
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeSubTab === 'news_dynamic'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-300 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeSubTab === 'news_dynamic' ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span>新闻动态</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSubTab('policy');
                    setCurrentPage(1);
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeSubTab === 'policy'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-300 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeSubTab === 'policy' ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span>政策法规</span>
                </button>
              </div>

              {/* Quick Search */}
              <div className="pt-2 border-t border-emerald-900/60">
                <label className="block text-[11px] text-slate-400 mb-1.5 font-medium">关键字检索</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索标题/关键字..."
                    className="w-full pl-8 pr-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-slate-200 text-xs outline-none focus:border-emerald-500 transition-colors"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </aside>

            {/* Right Main News List Container */}
            <section className="flex-1 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col justify-between min-h-[620px] backdrop-blur-md text-slate-100 space-y-6">
              <div className="space-y-5">
                <div className="pb-4 border-b border-emerald-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                    <span className="text-sm font-bold text-white tracking-wide">碳汇资讯列表</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    共检索到 <strong className="text-emerald-400 font-bold">{filteredList.length}</strong> 条资讯 (按近期降序)
                  </div>
                </div>

                {filteredList.length === 0 ? (
                  <div className="py-20 text-center text-slate-500 text-xs font-mono">
                    暂无符合搜索条件的碳汇资讯记录
                  </div>
                ) : (
                  filteredList.map((item) => (
                    <article
                      key={item.id}
                      onClick={() => setSelectedArticle(item)}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-emerald-950/80 last:border-0 last:pb-0 cursor-pointer transition-all hover:bg-emerald-950/30 p-3 rounded-2xl"
                    >
                      {/* Left Cover Image */}
                      <div className="w-full sm:w-56 h-36 rounded-xl overflow-hidden shrink-0 border border-emerald-900/80 shadow-md bg-slate-900 relative">
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                          loading="lazy"
                        />
                      </div>

                      {/* Middle Content Details */}
                      <div className="flex-1 min-w-0 pr-0 sm:pr-4">
                        <h2 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1 mb-2 tracking-tight">
                          {item.title}
                        </h2>
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-3 font-sans">
                          {item.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
                          <span>来源: {item.author}</span>
                          <span>浏览量: {item.views}</span>
                        </div>
                      </div>

                      {/* Right Date Badge Block */}
                      <div className="sm:w-24 shrink-0 text-right sm:text-right flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-950">
                        <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight group-hover:text-emerald-300 transition-colors">
                          {item.day}
                        </div>
                        <div className="text-xs font-bold text-teal-400 font-mono mt-0 sm:mt-1">
                          {item.yearMonth}
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>

              {/* Bottom Pagination Bar */}
              <div className="pt-6 border-t border-emerald-900/60 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                >
                  &lt;
                </button>

                {[1, 2, 3, 4, 5].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      currentPage === p
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <span className="px-1 text-slate-600">...</span>

                <button
                  type="button"
                  onClick={() => setCurrentPage(20)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    currentPage === 20
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  20
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(20, prev + 1))}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  &gt;
                </button>

                <div className="flex items-center gap-1.5 ml-3 text-slate-400">
                  <span>跳转</span>
                  <input
                    type="text"
                    value={jumpPage}
                    onChange={(e) => setJumpPage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const pageNum = Number(jumpPage);
                        if (pageNum >= 1 && pageNum <= 20) {
                          setCurrentPage(pageNum);
                          triggerToast(`已跳转至第 ${pageNum} 页`);
                        }
                      }
                    }}
                    className="w-12 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-center text-slate-200 outline-none focus:border-emerald-500 font-mono text-xs"
                  />
                  <span>页</span>
                </div>
              </div>
            </section>
          </>
        )}

        {/* TAB CONTENT 2: 贷款管理 */}
        {activeTopTab === 'loan' && (
          <>
            {/* Left Submenu Sidebar */}
            <aside className="w-full md:w-56 shrink-0 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md p-4 self-start space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-emerald-900/60 text-xs font-bold text-white">
                <Coins className="w-4 h-4 text-emerald-400" />
                <span>贷款业务子菜单</span>
              </div>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveLoanSubTab('loan_product');
                    setLoanPage(1);
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeLoanSubTab === 'loan_product'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-300 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeLoanSubTab === 'loan_product' ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span>贷款产品</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveLoanSubTab('loan_service');
                    triggerToast('已切换至贷款服务申请与跟进板块');
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeLoanSubTab === 'loan_service'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-300 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeLoanSubTab === 'loan_service' ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span>贷款服务</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveLoanSubTab('loan_stats');
                    triggerToast('已切换至贷款统计仪表盘');
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeLoanSubTab === 'loan_stats'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-300 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeLoanSubTab === 'loan_stats' ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span>贷款统计</span>
                </button>
              </div>
            </aside>

            {/* Right Main Content Panel */}
            <section className="flex-1 space-y-5">
              {activeLoanSubTab === 'loan_product' && (
                <>
                  {/* CARD 1: 筛选搜索 */}
                  <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-emerald-950">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-white tracking-wide">筛选搜索</span>
                        <span className="text-xs text-slate-500">|</span>
                        <span className="text-xs text-emerald-400/90 font-mono">
                          发布日期默认按近期降序排列
                        </span>
                      </div>

                      {/* Top Right Buttons: 搜索, 重置 */}
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => triggerToast('已根据条件精准检索贷款产品')}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>搜索</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLoanBankFilter('all');
                            setLoanProductNameFilter('');
                            setLoanTypeFilter('all');
                            setLoanDateFilter('');
                            setLoanPage(1);
                            triggerToast('已重置筛选条件');
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>重置</span>
                        </button>
                      </div>
                    </div>

                    {/* Form Input Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                      {/* 所属金融机构 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">所属金融机构</label>
                        <select
                          value={loanBankFilter}
                          onChange={(e) => {
                            setLoanBankFilter(e.target.value);
                            setLoanPage(1);
                          }}
                          className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="all">请选择</option>
                          <option value="农业银行">中国农业银行合肥分行</option>
                          <option value="徽商银行">徽商银行合肥分行</option>
                          <option value="国家开发银行">国家开发银行安徽省分行</option>
                          <option value="工商银行">中国工商银行合肥高新支行</option>
                          <option value="邮政储蓄银行">中国邮政储蓄银行肥西县支行</option>
                          <option value="兴业银行">兴业银行合肥分行</option>
                          <option value="招商银行">招商银行合肥蜀山支行</option>
                          <option value="农村商业银行">安徽农村商业银行肥东支行</option>
                          <option value="建设银行">中国建设银行合肥庐阳支行</option>
                          <option value="浦发银行">浦发银行合肥分行</option>
                        </select>
                      </div>

                      {/* 贷款产品 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">贷款产品</label>
                        <input
                          type="text"
                          placeholder="请输入产品关键字"
                          value={loanProductNameFilter}
                          onChange={(e) => {
                            setLoanProductNameFilter(e.target.value);
                            setLoanPage(1);
                          }}
                          className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* 产品类型 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">产品类型</label>
                        <select
                          value={loanTypeFilter}
                          onChange={(e) => {
                            setLoanTypeFilter(e.target.value);
                            setLoanPage(1);
                          }}
                          className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="all">请选择</option>
                          <option value="质押贷">质押贷</option>
                          <option value="信用贷">信用贷</option>
                          <option value="抵押贷">抵押贷</option>
                        </select>
                      </div>

                      {/* 发布日期 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">发布日期</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="请选择日期范围"
                            value={loanDateFilter}
                            onChange={(e) => {
                              setLoanDateFilter(e.target.value);
                              setLoanPage(1);
                            }}
                            className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 pr-8"
                          />
                          <Calendar className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Row: 新增 (数据完全清空), 批量导入 (独立可操作页面/弹窗) */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleOpenAddModalCleared}
                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>新增</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFileName('');
                          setSelectedImportIds(DEFAULT_BATCH_IMPORT_TEMPLATES.map((t) => t.id));
                          setIsBatchImportModalOpen(true);
                        }}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>批量导入</span>
                      </button>
                    </div>
                  </div>

                  {/* CARD 2: 数据列表 */}
                  <div className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
                    <div className="px-5 py-3.5 border-b border-emerald-900/60 flex items-center justify-between bg-slate-900/60">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                        <span className="text-sm font-bold text-white tracking-wide">数据列表</span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        共检索到 <strong className="text-emerald-400 font-bold">{filteredLoanProducts.length}</strong> 条贷款产品记录 (按发布日期近期降序)
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-emerald-900/60 bg-slate-900/80 text-slate-400 font-medium">
                            <th className="py-3.5 px-4 w-12 text-center">序号</th>
                            <th className="py-3.5 px-4 min-w-[150px]">所属金融机构</th>
                            <th className="py-3.5 px-4 min-w-[200px]">贷款产品</th>
                            <th className="py-3.5 px-4 text-center min-w-[90px]">产品类型</th>
                            <th className="py-3.5 px-4 text-right min-w-[110px]">贷款利率(%)</th>
                            <th className="py-3.5 px-4 text-center min-w-[100px]">贷款期限(年)</th>
                            <th className="py-3.5 px-4 text-right min-w-[130px]">最大贷款金额(元)</th>
                            <th className="py-3.5 px-4 text-right min-w-[130px]">已放款金额(元)</th>
                            <th className="py-3.5 px-4 text-center min-w-[110px]">还款方式</th>
                            <th className="py-3.5 px-4 text-center min-w-[110px]">发布日期</th>
                            <th className="py-3.5 px-4 text-center min-w-[110px]">操作</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-emerald-950/60">
                          {displayedLoanProducts.length === 0 ? (
                            <tr>
                              <td colSpan={11} className="py-12 text-center text-slate-500">
                                暂无符合条件的贷款产品记录
                              </td>
                            </tr>
                          ) : (
                            displayedLoanProducts.map((item, idx) => {
                              const serialNo = (loanPage - 1) * loanPageSize + idx + 1;
                              return (
                                <tr key={item.id} className="hover:bg-emerald-950/40 transition-colors text-slate-200">
                                  <td className="py-3.5 px-4 text-center font-mono text-slate-500">{serialNo}</td>
                                  <td className="py-3.5 px-4 text-slate-300 font-medium">{item.bankName}</td>
                                  <td className="py-3.5 px-4">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedLoanProduct(item)}
                                      className="text-emerald-400 hover:text-emerald-300 hover:underline text-left font-medium cursor-pointer"
                                    >
                                      {item.productName}
                                    </button>
                                  </td>
                                  <td className="py-3.5 px-4 text-center">
                                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                                      {item.productType}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 text-right font-mono font-bold text-teal-300">
                                    {item.interestRate.toFixed(2)}%
                                  </td>
                                  <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.loanTermYears}</td>
                                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                                    {item.maxLoanAmount.toLocaleString()}
                                  </td>
                                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                                    {item.disbursedAmount.toLocaleString()}
                                  </td>
                                  <td className="py-3.5 px-4 text-center text-slate-300">{item.repaymentMethod}</td>
                                  <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                                    {item.publishDate}
                                  </td>
                                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingLoanProduct(item);
                                          setLoanForm(item);
                                          setIsAddLoanModalOpen(true);
                                        }}
                                        className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium cursor-pointer"
                                      >
                                        编辑
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteLoanProduct(item.id, item.productName)}
                                        className="text-rose-400 hover:text-rose-300 hover:underline font-medium cursor-pointer"
                                      >
                                        删除
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Bottom Pagination Bar */}
                    <div className="px-6 py-4 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span>共 <strong className="text-emerald-400 font-mono font-bold">{filteredLoanProducts.length}</strong> 条数据</span>
                        <span className="text-slate-700">|</span>
                        <div className="flex items-center gap-1.5">
                          <span>每页</span>
                          <select
                            value={loanPageSize}
                            onChange={(e) => {
                              setLoanPageSize(Number(e.target.value));
                              setLoanPage(1);
                            }}
                            className="px-2 py-0.5 bg-slate-900 border border-emerald-900/80 rounded text-slate-200 outline-none font-mono cursor-pointer"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </select>
                          <span>条</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 font-mono">
                        <button
                          type="button"
                          disabled={loanPage <= 1}
                          onClick={() => setLoanPage((prev) => Math.max(1, prev - 1))}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                        >
                          &lt;
                        </button>
                        {[1, 2, 3, 4, 5].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setLoanPage(p)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              loanPage === p
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <span className="px-1 text-slate-600">...</span>
                        <button
                          type="button"
                          onClick={() => setLoanPage(totalLoanPages)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            loanPage === totalLoanPages
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {totalLoanPages}
                        </button>
                        <button
                          type="button"
                          disabled={loanPage >= totalLoanPages}
                          onClick={() => setLoanPage((prev) => Math.min(totalLoanPages, prev + 1))}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                        >
                          &gt;
                        </button>
                        <div className="flex items-center gap-1.5 ml-3">
                          <span>跳转</span>
                          <input
                            type="number"
                            min={1}
                            max={totalLoanPages}
                            placeholder=""
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const val = Number((e.target as HTMLInputElement).value);
                                if (val >= 1 && val <= totalLoanPages) {
                                  setLoanPage(val);
                                  triggerToast(`已跳转至第 ${val} 页`);
                                }
                              }
                            }}
                            className="w-12 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-center text-slate-200 outline-none"
                          />
                          <span>页</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Loan Service Tab (贷款服务页面 - 高保真样式与日期近期降序) */}
              {activeLoanSubTab === 'loan_service' && (
                <>
                  {/* CARD 1: 筛选搜索 */}
                  <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-emerald-950">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-white tracking-wide">筛选搜索</span>
                        <span className="text-xs text-slate-500">|</span>
                        <span className="text-xs text-emerald-400/90 font-mono">
                          申贷时间默认按近期降序排列
                        </span>
                      </div>

                      {/* Top Right Buttons: 搜索, 重置 */}
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => triggerToast('已根据条件精准检索申贷记录')}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>搜索</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAppRegionFilter('all');
                            setAppCompanyFilter('');
                            setAppProductFilter('');
                            setAppDateFilter('');
                            setAppRepayMethodFilter('all');
                            setAppStatusFilter('all');
                            setAppPage(1);
                            triggerToast('已重置筛选条件');
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>重置</span>
                        </button>
                      </div>
                    </div>

                    {/* Form Input Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                      {/* 所属行政区划 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">所属行政区划</label>
                        <select
                          value={appRegionFilter}
                          onChange={(e) => {
                            setAppRegionFilter(e.target.value);
                            setAppPage(1);
                          }}
                          className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="all">请选择</option>
                          <option value="肥西县">肥西县</option>
                          <option value="肥东县">肥东县</option>
                          <option value="长丰县">长丰县</option>
                          <option value="庐江县">庐江县</option>
                          <option value="巢湖市">巢湖市</option>
                          <option value="蜀山区">蜀山区</option>
                          <option value="包河区">包河区</option>
                          <option value="庐阳区">庐阳区</option>
                          <option value="瑶海区">瑶海区</option>
                          <option value="高新区">高新区</option>
                        </select>
                      </div>

                      {/* 申贷企业 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">申贷企业</label>
                        <input
                          type="text"
                          placeholder="请输入企业名称"
                          value={appCompanyFilter}
                          onChange={(e) => {
                            setAppCompanyFilter(e.target.value);
                            setAppPage(1);
                          }}
                          className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* 贷款产品 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">贷款产品</label>
                        <input
                          type="text"
                          placeholder="请输入产品关键字"
                          value={appProductFilter}
                          onChange={(e) => {
                            setAppProductFilter(e.target.value);
                            setAppPage(1);
                          }}
                          className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* 申请日期 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">申请日期</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="请选择日期范围"
                            value={appDateFilter}
                            onChange={(e) => {
                              setAppDateFilter(e.target.value);
                              setAppPage(1);
                            }}
                            className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 pr-8 font-mono"
                          />
                          <Calendar className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* 还款方式 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">还款方式</label>
                        <select
                          value={appRepayMethodFilter}
                          onChange={(e) => {
                            setAppRepayMethodFilter(e.target.value);
                            setAppPage(1);
                          }}
                          className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="all">请选择</option>
                          <option value="等额本金">等额本金</option>
                          <option value="等额本息">等额本息</option>
                          <option value="先息后本">先息后本</option>
                          <option value="按期还本付息">按期还本付息</option>
                          <option value="一次性还本付息">一次性还本付息</option>
                        </select>
                      </div>

                      {/* 申贷状态 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">申贷状态</label>
                        <select
                          value={appStatusFilter}
                          onChange={(e) => {
                            setAppStatusFilter(e.target.value);
                            setAppPage(1);
                          }}
                          className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="all">请选择</option>
                          <option value="待审核">待审核</option>
                          <option value="审核中">审核中</option>
                          <option value="审批通过">审批通过</option>
                          <option value="已放款">已放款</option>
                          <option value="已结清">已结清</option>
                          <option value="已驳回">已驳回</option>
                        </select>
                      </div>
                    </div>

                    {/* Bottom Action Row: 新增申贷 */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={handleOpenAddAppModalCleared}
                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>新增申贷</span>
                      </button>

                      <div className="text-xs text-slate-400 font-mono">
                        全区商业银行实时在线协同审批授信
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: 数据列表 */}
                  <div className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
                    <div className="px-5 py-3.5 border-b border-emerald-900/60 flex items-center justify-between bg-slate-900/60">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                        <span className="text-sm font-bold text-white tracking-wide">数据列表</span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        共检索到 <strong className="text-emerald-400 font-bold">{filteredLoanApplications.length}</strong> 条申贷服务记录 (按申贷时间近期降序)
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-emerald-900/60 bg-slate-900/80 text-slate-400 font-medium">
                            <th className="py-3.5 px-4 w-12 text-center">序号</th>
                            <th className="py-3.5 px-4 min-w-[110px]">所属行政区划</th>
                            <th className="py-3.5 px-4 min-w-[220px]">申贷企业</th>
                            <th className="py-3.5 px-4 min-w-[200px]">贷款产品</th>
                            <th className="py-3.5 px-4 text-right min-w-[130px]">申贷金额(元)</th>
                            <th className="py-3.5 px-4 text-center min-w-[100px]">贷款年限</th>
                            <th className="py-3.5 px-4 text-center min-w-[100px]">申贷状态</th>
                            <th className="py-3.5 px-4 text-center min-w-[110px]">申贷时间</th>
                            <th className="py-3.5 px-4 text-right min-w-[130px]">已放款金额(元)</th>
                            <th className="py-3.5 px-4 text-center min-w-[120px]">操作</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-emerald-950/60">
                          {displayedLoanApplications.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="py-12 text-center text-slate-500">
                                暂无符合条件的申贷记录
                              </td>
                            </tr>
                          ) : (
                            displayedLoanApplications.map((item, idx) => {
                              const serialNo = (appPage - 1) * appPageSize + idx + 1;
                              return (
                                <tr key={item.id} className="hover:bg-emerald-950/40 transition-colors text-slate-200">
                                  <td className="py-3.5 px-4 text-center font-mono text-slate-500">{serialNo}</td>
                                  <td className="py-3.5 px-4 text-slate-300 font-medium">{item.region}</td>
                                  <td className="py-3.5 px-4">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedApplication(item)}
                                      className="text-emerald-400 hover:text-emerald-300 hover:underline text-left font-medium cursor-pointer"
                                    >
                                      {item.companyName}
                                    </button>
                                  </td>
                                  <td className="py-3.5 px-4 text-slate-300">{item.productName}</td>
                                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                                    {item.applyAmount.toLocaleString()}
                                  </td>
                                  <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.loanTermYears}年</td>
                                  <td className="py-3.5 px-4 text-center">
                                    <span
                                      className={`px-2.5 py-0.5 rounded text-[11px] font-medium inline-block ${
                                        item.status === '已放款'
                                          ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/80'
                                          : item.status === '已结清'
                                          ? 'bg-blue-950/90 text-blue-300 border border-blue-700/80'
                                          : item.status === '审批通过' || item.status === '待放款'
                                          ? 'bg-teal-950/90 text-teal-300 border border-teal-700/80'
                                          : item.status === '审核中' || item.status === '待审核'
                                          ? 'bg-amber-950/90 text-amber-300 border border-amber-700/80'
                                          : item.status === '已驳回'
                                          ? 'bg-rose-950/90 text-rose-300 border border-rose-700/80'
                                          : 'bg-slate-900 text-slate-300 border border-slate-700'
                                      }`}
                                    >
                                      {item.status}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                                    {item.applyDate}
                                  </td>
                                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                                    {item.disbursedAmount > 0 ? item.disbursedAmount.toLocaleString() : '0'}
                                  </td>
                                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2.5 text-xs font-medium">
                                      {/* 查看 (通用操作) */}
                                      <button
                                        type="button"
                                        onClick={() => setSelectedApplication(item)}
                                        className="text-[#00c88c] hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
                                      >
                                        查看
                                      </button>

                                      {/* 待审核 / 审核中 -> 编辑 删除 审核 */}
                                      {(item.status === '待审核' || item.status === '审核中') && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingApplication(item);
                                              setAppForm(item);
                                              setIsAddAppModalOpen(true);
                                            }}
                                            className="text-[#00c88c] hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
                                          >
                                            编辑
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteApplication(item.id, item.companyName)}
                                            className="text-[#00c88c] hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
                                          >
                                            删除
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleOpenAuditModal(item)}
                                            className="text-[#00c88c] hover:text-emerald-300 hover:underline cursor-pointer transition-colors font-bold"
                                          >
                                            审核
                                          </button>
                                        </>
                                      )}

                                      {/* 审批通过 / 待放款 -> 放款 */}
                                      {(item.status === '审批通过' || item.status === '待放款') && (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenDisburseModal(item)}
                                          className="text-[#00c88c] hover:text-emerald-300 hover:underline cursor-pointer transition-colors font-bold"
                                        >
                                          放款
                                        </button>
                                      )}

                                      {/* 已放款 -> 结清 */}
                                      {item.status === '已放款' && (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenSettleModal(item)}
                                          className="text-[#00c88c] hover:text-emerald-300 hover:underline cursor-pointer transition-colors font-bold"
                                        >
                                          结清
                                        </button>
                                      )}

                                      {/* 已结清 / 已驳回 -> 编辑 删除 */}
                                      {(item.status === '已结清' || item.status === '已驳回') && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingApplication(item);
                                              setAppForm(item);
                                              setIsAddAppModalOpen(true);
                                            }}
                                            className="text-[#00c88c] hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
                                          >
                                            编辑
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteApplication(item.id, item.companyName)}
                                            className="text-[#00c88c] hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
                                          >
                                            删除
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Bottom Pagination Bar */}
                    <div className="px-6 py-4 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span>共 <strong className="text-emerald-400 font-mono font-bold">{filteredLoanApplications.length}</strong> 条数据</span>
                        <span className="text-slate-700">|</span>
                        <div className="flex items-center gap-1.5">
                          <span>每页</span>
                          <select
                            value={appPageSize}
                            onChange={(e) => {
                              setAppPageSize(Number(e.target.value));
                              setAppPage(1);
                            }}
                            className="px-2 py-0.5 bg-slate-900 border border-emerald-900/80 rounded text-slate-200 outline-none font-mono cursor-pointer"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </select>
                          <span>条</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 font-mono">
                        <button
                          type="button"
                          disabled={appPage <= 1}
                          onClick={() => setAppPage((prev) => Math.max(1, prev - 1))}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                        >
                          &lt;
                        </button>
                        {[1, 2, 3].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setAppPage(p)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              appPage === p
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <button
                          type="button"
                          disabled={appPage >= totalAppPages}
                          onClick={() => setAppPage((prev) => Math.min(totalAppPages, prev + 1))}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Loan Stats Tab (依据最新截图 100% 还原高保真贷款统计仪表盘) */}
              {activeLoanSubTab === 'loan_stats' && (
                <div className="space-y-6 animate-in fade-in">
                  {/* TOP KPI CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="p-4 bg-[#091126] border border-[#18284c] rounded-xl shadow-lg relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#00c88c]/5 rounded-bl-full pointer-events-none" />
                      <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                        <span>申贷总笔数</span>
                        <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">+18.5%</span>
                      </div>
                      <div className="text-2xl font-extrabold font-mono text-white mt-2 flex items-baseline gap-1">
                        158 <span className="text-xs font-normal text-slate-400">笔</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center justify-between pt-2 border-t border-[#18284c]/60">
                        <span>通过: <strong className="text-emerald-400">98</strong> 笔</span>
                        <span>审核中: <strong className="text-teal-300">32</strong> 笔</span>
                      </div>
                    </div>

                    <div className="p-4 bg-[#091126] border border-[#18284c] rounded-xl shadow-lg relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 rounded-bl-full pointer-events-none" />
                      <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                        <span>申贷总金额</span>
                        <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">+24.2%</span>
                      </div>
                      <div className="text-2xl font-extrabold font-mono text-[#00c88c] mt-2 flex items-baseline gap-1">
                        28,500 <span className="text-xs font-normal text-slate-400">万元</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 font-mono pt-2 border-t border-[#18284c]/60">
                        质押估算固碳量: <strong className="text-teal-300">142.5 万吨 CO₂e</strong>
                      </div>
                    </div>

                    <div className="p-4 bg-[#091126] border border-[#18284c] rounded-xl shadow-lg relative overflow-hidden group">
                      <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                        <span>审批通过金额</span>
                        <span className="text-teal-300 font-mono text-[10px]">通过率 84.5%</span>
                      </div>
                      <div className="text-2xl font-extrabold font-mono text-white mt-2 flex items-baseline gap-1">
                        21,200 <span className="text-xs font-normal text-slate-400">万元</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 font-mono pt-2 border-t border-[#18284c]/60">
                        平均审查时效: <strong className="text-slate-200">2.4 工作日</strong>
                      </div>
                    </div>

                    <div className="p-4 bg-[#091126] border border-[#18284c] rounded-xl shadow-lg relative overflow-hidden group">
                      <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                        <span>累计放款金额</span>
                        <span className="text-emerald-400 font-mono text-[10px]">放款率 79.2%</span>
                      </div>
                      <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-2 flex items-baseline gap-1">
                        16,800 <span className="text-xs font-normal text-slate-400">万元</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 font-mono pt-2 border-t border-[#18284c]/60">
                        已惠及企业/合作社: <strong className="text-emerald-300">42 家</strong>
                      </div>
                    </div>

                    <div className="p-4 bg-[#091126] border border-[#18284c] rounded-xl shadow-lg relative overflow-hidden group">
                      <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                        <span>加权平均授信利率</span>
                        <span className="text-teal-300 font-mono text-[10px]">贴息后 2.85%</span>
                      </div>
                      <div className="text-2xl font-extrabold font-mono text-teal-300 mt-2 flex items-baseline gap-1">
                        3.82%
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 font-mono pt-2 border-t border-[#18284c]/60">
                        享受国家绿金贴息: <strong className="text-emerald-400">0.97%</strong>
                      </div>
                    </div>
                  </div>

                  {/* MIDDLE SECTION: LEFT MAP & RIGHT DOUGHNUT CHARTS */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* LEFT 7 COLS: REGIONAL GEOGRAPHICAL DISTRIBUTION MAP */}
                    <div className="lg:col-span-7 bg-[#091126] border border-[#18284c] rounded-2xl shadow-xl p-5 flex flex-col justify-between relative overflow-hidden min-h-[460px]">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-[#18284c]/80">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#00c88c] rounded-full" />
                            <h3 className="text-sm font-bold text-white tracking-wide">
                              全区/各市县贷款金额地理分布图
                            </h3>
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            行政区划数据实时统计
                          </div>
                        </div>

                        {/* Interactive Geographic Map Rendering */}
                        <div className="mt-4 relative bg-[#060b18] border border-[#122040] rounded-xl p-4 min-h-[300px] flex items-center justify-center overflow-hidden">
                          {/* Map Grid Cyber Effect */}
                          <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#00c88c_1px,transparent_1px)] [background-size:16px_16px]" />

                          {/* SVG Map Shape Representation */}
                          <svg viewBox="0 0 500 320" className="w-full h-auto max-h-[280px] drop-shadow-[0_0_15px_rgba(0,200,140,0.15)]">
                            {/* Region Paths */}
                            {/* 肥西县 */}
                            <path
                              d="M 180 140 L 250 120 L 280 170 L 230 220 L 170 190 Z"
                              fill="#00c88c"
                              fillOpacity="0.8"
                              stroke="#00e699"
                              strokeWidth="1.5"
                              className="transition-all hover:fill-opacity-100 hover:scale-[1.01] cursor-pointer"
                            >
                              <title>肥西县: 申贷 6,800万元 | 已放款 4,500万元 | 固碳量 38万吨</title>
                            </path>
                            <text x="215" y="168" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" pointerEvents="none">肥西县</text>
                            <text x="215" y="182" fill="#e2e8f0" fontSize="9" fontStyle="mono" textAnchor="middle" pointerEvents="none">4,500万</text>

                            {/* 肥东县 */}
                            <path
                              d="M 250 120 L 330 90 L 370 150 L 310 190 L 280 170 Z"
                              fill="#00a876"
                              fillOpacity="0.7"
                              stroke="#00c88c"
                              strokeWidth="1.5"
                              className="transition-all hover:fill-opacity-100 hover:scale-[1.01] cursor-pointer"
                            >
                              <title>肥东县: 申贷 5,200万元 | 已放款 3,800万元 | 固碳量 32万吨</title>
                            </path>
                            <text x="310" y="135" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" pointerEvents="none">肥东县</text>
                            <text x="310" y="149" fill="#e2e8f0" fontSize="9" fontStyle="mono" textAnchor="middle" pointerEvents="none">3,800万</text>

                            {/* 长丰县 */}
                            <path
                              d="M 190 60 L 280 50 L 330 90 L 250 120 L 180 140 Z"
                              fill="#00a876"
                              fillOpacity="0.6"
                              stroke="#00c88c"
                              strokeWidth="1.5"
                              className="transition-all hover:fill-opacity-100 hover:scale-[1.01] cursor-pointer"
                            >
                              <title>长丰县: 申贷 3,900万元 | 已放款 2,700万元 | 固碳量 22万吨</title>
                            </path>
                            <text x="250" y="85" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" pointerEvents="none">长丰县</text>
                            <text x="250" y="99" fill="#e2e8f0" fontSize="9" fontStyle="mono" textAnchor="middle" pointerEvents="none">2,700万</text>

                            {/* 巢湖市 */}
                            <path
                              d="M 310 190 L 370 150 L 440 180 L 400 250 L 320 230 Z"
                              fill="#00c88c"
                              fillOpacity="0.5"
                              stroke="#00c88c"
                              strokeWidth="1.5"
                              className="transition-all hover:fill-opacity-100 hover:scale-[1.01] cursor-pointer"
                            >
                              <title>巢湖市: 申贷 3,200万元 | 已放款 2,200万元 | 固碳量 18万吨</title>
                            </path>
                            <text x="365" y="195" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" pointerEvents="none">巢湖市</text>
                            <text x="365" y="209" fill="#e2e8f0" fontSize="9" fontStyle="mono" textAnchor="middle" pointerEvents="none">2,200万</text>

                            {/* 庐江县 */}
                            <path
                              d="M 230 220 L 280 170 L 310 190 L 320 230 L 280 280 L 200 260 Z"
                              fill="#00c88c"
                              fillOpacity="0.75"
                              stroke="#00e699"
                              strokeWidth="1.5"
                              className="transition-all hover:fill-opacity-100 hover:scale-[1.01] cursor-pointer"
                            >
                              <title>庐江县: 申贷 4,500万元 | 已放款 3,100万元 | 固碳量 26万吨</title>
                            </path>
                            <text x="265" y="235" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" pointerEvents="none">庐江县</text>
                            <text x="265" y="249" fill="#e2e8f0" fontSize="9" fontStyle="mono" textAnchor="middle" pointerEvents="none">3,100万</text>

                            {/* 市辖核心城区 (蜀山/包河/庐阳/瑶海) */}
                            <path
                              d="M 120 120 L 180 140 L 170 190 L 100 170 Z"
                              fill="#10b981"
                              fillOpacity="0.3"
                              stroke="#10b981"
                              strokeWidth="1.2"
                              className="transition-all hover:fill-opacity-100 cursor-pointer"
                            >
                              <title>市辖城区: 申贷 2,100万元 | 已放款 1,500万元</title>
                            </path>
                            <text x="140" y="150" fill="#94a3b8" fontSize="10" textAnchor="middle" pointerEvents="none">主城区</text>

                            {/* Connecting Nodes */}
                            <circle cx="215" cy="155" r="4" fill="#00e699" className="animate-ping opacity-75" />
                            <circle cx="215" cy="155" r="3" fill="#ffffff" />

                            <circle cx="310" cy="125" r="3" fill="#00c88c" />
                            <circle cx="265" cy="225" r="3" fill="#00c88c" />
                          </svg>

                          {/* Map Legend Scale Box in Bottom Left */}
                          <div className="absolute bottom-3 left-3 bg-[#081226]/90 border border-[#18284c] px-3 py-2 rounded-lg text-[10px] text-slate-300 font-mono space-y-1 backdrop-blur-xs">
                            <div className="text-slate-400 font-sans font-bold mb-1">申贷金额图例说明</div>
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded bg-[#00c88c] border border-white/20" />
                              <span>88 - 114万 (含以上高集聚区)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded bg-[#00c88c]/80" />
                              <span>57 - 88万</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded bg-[#00c88c]/50" />
                              <span>29 - 57万</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded bg-[#10b981]/20 border border-emerald-500/30" />
                              <span>0 - 29万</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Region Rank Micro Table */}
                      <div className="mt-4 pt-3 border-t border-[#18284c]/80 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
                        <div className="p-2 bg-[#0d1b3a] rounded-lg border border-[#1d2f5a]">
                          <div className="text-slate-400">肥西县</div>
                          <div className="text-[#00c88c] font-bold font-mono mt-0.5">4,500万</div>
                        </div>
                        <div className="p-2 bg-[#0d1b3a] rounded-lg border border-[#1d2f5a]">
                          <div className="text-slate-400">肥东县</div>
                          <div className="text-emerald-300 font-bold font-mono mt-0.5">3,800万</div>
                        </div>
                        <div className="p-2 bg-[#0d1b3a] rounded-lg border border-[#1d2f5a]">
                          <div className="text-slate-400">庐江县</div>
                          <div className="text-teal-300 font-bold font-mono mt-0.5">3,100万</div>
                        </div>
                        <div className="p-2 bg-[#0d1b3a] rounded-lg border border-[#1d2f5a]">
                          <div className="text-slate-400">长丰县</div>
                          <div className="text-slate-200 font-bold font-mono mt-0.5">2,700万</div>
                        </div>
                        <div className="p-2 bg-[#0d1b3a] rounded-lg border border-[#1d2f5a]">
                          <div className="text-slate-400">巢湖市</div>
                          <div className="text-slate-300 font-bold font-mono mt-0.5">2,200万</div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT 5 COLS: TWO DOUGHNUT CHARTS (申贷审核统计 & 申请放款统计) */}
                    <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                      {/* DOUGHNUT 1: 申贷审核统计 */}
                      <div className="bg-[#091126] border border-[#18284c] rounded-2xl shadow-xl p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2.5 border-b border-[#18284c]/80">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#00c88c] rounded-full" />
                            <h3 className="text-sm font-bold text-white tracking-wide">
                              申贷审核统计
                            </h3>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">共 158 笔申请</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          {/* Donut SVG 1 */}
                          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                              {/* 审批通过 (62%) */}
                              <circle
                                cx="50"
                                cy="50"
                                r="38"
                                fill="transparent"
                                stroke="#00c88c"
                                strokeWidth="18"
                                strokeDasharray="148 238"
                                strokeDashoffset="0"
                              />
                              {/* 审核中 (20.3%) */}
                              <circle
                                cx="50"
                                cy="50"
                                r="38"
                                fill="transparent"
                                stroke="#00b4d8"
                                strokeWidth="18"
                                strokeDasharray="48 238"
                                strokeDashoffset="-148"
                              />
                              {/* 待审核 (11.4%) */}
                              <circle
                                cx="50"
                                cy="50"
                                r="38"
                                fill="transparent"
                                stroke="#f59e0b"
                                strokeWidth="18"
                                strokeDasharray="27 238"
                                strokeDashoffset="-196"
                              />
                              {/* 已驳回 (6.3%) */}
                              <circle
                                cx="50"
                                cy="50"
                                r="38"
                                fill="transparent"
                                stroke="#f43f5e"
                                strokeWidth="18"
                                strokeDasharray="15 238"
                                strokeDashoffset="-223"
                              />
                            </svg>
                            {/* Inner Circle Label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                              <span className="text-lg font-black font-mono text-white leading-none">158</span>
                              <span className="text-[10px] text-slate-400 font-sans mt-0.5">申贷总笔数</span>
                            </div>
                          </div>

                          {/* Legend Breakdown */}
                          <div className="flex-1 space-y-2 text-xs font-sans w-full">
                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e1a38] border border-[#1a2b52]">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#00c88c]" />
                                <span className="text-slate-200">审批通过</span>
                              </div>
                              <span className="font-mono text-emerald-400 font-bold">98 笔 (62.0%)</span>
                            </div>

                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e1a38] border border-[#1a2b52]">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#00b4d8]" />
                                <span className="text-slate-200">审核中</span>
                              </div>
                              <span className="font-mono text-teal-300 font-bold">32 笔 (20.3%)</span>
                            </div>

                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e1a38] border border-[#1a2b52]">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                                <span className="text-slate-200">待审核</span>
                              </div>
                              <span className="font-mono text-amber-300 font-bold">18 笔 (11.4%)</span>
                            </div>

                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e1a38] border border-[#1a2b52]">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />
                                <span className="text-slate-200">已驳回</span>
                              </div>
                              <span className="font-mono text-rose-400 font-bold">10 笔 (6.3%)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* DOUGHNUT 2: 申请放款统计 (贷款产品类型占比) */}
                      <div className="bg-[#091126] border border-[#18284c] rounded-2xl shadow-xl p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2.5 border-b border-[#18284c]/80">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#00c88c] rounded-full" />
                            <h3 className="text-sm font-bold text-white tracking-wide">
                              申请放款统计 (产品类型)
                            </h3>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-400">累计放款 1.68 亿元</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          {/* Donut SVG 2 */}
                          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                              {/* 质押贷 (52.4%) */}
                              <circle
                                cx="50"
                                cy="50"
                                r="38"
                                fill="transparent"
                                stroke="#00c88c"
                                strokeWidth="18"
                                strokeDasharray="125 238"
                                strokeDashoffset="0"
                              />
                              {/* 信用贷 (28.6%) */}
                              <circle
                                cx="50"
                                cy="50"
                                r="38"
                                fill="transparent"
                                stroke="#06b6d4"
                                strokeWidth="18"
                                strokeDasharray="68 238"
                                strokeDashoffset="-125"
                              />
                              {/* 抵押贷 (19.0%) */}
                              <circle
                                cx="50"
                                cy="50"
                                r="38"
                                fill="transparent"
                                stroke="#6366f1"
                                strokeWidth="18"
                                strokeDasharray="45 238"
                                strokeDashoffset="-193"
                              />
                            </svg>
                            {/* Inner Circle Label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                              <span className="text-base font-black font-mono text-[#00c88c] leading-none">1.68亿</span>
                              <span className="text-[10px] text-slate-400 font-sans mt-0.5">放款总额</span>
                            </div>
                          </div>

                          {/* Legend Breakdown */}
                          <div className="flex-1 space-y-2 text-xs font-sans w-full">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0e1a38] border border-[#1a2b52]">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#00c88c]" />
                                <span className="text-slate-200">质押贷 (碳汇收益权)</span>
                              </div>
                              <span className="font-mono text-emerald-400 font-bold">8,800万 (52.4%)</span>
                            </div>

                            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0e1a38] border border-[#1a2b52]">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                                <span className="text-slate-200">信用贷 (林业生态信用)</span>
                              </div>
                              <span className="font-mono text-cyan-300 font-bold">4,800万 (28.6%)</span>
                            </div>

                            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0e1a38] border border-[#1a2b52]">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                                <span className="text-slate-200">抵押贷 (林权+碳资产)</span>
                              </div>
                              <span className="font-mono text-indigo-300 font-bold">3,200万 (19.0%)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM SECTION: MONTHLY TREND & FINANCIAL INSTITUTION CONTRIBUTIONS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* MONTHLY TREND CHART */}
                    <div className="bg-[#091126] border border-[#18284c] rounded-2xl shadow-xl p-5 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#18284c]/80">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-4 bg-[#00c88c] rounded-full" />
                          <h3 className="text-sm font-bold text-white tracking-wide">
                            2026年近期月度申贷与放款走势 (万元)
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-sans">
                          <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded-xs bg-[#00c88c]" /> 申贷金额</span>
                          <span className="flex items-center gap-1.5 text-teal-300"><span className="w-2.5 h-2.5 rounded-xs bg-[#06b6d4]" /> 已放款</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        {/* Bar Chart Representation */}
                        <div className="h-44 flex items-end justify-between gap-3 px-2 pt-4 border-b border-[#18284c]">
                          {[
                            { month: '05月', apply: 2100, disburse: 1500 },
                            { month: '06月', apply: 2800, disburse: 2100 },
                            { month: '07月', apply: 3400, disburse: 2600 },
                            { month: '08月', apply: 4200, disburse: 3200 },
                            { month: '09月', apply: 5100, disburse: 3800 },
                            { month: '10月(近期)', apply: 6500, disburse: 4800 },
                          ].map((d) => {
                            const maxVal = 7000;
                            const applyH = (d.apply / maxVal) * 100;
                            const disburseH = (d.disburse / maxVal) * 100;
                            return (
                              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                                <div className="w-full flex items-end justify-center gap-1 h-full">
                                  {/* Apply Bar */}
                                  <div
                                    style={{ height: `${applyH}%` }}
                                    className="w-1/2 max-w-[18px] bg-gradient-to-t from-[#00c88c]/40 to-[#00c88c] rounded-t-xs transition-all group-hover:brightness-125 relative"
                                  >
                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                      {d.apply}
                                    </span>
                                  </div>
                                  {/* Disburse Bar */}
                                  <div
                                    style={{ height: `${disburseH}%` }}
                                    className="w-1/2 max-w-[18px] bg-gradient-to-t from-[#06b6d4]/40 to-[#06b6d4] rounded-t-xs transition-all group-hover:brightness-125 relative"
                                  >
                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                      {d.disburse}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono tracking-tighter truncate max-w-full">
                                  {d.month}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* FINANCIAL INSTITUTION RANKING TABLE */}
                    <div className="bg-[#091126] border border-[#18284c] rounded-2xl shadow-xl p-5 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#18284c]/80">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-4 bg-[#00c88c] rounded-full" />
                          <h3 className="text-sm font-bold text-white tracking-wide">
                            承办金融机构放款贡献排行榜
                          </h3>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">前5大支持行</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse font-sans">
                          <thead>
                            <tr className="border-b border-[#18284c] text-slate-400 font-medium text-[11px]">
                              <th className="py-2 px-2 text-center w-10">排名</th>
                              <th className="py-2 px-2">金融机构名称</th>
                              <th className="py-2 px-2 text-center">核心产品</th>
                              <th className="py-2 px-2 text-right">累计放款(元)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#18284c]/60">
                            {[
                              { rank: 1, name: '中国农业银行合肥分行', product: '绿碳贷·碳汇质押', amount: '82,000,000' },
                              { rank: 2, name: '徽商银行合肥分行', product: '碳汇通·信用贷', amount: '36,000,000' },
                              { rank: 3, name: '国家开发银行安徽省分行', product: 'CCER专项扶持贷', amount: '28,000,000' },
                              { rank: 4, name: '中国工商银行合肥高新支行', product: '工银绿碳·林权抵押', amount: '14,000,000' },
                              { rank: 5, name: '中国邮政储蓄银行肥西县支行', product: '乡村振兴·普惠贷', amount: '8,000,000' },
                            ].map((item) => (
                              <tr key={item.rank} className="hover:bg-[#0f1d3f] transition-colors">
                                <td className="py-2.5 px-2 text-center font-mono font-bold">
                                  <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] ${
                                    item.rank === 1 ? 'bg-amber-500 text-slate-950 font-black' :
                                    item.rank === 2 ? 'bg-slate-300 text-slate-950 font-black' :
                                    item.rank === 3 ? 'bg-amber-700 text-white font-bold' :
                                    'bg-slate-800 text-slate-400'
                                  }`}>
                                    {item.rank}
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 font-medium text-slate-200">{item.name}</td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#0c1836] border border-[#1d2f5a] text-emerald-300">
                                    {item.product}
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-right font-mono font-bold text-[#00c88c]">
                                  ￥{item.amount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* TAB CONTENT 3: 保险管理 (依据最新截图 100% 还原布局与降序近期时间) */}
        {activeTopTab === 'insurance' && (
          <>
            {/* Left Submenu Sidebar */}
            <aside className="w-full md:w-56 shrink-0 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md p-4 self-start space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-emerald-900/60 text-xs font-bold text-white">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>保险业务子菜单</span>
              </div>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveInsuranceSubTab('insurance_product');
                    setInsPage(1);
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeInsuranceSubTab === 'insurance_product'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-300 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeInsuranceSubTab === 'insurance_product' ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span>保险产品</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveInsuranceSubTab('insurance_service');
                    triggerToast('已切换至保险服务跟进板块');
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeInsuranceSubTab === 'insurance_service'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-300 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeInsuranceSubTab === 'insurance_service' ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span>保险服务</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveInsuranceSubTab('insurance_stats');
                    triggerToast('已切换至保险统计仪表盘');
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeInsuranceSubTab === 'insurance_stats'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-300 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeInsuranceSubTab === 'insurance_stats' ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span>保险统计</span>
                </button>
              </div>
            </aside>

            {/* Right Main Content Panel */}
            <section className="flex-1 space-y-5">
              {activeInsuranceSubTab === 'insurance_product' && (
                <>
                  {/* CARD 1: 筛选搜索 */}
                  <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-emerald-950">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-white tracking-wide">筛选搜索</span>
                        <span className="text-xs text-slate-500">|</span>
                        <span className="text-xs text-emerald-400/90 font-mono">
                          上线日期默认按近期降序排列
                        </span>
                      </div>

                      {/* Top Right Buttons: 搜索, 重置 */}
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => triggerToast('已根据条件精准检索保险产品')}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>搜索</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInsCompanyFilter('all');
                            setInsNameFilter('');
                            setInsTypeFilter('all');
                            setInsDateFilter('');
                            setInsPage(1);
                            triggerToast('已重置筛选条件');
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>重置</span>
                        </button>
                      </div>
                    </div>

                    {/* Form Input Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                      {/* 所属保险公司 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">所属保险公司</label>
                        <select
                          value={insCompanyFilter}
                          onChange={(e) => {
                            setInsCompanyFilter(e.target.value);
                            setInsPage(1);
                          }}
                          className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="all">请选择</option>
                          <option value="中国人寿财产保险">中国人寿财产保险合肥支公司</option>
                          <option value="中国人民财产保险">中国人民财产保险股份有限公司肥西支公司</option>
                          <option value="太平洋财产保险">太平洋财产保险安徽分公司</option>
                          <option value="中华联合财产保险">中华联合财产保险合肥支公司</option>
                          <option value="国元农业保险">国元农业保险合肥中心支公司</option>
                          <option value="平安产险">平安产险合肥中心支公司</option>
                        </select>
                      </div>

                      {/* 保险名称 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">保险名称</label>
                        <input
                          type="text"
                          placeholder="请输入保险名称"
                          value={insNameFilter}
                          onChange={(e) => {
                            setInsNameFilter(e.target.value);
                            setInsPage(1);
                          }}
                          className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* 保险类型 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">保险类型</label>
                        <select
                          value={insTypeFilter}
                          onChange={(e) => {
                            setInsTypeFilter(e.target.value);
                            setInsPage(1);
                          }}
                          className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="all">请选择</option>
                          <option value="碳汇保险">碳汇保险</option>
                          <option value="林木保险">林木保险</option>
                          <option value="政策性保险">政策性保险</option>
                        </select>
                      </div>

                      {/* 上线日期 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">上线日期</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="请选择日期范围"
                            value={insDateFilter}
                            onChange={(e) => {
                              setInsDateFilter(e.target.value);
                              setInsPage(1);
                            }}
                            className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 pr-8"
                          />
                          <Calendar className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Row: 新增, 批量导入 */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleOpenAddInsModalCleared}
                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>新增</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsBatchImportInsModalOpen(true)}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>批量导入</span>
                      </button>
                    </div>
                  </div>

                  {/* CARD 2: 数据列表 */}
                  <div className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
                    <div className="px-5 py-3.5 border-b border-emerald-900/60 flex items-center justify-between bg-slate-900/60">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                        <span className="text-sm font-bold text-white tracking-wide">数据列表</span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        共检索到 <strong className="text-emerald-400 font-bold">{filteredInsuranceProducts.length}</strong> 条保险产品记录 (按上线日期近期降序)
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-emerald-900/60 bg-slate-900/80 text-slate-400 font-medium">
                            <th className="py-3.5 px-4 w-12 text-center">序号</th>
                            <th className="py-3.5 px-4 min-w-[200px]">所属保险公司</th>
                            <th className="py-3.5 px-4 min-w-[240px]">保险名称</th>
                            <th className="py-3.5 px-4 text-center min-w-[100px]">保险类型</th>
                            <th className="py-3.5 px-4 text-right min-w-[130px]">保费金额 (元/亩·年)</th>
                            <th className="py-3.5 px-4 text-center min-w-[120px]">最低投保面积 (亩)</th>
                            <th className="py-3.5 px-4 text-center min-w-[110px]">上线日期</th>
                            <th className="py-3.5 px-4 text-center min-w-[110px]">操作</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-emerald-950/60">
                          {displayedInsuranceProducts.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-12 text-center text-slate-500">
                                暂无符合条件的保险产品记录
                              </td>
                            </tr>
                          ) : (
                            displayedInsuranceProducts.map((item, idx) => {
                              const serialNo = (insPage - 1) * insPageSize + idx + 1;
                              return (
                                <tr key={item.id} className="hover:bg-emerald-950/40 transition-colors text-slate-200">
                                  <td className="py-3.5 px-4 text-center font-mono text-slate-500">{serialNo}</td>
                                  <td className="py-3.5 px-4 text-slate-300 font-medium">{item.companyName}</td>
                                  <td className="py-3.5 px-4">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedInsuranceProduct(item)}
                                      className="text-emerald-400 hover:text-emerald-300 hover:underline text-left font-medium cursor-pointer"
                                    >
                                      {item.productName}
                                    </button>
                                  </td>
                                  <td className="py-3.5 px-4 text-center">
                                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                                      {item.insuranceType}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 text-right font-mono font-bold text-teal-300">
                                    {item.premiumRate.toFixed(2)}
                                  </td>
                                  <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.minInsuredArea}</td>
                                  <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                                    {item.launchDate}
                                  </td>
                                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingInsuranceProduct(item);
                                          setInsForm(item);
                                          setIsAddInsModalOpen(true);
                                        }}
                                        className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium cursor-pointer"
                                      >
                                        编辑
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteInsuranceProduct(item.id, item.productName)}
                                        className="text-rose-400 hover:text-rose-300 hover:underline font-medium cursor-pointer"
                                      >
                                        删除
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Bottom Pagination Bar */}
                    <div className="px-6 py-4 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span>共 <strong className="text-emerald-400 font-mono font-bold">{filteredInsuranceProducts.length}</strong> 条数据</span>
                        <span className="text-slate-700">|</span>
                        <div className="flex items-center gap-1.5">
                          <span>每页</span>
                          <select
                            value={insPageSize}
                            onChange={(e) => {
                              setInsPageSize(Number(e.target.value));
                              setInsPage(1);
                            }}
                            className="px-2 py-0.5 bg-slate-900 border border-emerald-900/80 rounded text-slate-200 outline-none font-mono cursor-pointer"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </select>
                          <span>条</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 font-mono">
                        <button
                          type="button"
                          disabled={insPage <= 1}
                          onClick={() => setInsPage((prev) => Math.max(1, prev - 1))}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                        >
                          &lt;
                        </button>
                        {[1, 2, 3, 4, 5].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setInsPage(p)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              insPage === p
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <span className="px-1 text-slate-600">...</span>
                        <button
                          type="button"
                          onClick={() => setInsPage(totalInsPages)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            insPage === totalInsPages
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {totalInsPages}
                        </button>
                        <button
                          type="button"
                          disabled={insPage >= totalInsPages}
                          onClick={() => setInsPage((prev) => Math.min(totalInsPages, prev + 1))}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeInsuranceSubTab === 'insurance_service' && (
                <>
                  {/* CARD 1: 筛选搜索 (依据最新截图 100% 还原) */}
                  <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-emerald-950">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-white tracking-wide">筛选搜索</span>
                        <span className="text-xs text-slate-500">|</span>
                        <span className="text-xs text-emerald-400/90 font-mono">
                          投保时间默认按近期降序排列
                        </span>
                      </div>

                      {/* Top Right Buttons: 搜索, 重置 */}
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => triggerToast('已根据检索条件筛选保险服务跟进记录')}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>搜索</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSrvRegionFilter('all');
                            setSrvCompanyFilter('');
                            setSrvNameFilter('all');
                            setSrvDateFilter('');
                            setSrvTypeFilter('all');
                            setSrvStatusFilter('all');
                            setSrvPage(1);
                            triggerToast('已重置筛选条件');
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>重置</span>
                        </button>
                      </div>
                    </div>

                    {/* Form Input Grid Row 1 & Row 2 */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        {/* 所属行政区划 */}
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1 font-medium">所属行政区划</label>
                          <select
                            value={srvRegionFilter}
                            onChange={(e) => {
                              setSrvRegionFilter(e.target.value);
                              setSrvPage(1);
                            }}
                            className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="all">请选择</option>
                            <option value="肥西县">合肥市 肥西县</option>
                            <option value="庐阳区">合肥市 庐阳区</option>
                            <option value="肥东县">合肥市 肥东县</option>
                            <option value="高新区">合肥市 高新区</option>
                            <option value="休宁县">黄山市 休宁县</option>
                            <option value="岳西县">安庆市 岳西县</option>
                            <option value="广德市">宣城市 广德市</option>
                          </select>
                        </div>

                        {/* 投保企业名称 */}
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1 font-medium">投保企业名称</label>
                          <input
                            type="text"
                            placeholder="请输入企业名称"
                            value={srvCompanyFilter}
                            onChange={(e) => {
                              setSrvCompanyFilter(e.target.value);
                              setSrvPage(1);
                            }}
                            className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 placeholder-slate-600"
                          />
                        </div>

                        {/* 保险名称 */}
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1 font-medium">保险名称</label>
                          <select
                            value={srvNameFilter}
                            onChange={(e) => {
                              setSrvNameFilter(e.target.value);
                              setSrvPage(1);
                            }}
                            className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="all">请选择</option>
                            <option value="森林碳汇火灾与气象灾害指数保险">森林碳汇火灾与气象灾害指数保险</option>
                            <option value="林业碳汇质押贷款履约保证保险">林业碳汇质押贷款履约保证保险</option>
                            <option value="湿地与碳汇森林巨灾保险">湿地与碳汇森林巨灾保险</option>
                            <option value="竹林生态碳汇与气象指数保险">竹林生态碳汇与气象指数保险</option>
                            <option value="政策性碳汇林业综合保障险">政策性碳汇林业综合保障险</option>
                          </select>
                        </div>

                        {/* 投保日期 */}
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1 font-medium">投保日期</label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="请选择日期范围"
                              value={srvDateFilter}
                              onChange={(e) => {
                                setSrvDateFilter(e.target.value);
                                setSrvPage(1);
                              }}
                              className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 pr-8"
                            />
                            <Calendar className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Row 2: 保险类型, 投保状态, 新增投保按钮 */}
                      <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="w-48">
                            <label className="block text-[11px] text-slate-400 mb-1 font-medium">保险类型</label>
                            <select
                              value={srvTypeFilter}
                              onChange={(e) => {
                                setSrvTypeFilter(e.target.value);
                                setSrvPage(1);
                              }}
                              className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              <option value="all">请选择</option>
                              <option value="林木保险">林木保险</option>
                              <option value="碳汇保险">碳汇保险</option>
                              <option value="政策性保险">政策性保险</option>
                            </select>
                          </div>

                          <div className="w-48">
                            <label className="block text-[11px] text-slate-400 mb-1 font-medium">投保状态</label>
                            <select
                              value={srvStatusFilter}
                              onChange={(e) => {
                                setSrvStatusFilter(e.target.value);
                                setSrvPage(1);
                              }}
                              className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              <option value="all">请选择</option>
                              <option value="申请中">申请中</option>
                              <option value="生效中">生效中</option>
                              <option value="已过期">已过期</option>
                            </select>
                          </div>
                        </div>

                        {/* 右侧：新增投保按钮 */}
                        <button
                          type="button"
                          onClick={handleOpenAddInsServiceModalCleared}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>新增投保</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: 数据列表 (依据最新截图 100% 还原结构与颜色) */}
                  <div className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
                    <div className="px-5 py-3.5 border-b border-emerald-900/60 flex items-center justify-between bg-slate-900/60">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                        <span className="text-sm font-bold text-white tracking-wide">数据列表</span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        共检索到 <strong className="text-emerald-400 font-bold">{filteredInsuranceServices.length}</strong> 条投保服务凭单 (投保时间近期的降序)
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-emerald-900/60 bg-slate-900/80 text-slate-400 font-medium">
                            <th className="py-3.5 px-3 w-12 text-center">序号</th>
                            <th className="py-3.5 px-3 min-w-[130px]">所属行政区划</th>
                            <th className="py-3.5 px-3 min-w-[210px]">投保企业</th>
                            <th className="py-3.5 px-3 min-w-[220px]">保险名称</th>
                            <th className="py-3.5 px-3 text-right min-w-[130px]">保险金额 (元/亩·年)</th>
                            <th className="py-3.5 px-3 text-center min-w-[100px]">投保面积 (亩)</th>
                            <th className="py-3.5 px-3 text-center min-w-[100px]">保险类型</th>
                            <th className="py-3.5 px-3 text-center min-w-[90px]">投保状态</th>
                            <th className="py-3.5 px-3 text-center min-w-[110px]">投保时间</th>
                            <th className="py-3.5 px-3 text-center min-w-[130px]">操作</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-emerald-950/60">
                          {displayedInsuranceServices.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="py-12 text-center text-slate-500">
                                暂无符合条件的投保服务记录
                              </td>
                            </tr>
                          ) : (
                            displayedInsuranceServices.map((item, idx) => {
                              const serialNo = (srvPage - 1) * srvPageSize + idx + 1;
                              return (
                                <tr key={item.id} className="hover:bg-emerald-950/40 transition-colors text-slate-200">
                                  <td className="py-3.5 px-3 text-center font-mono text-slate-500">{serialNo}</td>
                                  <td className="py-3.5 px-3 text-slate-300">{item.region}</td>
                                  <td className="py-3.5 px-3">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedInsServiceRecord(item)}
                                      className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium text-left cursor-pointer"
                                    >
                                      {item.companyName}
                                    </button>
                                  </td>
                                  <td className="py-3.5 px-3 text-slate-200 font-medium">{item.productName}</td>
                                  <td className="py-3.5 px-3 text-right font-mono font-bold text-teal-300">
                                    {item.premiumAmount.toFixed(2)}
                                  </td>
                                  <td className="py-3.5 px-3 text-center font-mono text-slate-300">{item.insuredArea}</td>
                                  <td className="py-3.5 px-3 text-center">
                                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                                      {item.insuranceType}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-3 text-center font-medium">
                                    {item.status === '申请中' && (
                                      <span className="text-sky-400 font-bold tracking-tight">申请中</span>
                                    )}
                                    {item.status === '生效中' && (
                                      <span className="text-emerald-400 font-bold tracking-tight">生效中</span>
                                    )}
                                    {item.status === '已过期' && (
                                      <span className="text-rose-400 font-bold tracking-tight">已过期</span>
                                    )}
                                  </td>
                                  <td className="py-3.5 px-3 text-center font-mono text-slate-400 text-[11px]">
                                    {item.applyDate}
                                  </td>
                                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2">
                                      {/* 详情链接 */}
                                      <button
                                        type="button"
                                        onClick={() => setSelectedInsServiceRecord(item)}
                                        className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium cursor-pointer"
                                      >
                                        详情
                                      </button>

                                      {/* 根据状态有条件展现: 删除/签约/续保 */}
                                      {item.status === '申请中' && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteInsServiceRecord(item.id, item.companyName)}
                                            className="text-rose-400 hover:text-rose-300 hover:underline font-medium cursor-pointer"
                                          >
                                            删除
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleOpenSigningModal(item)}
                                            className="text-teal-300 hover:text-teal-200 hover:underline font-bold cursor-pointer"
                                          >
                                            签约
                                          </button>
                                        </>
                                      )}

                                      {item.status === '已过期' && (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenRenewalModal(item)}
                                          className="text-emerald-300 hover:text-white hover:underline font-bold cursor-pointer"
                                        >
                                          续保
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Bottom Pagination Bar */}
                    <div className="px-6 py-4 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span>共 <strong className="text-emerald-400 font-mono font-bold">{filteredInsuranceServices.length}</strong> 条数据</span>
                        <span className="text-slate-700">|</span>
                        <div className="flex items-center gap-1.5">
                          <span>每页</span>
                          <select
                            value={srvPageSize}
                            onChange={(e) => {
                              setSrvPageSize(Number(e.target.value));
                              setSrvPage(1);
                            }}
                            className="px-2 py-0.5 bg-slate-900 border border-emerald-900/80 rounded text-slate-200 outline-none font-mono cursor-pointer"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </select>
                          <span>条</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 font-mono">
                        <button
                          type="button"
                          disabled={srvPage <= 1}
                          onClick={() => setSrvPage((prev) => Math.max(1, prev - 1))}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                        >
                          &lt;
                        </button>
                        {[1, 2, 3, 4, 5].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setSrvPage(p)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              srvPage === p
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <span className="px-1 text-slate-600">...</span>
                        <button
                          type="button"
                          onClick={() => setSrvPage(totalSrvPages)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            srvPage === totalSrvPages
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {totalSrvPages}
                        </button>
                        <button
                          type="button"
                          disabled={srvPage >= totalSrvPages}
                          onClick={() => setSrvPage((prev) => Math.min(totalSrvPages, prev + 1))}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeInsuranceSubTab === 'insurance_stats' && (
                <div className="space-y-5 font-sans">
                  {/* ROW 1: 顶部筛选控制卡片 */}
                  <div className="bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-lg flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-300 font-medium">所属行政区划</label>
                      <select
                        value={statsRegionFilter}
                        onChange={(e) => setStatsRegionFilter(e.target.value)}
                        className="px-3 py-1.5 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] cursor-pointer min-w-[160px]"
                      >
                        <option value="all">请选择</option>
                        <option value="肥西县">合肥市 肥西县</option>
                        <option value="庐阳区">合肥市 庐阳区</option>
                        <option value="肥东县">合肥市 肥东县</option>
                        <option value="高新区">合肥市 高新区</option>
                        <option value="休宁县">黄山市 休宁县</option>
                        <option value="岳西县">安庆市 岳西县</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-300 font-medium">保险产品</label>
                      <select
                        value={statsProductFilter}
                        onChange={(e) => setStatsProductFilter(e.target.value)}
                        className="px-3 py-1.5 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] cursor-pointer min-w-[180px]"
                      >
                        <option value="all">请选择</option>
                        <option value="p1">绿碳保·森林碳汇遥感险</option>
                        <option value="p2">生态惠农·综合固碳险</option>
                        <option value="p3">竹林风暴·气象灾害险</option>
                      </select>
                    </div>
                  </div>

                  {/* ROW 2: 4大核心 KPI 与饼图卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* KPI 1: 累计保费 */}
                    <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-lg flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-medium">累计保费 (万元)</div>
                        <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1">
                          18312 <span className="text-xs font-normal text-slate-300">万元</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          数据截止至2026年10月18日
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#00c88c]/15 border border-[#00c88c]/40 flex items-center justify-center shrink-0">
                        <Coins className="w-6 h-6 text-[#00c88c]" />
                      </div>
                    </div>

                    {/* KPI 2: 累计参保企业数 */}
                    <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-lg flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-medium">累计参保企业数</div>
                        <div className="text-2xl font-bold font-mono text-white">
                          2156
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          数据截止至2026年10月18日
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>

                    {/* Donut Chart 1: 保险产品类型分布 */}
                    <div className="bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-lg flex flex-col justify-between">
                      <div className="text-xs font-bold text-slate-100 mb-2">保险产品类型分布</div>
                      <div className="flex items-center gap-3">
                        {/* SVG Donut */}
                        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#101a36" strokeWidth="4" />
                            {/* 碳汇保险 (Blue) */}
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="67.8 20.2" strokeDashoffset="0" />
                            {/* 林木保险 (Orange) */}
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="7.6 80.4" strokeDashoffset="-67.8" />
                            {/* 政策性保险 (Purple) */}
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray="7.6 80.4" strokeDashoffset="-75.4" />
                            {/* 其他保险 (Green) */}
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="4.8 83.2" strokeDashoffset="-83.0" />
                          </svg>
                          <div className="absolute text-center">
                            <div className="text-sm font-bold font-mono text-white leading-none">648</div>
                            <div className="text-[9px] text-slate-400 mt-0.5">万元</div>
                          </div>
                        </div>

                        {/* Donut Legend */}
                        <div className="space-y-1 text-[11px] font-sans flex-1">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-slate-300">
                              <span className="w-2 h-2 rounded-xs bg-[#3b82f6]" />碳汇保险
                            </span>
                            <span className="font-mono text-slate-100 font-bold">500万元</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-slate-300">
                              <span className="w-2 h-2 rounded-xs bg-[#f97316]" />林木保险
                            </span>
                            <span className="font-mono text-slate-100 font-bold">500万元</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-slate-300">
                              <span className="w-2 h-2 rounded-xs bg-[#a855f7]" />政策性保险
                            </span>
                            <span className="font-mono text-slate-100 font-bold">56万元</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-slate-300">
                              <span className="w-2 h-2 rounded-xs bg-[#10b981]" />其他保险
                            </span>
                            <span className="font-mono text-slate-100 font-bold">36万元</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Donut Chart 2: 保险投保状态分布 */}
                    <div className="bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-lg flex flex-col justify-between">
                      <div className="text-xs font-bold text-slate-100 mb-2">保险投保状态分布</div>
                      <div className="flex items-center gap-4">
                        {/* SVG Donut */}
                        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#101a36" strokeWidth="4" />
                            {/* 生效中 (Emerald) */}
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#00c88c" strokeWidth="4" strokeDasharray="69.5 18.5" strokeDashoffset="0" />
                            {/* 申请中 (Blue) */}
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10.4 77.6" strokeDashoffset="-69.5" />
                            {/* 已过期 (Red) */}
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="8.1 79.9" strokeDashoffset="-79.9" />
                          </svg>
                          <div className="absolute text-center">
                            <div className="text-sm font-bold font-mono text-white leading-none">253</div>
                          </div>
                        </div>

                        {/* Donut Legend */}
                        <div className="space-y-1.5 text-[11px] font-sans flex-1">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              <span className="w-2 h-2 rounded-xs bg-[#00c88c]" />生效中
                            </span>
                            <span className="font-mono text-slate-100 font-bold">200</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              <span className="w-2 h-2 rounded-xs bg-[#3b82f6]" />申请中
                            </span>
                            <span className="font-mono text-slate-100 font-bold">30</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              <span className="w-2 h-2 rounded-xs bg-[#ef4444]" />已过期
                            </span>
                            <span className="font-mono text-slate-100 font-bold">23</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ROW 3: 左侧安徽省地图 + 右侧双柱状图 */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* 左侧：参保情况区域分布图 (安徽省地图) */}
                    <div className="lg:col-span-6 bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-lg flex flex-col justify-between relative min-h-[520px]">
                      {/* 地图卡片标题 */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#18284c]">
                        <div className="font-bold text-sm text-white">参保情况区域分布图</div>
                        <select
                          value={statsMapMetric}
                          onChange={(e) => setStatsMapMetric(e.target.value as 'company' | 'amount')}
                          className="px-2.5 py-1 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-200 outline-none focus:border-[#00c88c] cursor-pointer"
                        >
                          <option value="company">按参保企业数</option>
                          <option value="amount">按保费金额</option>
                        </select>
                      </div>

                      {/* 地图内容与 Floating Tooltip */}
                      <div className="relative my-4 flex-1 flex items-center justify-center p-2">
                        {hoveredMapCity && (
                          <div className="absolute top-2 right-2 z-20 bg-[#0f1f42]/95 border border-[#00c88c] rounded-lg p-2.5 shadow-xl text-xs backdrop-blur-md animate-in fade-in">
                            <div className="font-bold text-white text-sm">{hoveredMapCity.name}</div>
                            <div className="text-slate-300 text-[11px] mt-1 font-mono">
                              参保企业数: <span className="text-[#00c88c] font-bold">{hoveredMapCity.value} 家</span>
                            </div>
                            <div className="text-slate-300 text-[11px] font-mono">
                              保费金额: <span className="text-teal-300 font-bold">{hoveredMapCity.amount}</span>
                            </div>
                          </div>
                        )}

                        {/* 安徽省地图 SVG */}
                        <div className="w-full max-w-[420px] h-[360px] relative">
                          <svg viewBox="0 0 500 600" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,200,140,0.15)]">
                            {[
                              { id: 'hefei', name: '合肥市', val: 200, amount: '4,280万元', fill: '#034832', path: 'M 210 230 L 260 210 L 280 260 L 250 310 L 200 290 Z' },
                              { id: 'wuhu', name: '芜湖市', val: 185, amount: '2,950万元', fill: '#005f42', path: 'M 280 260 L 330 250 L 320 310 L 280 300 Z' },
                              { id: 'anqing', name: '安庆市', val: 190, amount: '3,800万元', fill: '#005f42', path: 'M 150 310 L 220 300 L 230 400 L 160 410 Z' },
                              { id: 'luan', name: '六安市', val: 160, amount: '3,100万元', fill: '#059669', path: 'M 120 220 L 210 230 L 200 290 L 150 310 Z' },
                              { id: 'huangshan', name: '黄山市', val: 195, amount: '3,920万元', fill: '#034832', path: 'M 250 440 L 330 430 L 310 540 L 240 520 Z' },
                              { id: 'chuzhou', name: '滁州市', val: 130, amount: '2,100万元', fill: '#10b981', path: 'M 260 160 L 340 170 L 330 250 L 280 210 Z' },
                              { id: 'fuyang', name: '阜阳市', val: 120, amount: '1,850万元', fill: '#34d399', path: 'M 100 130 L 180 140 L 170 210 L 100 190 Z' },
                              { id: 'bozhou', name: '亳州市', val: 90, amount: '1,420万元', fill: '#6ee7b7', path: 'M 110 60 L 180 70 L 180 140 L 100 130 Z' },
                              { id: 'suzhou', name: '宿州市', val: 100, amount: '1,600万元', fill: '#34d399', path: 'M 180 70 L 270 80 L 260 150 L 180 140 Z' },
                              { id: 'bengbu', name: '蚌埠市', val: 140, amount: '2,250万元', fill: '#10b981', path: 'M 180 140 L 260 150 L 250 190 L 180 180 Z' },
                              { id: 'huainan', name: '淮南市', val: 150, amount: '2,400万元', fill: '#059669', path: 'M 170 180 L 250 190 L 240 230 L 170 210 Z' },
                              { id: 'huaibei', name: '淮北市', val: 75, amount: '1,100万元', fill: '#a7f3d0', path: 'M 190 40 L 240 45 L 230 80 L 180 70 Z' },
                              { id: 'maanshan', name: '马鞍山市', val: 65, amount: '980万元', fill: '#a7f3d0', path: 'M 320 220 L 360 220 L 350 260 L 320 250 Z' },
                              { id: 'tongling', name: '铜陵市', val: 110, amount: '1,720万元', fill: '#34d399', path: 'M 250 310 L 290 310 L 280 350 L 240 340 Z' },
                              { id: 'chizhou', name: '池州市', val: 145, amount: '2,300万元', fill: '#10b981', path: 'M 220 350 L 290 350 L 280 430 L 210 410 Z' },
                              { id: 'xuancheng', name: '宣城市', val: 80, amount: '1,250万元', fill: '#6ee7b7', path: 'M 290 320 L 370 310 L 350 420 L 280 410 Z' },
                            ].map((city) => (
                              <g
                                key={city.id}
                                onMouseEnter={() => setHoveredMapCity({ name: city.name, value: city.val, amount: city.amount, color: city.fill })}
                                onMouseLeave={() => setHoveredMapCity(null)}
                                className="cursor-pointer transition-all duration-300 hover:opacity-90 group"
                              >
                                <path
                                  d={city.path}
                                  fill={city.fill}
                                  stroke="#10254c"
                                  strokeWidth="2"
                                  className="transition-colors group-hover:stroke-[#00c88c]"
                                />
                                <text
                                  x={getCityTextCoords(city.id).x}
                                  y={getCityTextCoords(city.id).y}
                                  fill="#ffffff"
                                  fontSize="11"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                  className="pointer-events-none drop-shadow-md select-none font-sans opacity-90 group-hover:opacity-100"
                                >
                                  {city.name}
                                </text>
                              </g>
                            ))}
                          </svg>
                        </div>
                      </div>

                      {/* 地图左下角图例 */}
                      <div className="bg-[#0a132e]/90 border border-[#18284c] rounded-lg p-2.5 max-w-[150px] space-y-1 text-[10px]">
                        <div className="font-bold text-slate-300 text-[11px] mb-1">参保企业数</div>
                        {[
                          { range: '200', color: '#034832' },
                          { range: '171~200', color: '#005f42' },
                          { range: '143~171', color: '#059669' },
                          { range: '114~143', color: '#10b981' },
                          { range: '86~114', color: '#34d399' },
                          { range: '57~86', color: '#6ee7b7' },
                          { range: '29~57', color: '#a7f3d0' },
                          { range: '0~29', color: '#d1fae5' },
                        ].map((item) => (
                          <div key={item.range} className="flex items-center gap-2">
                            <span className="w-3.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-slate-300 font-mono">{item.range}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 右侧：全新图表样式展示 (时序平滑流体面积图/阶梯走势图 + 南丁格尔极坐标玫瑰图/横向胶囊流光排行) */}
                    <div className="lg:col-span-6 space-y-5">
                      {/* 右上图表: 参保时间统计 (时间按近期优先降序排列 · 平滑面积/阶梯波形/脉冲走势多样式切换) */}
                      <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-lg space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#18284c]">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-3.5 bg-[#00c88c] rounded-full" />
                            <div className="font-bold text-sm text-white">参保时间统计</div>
                            <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00c88c] animate-pulse" />
                              近期在先 (降序)
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* 图表样式切换器 (非传统柱状图) */}
                            <div className="flex items-center bg-[#101a36] p-0.5 rounded-lg border border-[#1d2d57]">
                              <button
                                type="button"
                                onClick={() => setTimeChartStyle('area')}
                                className={`px-2 py-0.5 text-[11px] rounded transition-all cursor-pointer ${
                                  timeChartStyle === 'area'
                                    ? 'bg-[#00c88c] text-slate-950 font-bold shadow-xs'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                                title="平滑流体渐变面积图"
                              >
                                面积图
                              </button>
                              <button
                                type="button"
                                onClick={() => setTimeChartStyle('stepped')}
                                className={`px-2 py-0.5 text-[11px] rounded transition-all cursor-pointer ${
                                  timeChartStyle === 'stepped'
                                    ? 'bg-[#00c88c] text-slate-950 font-bold shadow-xs'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                                title="阶梯阶跃波形走势图"
                              >
                                阶梯图
                              </button>
                              <button
                                type="button"
                                onClick={() => setTimeChartStyle('line')}
                                className={`px-2 py-0.5 text-[11px] rounded transition-all cursor-pointer ${
                                  timeChartStyle === 'line'
                                    ? 'bg-[#00c88c] text-slate-950 font-bold shadow-xs'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                                title="脉冲折线散点图"
                              >
                                折线图
                              </button>
                            </div>

                            {/* 时间排序切换按钮: 近期优先(降序) / 正序 */}
                            <button
                              type="button"
                              onClick={() => setStatsTimeSort(prev => prev === 'desc' ? 'asc' : 'desc')}
                              className="px-2 py-1 bg-[#101a36] hover:bg-[#18284e] border border-[#1d2d57] hover:border-[#00c88c] text-[11px] rounded-lg text-teal-300 font-medium transition-colors cursor-pointer flex items-center gap-1"
                              title="点击切换时间排列顺序"
                            >
                              <span>{statsTimeSort === 'desc' ? '按近期排 (降序)' : '按时间排 (正序)'}</span>
                            </button>

                            <select
                              value={statsTimeMetric}
                              onChange={(e) => setStatsTimeMetric(e.target.value as 'amount' | 'company')}
                              className="px-2.5 py-1 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-200 outline-none focus:border-[#00c88c] cursor-pointer"
                            >
                              <option value="amount">按参保金额 (万元)</option>
                              <option value="company">按参保企业数 (家)</option>
                            </select>
                          </div>
                        </div>

                        {/* Summary Badges: 突出近期与最新指标 */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#00c88c] animate-pulse" />
                            <span>起始最新月度: <strong className="text-white font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">2026年10月(近期首位)</strong></span>
                          </span>
                          <span className="font-mono text-emerald-400">
                            当期值: <strong className="font-bold text-white">{statsTimeMetric === 'amount' ? '186万元' : '45家'}</strong> (环比增速 <span className="text-[#00c88c] font-bold">+15.2%</span>)
                          </span>
                        </div>

                        {/* 图表展示区 (根据选中的样式渲染) */}
                        <div className="pt-1 relative">
                          {(() => {
                            const timePoints = (statsTimeSort === 'desc' ? [
                              { month: '26-10', fullDate: '2026年10月(近期/最新)', val: statsTimeMetric === 'amount' ? 186 : 45, growth: '+15.2%', isRecent: true },
                              { month: '26-09', fullDate: '2026年09月', val: statsTimeMetric === 'amount' ? 156 : 38, growth: '+8.4%' },
                              { month: '26-08', fullDate: '2026年08月', val: statsTimeMetric === 'amount' ? 122 : 31, growth: '+6.1%' },
                              { month: '26-07', fullDate: '2026年07月', val: statsTimeMetric === 'amount' ? 116 : 29, growth: '+12.5%' },
                              { month: '26-06', fullDate: '2026年06月', val: statsTimeMetric === 'amount' ? 78 : 22, growth: '-3.2%' },
                              { month: '26-05', fullDate: '2026年05月', val: statsTimeMetric === 'amount' ? 70 : 19, growth: '+4.0%' },
                              { month: '26-04', fullDate: '2026年04月', val: statsTimeMetric === 'amount' ? 58 : 16, growth: '+7.8%' },
                              { month: '26-03', fullDate: '2026年03月', val: statsTimeMetric === 'amount' ? 40 : 12, growth: '+2.1%' },
                              { month: '26-02', fullDate: '2026年02月', val: statsTimeMetric === 'amount' ? 32 : 9, growth: '-5.0%' },
                              { month: '26-01', fullDate: '2026年01月', val: statsTimeMetric === 'amount' ? 25 : 8, growth: '+3.5%' },
                              { month: '25-12', fullDate: '2025年12月', val: statsTimeMetric === 'amount' ? 20 : 6, growth: '+1.2%' },
                              { month: '25-11', fullDate: '2025年11月', val: statsTimeMetric === 'amount' ? 12 : 4, growth: '基准' },
                            ] : [
                              { month: '25-11', fullDate: '2025年11月', val: statsTimeMetric === 'amount' ? 12 : 4, growth: '基准' },
                              { month: '25-12', fullDate: '2025年12月', val: statsTimeMetric === 'amount' ? 20 : 6, growth: '+1.2%' },
                              { month: '26-01', fullDate: '2026年01月', val: statsTimeMetric === 'amount' ? 25 : 8, growth: '+3.5%' },
                              { month: '26-02', fullDate: '2026年02月', val: statsTimeMetric === 'amount' ? 32 : 9, growth: '-5.0%' },
                              { month: '26-03', fullDate: '2026年03月', val: statsTimeMetric === 'amount' ? 40 : 12, growth: '+2.1%' },
                              { month: '26-04', fullDate: '2026年04月', val: statsTimeMetric === 'amount' ? 58 : 16, growth: '+7.8%' },
                              { month: '26-05', fullDate: '2026年05月', val: statsTimeMetric === 'amount' ? 70 : 19, growth: '+4.0%' },
                              { month: '26-06', fullDate: '2026年06月', val: statsTimeMetric === 'amount' ? 78 : 22, growth: '-3.2%' },
                              { month: '26-07', fullDate: '2026年07月', val: statsTimeMetric === 'amount' ? 116 : 29, growth: '+12.5%' },
                              { month: '26-08', fullDate: '2026年08月', val: statsTimeMetric === 'amount' ? 122 : 31, growth: '+6.1%' },
                              { month: '26-09', fullDate: '2026年09月', val: statsTimeMetric === 'amount' ? 156 : 38, growth: '+8.4%' },
                              { month: '26-10', fullDate: '2026年10月(近期/最新)', val: statsTimeMetric === 'amount' ? 186 : 45, growth: '+15.2%', isRecent: true },
                            ]);

                            const maxVal = statsTimeMetric === 'amount' ? 200 : 50;
                            const pts = timePoints.map((item, idx) => ({
                              x: 28 + (idx / (timePoints.length - 1)) * 464,
                              y: 18 + (1 - item.val / maxVal) * 118,
                            }));

                            const linePath = timeChartStyle === 'stepped' ? buildSteppedPath(pts) : buildSmoothPath(pts);
                            const areaPath = pts.length ? `${linePath} L ${pts[pts.length - 1].x} 142 L ${pts[0].x} 142 Z` : '';

                            return (
                              <div className="w-full h-46 relative">
                                <svg viewBox="0 0 520 170" className="w-full h-full overflow-visible">
                                  <defs>
                                    <linearGradient id="timeSplineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#00c88c" stopOpacity="0.45" />
                                      <stop offset="65%" stopColor="#00c88c" stopOpacity="0.10" />
                                      <stop offset="100%" stopColor="#00c88c" stopOpacity="0.0" />
                                    </linearGradient>
                                    <linearGradient id="timeSteppedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.40" />
                                      <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.08" />
                                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                                    </linearGradient>
                                    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                                      <feGaussianBlur stdDeviation="3" result="blur" />
                                      <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                      </feMerge>
                                    </filter>
                                  </defs>

                                  {/* Y 轴背景网格虚线与数值 */}
                                  {[
                                    { tick: statsTimeMetric === 'amount' ? 200 : 50, y: 18 },
                                    { tick: statsTimeMetric === 'amount' ? 150 : 38, y: 49 },
                                    { tick: statsTimeMetric === 'amount' ? 100 : 25, y: 80 },
                                    { tick: statsTimeMetric === 'amount' ? 50 : 12, y: 111 },
                                    { tick: 0, y: 142 },
                                  ].map((grid) => (
                                    <g key={grid.tick}>
                                      <line
                                        x1="28"
                                        y1={grid.y}
                                        x2="492"
                                        y2={grid.y}
                                        stroke="#18284c"
                                        strokeDasharray="3 3"
                                        strokeWidth="1"
                                      />
                                      <text
                                        x="22"
                                        y={grid.y + 3}
                                        textAnchor="end"
                                        fill="#64748b"
                                        fontSize="9"
                                        fontFamily="monospace"
                                      >
                                        {grid.tick}
                                      </text>
                                    </g>
                                  ))}

                                  {/* 渐变平滑/阶梯面积填充 (折线模式不填充底色，专注脉冲线条) */}
                                  {timeChartStyle !== 'line' && (
                                    <path
                                      d={areaPath}
                                      fill={timeChartStyle === 'stepped' ? 'url(#timeSteppedAreaGrad)' : 'url(#timeSplineAreaGrad)'}
                                    />
                                  )}

                                  {/* 主折线 / 阶梯线 */}
                                  <path
                                    d={linePath}
                                    fill="none"
                                    stroke={timeChartStyle === 'stepped' ? '#06b6d4' : '#00c88c'}
                                    strokeWidth={timeChartStyle === 'line' ? '2.5' : '2'}
                                    filter="url(#glowEffect)"
                                    className="transition-all duration-300"
                                  />

                                  {/* 数据点与交互触控区 */}
                                  {pts.map((p, idx) => {
                                    const d = timePoints[idx];
                                    const isHovered = hoveredTimeIdx === idx;
                                    const isRecentCol = d.isRecent;
                                    return (
                                      <g key={d.month} className="group cursor-pointer">
                                        {/* X 轴日期文本 */}
                                        <text
                                          x={p.x}
                                          y="160"
                                          textAnchor="middle"
                                          fill={isHovered ? '#00e699' : isRecentCol ? '#00c88c' : '#94a3b8'}
                                          fontSize={isRecentCol ? '9.5' : '9'}
                                          fontWeight={isRecentCol || isHovered ? 'bold' : 'normal'}
                                          fontFamily="monospace"
                                        >
                                          {d.month}
                                        </text>

                                        {/* 近期突出小标签 */}
                                        {isRecentCol && (
                                          <g>
                                            <rect
                                              x={p.x - 13}
                                              y="145"
                                              width="26"
                                              height="11"
                                              rx="2"
                                              fill="#034832"
                                              stroke="#00c88c"
                                              strokeWidth="0.8"
                                            />
                                            <text
                                              x={p.x}
                                              y="153"
                                              textAnchor="middle"
                                              fill="#00e699"
                                              fontSize="7.5"
                                              fontWeight="bold"
                                            >
                                              近期
                                            </text>
                                          </g>
                                        )}

                                        {/* 垂直指示准线 */}
                                        {isHovered && (
                                          <line
                                            x1={p.x}
                                            y1="18"
                                            x2={p.x}
                                            y2="142"
                                            stroke="#00c88c"
                                            strokeWidth="1"
                                            strokeDasharray="2 2"
                                          />
                                        )}

                                        {/* 数据圆点 / 菱形节点 */}
                                        {timeChartStyle === 'stepped' ? (
                                          <rect
                                            x={p.x - (isHovered ? 5 : 3.5)}
                                            y={p.y - (isHovered ? 5 : 3.5)}
                                            width={isHovered ? 10 : 7}
                                            height={isHovered ? 10 : 7}
                                            transform={`rotate(45 ${p.x} ${p.y})`}
                                            fill="#091126"
                                            stroke={isHovered ? '#38bdf8' : '#06b6d4'}
                                            strokeWidth="2"
                                            className="transition-all duration-200"
                                          />
                                        ) : (
                                          <circle
                                            cx={p.x}
                                            cy={p.y}
                                            r={isHovered ? 5.5 : isRecentCol ? 4.5 : 3.5}
                                            fill={isRecentCol ? '#034832' : '#091126'}
                                            stroke={isHovered ? '#00e699' : isRecentCol ? '#00c88c' : '#10b981'}
                                            strokeWidth={isRecentCol ? '2.5' : '2'}
                                            className="transition-all duration-200"
                                          />
                                        )}

                                        {/* 隐形触发区域 */}
                                        <rect
                                          x={p.x - 18}
                                          y="10"
                                          width="36"
                                          height="150"
                                          fill="transparent"
                                          onMouseEnter={() => setHoveredTimeIdx(idx)}
                                          onMouseLeave={() => setHoveredTimeIdx(null)}
                                        />

                                        {/* 悬停 Tooltip 气泡 */}
                                        {isHovered && (
                                          <g className="animate-in fade-in" pointerEvents="none">
                                            <rect
                                              x={Math.max(10, Math.min(400, p.x - 60))}
                                              y={Math.max(5, p.y - 42)}
                                              width="120"
                                              height="36"
                                              rx="6"
                                              fill="#0a1532"
                                              stroke="#00c88c"
                                              strokeWidth="1.2"
                                              className="drop-shadow-xl"
                                            />
                                            <text
                                              x={Math.max(10, Math.min(400, p.x - 60)) + 60}
                                              y={Math.max(5, p.y - 42) + 14}
                                              textAnchor="middle"
                                              fill="#ffffff"
                                              fontSize="9.5"
                                              fontWeight="bold"
                                            >
                                              {d.fullDate}
                                            </text>
                                            <text
                                              x={Math.max(10, Math.min(400, p.x - 60)) + 60}
                                              y={Math.max(5, p.y - 42) + 28}
                                              textAnchor="middle"
                                              fill="#00c88c"
                                              fontSize="10"
                                              fontWeight="bold"
                                              fontFamily="monospace"
                                            >
                                              {d.val} {statsTimeMetric === 'amount' ? '万元' : '家'} (环比 {d.growth})
                                            </text>
                                          </g>
                                        )}
                                      </g>
                                    );
                                  })}
                                </svg>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* 右下图表: 参保行政区域统计 (提供极坐标玫瑰图 / 横向胶囊条形排行图 · 摆脱传统柱状图) */}
                      <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-lg space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#18284c]">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-3.5 bg-teal-400 rounded-full" />
                            <div className="font-bold text-sm text-white">参保行政区域统计</div>
                            <span className="text-[10px] text-teal-300 font-mono bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/80">
                              {areaChartStyle === 'rose' ? '南丁格尔极坐标玫瑰图' : '横向胶囊对比排行'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* 图表样式切换器 */}
                            <div className="flex items-center bg-[#101a36] p-0.5 rounded-lg border border-[#1d2d57]">
                              <button
                                type="button"
                                onClick={() => setAreaChartStyle('rose')}
                                className={`px-2 py-0.5 text-[11px] rounded transition-all cursor-pointer ${
                                  areaChartStyle === 'rose'
                                    ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                                title="南丁格尔极坐标玫瑰图"
                              >
                                玫瑰分布图
                              </button>
                              <button
                                type="button"
                                onClick={() => setAreaChartStyle('capsule')}
                                className={`px-2 py-0.5 text-[11px] rounded transition-all cursor-pointer ${
                                  areaChartStyle === 'capsule'
                                    ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                                title="全省地市横向胶囊排行条形图"
                              >
                                胶囊排行图
                              </button>
                            </div>

                            {/* 排序切换: 降序 / 行政区划 */}
                            <button
                              type="button"
                              onClick={() => setStatsAreaSort(prev => prev === 'desc' ? 'default' : 'desc')}
                              className="px-2 py-1 bg-[#101a36] hover:bg-[#18284e] border border-[#1d2d57] hover:border-teal-400 text-[11px] rounded-lg text-teal-300 font-medium transition-colors cursor-pointer flex items-center gap-1"
                              title="点击切换行政区划顺序与数值排行"
                            >
                              <span>{statsAreaSort === 'desc' ? '按数值降序' : '标准区划顺序'}</span>
                            </button>

                            <select
                              value={statsAreaMetric}
                              onChange={(e) => setStatsAreaMetric(e.target.value as 'amount' | 'company')}
                              className="px-2.5 py-1 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-200 outline-none focus:border-[#00c88c] cursor-pointer"
                            >
                              <option value="amount">按参保金额 (万元)</option>
                              <option value="company">按参保企业数 (家)</option>
                            </select>
                          </div>
                        </div>

                        {/* 图表展示区: 极坐标玫瑰图 或 横向胶囊条形排行 */}
                        <div className="pt-1">
                          {(() => {
                            const rawList = [
                              { city: '六安市', val: statsAreaMetric === 'amount' ? 168 : 185, percent: '14.2%', color: '#00c88c' },
                              { city: '芜湖市', val: statsAreaMetric === 'amount' ? 158 : 172, percent: '13.3%', color: '#06b6d4' },
                              { city: '淮南市', val: statsAreaMetric === 'amount' ? 124 : 145, percent: '10.5%', color: '#10b981' },
                              { city: '安庆市', val: statsAreaMetric === 'amount' ? 116 : 138, percent: '9.8%', color: '#3b82f6' },
                              { city: '池州市', val: statsAreaMetric === 'amount' ? 100 : 118, percent: '8.4%', color: '#14b8a6' },
                              { city: '蚌埠市', val: statsAreaMetric === 'amount' ? 80 : 96, percent: '6.7%', color: '#8b5cf6' },
                              { city: '亳州市', val: statsAreaMetric === 'amount' ? 80 : 92, percent: '6.7%', color: '#a855f7' },
                              { city: '铜陵市', val: statsAreaMetric === 'amount' ? 70 : 85, percent: '5.9%', color: '#2dd4bf' },
                              { city: '合肥市', val: statsAreaMetric === 'amount' ? 60 : 78, percent: '5.1%', color: '#38bdf8' },
                              { city: '马鞍山市', val: statsAreaMetric === 'amount' ? 38 : 52, percent: '3.2%', color: '#6366f1' },
                              { city: '淮北市', val: statsAreaMetric === 'amount' ? 30 : 45, percent: '2.5%', color: '#4ade80' },
                              { city: '宣城市', val: statsAreaMetric === 'amount' ? 30 : 42, percent: '2.5%', color: '#f59e0b' },
                              { city: '阜阳市', val: statsAreaMetric === 'amount' ? 26 : 38, percent: '2.2%', color: '#fb923c' },
                              { city: '黄山市', val: statsAreaMetric === 'amount' ? 18 : 29, percent: '1.5%', color: '#34d399' },
                              { city: '宿州市', val: statsAreaMetric === 'amount' ? 12 : 21, percent: '1.0%', color: '#6ee7b7' },
                              { city: '滁州市', val: statsAreaMetric === 'amount' ? 8 : 16, percent: '0.7%', color: '#a7f3d0' },
                            ];

                            const stdOrder = ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市'];
                            const sortedList = statsAreaSort === 'desc'
                              ? rawList
                              : [...rawList].sort((a, b) => stdOrder.indexOf(a.city) - stdOrder.indexOf(b.city));

                            const maxVal = statsAreaMetric === 'amount' ? 180 : 200;

                            // 1. 南丁格尔极坐标玫瑰图 (Nightingale Rose Chart)
                            if (areaChartStyle === 'rose') {
                              const cx = 160;
                              const cy = 150;
                              const innerR = 36;
                              const minOuterR = 48;
                              const maxOuterR = 138;
                              const N = sortedList.length;
                              const angleStep = 360 / N;

                              const top8List = sortedList.slice(0, 8);

                              return (
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                  {/* 左侧: SVG 极坐标玫瑰图 */}
                                  <div className="md:col-span-7 flex flex-col items-center justify-center relative">
                                    <div className="w-full max-w-[310px] h-[300px] relative">
                                      <svg viewBox="0 0 320 300" className="w-full h-full overflow-visible">
                                        <defs>
                                          {sortedList.map((item, idx) => (
                                            <radialGradient key={`rose-grad-${idx}`} id={`roseGrad-${idx}`} cx="50%" cy="50%" r="50%">
                                              <stop offset="20%" stopColor={item.color} stopOpacity="0.85" />
                                              <stop offset="90%" stopColor={item.color} stopOpacity="0.35" />
                                              <stop offset="100%" stopColor="#091126" stopOpacity="0.1" />
                                            </radialGradient>
                                          ))}
                                        </defs>

                                        {/* 极坐标背景网格同心环 */}
                                        {[0.3, 0.55, 0.8, 1.0].map((ratio) => (
                                          <circle
                                            key={ratio}
                                            cx={cx}
                                            cy={cy}
                                            r={innerR + (maxOuterR - innerR) * ratio}
                                            fill="none"
                                            stroke="#18284c"
                                            strokeWidth="1"
                                            strokeDasharray="3 3"
                                          />
                                        ))}

                                        {/* 玫瑰花瓣扇区 Path */}
                                        {sortedList.map((item, idx) => {
                                          const rank = idx + 1;
                                          const r = minOuterR + (item.val / maxVal) * (maxOuterR - minOuterR);
                                          const a1 = (idx * angleStep) - 90;
                                          const a2 = ((idx + 1) * angleStep) - 90 - 1.5;
                                          const rad1 = (a1 * Math.PI) / 180;
                                          const rad2 = (a2 * Math.PI) / 180;

                                          const isHovered = hoveredRoseCity?.city === item.city;
                                          const activeR = isHovered ? r + 6 : r;

                                          const x1 = cx + innerR * Math.cos(rad1);
                                          const y1 = cy + innerR * Math.sin(rad1);
                                          const x2 = cx + activeR * Math.cos(rad1);
                                          const y2 = cy + activeR * Math.sin(rad1);
                                          const x3 = cx + activeR * Math.cos(rad2);
                                          const y3 = cy + activeR * Math.sin(rad2);
                                          const x4 = cx + innerR * Math.cos(rad2);
                                          const y4 = cy + innerR * Math.sin(rad2);

                                          // 扇区路径
                                          const petalPath = `M ${x1} ${y1} L ${x2} ${y2} A ${activeR} ${activeR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1} Z`;

                                          // 扇区外部文字标签定位 (取中间角度)
                                          const midRad = ((a1 + a2) / 2 * Math.PI) / 180;
                                          const labelR = activeR + 13;
                                          const lx = cx + labelR * Math.cos(midRad);
                                          const ly = cy + labelR * Math.sin(midRad);

                                          return (
                                            <g
                                              key={item.city}
                                              className="group cursor-pointer transition-all duration-300"
                                              onMouseEnter={() => setHoveredRoseCity({ city: item.city, val: item.val, percent: item.percent, rank, color: item.color })}
                                              onMouseLeave={() => setHoveredRoseCity(null)}
                                            >
                                              <path
                                                d={petalPath}
                                                fill={`url(#roseGrad-${idx})`}
                                                stroke={isHovered ? '#ffffff' : item.color}
                                                strokeWidth={isHovered ? '2' : '1'}
                                                className="transition-all duration-300 filter group-hover:brightness-125"
                                              />

                                              {/* 外部地市微型标签 (仅展示数值较高或悬停的城市以保页面清爽) */}
                                              {(rank <= 8 || isHovered) && (
                                                <text
                                                  x={lx}
                                                  y={ly + 3}
                                                  textAnchor="middle"
                                                  fill={isHovered ? '#ffffff' : item.color}
                                                  fontSize={isHovered ? '9.5' : '8'}
                                                  fontWeight={isHovered ? 'bold' : 'normal'}
                                                  className="pointer-events-none select-none font-sans drop-shadow-sm"
                                                >
                                                  {item.city.slice(0, 2)}
                                                </text>
                                              )}
                                            </g>
                                          );
                                        })}

                                        {/* 中心空心圆与数据指示 */}
                                        <circle
                                          cx={cx}
                                          cy={cy}
                                          r={innerR - 2}
                                          fill="#070d1e"
                                          stroke="#18284c"
                                          strokeWidth="2"
                                        />

                                        {/* 中心悬停/汇总内容 */}
                                        <g pointerEvents="none">
                                          {hoveredRoseCity ? (
                                            <>
                                              <text x={cx} y={cy - 12} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                                                {hoveredRoseCity.city}
                                              </text>
                                              <text x={cx} y={cy + 3} textAnchor="middle" fill={hoveredRoseCity.color} fontSize="11" fontWeight="bold" fontFamily="monospace">
                                                {hoveredRoseCity.val}{statsAreaMetric === 'amount' ? '万' : '家'}
                                              </text>
                                              <text x={cx} y={cy + 16} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                                                TOP {hoveredRoseCity.rank} · {hoveredRoseCity.percent}
                                              </text>
                                            </>
                                          ) : (
                                            <>
                                              <text x={cx} y={cy - 8} textAnchor="middle" fill="#94a3b8" fontSize="9">
                                                16地市分布
                                              </text>
                                              <text x={cx} y={cy + 7} textAnchor="middle" fill="#00c88c" fontSize="11" fontWeight="bold" fontFamily="monospace">
                                                {statsAreaMetric === 'amount' ? '1,184万' : '1,480家'}
                                              </text>
                                              <text x={cx} y={cy + 18} textAnchor="middle" fill="#64748b" fontSize="7.5">
                                                极坐标玫瑰
                                              </text>
                                            </>
                                          )}
                                        </g>
                                      </svg>
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                      <span>花瓣半径大小映射地市投保规模</span>
                                    </div>
                                  </div>

                                  {/* 右侧: 全省 TOP 8 精英地市排行卡片 */}
                                  <div className="md:col-span-5 space-y-2">
                                    <div className="text-[11px] font-bold text-slate-200 flex items-center justify-between pb-1 border-b border-[#18284c]">
                                      <span>全省头部梯队对比</span>
                                      <span className="text-[10px] text-slate-400 font-mono">占比 / 数值</span>
                                    </div>
                                    <div className="space-y-1.5">
                                      {top8List.map((item, idx) => {
                                        const rank = idx + 1;
                                        const isHovered = hoveredRoseCity?.city === item.city;
                                        return (
                                          <div
                                            key={item.city}
                                            onMouseEnter={() => setHoveredRoseCity({ city: item.city, val: item.val, percent: item.percent, rank, color: item.color })}
                                            onMouseLeave={() => setHoveredRoseCity(null)}
                                            className={`flex items-center justify-between p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                                              isHovered ? 'bg-[#15254a] border border-[#00c88c]' : 'bg-[#0c152d] border border-[#18284c] hover:bg-[#101b38]'
                                            }`}
                                          >
                                            <div className="flex items-center gap-2">
                                              <span
                                                className={`w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold text-[9px] ${
                                                  rank === 1
                                                    ? 'bg-amber-400 text-slate-950 font-black'
                                                    : rank === 2
                                                    ? 'bg-slate-300 text-slate-950 font-black'
                                                    : rank === 3
                                                    ? 'bg-amber-600 text-white font-bold'
                                                    : 'bg-[#1a2d59] text-slate-300'
                                                }`}
                                              >
                                                {rank}
                                              </span>
                                              <span className="font-medium text-slate-200 text-[11px]">{item.city}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-[10px] font-mono text-slate-400">{item.percent}</span>
                                              <span className="font-mono font-bold text-teal-300 text-[11px]">
                                                {item.val} <span className="text-[9px] text-slate-400">{statsAreaMetric === 'amount' ? '万' : '家'}</span>
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // 2. 横向胶囊条形排行图 (16 地市横向对比)
                            const leftCol = sortedList.slice(0, 8);
                            const rightCol = sortedList.slice(8, 16);

                            const renderItem = (item: typeof rawList[0], globalIdx: number) => {
                              const rank = globalIdx + 1;
                              const barPercent = Math.min(100, Math.max(10, (item.val / maxVal) * 100));
                              return (
                                <div key={item.city} className="flex items-center gap-2 group py-1 text-xs">
                                  {/* 排名标牌 */}
                                  <span
                                    className={`w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                                      rank === 1
                                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs shadow-amber-500/50'
                                        : rank === 2
                                        ? 'bg-slate-300 text-slate-950 font-black'
                                        : rank === 3
                                        ? 'bg-amber-700 text-white font-bold'
                                        : 'bg-[#152347] text-slate-400 border border-[#1f3468]'
                                    }`}
                                  >
                                    {rank}
                                  </span>

                                  {/* 地市名称 */}
                                  <span className="w-12 text-slate-300 font-medium shrink-0 truncate text-[11px]">
                                    {item.city}
                                  </span>

                                  {/* 横向胶囊条形轨道 */}
                                  <div className="flex-1 h-3.5 bg-[#0a142e] rounded-full overflow-hidden p-0.5 border border-[#18284c] flex items-center">
                                    <div
                                      style={{ width: `${barPercent}%` }}
                                      className="h-full rounded-full bg-gradient-to-r from-teal-600 via-emerald-500 to-[#00c88c] transition-all duration-500 group-hover:brightness-125 group-hover:shadow-[0_0_8px_rgba(0,200,140,0.6)]"
                                    />
                                  </div>

                                  {/* 数值与占比 */}
                                  <div className="w-16 text-right font-mono shrink-0">
                                    <span className="text-emerald-400 font-bold text-[11px]">{item.val}</span>
                                    <span className="text-slate-500 text-[10px] ml-0.5">{statsAreaMetric === 'amount' ? '万' : '家'}</span>
                                  </div>
                                </div>
                              );
                            };

                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-0.5">
                                <div className="space-y-1">
                                  {leftCol.map((item, idx) => renderItem(item, idx))}
                                </div>
                                <div className="space-y-1">
                                  {rightCol.map((item, idx) => renderItem(item, idx + 8))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* TAB CONTENT 4: 增收管理 */}
        {activeTopTab === 'income' && (
          <>
            {/* Left Submenu Navigation matching ProjectDevView & CarbonFinanceView dark enterprise style */}
            <aside className="w-full md:w-56 shrink-0 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md p-4 self-start space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-emerald-900/60 text-xs font-bold text-white">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>增收利用业务分类</span>
              </div>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveIncomeSubTab('idle_land');
                    setLandPage(1);
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 cursor-pointer font-medium ${
                    activeIncomeSubTab === 'idle_land'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-300 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeIncomeSubTab === 'idle_land' ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span>闲荒地登记</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveIncomeSubTab('revitalize');
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 cursor-pointer font-medium ${
                    activeIncomeSubTab === 'revitalize'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-300 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeIncomeSubTab === 'revitalize' ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span>盘活利用</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveIncomeSubTab('income_stats');
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 cursor-pointer font-medium ${
                    activeIncomeSubTab === 'income_stats'
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 text-emerald-300 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeIncomeSubTab === 'income_stats' ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span>增收统计</span>
                </button>
              </div>

              {/* Quick Summary Pill in Sidebar */}
              <div className="pt-3 border-t border-emerald-900/60 text-[11px] text-slate-400 space-y-2">
                <div className="flex justify-between">
                  <span>累计登记闲荒地:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {idleLands.reduce((acc, curr) => acc + curr.areaMu, 0)} 亩
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>待盘活流转:</span>
                  <span className="font-mono text-teal-300">
                    {idleLands.filter((l) => l.utilizationStatus !== '租借中').reduce((a, b) => a + b.areaMu, 0)} 亩
                  </span>
                </div>
              </div>
            </aside>

            {/* Right Main Content Area */}
            <section className="flex-1 space-y-5 min-w-0">
              {activeIncomeSubTab === 'idle_land' && (
                <>
                  {/* Card 1: 筛选搜索 (与碳汇项目开发管理完全统一的检索面板) */}
                  <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-white tracking-wide">
                          闲荒地登记检索与精准筛选
                        </span>
                        <span className="text-xs text-slate-500">|</span>
                        <span className="text-xs text-emerald-400/90 font-mono">
                          时间默认降序排列（近期登记在先）
                        </span>
                      </div>

                      {/* Top Right Action Buttons: + 新增闲荒地登记, 批量导出 */}
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={handleOpenAddLandModalCleared}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ 新增闲荒地登记</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            triggerToast(`正在导出 ${filteredIdleLands.length} 条闲荒地登记数据清单 (XLSX)...`);
                            setTimeout(() => {
                              triggerToast('导出完成，请在浏览器下载目录查收「闲荒地登记清单_2026.xlsx」');
                            }, 800);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          title="导出筛选结果为 Excel"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>批量导出</span>
                        </button>
                      </div>
                    </div>

                    {/* Form Controls Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                      {/* 所属行政区划 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">所属行政区划</label>
                        <select
                          value={landRegionFilter}
                          onChange={(e) => {
                            setLandRegionFilter(e.target.value);
                            setLandPage(1);
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                        >
                          <option value="all">全区县 (全部)</option>
                          <option value="包河区">合肥市 包河区</option>
                          <option value="肥西县">合肥市 肥西县</option>
                          <option value="庐阳区">合肥市 庐阳区</option>
                          <option value="肥东县">合肥市 肥东县</option>
                          <option value="高新区">合肥市 高新区</option>
                          <option value="休宁县">黄山市 休宁县</option>
                          <option value="岳西县">安庆市 岳西县</option>
                        </select>
                      </div>

                      {/* 登记方名称 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">登记方主体</label>
                        <input
                          type="text"
                          value={landRegistrantFilter}
                          onChange={(e) => {
                            setLandRegistrantFilter(e.target.value);
                            setLandPage(1);
                          }}
                          placeholder="合作社 / 村委会..."
                          className="w-full px-3 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      {/* 地块名称 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">地块名称</label>
                        <input
                          type="text"
                          value={landNameFilter}
                          onChange={(e) => {
                            setLandNameFilter(e.target.value);
                            setLandPage(1);
                          }}
                          placeholder="搜索地块名称..."
                          className="w-full px-3 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      {/* 利用状态 */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">利用状态</label>
                        <select
                          value={landStatusFilter}
                          onChange={(e) => {
                            setLandStatusFilter(e.target.value);
                            setLandPage(1);
                          }}
                          className="w-full px-3 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                        >
                          <option value="all">全部状态</option>
                          <option value="荒废中">荒废中</option>
                          <option value="闲置中">闲置中</option>
                          <option value="租借中">租借中</option>
                        </select>
                      </div>

                      {/* 登记日期 & 重置 */}
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-[11px] text-slate-400 mb-1">登记日期检索</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={landDateFilter}
                              onChange={(e) => {
                                setLandDateFilter(e.target.value);
                                setLandPage(1);
                              }}
                              placeholder="2026-10..."
                              className="w-full pl-3 pr-7 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setLandRegionFilter('all');
                            setLandRegistrantFilter('');
                            setLandNameFilter('');
                            setLandStatusFilter('all');
                            setLandDateFilter('');
                            setLandPage(1);
                            triggerToast('已重置所有检索筛选条件');
                          }}
                          className="p-1.5 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="重置检索条件"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Main Data Table Container (与碳汇项目开发管理完全统一的高规格企业表格) */}
                  <div className="bg-slate-950/90 border border-emerald-950/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                    {/* Table Header Controls */}
                    <div className="px-5 py-3 border-b border-emerald-950 flex flex-wrap items-center justify-between gap-2 bg-slate-900/50">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>查询结果：共检索到</span>
                        <span className="font-mono text-emerald-400 font-bold text-sm">
                          {filteredIdleLands.length}
                        </span>
                        <span>宗闲荒地块</span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>数据已实时更新 · 支持林权流转租赁与碳汇造林资产化对接</span>
                      </div>
                    </div>

                    {/* Responsive Table Body */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-emerald-950 bg-slate-900/80 text-slate-400 font-medium">
                            <th className="py-3 px-3 w-12 text-center text-slate-500">序号</th>
                            <th className="py-3 px-3 min-w-[130px]">所属行政区划</th>
                            <th className="py-3 px-4 min-w-[200px]">地块名称</th>
                            <th className="py-3 px-3 min-w-[100px] text-right">地块面积</th>
                            <th className="py-3 px-3 min-w-[200px]">登记方主体</th>
                            <th className="py-3 px-3 min-w-[100px]">土地情况</th>
                            <th className="py-3 px-3 min-w-[100px] text-right">出借期限</th>
                            <th className="py-3 px-3 min-w-[120px] text-right">意向价格</th>
                            <th className="py-3 px-3 min-w-[100px] text-center">利用状态</th>
                            <th className="py-3 px-3 min-w-[130px]">登记日期</th>
                            <th className="py-3 px-4 min-w-[140px] text-center">操作</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/60">
                          {displayedIdleLands.length === 0 ? (
                            <tr>
                              <td colSpan={11} className="py-12 text-center text-slate-500">
                                <div className="flex flex-col items-center gap-2">
                                  <TreePine className="w-8 h-8 text-slate-600" />
                                  <span>未查找到符合条件的闲荒地登记记录</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setLandRegionFilter('all');
                                      setLandRegistrantFilter('');
                                      setLandNameFilter('');
                                      setLandStatusFilter('all');
                                      setLandDateFilter('');
                                      setLandPage(1);
                                    }}
                                    className="mt-1 text-xs text-emerald-400 hover:underline cursor-pointer"
                                  >
                                    清空筛选重置列表
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            displayedIdleLands.map((item, idx) => {
                              const rowGlobalIndex = (landPage - 1) * landPageSize + idx + 1;

                              return (
                                <tr
                                  key={item.id}
                                  className="transition-colors group hover:bg-emerald-950/30 text-slate-300"
                                >
                                  {/* 序号 */}
                                  <td className="py-3.5 px-3 text-center font-mono text-slate-400">
                                    {rowGlobalIndex}
                                  </td>

                                  {/* 行政区划 */}
                                  <td className="py-3.5 px-3">
                                    <span className="text-slate-300 font-medium whitespace-nowrap">
                                      {item.region}
                                    </span>
                                  </td>

                                  {/* 地块名称 */}
                                  <td className="py-3.5 px-4">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedIdleLand(item)}
                                      className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                                    >
                                      <TreePine className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                      <span>{item.parcelName}</span>
                                    </button>
                                  </td>

                                  {/* 地块面积 */}
                                  <td className="py-3.5 px-3 text-right">
                                    <div className="font-mono font-bold text-slate-200">
                                      {item.areaMu.toLocaleString()}
                                      <span className="text-[10px] font-sans text-slate-400 ml-0.5">亩</span>
                                    </div>
                                  </td>

                                  {/* 登记方主体 */}
                                  <td className="py-3.5 px-3">
                                    <div className="text-slate-300 font-normal truncate max-w-[200px]" title={item.registrantName}>
                                      {item.registrantName}
                                    </div>
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                      <span>联系人: {item.contactPerson || '村委会'}</span>
                                      <span className="text-slate-600">·</span>
                                      <span>{item.contactPhone || '138****6688'}</span>
                                    </div>
                                  </td>

                                  {/* 土地情况 */}
                                  <td className="py-3.5 px-3">
                                    <span className="text-slate-300 whitespace-nowrap font-medium">
                                      {item.landCondition}
                                    </span>
                                  </td>

                                  {/* 出借期限 */}
                                  <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                                    {item.leaseTermYears} <span className="text-[10px] font-sans text-slate-500">年</span>
                                  </td>

                                  {/* 意向价格 */}
                                  <td className="py-3.5 px-3 text-right font-mono">
                                    <span className="font-bold text-emerald-400">￥{item.expectedPrice}</span>
                                    <span className="text-[10px] font-sans text-slate-400 ml-0.5">元/亩</span>
                                  </td>

                                  {/* 利用状态 Badge (统一胶囊样式) */}
                                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                                        item.utilizationStatus === '租借中'
                                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                          : item.utilizationStatus === '闲置中'
                                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                          : 'bg-slate-700/40 text-slate-300 border-slate-600/50'
                                      }`}
                                    >
                                      {item.utilizationStatus}
                                    </span>
                                  </td>

                                  {/* 登记日期 */}
                                  <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px] whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                      <Calendar className="w-3 h-3 text-emerald-500 shrink-0" />
                                      <span>{item.registerDate}</span>
                                    </div>
                                  </td>

                                  {/* 操作按钮 (与碳汇项目开发管理完全统一) */}
                                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => setSelectedIdleLand(item)}
                                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors text-[11px] font-medium cursor-pointer"
                                        title="查看地块详细信息"
                                      >
                                        详情
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleOpenEditLandModal(item)}
                                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium cursor-pointer"
                                        title="编辑地块信息"
                                      >
                                        编辑
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteLand(item.id, item.parcelName)}
                                        className="p-1 rounded hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                        title="删除登记记录"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Table Bottom: Pagination & Info (与碳汇项目开发管理完全统一) */}
                    <div className="p-4 border-t border-emerald-950 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span>
                          显示第{' '}
                          <span className="text-white font-mono">
                            {filteredIdleLands.length === 0 ? 0 : (landPage - 1) * landPageSize + 1}
                          </span>{' '}
                          至{' '}
                          <span className="text-white font-mono">
                            {Math.min(landPage * landPageSize, filteredIdleLands.length)}
                          </span>{' '}
                          条，共 <span className="text-white font-mono">{filteredIdleLands.length}</span> 条
                        </span>
                        <span className="text-slate-600">|</span>
                        <div className="flex items-center gap-1.5">
                          <span>每页</span>
                          <select
                            value={landPageSize}
                            onChange={(e) => {
                              setLandPageSize(Number(e.target.value));
                              setLandPage(1);
                            }}
                            className="px-2 py-0.5 bg-slate-900 border border-emerald-950 rounded text-slate-200 text-xs outline-none focus:border-emerald-500 font-mono cursor-pointer"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </select>
                          <span>条</span>
                        </div>
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center gap-1.5 font-mono">
                        <button
                          type="button"
                          disabled={landPage <= 1}
                          onClick={() => setLandPage((prev) => Math.max(1, prev - 1))}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
                        >
                          上一页
                        </button>

                        {Array.from({ length: totalLandPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setLandPage(pageNum)}
                            className={`w-7 h-7 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                              landPage === pageNum
                                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        <button
                          type="button"
                          disabled={landPage >= totalLandPages}
                          onClick={() => setLandPage((prev) => Math.min(totalLandPages, prev + 1))}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
                        >
                          下一页
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 盘活利用 Sub-tab (依据用户上传截图 image_a7e45871.png 100% 还原, 统一暗色科技背景, 真实数据无XXX, 近期时间) */}
              {activeIncomeSubTab === 'revitalize' && (
                <div className="space-y-4">
                  {/* Card 1: 筛选搜索 (对应截图筛选搜索区域) */}
                  <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-xl shadow-xl backdrop-blur-md space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-3.5 bg-[#00c88c] rounded-full inline-block" />
                      <span className="font-bold text-xs text-slate-100">筛选搜索</span>
                    </div>

                    {/* Filter Inputs Grid: Row 1 */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      {/* 所属行政区划 */}
                      <div className="flex items-center gap-2">
                        <label className="text-slate-300 text-xs shrink-0 font-normal">所属行政区划</label>
                        <select
                          value={revitalizeDistrictFilter}
                          onChange={(e) => {
                            setRevitalizeDistrictFilter(e.target.value);
                            setRevitalizePage(1);
                          }}
                          className="w-44 px-3 py-1.5 bg-[#101a36] border border-[#1d2d57] rounded text-xs text-slate-100 focus:outline-none focus:border-[#00c88c] cursor-pointer"
                        >
                          <option value="all">请选择</option>
                          <option value="肥西县">合肥市 肥西县</option>
                          <option value="庐阳区">合肥市 庐阳区</option>
                          <option value="肥东县">合肥市 肥东县</option>
                          <option value="高新区">合肥市 高新区</option>
                          <option value="蜀山区">合肥市 蜀山区</option>
                          <option value="包河区">合肥市 包河区</option>
                        </select>
                      </div>

                      {/* 登记方名称 */}
                      <div className="flex items-center gap-2">
                        <label className="text-slate-300 text-xs shrink-0 font-normal">登记方名称</label>
                        <input
                          type="text"
                          value={revitalizeRegistrantFilter}
                          onChange={(e) => {
                            setRevitalizeRegistrantFilter(e.target.value);
                            setRevitalizePage(1);
                          }}
                          className="w-44 px-3 py-1.5 bg-[#101a36] border border-[#1d2d57] rounded text-xs text-slate-100 focus:outline-none focus:border-[#00c88c]"
                        />
                      </div>

                      {/* 地块名称 */}
                      <div className="flex items-center gap-2">
                        <label className="text-slate-300 text-xs shrink-0 font-normal">地块名称</label>
                        <input
                          type="text"
                          value={revitalizeLandNameFilter}
                          onChange={(e) => {
                            setRevitalizeLandNameFilter(e.target.value);
                            setRevitalizePage(1);
                          }}
                          className="w-44 px-3 py-1.5 bg-[#101a36] border border-[#1d2d57] rounded text-xs text-slate-100 focus:outline-none focus:border-[#00c88c]"
                        />
                      </div>

                      {/* 租借方名称 */}
                      <div className="flex items-center gap-2">
                        <label className="text-slate-300 text-xs shrink-0 font-normal">租借方名称</label>
                        <input
                          type="text"
                          value={revitalizeLesseeFilter}
                          onChange={(e) => {
                            setRevitalizeLesseeFilter(e.target.value);
                            setRevitalizePage(1);
                          }}
                          className="w-44 px-3 py-1.5 bg-[#101a36] border border-[#1d2d57] rounded text-xs text-slate-100 focus:outline-none focus:border-[#00c88c]"
                        />
                      </div>

                      {/* Action buttons (搜索 / 重置) */}
                      <div className="flex items-center gap-2.5 ml-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setRevitalizePage(1);
                            triggerToast(`已检索到 ${filteredRevitalizeLeases.length} 条盘活利用数据`);
                          }}
                          className="px-4 py-1.5 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>搜索</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRevitalizeDistrictFilter('all');
                            setRevitalizeRegistrantFilter('');
                            setRevitalizeLandNameFilter('');
                            setRevitalizeLesseeFilter('');
                            setRevitalizeDateFilter('');
                            setRevitalizePage(1);
                            triggerToast('已重置所有检索筛选条件');
                          }}
                          className="px-4 py-1.5 bg-[#596579] hover:bg-[#6b798e] text-white font-medium rounded text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>重置</span>
                        </button>
                      </div>
                    </div>

                    {/* Filter Inputs Grid: Row 2 */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      {/* 交易日期 */}
                      <div className="flex items-center gap-2">
                        <label className="text-slate-300 text-xs shrink-0 font-normal">交易日期</label>
                        <div className="relative w-44">
                          <input
                            type="text"
                            value={revitalizeDateFilter}
                            onChange={(e) => {
                              setRevitalizeDateFilter(e.target.value);
                              setRevitalizePage(1);
                            }}
                            placeholder="请选择日期范围"
                            className="w-full pl-3 pr-8 py-1.5 bg-[#101a36] border border-[#1d2d57] rounded text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00c88c] font-mono"
                          />
                          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* 新增租借按钮 */}
                      <button
                        type="button"
                        onClick={handleOpenAddLease}
                        className="px-4 py-1.5 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>新增租借</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 2: 数据列表 (对应截图表格) */}
                  <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-xl shadow-xl backdrop-blur-md space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-3.5 bg-[#00c88c] rounded-full inline-block" />
                      <span className="font-bold text-xs text-slate-100">数据列表</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-[#18284c] bg-[#0c1630] text-slate-300 font-medium">
                            <th className="py-3 px-3 w-12 text-center text-slate-400">序号</th>
                            <th className="py-3 px-3 min-w-[130px]">所属行政区划</th>
                            <th className="py-3 px-4 min-w-[190px]">地块名称</th>
                            <th className="py-3 px-3 min-w-[105px] text-right">地块面积(亩)</th>
                            <th className="py-3 px-4 min-w-[210px]">登记方名称</th>
                            <th className="py-3 px-4 min-w-[210px]">租借方名称</th>
                            <th className="py-3 px-3 min-w-[100px] text-right">租借期限(年)</th>
                            <th className="py-3 px-3 min-w-[110px] text-right">租借价格(元/亩)</th>
                            <th className="py-3 px-3 min-w-[110px] text-center">交易日期</th>
                            <th className="py-3 px-3 min-w-[110px] text-right">社会增收(元)</th>
                            <th className="py-3 px-3 min-w-[110px] text-center">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#18284c]/60 text-slate-200">
                          {displayedRevitalizeLeases.length === 0 ? (
                            <tr>
                              <td colSpan={11} className="py-12 text-center text-slate-500">
                                暂无符合条件的盘活租借数据
                              </td>
                            </tr>
                          ) : (
                            displayedRevitalizeLeases.map((item, idx) => (
                              <tr key={item.id} className="hover:bg-[#0e1c3e] transition-colors">
                                <td className="py-3 px-3 text-center font-mono text-slate-400">
                                  {(revitalizePage - 1) * revitalizePageSize + idx + 1}
                                </td>
                                <td className="py-3 px-3 text-slate-300">{item.region}</td>
                                <td className="py-3 px-4 font-medium">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedLeaseDetail(item)}
                                    className="text-[#00c88c] hover:underline cursor-pointer text-left"
                                  >
                                    {item.landName}
                                  </button>
                                </td>
                                <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                                  {item.areaMu}
                                </td>
                                <td className="py-3 px-4 text-slate-300">{item.registrantName}</td>
                                <td className="py-3 px-4 text-slate-300">{item.lesseeName}</td>
                                <td className="py-3 px-3 text-right font-mono text-slate-200">
                                  {item.leaseTermYears}
                                </td>
                                <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                                  {item.leasePrice}
                                </td>
                                <td className="py-3 px-3 text-center font-mono text-slate-300">
                                  {item.dealDate}
                                </td>
                                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                                  {item.socialIncome.toLocaleString()}
                                </td>
                                <td className="py-3 px-3 text-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditLease(item)}
                                    className="text-[#00c88c] hover:underline cursor-pointer mr-3"
                                  >
                                    编辑
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLease(item.id, item.landName)}
                                    className="text-[#00c88c] hover:underline cursor-pointer"
                                  >
                                    删除
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination: 对应截图样式 */}
                    <div className="pt-3 border-t border-[#18284c] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>共 <strong className="text-emerald-400 font-mono font-bold">{filteredRevitalizeLeases.length}</strong> 条数据</span>
                        <span className="text-slate-500">每页</span>
                        <span className="px-2 py-0.5 rounded border border-[#1d2d57] bg-[#101a36] text-slate-200 font-mono">
                          10
                        </span>
                        <span>条</span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono">
                        <button
                          type="button"
                          disabled={revitalizePage <= 1}
                          onClick={() => setRevitalizePage((p) => Math.max(1, p - 1))}
                          className="px-2 py-1 rounded border border-[#1d2d57] bg-[#101a36] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          &lt;
                        </button>
                        {Array.from({ length: totalRevitalizePages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setRevitalizePage(pageNum)}
                            className={`min-w-[28px] h-7 rounded text-xs font-bold transition-colors cursor-pointer ${
                              revitalizePage === pageNum
                                ? 'bg-[#00c88c] text-slate-950 font-bold'
                                : 'border border-[#1d2d57] bg-[#101a36] text-slate-300 hover:bg-[#1a2d58]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                        <button
                          type="button"
                          disabled={revitalizePage >= totalRevitalizePages}
                          onClick={() => setRevitalizePage((p) => Math.min(totalRevitalizePages, p + 1))}
                          className="px-2 py-1 rounded border border-[#1d2d57] bg-[#101a36] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 增收统计 Sub-tab (暗色系企业风格统一) */}
              {activeIncomeSubTab === 'income_stats' && (
                <RevenueStatsView />
              )}
            </section>
          </>
        )}
      </main>

      {/* ARTICLE DETAIL MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-950 text-slate-100 rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-900 overflow-hidden flex flex-col max-h-[88vh]">
            <div className="px-6 py-4 border-b border-emerald-900/80 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>碳汇资讯详情</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed font-sans">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 pb-3 border-b border-emerald-950 font-mono">
                <span>发布日期: {selectedArticle.fullDate}</span>
                <span>来源: {selectedArticle.author}</span>
                <span>浏览量: {selectedArticle.views}</span>
              </div>

              <div className="w-full h-52 rounded-xl overflow-hidden bg-slate-900 border border-emerald-900/80">
                <img
                  src={selectedArticle.coverUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-slate-300 whitespace-pre-line leading-relaxed text-xs">
                {selectedArticle.fullContent || selectedArticle.excerpt}
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-emerald-900/80 bg-slate-900/90 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">碳汇金融服务系统 · 资讯中心</span>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-xs cursor-pointer active:scale-95"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 查看/详情 贷款产品 */}
      {selectedLoanProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-950 text-slate-100 rounded-2xl shadow-2xl max-w-xl w-full border border-emerald-900 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-emerald-900/80 flex items-center justify-between bg-slate-900/90">
              <span className="font-bold text-sm text-white">贷款产品详情</span>
              <button
                type="button"
                onClick={() => setSelectedLoanProduct(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-emerald-900/80 space-y-2">
                <div className="text-sm font-bold text-emerald-400">{selectedLoanProduct.productName}</div>
                <div className="text-slate-400 font-mono">{selectedLoanProduct.bankName}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <span className="text-slate-500">产品类型:</span> <span className="text-emerald-300 font-bold ml-1">{selectedLoanProduct.productType}</span>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <span className="text-slate-500">贷款利率:</span> <span className="text-teal-300 font-bold font-mono ml-1">{selectedLoanProduct.interestRate}%</span>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <span className="text-slate-500">贷款期限:</span> <span className="text-slate-200 font-mono ml-1">{selectedLoanProduct.loanTermYears} 年</span>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <span className="text-slate-500">还款方式:</span> <span className="text-slate-200 ml-1">{selectedLoanProduct.repaymentMethod}</span>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 col-span-2">
                  <span className="text-slate-500">最大授信金额:</span> <span className="text-emerald-400 font-bold font-mono ml-1">￥{selectedLoanProduct.maxLoanAmount.toLocaleString()} 元</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                <div className="text-slate-400 mb-1 font-medium">产品说明:</div>
                {selectedLoanProduct.description}
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-emerald-900/80 bg-slate-900/90 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">发布日期: {selectedLoanProduct.publishDate}</span>
              <button
                type="button"
                onClick={() => {
                  triggerToast(`已发起「${selectedLoanProduct.productName}」的线上预质押授信申请！`);
                  setSelectedLoanProduct(null);
                }}
                className="px-6 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg shadow-md cursor-pointer active:scale-95"
              >
                立即申请
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 新增/编辑 贷款产品 (点击新增时所有数据完全清空) */}
      {isAddLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-xl w-full border border-[#18284c] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#18284c]/80 flex items-center justify-between">
              <span className="font-bold text-base text-white tracking-wide">
                {editingLoanProduct ? '编辑贷款产品' : '新增贷款产品'}
              </span>
              <button
                type="button"
                onClick={() => setIsAddLoanModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLoanProduct} className="p-6 space-y-4 text-xs font-sans max-h-[82vh] overflow-y-auto">
              <div>
                <label className="block text-[11px] text-slate-200 mb-1">
                  <span className="text-rose-500 mr-1">*</span>所属金融机构
                </label>
                <select
                  value={loanForm.bankName || ''}
                  onChange={(e) => setLoanForm({ ...loanForm, bankName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] cursor-pointer"
                  required
                >
                  <option value="">请选择所属金融机构</option>
                  <option value="中国农业银行合肥分行">中国农业银行合肥分行</option>
                  <option value="徽商银行合肥分行">徽商银行合肥分行</option>
                  <option value="国家开发银行安徽省分行">国家开发银行安徽省分行</option>
                  <option value="中国工商银行合肥高新支行">中国工商银行合肥高新支行</option>
                  <option value="中国邮政储蓄银行肥西县支行">中国邮政储蓄银行肥西县支行</option>
                  <option value="兴业银行合肥分行">兴业银行合肥分行</option>
                  <option value="招商银行合肥蜀山支行">招商银行合肥蜀山支行</option>
                  <option value="安徽农村商业银行肥东支行">安徽农村商业银行肥东支行</option>
                  <option value="中国建设银行合肥庐阳支行">中国建设银行合肥庐阳支行</option>
                  <option value="浦发银行合肥分行">浦发银行合肥分行</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-200 mb-1">
                  <span className="text-rose-500 mr-1">*</span>贷款产品名称
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入贷款产品名称"
                  value={loanForm.productName || ''}
                  onChange={(e) => setLoanForm({ ...loanForm, productName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">产品类型</label>
                  <select
                    value={loanForm.productType || ''}
                    onChange={(e) => setLoanForm({ ...loanForm, productType: e.target.value })}
                    className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] cursor-pointer"
                  >
                    <option value="">请选择产品类型</option>
                    <option value="质押贷">质押贷</option>
                    <option value="信用贷">信用贷</option>
                    <option value="抵押贷">抵押贷</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">贷款利率 (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="例如：3.85"
                    value={loanForm.interestRate ?? ''}
                    onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] font-mono placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">贷款期限 (年)</label>
                  <input
                    type="number"
                    placeholder="例如：10"
                    value={loanForm.loanTermYears ?? ''}
                    onChange={(e) => setLoanForm({ ...loanForm, loanTermYears: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] font-mono placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">最大贷款金额 (元)</label>
                  <input
                    type="number"
                    placeholder="例如：10000000"
                    value={loanForm.maxLoanAmount ?? ''}
                    onChange={(e) => setLoanForm({ ...loanForm, maxLoanAmount: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] font-mono placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">还款方式</label>
                  <select
                    value={loanForm.repaymentMethod || ''}
                    onChange={(e) => setLoanForm({ ...loanForm, repaymentMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] cursor-pointer"
                  >
                    <option value="">请选择还款方式</option>
                    <option value="等额本金">等额本金</option>
                    <option value="等额本息">等额本息</option>
                    <option value="先息后本">先息后本</option>
                    <option value="按期还本付息">按期还本付息</option>
                    <option value="一次性还本付息">一次性还本付息</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-200 mb-1">发布日期</label>
                  <input
                    type="text"
                    placeholder="例：2026-10-18"
                    value={loanForm.publishDate || ''}
                    onChange={(e) => setLoanForm({ ...loanForm, publishDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] font-mono placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-200 mb-1">产品说明</label>
                <textarea
                  rows={3}
                  placeholder="请输入产品特点与适用场景"
                  value={loanForm.description || ''}
                  onChange={(e) => setLoanForm({ ...loanForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#18284c]/60">
                <button
                  type="button"
                  onClick={() => setIsAddLoanModalOpen(false)}
                  className="px-5 py-2 bg-[#182342] hover:bg-[#202f59] text-slate-300 rounded-lg text-xs cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md transition-all active:scale-95"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 批量导入贷款产品 (高保真还原暗色侧边截图) */}
      {isBatchImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#04140d] text-slate-100 rounded-2xl shadow-2xl max-w-xl w-full border border-emerald-900/80 p-6 flex flex-col space-y-4 overflow-hidden">
            
            {/* Modal Header Title */}
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>批量导入</span>
              </span>
              <button
                type="button"
                onClick={() => setIsBatchImportModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Dashed Drag & Drop Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-600/70 hover:border-emerald-400 rounded-2xl p-8 bg-[#031d14]/70 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-all duration-200 group relative"
            >
              <input
                type="file"
                ref={(inst) => {
                  if (inst) fileInputRef.current = inst;
                }}
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadedFileName(file.name);
                    triggerToast(`已成功加载并解析文件「${file.name}」，已提取 ${importPreviewList.length} 条贷款产品！`);
                  }
                }}
              />

              {/* Upload Green Icon */}
              <div className="p-3 bg-emerald-950/60 rounded-xl text-emerald-400 group-hover:scale-105 transition-transform">
                <FileUp className="w-10 h-10 stroke-[1.8]" />
              </div>

              <div className="space-y-1">
                <div className="text-white font-bold text-sm tracking-wide">
                  点击上传或将 Excel/CSV 文件拖拽至此处
                </div>
                <div className="text-[11px] text-emerald-400/80 font-normal">
                  支持 .xlsx, .xls, .csv 格式 (单次上限 50MB)
                </div>
              </div>

              {uploadedFileName && (
                <div className="mt-2 px-3 py-1 bg-emerald-950 border border-emerald-700/80 rounded-lg text-emerald-300 text-xs flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>已加载：{uploadedFileName}</span>
                </div>
              )}
            </div>

            {/* Template Download Notice Bar */}
            <div className="border border-emerald-800/80 bg-[#03231a]/80 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
              <span className="text-emerald-200 font-normal">
                首次导入？下载贷款产品标准导入模板文件
              </span>
              <button
                type="button"
                onClick={() => triggerToast('正在下载「贷款产品标准导入模板.xlsx」...')}
                className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer transition-colors flex items-center gap-1"
              >
                <span>下载模板</span>
              </button>
            </div>

            {/* Parsed Preview Table & Selection (Allows Row Deletion as requested) */}
            {importPreviewList.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span className="text-emerald-300/80">解析预览数据 ({importPreviewList.length} 条)</span>
                  {selectedImportIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteSelectedImportItems}
                      className="text-rose-400 hover:text-rose-300 cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>删除选中 ({selectedImportIds.length})</span>
                    </button>
                  )}
                </div>

                <div className="border border-emerald-900/60 rounded-xl overflow-hidden bg-slate-900/70 max-h-36 overflow-y-auto text-[11px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900/90 border-b border-emerald-900/60 text-slate-400 sticky top-0 font-medium">
                      <tr>
                        <th className="p-2 w-8 text-center">
                          <input
                            type="checkbox"
                            checked={selectedImportIds.length === importPreviewList.length && importPreviewList.length > 0}
                            onChange={(e) => handleToggleSelectAllImport(e.target.checked)}
                            className="rounded accent-emerald-500 cursor-pointer"
                          />
                        </th>
                        <th className="p-2 min-w-[100px]">金融机构</th>
                        <th className="p-2 min-w-[120px]">产品名称</th>
                        <th className="p-2 text-center w-14">类型</th>
                        <th className="p-2 text-right w-16">利率</th>
                        <th className="p-2 text-center w-10">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-950/60 text-slate-200">
                      {importPreviewList.map((item) => (
                        <tr key={item.id} className="hover:bg-emerald-950/40 transition-colors">
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={selectedImportIds.includes(item.id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedImportIds((prev) => [...prev, item.id]);
                                else setSelectedImportIds((prev) => prev.filter((i) => i !== item.id));
                              }}
                              className="rounded accent-emerald-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-2 text-slate-300">{item.bankName}</td>
                          <td className="p-2 text-emerald-400 font-medium">{item.productName}</td>
                          <td className="p-2 text-center text-slate-400">{item.productType}</td>
                          <td className="p-2 text-right font-mono text-teal-300">{item.interestRate}%</td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteSingleImportItem(item.id, item.productName)}
                              className="text-slate-500 hover:text-rose-400 cursor-pointer p-0.5"
                              title="移除"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Separator Line & Footer Action Buttons */}
            <div className="border-t border-emerald-900/60 pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsBatchImportModalOpen(false)}
                className="px-6 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white rounded-xl text-xs font-medium cursor-pointer transition-colors"
              >
                关闭
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchImport}
                className="px-6 py-2 bg-[#00b97c] hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-950/60 active:scale-95 transition-all"
              >
                确认解析导入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 贷款详情 (依据最新截图 100% 还原样式结构) */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-2xl w-full border border-[#18284c] p-6 flex flex-col space-y-5 overflow-y-auto max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#18284c]/80 pb-3">
              <span className="font-bold text-base text-white tracking-wide">
                贷款详情
              </span>
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* SECTION 1: 申贷方信息 */}
              <div className="border border-[#18284c] rounded-xl p-4 bg-[#0a132e]/90 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#00c88c] rounded-full inline-block" />
                  <span className="font-bold text-sm text-slate-100">申贷方信息</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-slate-300">
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">申贷企业：</span>
                    <span className="font-medium text-emerald-300 truncate">
                      {selectedApplication.companyName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">统一社会信用代码：</span>
                    <span className="font-mono text-slate-200">
                      {selectedApplication.creditCode || '91320115MA1X9Y1888'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">法定代表人：</span>
                    <span className="text-slate-200">
                      {selectedApplication.legalPerson || selectedApplication.contactPerson || '陈建华'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">法人证件号码：</span>
                    <span className="font-mono text-slate-200">
                      {selectedApplication.legalPersonId || selectedApplication.idCard || '340104198210123812'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">联系电话：</span>
                    <span className="font-mono text-slate-200">
                      {selectedApplication.contactPhone || '18921233112'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">所属行政区划：</span>
                    <span className="text-slate-200">
                      {selectedApplication.region}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 贷款信息 */}
              <div className="border border-[#18284c] rounded-xl p-4 bg-[#0a132e]/90 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#00c88c] rounded-full inline-block" />
                  <span className="font-bold text-sm text-slate-100">贷款信息</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-slate-300">
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">申请贷款产品：</span>
                    <span className="font-medium text-teal-300">
                      {selectedApplication.productName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">承办金融机构：</span>
                    <span className="text-slate-200">
                      {selectedApplication.bankName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">授信年利率：</span>
                    <span className="font-mono font-medium text-emerald-400">
                      {selectedApplication.interestRate ? `${selectedApplication.interestRate}%` : '3.85%'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">质押估算固碳量：</span>
                    <span className="font-mono text-emerald-300 font-bold">
                      {selectedApplication.pledgeCarbonVolume ? `${selectedApplication.pledgeCarbonVolume.toLocaleString()} 吨 CO₂e` : '12,500 吨 CO₂e'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">申贷金额：</span>
                    <span className="font-mono font-bold text-white text-sm">
                      ￥{selectedApplication.applyAmount.toLocaleString()} 元
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">已放款金额：</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      ￥{selectedApplication.disbursedAmount ? selectedApplication.disbursedAmount.toLocaleString() : '0'} 元
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">贷款期限：</span>
                    <span className="font-mono text-slate-200">
                      {selectedApplication.loanTermYears} 年 ({selectedApplication.loanTermYears * 12} 个月)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">还款方式：</span>
                    <span className="text-slate-200">
                      {selectedApplication.repaymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">申贷时间：</span>
                    <span className="font-mono text-slate-200">
                      {selectedApplication.applyDate}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">申贷状态：</span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0a2c20] text-[#00c88c] border border-[#00c88c]/40">
                      {selectedApplication.status}
                    </span>
                  </div>
                </div>

                {selectedApplication.description && (
                  <div className="pt-2 border-t border-[#18284c]/60 flex items-start">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">提报备注说明：</span>
                    <span className="text-slate-300 leading-relaxed font-sans">{selectedApplication.description}</span>
                  </div>
                )}
              </div>

              {/* SECTION 3: 审核及放款存证 */}
              {(selectedApplication.status === '已放款' || selectedApplication.status === '已结清' || selectedApplication.status === '审批通过') && (
                <div className="border border-[#18284c] rounded-xl p-4 bg-[#0a132e]/90 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#00c88c] rounded-full inline-block" />
                    <span className="font-bold text-sm text-slate-100">审核与放款存证</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-300">
                    <div><span className="text-slate-400">审核状态：</span><span className="text-emerald-400 font-medium">审核通过</span></div>
                    <div><span className="text-slate-400">审核时间：</span><span className="font-mono text-slate-200">2026-10-16 10:30:00</span></div>
                    <div className="col-span-2"><span className="text-slate-400">审核意见：</span><span className="text-slate-200">企业符合林业碳汇收益权质押融资准入条件，数据上链核验无误，批准授信放款。</span></div>
                    <div><span className="text-slate-400">监管开户行：</span><span className="text-slate-200">{selectedApplication.bankName}</span></div>
                    <div><span className="text-slate-400">资金划拨存证：</span><span className="font-mono text-teal-300">0x8f7c...9a21 (已上链)</span></div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#18284c] pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="px-6 py-2 bg-[#00c88c] hover:bg-[#00b27b] text-white rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-md shadow-emerald-950/50"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 新增申贷 / 编辑申贷 (依据最新截图精确适配深蓝暗调与按纽风格) */}
      {isAddAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-2xl w-full border border-[#18284c] p-6 flex flex-col space-y-5 overflow-y-auto max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#18284c]/80 pb-3">
              <span className="font-bold text-base text-white tracking-wide">
                {editingApplication ? '编辑申贷' : '新增申贷'}
              </span>
              <button
                type="button"
                onClick={() => setIsAddAppModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApplication} className="space-y-5 text-xs">
              
              {/* SECTION 1: 申贷方信息 */}
              <div className="border border-[#18284c] rounded-xl p-4 bg-[#0a132e]/90 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#00c88c] rounded-full inline-block" />
                  <span className="font-bold text-sm text-slate-100">申贷方信息</span>
                </div>

                <div className="space-y-3">
                  {/* 申贷企业 */}
                  <div className="flex items-center gap-3">
                    <label className="w-36 text-right font-medium text-slate-200 shrink-0">
                      <span className="text-rose-500 mr-1">*</span>申贷企业
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="请输入申贷企业名称"
                      value={appForm.companyName || ''}
                      onChange={(e) => setAppForm({ ...appForm, companyName: e.target.value })}
                      className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                    />
                  </div>

                  {/* 统一社会信用代码 */}
                  <div className="flex items-center gap-3">
                    <label className="w-36 text-right font-medium text-slate-200 shrink-0">
                      <span className="text-rose-500 mr-1">*</span>统一社会信用代码
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="请输入统一社会信用代码"
                      value={appForm.creditCode || ''}
                      onChange={(e) => setAppForm({ ...appForm, creditCode: e.target.value })}
                      className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                    />
                  </div>

                  {/* 法定代表人 */}
                  <div className="flex items-center gap-3">
                    <label className="w-36 text-right font-medium text-slate-200 shrink-0">
                      <span className="text-rose-500 mr-1">*</span>法定代表人
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="请输入法定代表人"
                      value={appForm.legalPerson || ''}
                      onChange={(e) => setAppForm({ ...appForm, legalPerson: e.target.value })}
                      className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                    />
                  </div>

                  {/* 法人证件号 */}
                  <div className="flex items-center gap-3">
                    <label className="w-36 text-right font-medium text-slate-200 shrink-0">
                      <span className="text-rose-500 mr-1">*</span>法人证件号
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="请输入法人证件号"
                      value={appForm.legalPersonId || ''}
                      onChange={(e) => setAppForm({ ...appForm, legalPersonId: e.target.value })}
                      className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: 贷款信息 */}
              <div className="border border-[#18284c] rounded-xl p-4 bg-[#0a132e]/90 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#00c88c] rounded-full inline-block" />
                  <span className="font-bold text-sm text-slate-100">贷款信息</span>
                </div>

                {/* 贷款产品选择卡片 */}
                <div className="flex items-start gap-3">
                  <label className="w-24 text-right font-medium text-slate-200 shrink-0 pt-2">
                    <span className="text-rose-500 mr-1">*</span>贷款产品
                  </label>
                  
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 flex-1">
                    {loanProducts.slice(0, 5).map((prod, cIdx) => {
                      const cardName = prod.productName;
                      const cardBank = prod.bankName;
                      const cardRate = `${prod.interestRate}%`;
                      const cardMaxAmount = `${(prod.maxLoanAmount / 10000).toFixed(0)}万元`;
                      const isSelected = appForm.productName === cardName || (!appForm.productName && cIdx === 0);
                      return (
                        <div
                          key={prod.id || cIdx}
                          onClick={() => setAppForm({ ...appForm, productName: cardName, bankName: cardBank })}
                          className={`p-3 rounded-xl min-w-[180px] max-w-[220px] shrink-0 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-2 border-[#00c88c] bg-[#0c2236] shadow-md shadow-[#00c88c]/10'
                              : 'border border-[#1d2d57] bg-[#101a36] hover:border-[#00c88c]/60 text-slate-200'
                          }`}
                        >
                          <div className="font-bold text-slate-100 text-xs mb-0.5 truncate" title={cardName}>{cardName}</div>
                          <div className="text-[11px] text-slate-400 mb-2 truncate" title={cardBank}>{cardBank}</div>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-slate-400">授信利率</span>
                            <span className="font-bold font-mono text-[#38bdf8]">{cardRate}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">最大授信额度</span>
                            <span className="font-bold font-mono text-[#00c88c]">{cardMaxAmount}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Inline Row: 申贷金额 & 申贷年限 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 申贷金额 */}
                  <div className="flex items-center gap-2">
                    <label className="w-24 text-right font-medium text-slate-200 shrink-0">
                      <span className="text-rose-500 mr-1">*</span>申贷金额
                    </label>
                    <div className="flex items-center border border-[#1d2d57] bg-[#101a36] rounded-lg overflow-hidden focus-within:border-[#00c88c] focus-within:ring-1 focus-within:ring-[#00c88c] w-full">
                      <input
                        type="number"
                        required
                        placeholder="例如：1000000"
                        value={appForm.applyAmount ?? ''}
                        onChange={(e) => setAppForm({ ...appForm, applyAmount: e.target.value === '' ? undefined : Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs outline-none bg-transparent text-slate-100 font-mono placeholder-slate-500"
                      />
                      <span className="px-3 py-2 bg-[#182342] text-slate-300 text-xs border-l border-[#1d2d57] shrink-0 font-medium">
                        元
                      </span>
                    </div>
                  </div>

                  {/* 申贷年限 */}
                  <div className="flex items-center gap-2">
                    <label className="w-24 text-right font-medium text-slate-200 shrink-0">
                      <span className="text-rose-500 mr-1">*</span>申贷年限
                    </label>
                    <div className="flex items-center border border-[#1d2d57] bg-[#101a36] rounded-lg overflow-hidden focus-within:border-[#00c88c] focus-within:ring-1 focus-within:ring-[#00c88c] w-full">
                      <input
                        type="number"
                        required
                        placeholder="例如：5"
                        value={appForm.loanTermYears ?? ''}
                        onChange={(e) => setAppForm({ ...appForm, loanTermYears: e.target.value === '' ? undefined : Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs outline-none bg-transparent text-slate-100 font-mono placeholder-slate-500"
                      />
                      <span className="px-3 py-2 bg-[#182342] text-slate-300 text-xs border-l border-[#1d2d57] shrink-0 font-medium">
                        年
                      </span>
                    </div>
                  </div>
                </div>

                {/* 申请人手机号码 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right font-medium text-slate-200 shrink-0">
                    <span className="text-rose-500 mr-1">*</span>申请人手机号码
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="请输入申请人手机号码"
                    value={appForm.contactPhone || ''}
                    onChange={(e) => setAppForm({ ...appForm, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                  />
                </div>

                {/* 附件材料 */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <label className="w-24 text-right font-medium text-slate-200 shrink-0">
                      <span className="text-rose-500 mr-1">*</span>附件材料
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-1.5 border border-[#1d2d57] hover:border-[#00c88c] bg-[#182342] hover:bg-[#202f59] rounded-lg text-xs font-medium text-slate-200 cursor-pointer transition-colors">
                        选择文件
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setAppForm({ ...appForm, attachmentName: file.name });
                              triggerToast(`已选择附件文件「${file.name}」`);
                            }
                          }}
                        />
                      </label>
                      <span className="text-xs text-[#00c88c] font-medium font-mono">
                        {appForm.attachmentName || '未选择任何文件'}
                      </span>
                    </div>
                  </div>

                  <div className="pl-26 text-[11px] text-slate-400">
                    提示：单个附件最大支持50M，支持格式：PDF、JPG、PNG
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#18284c]/60">
                <button
                  type="button"
                  onClick={() => setIsAddAppModalOpen(false)}
                  className="px-5 py-2 bg-[#182342] hover:bg-[#202f59] text-slate-300 font-medium rounded-lg text-xs cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md transition-all active:scale-95"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 申贷审核 (依据最新截图精确适配深蓝暗调与按纽风格) */}
      {auditingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-2xl w-full border border-[#18284c] p-6 flex flex-col space-y-5 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#18284c]/80 pb-3">
              <span className="font-bold text-base text-white tracking-wide">
                申贷审核
              </span>
              <button
                type="button"
                onClick={() => setAuditingApp(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAuditSubmit} className="space-y-4 text-xs">
              
              {/* SECTION 1: 申贷方信息 */}
              <div className="border border-[#18284c] rounded-xl p-4 bg-[#0a132e]/90 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#00c88c] rounded-full inline-block" />
                  <span className="font-bold text-sm text-slate-100">申贷方信息</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">申贷企业：</span>
                    <span className="font-medium text-emerald-300">
                      {auditingApp.companyName || '江苏紫蓬山林业生态开发有限公司'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">统一社会信用代码：</span>
                    <span className="font-mono text-slate-200">
                      {auditingApp.creditCode || '412338912120001'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">法定代表人：</span>
                    <span className="font-medium text-slate-200">
                      {auditingApp.legalPerson || '陈健仁'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">法人证件号码：</span>
                    <span className="font-mono text-slate-200">
                      {auditingApp.legalPersonId || '456245197801543666'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 贷款信息 */}
              <div className="border border-[#18284c] rounded-xl p-4 bg-[#0a132e]/90 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#00c88c] rounded-full inline-block" />
                  <span className="font-bold text-sm text-slate-100">贷款信息</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">贷款产品：</span>
                    <span className="font-medium text-teal-300">
                      {auditingApp.productName || '林业碳汇收益权质押贷'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">所属银行：</span>
                    <span className="font-medium text-slate-200">
                      {auditingApp.bankName || '徽商银行合肥分行'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">授信利率：</span>
                    <span className="font-mono font-medium text-emerald-400">3.95%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">产品类型：</span>
                    <span className="text-slate-200">信用贷</span>
                  </div>
                  <div>
                    <span className="text-slate-400">还款方式：</span>
                    <span className="text-slate-200">
                      {auditingApp.repaymentMethod || '等额本息'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">贷款金额：</span>
                    <span className="font-mono font-bold text-white">
                      {auditingApp.applyAmount ? `${(auditingApp.applyAmount / 10000).toFixed(0)}万元` : '100万元'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">还款期限：</span>
                    <span className="font-mono text-slate-200">
                      {auditingApp.loanTermYears || 3}年
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">申请人手机号码：</span>
                    <span className="font-mono text-slate-200">
                      {auditingApp.contactPhone || '18921233112'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: 审核信息 */}
              <div className="border border-[#18284c] rounded-xl p-4 bg-[#0a132e]/90 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#00c88c] rounded-full inline-block" />
                  <span className="font-bold text-sm text-slate-100">审核信息</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Radio Group */}
                  <div className="flex items-center gap-3">
                    <label className="w-20 text-right font-medium text-slate-300 shrink-0">
                      <span className="text-rose-500 mr-1">*</span>合同材料
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-200 font-medium">
                        <input
                          type="radio"
                          name="auditStatusRadio"
                          checked={auditChoice === '审批通过'}
                          onChange={() => setAuditChoice('审批通过')}
                          className="accent-[#00c88c] w-4 h-4 cursor-pointer"
                        />
                        <span>通过</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-200 font-medium">
                        <input
                          type="radio"
                          name="auditStatusRadio"
                          checked={auditChoice === '已驳回'}
                          onChange={() => setAuditChoice('已驳回')}
                          className="accent-[#00c88c] w-4 h-4 cursor-pointer"
                        />
                        <span>不通过</span>
                      </label>
                    </div>
                  </div>

                  {/* Input 审核意见 */}
                  <div className="flex items-center gap-3">
                    <label className="w-20 text-right font-medium text-slate-300 shrink-0">
                      审核意见
                    </label>
                    <input
                      type="text"
                      placeholder="请输入"
                      value={auditNote}
                      onChange={(e) => setAuditNote(e.target.value)}
                      className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                    />
                  </div>

                  {/* File upload 合同材料 */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <label className="w-20 text-right font-medium text-slate-300 shrink-0">
                        <span className="text-rose-500 mr-1">*</span>合同材料
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-1.5 bg-[#101a36] border border-[#1d2d57] hover:border-[#00c88c] rounded-lg text-xs font-medium text-slate-200 cursor-pointer hover:bg-[#18254b] transition-colors">
                          选择文件
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setAuditFile(file);
                                triggerToast(`已选择合同文件「${file.name}」`);
                              }
                            }}
                          />
                        </label>
                        <span className="text-xs text-[#00c88c] font-medium font-mono">
                          {auditFile ? auditFile.name : ''}
                        </span>
                      </div>
                    </div>
                    <div className="pl-23 text-[11px] text-slate-400">
                      提示：单个附件最大支持50M，支持格式：PDF、JPG、PNG
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#18284c]/60">
                <button
                  type="button"
                  onClick={() => setAuditingApp(null)}
                  className="px-5 py-2 bg-[#182342] hover:bg-[#202f59] text-slate-300 font-medium rounded-lg text-xs cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md transition-all active:scale-95"
                >
                  确认提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 申请放款 (依据最新截图 100% 还原深蓝暗调样式) */}
      {disbursingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-3xl w-full border border-[#18284c] p-6 flex flex-col space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#18284c]/80 pb-3">
              <span className="font-bold text-base text-white tracking-wide">
                申请放款
              </span>
              <button
                type="button"
                onClick={() => setDisbursingApp(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDisburseSubmit} className="space-y-4">
              {/* SECTION 1: 申贷方信息 */}
              <div className="border border-[#18284c] rounded-xl p-4 bg-[#0a132e]/90 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#00c88c] rounded-full inline-block" />
                  <span className="font-bold text-sm text-slate-100">申贷方信息</span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs text-slate-300">
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">申贷企业：</span>
                    <span className="font-medium text-emerald-300 truncate">
                      {disbursingApp.companyName || '江苏紫蓬山林业生态开发有限公司'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">统一社会信用代码：</span>
                    <span className="font-mono text-slate-200">
                      {disbursingApp.creditCode || '91320115MA1X9Y1888'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">法定代表人：</span>
                    <span className="text-slate-200">
                      {disbursingApp.contactPerson || '陈建华'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">法人证件号码：</span>
                    <span className="font-mono text-slate-200">
                      {disbursingApp.idCard || '340104198210123812'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 贷款信息 */}
              <div className="border border-[#18284c] rounded-xl p-4 bg-[#0a132e]/90 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#00c88c] rounded-full inline-block" />
                  <span className="font-bold text-sm text-slate-100">贷款信息</span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs text-slate-300">
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">贷款产品：</span>
                    <span className="font-medium text-teal-300">
                      {disbursingApp.productName || '徽银碳汇贷'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">承办银行：</span>
                    <span className="text-slate-200">
                      {disbursingApp.bankName || '徽商银行合肥分行'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">授信年利率：</span>
                    <span className="font-mono font-medium text-emerald-400">
                      {disbursingApp.interestRate ? `${disbursingApp.interestRate}%` : '3.85%'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">质押物类型：</span>
                    <span className="text-slate-200">林业碳汇收益权</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">还款方式：</span>
                    <span className="text-slate-200">
                      {disbursingApp.repaymentMethod || '碳汇收益按期还本付息'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">申请贷款金额：</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {disbursingApp.applyAmount
                        ? `${(disbursingApp.applyAmount / 10000).toFixed(0)}万元`
                        : '100万元'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-28 shrink-0 text-right pr-2">贷款期限：</span>
                    <span className="font-mono text-slate-200">
                      {disbursingApp.loanTermYears
                        ? `${disbursingApp.loanTermYears * 12}个月`
                        : '24个月'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-32 shrink-0 text-right pr-2">申贷时间：</span>
                    <span className="font-mono text-slate-200">
                      {disbursingApp.applyDate || '2026-10-15 14:22:10'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: 放款信息 */}
              <div className="border border-[#18284c] rounded-xl p-4 bg-[#0a132e]/90 space-y-3.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#00c88c] rounded-full inline-block" />
                  <span className="font-bold text-sm text-slate-100">放款信息</span>
                </div>

                <div className="space-y-3">
                  {/* 放款银行 */}
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-right font-medium text-slate-300 shrink-0">
                      <span className="text-rose-500 mr-1">*</span>放款银行
                    </label>
                    <input
                      type="text"
                      required
                      value={disburseBank}
                      onChange={(e) => setDisburseBank(e.target.value)}
                      placeholder="请输入放款银行"
                      className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                    />
                  </div>

                  {/* 放款账号 */}
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-right font-medium text-slate-300 shrink-0">
                      <span className="text-rose-500 mr-1">*</span>放款账号
                    </label>
                    <input
                      type="text"
                      required
                      value={disburseAccount}
                      onChange={(e) => setDisburseAccount(e.target.value)}
                      placeholder="请输入放款账号"
                      className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs font-mono text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                    />
                  </div>

                  {/* 放款金额 */}
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-right font-medium text-slate-300 shrink-0">
                      <span className="text-rose-500 mr-1">*</span>放款金额
                    </label>
                    <div className="relative w-full flex items-center">
                      <input
                        type="text"
                        required
                        value={disburseAmountInput}
                        onChange={(e) => setDisburseAmountInput(e.target.value)}
                        placeholder="请输入放款金额"
                        className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs font-mono text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500 pr-12"
                      />
                      <span className="absolute right-3 text-slate-400 text-xs pointer-events-none">万元</span>
                    </div>
                  </div>

                  {/* 放款日期 */}
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-right font-medium text-slate-300 shrink-0">
                      <span className="text-rose-500 mr-1">*</span>放款日期
                    </label>
                    <input
                      type="date"
                      required
                      value={disburseDate}
                      onChange={(e) => setDisburseDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs font-mono text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c]"
                    />
                  </div>

                  {/* 放款说明 */}
                  <div className="flex items-start gap-3">
                    <label className="w-24 text-right font-medium text-slate-300 shrink-0 pt-2">
                      放款说明
                    </label>
                    <textarea
                      rows={2}
                      value={disburseNote}
                      onChange={(e) => setDisburseNote(e.target.value)}
                      placeholder="请输入"
                      className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                    />
                  </div>

                  {/* 凭证附件 File upload */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <label className="w-24 text-right font-medium text-slate-300 shrink-0">
                        <span className="text-rose-500 mr-1">*</span>凭证附件
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-1.5 bg-[#101a36] border border-[#1d2d57] hover:border-[#00c88c] rounded-lg text-xs font-medium text-slate-200 cursor-pointer hover:bg-[#18254b] transition-colors">
                          选择文件
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setDisburseFile(file);
                                triggerToast(`已选择凭证文件「${file.name}」`);
                              }
                            }}
                          />
                        </label>
                        <span className="text-xs text-[#00c88c] font-medium font-mono">
                          {disburseFile ? disburseFile.name : ''}
                        </span>
                      </div>
                    </div>
                    <div className="pl-27 text-[11px] text-slate-400">
                      提示：支持 pdf, jpg, png 格式，单文件不超过 10MB
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#18284c]/80">
                <button
                  type="button"
                  onClick={() => setDisbursingApp(null)}
                  className="px-5 py-2 bg-[#182342] hover:bg-[#202f59] text-slate-300 font-medium rounded-lg text-xs cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md transition-all active:scale-95"
                >
                  确认放款
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 贷款结清 */}
      {settlingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-lg w-full border border-[#18284c] p-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-[#18284c]/80 pb-3">
              <span className="font-bold text-base text-white tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00c88c]" />
                <span>贷款服务结清办理</span>
              </span>
              <button
                type="button"
                onClick={() => setSettlingApp(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSettleSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-[#0a132e]/90 border border-[#18284c] rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">申贷企业：</span>
                  <span className="font-bold text-[#00c88c]">{settlingApp.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">已放款金额：</span>
                  <span className="font-mono font-bold text-white">￥{settlingApp.disbursedAmount.toLocaleString()}元</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">还款方式：</span>
                  <span className="text-slate-200">{settlingApp.repaymentMethod}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-200 mb-1 font-medium">结清凭证与备注</label>
                <textarea
                  rows={3}
                  value={settleNote}
                  onChange={(e) => setSettleNote(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] placeholder-slate-500"
                  placeholder="请输入结清及解质押登记说明"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#18284c]/60">
                <button
                  type="button"
                  onClick={() => setSettlingApp(null)}
                  className="px-5 py-2 bg-[#182342] hover:bg-[#202f59] text-slate-300 rounded-lg text-xs cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md transition-all active:scale-95"
                >
                  确认结清解质押
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: 查看保险产品详情 */}
      {selectedInsuranceProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-xl w-full border border-[#18284c] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#18284c]/80 flex items-center justify-between">
              <span className="font-bold text-base text-white tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00c88c]" />
                <span>保险产品详情</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedInsuranceProduct(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="p-4 bg-[#0a132e] rounded-xl border border-[#18284c] space-y-2">
                <div className="text-base font-bold text-[#00c88c]">{selectedInsuranceProduct.productName}</div>
                <div className="text-slate-300 font-medium">{selectedInsuranceProduct.companyName}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div className="p-3 bg-[#0a132e]/60 rounded-lg border border-[#18284c]">
                  <span className="text-slate-400">保险类型:</span>{' '}
                  <span className="text-[#00c88c] font-bold ml-1">{selectedInsuranceProduct.insuranceType}</span>
                </div>
                <div className="p-3 bg-[#0a132e]/60 rounded-lg border border-[#18284c]">
                  <span className="text-slate-400">保费金额:</span>{' '}
                  <span className="text-teal-300 font-bold font-mono ml-1">{selectedInsuranceProduct.premiumRate.toFixed(2)} 元/亩·年</span>
                </div>
                <div className="p-3 bg-[#0a132e]/60 rounded-lg border border-[#18284c]">
                  <span className="text-slate-400">最低投保面积:</span>{' '}
                  <span className="text-slate-200 font-mono ml-1">{selectedInsuranceProduct.minInsuredArea} 亩</span>
                </div>
                <div className="p-3 bg-[#0a132e]/60 rounded-lg border border-[#18284c]">
                  <span className="text-slate-400">上线日期:</span>{' '}
                  <span className="text-slate-200 font-mono ml-1">{selectedInsuranceProduct.launchDate}</span>
                </div>
              </div>

              <div className="p-3 bg-[#0a132e]/60 rounded-lg border border-[#18284c] text-slate-300 leading-relaxed">
                <div className="text-slate-400 mb-1 font-medium">产品保障与理赔说明:</div>
                {selectedInsuranceProduct.description}
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-[#18284c]/80 bg-[#070e20] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">上线时间: {selectedInsuranceProduct.launchDate}</span>
              <button
                type="button"
                onClick={() => {
                  triggerToast(`已为「${selectedInsuranceProduct.productName}」发起投保初审预登记！`);
                  setSelectedInsuranceProduct(null);
                }}
                className="px-6 py-2 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg shadow-md cursor-pointer active:scale-95 transition-all"
              >
                立即申请投保
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 新增/编辑 保险产品 (100% 依据最新截图生成) */}
      {isAddInsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-2xl w-full border border-[#18284c] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#18284c]/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00c88c]" />
                <span>{editingInsuranceProduct ? '编辑保险产品' : '新增保险产品'}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAddInsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveInsuranceProduct} className="p-6 space-y-4 text-xs font-sans max-h-[82vh] overflow-y-auto">
              {/* 所属保险公司 */}
              <div>
                <label className="block text-[11px] text-slate-200 mb-1.5 font-medium">
                  <span className="text-rose-500 mr-1">*</span>所属保险公司
                </label>
                <select
                  value={insForm.companyName || ''}
                  onChange={(e) => setInsForm({ ...insForm, companyName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] cursor-pointer"
                  required
                >
                  <option value="">请选择所属保险公司</option>
                  <option value="国元农业保险股份有限公司">国元农业保险股份有限公司</option>
                  <option value="中国人民财产保险股份有限公司">中国人民财产保险股份有限公司</option>
                  <option value="中国人寿财产保险股份有限公司">中国人寿财产保险股份有限公司</option>
                  <option value="中国太平洋财产保险股份有限公司">中国太平洋财产保险股份有限公司</option>
                  <option value="中华联合财产保险股份有限公司">中华联合财产保险股份有限公司</option>
                  <option value="平安财产保险股份有限公司">平安财产保险股份有限公司</option>
                  <option value="泰康在线财产保险股份有限公司">泰康在线财产保险股份有限公司</option>
                </select>
              </div>

              {/* 保险名称 */}
              <div>
                <label className="block text-[11px] text-slate-200 mb-1.5 font-medium">
                  <span className="text-rose-500 mr-1">*</span>保险名称
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入保险名称"
                  value={insForm.productName || ''}
                  onChange={(e) => setInsForm({ ...insForm, productName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                />
              </div>

              {/* 保险类型 & 保费金额 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-200 mb-1.5 font-medium">
                    <span className="text-rose-500 mr-1">*</span>保险类型
                  </label>
                  <select
                    value={insForm.insuranceType || '碳汇保险'}
                    onChange={(e) => setInsForm({ ...insForm, insuranceType: e.target.value as InsuranceProduct['insuranceType'] })}
                    className="w-full px-3 py-2.5 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] cursor-pointer"
                    required
                  >
                    <option value="">请选择保险类型</option>
                    <option value="碳汇保险">碳汇保险</option>
                    <option value="林木保险">林木保险</option>
                    <option value="政策性保险">政策性保险</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-200 mb-1.5 font-medium">
                    <span className="text-rose-500 mr-1">*</span>保费金额
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="请输入保费金额"
                      value={insForm.premiumRate ?? ''}
                      onChange={(e) => setInsForm({ ...insForm, premiumRate: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-3 pr-10 py-2.5 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500 font-mono"
                    />
                    <span className="absolute right-3 text-xs text-slate-400 pointer-events-none font-sans">元</span>
                  </div>
                </div>
              </div>

              {/* 最低投保面积 & 上线日期 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-200 mb-1.5 font-medium">
                    <span className="text-rose-500 mr-1">*</span>最低投保面积
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      required
                      placeholder="请输入最低投保面积"
                      value={insForm.minInsuredArea ?? ''}
                      onChange={(e) => setInsForm({ ...insForm, minInsuredArea: parseInt(e.target.value) || 0 })}
                      className="w-full pl-3 pr-10 py-2.5 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500 font-mono"
                    />
                    <span className="absolute right-3 text-xs text-slate-400 pointer-events-none font-sans">亩</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-200 mb-1.5 font-medium">上线日期</label>
                  <input
                    type="date"
                    value={insForm.launchDate || '2026-10-18'}
                    onChange={(e) => setInsForm({ ...insForm, launchDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] font-mono cursor-pointer"
                  />
                </div>
              </div>

              {/* 产品介绍 (带高保真富文本编辑器工具栏) */}
              <div>
                <label className="block text-[11px] text-slate-200 mb-1.5 font-medium">
                  <span className="text-rose-500 mr-1">*</span>产品介绍
                </label>
                <div className="border border-[#1d2d57] rounded-lg bg-[#101a36] overflow-hidden focus-within:border-[#00c88c] focus-within:ring-1 focus-within:ring-[#00c88c]">
                  {/* 富文本格式化工具栏 Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-2 bg-[#0d162e] border-b border-[#1d2d57] text-slate-400 text-xs select-none">
                    <button
                      type="button"
                      title="加粗"
                      onClick={() => setInsForm({ ...insForm, description: (insForm.description || '') + ' **加粗文字**' })}
                      className="px-2 py-1 rounded hover:bg-[#182647] hover:text-white transition-colors font-bold cursor-pointer"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      title="斜体"
                      onClick={() => setInsForm({ ...insForm, description: (insForm.description || '') + ' *斜体文字*' })}
                      className="px-2 py-1 rounded hover:bg-[#182647] hover:text-white transition-colors italic cursor-pointer"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      title="下划线"
                      onClick={() => setInsForm({ ...insForm, description: (insForm.description || '') + ' <u>下划线</u>' })}
                      className="px-2 py-1 rounded hover:bg-[#182647] hover:text-white transition-colors underline cursor-pointer"
                    >
                      U
                    </button>
                    <button
                      type="button"
                      title="删除线"
                      onClick={() => setInsForm({ ...insForm, description: (insForm.description || '') + ' ~删除线~' })}
                      className="px-2 py-1 rounded hover:bg-[#182647] hover:text-white transition-colors line-through cursor-pointer"
                    >
                      S
                    </button>
                    <div className="h-4 w-px bg-[#1d2d57] mx-1" />
                    <button
                      type="button"
                      title="标题1"
                      onClick={() => setInsForm({ ...insForm, description: (insForm.description || '') + '\n# 一级标题\n' })}
                      className="px-2 py-1 rounded hover:bg-[#182647] hover:text-white transition-colors font-semibold cursor-pointer"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      title="标题2"
                      onClick={() => setInsForm({ ...insForm, description: (insForm.description || '') + '\n## 二级标题\n' })}
                      className="px-2 py-1 rounded hover:bg-[#182647] hover:text-white transition-colors font-semibold cursor-pointer"
                    >
                      H2
                    </button>
                    <div className="h-4 w-px bg-[#1d2d57] mx-1" />
                    <button
                      type="button"
                      title="无序列表"
                      onClick={() => setInsForm({ ...insForm, description: (insForm.description || '') + '\n• 列表项目1\n• 列表项目2' })}
                      className="px-2 py-1 rounded hover:bg-[#182647] hover:text-white transition-colors cursor-pointer"
                    >
                      • 列表
                    </button>
                    <button
                      type="button"
                      title="有序列表"
                      onClick={() => setInsForm({ ...insForm, description: (insForm.description || '') + '\n1. 步骤一\n2. 步骤二' })}
                      className="px-2 py-1 rounded hover:bg-[#182647] hover:text-white transition-colors cursor-pointer"
                    >
                      1. 步骤
                    </button>
                    <div className="h-4 w-px bg-[#1d2d57] mx-1" />
                    <button
                      type="button"
                      title="清除格式"
                      onClick={() => setInsForm({ ...insForm, description: '' })}
                      className="px-2 py-1 rounded hover:bg-rose-900/40 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      清空
                    </button>
                  </div>

                  {/* 富文本编辑输入框 Area */}
                  <textarea
                    rows={4}
                    required
                    placeholder="请输入产品介绍详细内容与承保责任条款说明..."
                    value={insForm.description || ''}
                    onChange={(e) => setInsForm({ ...insForm, description: e.target.value })}
                    className="w-full p-3 bg-[#101a36] text-xs text-slate-100 outline-none placeholder-slate-500 leading-relaxed resize-y"
                  />
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#18284c]/60">
                <button
                  type="button"
                  onClick={() => setIsAddInsModalOpen(false)}
                  className="px-5 py-2.5 bg-[#182342] hover:bg-[#202f59] text-slate-300 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md transition-all active:scale-95"
                >
                  确定
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 批量导入保险产品 (支持真实文件拖拽、解析与一键导入) */}
      {isBatchImportInsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <input
            type="file"
            ref={insFileInputRef}
            onChange={handleRealFileUpload}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />

          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-2xl w-full border border-[#18284c] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#18284c]/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#00c88c]" />
                <span>批量导入保险产品 (真实文件解析)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsBatchImportInsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs font-sans max-h-[82vh] overflow-y-auto">
              {/* Step Progress Indicator */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#0a132e] rounded-xl border border-[#18284c] text-center">
                <div className="flex flex-col items-center gap-1 text-[#00c88c]">
                  <span className="w-5 h-5 rounded-full bg-[#00c88c]/20 border border-[#00c88c] flex items-center justify-center font-bold font-mono text-[11px]">
                    1
                  </span>
                  <span className="font-bold">下载导入模板</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-teal-300">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-400 flex items-center justify-center font-bold font-mono text-[11px]">
                    2
                  </span>
                  <span className="font-bold">上传 Excel/CSV</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-emerald-400">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold font-mono text-[11px]">
                    3
                  </span>
                  <span className="font-bold">确认解析并导入</span>
                </div>
              </div>

              {/* Step 1: Download Template */}
              <div className="p-4 bg-[#0d1738]/80 rounded-xl border border-[#1d2d57] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-teal-400" />
                    <span>第一步：生成并下载真实 Excel 模板</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-3.5 py-1.5 bg-[#182a52] hover:bg-[#20376c] active:scale-95 text-teal-300 border border-teal-500/40 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-400" />
                    <span>下载 Excel 模板 (.xlsx)</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  下载真实可编辑的规范模板，在本地修改或录入后保存上传，包含：<strong className="text-slate-300">所属保险公司、保险名称、保险类型（碳汇保险/林木保险/政策性保险）、保费金额(元)、最低投保面积(亩)、上线日期、产品介绍</strong>。
                </p>
              </div>

              {/* Step 2: Upload Real File Drag & Drop */}
              <div className="space-y-2">
                <div className="font-bold text-slate-100 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-[#00c88c]" />
                  <span>第二步：选择或拖拽上传本地真实文件</span>
                </div>

                <div
                  onClick={() => insFileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#1d3363] hover:border-[#00c88c] bg-[#0a132e]/80 hover:bg-[#0c183b] rounded-xl p-5 text-center cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#122247] group-hover:bg-[#00c88c]/20 flex items-center justify-center mx-auto transition-colors">
                    <FileUp className="w-5 h-5 text-teal-400 group-hover:text-[#00c88c]" />
                  </div>
                  <div className="text-xs text-slate-200 font-medium">
                    点击此处选择文件 或 将本地文件拖拽到此处
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    支持真实 .xlsx, .xls, .csv 文件 (支持各类标准报表)
                  </div>
                </div>

                {/* Uploaded File Banner */}
                {realImportFile && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-5 h-5 text-[#00c88c]" />
                      <div>
                        <div className="font-bold text-slate-200 text-xs">{realImportFile.name}</div>
                        <div className="text-[10px] text-emerald-400/90 font-mono">
                          大小: {realImportFile.size} | 状态: 已解析出 {parsedImportProducts.length} 条数据
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => insFileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-700 text-emerald-300 rounded text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      重新选择文件
                    </button>
                  </div>
                )}
              </div>

              {/* Step 3: Parsed Data Preview Table */}
              <div className="space-y-2">
                <div className="font-bold text-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>第三步：真实解析数据预览 ({parsedImportProducts.length}条)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    100% 格式自动化读取与智能对齐
                  </span>
                </div>

                <div className="border border-[#18284c] rounded-xl overflow-hidden bg-[#070e20] max-h-52 overflow-y-auto">
                  <table className="w-full text-left text-[11px] border-collapse font-sans">
                    <thead className="sticky top-0 bg-[#0f1d3f] text-slate-400 border-b border-[#18284c]">
                      <tr>
                        <th className="py-2 px-2.5">保险公司</th>
                        <th className="py-2 px-2.5">保险名称</th>
                        <th className="py-2 px-2.5">类型</th>
                        <th className="py-2 px-2.5">保费金额</th>
                        <th className="py-2 px-2.5">最低投保</th>
                        <th className="py-2 px-2.5 text-center">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#18284c]/60 text-slate-300">
                      {parsedImportProducts.map((p, idx) => (
                        <tr key={p.id || idx} className="hover:bg-[#0e1b3d]">
                          <td className="py-2 px-2.5 truncate max-w-[120px]">{p.companyName}</td>
                          <td className="py-2 px-2.5 text-[#00c88c] font-medium truncate max-w-[140px]">{p.productName}</td>
                          <td className="py-2 px-2.5">{p.insuranceType}</td>
                          <td className="py-2 px-2.5 font-mono text-teal-300">{p.premiumRate}元/亩</td>
                          <td className="py-2 px-2.5 font-mono">{p.minInsuredArea}亩</td>
                          <td className="py-2 px-2.5 text-center text-emerald-400 font-bold">✓ 验证合格</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Overwrite duplicate products setting */}
              <div className="p-3 bg-[#0a132e] rounded-xl border border-[#18284c] flex items-center justify-between text-[11px] text-slate-300">
                <span>重名保险产品处理方式：</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="duplicate_policy"
                      checked={duplicatePolicy === 'overwrite'}
                      onChange={() => setDuplicatePolicy('overwrite')}
                      className="accent-[#00c88c]"
                    />
                    <span>覆盖同名产品</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="duplicate_policy"
                      checked={duplicatePolicy === 'skip'}
                      onChange={() => setDuplicatePolicy('skip')}
                      className="accent-[#00c88c]"
                    />
                    <span>跳过重复项</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 border-t border-[#18284c]/80 bg-[#070e20] flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                提示: 导入后将在产品数据表中更新并按上线日期降序排列
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsBatchImportInsModalOpen(false)}
                  className="px-5 py-2 bg-[#182342] hover:bg-[#20376c] text-slate-300 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmInsBatchImport}
                  className="px-6 py-2 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>确认导入 ({parsedImportProducts.length}条)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 查看保险服务投保详情 (依据最新截图 100% 还原 投保方信息、保单信息、保单内容) */}
      {selectedInsServiceRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-3xl w-full border border-[#18284c] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#18284c]/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide">投保详情</span>
              <button
                type="button"
                onClick={() => setSelectedInsServiceRecord(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs font-sans max-h-[82vh] overflow-y-auto">
              {/* SECTION 1: 投保方信息 */}
              <div className="border border-[#18284c] rounded-xl bg-[#0a132e]/80 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#18284c] flex items-center gap-2 bg-[#0c183b]">
                  <span className="w-1 h-3.5 bg-[#00c88c] rounded-full" />
                  <span className="font-bold text-sm text-slate-100">投保方信息</span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-slate-300">
                  <div>
                    <span className="text-slate-400">申贷企业：</span>
                    <span className="text-slate-100 font-medium">{selectedInsServiceRecord.companyName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">统一社会信用代码：</span>
                    <span className="text-slate-100 font-mono">{selectedInsServiceRecord.creditCode || '91340123MA2T88992X'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">法定代表人：</span>
                    <span className="text-slate-100 font-medium">{selectedInsServiceRecord.legalPerson || '张建国'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">法人证件号：</span>
                    <span className="text-slate-100 font-mono">{selectedInsServiceRecord.legalIdCard || '340123198005126688'}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 保单信息 */}
              <div className="border border-[#18284c] rounded-xl bg-[#0a132e]/80 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#18284c] flex items-center gap-2 bg-[#0c183b]">
                  <span className="w-1 h-3.5 bg-[#00c88c] rounded-full" />
                  <span className="font-bold text-sm text-slate-100">保单信息</span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-slate-300">
                  <div>
                    <span className="text-slate-400">保险产品：</span>
                    <span className="text-[#00c88c] font-bold">{selectedInsServiceRecord.productName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">所属保险公司：</span>
                    <span className="text-slate-100 font-medium">中国人寿财产保险股份有限公司合肥支公司</span>
                  </div>
                  <div>
                    <span className="text-slate-400">保险金额：</span>
                    <span className="text-teal-300 font-mono font-bold">{selectedInsServiceRecord.premiumAmount.toFixed(2)}元/亩·年</span>
                  </div>
                  <div>
                    <span className="text-slate-400">最低投保面积：</span>
                    <span className="text-slate-100 font-mono">50亩</span>
                  </div>
                  <div>
                    <span className="text-slate-400">投保面积：</span>
                    <span className="text-slate-100 font-mono">{selectedInsServiceRecord.insuredArea}亩</span>
                  </div>
                  <div>
                    <span className="text-slate-400">保单金额：</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      {(selectedInsServiceRecord.premiumAmount * selectedInsServiceRecord.insuredArea).toFixed(0)}元
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">保单期限：</span>
                    <span className="text-slate-100 font-mono">{selectedInsServiceRecord.applyDate}~2027-10-18</span>
                  </div>
                  <div>
                    <span className="text-slate-400">申请人手机号码：</span>
                    <span className="text-slate-100 font-mono">{selectedInsServiceRecord.applicantPhone || '13812345678'}</span>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3 pt-1">
                    <span className="text-slate-400 shrink-0">保险合同：</span>
                    <div className="flex items-center gap-2 p-2 px-3 bg-[#101a36] border border-[#1d2d57] rounded-lg hover:border-[#00c88c] cursor-pointer transition-colors group">
                      <div className="w-8 h-9 rounded bg-rose-500/20 border border-rose-500/40 flex flex-col items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200 text-xs group-hover:text-[#00c88c]">
                          {selectedInsServiceRecord.productName}_电子保险合同.pdf
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          数字CA签章已认证 | 5.2 MB
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: 保单内容 */}
              <div className="border border-[#18284c] rounded-xl bg-[#0a132e]/80 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#18284c] flex items-center gap-2 bg-[#0c183b]">
                  <span className="w-1 h-3.5 bg-[#00c88c] rounded-full" />
                  <span className="font-bold text-sm text-slate-100">保单内容</span>
                </div>
                <div className="p-4">
                  <div className="max-h-56 overflow-y-auto pr-2 bg-[#070e20] p-3.5 rounded-lg border border-[#18284c] text-[11px] text-slate-300 leading-relaxed space-y-2.5 font-sans select-text">
                    <p className="font-medium text-slate-200">
                      第一条 本保险合同由保险条款、投保单、保险单、保险凭证以及批单组成。凡涉及本保险合同的约定，均应采用书面形式。
                    </p>
                    <p>
                      第二条 凡是从事林业种植和管理的农户、农民专业合作组织、集体经济组织或企业均可作为本保险合同的被保险人。
                    </p>
                    <p>
                      第三条 除另有约定外，本保险合同的投保人应与被保险人保持一致。
                    </p>
                    <p className="font-bold text-[#00c88c] pt-1">保险标的</p>
                    <p>
                      第四条 凡属于国家储备林建设，且生长和管理正常的林木，均可作为本保险合同的保险标的(以下简称“保险林木”)。
                    </p>
                    <p className="text-slate-400">
                      花卉、苗木，种植在房前屋后的零星土地及宅旁、村旁、路旁、水旁的林木，以及处于堤外地、蓄洪区、行洪区及当地洪水水位线以下的林木不属于本保险合同的保险标的。
                    </p>
                    <p className="font-bold text-[#00c88c] pt-1">保险责任</p>
                    <p>
                      第五条 在保险期间内，由于下列原因直接造成保险林木死亡、流失、被掩埋、主干折断或倒伏的直接经济损失，保险人按照本保险合同的约定负责赔偿：
                    </p>
                    <ul className="pl-4 space-y-0.5 list-disc text-slate-300">
                      <li>(一) 暴雨、洪水、风灾、冰雹、暴雪、霜冻、干旱；</li>
                      <li>(二) 泥石流；</li>
                      <li>(三) 林业有害生物；</li>
                      <li>(四) 火灾。</li>
                    </ul>
                    <p className="font-bold text-rose-400 pt-1">责任免除</p>
                    <p>
                      第六条 下列原因造成保险林木的损失，保险人不负责赔偿：
                    </p>
                    <p className="text-slate-400">
                      (一) 投保人及其家庭成员，被保险人及其家庭成员，投保人或被保险人雇用人员故意行为或重大过失行为；管理不善；他人的恶意破坏；
                    </p>
                    <p className="text-slate-400">
                      (二) 行政行为或司法行为。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-3.5 border-t border-[#18284c]/80 bg-[#070e20] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                凭单编号: POL-{selectedInsServiceRecord.id.toUpperCase()}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInsServiceRecord(null)}
                  className="px-5 py-2 bg-[#182342] hover:bg-[#20376c] text-slate-300 rounded-lg text-xs cursor-pointer transition-colors"
                >
                  关闭
                </button>
                {selectedInsServiceRecord.status === '申请中' && (
                  <button
                    type="button"
                    onClick={() => {
                      const rec = selectedInsServiceRecord;
                      setSelectedInsServiceRecord(null);
                      handleOpenSigningModal(rec);
                    }}
                    className="px-5 py-2 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    线上签约并生效
                  </button>
                )}
                {selectedInsServiceRecord.status === '已过期' && (
                  <button
                    type="button"
                    onClick={() => {
                      const rec = selectedInsServiceRecord;
                      setSelectedInsServiceRecord(null);
                      handleOpenRenewalModal(rec);
                    }}
                    className="px-5 py-2 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    办理保单续保
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 新增投保 (依据最新截图 100% 还原布局与字段) */}
      {isAddInsServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <input
            type="file"
            ref={insServiceAttachmentInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setInsServiceForm({ ...insServiceForm, attachmentName: file.name });
                triggerToast(`已选择附件材料：「${file.name}」`);
              }
            }}
            accept=".pdf,.jpg,.png,.jpeg"
            className="hidden"
          />

          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-3xl w-full border border-[#18284c] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#18284c]/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide">新增投保</span>
              <button
                type="button"
                onClick={() => setIsAddInsServiceModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveAddInsService} className="p-6 space-y-5 text-xs font-sans max-h-[82vh] overflow-y-auto">
              {/* SECTION 1: 投保方信息 */}
              <div className="bg-[#0a132e]/80 border border-[#18284c] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#18284c]">
                  <span className="w-1 h-3.5 bg-[#00c88c] rounded-full" />
                  <span className="font-bold text-sm text-slate-100">投保方信息</span>
                </div>

                <div className="space-y-3">
                  {/* 申贷企业 / 投保企业 */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
                    <label className="text-[11px] text-slate-300 sm:text-right font-medium">
                      <span className="text-rose-500 mr-1">*</span>申贷企业
                    </label>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        required
                        placeholder="请输入申贷企业名称"
                        value={insServiceForm.companyName || ''}
                        onChange={(e) => setInsServiceForm({ ...insServiceForm, companyName: e.target.value })}
                        className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* 统一社会信用代码 */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
                    <label className="text-[11px] text-slate-300 sm:text-right font-medium">
                      <span className="text-rose-500 mr-1">*</span>统一社会信用代码
                    </label>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        required
                        placeholder="请输入统一社会信用代码"
                        value={insServiceForm.creditCode || ''}
                        onChange={(e) => setInsServiceForm({ ...insServiceForm, creditCode: e.target.value })}
                        className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* 法定代表人 */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
                    <label className="text-[11px] text-slate-300 sm:text-right font-medium">
                      <span className="text-rose-500 mr-1">*</span>法定代表人
                    </label>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        required
                        placeholder="请输入法定代表人"
                        value={insServiceForm.legalPerson || ''}
                        onChange={(e) => setInsServiceForm({ ...insServiceForm, legalPerson: e.target.value })}
                        className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* 法人证件号 */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
                    <label className="text-[11px] text-slate-300 sm:text-right font-medium">
                      <span className="text-rose-500 mr-1">*</span>法人证件号
                    </label>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        required
                        placeholder="请输入法人证件号"
                        value={insServiceForm.legalIdCard || ''}
                        onChange={(e) => setInsServiceForm({ ...insServiceForm, legalIdCard: e.target.value })}
                        className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 保险信息 */}
              <div className="bg-[#0a132e]/80 border border-[#18284c] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#18284c]">
                  <span className="w-1 h-3.5 bg-[#00c88c] rounded-full" />
                  <span className="font-bold text-sm text-slate-100">保险信息</span>
                </div>

                <div className="space-y-4">
                  {/* 保险产品可选项卡区 */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2">
                    <label className="text-[11px] text-slate-300 sm:text-right pt-2 font-medium">
                      <span className="text-rose-500 mr-1">*</span>保险产品
                    </label>
                    <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 overflow-x-auto pb-1">
                      {[
                        {
                          id: 'ip-1',
                          name: '绿碳保·森林碳汇遥感险',
                          desc: '灾害损失保障高达500万',
                          rate: '3.90元/亩·年',
                          minArea: '100亩',
                        },
                        {
                          id: 'ip-2',
                          name: '生态惠农·综合固碳险',
                          desc: '灾害损失保障高达500万',
                          rate: '5.00元/亩·年',
                          minArea: '100亩',
                        },
                        {
                          id: 'ip-3',
                          name: '竹林风暴·气象灾害险',
                          desc: '灾害损失保障高达500万',
                          rate: '30.00元/亩·年',
                          minArea: '50亩',
                        },
                      ].map((card) => {
                        const isSelected = (insServiceForm.selectedProductId || 'ip-1') === card.id;
                        return (
                          <div
                            key={card.id}
                            onClick={() => setInsServiceForm({ ...insServiceForm, selectedProductId: card.id })}
                            className={`p-3 rounded-lg border cursor-pointer transition-all space-y-1 ${
                              isSelected
                                ? 'bg-[#0f1d3f] border-[#00c88c] ring-1 ring-[#00c88c] shadow-md shadow-emerald-950/80'
                                : 'bg-[#101a36] border-[#1d2d57] hover:border-slate-500'
                            }`}
                          >
                            <div className="font-bold text-slate-100 text-xs leading-snug">{card.name}</div>
                            <div className="text-[10px] text-slate-400">{card.desc}</div>
                            <div className="text-[11px] font-bold text-[#1890ff] font-mono pt-1">
                              投保金额 <span className="ml-0.5">{card.rate}</span>
                            </div>
                            <div className="text-[10px] text-[#00c88c] font-mono">
                              最低投保面积 <span className="ml-1 font-bold">{card.minArea}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 投保面积 */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
                    <label className="text-[11px] text-slate-300 sm:text-right font-medium">
                      <span className="text-rose-500 mr-1">*</span>投保面积
                    </label>
                    <div className="sm:col-span-3 relative flex items-center">
                      <input
                        type="number"
                        required
                        placeholder="请输入投保面积"
                        value={insServiceForm.insuredArea || ''}
                        onChange={(e) => setInsServiceForm({ ...insServiceForm, insuredArea: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-3 pr-10 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500 font-mono"
                      />
                      <span className="absolute right-3 text-xs text-slate-400 pointer-events-none font-sans">亩</span>
                    </div>
                  </div>

                  {/* 申请人手机号码 */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
                    <label className="text-[11px] text-slate-300 sm:text-right font-medium">
                      <span className="text-rose-500 mr-1">*</span>申请人手机号码
                    </label>
                    <div className="sm:col-span-3">
                      <input
                        type="tel"
                        required
                        placeholder="请输入申请人手机号码"
                        value={insServiceForm.applicantPhone || ''}
                        onChange={(e) => setInsServiceForm({ ...insServiceForm, applicantPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] placeholder-slate-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* 附件材料 */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2">
                    <label className="text-[11px] text-slate-300 sm:text-right pt-2 font-medium">
                      <span className="text-rose-500 mr-1">*</span>附件材料
                    </label>
                    <div className="sm:col-span-3 space-y-1.5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => insServiceAttachmentInputRef.current?.click()}
                          className="px-4 py-1.5 bg-[#101a36] hover:bg-[#182647] border border-[#1d2d57] hover:border-[#00c88c] rounded-lg text-xs text-slate-200 cursor-pointer font-medium transition-colors"
                        >
                          选择文件
                        </button>
                        {insServiceForm.attachmentName && (
                          <span className="text-xs text-teal-300 truncate max-w-xs font-mono">
                            ✓ 已选择: {insServiceForm.attachmentName}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        提示：单个附件最大支持50M，支持格式：PDF、JPG、PNG
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Centered Action Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  className="px-12 py-2.5 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-lg shadow-emerald-950/80 active:scale-95 transition-all"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 保险服务线上签约页面 */}
      {signingInsRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-xl w-full border border-[#18284c] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#18284c]/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#00c88c]" />
                <span>保险服务电子保单签约</span>
              </span>
              <button
                type="button"
                onClick={() => setSigningInsRecord(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleConfirmSignSubmit} className="p-6 space-y-4 text-xs font-sans max-h-[82vh] overflow-y-auto">
              {/* 保单概要面板 */}
              <div className="p-4 bg-[#0a132e] rounded-xl border border-[#18284c] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#18284c]">
                  <div>
                    <div className="text-sm font-bold text-[#00c88c]">{signingInsRecord.companyName}</div>
                    <div className="text-slate-300 text-xs mt-0.5">{signingInsRecord.productName}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-sky-950 text-sky-400 border border-sky-800 rounded-full font-bold text-[11px]">
                    待签约生效
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-400">所属行政区:</span>{' '}
                    <span className="text-slate-100 font-medium ml-1">{signingInsRecord.region}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">险种类型:</span>{' '}
                    <span className="text-emerald-400 font-bold ml-1">{signingInsRecord.insuranceType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">投保面积:</span>{' '}
                    <span className="text-slate-100 font-mono ml-1">{signingInsRecord.insuredArea} 亩</span>
                  </div>
                  <div>
                    <span className="text-slate-400">保费单价:</span>{' '}
                    <span className="text-teal-300 font-mono ml-1">{signingInsRecord.premiumAmount.toFixed(2)} 元/亩·年</span>
                  </div>
                  <div className="col-span-2 p-2.5 bg-[#0f1d3f] rounded-lg border border-[#1d2d57] flex items-center justify-between">
                    <span className="text-slate-300 font-medium">应缴年保费总额:</span>
                    <span className="text-emerald-400 font-bold text-sm font-mono">
                      ￥{(signingInsRecord.premiumAmount * signingInsRecord.insuredArea).toLocaleString()} 元/年
                    </span>
                  </div>
                </div>
              </div>

              {/* 签约条款与CA认证信息 */}
              <div className="p-4 bg-[#0d1738]/80 rounded-xl border border-[#1d2d57] space-y-3">
                <div className="font-bold text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00c88c]" />
                  <span>电子合同与数字证书确认</span>
                </div>

                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">承保机构:</span>
                    <span className="text-slate-200">中国人寿财产保险股份有限公司合肥支公司</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">电子保单编号:</span>
                    <span className="font-mono text-teal-300">POL-20261018-08892</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">保障有效期限:</span>
                    <span className="font-mono text-slate-200">2026-10-18 至 2027-10-17 (共365天)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">数字CA加密备案:</span>
                    <span className="text-emerald-400 font-bold">✓ 已通过国家授时中心时间戳认证</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#18284c]">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={signingAgreeTerms}
                      onChange={(e) => setSigningAgreeTerms(e.target.checked)}
                      className="mt-0.5 accent-[#00c88c] rounded cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-300 leading-snug">
                      我已阅读并完全同意<strong className="text-teal-300">《林业碳汇综合保险示范条款》</strong>、<strong className="text-teal-300">《免责事项说明及电子保单效力告知书》</strong>，确认以上投保信息真实无误。
                    </span>
                  </label>
                </div>
              </div>

              {/* 签约备注 */}
              <div>
                <label className="block text-[11px] text-slate-300 mb-1 font-medium">签约说明与备注</label>
                <textarea
                  rows={2}
                  value={signingNote}
                  onChange={(e) => setSigningNote(e.target.value)}
                  placeholder="请输入签约附言"
                  className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] placeholder-slate-500"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#18284c]/80">
                <button
                  type="button"
                  onClick={() => setSigningInsRecord(null)}
                  className="px-5 py-2 bg-[#182342] hover:bg-[#20376c] text-slate-300 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>确认电子签约并生效</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 保险服务办理续保页面 */}
      {renewingInsRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-xl w-full border border-[#18284c] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#18284c]/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#00c88c]" />
                <span>保险服务保单续保办理</span>
              </span>
              <button
                type="button"
                onClick={() => setRenewingInsRecord(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleConfirmRenewalSubmit} className="p-6 space-y-4 text-xs font-sans max-h-[82vh] overflow-y-auto">
              {/* 原保单历史概要 */}
              <div className="p-4 bg-[#0a132e] rounded-xl border border-[#18284c] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#18284c]">
                  <div>
                    <div className="text-sm font-bold text-slate-100">{renewingInsRecord.companyName}</div>
                    <div className="text-slate-300 text-xs mt-0.5">{renewingInsRecord.productName}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-rose-950 text-rose-400 border border-rose-800 rounded-full font-bold text-[11px]">
                    保单已到期
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-400">原保单编号:</span>{' '}
                    <span className="font-mono text-slate-200 ml-1">POL-{renewingInsRecord.id.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">原保障止日:</span>{' '}
                    <span className="font-mono text-rose-300 ml-1">{renewingInsRecord.applyDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">原投保面积:</span>{' '}
                    <span className="font-mono text-slate-200 ml-1">{renewingInsRecord.insuredArea} 亩</span>
                  </div>
                  <div>
                    <span className="text-slate-400">原保费单价:</span>{' '}
                    <span className="font-mono text-teal-300 ml-1">{renewingInsRecord.premiumAmount.toFixed(2)} 元/亩·年</span>
                  </div>
                </div>
              </div>

              {/* 续保调整方案 */}
              <div className="p-4 bg-[#0d1738]/80 rounded-xl border border-[#1d2d57] space-y-3.5">
                <div className="font-bold text-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>新一周期续保保障方案</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    享 95 折无赔款续保优待
                  </span>
                </div>

                {/* 续保面积调整 */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] text-slate-200 font-medium">
                    <span className="text-rose-500 mr-1">*</span>续保投保面积
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      required
                      value={renewAreaInput}
                      onChange={(e) => setRenewAreaInput(e.target.value)}
                      placeholder="请输入续保面积"
                      className="w-full pl-3 pr-10 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] font-mono"
                    />
                    <span className="absolute right-3 text-xs text-slate-400 pointer-events-none">亩</span>
                  </div>
                </div>

                {/* 续保起止时间 & 费用测算 */}
                <div className="p-3 bg-[#0a132e] rounded-lg border border-[#18284c] space-y-2 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">续保生效起止日期:</span>
                    <span className="font-mono text-emerald-400 font-bold">2026-10-18 至 2027-10-17</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">预计续保年保费总额:</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      ￥{((renewingInsRecord.premiumAmount * (Number(renewAreaInput) || 0)) * 0.95).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元
                    </span>
                  </div>
                </div>
              </div>

              {/* 续保备注 */}
              <div>
                <label className="block text-[11px] text-slate-300 mb-1 font-medium">续保申请备注</label>
                <textarea
                  rows={2}
                  value={renewNote}
                  onChange={(e) => setRenewNote(e.target.value)}
                  placeholder="请输入续保备注"
                  className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-xs text-slate-100 outline-none focus:border-[#00c88c] placeholder-slate-500"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#18284c]/80">
                <button
                  type="button"
                  onClick={() => setRenewingInsRecord(null)}
                  className="px-5 py-2 bg-[#182342] hover:bg-[#20376c] text-slate-300 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>确认办理续保并激活新保单</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 新增/编辑闲荒地登记 (统一深色科技感主题样式，保持9项表单结构不变) */}
      {isAddLandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-xl w-full border border-[#18284c] overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#18284c]/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide">
                {editingLand ? '编辑登记' : '新增登记'}
              </span>
              <button
                type="button"
                onClick={() => setIsAddLandModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveLandSubmit} className="p-6 overflow-y-auto space-y-4 text-xs bg-[#091126]">
              {/* Field 1: 地块名称 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>地块名称
                </label>
                <input
                  type="text"
                  value={landForm.parcelName || ''}
                  onChange={(e) => setLandForm((f) => ({ ...f, parcelName: e.target.value }))}
                  placeholder="请输入"
                  className="flex-1 px-3 py-2 text-xs border border-[#1d2d57] rounded focus:outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] text-slate-100 placeholder-slate-500 bg-[#101a36] transition-colors"
                />
              </div>

              {/* Field 2: 所属行政区划 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>所属行政区划
                </label>
                <div className="flex-1 relative">
                  <select
                    value={landForm.region || ''}
                    onChange={(e) => setLandForm((f) => ({ ...f, region: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-[#1d2d57] rounded appearance-none bg-[#101a36] focus:outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] text-slate-100 transition-colors cursor-pointer"
                  >
                    <option value="" className="bg-[#101a36] text-slate-400">请选择</option>
                    <option value="合肥市 包河区" className="bg-[#101a36] text-slate-100">合肥市 包河区</option>
                    <option value="合肥市 肥西县" className="bg-[#101a36] text-slate-100">合肥市 肥西县</option>
                    <option value="合肥市 庐阳区" className="bg-[#101a36] text-slate-100">合肥市 庐阳区</option>
                    <option value="合肥市 肥东县" className="bg-[#101a36] text-slate-100">合肥市 肥东县</option>
                    <option value="合肥市 高新区" className="bg-[#101a36] text-slate-100">合肥市 高新区</option>
                    <option value="黄山市 休宁县" className="bg-[#101a36] text-slate-100">黄山市 休宁县</option>
                    <option value="安庆市 岳西县" className="bg-[#101a36] text-slate-100">安庆市 岳西县</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Field 3: 登记方名称 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>登记方名称
                </label>
                <input
                  type="text"
                  value={landForm.registrantName || ''}
                  onChange={(e) => setLandForm((f) => ({ ...f, registrantName: e.target.value }))}
                  placeholder="请输入"
                  className="flex-1 px-3 py-2 text-xs border border-[#1d2d57] rounded focus:outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] text-slate-100 placeholder-slate-500 bg-[#101a36] transition-colors"
                />
              </div>

              {/* Field 4: 登记方联系电话 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>登记方联系电话
                </label>
                <input
                  type="text"
                  value={landForm.contactPhone || ''}
                  onChange={(e) => setLandForm((f) => ({ ...f, contactPhone: e.target.value }))}
                  placeholder="请输入"
                  className="flex-1 px-3 py-2 text-xs border border-[#1d2d57] rounded focus:outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] text-slate-100 placeholder-slate-500 bg-[#101a36] transition-colors font-mono"
                />
              </div>

              {/* Field 5: 地块面积 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>地块面积
                </label>
                <div className="flex-1 flex rounded border border-[#1d2d57] overflow-hidden focus-within:border-[#00c88c] focus-within:ring-1 focus-within:ring-[#00c88c] bg-[#101a36] transition-colors">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={landForm.areaMu === ('' as unknown as number) ? '' : (landForm.areaMu ?? '')}
                    onChange={(e) =>
                      setLandForm((f) => ({
                        ...f,
                        areaMu: e.target.value === '' ? ('' as unknown as number) : Number(e.target.value),
                      }))
                    }
                    placeholder="请输入"
                    className="flex-1 px-3 py-2 text-xs focus:outline-none text-slate-100 placeholder-slate-500 font-mono bg-transparent"
                  />
                  <span className="px-4 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-300 text-xs flex items-center justify-center min-w-[50px] shrink-0 font-normal">
                    亩
                  </span>
                </div>
              </div>

              {/* Field 6: 土地坐落 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>土地坐落
                </label>
                <input
                  type="text"
                  value={landForm.location || ''}
                  onChange={(e) => setLandForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="请输入"
                  className="flex-1 px-3 py-2 text-xs border border-[#1d2d57] rounded focus:outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] text-slate-100 placeholder-slate-500 bg-[#101a36] transition-colors"
                />
              </div>

              {/* Field 7: 意向价格 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>意向价格
                </label>
                <div className="flex-1 flex rounded border border-[#1d2d57] overflow-hidden focus-within:border-[#00c88c] focus-within:ring-1 focus-within:ring-[#00c88c] bg-[#101a36] transition-colors">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={landForm.expectedPrice === ('' as unknown as number) ? '' : (landForm.expectedPrice ?? '')}
                    onChange={(e) =>
                      setLandForm((f) => ({
                        ...f,
                        expectedPrice: e.target.value === '' ? ('' as unknown as number) : Number(e.target.value),
                      }))
                    }
                    placeholder="请输入"
                    className="flex-1 px-3 py-2 text-xs focus:outline-none text-slate-100 placeholder-slate-500 font-mono bg-transparent"
                  />
                  <span className="px-3 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-300 text-xs flex items-center justify-center min-w-[60px] shrink-0 font-normal">
                    元/亩
                  </span>
                </div>
              </div>

              {/* Field 8: 出借期限 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>出借期限
                </label>
                <div className="flex-1 flex rounded border border-[#1d2d57] overflow-hidden focus-within:border-[#00c88c] focus-within:ring-1 focus-within:ring-[#00c88c] bg-[#101a36] transition-colors">
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={landForm.leaseTermYears === ('' as unknown as number) ? '' : (landForm.leaseTermYears ?? '')}
                    onChange={(e) =>
                      setLandForm((f) => ({
                        ...f,
                        leaseTermYears: e.target.value === '' ? ('' as unknown as number) : Number(e.target.value),
                      }))
                    }
                    placeholder="请输入"
                    className="flex-1 px-3 py-2 text-xs focus:outline-none text-slate-100 placeholder-slate-500 font-mono bg-transparent"
                  />
                  <span className="px-4 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-300 text-xs flex items-center justify-center min-w-[50px] shrink-0 font-normal">
                    年
                  </span>
                </div>
              </div>

              {/* Field 9: 土地情况 (无红色星号, 对应截图多行文本域) */}
              <div className="flex items-start gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal pt-2">
                  土地情况
                </label>
                <textarea
                  rows={4}
                  value={landForm.landCondition || ''}
                  onChange={(e) => setLandForm((f) => ({ ...f, landCondition: e.target.value }))}
                  placeholder="请输入"
                  className="flex-1 px-3 py-2 text-xs border border-[#1d2d57] rounded focus:outline-none focus:border-[#00c88c] focus:ring-1 focus:ring-[#00c88c] text-slate-100 placeholder-slate-500 bg-[#101a36] resize-none transition-colors"
                />
              </div>

              {/* Bottom Centered Green Submit Button (保持翡翠绿按钮，文字对比增强) */}
              <div className="flex justify-center pt-5 pb-1">
                <button
                  type="submit"
                  className="px-14 py-2.5 bg-[#00c88c] hover:bg-[#00e699] active:scale-95 text-slate-950 font-bold rounded text-sm transition-all shadow-md shadow-[#00c88c]/20 cursor-pointer"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 闲置地详情 (依据用户上传截图 image_cb77a149.png 100% 像素级高保真还原: 包含基本信息与真实卫星地图位置，统一深色主题，无XXX，近期时间) */}
      {selectedIdleLand && (() => {
        // 数据清洗保证无任何 "XXX" 并统一近期时间
        const rawName = selectedIdleLand.parcelName || '';
        const cleanParcelName = rawName.includes('X')
          ? '合肥市包河区大圩镇金葡萄生态林地'
          : rawName;

        const rawReg = selectedIdleLand.region || '合肥市 包河区';
        const cleanRegion = rawReg.includes('X') ? '合肥市 包河区' : rawReg;

        const rawOrg = selectedIdleLand.registrantName || '';
        const cleanRegistrant = rawOrg.includes('X')
          ? '合肥市包河区大圩农场林业专业合作社'
          : rawOrg;

        const rawPhone = selectedIdleLand.contactPhone || '';
        const cleanPhone = rawPhone.includes('X') || rawPhone.includes('*') || !rawPhone
          ? '18965362225'
          : rawPhone;

        const cleanArea = `${selectedIdleLand.areaMu || 10}亩`;

        const rawLoc = selectedIdleLand.location || '';
        const cleanLocation = rawLoc.includes('X') || !rawLoc
          ? '合肥市包河区大圩镇金葡萄生态农业示范区东侧'
          : rawLoc;

        const cleanPrice = `${selectedIdleLand.expectedPrice || 1000}元/亩`;
        const cleanTerm = `${selectedIdleLand.leaseTermYears || 10}年`;

        const rawCond = selectedIdleLand.landCondition || '';
        const cleanCondition = rawCond.includes('X') || rawCond.length < 15
          ? '地块地势平坦开阔，土壤肥沃富硒，周边水系环绕且灌溉设施齐全，紧邻大圩生态景观廊道，交通路网便捷，非常适宜高标准实施林下经济作物种植、耐湿耐旱乔木培育及生态碳汇林开发。'
          : rawCond;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-2xl w-full border border-[#18284c] overflow-hidden flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#18284c]/80 flex items-center justify-between bg-[#0a142e]">
                <span className="font-bold text-base text-white tracking-wide">
                  闲置地详情
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedIdleLand(null)}
                  className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                  title="关闭"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Scrollable with Two Section Cards */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs bg-[#091126]">
                {/* CARD 1: 基本信息 (完全还原截图字段排版) */}
                <div className="border border-[#18284c] rounded-xl p-5 bg-[#0a132e]/90 space-y-3.5">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-[#18284c]/80">
                    <span className="w-1 h-3.5 bg-[#00c88c] rounded-full inline-block" />
                    <span className="font-bold text-sm text-slate-100">基本信息</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start">
                      <span className="w-28 text-slate-400 shrink-0">地块名称：</span>
                      <span className="text-slate-100 font-medium">{cleanParcelName}</span>
                    </div>

                    <div className="flex items-start">
                      <span className="w-28 text-slate-400 shrink-0">所属行政区划：</span>
                      <span className="text-slate-100 font-medium">{cleanRegion}</span>
                    </div>

                    <div className="flex items-start">
                      <span className="w-28 text-slate-400 shrink-0">登记方名称：</span>
                      <span className="text-slate-100 font-medium">{cleanRegistrant}</span>
                    </div>

                    <div className="flex items-start">
                      <span className="w-28 text-slate-400 shrink-0">登记方联系电话：</span>
                      <span className="text-slate-100 font-mono font-medium">{cleanPhone}</span>
                    </div>

                    <div className="flex items-start">
                      <span className="w-28 text-slate-400 shrink-0">地块面积：</span>
                      <span className="text-slate-100 font-mono font-medium">{cleanArea}</span>
                    </div>

                    <div className="flex items-start">
                      <span className="w-28 text-slate-400 shrink-0">土地坐落：</span>
                      <span className="text-slate-100 font-medium">{cleanLocation}</span>
                    </div>

                    <div className="flex items-start">
                      <span className="w-28 text-slate-400 shrink-0">意向价格：</span>
                      <span className="text-[#00c88c] font-mono font-semibold">{cleanPrice}</span>
                    </div>

                    <div className="flex items-start">
                      <span className="w-28 text-slate-400 shrink-0">出借期限：</span>
                      <span className="text-slate-100 font-mono font-medium">{cleanTerm}</span>
                    </div>

                    <div className="flex items-start pt-1">
                      <span className="w-28 text-slate-400 shrink-0 pt-0.5">土地情况：</span>
                      <div className="text-slate-200 leading-relaxed font-normal bg-[#0e1939]/80 p-3 rounded-lg border border-[#1d2d57]/60 flex-1">
                        {cleanCondition}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: 地图位置 (依据截图真实遥感卫星图展示，标注坟塘、小薛家、小庄、绿色地块轮廓与红色标记点) */}
                <div className="border border-[#18284c] rounded-xl p-5 bg-[#0a132e]/90 space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#18284c]/80">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-3.5 bg-[#00c88c] rounded-full inline-block" />
                      <span className="font-bold text-sm text-slate-100">地图位置</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#00c88c] animate-pulse" />
                      <span className="font-mono">遥感正射卫星影像 (高分二号 0.8m)</span>
                    </div>
                  </div>

                  {/* Satellite Aerial Map Viewport */}
                  <div className="relative w-full h-[290px] sm:h-[330px] rounded-lg overflow-hidden border border-[#1d2d57] bg-[#122216] select-none shadow-inner">
                    {/* SVG Realistic Satellite Aerial Landscape */}
                    <svg
                      viewBox="0 0 600 360"
                      className="w-full h-full object-cover"
                      preserveAspectRatio="xMidYMid slice"
                    >
                      <defs>
                        {/* 卫星农田自然深色滤镜渐变 */}
                        <linearGradient id="satBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1a2d1d" />
                          <stop offset="35%" stopColor="#253823" />
                          <stop offset="65%" stopColor="#1d2f1d" />
                          <stop offset="100%" stopColor="#182717" />
                        </linearGradient>

                        {/* 水系池塘真实遥感水色 */}
                        <linearGradient id="waterGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0e1f26" />
                          <stop offset="100%" stopColor="#152e39" />
                        </linearGradient>

                        <linearGradient id="waterGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#11252d" />
                          <stop offset="100%" stopColor="#0c1a21" />
                        </linearGradient>

                        {/* 地块多边形微光滤镜 */}
                        <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* 底层卫星农业地表基础色 */}
                      <rect width="600" height="360" fill="url(#satBgGrad)" />

                      {/* 卫星影像中的农田条块色带与肌理 */}
                      <g opacity="0.6">
                        <polygon points="0,0 220,0 190,130 0,110" fill="#20331e" />
                        <polygon points="220,0 420,0 390,90 190,130" fill="#273d24" />
                        <polygon points="420,0 600,0 600,140 400,110" fill="#1e301b" />
                        <polygon points="0,110 180,135 150,260 0,240" fill="#293d25" />
                        <polygon points="180,135 340,145 310,270 150,260" fill="#23351f" />
                        <polygon points="340,145 520,130 500,260 310,270" fill="#2b4027" />
                        <polygon points="520,130 600,140 600,280 500,260" fill="#21331c" />
                        <polygon points="0,240 160,265 140,360 0,360" fill="#1c2c1a" />
                        <polygon points="160,265 330,275 320,360 140,360" fill="#243720" />
                        <polygon points="330,275 600,280 600,360 320,360" fill="#1f311c" />
                      </g>

                      {/* 卫星水系与水塘 (对应截图左上部「坟塘」等自然水体) */}
                      {/* 坟塘大水塘 */}
                      <path
                        d="M 120 70 Q 140 40 180 50 Q 230 55 240 90 Q 245 125 210 135 Q 170 145 140 130 Q 105 110 120 70 Z"
                        fill="url(#waterGrad1)"
                        stroke="#2f4842"
                        strokeWidth="1.2"
                      />
                      {/* 辅助水塘1 (左下) */}
                      <path
                        d="M 60 210 Q 90 200 115 225 Q 120 255 95 270 Q 65 280 50 250 Z"
                        fill="url(#waterGrad2)"
                        stroke="#253c37"
                        strokeWidth="1"
                      />
                      {/* 辅助水塘2 (中下部水系群) */}
                      <path
                        d="M 170 300 Q 210 280 240 310 Q 245 345 200 355 Q 165 345 170 300 Z"
                        fill="url(#waterGrad2)"
                        stroke="#253c37"
                        strokeWidth="1"
                      />
                      <path
                        d="M 260 305 Q 290 290 320 310 Q 325 345 285 355 Q 255 340 260 305 Z"
                        fill="url(#waterGrad2)"
                        stroke="#253c37"
                        strokeWidth="1"
                      />

                      {/* 卫星乡村公路与机耕道路网 (贯穿地块四周与村庄) */}
                      <g stroke="#617364" strokeLinecap="round" opacity="0.85">
                        {/* 纵贯主道路 (右侧直通小庄) */}
                        <path d="M 520 0 L 485 150 L 470 240 L 460 360" strokeWidth="3" fill="none" />
                        <path d="M 520 0 L 485 150 L 470 240 L 460 360" stroke="#899c8d" strokeWidth="1" fill="none" />

                        {/* 乡村支路连接小薛家 */}
                        <path d="M 0 160 Q 150 170 230 220 Q 300 240 470 240" strokeWidth="2.2" fill="none" strokeDasharray="6 2" />
                        <path d="M 180 50 Q 200 130 230 220" strokeWidth="1.8" fill="none" />
                        <path d="M 230 220 Q 260 260 260 360" strokeWidth="2" fill="none" />
                      </g>

                      {/* 村落居民点建筑群模拟像素斑块 */}
                      {/* 坟塘旁村落 */}
                      <g opacity="0.8">
                        <rect x="180" y="85" width="8" height="6" fill="#a4b3a2" rx="1" />
                        <rect x="192" y="88" width="10" height="7" fill="#8f9e8d" rx="1" />
                        <rect x="185" y="96" width="9" height="6" fill="#bac8b8" rx="1" />
                      </g>

                      {/* 小薛家建筑群 */}
                      <g opacity="0.85">
                        <rect x="185" y="240" width="12" height="8" fill="#d2ded0" rx="1" />
                        <rect x="200" y="238" width="14" height="9" fill="#a7b8a5" rx="1" />
                        <rect x="190" y="252" width="10" height="8" fill="#b9c7b6" rx="1" />
                        <rect x="204" y="250" width="12" height="7" fill="#8d9d8b" rx="1" />
                      </g>

                      {/* 小庄建筑群 */}
                      <g opacity="0.85">
                        <rect x="490" y="165" width="12" height="8" fill="#cdd8cb" rx="1" />
                        <rect x="505" y="168" width="10" height="7" fill="#a4b5a2" rx="1" />
                        <rect x="495" y="178" width="14" height="8" fill="#b6c5b3" rx="1" />
                      </g>

                      {/* 地块绿色多边形边界 (100% 对应截图形状与色彩) */}
                      {/* 截图中的多边形顶点特征: 位于中心偏下水塘与薛家东侧 */}
                      <g filter="url(#emeraldGlow)">
                        <polygon
                          points="260,265 295,250 335,270 315,310 270,300 245,280"
                          fill="rgba(0, 200, 140, 0.22)"
                          stroke="#00c88c"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                        />
                      </g>

                      {/* 多边形顶点锚点高亮 */}
                      <circle cx="260" cy="265" r="2.5" fill="#ffffff" stroke="#00c88c" strokeWidth="1.5" />
                      <circle cx="295" cy="250" r="2.5" fill="#ffffff" stroke="#00c88c" strokeWidth="1.5" />
                      <circle cx="335" cy="270" r="2.5" fill="#ffffff" stroke="#00c88c" strokeWidth="1.5" />
                      <circle cx="315" cy="310" r="2.5" fill="#ffffff" stroke="#00c88c" strokeWidth="1.5" />
                      <circle cx="270" cy="300" r="2.5" fill="#ffffff" stroke="#00c88c" strokeWidth="1.5" />
                      <circle cx="245" cy="280" r="2.5" fill="#ffffff" stroke="#00c88c" strokeWidth="1.5" />

                      {/* 地图地名文本标注 (完全还原截图白色带深色描边的地名) */}
                      {/* 1. 坟塘 */}
                      <text
                        x="170"
                        y="82"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        stroke="#162b21"
                        strokeWidth="2.5"
                        paintOrder="stroke fill"
                      >
                        坟塘
                      </text>

                      {/* 2. 小薛家 */}
                      <text
                        x="190"
                        y="235"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        stroke="#162b21"
                        strokeWidth="2.5"
                        paintOrder="stroke fill"
                      >
                        小薛家
                      </text>

                      {/* 3. 小庄 */}
                      <text
                        x="470"
                        y="172"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        stroke="#162b21"
                        strokeWidth="2.5"
                        paintOrder="stroke fill"
                      >
                        小庄
                      </text>
                    </svg>

                    {/* 中心红色标记图钉 (完全对应截图中的红色 Map Pin) */}
                    {/* 地块中心坐标约位于 (285, 275) */}
                    <div
                      className="absolute z-10 -translate-x-1/2 -translate-y-full pointer-events-none flex flex-col items-center"
                      style={{ left: '48.5%', top: '77%' }}
                    >
                      {/* 红色立体图钉 */}
                      <div className="relative">
                        <MapPin className="w-8 h-8 text-rose-500 fill-rose-500 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]" />
                        <div className="w-2 h-2 rounded-full bg-white absolute top-2 left-3 shadow-xs" />
                      </div>
                      {/* 地面雷达脉冲光环 */}
                      <div className="w-4 h-2 -mt-1 rounded-full bg-rose-500/40 border border-rose-400 animate-ping" />
                    </div>

                    {/* 地图 HUD 悬浮信息条与控制 */}
                    <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-[#18284c] text-[10px] text-slate-300 font-mono flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>合肥市包河区大圩示范区 · 宗地编号 #{selectedIdleLand.id}</span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-[#18284c] text-[10px] text-emerald-300 font-mono flex items-center gap-2 shadow-md">
                      <span>117°22'58"E</span>
                      <span className="text-slate-500">|</span>
                      <span>31°45'04"N</span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-[#18284c] text-[9.5px] text-slate-400 font-mono flex items-center gap-1">
                      <span className="w-6 h-[2px] bg-slate-300 inline-block" />
                      <span>50米 (1:2000)</span>
                    </div>

                    {/* 地图缩放控制按钮 */}
                    <div className="absolute bottom-2.5 right-2.5 flex flex-col bg-slate-950/90 rounded border border-[#18284c] overflow-hidden shadow-lg">
                      <button
                        type="button"
                        onClick={() => triggerToast('遥感卫星图已放大显示')}
                        className="w-7 h-7 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-sm font-bold border-b border-[#18284c]"
                        title="放大"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerToast('遥感卫星图已缩小显示')}
                        className="w-7 h-7 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-sm font-bold"
                        title="缩小"
                      >
                        -
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL: 新增/编辑租借登记 (Dark Unified Theme, 严格依照截图 image_f7f10082.png 字段) */}
      {isLeaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-xl w-full border border-[#18284c] overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header: 新增租借 / 编辑租借 */}
            <div className="px-6 py-4 border-b border-[#18284c]/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide">
                {editingLease ? '编辑租借' : '新增租借'}
              </span>
              <button
                type="button"
                onClick={() => setIsLeaseModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLease} className="p-6 overflow-y-auto space-y-4 text-xs bg-[#091126]">
              {/* 1. * 租借土地 (请选择登记的闲荒地) */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>租借土地
                </label>
                <div className="flex-1 relative">
                  <select
                    value={leaseForm.landName || ''}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      const matched = idleLands.find((l) => l.parcelName === selectedName);
                      if (matched) {
                        setLeaseForm((f) => ({
                          ...f,
                          landName: matched.parcelName,
                          region: matched.region || f.region,
                          areaMu: matched.areaMu || f.areaMu,
                          registrantName: matched.registrantName || f.registrantName,
                          leasePrice: matched.expectedPrice ?? f.leasePrice,
                          leaseTermYears: matched.leaseTermYears ?? f.leaseTermYears,
                        }));
                      } else {
                        setLeaseForm((f) => ({ ...f, landName: selectedName }));
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-[#1d2d57] rounded focus:outline-none focus:border-[#00c88c] text-slate-100 bg-[#101a36] cursor-pointer"
                    required
                  >
                    <option value="" disabled className="text-slate-500">
                      请选择登记的闲荒地
                    </option>
                    {idleLands.map((land) => (
                      <option key={land.id} value={land.parcelName} className="bg-[#091126] text-slate-200">
                        {land.parcelName} ({land.areaMu}亩 - {land.region})
                      </option>
                    ))}
                    {leaseForm.landName && !idleLands.some((l) => l.parcelName === leaseForm.landName) && (
                      <option value={leaseForm.landName} className="bg-[#091126] text-slate-200">
                        {leaseForm.landName}
                      </option>
                    )}
                  </select>
                </div>
              </div>

              {/* 2. * 所属行政区划 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>所属行政区划
                </label>
                <div className="flex-1 relative">
                  <select
                    value={leaseForm.region || ''}
                    onChange={(e) => setLeaseForm((f) => ({ ...f, region: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-[#1d2d57] rounded focus:outline-none focus:border-[#00c88c] text-slate-100 bg-[#101a36] cursor-pointer"
                    required
                  >
                    <option value="" disabled className="text-slate-500">
                      请选择
                    </option>
                    <option value="合肥市 肥西县" className="bg-[#091126] text-slate-200">合肥市 肥西县</option>
                    <option value="合肥市 庐阳区" className="bg-[#091126] text-slate-200">合肥市 庐阳区</option>
                    <option value="合肥市 肥东县" className="bg-[#091126] text-slate-200">合肥市 肥东县</option>
                    <option value="合肥市 高新区" className="bg-[#091126] text-slate-200">合肥市 高新区</option>
                    <option value="合肥市 蜀山区" className="bg-[#091126] text-slate-200">合肥市 蜀山区</option>
                    <option value="合肥市 包河区" className="bg-[#091126] text-slate-200">合肥市 包河区</option>
                  </select>
                </div>
              </div>

              {/* 3. * 租借方名称 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>租借方名称
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入"
                  value={leaseForm.lesseeName || ''}
                  onChange={(e) => setLeaseForm((f) => ({ ...f, lesseeName: e.target.value }))}
                  className="flex-1 px-3 py-2 text-xs border border-[#1d2d57] rounded focus:outline-none focus:border-[#00c88c] text-slate-100 placeholder-slate-500 bg-[#101a36]"
                />
              </div>

              {/* 4. * 租借方联系电话 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>租借方联系电话
                </label>
                <input
                  type="tel"
                  required
                  placeholder="请输入"
                  value={leaseForm.lesseePhone || ''}
                  onChange={(e) => setLeaseForm((f) => ({ ...f, lesseePhone: e.target.value }))}
                  className="flex-1 px-3 py-2 text-xs border border-[#1d2d57] rounded focus:outline-none focus:border-[#00c88c] text-slate-100 placeholder-slate-500 bg-[#101a36]"
                />
              </div>

              {/* 5. * 租借面积 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>租借面积
                </label>
                <div className="flex-1 flex rounded border border-[#1d2d57] overflow-hidden focus-within:border-[#00c88c] bg-[#101a36]">
                  <input
                    type="number"
                    min={0.1}
                    step="any"
                    required
                    placeholder="请输入"
                    value={leaseForm.areaMu ?? ''}
                    onChange={(e) => setLeaseForm((f) => ({ ...f, areaMu: e.target.value === '' ? undefined : Number(e.target.value) }))}
                    className="flex-1 px-3 py-2 text-xs focus:outline-none text-slate-100 font-mono bg-transparent placeholder-slate-500"
                  />
                  <span className="px-4 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-400 text-xs flex items-center font-mono">
                    亩
                  </span>
                </div>
              </div>

              {/* 6. * 租借价格 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>租借价格
                </label>
                <div className="flex-1 flex rounded border border-[#1d2d57] overflow-hidden focus-within:border-[#00c88c] bg-[#101a36]">
                  <input
                    type="number"
                    min={0.1}
                    step="any"
                    required
                    placeholder="请输入"
                    value={leaseForm.leasePrice ?? ''}
                    onChange={(e) => setLeaseForm((f) => ({ ...f, leasePrice: e.target.value === '' ? undefined : Number(e.target.value) }))}
                    className="flex-1 px-3 py-2 text-xs focus:outline-none text-slate-100 font-mono bg-transparent placeholder-slate-500"
                  />
                  <span className="px-4 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-400 text-xs flex items-center font-mono">
                    元/亩
                  </span>
                </div>
              </div>

              {/* 7. * 租借年限 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>租借年限
                </label>
                <div className="flex-1 flex rounded border border-[#1d2d57] overflow-hidden focus-within:border-[#00c88c] bg-[#101a36]">
                  <input
                    type="number"
                    min={1}
                    step="1"
                    required
                    placeholder="请输入"
                    value={leaseForm.leaseTermYears ?? ''}
                    onChange={(e) => setLeaseForm((f) => ({ ...f, leaseTermYears: e.target.value === '' ? undefined : Number(e.target.value) }))}
                    className="flex-1 px-3 py-2 text-xs focus:outline-none text-slate-100 font-mono bg-transparent placeholder-slate-500"
                  />
                  <span className="px-4 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-400 text-xs flex items-center font-mono">
                    年
                  </span>
                </div>
              </div>

              {/* 8. * 交易时间 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal">
                  <span className="text-rose-400 mr-1">*</span>交易时间
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入"
                  value={leaseForm.dealDate || ''}
                  onChange={(e) => setLeaseForm((f) => ({ ...f, dealDate: e.target.value }))}
                  className="flex-1 px-3 py-2 text-xs border border-[#1d2d57] rounded focus:outline-none focus:border-[#00c88c] text-slate-100 placeholder-slate-500 font-mono bg-[#101a36]"
                />
              </div>

              {/* 9. 租借用途 (无星号) */}
              <div className="flex items-start gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 text-xs font-normal pt-2">
                  租借用途
                </label>
                <textarea
                  rows={3}
                  placeholder="请输入"
                  value={leaseForm.leaseUsage || ''}
                  onChange={(e) => setLeaseForm((f) => ({ ...f, leaseUsage: e.target.value }))}
                  className="flex-1 px-3 py-2 text-xs border border-[#1d2d57] rounded focus:outline-none focus:border-[#00c88c] text-slate-100 placeholder-slate-500 bg-[#101a36] resize-none"
                />
              </div>

              {/* 提交按钮 (居中) */}
              <div className="flex justify-center pt-3 pb-1">
                <button
                  type="submit"
                  className="px-14 py-2 bg-[#00c88c] hover:bg-[#00e699] text-white font-medium rounded text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 盘活利用租借详情 (Dark Unified Theme, 无XXX, 近期时间) */}
      {selectedLeaseDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl shadow-black/90 max-w-xl w-full border border-[#18284c] overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-[#18284c]/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide">
                盘活租借详情
              </span>
              <button
                type="button"
                onClick={() => setSelectedLeaseDetail(null)}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs bg-[#091126]">
              {/* 基本信息 */}
              <div className="border border-[#18284c] rounded-xl p-5 bg-[#0a132e]/90 space-y-3">
                <div className="flex items-center gap-2 pb-2.5 border-b border-[#18284c]/80">
                  <span className="w-1 h-3.5 bg-[#00c88c] rounded-full inline-block" />
                  <span className="font-bold text-sm text-slate-100">地块与租借主体</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start">
                    <span className="w-28 text-slate-400 shrink-0">地块名称：</span>
                    <span className="text-emerald-400 font-bold">{selectedLeaseDetail.landName}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-28 text-slate-400 shrink-0">所属行政区划：</span>
                    <span className="text-slate-100">{selectedLeaseDetail.region}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-28 text-slate-400 shrink-0">流转盘活面积：</span>
                    <span className="text-slate-100 font-mono font-bold">{selectedLeaseDetail.areaMu} 亩</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-28 text-slate-400 shrink-0">登记方名称：</span>
                    <span className="text-slate-100 font-medium">{selectedLeaseDetail.registrantName}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-28 text-slate-400 shrink-0">租借方主体：</span>
                    <span className="text-slate-100 font-medium">{selectedLeaseDetail.lesseeName}</span>
                  </div>
                </div>
              </div>

              {/* 交易与经济收益 */}
              <div className="border border-[#18284c] rounded-xl p-5 bg-[#0a132e]/90 space-y-3">
                <div className="flex items-center gap-2 pb-2.5 border-b border-[#18284c]/80">
                  <span className="w-1 h-3.5 bg-[#00c88c] rounded-full inline-block" />
                  <span className="font-bold text-sm text-slate-100">交易核算与社会增收</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#101a36] rounded-lg border border-[#1d2d57]">
                    <div className="text-slate-400 text-[11px] mb-1">租借期限</div>
                    <div className="text-white font-mono font-bold text-sm">{selectedLeaseDetail.leaseTermYears} 年</div>
                  </div>
                  <div className="p-3 bg-[#101a36] rounded-lg border border-[#1d2d57]">
                    <div className="text-slate-400 text-[11px] mb-1">租借单价</div>
                    <div className="text-emerald-400 font-mono font-bold text-sm">￥{selectedLeaseDetail.leasePrice} 元/亩</div>
                  </div>
                  <div className="p-3 bg-[#101a36] rounded-lg border border-[#1d2d57]">
                    <div className="text-slate-400 text-[11px] mb-1">交易生效日期</div>
                    <div className="text-slate-200 font-mono text-xs">{selectedLeaseDetail.dealDate}</div>
                  </div>
                  <div className="p-3 bg-[#101a36] rounded-lg border border-[#1d2d57]">
                    <div className="text-slate-400 text-[11px] mb-1">累计社会增收总额</div>
                    <div className="text-amber-400 font-mono font-bold text-sm">￥{selectedLeaseDetail.socialIncome.toLocaleString()} 元</div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 leading-relaxed border-t border-[#18284c]/60">
                  <span className="text-slate-300 font-medium">土地情况 / 效益评价：</span>
                  {selectedLeaseDetail.remarks || '生态修复结合林业碳汇经营，盘活闲置资产并为周边村民提供管护就业岗位。'}
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLeaseDetail(null)}
                  className="px-12 py-2 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded text-xs transition-all cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 查看盘活利用项目详情 (Revitalize Project Modal - Dark Emerald Unified Theme) */}
      {selectedRevitalizeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-950 text-slate-100 rounded-2xl shadow-2xl max-w-lg w-full border border-emerald-900 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-emerald-900/80 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm text-white">盘活利用合作项目详情</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRevitalizeProject(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-mono">项目编号: {selectedRevitalizeProject.projectCode}</span>
                <h3 className="text-base font-bold text-white mt-1">{selectedRevitalizeProject.landName}</h3>
              </div>

              <div className="space-y-2 bg-slate-900/80 p-4 rounded-xl border border-emerald-950">
                <div className="flex justify-between">
                  <span className="text-slate-400">所属区域:</span>
                  <span className="font-medium text-white">{selectedRevitalizeProject.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">投资/开发主体:</span>
                  <span className="font-medium text-white">{selectedRevitalizeProject.contractor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">造林树种:</span>
                  <span className="font-medium text-emerald-300">{selectedRevitalizeProject.afforestationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">预计年固碳量:</span>
                  <span className="font-bold font-mono text-emerald-400">{selectedRevitalizeProject.expectedCarbonSink} 吨CO₂e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">村集体年分红:</span>
                  <span className="font-bold font-mono text-teal-300">￥{selectedRevitalizeProject.collectiveIncome} 万元/年</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">当前阶段:</span>
                  <span className="font-medium text-emerald-400">{selectedRevitalizeProject.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">签约协议日期:</span>
                  <span className="font-mono text-slate-300">{selectedRevitalizeProject.signDate}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-emerald-900/80 bg-slate-900/90 flex items-center justify-end text-xs">
              <button
                type="button"
                onClick={() => setSelectedRevitalizeProject(null)}
                className="px-6 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg cursor-pointer shadow-md transition-all"
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

