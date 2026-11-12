/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  FileSpreadsheet,
  Building2,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Sliders,
  BarChart3,
  Activity,
  Calculator,
  Filter,
  Eye,
  FileText,
  Calendar,
  Upload,
  TrendingUp,
} from 'lucide-react';

interface EnterpriseRecord {
  id: string;
  district: string;
  enterpriseName: string;
  address: string;
  identity: '受让' | '出让' | '受让方' | '出让方' | string;
  tradableVolume: number; // 吨
  unitPrice: number; // 元/吨
  contact: string;
  onboardingTime: string;
  licenseName?: string;
  remark?: string;
}

interface SupplyRecord {
  id: string;
  year: string;
  district: string;
  enterpriseName: string;
  supplyVolume: number;
  unitPrice: number;
  tradedVolume: number;
  onboardingTime: string;
}

interface DemandRecord {
  id: string;
  year: string;
  district: string;
  enterpriseName: string;
  demandVolume: number;
  unitPrice: number;
  tradedVolume: number;
  onboardingTime: string;
}

interface TradingRecord {
  id: string;
  year: string;
  supplyDistrict: string;
  supplyEnterpriseName: string;
  demandDistrict: string;
  demandEnterpriseName: string;
  tradingVolume: number;
  unitPrice: number;
  tradingTime: string;
}

const INITIAL_ENTERPRISES: EnterpriseRecord[] = [
  { id: 'ent-1', district: '合肥市 肥西县', enterpriseName: '安徽合肥绿碳生态科技有限责任公司', address: '合肥市肥西县上派镇派河大道168号', identity: '受让', tradableVolume: 1000, unitPrice: 52, contact: '157****3283 张伟', onboardingTime: '2026-10-15 14:32:10' },
  { id: 'ent-2', district: '合肥市 肥西县', enterpriseName: '安徽省林业碳票运营管理有限公司', address: '合肥市肥西县经开区繁华大道288号', identity: '出让', tradableVolume: 8000, unitPrice: 50, contact: '138****2984 李娜', onboardingTime: '2026-10-14 11:20:05' },
  { id: 'ent-3', district: '合肥市 庐阳区', enterpriseName: '合肥庐阳区林业生态发展投资有限公司', address: '合肥市庐阳区长江中路369号', identity: '受让', tradableVolume: 1500, unitPrice: 53, contact: '139****5678 王强', onboardingTime: '2026-10-13 09:15:40' },
  { id: 'ent-4', district: '合肥市 庐阳区', enterpriseName: '安徽森碳汇源生物科技有限公司', address: '合肥市庐阳区杏花村街道天水路58号', identity: '受让', tradableVolume: 5000, unitPrice: 49, contact: '189****8765 赵敏', onboardingTime: '2026-10-12 16:45:20' },
  { id: 'ent-5', district: '合肥市 肥东县', enterpriseName: '合肥肥东生态林业开发有限公司', address: '合肥市肥东县店埠镇撮镇路12号', identity: '受让', tradableVolume: 1200, unitPrice: 51, contact: '153****3488 孙涛', onboardingTime: '2026-10-11 10:22:15' },
  { id: 'ent-6', district: '合肥市 肥东县', enterpriseName: '安徽皖中绿色碳汇资产管理中心', address: '合肥市肥东县龙泉路99号', identity: '出让', tradableVolume: 2500, unitPrice: 48, contact: '177****1122 周杰', onboardingTime: '2026-10-10 14:10:00' },
  { id: 'ent-7', district: '合肥市 高新区', enterpriseName: '合肥高新低碳技术研究院有限公司', address: '合肥市高新区创新大道118号', identity: '出让', tradableVolume: 1000, unitPrice: 55, contact: '181****6778 吴芳', onboardingTime: '2026-10-09 09:30:45' },
  { id: 'ent-8', district: '合肥市 高新区', enterpriseName: '安徽皖投碳中和数字科技有限责任公司', address: '合肥市高新区望江西路800号', identity: '出让', tradableVolume: 3500, unitPrice: 52, contact: '133****2233 郑国强', onboardingTime: '2026-10-08 15:50:30' },
  { id: 'ent-9', district: '合肥市 蜀山区', enterpriseName: '合肥蜀山绿林碳汇开发有限公司', address: '合肥市蜀山区黄山路456号', identity: '受让', tradableVolume: 2000, unitPrice: 50, contact: '150****9988 陈志远', onboardingTime: '2026-10-07 10:05:12' },
  { id: 'ent-10', district: '合肥市 滨湖新区', enterpriseName: '安徽滨湖生态湿地碳汇投资有限公司', address: '合肥市滨湖新区徽州大道5555号', identity: '出让', tradableVolume: 6000, unitPrice: 51, contact: '136****1122 刘洋', onboardingTime: '2026-10-06 08:50:00' },
];

const INITIAL_SUPPLIES: SupplyRecord[] = [
  { id: 'sup-1', year: '2026', district: '合肥市 肥西县', enterpriseName: '安徽合肥绿碳生态科技有限责任公司', supplyVolume: 1000, unitPrice: 52, tradedVolume: 0, onboardingTime: '2026-10-15 14:32:10' },
  { id: 'sup-2', year: '2026', district: '合肥市 肥西县', enterpriseName: '安徽省林业碳票运营管理有限公司', supplyVolume: 8000, unitPrice: 50, tradedVolume: 2000, onboardingTime: '2026-10-14 11:20:05' },
  { id: 'sup-3', year: '2025', district: '合肥市 庐阳区', enterpriseName: '合肥庐阳区林业生态发展投资有限公司', supplyVolume: 1500, unitPrice: 53, tradedVolume: 500, onboardingTime: '2025-10-13 09:15:40' },
  { id: 'sup-4', year: '2025', district: '合肥市 庐阳区', enterpriseName: '安徽森碳汇源生物科技有限公司', supplyVolume: 5000, unitPrice: 49, tradedVolume: 1000, onboardingTime: '2025-09-12 16:45:20' },
  { id: 'sup-5', year: '2024', district: '合肥市 肥东县', enterpriseName: '合肥肥东生态林业开发有限公司', supplyVolume: 1200, unitPrice: 51, tradedVolume: 1200, onboardingTime: '2024-10-11 10:22:15' },
  { id: 'sup-6', year: '2024', district: '合肥市 肥东县', enterpriseName: '安徽皖中绿色碳汇资产管理中心', supplyVolume: 2500, unitPrice: 48, tradedVolume: 2000, onboardingTime: '2024-08-10 14:10:00' },
  { id: 'sup-7', year: '2023', district: '合肥市 高新区', enterpriseName: '合肥高新低碳技术研究院有限公司', supplyVolume: 1000, unitPrice: 55, tradedVolume: 1000, onboardingTime: '2023-11-09 09:30:45' },
  { id: 'sup-8', year: '2023', district: '合肥市 高新区', enterpriseName: '安徽碳中和数字科技有限责任公司', supplyVolume: 3500, unitPrice: 52, tradedVolume: 1000, onboardingTime: '2023-10-08 15:50:30' },
  { id: 'sup-9', year: '2023', district: '合肥市 蜀山区', enterpriseName: '合肥蜀山绿林碳汇开发有限公司', supplyVolume: 2000, unitPrice: 50, tradedVolume: 500, onboardingTime: '2023-07-07 10:05:12' },
  { id: 'sup-10', year: '2023', district: '合肥市 滨湖新区', enterpriseName: '安徽滨湖生态湿地碳汇投资有限公司', supplyVolume: 6000, unitPrice: 51, tradedVolume: 3000, onboardingTime: '2023-05-06 08:50:00' },
];

const INITIAL_DEMANDS: DemandRecord[] = [
  { id: 'dem-1', year: '2026', district: '合肥市 肥西县', enterpriseName: '安徽合肥绿碳生态科技有限责任公司', demandVolume: 1000, unitPrice: 52, tradedVolume: 0, onboardingTime: '2026-10-15 14:32:10' },
  { id: 'dem-2', year: '2026', district: '合肥市 肥西县', enterpriseName: '安徽省林业碳票运营管理有限公司', demandVolume: 8000, unitPrice: 50, tradedVolume: 2000, onboardingTime: '2026-10-14 11:20:05' },
  { id: 'dem-3', year: '2025', district: '合肥市 庐阳区', enterpriseName: '合肥庐阳区林业生态发展投资有限公司', demandVolume: 1500, unitPrice: 53, tradedVolume: 500, onboardingTime: '2025-10-13 09:15:40' },
  { id: 'dem-4', year: '2025', district: '合肥市 庐阳区', enterpriseName: '安徽森碳汇源生物科技有限公司', demandVolume: 5000, unitPrice: 49, tradedVolume: 1000, onboardingTime: '2025-09-12 16:45:20' },
  { id: 'dem-5', year: '2024', district: '合肥市 肥东县', enterpriseName: '安徽肥东生态林业开发有限公司', demandVolume: 1200, unitPrice: 51, tradedVolume: 1200, onboardingTime: '2024-10-11 10:22:15' },
  { id: 'dem-6', year: '2024', district: '合肥市 肥东县', enterpriseName: '安徽皖中绿色碳汇资产管理中心', demandVolume: 2500, unitPrice: 48, tradedVolume: 2000, onboardingTime: '2024-08-10 14:10:00' },
  { id: 'dem-7', year: '2023', district: '合肥市 高新区', enterpriseName: '合肥高新低碳技术研究院有限公司', demandVolume: 1000, unitPrice: 55, tradedVolume: 1000, onboardingTime: '2023-11-09 09:30:45' },
  { id: 'dem-8', year: '2023', district: '合肥市 高新区', enterpriseName: '安徽碳中和数字科技有限责任公司', demandVolume: 3500, unitPrice: 52, tradedVolume: 1000, onboardingTime: '2023-10-08 15:50:30' },
  { id: 'dem-9', year: '2023', district: '合肥市 蜀山区', enterpriseName: '合肥蜀山绿林碳汇开发有限公司', demandVolume: 2000, unitPrice: 50, tradedVolume: 500, onboardingTime: '2023-07-07 10:05:12' },
  { id: 'dem-10', year: '2023', district: '合肥市 滨湖新区', enterpriseName: '安徽滨湖生态湿地碳汇投资有限公司', demandVolume: 6000, unitPrice: 51, tradedVolume: 3000, onboardingTime: '2023-05-06 08:50:00' },
];

const INITIAL_TRADING_RECORDS: TradingRecord[] = [
  { id: 'tr-1', year: '2026', supplyDistrict: '合肥市 肥西县', supplyEnterpriseName: '安徽合肥绿碳生态科技有限责任公司', demandDistrict: '合肥市 肥东县', demandEnterpriseName: '安徽省林业碳票运营管理有限公司', tradingVolume: 1500, unitPrice: 52, tradingTime: '2026-10-18 16:45:20' },
  { id: 'tr-2', year: '2026', supplyDistrict: '合肥市 庐阳区', supplyEnterpriseName: '合肥庐阳区林业生态发展投资有限公司', demandDistrict: '合肥市 高新区', demandEnterpriseName: '安徽高新低碳技术研究院有限公司', tradingVolume: 2200, unitPrice: 54, tradingTime: '2026-10-17 14:30:10' },
  { id: 'tr-3', year: '2026', supplyDistrict: '合肥市 肥东县', supplyEnterpriseName: '安徽肥东生态林业开发有限公司', demandDistrict: '合肥市 蜀山区', demandEnterpriseName: '安徽蜀山绿林碳汇开发有限公司', tradingVolume: 3000, unitPrice: 51, tradingTime: '2026-10-16 11:20:05' },
  { id: 'tr-4', year: '2026', supplyDistrict: '合肥市 高新区', supplyEnterpriseName: '安徽皖投碳中和数字科技有限责任公司', demandDistrict: '合肥市 滨湖新区', demandEnterpriseName: '安徽滨湖生态湿地碳汇投资有限公司', tradingVolume: 5000, unitPrice: 53, tradingTime: '2026-10-15 09:15:40' },
  { id: 'tr-5', year: '2026', supplyDistrict: '合肥市 蜀山区', supplyEnterpriseName: '安徽蜀山绿林碳汇开发有限公司', demandDistrict: '合肥市 肥西县', demandEnterpriseName: '安徽合肥绿碳生态科技有限责任公司', tradingVolume: 1200, unitPrice: 49, tradingTime: '2026-10-14 15:10:00' },
  { id: 'tr-6', year: '2026', supplyDistrict: '合肥市 滨湖新区', supplyEnterpriseName: '安徽滨湖生态湿地碳汇投资有限公司', demandDistrict: '合肥市 庐阳区', demandEnterpriseName: '安徽森碳汇源生物科技有限公司', tradingVolume: 4000, unitPrice: 55, tradingTime: '2026-10-12 10:22:15' },
  { id: 'tr-7', year: '2026', supplyDistrict: '合肥市 肥西县', supplyEnterpriseName: '安徽省林业碳票运营管理有限公司', demandDistrict: '合肥市 肥东县', demandEnterpriseName: '安徽皖中绿色碳汇资产管理中心', tradingVolume: 2500, unitPrice: 50, tradingTime: '2026-10-10 14:10:00' },
  { id: 'tr-8', year: '2026', supplyDistrict: '合肥市 庐阳区', supplyEnterpriseName: '安徽森碳汇源生物科技有限公司', demandDistrict: '合肥市 高新区', demandEnterpriseName: '安徽高新低碳技术研究院有限公司', tradingVolume: 1800, unitPrice: 48, tradingTime: '2026-10-08 09:30:45' },
  { id: 'tr-9', year: '2026', supplyDistrict: '合肥市 肥东县', supplyEnterpriseName: '安徽皖中绿色碳汇资产管理中心', demandDistrict: '合肥市 蜀山区', demandEnterpriseName: '安徽合肥绿碳生态科技有限责任公司', tradingVolume: 3200, unitPrice: 52, tradingTime: '2026-10-05 15:50:30' },
  { id: 'tr-10', year: '2026', supplyDistrict: '合肥市 高新区', supplyEnterpriseName: '安徽高新低碳技术研究院有限公司', demandDistrict: '合肥市 滨湖新区', demandEnterpriseName: '安徽省林业碳票运营管理有限公司', tradingVolume: 6000, unitPrice: 56, tradingTime: '2026-10-01 08:50:00' },
];

interface TradingSystemViewProps {
  username?: string;
  onBackToPortal: () => void;
}

export const TradingSystemView: React.FC<TradingSystemViewProps> = ({
  username = 'admin',
  onBackToPortal,
}) => {
  const [activeTab, setActiveTab] = useState<'records' | 'enterprise' | 'supply' | 'demand'>('records');

  // Enterprise Records & filter
  const [records, setRecords] = useState<EnterpriseRecord[]>(INITIAL_ENTERPRISES);
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterIdentity, setFilterIdentity] = useState<string>('all');
  const [filterName, setFilterName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Supply Records & filter
  const [supplyRecords, setSupplyRecords] = useState<SupplyRecord[]>(INITIAL_SUPPLIES);
  const [filterSupplyDistrict, setFilterSupplyDistrict] = useState<string>('all');
  const [filterSupplyYear, setFilterSupplyYear] = useState<string>('all');
  const [filterSupplyName, setFilterSupplyName] = useState<string>('');
  const [supplyPage, setSupplyPage] = useState<number>(1);
  const [supplyPageSize, setSupplyPageSize] = useState<number>(10);

  // Demand Records & filter
  const [demandRecords, setDemandRecords] = useState<DemandRecord[]>(INITIAL_DEMANDS);
  const [filterDemandDistrict, setFilterDemandDistrict] = useState<string>('all');
  const [filterDemandYear, setFilterDemandYear] = useState<string>('all');
  const [filterDemandName, setFilterDemandName] = useState<string>('');
  const [demandPage, setDemandPage] = useState<number>(1);
  const [demandPageSize, setDemandPageSize] = useState<number>(10);

  // Trading Records & filter (交易记录)
  const [tradingRecords, setTradingRecords] = useState<TradingRecord[]>(() => {
    return [...INITIAL_TRADING_RECORDS].sort(
      (a, b) => new Date(b.tradingTime).getTime() - new Date(a.tradingTime).getTime()
    );
  });
  const [filterTradeSupplyDistrict, setFilterTradeSupplyDistrict] = useState<string>('all');
  const [filterTradeSupplyName, setFilterTradeSupplyName] = useState<string>('');
  const [filterTradeDemandDistrict, setFilterTradeDemandDistrict] = useState<string>('all');
  const [filterTradeDemandName, setFilterTradeDemandName] = useState<string>('');
  const [filterTradeYear, setFilterTradeYear] = useState<string>('all');
  const [filterTradeUnitPrice, setFilterTradeUnitPrice] = useState<string>('');
  const [tradePage, setTradePage] = useState<number>(1);
  const [tradePageSize, setTradePageSize] = useState<number>(10);

  // Modals for Trading Records
  const [isAddTradeModalOpen, setIsAddTradeModalOpen] = useState<boolean>(false);
  const [newTradeRecord, setNewTradeRecord] = useState({
    year: '',
    supplyDistrict: '',
    supplyEnterpriseName: '',
    demandDistrict: '',
    demandEnterpriseName: '',
    tradingVolume: '',
    unitPrice: '',
    tradingTime: '2026-10-18 15:30:00',
  });
  const [tradeUploadFile, setTradeUploadFile] = useState<File | null>(null);
  const tradeFileInputRef = useRef<HTMLInputElement | null>(null);

  const [viewTradeDetail, setViewTradeDetail] = useState<TradingRecord | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Enterprise Modal States & Handlers
  const [isAddEnterpriseModalOpen, setIsAddEnterpriseModalOpen] = useState<boolean>(false);
  const [editingEnterprise, setEditingEnterprise] = useState<EnterpriseRecord | null>(null);
  const licenseFileInputRef = useRef<HTMLInputElement | null>(null);
  const [enterpriseForm, setEnterpriseForm] = useState<Partial<EnterpriseRecord>>({
    district: '',
    enterpriseName: '',
    address: '',
    contact: '',
    identity: '',
    tradableVolume: undefined,
    unitPrice: undefined,
    licenseName: '',
    remark: '',
  });

  const handleOpenAddEnterprise = () => {
    setEditingEnterprise(null);
    setEnterpriseForm({
      district: '',
      enterpriseName: '',
      address: '',
      contact: '',
      identity: '',
      tradableVolume: undefined,
      unitPrice: undefined,
      licenseName: '',
      remark: '',
    });
    setIsAddEnterpriseModalOpen(true);
  };

  const handleOpenEditEnterprise = (item: EnterpriseRecord) => {
    setEditingEnterprise(item);
    setEnterpriseForm({
      district: item.district,
      enterpriseName: item.enterpriseName,
      address: item.address,
      contact: item.contact,
      identity: item.identity,
      tradableVolume: item.tradableVolume,
      unitPrice: item.unitPrice,
      licenseName: item.licenseName || '',
      remark: item.remark || '',
    });
    setIsAddEnterpriseModalOpen(true);
  };

  const handleSaveEnterprise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enterpriseForm.district) {
      triggerToast('请选择所属行政区划');
      return;
    }
    if (!enterpriseForm.enterpriseName?.trim()) {
      triggerToast('请输入企业名称');
      return;
    }
    if (!enterpriseForm.address?.trim()) {
      triggerToast('请输入企业地址');
      return;
    }
    if (!enterpriseForm.contact?.trim()) {
      triggerToast('请输入企业联系方式');
      return;
    }
    if (!enterpriseForm.identity) {
      triggerToast('请选择登记身份');
      return;
    }
    if (editingEnterprise) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingEnterprise.id
            ? {
                ...r,
                district: enterpriseForm.district || r.district,
                enterpriseName: enterpriseForm.enterpriseName!.trim(),
                address: enterpriseForm.address || r.address,
                contact: enterpriseForm.contact || r.contact,
                identity: enterpriseForm.identity || r.identity,
                tradableVolume: Number(enterpriseForm.tradableVolume) || r.tradableVolume,
                unitPrice: Number(enterpriseForm.unitPrice) || r.unitPrice,
                licenseName: enterpriseForm.licenseName || r.licenseName,
                remark: enterpriseForm.remark || r.remark,
              }
            : r
        )
      );
      triggerToast(`已成功更新企业「${enterpriseForm.enterpriseName}」信息！`);
    } else {
      const newEnt: EnterpriseRecord = {
        id: `ent-${Date.now()}`,
        district: enterpriseForm.district || '合肥市 肥西县',
        enterpriseName: enterpriseForm.enterpriseName.trim(),
        address: enterpriseForm.address.trim(),
        contact: enterpriseForm.contact.trim(),
        identity: enterpriseForm.identity || '受让方',
        tradableVolume: Number(enterpriseForm.tradableVolume) || 1000,
        unitPrice: Number(enterpriseForm.unitPrice) || 50,
        onboardingTime: '2026-10-27 10:00:00',
        licenseName: enterpriseForm.licenseName || '',
        remark: enterpriseForm.remark || '',
      };
      setRecords((prev) => [newEnt, ...prev]);
      triggerToast(`新企业「${newEnt.enterpriseName}」入驻成功！排在近期首位。`);
    }
    setIsAddEnterpriseModalOpen(false);
  };

  const handleDeleteEnterprise = (id: string, name: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    triggerToast(`已成功删除企业「${name}」记录！`);
  };

  // Supply Modal States & Handlers
  const [isAddSupplyModalOpen, setIsAddSupplyModalOpen] = useState<boolean>(false);
  const [editingSupply, setEditingSupply] = useState<SupplyRecord | null>(null);
  const [supplyForm, setSupplyForm] = useState<Partial<SupplyRecord>>({
    year: '2026',
    district: '合肥市 肥西县',
    enterpriseName: '',
    supplyVolume: undefined,
    unitPrice: undefined,
    tradedVolume: 0,
  });

  const handleOpenAddSupply = () => {
    setEditingSupply(null);
    setSupplyForm({
      year: '2026',
      district: '合肥市 肥西县',
      enterpriseName: '',
      supplyVolume: undefined,
      unitPrice: undefined,
      tradedVolume: 0,
    });
    setIsAddSupplyModalOpen(true);
  };

  const handleOpenEditSupply = (item: SupplyRecord) => {
    setEditingSupply(item);
    setSupplyForm({
      year: item.year,
      district: item.district,
      enterpriseName: item.enterpriseName,
      supplyVolume: item.supplyVolume,
      unitPrice: item.unitPrice,
      tradedVolume: item.tradedVolume,
    });
    setIsAddSupplyModalOpen(true);
  };

  const handleSaveSupply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplyForm.enterpriseName?.trim()) {
      triggerToast('请输入供应企业名称');
      return;
    }
    if (editingSupply) {
      setSupplyRecords((prev) =>
        prev.map((r) =>
          r.id === editingSupply.id
            ? {
                ...r,
                year: supplyForm.year || r.year,
                district: supplyForm.district || r.district,
                enterpriseName: supplyForm.enterpriseName!.trim(),
                supplyVolume: Number(supplyForm.supplyVolume) || r.supplyVolume,
                unitPrice: Number(supplyForm.unitPrice) || r.unitPrice,
                tradedVolume: Number(supplyForm.tradedVolume) ?? r.tradedVolume,
              }
            : r
        )
      );
      triggerToast(`已成功更新「${supplyForm.enterpriseName}」的供应挂牌信息！`);
    } else {
      const newSup: SupplyRecord = {
        id: `sup-${Date.now()}`,
        year: supplyForm.year || '2026',
        district: supplyForm.district || '合肥市 肥西县',
        enterpriseName: supplyForm.enterpriseName.trim(),
        supplyVolume: Number(supplyForm.supplyVolume) || 2000,
        unitPrice: Number(supplyForm.unitPrice) || 52,
        tradedVolume: Number(supplyForm.tradedVolume) || 0,
        onboardingTime: '2026-10-27 10:15:00',
      };
      setSupplyRecords((prev) => [newSup, ...prev]);
      triggerToast(`新供应挂牌「${newSup.enterpriseName}」新增成功！`);
    }
    setIsAddSupplyModalOpen(false);
  };

  const handleDeleteSupply = (id: string, name: string) => {
    setSupplyRecords((prev) => prev.filter((r) => r.id !== id));
    triggerToast(`已成功删除「${name}」的供应挂牌记录！`);
  };

  // Demand Modal States & Handlers
  const [isAddDemandModalOpen, setIsAddDemandModalOpen] = useState<boolean>(false);
  const [editingDemand, setEditingDemand] = useState<DemandRecord | null>(null);
  const [demandForm, setDemandForm] = useState<Partial<DemandRecord>>({
    year: '2026',
    district: '合肥市 肥西县',
    enterpriseName: '',
    demandVolume: undefined,
    unitPrice: undefined,
    tradedVolume: 0,
  });

  const handleOpenAddDemand = () => {
    setEditingDemand(null);
    setDemandForm({
      year: '2026',
      district: '合肥市 肥西县',
      enterpriseName: '',
      demandVolume: undefined,
      unitPrice: undefined,
      tradedVolume: 0,
    });
    setIsAddDemandModalOpen(true);
  };

  const handleOpenEditDemand = (item: DemandRecord) => {
    setEditingDemand(item);
    setDemandForm({
      year: item.year,
      district: item.district,
      enterpriseName: item.enterpriseName,
      demandVolume: item.demandVolume,
      unitPrice: item.unitPrice,
      tradedVolume: item.tradedVolume,
    });
    setIsAddDemandModalOpen(true);
  };

  const handleSaveDemand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demandForm.enterpriseName?.trim()) {
      triggerToast('请输入需求企业名称');
      return;
    }
    if (editingDemand) {
      setDemandRecords((prev) =>
        prev.map((r) =>
          r.id === editingDemand.id
            ? {
                ...r,
                year: demandForm.year || r.year,
                district: demandForm.district || r.district,
                enterpriseName: demandForm.enterpriseName!.trim(),
                demandVolume: Number(demandForm.demandVolume) || r.demandVolume,
                unitPrice: Number(demandForm.unitPrice) || r.unitPrice,
                tradedVolume: Number(demandForm.tradedVolume) ?? r.tradedVolume,
              }
            : r
        )
      );
      triggerToast(`已成功更新「${demandForm.enterpriseName}」的需求意向！`);
    } else {
      const newDem: DemandRecord = {
        id: `dem-${Date.now()}`,
        year: demandForm.year || '2026',
        district: demandForm.district || '合肥市 肥西县',
        enterpriseName: demandForm.enterpriseName.trim(),
        demandVolume: Number(demandForm.demandVolume) || 1500,
        unitPrice: Number(demandForm.unitPrice) || 50,
        tradedVolume: Number(demandForm.tradedVolume) || 0,
        onboardingTime: '2026-10-27 10:30:00',
      };
      setDemandRecords((prev) => [newDem, ...prev]);
      triggerToast(`新需求意向「${newDem.enterpriseName}」新增成功！`);
    }
    setIsAddDemandModalOpen(false);
  };

  const handleDeleteDemand = (id: string, name: string) => {
    setDemandRecords((prev) => prev.filter((r) => r.id !== id));
    triggerToast(`已成功删除「${name}」的需求意向记录！`);
  };

  // Upload Attachment Modal State & Handlers
  const [uploadModalTarget, setUploadModalTarget] = useState<{
    type: 'enterprise' | 'supply' | 'demand';
    id: string;
    name: string;
  } | null>(null);
  const [attachmentCategory, setAttachmentCategory] = useState<string>('营业执照与主体资质');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const attachmentFileInputRef = useRef<HTMLInputElement | null>(null);
  const [recordAttachments, setRecordAttachments] = useState<Record<string, Array<{ name: string; size: string; date: string }>>>({
    'ent-1': [{ name: '安徽合肥绿碳生态科技_营业执照正本.pdf', size: '2.4MB', date: '2026-10-15' }],
    'sup-1': [{ name: '林业碳汇核证减排量核查报告.pdf', size: '5.8MB', date: '2026-10-15' }],
    'dem-1': [{ name: '2026年度履约清缴抵销意向书.pdf', size: '1.2MB', date: '2026-10-15' }],
  });

  const handleOpenUploadAttachment = (type: 'enterprise' | 'supply' | 'demand', id: string, name: string) => {
    setUploadModalTarget({ type, id, name });
    setAttachmentCategory('营业执照与主体资质');
    setUploadFile(null);
  };

  const handleConfirmUploadAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadModalTarget) return;
    if (!uploadFile) {
      triggerToast('请先选择需要上传的附件文件');
      return;
    }
    const fileSizeStr = `${(uploadFile.size / (1024 * 1024)).toFixed(1)}MB`;
    setRecordAttachments((prev) => ({
      ...prev,
      [uploadModalTarget.id]: [
        ...(prev[uploadModalTarget.id] || []),
        { name: `${attachmentCategory}_${uploadFile.name}`, size: fileSizeStr, date: '2026-10-27' },
      ],
    }));
    triggerToast(`已成功为「${uploadModalTarget.name}」上传附件材料「${uploadFile.name}」！`);
    setUploadModalTarget(null);
  };

  // Filtered Trading Records
  const filteredTradingRecords = useMemo(() => {
    return tradingRecords.filter((r) => {
      if (filterTradeSupplyDistrict !== 'all' && !r.supplyDistrict.includes(filterTradeSupplyDistrict)) return false;
      if (filterTradeSupplyName && !r.supplyEnterpriseName.includes(filterTradeSupplyName)) return false;
      if (filterTradeDemandDistrict !== 'all' && !r.demandDistrict.includes(filterTradeDemandDistrict)) return false;
      if (filterTradeDemandName && !r.demandEnterpriseName.includes(filterTradeDemandName)) return false;
      if (filterTradeYear !== 'all' && r.year !== filterTradeYear) return false;
      if (filterTradeUnitPrice && r.unitPrice !== Number(filterTradeUnitPrice)) return false;
      return true;
    }).sort((a, b) => new Date(b.tradingTime).getTime() - new Date(a.tradingTime).getTime());
  }, [tradingRecords, filterTradeSupplyDistrict, filterTradeSupplyName, filterTradeDemandDistrict, filterTradeDemandName, filterTradeYear, filterTradeUnitPrice]);

  const totalTradePages = Math.max(1, Math.ceil(filteredTradingRecords.length / tradePageSize));
  const displayedTradingRecords = useMemo(() => {
    const start = (tradePage - 1) * tradePageSize;
    return filteredTradingRecords.slice(start, start + tradePageSize);
  }, [filteredTradingRecords, tradePage, tradePageSize]);

  // Filtered Enterprise Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filterDistrict !== 'all' && !r.district.includes(filterDistrict)) return false;
      if (filterIdentity !== 'all' && r.identity !== filterIdentity) return false;
      if (filterName && !r.enterpriseName.includes(filterName)) return false;
      return true;
    });
  }, [records, filterDistrict, filterIdentity, filterName]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const displayedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Filtered Supply Records
  const filteredSupplyRecords = useMemo(() => {
    return supplyRecords.filter((r) => {
      if (filterSupplyDistrict !== 'all' && !r.district.includes(filterSupplyDistrict)) return false;
      if (filterSupplyYear !== 'all' && r.year !== filterSupplyYear) return false;
      if (filterSupplyName && !r.enterpriseName.includes(filterSupplyName)) return false;
      return true;
    });
  }, [supplyRecords, filterSupplyDistrict, filterSupplyYear, filterSupplyName]);

  const totalSupplyPages = Math.max(1, Math.ceil(filteredSupplyRecords.length / supplyPageSize));
  const displayedSupplyRecords = useMemo(() => {
    const start = (supplyPage - 1) * supplyPageSize;
    return filteredSupplyRecords.slice(start, start + supplyPageSize);
  }, [filteredSupplyRecords, supplyPage, supplyPageSize]);

  // Filtered Demand Records
  const filteredDemandRecords = useMemo(() => {
    return demandRecords.filter((r) => {
      if (filterDemandDistrict !== 'all' && !r.district.includes(filterDemandDistrict)) return false;
      if (filterDemandYear !== 'all' && r.year !== filterDemandYear) return false;
      if (filterDemandName && !r.enterpriseName.includes(filterDemandName)) return false;
      return true;
    });
  }, [demandRecords, filterDemandDistrict, filterDemandYear, filterDemandName]);

  const totalDemandPages = Math.max(1, Math.ceil(filteredDemandRecords.length / demandPageSize));
  const displayedDemandRecords = useMemo(() => {
    const start = (demandPage - 1) * demandPageSize;
    return filteredDemandRecords.slice(start, start + demandPageSize);
  }, [filteredDemandRecords, demandPage, demandPageSize]);

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

      {/* Top Main Navigation Bar (统一样式风格) */}
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
                碳汇产品交易系统
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/90 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>CCER 全流程交易</span>
              </span>
            </div>
            <div className="text-[9px] font-mono text-emerald-500/80 tracking-widest uppercase">
              CARBON PRODUCT TRADING & ASSET MANAGEMENT SYSTEM
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

      {/* Sub-Navigation Tabs Bar (统一风格与项目开发管理一致) */}
      <div className="relative z-20 bg-[#051a11]/90 border-b border-emerald-900/60 px-6 lg:px-8 py-2.5 backdrop-blur-md flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('records');
              triggerToast('已切换至交易记录大厅');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'records'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>交易记录</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('enterprise');
              triggerToast('已切换至企业入驻管理');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'enterprise'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>企业入驻</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('supply');
              triggerToast('已切换至供应信息管理');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'supply'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>供应信息</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('demand');
              triggerToast('已切换至需求信息管理');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'demand'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>需求信息</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 p-4 lg:p-6 max-w-[1720px] mx-auto w-full space-y-5">
        {/* TAB 1: 交易记录 */}
        {activeTab === 'records' && (
          <>
            {/* CARD 1: 筛选搜索 */}
            <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white tracking-wide">交易检索与精准筛选</span>
                  <span className="text-xs text-slate-500">|</span>
                  <span className="text-xs text-emerald-400/90 font-mono">
                    时间默认降序排列（近期在前）
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => triggerToast('已按筛选条件检索交易记录')}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>搜索</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterTradeSupplyDistrict('all');
                      setFilterTradeSupplyName('');
                      setFilterTradeDemandDistrict('all');
                      setFilterTradeDemandName('');
                      setFilterTradeYear('all');
                      setFilterTradeUnitPrice('');
                      setTradePage(1);
                      triggerToast('已重置交易记录筛选条件');
                    }}
                    className="px-3.5 py-1.5 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewTradeRecord({
                        year: '2026',
                        supplyDistrict: '合肥市 肥西县',
                        supplyEnterpriseName: '',
                        demandDistrict: '合肥市 肥东县',
                        demandEnterpriseName: '',
                        tradingVolume: '',
                        unitPrice: '',
                        tradingTime: '2026-10-18 15:30:00',
                      });
                      setTradeUploadFile(null);
                      setIsAddTradeModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增交易</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
                {/* 供应方: 所属行政区划 */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">供应方: 所属行政区划</label>
                  <select
                    value={filterTradeSupplyDistrict}
                    onChange={(e) => {
                      setFilterTradeSupplyDistrict(e.target.value);
                      setTradePage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">请选择</option>
                    <option value="肥西县">合肥市 肥西县</option>
                    <option value="庐阳区">合肥市 庐阳区</option>
                    <option value="肥东县">合肥市 肥东县</option>
                    <option value="高新区">合肥市 高新区</option>
                    <option value="蜀山区">合肥市 蜀山区</option>
                    <option value="滨湖新区">合肥市 滨湖新区</option>
                  </select>
                </div>

                {/* 供应方: 企业名称 */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">供应方: 企业名称</label>
                  <input
                    type="text"
                    placeholder="请输入企业名称"
                    value={filterTradeSupplyName}
                    onChange={(e) => {
                      setFilterTradeSupplyName(e.target.value);
                      setTradePage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>

                {/* 需求方: 所属行政区划 */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">需求方: 所属行政区划</label>
                  <select
                    value={filterTradeDemandDistrict}
                    onChange={(e) => {
                      setFilterTradeDemandDistrict(e.target.value);
                      setTradePage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">请选择</option>
                    <option value="肥西县">合肥市 肥西县</option>
                    <option value="庐阳区">合肥市 庐阳区</option>
                    <option value="肥东县">合肥市 肥东县</option>
                    <option value="高新区">合肥市 高新区</option>
                    <option value="蜀山区">合肥市 蜀山区</option>
                    <option value="滨湖新区">合肥市 滨湖新区</option>
                  </select>
                </div>

                {/* 需求方: 企业名称 */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">需求方: 企业名称</label>
                  <input
                    type="text"
                    placeholder="请输入企业名称"
                    value={filterTradeDemandName}
                    onChange={(e) => {
                      setFilterTradeDemandName(e.target.value);
                      setTradePage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>

                {/* 年份 */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">年份</label>
                  <select
                    value={filterTradeYear}
                    onChange={(e) => {
                      setFilterTradeYear(e.target.value);
                      setTradePage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">请选择</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>

                {/* 交易单价 */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">交易单价</label>
                  <input
                    type="number"
                    placeholder="请输入单价"
                    value={filterTradeUnitPrice}
                    onChange={(e) => {
                      setFilterTradeUnitPrice(e.target.value);
                      setTradePage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: 数据列表 */}
            <div className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
              <div className="px-5 py-3.5 border-b border-emerald-900/60 flex items-center justify-between bg-slate-900/60">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-bold text-white tracking-wide">交易记录数据清单</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  共检索到 <strong className="text-emerald-400 font-bold">{filteredTradingRecords.length}</strong> 条交易记录 (近期降序)
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-900/60 bg-slate-900/80 text-slate-400 font-medium">
                      <th className="py-3.5 px-4 w-14 text-center">序号</th>
                      <th className="py-3.5 px-4 w-20 text-center">年份</th>
                      <th className="py-3.5 px-4 min-w-[140px]">供应方所属行政区划</th>
                      <th className="py-3.5 px-4 min-w-[180px]">供应方企业名称</th>
                      <th className="py-3.5 px-4 min-w-[140px]">需求方所属行政区划</th>
                      <th className="py-3.5 px-4 min-w-[180px]">需求方企业名称</th>
                      <th className="py-3.5 px-4 text-right min-w-[100px]">交易量(吨)</th>
                      <th className="py-3.5 px-4 text-right min-w-[110px]">交易单价(元/吨)</th>
                      <th className="py-3.5 px-4 min-w-[150px]">交易时间</th>
                      <th className="py-3.5 px-4 text-center min-w-[100px]">操作</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-emerald-950/60">
                    {displayedTradingRecords.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-slate-500">
                          暂无符合条件的交易记录
                        </td>
                      </tr>
                    ) : (
                      displayedTradingRecords.map((item, idx) => {
                        const serialNo = (tradePage - 1) * tradePageSize + idx + 1;
                        return (
                          <tr key={item.id} className="hover:bg-emerald-950/40 transition-colors text-slate-200">
                            <td className="py-3.5 px-4 text-center font-mono text-slate-500">{serialNo}</td>
                            <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-300">{item.year}</td>
                            <td className="py-3.5 px-4 text-slate-300">{item.supplyDistrict}</td>
                            <td className="py-3.5 px-4 text-emerald-400 font-mono font-medium">{item.supplyEnterpriseName}</td>
                            <td className="py-3.5 px-4 text-slate-300">{item.demandDistrict}</td>
                            <td className="py-3.5 px-4 text-teal-400 font-mono font-medium">{item.demandEnterpriseName}</td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                              {item.tradingVolume.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                              ￥{item.unitPrice}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{item.tradingTime}</td>
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setViewTradeDetail(item)}
                                className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium cursor-pointer"
                              >
                                查看
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Pagination */}
              <div className="px-6 py-4 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span>共 <strong className="text-emerald-400 font-mono font-bold">{filteredTradingRecords.length}</strong> 条数据</span>
                  <span className="text-slate-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <span>每页</span>
                    <select
                      value={tradePageSize}
                      onChange={(e) => {
                        setTradePageSize(Number(e.target.value));
                        setTradePage(1);
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
                    disabled={tradePage <= 1}
                    onClick={() => setTradePage((prev) => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: Math.min(5, totalTradePages) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTradePage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        tradePage === p
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  {totalTradePages > 5 && (
                    <>
                      <span className="px-1 text-slate-600">...</span>
                      <button
                        type="button"
                        onClick={() => setTradePage(totalTradePages)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          tradePage === totalTradePages
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {totalTradePages}
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    disabled={tradePage >= totalTradePages}
                    onClick={() => setTradePage((prev) => Math.min(totalTradePages, prev + 1))}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                  >
                    &gt;
                  </button>
                  <div className="flex items-center gap-1.5 ml-3">
                    <span>跳转</span>
                    <input
                      type="number"
                      min={1}
                      max={totalTradePages}
                      placeholder=""
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = Number((e.target as HTMLInputElement).value);
                          if (val >= 1 && val <= totalTradePages) {
                            setTradePage(val);
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

        {/* TAB 2: 企业入驻 */}
        {activeTab === 'enterprise' && (
          <>
            <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white tracking-wide">企业检索与精准筛选</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => triggerToast('已按条件检索入驻企业')}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>搜索</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterDistrict('all');
                      setFilterIdentity('all');
                      setFilterName('');
                      setCurrentPage(1);
                      triggerToast('已重置企业筛选条件');
                    }}
                    className="px-3.5 py-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg text-slate-300 text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddEnterprise}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增企业</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">所属行政区划</label>
                  <select
                    value={filterDistrict}
                    onChange={(e) => {
                      setFilterDistrict(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
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
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">主体身份</label>
                  <select
                    value={filterIdentity}
                    onChange={(e) => {
                      setFilterIdentity(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">请选择</option>
                    <option value="出让">出让方</option>
                    <option value="受让">受让方</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium font-mono">企业名称</label>
                  <input
                    type="text"
                    placeholder="请输入企业关键字"
                    value={filterName}
                    onChange={(e) => {
                      setFilterName(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
              <div className="px-5 py-3.5 border-b border-emerald-900/60 flex items-center justify-between bg-slate-900/60">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-bold text-white tracking-wide">入驻企业名录清单</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  共检索到 <strong className="text-emerald-400 font-bold">{filteredRecords.length}</strong> 家企业
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-900/60 bg-slate-900/80 text-slate-400 font-medium">
                      <th className="py-3.5 px-4 w-14 text-center">序号</th>
                      <th className="py-3.5 px-4 min-w-[140px]">所属行政区划</th>
                      <th className="py-3.5 px-4 min-w-[200px]">企业名称</th>
                      <th className="py-3.5 px-4 min-w-[220px]">企业注册地址</th>
                      <th className="py-3.5 px-4 text-center w-24">主体身份</th>
                      <th className="py-3.5 px-4 text-right min-w-[110px]">可交易量(吨)</th>
                      <th className="py-3.5 px-4 text-right min-w-[110px]">参考单价(元)</th>
                      <th className="py-3.5 px-4 min-w-[150px]">联系人/电话</th>
                      <th className="py-3.5 px-4 min-w-[150px]">入驻时间</th>
                      <th className="py-3.5 px-4 text-center min-w-[170px]">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/60">
                    {displayedRecords.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-slate-500">暂无入驻企业数据</td>
                      </tr>
                    ) : (
                      displayedRecords.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-emerald-950/40 transition-colors text-slate-200">
                          <td className="py-3.5 px-4 text-center font-mono text-slate-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                          <td className="py-3.5 px-4 text-slate-300">{item.district}</td>
                          <td className="py-3.5 px-4 text-emerald-400 font-medium">{item.enterpriseName}</td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">{item.address}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${item.identity === '出让' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-teal-950 text-teal-300 border border-teal-800'}`}>
                              {item.identity}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">{item.tradableVolume.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">￥{item.unitPrice}</td>
                          <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">{item.contact}</td>
                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{item.onboardingTime}</td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-3 text-xs">
                              <button
                                type="button"
                                onClick={() => handleOpenUploadAttachment('enterprise', item.id, item.enterpriseName)}
                                className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium cursor-pointer"
                              >
                                上传附件
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditEnterprise(item)}
                                className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium cursor-pointer"
                              >
                                编辑
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEnterprise(item.id, item.enterpriseName)}
                                className="text-emerald-400 hover:text-rose-400 hover:underline font-medium cursor-pointer"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Pagination for Enterprise */}
              <div className="px-6 py-4 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span>共 <strong className="text-emerald-400 font-mono font-bold">{filteredRecords.length}</strong> 条数据</span>
                  <span className="text-slate-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <span>每页</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
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
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
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
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 3: 供应信息 */}
        {activeTab === 'supply' && (
          <>
            <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white tracking-wide">供应信息检索</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => triggerToast('已按条件检索供应数据')}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg text-xs shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>搜索</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterSupplyDistrict('all');
                      setFilterSupplyYear('all');
                      setFilterSupplyName('');
                      setSupplyPage(1);
                      triggerToast('已重置供应筛选条件');
                    }}
                    className="px-3.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddSupply}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增供应</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">所属行政区划</label>
                  <select
                    value={filterSupplyDistrict}
                    onChange={(e) => {
                      setFilterSupplyDistrict(e.target.value);
                      setSupplyPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">请选择</option>
                    <option value="肥西县">合肥市 肥西县</option>
                    <option value="庐阳区">合肥市 庐阳区</option>
                    <option value="肥东县">合肥市 肥东县</option>
                    <option value="高新区">合肥市 高新区</option>
                    <option value="包河区">合肥市 包河区</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">年份</label>
                  <select
                    value={filterSupplyYear}
                    onChange={(e) => {
                      setFilterSupplyYear(e.target.value);
                      setSupplyPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">请选择</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">供应企业名称</label>
                  <input
                    type="text"
                    placeholder="请输入企业名称"
                    value={filterSupplyName}
                    onChange={(e) => {
                      setFilterSupplyName(e.target.value);
                      setSupplyPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
              <div className="px-5 py-3.5 border-b border-emerald-900/60 flex items-center justify-between bg-slate-900/60">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-bold text-white tracking-wide">碳汇供应挂牌列表</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  共检索到 <strong className="text-emerald-400 font-bold">{filteredSupplyRecords.length}</strong> 条供应挂牌
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-900/60 bg-slate-900/80 text-slate-400 font-medium">
                      <th className="py-3.5 px-4 w-14 text-center">序号</th>
                      <th className="py-3.5 px-4 w-20 text-center">年份</th>
                      <th className="py-3.5 px-4 min-w-[140px]">所属行政区划</th>
                      <th className="py-3.5 px-4 min-w-[200px]">企业名称</th>
                      <th className="py-3.5 px-4 text-right min-w-[110px]">挂牌供应量(吨)</th>
                      <th className="py-3.5 px-4 text-right min-w-[110px]">供应单价(元/吨)</th>
                      <th className="py-3.5 px-4 text-right min-w-[110px]">已交易量(吨)</th>
                      <th className="py-3.5 px-4 min-w-[150px]">挂牌时间</th>
                      <th className="py-3.5 px-4 text-center min-w-[170px]">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/60">
                    {displayedSupplyRecords.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-500">暂无供应挂牌数据</td>
                      </tr>
                    ) : (
                      displayedSupplyRecords.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-emerald-950/40 transition-colors text-slate-200">
                          <td className="py-3.5 px-4 text-center font-mono text-slate-500">{(supplyPage - 1) * supplyPageSize + idx + 1}</td>
                          <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.year}</td>
                          <td className="py-3.5 px-4 text-slate-300">{item.district}</td>
                          <td className="py-3.5 px-4 text-emerald-400 font-medium">{item.enterpriseName}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">{item.supplyVolume.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">￥{item.unitPrice}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-teal-300">{item.tradedVolume.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{item.onboardingTime}</td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-3 text-xs">
                              <button
                                type="button"
                                onClick={() => handleOpenUploadAttachment('supply', item.id, item.enterpriseName)}
                                className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium cursor-pointer"
                              >
                                上传附件
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditSupply(item)}
                                className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium cursor-pointer"
                              >
                                编辑
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSupply(item.id, item.enterpriseName)}
                                className="text-emerald-400 hover:text-rose-400 hover:underline font-medium cursor-pointer"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Pagination for Supply */}
              <div className="px-6 py-4 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span>共 <strong className="text-emerald-400 font-mono font-bold">{filteredSupplyRecords.length}</strong> 条数据</span>
                  <span className="text-slate-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <span>每页</span>
                    <select
                      value={supplyPageSize}
                      onChange={(e) => {
                        setSupplyPageSize(Number(e.target.value));
                        setSupplyPage(1);
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
                    disabled={supplyPage <= 1}
                    onClick={() => setSupplyPage((prev) => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: Math.min(5, totalSupplyPages) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSupplyPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        supplyPage === p
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={supplyPage >= totalSupplyPages}
                    onClick={() => setSupplyPage((prev) => Math.min(totalSupplyPages, prev + 1))}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 4: 需求信息 */}
        {activeTab === 'demand' && (
          <>
            <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white tracking-wide">需求求购检索</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => triggerToast('已按条件检索需求数据')}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg text-xs shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>搜索</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterDemandDistrict('all');
                      setFilterDemandYear('all');
                      setFilterDemandName('');
                      setDemandPage(1);
                      triggerToast('已重置需求筛选条件');
                    }}
                    className="px-3.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddDemand}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增需求</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">所属行政区划</label>
                  <select
                    value={filterDemandDistrict}
                    onChange={(e) => {
                      setFilterDemandDistrict(e.target.value);
                      setDemandPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">请选择</option>
                    <option value="肥西县">合肥市 肥西县</option>
                    <option value="庐阳区">合肥市 庐阳区</option>
                    <option value="肥东县">合肥市 肥东县</option>
                    <option value="高新区">合肥市 高新区</option>
                    <option value="包河区">合肥市 包河区</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">年份</label>
                  <select
                    value={filterDemandYear}
                    onChange={(e) => {
                      setFilterDemandYear(e.target.value);
                      setDemandPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">请选择</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">需求企业名称</label>
                  <input
                    type="text"
                    placeholder="请输入企业名称"
                    value={filterDemandName}
                    onChange={(e) => {
                      setFilterDemandName(e.target.value);
                      setDemandPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/80 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
              <div className="px-5 py-3.5 border-b border-emerald-900/60 flex items-center justify-between bg-slate-900/60">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-bold text-white tracking-wide">碳汇需求求购列表</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  共检索到 <strong className="text-emerald-400 font-bold">{filteredDemandRecords.length}</strong> 条需求意向
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-900/60 bg-slate-900/80 text-slate-400 font-medium">
                      <th className="py-3.5 px-4 w-14 text-center">序号</th>
                      <th className="py-3.5 px-4 w-20 text-center">年份</th>
                      <th className="py-3.5 px-4 min-w-[140px]">所属行政区划</th>
                      <th className="py-3.5 px-4 min-w-[200px]">企业名称</th>
                      <th className="py-3.5 px-4 text-right min-w-[110px]">求购需求量(吨)</th>
                      <th className="py-3.5 px-4 text-right min-w-[110px]">意向单价(元/吨)</th>
                      <th className="py-3.5 px-4 text-right min-w-[110px]">已采购量(吨)</th>
                      <th className="py-3.5 px-4 min-w-[150px]">需求发布时间</th>
                      <th className="py-3.5 px-4 text-center min-w-[170px]">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/60">
                    {displayedDemandRecords.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-500">暂无需求意向数据</td>
                      </tr>
                    ) : (
                      displayedDemandRecords.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-emerald-950/40 transition-colors text-slate-200">
                          <td className="py-3.5 px-4 text-center font-mono text-slate-500">{(demandPage - 1) * demandPageSize + idx + 1}</td>
                          <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.year}</td>
                          <td className="py-3.5 px-4 text-slate-300">{item.district}</td>
                          <td className="py-3.5 px-4 text-teal-400 font-medium">{item.enterpriseName}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">{item.demandVolume.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">￥{item.unitPrice}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-emerald-300">{item.tradedVolume.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{item.onboardingTime}</td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-3 text-xs">
                              <button
                                type="button"
                                onClick={() => handleOpenUploadAttachment('demand', item.id, item.enterpriseName)}
                                className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium cursor-pointer"
                              >
                                上传附件
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditDemand(item)}
                                className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium cursor-pointer"
                              >
                                编辑
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDemand(item.id, item.enterpriseName)}
                                className="text-emerald-400 hover:text-rose-400 hover:underline font-medium cursor-pointer"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Pagination for Demand */}
              <div className="px-6 py-4 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span>共 <strong className="text-emerald-400 font-mono font-bold">{filteredDemandRecords.length}</strong> 条数据</span>
                  <span className="text-slate-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <span>每页</span>
                    <select
                      value={demandPageSize}
                      onChange={(e) => {
                        setDemandPageSize(Number(e.target.value));
                        setDemandPage(1);
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
                    disabled={demandPage <= 1}
                    onClick={() => setDemandPage((prev) => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: Math.min(5, totalDemandPages) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setDemandPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        demandPage === p
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={demandPage >= totalDemandPages}
                    onClick={() => setDemandPage((prev) => Math.min(totalDemandPages, prev + 1))}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* MODAL: 新增交易记录 */}
      {isAddTradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-900 overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-emerald-900/80 flex items-center justify-between bg-slate-900/90">
              <span className="font-bold text-sm text-white">新增交易记录</span>
              <button
                type="button"
                onClick={() => setIsAddTradeModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTradeRecord.year || !newTradeRecord.supplyEnterpriseName || !newTradeRecord.demandEnterpriseName) {
                  triggerToast('请完整填写新增交易记录必填项');
                  return;
                }

                const created: TradingRecord = {
                  id: `tr-${Date.now()}`,
                  year: newTradeRecord.year,
                  supplyDistrict: newTradeRecord.supplyDistrict || '合肥市 肥西县',
                  supplyEnterpriseName: newTradeRecord.supplyEnterpriseName,
                  demandDistrict: newTradeRecord.demandDistrict || '合肥市 肥东县',
                  demandEnterpriseName: newTradeRecord.demandEnterpriseName,
                  tradingVolume: Number(newTradeRecord.tradingVolume) || 1000,
                  unitPrice: Number(newTradeRecord.unitPrice) || 50,
                  tradingTime: newTradeRecord.tradingTime || '2026-10-18 15:30:00',
                };

                setTradingRecords([created, ...tradingRecords]);
                setIsAddTradeModalOpen(false);
                triggerToast('成功新增交易记录，已置于近期首位！');
              }}
              className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans bg-[#06140e]"
            >
              <div className="border border-emerald-500/40 rounded-xl p-4 bg-slate-900/50 space-y-3 relative">
                <div className="absolute -top-2.5 left-4 px-2 bg-slate-950 text-emerald-400 font-semibold text-[11px]">
                  选择年份
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    <span className="text-rose-500 mr-1">*</span>年份
                  </label>
                  <select
                    value={newTradeRecord.year}
                    onChange={(e) => setNewTradeRecord({ ...newTradeRecord, year: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-emerald-950 rounded-lg text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                    required
                  >
                    <option value="">请选择年份</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>

              <div className="border border-emerald-500/40 rounded-xl p-4 bg-slate-900/50 space-y-3 relative">
                <div className="absolute -top-2.5 left-4 px-2 bg-slate-950 text-emerald-400 font-semibold text-[11px]">
                  供应方
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-8 space-y-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        <span className="text-rose-500 mr-1">*</span>所属行政区划
                      </label>
                      <select
                        value={newTradeRecord.supplyDistrict}
                        onChange={(e) => setNewTradeRecord({ ...newTradeRecord, supplyDistrict: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-emerald-950 rounded-lg text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        required
                      >
                        <option value="">请选择</option>
                        <option value="合肥市 肥西县">合肥市 肥西县</option>
                        <option value="合肥市 庐阳区">合肥市 庐阳区</option>
                        <option value="合肥市 肥东县">合肥市 肥东县</option>
                        <option value="合肥市 高新区">合肥市 高新区</option>
                        <option value="合肥市 蜀山区">合肥市 蜀山区</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        <span className="text-rose-500 mr-1">*</span>企业名称
                      </label>
                      <select
                        value={newTradeRecord.supplyEnterpriseName}
                        onChange={(e) => setNewTradeRecord({ ...newTradeRecord, supplyEnterpriseName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-emerald-950 rounded-lg text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        required
                      >
                        <option value="">请选择企业</option>
                        <option value="安徽合肥绿碳生态科技有限责任公司">安徽合肥绿碳生态科技有限责任公司</option>
                        <option value="安徽省林业碳票运营管理有限公司">安徽省林业碳票运营管理有限公司</option>
                        <option value="合肥庐阳区林业生态发展投资有限公司">合肥庐阳区林业生态发展投资有限公司</option>
                        <option value="安徽森碳汇源生物科技有限公司">安徽森碳汇源生物科技有限公司</option>
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex items-center justify-around gap-2 pt-2 md:pt-0">
                    <div className="px-3 py-2 bg-slate-950/80 border border-emerald-950 rounded-lg text-center shadow-inner">
                      <div className="text-[10px] text-slate-400">剩余供应量</div>
                      <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">1000</div>
                      <div className="text-[9px] text-slate-500">(吨)</div>
                    </div>
                    <div className="px-3 py-2 bg-slate-950/80 border border-emerald-950 rounded-lg text-center shadow-inner">
                      <div className="text-[10px] text-slate-400">供应单价</div>
                      <div className="text-xs font-mono font-bold text-teal-400 mt-0.5">50</div>
                      <div className="text-[9px] text-slate-500">(元/吨)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-emerald-500/40 rounded-xl p-4 bg-slate-900/50 space-y-3 relative">
                <div className="absolute -top-2.5 left-4 px-2 bg-slate-950 text-emerald-400 font-semibold text-[11px]">
                  需求方
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-8 space-y-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        <span className="text-rose-500 mr-1">*</span>所属行政区划
                      </label>
                      <select
                        value={newTradeRecord.demandDistrict}
                        onChange={(e) => setNewTradeRecord({ ...newTradeRecord, demandDistrict: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-emerald-950 rounded-lg text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        required
                      >
                        <option value="">请选择</option>
                        <option value="合肥市 肥东县">合肥市 肥东县</option>
                        <option value="合肥市 肥西县">合肥市 肥西县</option>
                        <option value="合肥市 庐阳区">合肥市 庐阳区</option>
                        <option value="合肥市 高新区">合肥市 高新区</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        <span className="text-rose-500 mr-1">*</span>企业名称
                      </label>
                      <select
                        value={newTradeRecord.demandEnterpriseName}
                        onChange={(e) => setNewTradeRecord({ ...newTradeRecord, demandEnterpriseName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-emerald-950 rounded-lg text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        required
                      >
                        <option value="">请选择企业</option>
                        <option value="安徽省林业碳票运营管理有限公司">安徽省林业碳票运营管理有限公司</option>
                        <option value="合肥肥东生态林业开发有限公司">合肥肥东生态林业开发有限公司</option>
                        <option value="安徽皖中绿色碳汇资产管理中心">安徽皖中绿色碳汇资产管理中心</option>
                        <option value="安徽皖投碳中和数字科技有限责任公司">安徽皖投碳中和数字科技有限责任公司</option>
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex items-center justify-around gap-2 pt-2 md:pt-0">
                    <div className="px-3 py-2 bg-slate-950/80 border border-emerald-950 rounded-lg text-center shadow-inner">
                      <div className="text-[10px] text-slate-400">剩余需求量</div>
                      <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">1000</div>
                      <div className="text-[9px] text-slate-500">(吨)</div>
                    </div>
                    <div className="px-3 py-2 bg-slate-950/80 border border-emerald-950 rounded-lg text-center shadow-inner">
                      <div className="text-[10px] text-slate-400">意向单价</div>
                      <div className="text-xs font-mono font-bold text-teal-400 mt-0.5">50</div>
                      <div className="text-[9px] text-slate-500">(元/吨)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-emerald-500/40 rounded-xl p-4 bg-slate-900/50 space-y-3 relative">
                <div className="absolute -top-2.5 left-4 px-2 bg-slate-950 text-emerald-400 font-semibold text-[11px]">
                  交易信息
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      <span className="text-rose-500 mr-1">*</span>交易量
                    </label>
                    <div className="flex rounded-lg border border-emerald-950 overflow-hidden focus-within:border-emerald-500">
                      <input
                        type="number"
                        required
                        placeholder="请输入交易量"
                        value={newTradeRecord.tradingVolume}
                        onChange={(e) => setNewTradeRecord({ ...newTradeRecord, tradingVolume: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 text-slate-100 text-xs outline-none font-mono"
                      />
                      <span className="bg-slate-950 px-3 py-2 text-slate-400 text-[10px] border-l border-emerald-950 flex items-center font-mono">
                        吨
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      <span className="text-rose-500 mr-1">*</span>交易单价
                    </label>
                    <div className="flex rounded-lg border border-emerald-950 overflow-hidden focus-within:border-emerald-500">
                      <input
                        type="number"
                        required
                        placeholder="请输入交易单价"
                        value={newTradeRecord.unitPrice}
                        onChange={(e) => setNewTradeRecord({ ...newTradeRecord, unitPrice: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 text-slate-100 text-xs outline-none font-mono"
                      />
                      <span className="bg-slate-950 px-3 py-2 text-slate-400 text-[10px] border-l border-emerald-950 flex items-center font-mono">
                        元/吨
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      <span className="text-rose-500 mr-1">*</span>交易时间
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="请选择交易时间"
                        value={newTradeRecord.tradingTime}
                        onChange={(e) => setNewTradeRecord({ ...newTradeRecord, tradingTime: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-emerald-950 rounded-lg text-xs text-slate-100 outline-none focus:border-emerald-500 font-mono pr-8"
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[11px] text-slate-300 w-12">附件</span>
                    <input
                      type="file"
                      ref={tradeFileInputRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setTradeUploadFile(e.target.files[0]);
                          triggerToast(`已选择附件: ${e.target.files[0].name}`);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => tradeFileInputRef.current?.click()}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium flex items-center gap-1 cursor-pointer shadow"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>上传文件</span>
                    </button>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      {tradeUploadFile ? tradeUploadFile.name : '未选择文件'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 pl-12">
                    请上传大小不超过10MB格式为.pdf/.doc/.docx/.png/.jpg/.jpeg的文件!
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-center">
                <button
                  type="submit"
                  className="px-20 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-emerald-950/80 transition-colors cursor-pointer active:scale-95"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 查看交易信息 (统一深色科技风) */}
      {viewTradeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl max-w-xl w-full border border-emerald-900 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-emerald-900/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide">交易信息</span>
              <button
                type="button"
                onClick={() => setViewTradeDetail(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs font-sans max-h-[82vh] overflow-y-auto bg-[#091126]">
              {/* 年份 卡片 */}
              <div className="p-3.5 bg-[#0c1630] rounded-xl border border-dashed border-[#233560] text-slate-300 flex items-center justify-between">
                <span>交易年份：<strong className="text-emerald-400 font-mono text-sm ml-1">{viewTradeDetail.year} 年</strong></span>
                <span className="text-[11px] text-slate-400 font-mono">交易编号：{viewTradeDetail.id}</span>
              </div>

              {/* 供应方 */}
              <div>
                <div className="text-slate-300 font-medium mb-1.5 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-emerald-500 rounded-full" />
                  <span>供应方主体</span>
                </div>
                <div className="p-3.5 bg-[#0c1630] rounded-xl border border-dashed border-[#233560] space-y-2 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">所属行政区划：</span>
                    <span className="text-slate-200 font-medium">{viewTradeDetail.supplyDistrict}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">企业名称：</span>
                    <span className="text-emerald-400 font-medium">{viewTradeDetail.supplyEnterpriseName}</span>
                  </div>
                </div>
              </div>

              {/* 需求方 */}
              <div>
                <div className="text-slate-300 font-medium mb-1.5 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-teal-500 rounded-full" />
                  <span>需求方主体</span>
                </div>
                <div className="p-3.5 bg-[#0c1630] rounded-xl border border-dashed border-[#233560] space-y-2 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">所属行政区划：</span>
                    <span className="text-slate-200 font-medium">{viewTradeDetail.demandDistrict}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">企业名称：</span>
                    <span className="text-teal-300 font-medium">{viewTradeDetail.demandEnterpriseName}</span>
                  </div>
                </div>
              </div>

              {/* 交易数据 */}
              <div>
                <div className="text-slate-300 font-medium mb-1.5 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-cyan-500 rounded-full" />
                  <span>交易数据与凭证</span>
                </div>
                <div className="p-3.5 bg-[#0c1630] rounded-xl border border-dashed border-[#233560] space-y-3 text-slate-300">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#101a36] border border-[#1d2d57]">
                      <div className="text-slate-400 text-[11px] mb-1">交易量</div>
                      <div className="text-white font-mono font-bold text-sm">{viewTradeDetail.tradingVolume.toLocaleString()} 吨</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#101a36] border border-[#1d2d57]">
                      <div className="text-slate-400 text-[11px] mb-1">交易单价</div>
                      <div className="text-emerald-400 font-mono font-bold text-sm">￥{viewTradeDetail.unitPrice} 元/吨</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#101a36] border border-[#1d2d57]">
                      <div className="text-slate-400 text-[11px] mb-1">交易总金额</div>
                      <div className="text-amber-400 font-mono font-bold text-sm">￥{(viewTradeDetail.tradingVolume * viewTradeDetail.unitPrice).toLocaleString()} 元</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#101a36] border border-[#1d2d57]">
                      <div className="text-slate-400 text-[11px] mb-1">成交时间</div>
                      <div className="text-slate-200 font-mono text-xs">{viewTradeDetail.tradingTime}</div>
                    </div>
                  </div>

                  {/* 附件列表 */}
                  <div className="pt-2 border-t border-[#1d2d57]">
                    <div className="mb-2 text-slate-300 font-medium">附件凭证：</div>
                    <div className="space-y-2">
                      {/* 附件 1: PDF */}
                      <div className="p-2.5 bg-[#101a36] rounded-lg border border-[#1d2d57] flex items-center justify-between gap-3 hover:border-emerald-500/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                            PDF
                          </div>
                          <div>
                            <div className="font-normal text-slate-200 text-xs truncate max-w-[280px]">
                              {viewTradeDetail.id}_交易结算凭证.pdf
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">20.5MB · 区块链核验证书</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerToast('正在下载交易结算凭证文件...')}
                          className="text-emerald-400 hover:text-emerald-300 font-medium text-xs px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 cursor-pointer transition-colors"
                        >
                          下载
                        </button>
                      </div>

                      {/* 附件 2: DOC */}
                      <div className="p-2.5 bg-[#101a36] rounded-lg border border-[#1d2d57] flex items-center justify-between gap-3 hover:border-emerald-500/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                            DOC
                          </div>
                          <div>
                            <div className="font-normal text-slate-200 text-xs truncate max-w-[280px]">
                              {viewTradeDetail.id}_林业碳汇买卖交易合同.doc
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">20.5MB · 电子印章已签署</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerToast('正在下载林业碳汇买卖交易合同文件...')}
                          className="text-emerald-400 hover:text-emerald-300 font-medium text-xs px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 cursor-pointer transition-colors"
                        >
                          下载
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部居中关闭按钮 */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => setViewTradeDetail(null)}
                  className="px-14 py-2 bg-[#00c88c] hover:bg-[#00e699] text-white font-medium rounded-lg text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL: 新增/编辑企业入驻 */}
      {isAddEnterpriseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-900 overflow-hidden flex flex-col max-h-[94vh]">
            <div className="px-6 py-4 border-b border-emerald-900/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide">
                {editingEnterprise ? '编辑入驻企业' : '新增入驻企业'}
              </span>
              <button
                type="button"
                onClick={() => setIsAddEnterpriseModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEnterprise} className="p-6 overflow-y-auto space-y-4 text-xs bg-[#091126]">
              {/* 所属行政区划 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>所属行政区划
                </label>
                <select
                  value={enterpriseForm.district || ''}
                  onChange={(e) => setEnterpriseForm({ ...enterpriseForm, district: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                  required
                >
                  <option value="" disabled className="text-slate-500 bg-[#091126]">请选择</option>
                  <option value="合肥市 肥西县" className="bg-[#091126]">合肥市 肥西县</option>
                  <option value="合肥市 庐阳区" className="bg-[#091126]">合肥市 庐阳区</option>
                  <option value="合肥市 肥东县" className="bg-[#091126]">合肥市 肥东县</option>
                  <option value="合肥市 高新区" className="bg-[#091126]">合肥市 高新区</option>
                  <option value="合肥市 蜀山区" className="bg-[#091126]">合肥市 蜀山区</option>
                  <option value="合肥市 包河区" className="bg-[#091126]">合肥市 包河区</option>
                </select>
              </div>

              {/* 企业名称 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>企业名称
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入企业名称"
                  value={enterpriseForm.enterpriseName || ''}
                  onChange={(e) => setEnterpriseForm({ ...enterpriseForm, enterpriseName: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500 placeholder:text-slate-500"
                />
              </div>

              {/* 企业地址 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>企业地址
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入企业地址"
                  value={enterpriseForm.address || ''}
                  onChange={(e) => setEnterpriseForm({ ...enterpriseForm, address: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500 placeholder:text-slate-500"
                />
              </div>

              {/* 企业联系方式 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>企业联系方式
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入企业联系方式"
                  value={enterpriseForm.contact || ''}
                  onChange={(e) => setEnterpriseForm({ ...enterpriseForm, contact: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500 placeholder:text-slate-500 font-mono"
                />
              </div>

              {/* 登记身份 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>登记身份
                </label>
                <select
                  value={enterpriseForm.identity || ''}
                  onChange={(e) => setEnterpriseForm({ ...enterpriseForm, identity: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                  required
                >
                  <option value="" disabled className="text-slate-500 bg-[#091126]">请选择登记身份</option>
                  <option value="受让方" className="bg-[#091126]">受让方</option>
                  <option value="出让方" className="bg-[#091126]">出让方</option>
                  <option value="居间服务方" className="bg-[#091126]">居间服务方</option>
                </select>
              </div>

              {/* 可/需交易量 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>可/需交易量
                </label>
                <div className="flex-1 flex rounded-lg border border-[#1d2d57] overflow-hidden focus-within:border-emerald-500 bg-[#101a36]">
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="请输入可需交易量"
                    value={enterpriseForm.tradableVolume ?? ''}
                    onChange={(e) => setEnterpriseForm({ ...enterpriseForm, tradableVolume: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="flex-1 px-3 py-2 bg-transparent text-slate-100 outline-none font-mono text-xs placeholder:text-slate-500"
                  />
                  <span className="px-3.5 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-400 font-mono text-xs flex items-center">
                    吨
                  </span>
                </div>
              </div>

              {/* 意向单价 */}
              <div className="flex items-center gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>意向单价
                </label>
                <div className="flex-1 flex rounded-lg border border-[#1d2d57] overflow-hidden focus-within:border-emerald-500 bg-[#101a36]">
                  <input
                    type="number"
                    min={1}
                    step="0.1"
                    required
                    placeholder="请输入意向单价"
                    value={enterpriseForm.unitPrice ?? ''}
                    onChange={(e) => setEnterpriseForm({ ...enterpriseForm, unitPrice: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="flex-1 px-3 py-2 bg-transparent text-slate-100 outline-none font-mono text-xs placeholder:text-slate-500"
                  />
                  <span className="px-3.5 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-400 font-mono text-xs flex items-center">
                    元/吨
                  </span>
                </div>
              </div>

              {/* 营业执照 */}
              <div className="flex items-start gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 font-medium pt-2">
                  营业执照
                </label>
                <div className="flex-1">
                  <input
                    type="file"
                    ref={licenseFileInputRef}
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEnterpriseForm((prev) => ({ ...prev, licenseName: file.name }));
                        triggerToast(`已选择营业执照：${file.name}`);
                      }
                    }}
                  />
                  <div
                    onClick={() => licenseFileInputRef.current?.click()}
                    className="border border-dashed border-[#273a6a] hover:border-emerald-500/70 bg-[#0c1630] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#0e1c3e] group"
                  >
                    {enterpriseForm.licenseName ? (
                      <div className="flex flex-col items-center py-2 text-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-2">
                          <Check className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-medium text-emerald-400 mb-1">{enterpriseForm.licenseName}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[11px] text-slate-400 hover:text-white underline">重新上传</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEnterpriseForm((prev) => ({ ...prev, licenseName: '' }));
                              if (licenseFileInputRef.current) licenseFileInputRef.current.value = '';
                            }}
                            className="text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer"
                          >
                            移除
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-1">
                        {/* 营业执照证件卡片外框图形，严格对应截图 */}
                        <div className="w-56 h-28 border border-[#1e2f59] bg-[#0a1329] rounded-lg p-2.5 relative flex flex-col justify-between shadow-inner group-hover:border-slate-500/50 transition-colors">
                          {/* 顶部国徽/印章徽标示意 */}
                          <div className="flex justify-center">
                            <div className="w-5 h-5 rounded-full border border-slate-600/70 bg-slate-800/80 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-slate-500/40" />
                            </div>
                          </div>
                          {/* 中间圆形 + 图标按钮 */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-slate-700/70 border border-slate-500/60 flex items-center justify-center text-slate-200 group-hover:bg-emerald-600/80 group-hover:border-emerald-400 group-hover:text-white transition-all shadow-md">
                              <Plus className="w-5 h-5 stroke-[2.5]" />
                            </div>
                          </div>
                          {/* 底部信息横线骨架 */}
                          <div className="flex justify-between items-end">
                            <div className="space-y-1">
                              <div className="w-8 h-1 bg-slate-700/60 rounded" />
                              <div className="w-12 h-1 bg-slate-700/60 rounded" />
                            </div>
                            <div className="space-y-1">
                              <div className="w-10 h-1 bg-slate-700/60 rounded" />
                              <div className="w-6 h-1 bg-slate-700/60 rounded" />
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 mt-2.5 group-hover:text-emerald-400 transition-colors">
                          请上传公司营业执照
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 备注 */}
              <div className="flex items-start gap-3">
                <label className="w-28 text-right shrink-0 text-slate-300 font-medium pt-2">
                  备注
                </label>
                <textarea
                  rows={3}
                  placeholder="请输入备注"
                  value={enterpriseForm.remark || ''}
                  onChange={(e) => setEnterpriseForm({ ...enterpriseForm, remark: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500 placeholder:text-slate-500 resize-none text-xs"
                />
              </div>

              {/* 居中绿色提交按钮 */}
              <div className="pt-3 pb-1 flex justify-center">
                <button
                  type="submit"
                  className="px-14 py-2 bg-[#00c88c] hover:bg-[#00e699] text-white font-medium rounded-lg text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 新增/编辑供应挂牌 */}
      {isAddSupplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl max-w-xl w-full border border-emerald-900 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-emerald-900/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide">
                {editingSupply ? '编辑碳汇供应挂牌' : '新增碳汇供应挂牌'}
              </span>
              <button
                type="button"
                onClick={() => setIsAddSupplyModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupply} className="p-6 overflow-y-auto space-y-4 text-xs bg-[#091126]">
              {/* 年份 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>核准年份
                </label>
                <select
                  value={supplyForm.year}
                  onChange={(e) => setSupplyForm({ ...supplyForm, year: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500 font-mono cursor-pointer"
                  required
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>

              {/* 行政区划 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>行政区划
                </label>
                <select
                  value={supplyForm.district}
                  onChange={(e) => setSupplyForm({ ...supplyForm, district: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                  required
                >
                  <option value="合肥市 肥西县">合肥市 肥西县</option>
                  <option value="合肥市 庐阳区">合肥市 庐阳区</option>
                  <option value="合肥市 肥东县">合肥市 肥东县</option>
                  <option value="合肥市 高新区">合肥市 高新区</option>
                  <option value="合肥市 蜀山区">合肥市 蜀山区</option>
                  <option value="合肥市 包河区">合肥市 包河区</option>
                </select>
              </div>

              {/* 供应企业名称 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>企业名称
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入供应企业名称"
                  value={supplyForm.enterpriseName || ''}
                  onChange={(e) => setSupplyForm({ ...supplyForm, enterpriseName: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              {/* 挂牌供应量 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>挂牌供应量
                </label>
                <div className="flex-1 flex rounded-lg border border-[#1d2d57] overflow-hidden focus-within:border-emerald-500 bg-[#101a36]">
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="请输入供应总量"
                    value={supplyForm.supplyVolume ?? ''}
                    onChange={(e) => setSupplyForm({ ...supplyForm, supplyVolume: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="flex-1 px-3 py-2 bg-transparent text-slate-100 outline-none font-mono text-xs"
                  />
                  <span className="px-3 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-400 font-mono text-xs flex items-center">
                    吨
                  </span>
                </div>
              </div>

              {/* 供应单价 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>供应单价
                </label>
                <div className="flex-1 flex rounded-lg border border-[#1d2d57] overflow-hidden focus-within:border-emerald-500 bg-[#101a36]">
                  <input
                    type="number"
                    min={1}
                    step="0.1"
                    required
                    placeholder="请输入挂牌单价"
                    value={supplyForm.unitPrice ?? ''}
                    onChange={(e) => setSupplyForm({ ...supplyForm, unitPrice: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="flex-1 px-3 py-2 bg-transparent text-slate-100 outline-none font-mono text-xs"
                  />
                  <span className="px-3 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-400 font-mono text-xs flex items-center">
                    元/吨
                  </span>
                </div>
              </div>

              {/* 已交易量 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right shrink-0 text-slate-300 font-medium">已交易量</label>
                <div className="flex-1 flex rounded-lg border border-[#1d2d57] overflow-hidden focus-within:border-emerald-500 bg-[#101a36]">
                  <input
                    type="number"
                    min={0}
                    placeholder="默认0"
                    value={supplyForm.tradedVolume ?? 0}
                    onChange={(e) => setSupplyForm({ ...supplyForm, tradedVolume: e.target.value === '' ? 0 : Number(e.target.value) })}
                    className="flex-1 px-3 py-2 bg-transparent text-slate-100 outline-none font-mono text-xs"
                  />
                  <span className="px-3 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-400 font-mono text-xs flex items-center">
                    吨
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="px-14 py-2.5 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  提交保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 新增/编辑需求意向 */}
      {isAddDemandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl max-w-xl w-full border border-emerald-900 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-emerald-900/80 flex items-center justify-between bg-[#0a142e]">
              <span className="font-bold text-base text-white tracking-wide">
                {editingDemand ? '编辑需求意向信息' : '新增需求求购意向'}
              </span>
              <button
                type="button"
                onClick={() => setIsAddDemandModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDemand} className="p-6 overflow-y-auto space-y-4 text-xs bg-[#091126]">
              {/* 年份 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>需求年份
                </label>
                <select
                  value={demandForm.year}
                  onChange={(e) => setDemandForm({ ...demandForm, year: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500 font-mono cursor-pointer"
                  required
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              {/* 行政区划 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>行政区划
                </label>
                <select
                  value={demandForm.district}
                  onChange={(e) => setDemandForm({ ...demandForm, district: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                  required
                >
                  <option value="合肥市 肥西县">合肥市 肥西县</option>
                  <option value="合肥市 庐阳区">合肥市 庐阳区</option>
                  <option value="合肥市 肥东县">合肥市 肥东县</option>
                  <option value="合肥市 高新区">合肥市 高新区</option>
                  <option value="合肥市 蜀山区">合肥市 蜀山区</option>
                  <option value="合肥市 包河区">合肥市 包河区</option>
                </select>
              </div>

              {/* 需求企业名称 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>企业名称
                </label>
                <input
                  type="text"
                  required
                  placeholder="请输入需求企业名称"
                  value={demandForm.enterpriseName || ''}
                  onChange={(e) => setDemandForm({ ...demandForm, enterpriseName: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              {/* 求购需求量 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>求购需求量
                </label>
                <div className="flex-1 flex rounded-lg border border-[#1d2d57] overflow-hidden focus-within:border-emerald-500 bg-[#101a36]">
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="请输入求购需求量"
                    value={demandForm.demandVolume ?? ''}
                    onChange={(e) => setDemandForm({ ...demandForm, demandVolume: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="flex-1 px-3 py-2 bg-transparent text-slate-100 outline-none font-mono text-xs"
                  />
                  <span className="px-3 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-400 font-mono text-xs flex items-center">
                    吨
                  </span>
                </div>
              </div>

              {/* 意向单价 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right shrink-0 text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>意向单价
                </label>
                <div className="flex-1 flex rounded-lg border border-[#1d2d57] overflow-hidden focus-within:border-emerald-500 bg-[#101a36]">
                  <input
                    type="number"
                    min={1}
                    step="0.1"
                    required
                    placeholder="请输入意向单价"
                    value={demandForm.unitPrice ?? ''}
                    onChange={(e) => setDemandForm({ ...demandForm, unitPrice: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="flex-1 px-3 py-2 bg-transparent text-slate-100 outline-none font-mono text-xs"
                  />
                  <span className="px-3 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-400 font-mono text-xs flex items-center">
                    元/吨
                  </span>
                </div>
              </div>

              {/* 已采购量 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right shrink-0 text-slate-300 font-medium">已采购量</label>
                <div className="flex-1 flex rounded-lg border border-[#1d2d57] overflow-hidden focus-within:border-emerald-500 bg-[#101a36]">
                  <input
                    type="number"
                    min={0}
                    placeholder="默认0"
                    value={demandForm.tradedVolume ?? 0}
                    onChange={(e) => setDemandForm({ ...demandForm, tradedVolume: e.target.value === '' ? 0 : Number(e.target.value) })}
                    className="flex-1 px-3 py-2 bg-transparent text-slate-100 outline-none font-mono text-xs"
                  />
                  <span className="px-3 py-2 bg-[#0f1d3f] border-l border-[#1d2d57] text-slate-400 font-mono text-xs flex items-center">
                    吨
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="px-14 py-2.5 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  提交保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 上传附件材料 (对应截图中的上传附件功能) */}
      {uploadModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#091126] text-slate-100 rounded-2xl shadow-2xl max-w-xl w-full border border-emerald-900 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-emerald-900/80 flex items-center justify-between bg-[#0a142e]">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#00c88c]" />
                <span className="font-bold text-base text-white tracking-wide">
                  上传材料凭证附件
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalTarget(null)}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmUploadAttachment} className="p-6 overflow-y-auto space-y-4 text-xs bg-[#091126]">
              {/* 所属企业与业务 */}
              <div className="p-3.5 bg-[#0f1d3f]/60 rounded-xl border border-[#1d2d57] space-y-1.5">
                <div className="text-slate-400">
                  关联企业主体：<span className="text-emerald-400 font-bold ml-1">{uploadModalTarget.name}</span>
                </div>
                <div className="text-slate-400">
                  业务类别：<span className="text-slate-200 ml-1">
                    {uploadModalTarget.type === 'enterprise' ? '企业入驻资质备案' : uploadModalTarget.type === 'supply' ? '碳汇供应挂牌权属核验' : '碳汇需求意向采购确认'}
                  </span>
                </div>
              </div>

              {/* 附件材料分类 */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>材料类别
                </label>
                <select
                  value={attachmentCategory}
                  onChange={(e) => setAttachmentCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101a36] border border-[#1d2d57] rounded-lg text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="营业执照与主体资质">营业执照与法定主体资质证明 (PDF/图片)</option>
                  <option value="碳汇减排量核证报告">林业碳汇减排量审定与核查报告 (CCER/省级标准)</option>
                  <option value="交易意向确认委托书">碳资产委托交易申报及法人授权委托书</option>
                  <option value="林权与流转承包证明">林权证书及林地流转承包协议扫描件</option>
                  <option value="结算纳税资质">银行开户许可证及开票纳税资质证明</option>
                </select>
              </div>

              {/* 上传文件选择区 */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">
                  <span className="text-rose-400 mr-1">*</span>选择本地附件文件
                </label>
                <input
                  type="file"
                  ref={attachmentFileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadFile(e.target.files[0]);
                      triggerToast(`已选择附件「${e.target.files[0].name}」`);
                    }
                  }}
                />
                <div className="border border-dashed border-[#1d2d57] hover:border-[#00c88c] bg-[#101a36]/60 rounded-xl p-5 text-center transition-colors">
                  <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                  <button
                    type="button"
                    onClick={() => attachmentFileInputRef.current?.click()}
                    className="px-4 py-1.5 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-xs cursor-pointer transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5"
                  >
                    <span>浏览并选取文件</span>
                  </button>
                  <div className="text-[11px] text-slate-400 mt-2">
                    {uploadFile ? (
                      <span className="text-emerald-300 font-mono font-medium">
                        ✓ 已就绪：{uploadFile.name} ({(uploadFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    ) : (
                      '支持 PDF、Word、Excel 及高清单据图片（单文件最大不超过 20MB）'
                    )}
                  </div>
                </div>
              </div>

              {/* 已归档历史附件材料展示 */}
              {recordAttachments[uploadModalTarget.id] && recordAttachments[uploadModalTarget.id].length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-slate-400 font-medium text-[11px]">
                    该主体已关联归档材料 ({recordAttachments[uploadModalTarget.id].length})：
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {recordAttachments[uploadModalTarget.id].map((att, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 bg-[#101a36] rounded-lg border border-[#1d2d57] flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center gap-2 truncate max-w-[320px]">
                          <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-slate-200 truncate">{att.name}</span>
                          <span className="text-slate-500 font-mono text-[10px]">({att.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerToast(`正在下载附件「${att.name}」`)}
                          className="text-[#00c88c] hover:underline cursor-pointer shrink-0 ml-2"
                        >
                          下载
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-center">
                <button
                  type="submit"
                  className="px-14 py-2.5 bg-[#00c88c] hover:bg-[#00e699] text-slate-950 font-bold rounded-lg text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  确认上传并提交归档
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
