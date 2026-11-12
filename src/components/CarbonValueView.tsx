import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  Upload,
  RefreshCw,
  Edit3,
  Trash2,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  X,
  Sliders,
  TrendingUp,
  BarChart3,
  Database,
  ArrowLeft,
  Check,
  Building2,
  Layers,
  Activity,
  Calculator,
  Coins,
  ShieldCheck,
  Info,
  Filter,
  Sparkles,
  Radio,
  AlertCircle,
} from 'lucide-react';

export interface CarbonPriceRecord {
  id: string;
  priceNo: string;
  priceType: '市场价' | '指导价' | '挂牌价' | '协议价';
  marketSource: '全国碳市场' | '北京绿交所' | '广东碳汇市场' | 'CCER' | '海峡股权交易中心' | '四川碳交所' | '重庆碳交所';
  unitPrice: number; // 元/tCO2e
  priceDate: string;
  dataSource: '交易所API' | '人工录入' | '国家监测网';
  status: '生效中' | '已过期';
  gatherTime: string;
  isDefault?: boolean;
}

const INITIAL_PRICE_RECORDS: CarbonPriceRecord[] = [
  {
    id: 'p-1',
    priceNo: '100010122',
    priceType: '市场价',
    marketSource: '全国碳市场',
    unitPrice: 52,
    priceDate: '2026-10-15',
    dataSource: '交易所API',
    status: '生效中',
    gatherTime: '2026-10-15 12:22:05',
    isDefault: true,
  },
  {
    id: 'p-2',
    priceNo: '100010121',
    priceType: '指导价',
    marketSource: '北京绿交所',
    unitPrice: 60,
    priceDate: '2026-10-15',
    dataSource: '交易所API',
    status: '生效中',
    gatherTime: '2026-10-15 12:22:05',
  },
  {
    id: 'p-3',
    priceNo: '100010120',
    priceType: '指导价',
    marketSource: '北京绿交所',
    unitPrice: 48,
    priceDate: '2026-10-15',
    dataSource: '交易所API',
    status: '生效中',
    gatherTime: '2026-10-15 12:22:05',
  },
  {
    id: 'p-4',
    priceNo: '100010119',
    priceType: '市场价',
    marketSource: '北京绿交所',
    unitPrice: 55,
    priceDate: '2026-10-15',
    dataSource: '交易所API',
    status: '生效中',
    gatherTime: '2026-10-15 10:56:00',
  },
  {
    id: 'p-5',
    priceNo: '100010118',
    priceType: '市场价',
    marketSource: '广东碳汇市场',
    unitPrice: 46,
    priceDate: '2026-10-14',
    dataSource: '人工录入',
    status: '已过期',
    gatherTime: '2026-10-14 11:24:25',
  },
  {
    id: 'p-6',
    priceNo: '100010117',
    priceType: '市场价',
    marketSource: '广东碳汇市场',
    unitPrice: 50,
    priceDate: '2026-10-14',
    dataSource: '人工录入',
    status: '已过期',
    gatherTime: '2026-10-14 11:11:25',
  },
  {
    id: 'p-7',
    priceNo: '100010116',
    priceType: '市场价',
    marketSource: 'CCER',
    unitPrice: 55,
    priceDate: '2026-10-14',
    dataSource: '人工录入',
    status: '生效中',
    gatherTime: '2026-10-14 11:05:25',
  },
  {
    id: 'p-8',
    priceNo: '100010115',
    priceType: '市场价',
    marketSource: '广东碳汇市场',
    unitPrice: 46,
    priceDate: '2026-10-14',
    dataSource: '人工录入',
    status: '已过期',
    gatherTime: '2026-10-14 10:10:21',
  },
  {
    id: 'p-9',
    priceNo: '100010114',
    priceType: '市场价',
    marketSource: '全国碳市场',
    unitPrice: 50,
    priceDate: '2026-10-13',
    dataSource: '人工录入',
    status: '已过期',
    gatherTime: '2026-10-13 09:11:25',
  },
  {
    id: 'p-10',
    priceNo: '100010113',
    priceType: '市场价',
    marketSource: '全国碳市场',
    unitPrice: 55,
    priceDate: '2026-10-13',
    dataSource: '人工录入',
    status: '已过期',
    gatherTime: '2026-10-13 09:11:25',
  },
  {
    id: 'p-11',
    priceNo: '100010112',
    priceType: '指导价',
    marketSource: '海峡股权交易中心',
    unitPrice: 58,
    priceDate: '2026-10-12',
    dataSource: '交易所API',
    status: '已过期',
    gatherTime: '2026-10-12 16:40:12',
  },
  {
    id: 'p-12',
    priceNo: '100010111',
    priceType: '市场价',
    marketSource: '四川碳交所',
    unitPrice: 49,
    priceDate: '2026-10-12',
    dataSource: '交易所API',
    status: '已过期',
    gatherTime: '2026-10-12 14:15:30',
  },
];

export interface CarbonStorageRecord {
  id: string;
  compartmentNo: string;
  forestType: '乔木林' | '杉木林' | '阔叶林' | '针阔混交林';
  area: number; // hm²
  growingStock: number; // m³/hm²
  aboveGroundCarbon: number; // tCO2e
  belowGroundCarbon: number; // tCO2e
  litterCarbon: number; // tCO2e
  soilCarbon: number; // tCO2e
  totalCarbon: number; // tCO2e
  accountingDate: string;
}

const INITIAL_STORAGE_RECORDS: CarbonStorageRecord[] = [
  { id: 's-1', compartmentNo: 'XB-350102-00156', forestType: '乔木林', area: 12.56, growingStock: 85.3, aboveGroundCarbon: 44.23, belowGroundCarbon: 12.36, litterCarbon: 2.15, soilCarbon: 5.36, totalCarbon: 128.25, accountingDate: '2026-10-15' },
  { id: 's-2', compartmentNo: 'XB-350102-00155', forestType: '杉木林', area: 11.08, growingStock: 79.5, aboveGroundCarbon: 44.25, belowGroundCarbon: 11.30, litterCarbon: 2.26, soilCarbon: 5.36, totalCarbon: 113.85, accountingDate: '2026-10-15' },
  { id: 's-3', compartmentNo: 'XB-350102-00154', forestType: '乔木林', area: 10.89, growingStock: 65.9, aboveGroundCarbon: 36.29, belowGroundCarbon: 10.56, litterCarbon: 1.89, soilCarbon: 5.36, totalCarbon: 106.03, accountingDate: '2026-10-14' },
  { id: 's-4', compartmentNo: 'XB-350102-00153', forestType: '杉木林', area: 12.00, growingStock: 55.8, aboveGroundCarbon: 44.23, belowGroundCarbon: 11.30, litterCarbon: 1.48, soilCarbon: 5.36, totalCarbon: 106.28, accountingDate: '2026-10-14' },
  { id: 's-5', compartmentNo: 'XB-350102-00152', forestType: '杉木林', area: 10.80, growingStock: 80.8, aboveGroundCarbon: 44.25, belowGroundCarbon: 10.56, litterCarbon: 2.15, soilCarbon: 5.36, totalCarbon: 126.47, accountingDate: '2026-10-13' },
  { id: 's-6', compartmentNo: 'XB-350102-00151', forestType: '阔叶林', area: 10.89, growingStock: 50.5, aboveGroundCarbon: 36.29, belowGroundCarbon: 12.36, litterCarbon: 2.26, soilCarbon: 5.36, totalCarbon: 106.95, accountingDate: '2026-10-13' },
  { id: 's-7', compartmentNo: 'XB-350102-00150', forestType: '阔叶林', area: 11.08, growingStock: 55.4, aboveGroundCarbon: 44.23, belowGroundCarbon: 9.52, litterCarbon: 1.89, soilCarbon: 5.36, totalCarbon: 112.93, accountingDate: '2026-10-12' },
  { id: 's-8', compartmentNo: 'XB-350102-00149', forestType: '阔叶林', area: 11.08, growingStock: 46.8, aboveGroundCarbon: 44.25, belowGroundCarbon: 12.36, litterCarbon: 1.48, soilCarbon: 5.36, totalCarbon: 107.36, accountingDate: '2026-10-12' },
  { id: 's-9', compartmentNo: 'XB-350102-00148', forestType: '杉木林', area: 11.08, growingStock: 50.9, aboveGroundCarbon: 36.29, belowGroundCarbon: 10.56, litterCarbon: 2.26, soilCarbon: 5.38, totalCarbon: 105.15, accountingDate: '2026-10-11' },
  { id: 's-10', compartmentNo: 'XB-350102-00147', forestType: '乔木林', area: 11.08, growingStock: 55.9, aboveGroundCarbon: 44.25, belowGroundCarbon: 11.30, litterCarbon: 1.89, soilCarbon: 5.36, totalCarbon: 114.73, accountingDate: '2026-10-11' },
];

export interface SinkMeterRecord {
  id: string;
  projectNo: string;
  projectName: string;
  boundaryArea: number; // hm²
  baselineCarbon: number; // tCO₂e
  projectCarbon: number; // tCO₂e
  carbonChange: number; // tCO₂e
  netSink: number; // tCO₂e
  certStatus: '待审定' | '已核证' | '已签发';
  issueDate: string;
}

const INITIAL_SINK_RECORDS: SinkMeterRecord[] = [
  { id: 'sm-1', projectNo: 'CCER-FJ-2026-00089', projectName: '福建三明将乐县收储林碳汇项目', boundaryArea: 563, baselineCarbon: 182, projectCarbon: 242, carbonChange: 60, netSink: 100, certStatus: '待审定', issueDate: '2026-10-15' },
  { id: 'sm-2', projectNo: 'CCER-FJ-2026-00088', projectName: '安徽合肥大蜀山国家森林碳汇项目', boundaryArea: 456, baselineCarbon: 130, projectCarbon: 260, carbonChange: 130, netSink: 80, certStatus: '待审定', issueDate: '2026-10-14' },
  { id: 'sm-3', projectNo: 'CCER-FJ-2026-00087', projectName: '浙江安吉竹林生态系统碳汇提升', boundaryArea: 785, baselineCarbon: 123, projectCarbon: 248, carbonChange: 125, netSink: 26, certStatus: '已核证', issueDate: '2026-10-13' },
  { id: 'sm-4', projectNo: 'CCER-FJ-2026-00086', projectName: '江西吉安井冈山红色造林碳汇', boundaryArea: 456, baselineCarbon: 140, projectCarbon: 255, carbonChange: 115, netSink: 52, certStatus: '已核证', issueDate: '2026-10-12' },
  { id: 'sm-5', projectNo: 'CCER-FJ-2026-00085', projectName: '福建南平武夷山森林经营碳汇', boundaryArea: 781, baselineCarbon: 146, projectCarbon: 246, carbonChange: 100, netSink: 65, certStatus: '已核证', issueDate: '2026-10-11' },
  { id: 'sm-6', projectNo: 'CCER-FJ-2026-00084', projectName: '四川阿坝州若尔盖湿地固碳项目', boundaryArea: 563, baselineCarbon: 150, projectCarbon: 250, carbonChange: 100, netSink: 74, certStatus: '已签发', issueDate: '2026-10-10' },
  { id: 'sm-7', projectNo: 'CCER-FJ-2026-00083', projectName: '云南西双版纳热带雨林碳汇监测', boundaryArea: 334, baselineCarbon: 155, projectCarbon: 255, carbonChange: 100, netSink: 26, certStatus: '已签发', issueDate: '2026-10-09' },
  { id: 'sm-8', projectNo: 'CCER-FJ-2026-00082', projectName: '贵州毕节百里杜鹃生态碳汇', boundaryArea: 454, baselineCarbon: 146, projectCarbon: 246, carbonChange: 100, netSink: 75, certStatus: '已签发', issueDate: '2026-10-08' },
  { id: 'sm-9', projectNo: 'CCER-FJ-2026-00081', projectName: '广西崇左左江生态造林碳汇工程', boundaryArea: 455, baselineCarbon: 150, projectCarbon: 250, carbonChange: 100, netSink: 90, certStatus: '已签发', issueDate: '2026-10-07' },
  { id: 'sm-10', projectNo: 'CCER-FJ-2026-00080', projectName: '湖南张家界武陵源森林碳汇项目', boundaryArea: 666, baselineCarbon: 155, projectCarbon: 255, carbonChange: 100, netSink: 68, certStatus: '已签发', issueDate: '2026-10-06' },
];

interface CarbonValueViewProps {
  username?: string;
  onBackToPortal: () => void;
}

export const CarbonValueView: React.FC<CarbonValueViewProps> = ({
  username = 'admin',
  onBackToPortal,
}) => {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'price_mgmt' | 'storage_calc' | 'sink_meter' | 'dynamic_monitor'>('price_mgmt');

  // Master records
  const [records, setRecords] = useState<CarbonPriceRecord[]>(INITIAL_PRICE_RECORDS);

  // Filter conditions
  const [filterPriceType, setFilterPriceType] = useState<string>('all');
  const [filterMarketSource, setFilterMarketSource] = useState<string>('all');
  const [filterMinPrice, setFilterMinPrice] = useState<string>('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Carbon Storage filter & pagination states
  const [storageRecords, setStorageRecords] = useState<CarbonStorageRecord[]>(INITIAL_STORAGE_RECORDS);
  const [filterForestType, setFilterForestType] = useState<string>('all');
  const [filterStorageDate, setFilterStorageDate] = useState<string>('');
  const [filterMinStorage, setFilterMinStorage] = useState<string>('');
  const [filterMaxStorage, setFilterMaxStorage] = useState<string>('');
  const [storagePage, setStoragePage] = useState<number>(1);
  const [storagePageSize, setStoragePageSize] = useState<number>(10);
  const [storageJumpInput, setStorageJumpInput] = useState<string>('');
  const [detailStorage, setDetailStorage] = useState<CarbonStorageRecord | null>(null);
  const [isStorageImportModalOpen, setIsStorageImportModalOpen] = useState<boolean>(false);

  const filteredStorageRecords = useMemo(() => {
    return storageRecords.filter((s) => {
      if (filterForestType !== 'all' && s.forestType !== filterForestType) return false;
      if (filterStorageDate && !s.accountingDate.includes(filterStorageDate)) return false;
      if (filterMinStorage && s.totalCarbon < Number(filterMinStorage)) return false;
      if (filterMaxStorage && s.totalCarbon > Number(filterMaxStorage)) return false;
      return true;
    });
  }, [storageRecords, filterForestType, filterStorageDate, filterMinStorage, filterMaxStorage]);

  const totalStoragePages = Math.max(1, Math.ceil(filteredStorageRecords.length / storagePageSize));
  const displayedStorageRecords = useMemo(() => {
    const start = (storagePage - 1) * storagePageSize;
    return filteredStorageRecords.slice(start, start + storagePageSize);
  }, [filteredStorageRecords, storagePage, storagePageSize]);

  // Carbon Sink Measurement (sink_meter) states & memo
  const [storageSelectedFile, setStorageSelectedFile] = useState<File | null>(null);
  const [sinkSelectedFile, setSinkSelectedFile] = useState<File | null>(null);
  const storageFileRef = React.useRef<HTMLInputElement | null>(null);
  const sinkFileRef = React.useRef<HTMLInputElement | null>(null);
  const [sinkRecords, setSinkRecords] = useState<SinkMeterRecord[]>(INITIAL_SINK_RECORDS);
  const [filterSinkName, setFilterSinkName] = useState<string>('');
  const [filterCertStatus, setFilterCertStatus] = useState<string>('all');
  const [filterIssueDate, setFilterIssueDate] = useState<string>('');
  const [sinkPage, setSinkPage] = useState<number>(1);
  const [sinkPageSize, setSinkPageSize] = useState<number>(10);
  const [isSinkImportModalOpen, setIsSinkImportModalOpen] = useState<boolean>(false);
  const [detailSink, setDetailSink] = useState<SinkMeterRecord | null>(null);

  const filteredSinkRecords = useMemo(() => {
    return sinkRecords.filter((s) => {
      if (filterSinkName && !s.projectName.includes(filterSinkName) && !s.projectNo.includes(filterSinkName)) return false;
      if (filterCertStatus !== 'all' && s.certStatus !== filterCertStatus) return false;
      if (filterIssueDate && !s.issueDate.includes(filterIssueDate)) return false;
      return true;
    });
  }, [sinkRecords, filterSinkName, filterCertStatus, filterIssueDate]);

  const totalSinkPages = Math.max(1, Math.ceil(filteredSinkRecords.length / sinkPageSize));
  const displayedSinkRecords = useMemo(() => {
    const start = (sinkPage - 1) * sinkPageSize;
    return filteredSinkRecords.slice(start, start + sinkPageSize);
  }, [filteredSinkRecords, sinkPage, sinkPageSize]);

  // Modals
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isBatchImportModalOpen, setIsBatchImportModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editRecord, setEditRecord] = useState<CarbonPriceRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [detailRecord, setDetailRecord] = useState<CarbonPriceRecord | null>(null);
  const [recalculateRecord, setRecalculateRecord] = useState<CarbonStorageRecord | null>(null);
  const [monitorYear, setMonitorYear] = useState<string>('2026');
  const [isForestDetailOpen, setIsForestDetailOpen] = useState<boolean>(true);
  const [isSinkCorrectionModalOpen, setIsSinkCorrectionModalOpen] = useState<boolean>(false);
  const [isApplyAuditModalOpen, setIsApplyAuditModalOpen] = useState<boolean>(false);
  const [applyAuditRecord, setApplyAuditRecord] = useState<SinkMeterRecord | null>(null);
  const [auditBody, setAuditBody] = useState<string>('中国质量认证中心 (CQC)');
  const [appliedVolume, setAppliedVolume] = useState<string>('100');
  const [auditRemarks, setAuditRemarks] = useState<string>('请予以加快审核并出具国家自愿减排项目审定报告。');
  const [auditFile, setAuditFile] = useState<File | null>(null);
  const auditFileRef = React.useRef<HTMLInputElement | null>(null);
  const [correctionRecord, setCorrectionRecord] = useState<{
    projectNo: string;
    projectName: string;
    boundaryArea: number;
    baselineCarbon: number;
    projectPeriodCarbon: number;
    emissionDeduction: number;
    leakage: number;
    permanenceDeduction: number;
    netSink: number;
  }>({
    projectNo: 'CCER-FJ-2026-0089',
    projectName: '福建三明将乐县造林项目',
    boundaryArea: 563.00,
    baselineCarbon: 86.3,
    projectPeriodCarbon: 186.4,
    emissionDeduction: -21.34,
    leakage: -15.34,
    permanenceDeduction: 10,
    netSink: 65.34,
  });

  // Manual entry form
  const [manualForm, setManualForm] = useState({
    priceType: '市场价' as CarbonPriceRecord['priceType'],
    marketSource: '全国碳市场' as CarbonPriceRecord['marketSource'],
    unitPrice: '',
    priceDate: new Date().toISOString().slice(0, 10),
    dataSource: '人工录入' as CarbonPriceRecord['dataSource'],
    status: '生效中' as CarbonPriceRecord['status'],
  });

  // System Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filterPriceType !== 'all' && r.priceType !== filterPriceType) return false;
      if (filterMarketSource !== 'all' && r.marketSource !== filterMarketSource) return false;
      if (filterMinPrice && r.unitPrice < Number(filterMinPrice)) return false;
      if (filterMaxPrice && r.unitPrice > Number(filterMaxPrice)) return false;
      if (filterDateRange && !r.priceDate.includes(filterDateRange)) return false;
      return true;
    });
  }, [records, filterPriceType, filterMarketSource, filterMinPrice, filterMaxPrice, filterDateRange]);

  // Paginated dataset
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const displayedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Reset search filters
  const handleResetFilters = () => {
    setFilterPriceType('all');
    setFilterMarketSource('all');
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterDateRange('');
    setCurrentPage(1);
    triggerToast('已重置筛选条件');
  };

  // Manual entry submit
  const handleSaveManualRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.unitPrice || isNaN(Number(manualForm.unitPrice))) {
      triggerToast('请输入有效的碳单价数值');
      return;
    }

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const newPriceNo = `100010${123 + Math.floor(Math.random() * 800)}`;

    const newRec: CarbonPriceRecord = {
      id: `p-${Date.now()}`,
      priceNo: newPriceNo,
      priceType: manualForm.priceType,
      marketSource: manualForm.marketSource,
      unitPrice: Number(manualForm.unitPrice),
      priceDate: manualForm.priceDate,
      dataSource: manualForm.dataSource,
      status: manualForm.status,
      gatherTime: timeStr,
    };

    setRecords((prev) => [newRec, ...prev]);
    setIsManualModalOpen(false);
    triggerToast(`已被成功保存录入碳价记录【${newPriceNo}】`);
  };

  // Sync API data simulation
  const handleSyncData = () => {
    setIsSyncing(true);
    triggerToast('正在实时对接全国碳市场 API 与各大区域交易所接口...');
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      const syncedRec: CarbonPriceRecord = {
        id: `p-sync-${Date.now()}`,
        priceNo: `100010${150 + Math.floor(Math.random() * 50)}`,
        priceType: '市场价',
        marketSource: '全国碳市场',
        unitPrice: Math.floor(52 + Math.random() * 12),
        priceDate: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
        dataSource: '交易所API',
        status: '生效中',
        gatherTime: timeStr,
      };

      setRecords((prev) => [syncedRec, ...prev]);
      triggerToast('API 数据同步完毕，已成功接入最新成交价格！');
    }, 1500);
  };

  // Set default price
  const handleSetDefault = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => ({
        ...r,
        isDefault: r.id === id,
      }))
    );
    const item = records.find((r) => r.id === id);
    triggerToast(`已将【${item?.marketSource} ${item?.priceType} (${item?.unitPrice}元/tCO₂e)】设为系统基准默认核算单价`);
  };

  // Delete
  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirmId(null);
    triggerToast('已成功删除该条碳价数据');
  };

  return (
    <div className="min-h-screen bg-[#020d08] text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Dynamic Background Cyber Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12)_0%,rgba(5,25,18,0.08)_50%,transparent_80%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* System Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-emerald-950/95 border border-emerald-500/80 rounded-xl text-xs text-emerald-200 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Main Navigation Bar */}
      <header className="relative z-20 h-16 px-6 lg:px-8 bg-gradient-to-b from-[#031c12] via-[#051f15] to-[#03150e]/95 border-b border-emerald-800/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToPortal}
            type="button"
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
                碳汇价值核算系统
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/90 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>精细估值体系</span>
              </span>
            </div>
            <div className="text-[9px] font-mono text-emerald-500/80 tracking-widest uppercase">
              CARBON SINK VALUE ACCOUNTING & PRICING REGISTRY
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 pl-2 text-xs text-slate-300">
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
            onClick={() => setActiveTab('price_mgmt')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'price_mgmt'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>碳价管理</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('storage_calc');
              triggerToast('已切换至「碳储量核算」生物量蓄积转换视图');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'storage_calc'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>碳储量核算</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('sink_meter');
              triggerToast('已切换至「碳汇计量」CCER方法学测算视图');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'sink_meter'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>碳汇计量</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('dynamic_monitor');
              triggerToast('已切换至「动态监测」高分遥感与地面通量监测视图');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'dynamic_monitor'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>动态监测</span>
          </button>
        </div>
      </div>

      {/* 2. Main Workstation Page Content */}
      <main className="relative z-10 flex-1 p-4 lg:p-6 max-w-[1720px] mx-auto w-full space-y-5">
        {activeTab === 'price_mgmt' && (
          <>
            {/* CARD 1: Filter Box */}
            <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white tracking-wide">碳价检索与精准筛选</span>
                  <span className="text-xs text-slate-500">|</span>
                  <span className="text-xs text-emerald-400/90 font-mono">
                    交易所碳价行情与权威行情实时过滤
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsManualModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ 手动录入</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsBatchImportModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>批量导入</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncData}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-950/80 hover:bg-teal-900 border border-teal-700 text-teal-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>同步 API 数据</span>
                  </button>
                </div>
              </div>

              {/* Form Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3 items-end">
                {/* 价格类型 */}
                <div className="lg:col-span-3">
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">价格类型</label>
                  <select
                    value={filterPriceType}
                    onChange={(e) => {
                      setFilterPriceType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">请选择全部价格类型</option>
                    <option value="市场价">市场价</option>
                    <option value="指导价">指导价</option>
                    <option value="挂牌价">挂牌价</option>
                    <option value="协议价">协议价</option>
                  </select>
                </div>

                {/* 碳市场/来源 */}
                <div className="lg:col-span-3">
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">碳市场/来源</label>
                  <select
                    value={filterMarketSource}
                    onChange={(e) => {
                      setFilterMarketSource(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">请选择全部碳市场来源</option>
                    <option value="全国碳市场">全国碳市场</option>
                    <option value="北京绿交所">北京绿交所</option>
                    <option value="广东碳汇市场">广东碳汇市场</option>
                    <option value="CCER">CCER</option>
                    <option value="海峡股权交易中心">海峡股权交易中心</option>
                    <option value="四川碳交所">四川碳交所</option>
                  </select>
                </div>

                {/* 碳单价 Range */}
                <div className="lg:col-span-3">
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">碳单价 (元/tCO₂e)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="最小"
                      value={filterMinPrice}
                      onChange={(e) => setFilterMinPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono text-center"
                    />
                    <span className="text-slate-500 text-xs">~</span>
                    <input
                      type="number"
                      placeholder="最大"
                      value={filterMaxPrice}
                      onChange={(e) => setFilterMaxPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono text-center"
                    />
                  </div>
                </div>

                {/* 价格日期 */}
                <div className="lg:col-span-3">
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">价格日期</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="请选择日期范围"
                      value={filterDateRange}
                      onChange={(e) => setFilterDateRange(e.target.value)}
                      className="w-full pl-3 pr-8 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Search & Reset Buttons Row */}
                <div className="lg:col-span-12 flex items-center justify-end gap-2 pt-2 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>搜索</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-1.5 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: Data List Table Container */}
            <div className="bg-slate-950/90 border border-emerald-950/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
              {/* Table Header Strip */}
              <div className="px-5 py-3 border-b border-emerald-950 flex flex-wrap items-center justify-between gap-2 bg-slate-900/50">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>查询结果：共检索到</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    {filteredRecords.length}
                  </span>
                  <span>条碳价行情记录</span>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>数据已实时更新 · 对接全国及区域碳市场交易 API</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-950 bg-slate-900/80 text-slate-400 font-medium">
                      <th className="py-3.5 px-3 w-12 text-center">序号</th>
                      <th className="py-3.5 px-4 min-w-[130px]">价格编号</th>
                      <th className="py-3.5 px-4 min-w-[110px]">价格类型</th>
                      <th className="py-3.5 px-4 min-w-[150px]">碳市场/来源</th>
                      <th className="py-3.5 px-4 min-w-[140px] text-right">碳单价 (元/tCO₂e)</th>
                      <th className="py-3.5 px-4 min-w-[120px]">价格日期</th>
                      <th className="py-3.5 px-4 min-w-[130px]">数据来源</th>
                      <th className="py-3.5 px-4 min-w-[110px] text-center">状态</th>
                      <th className="py-3.5 px-4 min-w-[160px]">采集时间</th>
                      <th className="py-3.5 px-4 min-w-[160px] text-center">操作</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {displayedRecords.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-slate-500">
                          暂无符合筛选条件的碳价记录
                        </td>
                      </tr>
                    ) : (
                      displayedRecords.map((item, idx) => {
                        const serialNo = (currentPage - 1) * pageSize + idx + 1;
                        return (
                          <tr
                            key={item.id}
                            className="transition-colors hover:bg-emerald-950/30 group"
                          >
                            <td className="py-3.5 px-3 text-center text-slate-400 font-mono">
                              {serialNo}
                            </td>

                            <td className="py-3.5 px-4 font-mono font-medium">
                              <span
                                className="text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer flex items-center gap-1 font-bold"
                                onClick={() => setDetailRecord(item)}
                              >
                                {item.priceNo}
                                {item.isDefault && (
                                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded border border-emerald-800 font-normal">
                                    默认
                                  </span>
                                )}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-slate-300">{item.priceType}</td>

                            <td className="py-3.5 px-4 font-medium text-slate-200">
                              {item.marketSource}
                            </td>

                            <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                              {item.unitPrice.toFixed(2)}
                            </td>

                            <td className="py-3.5 px-4 font-mono text-slate-300">
                              {item.priceDate}
                            </td>

                            <td className="py-3.5 px-4 text-slate-300">
                              {item.dataSource}
                            </td>

                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              {item.status === '生效中' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/90 text-emerald-300 border border-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  生效中
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-950/80 text-rose-300 border border-rose-600/60">
                                  <AlertCircle className="w-3 h-3 text-rose-400" />
                                  已过期
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                              {item.gatherTime}
                            </td>

                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setDetailRecord(item)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors text-[11px] font-medium cursor-pointer"
                                  title="查看详细信息"
                                >
                                  详情
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setEditRecord(item)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium cursor-pointer"
                                  title="编辑参数"
                                >
                                  编辑
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSetDefault(item.id)}
                                  className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/70 text-emerald-300 hover:text-white transition-colors text-[11px] font-medium cursor-pointer"
                                  title="设为系统默认基准单价"
                                >
                                  设为默认
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(item.id)}
                                  className="p-1 rounded hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                  title="删除记录"
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
              <div className="p-4 border-t border-emerald-950 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400 font-sans">
                <div className="flex items-center gap-3">
                  <span>
                    显示第 <span className="text-white font-mono">{filteredRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> 至{' '}
                    <span className="text-white font-mono">
                      {Math.min(currentPage * pageSize, filteredRecords.length)}
                    </span>{' '}
                    条，共 <span className="text-white font-mono">{filteredRecords.length}</span> 条
                  </span>
                  <span className="text-slate-600">|</span>
                  <div className="flex items-center gap-1.5">
                    <span>每页</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
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
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
                  >
                    上一页
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors font-mono cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
                  >
                    下一页
                  </button>

                  <div className="flex items-center gap-1.5 ml-3 text-slate-400">
                    <span>跳转至</span>
                    <input
                      type="text"
                      value={jumpPageInput}
                      onChange={(e) => setJumpPageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = Number(jumpPageInput);
                          if (!isNaN(val) && val >= 1 && val <= totalPages) {
                            setCurrentPage(val);
                            triggerToast(`已跳转至第 ${val} 页`);
                          }
                        }
                      }}
                      className="w-10 h-6 bg-slate-900 border border-emerald-950 rounded text-center text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono"
                    />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: 碳储量核算 (按截图高保真生成) */}
        {activeTab === 'storage_calc' && (
          <>
            {/* CARD 1: Filter & Search Box */}
            <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-bold text-white tracking-wide">筛选搜索</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsStorageImportModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-lg text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>数据导入</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerToast('正在加载林业一张图遥感底座与小班矢量边界...')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-lg text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Database className="w-4 h-4" />
                    <span>林业一张图</span>
                  </button>
                </div>
              </div>

              {/* Form Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3 items-end">
                {/* 林种 */}
                <div className="lg:col-span-3">
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">林种</label>
                  <select
                    value={filterForestType}
                    onChange={(e) => {
                      setFilterForestType(e.target.value);
                      setStoragePage(1);
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    <option value="all">请选择</option>
                    <option value="乔木林">乔木林</option>
                    <option value="杉木林">杉木林</option>
                    <option value="阔叶林">阔叶林</option>
                    <option value="针阔混交林">针阔混交林</option>
                  </select>
                </div>

                {/* 核算日期 */}
                <div className="lg:col-span-3">
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">核算日期</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="请选择日期范围"
                      value={filterStorageDate}
                      onChange={(e) => {
                        setFilterStorageDate(e.target.value);
                        setStoragePage(1);
                      }}
                      className="w-full pl-3 pr-8 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 碳储量 Range */}
                <div className="lg:col-span-3">
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">碳储量 (tCO₂e)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder=""
                      value={filterMinStorage}
                      onChange={(e) => {
                        setFilterMinStorage(e.target.value);
                        setStoragePage(1);
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono text-center transition-colors"
                    />
                    <span className="text-slate-500 text-xs">~</span>
                    <input
                      type="number"
                      placeholder=""
                      value={filterMaxStorage}
                      onChange={(e) => {
                        setFilterMaxStorage(e.target.value);
                        setStoragePage(1);
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono text-center transition-colors"
                    />
                  </div>
                </div>

                {/* Search & Reset Buttons */}
                <div className="lg:col-span-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStoragePage(1)}
                    className="flex-1 py-1.5 px-3 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>搜索</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFilterForestType('all');
                      setFilterStorageDate('');
                      setFilterMinStorage('');
                      setFilterMaxStorage('');
                      setStoragePage(1);
                      triggerToast('已重置碳储量核算筛选条件');
                    }}
                    className="py-1.5 px-3 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: Data List Table Container */}
            <div className="bg-slate-950/90 border border-emerald-950/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
              {/* Table Header Strip */}
              <div className="px-5 py-3 border-b border-emerald-950 flex flex-wrap items-center justify-between gap-2 bg-slate-900/50">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-bold text-white tracking-wide">数据列表</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  共检索到 <strong className="text-emerald-400 font-bold">{filteredStorageRecords.length}</strong> 条小班碳储量记录
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-950 bg-slate-900/80 text-slate-400 font-medium">
                      <th className="py-3 px-3 w-12 text-center text-slate-500">序号</th>
                      <th className="py-3 px-3 min-w-[140px]">小班编号</th>
                      <th className="py-3 px-3 min-w-[90px]">林种</th>
                      <th className="py-3 px-3 min-w-[100px] text-right">面积 (hm²)</th>
                      <th className="py-3 px-3 min-w-[110px] text-right">蓄积量 (m³/hm²)</th>
                      <th className="py-3 px-3 min-w-[130px] text-right">地上生物量碳 (tCO₂e)</th>
                      <th className="py-3 px-3 min-w-[130px] text-right">地下生物量碳 (tCO₂e)</th>
                      <th className="py-3 px-3 min-w-[110px] text-right">枯落物碳 (tCO₂e)</th>
                      <th className="py-3 px-3 min-w-[110px] text-right">土壤有机碳 (tCO₂e)</th>
                      <th className="py-3 px-3 min-w-[110px] text-right">总碳储量 (tCO₂e)</th>
                      <th className="py-3 px-3 min-w-[110px]">核算日期</th>
                      <th className="py-3 px-3 min-w-[130px] text-center">操作</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/60">
                    {displayedStorageRecords.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="py-12 text-center text-slate-500">
                          暂无符合条件的碳储量核算小班记录
                        </td>
                      </tr>
                    ) : (
                      displayedStorageRecords.map((item, idx) => {
                        const serialNo = (storagePage - 1) * storagePageSize + idx + 1;
                        return (
                          <tr
                            key={item.id}
                            className="transition-colors group hover:bg-emerald-950/30 text-slate-200"
                          >
                            <td className="py-3.5 px-3 text-center text-slate-500 font-mono">
                              {serialNo}
                            </td>

                            <td className="py-3.5 px-3 font-mono font-medium">
                              <span
                                className="text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer font-bold"
                                onClick={() => setDetailStorage(item)}
                              >
                                {item.compartmentNo}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 text-slate-300">{item.forestType}</td>

                            <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                              {item.area.toFixed(2)}
                            </td>

                            <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                              {item.growingStock.toFixed(1)}
                            </td>

                            <td className="py-3.5 px-3 text-right font-mono text-emerald-300">
                              {item.aboveGroundCarbon.toFixed(2)}
                            </td>

                            <td className="py-3.5 px-3 text-right font-mono text-teal-300">
                              {item.belowGroundCarbon.toFixed(2)}
                            </td>

                            <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                              {item.litterCarbon.toFixed(2)}
                            </td>

                            <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                              {item.soilCarbon.toFixed(2)}
                            </td>

                            <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400 text-sm">
                              {item.totalCarbon.toFixed(2)}
                            </td>

                            <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px]">
                              {item.accountingDate}
                            </td>

                            <td className="py-3.5 px-3 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setDetailStorage(item)}
                                  className="text-emerald-400 hover:text-emerald-300 hover:underline text-xs font-medium cursor-pointer"
                                >
                                  详情
                                </button>
                                <span className="text-slate-700">|</span>
                                <button
                                  type="button"
                                  onClick={() => triggerToast(`正在导出小班【${item.compartmentNo}】碳储量核算明细报表...`)}
                                  className="text-emerald-400 hover:text-emerald-300 hover:underline text-xs font-medium cursor-pointer"
                                >
                                  导出
                                </button>
                                <span className="text-slate-700">|</span>
                                <button
                                  type="button"
                                  onClick={() => setRecalculateRecord(item)}
                                  className="text-emerald-400 hover:text-emerald-300 hover:underline text-xs font-medium cursor-pointer"
                                >
                                  重新核算
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

              {/* Bottom Pagination */}
              <div className="p-4 border-t border-emerald-950 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400 font-sans">
                <div className="flex items-center gap-3">
                  <span>
                    共 <strong className="text-emerald-400 font-bold font-mono">2000</strong> 条数据
                  </span>
                  <span className="text-slate-600">|</span>
                  <div className="flex items-center gap-1.5">
                    <span>每页</span>
                    <select
                      value={storagePageSize}
                      onChange={(e) => {
                        setStoragePageSize(Number(e.target.value));
                        setStoragePage(1);
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
                    disabled={storagePage <= 1}
                    onClick={() => setStoragePage((prev) => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
                  >
                    &lt;
                  </button>

                  {[1, 2, 3, 4, 5].map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setStoragePage(pageNum)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors font-mono cursor-pointer ${
                        storagePage === pageNum
                          ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <span className="px-1 text-slate-600">...</span>

                  <button
                    type="button"
                    onClick={() => setStoragePage(20)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors font-mono cursor-pointer ${
                      storagePage === 20
                        ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    20
                  </button>

                  <button
                    type="button"
                    disabled={storagePage >= totalStoragePages}
                    onClick={() => setStoragePage((prev) => Math.min(totalStoragePages, prev + 1))}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
                  >
                    &gt;
                  </button>

                  <div className="flex items-center gap-1.5 ml-3 text-slate-400">
                    <span>跳转</span>
                    <input
                      type="text"
                      value={storageJumpInput}
                      onChange={(e) => setStorageJumpInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = Number(storageJumpInput);
                          if (!isNaN(val) && val >= 1 && val <= 20) {
                            setStoragePage(val);
                            triggerToast(`已跳转至第 ${val} 页`);
                          }
                        }
                      }}
                      className="w-10 h-6 bg-slate-900 border border-emerald-950 rounded text-center text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono"
                    />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 3: 碳汇计量 (按截图高保真生成) */}
        {activeTab === 'sink_meter' && (
          <>
            {/* CARD 1: Filter & Search Box */}
            <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-bold text-white tracking-wide">筛选搜索</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsSinkImportModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-lg text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>数据导入</span>
                  </button>
                </div>
              </div>

              {/* Form Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3 items-end">
                {/* 项目名称 */}
                <div className="lg:col-span-4">
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">项目名称</label>
                  <input
                    type="text"
                    placeholder="请输入项目名称或编号"
                    value={filterSinkName}
                    onChange={(e) => {
                      setFilterSinkName(e.target.value);
                      setSinkPage(1);
                    }}
                    className="w-full px-3 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* 核证状态 */}
                <div className="lg:col-span-3">
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">核证状态</label>
                  <select
                    value={filterCertStatus}
                    onChange={(e) => {
                      setFilterCertStatus(e.target.value);
                      setSinkPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    <option value="all">请选择</option>
                    <option value="待审定">待审定</option>
                    <option value="已核证">已核证</option>
                    <option value="已签发">已签发</option>
                  </select>
                </div>

                {/* 签发日期 */}
                <div className="lg:col-span-3">
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">签发日期</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="请选择日期范围"
                      value={filterIssueDate}
                      onChange={(e) => {
                        setFilterIssueDate(e.target.value);
                        setSinkPage(1);
                      }}
                      className="w-full pl-3 pr-8 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Search & Reset Buttons */}
                <div className="lg:col-span-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSinkPage(1)}
                    className="flex-1 py-1.5 px-3 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>搜索</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFilterSinkName('');
                      setFilterCertStatus('all');
                      setFilterIssueDate('');
                      setSinkPage(1);
                      triggerToast('已重置碳汇计量筛选条件');
                    }}
                    className="py-1.5 px-3 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: Data List Table Container */}
            <div className="bg-slate-950/90 border border-emerald-950/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
              {/* Table Header Strip */}
              <div className="px-5 py-3 border-b border-emerald-950 flex flex-wrap items-center justify-between gap-2 bg-slate-900/50">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-bold text-white tracking-wide">数据列表</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  共检索到 <strong className="text-emerald-400 font-bold">{filteredSinkRecords.length}</strong> 条碳汇计量项目记录
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-950 bg-slate-900/80 text-slate-400 font-medium">
                      <th className="py-3 px-3 w-12 text-center text-slate-500">序号</th>
                      <th className="py-3 px-3 min-w-[150px]">项目编号</th>
                      <th className="py-3 px-3 min-w-[180px]">项目名称</th>
                      <th className="py-3 px-3 min-w-[120px] text-right">项目边界面积 (hm²)</th>
                      <th className="py-3 px-3 min-w-[120px] text-right">基线期碳储量 (tCO₂e)</th>
                      <th className="py-3 px-3 min-w-[120px] text-right">项目期碳储量 (tCO₂e)</th>
                      <th className="py-3 px-3 min-w-[120px] text-right">碳储量变化量 (tCO₂e)</th>
                      <th className="py-3 px-3 min-w-[110px] text-right">净碳汇量 (tCO₂e)</th>
                      <th className="py-3 px-3 min-w-[90px] text-center">核证状态</th>
                      <th className="py-3 px-3 min-w-[110px]">签发日期</th>
                      <th className="py-3 px-3 min-w-[140px] text-center">操作</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/60">
                    {displayedSinkRecords.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-slate-500">
                          暂无符合条件的碳汇计量项目记录
                        </td>
                      </tr>
                    ) : (
                      displayedSinkRecords.map((item, idx) => {
                        const serialNo = (sinkPage - 1) * sinkPageSize + idx + 1;
                        return (
                          <tr
                            key={item.id}
                            className="transition-colors group hover:bg-emerald-950/30 text-slate-200"
                          >
                            <td className="py-3.5 px-3 text-center text-slate-500 font-mono">
                              {serialNo}
                            </td>

                            <td className="py-3.5 px-3 font-mono font-medium">
                              <span
                                className="text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer font-bold"
                                onClick={() => setDetailSink(item)}
                              >
                                {item.projectNo}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 font-medium text-slate-200">{item.projectName}</td>

                            <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                              {item.boundaryArea.toLocaleString()}
                            </td>

                            <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                              {item.baselineCarbon.toLocaleString()}
                            </td>

                            <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                              {item.projectCarbon.toLocaleString()}
                            </td>

                            <td className="py-3.5 px-3 text-right font-mono text-emerald-400 font-bold">
                              +{item.carbonChange}
                            </td>

                            <td className="py-3.5 px-3 text-right font-mono text-teal-300 font-bold">
                              {item.netSink}
                            </td>

                            <td className="py-3.5 px-3 text-center">
                              {item.certStatus === '待审定' ? (
                                <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-600/60">
                                  待审定
                                </span>
                              ) : item.certStatus === '已核证' ? (
                                <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-blue-950/80 text-blue-300 border border-blue-600/60">
                                  已核证
                                </span>
                              ) : (
                                <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/80">
                                  已签发
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px]">
                              {item.issueDate}
                            </td>

                            <td className="py-3.5 px-3 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setApplyAuditRecord(item);
                                    setAppliedVolume(String(item.netSink));
                                    setIsApplyAuditModalOpen(true);
                                  }}
                                  className="text-emerald-400 hover:text-emerald-300 hover:underline text-xs font-medium cursor-pointer"
                                >
                                  申请核定
                                </button>
                                <span className="text-slate-700">|</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCorrectionRecord({
                                      projectNo: item.projectNo,
                                      projectName: item.projectName,
                                      boundaryArea: item.boundaryArea || 563.00,
                                      baselineCarbon: item.baselineCarbon || 86.3,
                                      projectPeriodCarbon: item.projectCarbon || 186.4,
                                      emissionDeduction: -21.34,
                                      leakage: -15.34,
                                      permanenceDeduction: 10,
                                      netSink: Number(item.netSink) || 65.34,
                                    });
                                    setIsSinkCorrectionModalOpen(true);
                                  }}
                                  className="text-emerald-400 hover:text-emerald-300 hover:underline text-xs font-medium cursor-pointer"
                                >
                                  数据修正
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

              {/* Bottom Pagination */}
              <div className="p-4 border-t border-emerald-950 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400 font-sans">
                <div className="flex items-center gap-3">
                  <span>
                    共 <strong className="text-emerald-400 font-bold font-mono">2000</strong> 条数据
                  </span>
                  <span className="text-slate-600">|</span>
                  <div className="flex items-center gap-1.5">
                    <span>每页</span>
                    <select
                      value={sinkPageSize}
                      onChange={(e) => {
                        setSinkPageSize(Number(e.target.value));
                        setSinkPage(1);
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
                    disabled={sinkPage <= 1}
                    onClick={() => setSinkPage((prev) => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
                  >
                    &lt;
                  </button>

                  {[1, 2, 3, 4, 5].map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setSinkPage(pageNum)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors font-mono cursor-pointer ${
                        sinkPage === pageNum
                          ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <span className="px-1 text-slate-500">...</span>

                  <button
                    type="button"
                    onClick={() => setSinkPage(20)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
                  >
                    20
                  </button>

                  <button
                    type="button"
                    disabled={sinkPage >= totalSinkPages}
                    onClick={() => setSinkPage((prev) => Math.min(totalSinkPages, prev + 1))}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
                  >
                    &gt;
                  </button>

                  <div className="flex items-center gap-1.5 ml-3 text-slate-400">
                    <span>跳转至</span>
                    <input
                      type="text"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = Number((e.target as HTMLInputElement).value);
                          if (!isNaN(val) && val >= 1 && val <= 20) {
                            setSinkPage(val);
                            triggerToast(`已跳转至第 ${val} 页`);
                          }
                        }
                      }}
                      className="w-10 h-6 bg-slate-900 border border-emerald-950 rounded text-center text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono"
                    />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 4: 动态监测 (按截图高保真生成) */}
        {activeTab === 'dynamic_monitor' && (
          <div className="relative w-full h-[760px] rounded-2xl overflow-hidden border border-emerald-900/60 shadow-2xl bg-[#091a12] flex flex-col">
            {/* Simulated Satellite Map Background with Anhui Regional Overlays */}
            <div className="absolute inset-0 bg-cover bg-center opacity-85 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #113825 0%, #06140e 100%)' }}>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
              
              <div className="absolute top-[18%] left-[42%] px-4 py-2 bg-emerald-900/40 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-bold backdrop-blur-xs">
                阿坝藏族羌族自治州 (138.5 tCO₂e/hm²)
              </div>
              <div className="absolute top-[24%] left-[28%] px-4 py-2 bg-emerald-700/40 border border-emerald-400/40 rounded-lg text-emerald-200 text-xs font-bold backdrop-blur-xs">
                甘孜藏族自治州 (152.0 tCO₂e/hm²)
              </div>
              <div className="absolute top-[35%] left-[38%] px-4 py-2 bg-emerald-600/50 border border-emerald-400/50 rounded-lg text-white text-xs font-bold backdrop-blur-xs">
                绵阳市 (124.6 tCO₂e/hm²)
              </div>
              <div className="absolute top-[32%] left-[18%] px-4 py-2 bg-emerald-800/40 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-bold backdrop-blur-xs">
                阿坝州若尔盖湿地 (145.2 tCO₂e/hm²)
              </div>
              <div className="absolute top-[52%] left-[45%] px-4 py-2 bg-emerald-500/60 border border-emerald-300/60 rounded-lg text-white text-xs font-bold backdrop-blur-xs shadow-lg cursor-pointer" onClick={() => setIsForestDetailOpen(true)}>
                成都市中心监测网格 (110.3 tCO₂e/hm²)
              </div>
              <div className="absolute top-[68%] left-[25%] px-4 py-2 bg-emerald-700/50 border border-emerald-400/50 rounded-lg text-white text-xs font-bold backdrop-blur-xs">
                雅安市 (146.2 tCO₂e/hm²)
              </div>
              <div className="absolute top-[75%] left-[65%] px-4 py-2 bg-emerald-600/40 border border-emerald-400/40 rounded-lg text-white text-xs font-bold backdrop-blur-xs">
                凉山彝族自治州 (165.1 tCO₂e/hm²)
              </div>
            </div>

            {/* FLOATING TOP-LEFT: 碳储量分布图 / 林业用地统计 */}
            <div className="absolute top-4 left-4 z-20 w-[380px] bg-slate-950/90 border border-emerald-900/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-950">
                <span className="w-1 h-3.5 bg-emerald-500 rounded-full" />
                <span className="text-xs font-bold text-white tracking-wide">碳储量分布图</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold text-emerald-400">生态系统碳储量层级构成</div>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  总计: 48,560 tCO₂e
                </span>
              </div>

              {/* Proportional Stacked Progress Bar */}
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-emerald-950">
                  <div className="bg-emerald-500 rounded-l-full h-full" style={{ width: '66.2%' }} title="乔木林 66.2%" />
                  <div className="bg-teal-400 h-full" style={{ width: '23.6%' }} title="竹林生态 23.6%" />
                  <div className="bg-amber-500 rounded-r-full h-full" style={{ width: '10.2%' }} title="灌木与草地 10.2%" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>乔木林 66.2%</span>
                  <span>竹林 23.6%</span>
                  <span>灌草 10.2%</span>
                </div>
              </div>

              {/* Detailed Breakdown List */}
              <div className="space-y-2 pt-1">
                <div className="bg-slate-900/80 border border-emerald-950/70 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-slate-300">乔木林碳储量</span>
                  </div>
                  <div className="font-mono font-bold text-emerald-400">32,150 tCO₂e</div>
                </div>

                <div className="bg-slate-900/80 border border-emerald-950/70 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="text-slate-300">竹林生态碳储量</span>
                  </div>
                  <div className="font-mono font-bold text-teal-300">11,480 tCO₂e</div>
                </div>

                <div className="bg-slate-900/80 border border-emerald-950/70 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-slate-300">灌木与草地碳储量</span>
                  </div>
                  <div className="font-mono font-bold text-amber-400">4,930 tCO₂e</div>
                </div>
              </div>
            </div>

            {/* FLOATING TOP-RIGHT: 碳储量统计 Chart Card */}
            <div className="absolute top-4 right-4 z-20 w-[380px] bg-slate-950/90 border border-emerald-900/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-950">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-emerald-500 rounded-full" />
                  <span className="text-xs font-bold text-white tracking-wide">碳储量统计</span>
                </div>
                <select
                  value={monitorYear}
                  onChange={(e) => setMonitorYear(e.target.value)}
                  className="px-2 py-1 bg-slate-900 border border-emerald-950 rounded text-slate-200 text-[11px] outline-none font-mono cursor-pointer"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="text-emerald-400 font-medium">季度碳储量增长监测</span>
                <span className="text-[10px] font-mono text-slate-400">单位: tCO₂e</span>
              </div>

              {/* Quarterly Breakdown Bars */}
              <div className="space-y-2.5 pt-1">
                {[
                  { quarter: '第一季度', volume: 12450, percentage: 65, color: 'bg-emerald-500' },
                  { quarter: '第二季度', volume: 14800, percentage: 78, color: 'bg-teal-400' },
                  { quarter: '第三季度', volume: 16300, percentage: 88, color: 'bg-emerald-400' },
                  { quarter: '第四季度(预测)', volume: 18200, percentage: 98, color: 'bg-teal-300' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-900/90 border border-emerald-950/80 rounded-xl p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.quarter}</span>
                      <span className="font-mono font-bold text-emerald-400">{item.volume.toLocaleString()} tCO₂e</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FLOATING BOTTOM-LEFT: 碳储量密度 Legend */}
            <div className="absolute bottom-4 left-4 z-20 w-44 bg-slate-950/90 border border-emerald-900/80 rounded-xl p-3 shadow-2xl backdrop-blur-md space-y-2">
              <div className="text-[11px] font-bold text-white mb-1">碳储量密度</div>
              <div className="space-y-1 text-[10px] text-slate-300 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3 bg-emerald-950 border border-emerald-800 rounded-xs" />
                  <span>&gt; 150</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3 bg-emerald-900 border border-emerald-700 rounded-xs" />
                  <span>120 ~ 150</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3 bg-emerald-700 border border-emerald-600 rounded-xs" />
                  <span>100 ~ 120</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3 bg-emerald-600 border border-emerald-500 rounded-xs" />
                  <span>80 ~ 100</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3 bg-emerald-500 border border-emerald-400 rounded-xs" />
                  <span>60 ~ 80</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3 bg-teal-500 border border-teal-400 rounded-xs" />
                  <span>40 ~ 60</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3 bg-lime-600 border border-lime-500 rounded-xs" />
                  <span>20 ~ 40</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3 bg-amber-600 border border-amber-500 rounded-xs" />
                  <span>&lt; 20</span>
                </div>
              </div>
            </div>

            {/* CENTER-RIGHT FLOATING POPUP: 林详情 */}
            {isForestDetailOpen && (
              <div className="absolute top-1/2 right-1/4 -translate-y-1/2 z-30 w-80 bg-slate-900/95 border border-emerald-500/50 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden text-xs font-sans">
                <div className="px-4 py-3 bg-slate-950/90 border-b border-emerald-900/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-3.5 bg-emerald-500 rounded-full" />
                    <span className="font-bold text-white">林详情</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsForestDetailOpen(false)}
                    className="text-slate-400 hover:text-white cursor-pointer p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3 text-slate-200">
                  <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">碳储量:</span>
                    <span className="font-mono font-bold text-emerald-400">451 tCO₂e</span>
                  </div>

                  <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">碳密度:</span>
                    <span className="font-mono text-slate-200">110.3 tCO₂e/hm²</span>
                  </div>

                  <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">变化:</span>
                    <span className="font-mono text-emerald-400 font-bold">+3.2% (较去年)</span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-slate-400">主要碳库:</span>
                    <span className="font-medium text-slate-200">地上生物量 64%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: 手动录入碳价 Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-950 rounded-2xl shadow-2xl max-w-md w-full border border-emerald-900 overflow-hidden">
            <div className="px-5 py-4 bg-slate-900/90 text-white flex items-center justify-between border-b border-emerald-950">
              <span className="font-bold text-sm text-emerald-300">手动录入碳价数据</span>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManualRecord} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">价格类型</label>
                <select
                  value={manualForm.priceType}
                  onChange={(e) => setManualForm({ ...manualForm, priceType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 border border-emerald-950 rounded-lg text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="市场价">市场价</option>
                  <option value="指导价">指导价</option>
                  <option value="挂牌价">挂牌价</option>
                  <option value="协议价">协议价</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">碳市场 / 来源</label>
                <select
                  value={manualForm.marketSource}
                  onChange={(e) => setManualForm({ ...manualForm, marketSource: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 border border-emerald-950 rounded-lg text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="全国碳市场">全国碳市场</option>
                  <option value="北京绿交所">北京绿交所</option>
                  <option value="广东碳汇市场">广东碳汇市场</option>
                  <option value="CCER">CCER</option>
                  <option value="海峡股权交易中心">海峡股权交易中心</option>
                  <option value="四川碳交所">四川碳交所</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">碳单价 (元/tCO₂e)</label>
                <input
                  type="number"
                  placeholder="例如: 55"
                  value={manualForm.unitPrice}
                  onChange={(e) => setManualForm({ ...manualForm, unitPrice: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-emerald-950 rounded-lg text-slate-100 outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">价格生效日期</label>
                <input
                  type="date"
                  value={manualForm.priceDate}
                  onChange={(e) => setManualForm({ ...manualForm, priceDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-emerald-950 rounded-lg text-slate-100 outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">数据状态</label>
                <select
                  value={manualForm.status}
                  onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 border border-emerald-950 rounded-lg text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="生效中">生效中</option>
                  <option value="已过期">已过期</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-emerald-950">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-md cursor-pointer"
                >
                  保存录入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: 批量导入 Modal */}
      {isBatchImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-950 rounded-2xl shadow-2xl max-w-md w-full border border-emerald-900 overflow-hidden">
            <div className="px-5 py-4 bg-slate-900/90 text-white flex items-center justify-between border-b border-emerald-950">
              <span className="font-bold text-sm text-emerald-300">批量导入碳价列表</span>
              <button
                type="button"
                onClick={() => setIsBatchImportModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-8 border-2 border-dashed border-emerald-900/80 hover:border-emerald-500 rounded-xl text-center bg-slate-900/60 transition-colors cursor-pointer space-y-2">
                <Upload className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <div className="font-bold text-slate-200">点击上传或将 Excel/CSV 文件拖拽至此处</div>
                <div className="text-[11px] text-slate-500">支持 .xlsx, .xls, .csv 格式 (单次上限 50MB)</div>
              </div>

              <div className="p-3 bg-emerald-950/60 rounded-lg border border-emerald-800 flex items-center justify-between text-emerald-300 text-[11px]">
                <span>首次导入？下载碳价标准导入模板文件</span>
                <button
                  type="button"
                  onClick={() => triggerToast('正在为您下载「碳价数据导入标准模板_V2.xlsx」')}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  下载模板
                </button>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-emerald-950">
                <button
                  type="button"
                  onClick={() => setIsBatchImportModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsBatchImportModalOpen(false);
                    triggerToast('批量数据解析导入成功！已更新 2000 条历史碳价数据');
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-md cursor-pointer"
                >
                  确认解析导入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 编辑 Modal (按最新截图高保真生成) */}
      {editRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#091a13] rounded-2xl shadow-2xl max-w-xl w-full border border-emerald-500/40 overflow-hidden text-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-emerald-900/60 flex items-center justify-between bg-[#0a1f17]">
              <span className="font-semibold text-base text-emerald-300">编辑碳价记录</span>
              <button
                type="button"
                onClick={() => setEditRecord(null)}
                className="text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors cursor-pointer p-1 rounded-lg"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRecords((prev) => prev.map((r) => (r.id === editRecord.id ? editRecord : r)));
                triggerToast(`记录【${editRecord.priceNo}】修改成功！`);
                setEditRecord(null);
              }}
              className="p-6 space-y-4 text-xs font-sans bg-[#061710]"
            >
              {/* Field 1: 价格编号 (Disabled Read-only) */}
              <div className="flex items-center">
                <label className="w-28 text-right pr-3 text-slate-300 font-medium shrink-0">
                  价格编号
                </label>
                <input
                  type="text"
                  value={editRecord.priceNo}
                  disabled
                  className="flex-1 px-3 py-2 bg-slate-900 text-slate-400 border border-slate-800 rounded text-xs outline-none cursor-not-allowed font-mono"
                />
              </div>

              {/* Field 2: 价格类型 */}
              <div className="flex items-center">
                <label className="w-28 text-right pr-3 text-slate-300 font-medium shrink-0">
                  <span className="text-rose-400 mr-1">*</span>价格类型
                </label>
                <select
                  value={editRecord.priceType}
                  onChange={(e) => setEditRecord({ ...editRecord, priceType: e.target.value as any })}
                  className="flex-1 px-3 py-2 bg-slate-900/90 text-slate-100 border border-emerald-900/60 rounded text-xs outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  required
                >
                  <option value="市场价">市场价</option>
                  <option value="指导价">指导价</option>
                  <option value="挂牌价">挂牌价</option>
                  <option value="协议价">协议价</option>
                </select>
              </div>

              {/* Field 3: 碳市场/来源 */}
              <div className="flex items-center">
                <label className="w-28 text-right pr-3 text-slate-300 font-medium shrink-0">
                  <span className="text-rose-400 mr-1">*</span>碳市场/来源
                </label>
                <select
                  value={editRecord.marketSource}
                  onChange={(e) => setEditRecord({ ...editRecord, marketSource: e.target.value as any })}
                  className="flex-1 px-3 py-2 bg-slate-900/90 text-slate-100 border border-emerald-900/60 rounded text-xs outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  required
                >
                  <option value="全国碳市场">全国碳市场</option>
                  <option value="北京绿交所">北京绿交所</option>
                  <option value="广东碳汇市场">广东碳汇市场</option>
                  <option value="CCER">CCER</option>
                  <option value="海峡股权交易中心">海峡股权交易中心</option>
                  <option value="四川碳交所">四川碳交所</option>
                  <option value="重庆碳交所">重庆碳交所</option>
                </select>
              </div>

              {/* Field 4: 碳单价 (with Suffix Box) */}
              <div className="flex items-center">
                <label className="w-28 text-right pr-3 text-slate-300 font-medium shrink-0">
                  <span className="text-rose-400 mr-1">*</span>碳单价
                </label>
                <div className="flex-1 flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500 transition-colors">
                  <input
                    type="number"
                    step="0.01"
                    value={editRecord.unitPrice}
                    onChange={(e) => setEditRecord({ ...editRecord, unitPrice: Number(e.target.value) })}
                    className="flex-1 px-3 py-2 bg-slate-900/90 text-slate-100 text-xs outline-none font-mono"
                    required
                  />
                  <span className="bg-slate-950 px-3 py-2 text-slate-400 text-xs border-l border-emerald-900/60 flex items-center shrink-0 font-mono">
                    元/tCO2e
                  </span>
                </div>
              </div>

              {/* Field 5: 价格日期 */}
              <div className="flex items-center">
                <label className="w-28 text-right pr-3 text-slate-300 font-medium shrink-0">
                  <span className="text-rose-400 mr-1">*</span>价格日期
                </label>
                <input
                  type="date"
                  value={editRecord.priceDate}
                  onChange={(e) => setEditRecord({ ...editRecord, priceDate: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-900/90 text-slate-100 border border-emerald-900/60 rounded text-xs outline-none focus:border-emerald-500 font-mono transition-colors cursor-pointer"
                  required
                />
              </div>

              {/* Field 6: 数据来源 */}
              <div className="flex items-center">
                <label className="w-28 text-right pr-3 text-slate-300 font-medium shrink-0">
                  <span className="text-rose-400 mr-1">*</span>数据来源
                </label>
                <select
                  value={editRecord.dataSource}
                  onChange={(e) => setEditRecord({ ...editRecord, dataSource: e.target.value as any })}
                  className="flex-1 px-3 py-2 bg-slate-900/90 text-slate-100 border border-emerald-900/60 rounded text-xs outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  required
                >
                  <option value="交易所API">交易所API</option>
                  <option value="人工录入">人工录入</option>
                  <option value="国家监测网">国家监测网</option>
                </select>
              </div>

              {/* Field 7: 状态 (Radio Group matching screenshot) */}
              <div className="flex items-center">
                <label className="w-28 text-right pr-3 text-slate-300 font-medium shrink-0">
                  <span className="text-rose-400 mr-1">*</span>状态
                </label>
                <div className="flex-1 flex items-center gap-6 py-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="editStatus"
                      checked={editRecord.status === '生效中'}
                      onChange={() => setEditRecord({ ...editRecord, status: '生效中' })}
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span
                      className={`text-xs transition-colors ${
                        editRecord.status === '生效中' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      生效中
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="editStatus"
                      checked={editRecord.status === '已过期'}
                      onChange={() => setEditRecord({ ...editRecord, status: '已过期' })}
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span
                      className={`text-xs transition-colors ${
                        editRecord.status === '已过期' ? 'text-rose-400 font-medium' : 'text-slate-400'
                      }`}
                    >
                      已过期
                    </span>
                  </label>
                </div>
              </div>

              {/* Centered Submit Button */}
              <div className="pt-5 flex justify-center">
                <button
                  type="submit"
                  className="px-10 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer active:scale-95"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: 删除确认 */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-950 rounded-2xl shadow-2xl max-w-xs w-full p-5 border border-emerald-900 text-center space-y-4">
            <div className="text-sm font-bold text-white">确定要删除该条碳价数据吗？</div>
            <div className="text-xs text-slate-400">删除后不可恢复，请确认操作。</div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 详情 (Centered Modal) */}
      {detailRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-900 overflow-hidden max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-emerald-900/80 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">详情</span>
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  编号: {detailRecord.priceNo}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDetailRecord(null)}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                title="关闭详情"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#06140e]">
              {/* Basic Info Box */}
              <div className="border border-emerald-900/80 rounded-xl p-5 bg-slate-950/90 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-950">
                  <span className="w-1 h-3.5 bg-emerald-500 rounded-full" />
                  <span className="text-xs font-bold text-white tracking-wide">基本信息</span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed font-sans">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[85px] text-right">价格编号：</span>
                    <span className="font-mono text-emerald-400 font-bold">{detailRecord.priceNo}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[85px] text-right">价格类型：</span>
                    <span className="text-slate-200 font-medium">{detailRecord.priceType}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[85px] text-right">碳市场/来源：</span>
                    <span className="text-slate-200 font-medium">{detailRecord.marketSource}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[85px] text-right">碳单价：</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      {detailRecord.unitPrice.toFixed(2)} 元/tCO2e
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[85px] text-right">价格日期：</span>
                    <span className="font-mono text-slate-200">{detailRecord.priceDate}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[85px] text-right">数据来源：</span>
                    <span className="text-slate-200">{detailRecord.dataSource}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[85px] text-right">状态：</span>
                    {detailRecord.status === '生效中' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/90 text-emerald-300 border border-emerald-500/80">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        生效中
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-950/80 text-rose-300 border border-rose-600/60">
                        <AlertCircle className="w-3 h-3 text-rose-400" />
                        已过期
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[85px] text-right">采集时间：</span>
                    <span className="font-mono text-slate-200">{detailRecord.gatherTime}</span>
                  </div>

                  <div className="pt-2">
                    <div className="text-slate-400 mb-1.5 pl-[12px]">备注：</div>
                    <div className="text-slate-300 text-[11px] leading-relaxed break-all p-3.5 rounded-lg border border-emerald-950 bg-slate-900/90 font-sans">
                      {detailRecord.marketSource === '全国碳市场' || detailRecord.marketSource.includes('CEA')
                        ? `该价格系全国碳排放权交易市场（CEA）当日挂牌协议交易与大宗交易综合加权平均收盘价格，由上海环境能源交易所官方数据接口（Restful API）于收盘后自动同步，符合国家自愿减排（CCER）林业碳汇资产评估与价值转换计算标准（LY/T 3253-2021）。`
                        : detailRecord.marketSource === '北京绿交所'
                        ? `北京绿色交易所碳排放配额及林业碳汇挂牌撮合加权指导价，数据经由绿交所数据交换专线认证，作为北方林区（如长白山、燕山山脉）生态碳汇资产质押融资与绿色信贷抵押评估的权威基准价。`
                        : detailRecord.marketSource === '广东碳汇市场'
                        ? `广东省碳排放配额（GDEA）及生态碳普惠项目市场成交均价，符合《广东省森林碳汇碳普惠方法学》，数据由省碳排放权交易中心结算系统自动采集归档，全网可追溯。`
                        : detailRecord.marketSource === 'CCER'
                        ? `国家温室气体自愿减排交易注册登记系统挂牌核证减排量（CCER）现货均价，用于全国碳市场履约清缴抵销（抵销比例不超过5%），具有国家法定碳资产效力。`
                        : `本数据系经由 ${detailRecord.dataSource} 抓取同步的 ${detailRecord.marketSource} 现货成交结算参考价格，归档流水编号 ${detailRecord.priceNo}，可作为林业碳汇资产公允价值估算与经济评估依据。`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Box 2 */}
              <div className="border border-emerald-900/80 rounded-xl p-5 bg-slate-950/90 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-950">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>市场行情与国密数字存证</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400/80">
                    存证区块链: 绿碳存证链-V2
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/90 rounded border border-emerald-950">
                    <div className="text-[11px] text-slate-400 mb-0.5">当日参考成交量</div>
                    <div className="font-mono font-bold text-white text-sm">
                      {(detailRecord.unitPrice * 2350).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">tCO₂e</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded border border-emerald-950">
                    <div className="text-[11px] text-slate-400 mb-0.5">估算参考成交额</div>
                    <div className="font-mono font-bold text-emerald-400 text-sm">
                      ￥{(detailRecord.unitPrice * 2350 * detailRecord.unitPrice).toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded border border-emerald-950 text-[10px] font-mono text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">存证哈希 (SM3):</span>
                    <span className="text-emerald-400">0x9f8a{detailRecord.priceNo}c39e8f7a21</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">核算导则标准:</span>
                    <span className="text-slate-300">LY/T 3253-2021 生态碳汇估值</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-900/90 border-t border-emerald-950 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailRecord(null)}
                className="px-5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 碳储量小班详情 (Centered Modal) */}
      {detailStorage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-950 rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-900 overflow-hidden max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-emerald-900/80 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">小班项目详情</span>
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  {detailStorage.compartmentNo}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDetailStorage(null)}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                title="关闭详情"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#06140e]">
              {/* Basic Info Box */}
              <div className="border border-emerald-900/80 rounded-xl p-5 bg-slate-950/90 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-950">
                  <span className="w-1 h-3.5 bg-emerald-500 rounded-full" />
                  <span className="text-xs font-bold text-white tracking-wide">小班空间与林分基本参数</span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed font-sans">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[95px] text-right">小班编号：</span>
                    <span className="font-mono text-emerald-400 font-bold">{detailStorage.compartmentNo}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[95px] text-right">林种类型：</span>
                    <span className="text-slate-200 font-medium">{detailStorage.forestType}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[95px] text-right">林业面积：</span>
                    <span className="font-mono text-slate-200 font-bold">{detailStorage.area.toFixed(2)} hm²</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[95px] text-right">单位蓄积量：</span>
                    <span className="font-mono text-slate-200 font-bold">{detailStorage.growingStock.toFixed(1)} m³/hm²</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[95px] text-right">地上生物量碳：</span>
                    <span className="font-mono text-emerald-400 font-bold">{detailStorage.aboveGroundCarbon.toFixed(2)} tCO₂e</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[95px] text-right">地下生物量碳：</span>
                    <span className="font-mono text-teal-400 font-bold">{detailStorage.belowGroundCarbon.toFixed(2)} tCO₂e</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[95px] text-right">枯落物碳：</span>
                    <span className="font-mono text-slate-200">{detailStorage.litterCarbon.toFixed(2)} tCO₂e</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[95px] text-right">土壤有机碳：</span>
                    <span className="font-mono text-slate-200">{detailStorage.soilCarbon.toFixed(2)} tCO₂e</span>
                  </div>

                  <div className="flex items-baseline gap-2 pt-2 border-t border-emerald-950">
                    <span className="text-slate-400 min-w-[95px] text-right font-bold text-emerald-300">总碳储量：</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">{detailStorage.totalCarbon.toFixed(2)} tCO₂e</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 min-w-[95px] text-right">核算日期：</span>
                    <span className="font-mono text-slate-200">{detailStorage.accountingDate}</span>
                  </div>

                  <div className="pt-2">
                    <div className="text-slate-400 mb-1.5 pl-[12px]">空间遥感与反演模型说明：</div>
                    <div className="text-slate-300 text-[11px] leading-relaxed break-all p-3.5 rounded-lg border border-emerald-950 bg-slate-900/90 font-sans">
                      该小班基于高分六号（GF-6）卫星多光谱遥感影像与L波段机载激光雷达（LiDAR）三维点云数据联合反演。生物量估算采用IPCC国家温室气体清单指南通用方法学（2006）及生物量转换因子连续函数（BEF），土壤有机碳依据0-30cm土层实测土壤容重及有机质含量计算，误差控制在±3.2%以内。
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Box 2: 经济价值评估 */}
              <div className="border border-emerald-900/80 rounded-xl p-5 bg-slate-950/90 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-950">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>碳资产公允价值估算</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400/80">
                    基准碳价: 52.00 元/tCO₂e
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/90 rounded border border-emerald-950">
                    <div className="text-[11px] text-slate-400 mb-0.5">潜在碳汇经济价值</div>
                    <div className="font-mono font-bold text-emerald-400 text-sm">
                      ￥{(detailStorage.totalCarbon * 52).toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded border border-emerald-950">
                    <div className="text-[11px] text-slate-400 mb-0.5">碳资产质押授信额 (70%)</div>
                    <div className="font-mono font-bold text-teal-300 text-sm">
                      ￥{(detailStorage.totalCarbon * 52 * 0.7).toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded border border-emerald-950 text-[10px] font-mono text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">小班矢量区划代码:</span>
                    <span className="text-emerald-400">{detailStorage.compartmentNo}-CN</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">权属类型:</span>
                    <span className="text-slate-300">国有林场 / 生态公益林</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-900/90 border-t border-emerald-950 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailStorage(null)}
                className="px-5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 重新核算 (Recalculate Modal matching screenshot) */}
      {recalculateRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-[#091a13] rounded-2xl shadow-2xl max-w-4xl w-full border border-emerald-500/40 overflow-hidden text-slate-200 my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-emerald-900/60 flex items-center justify-between bg-[#0a1f17]">
              <span className="font-semibold text-base text-emerald-300">重新核算碳储量</span>
              <button
                type="button"
                onClick={() => setRecalculateRecord(null)}
                className="text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors cursor-pointer p-1 rounded-lg"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStorageRecords((prev) =>
                  prev.map((s) => (s.id === recalculateRecord.id ? recalculateRecord : s))
                );
                triggerToast(`小班【${recalculateRecord.compartmentNo}】重新核算成功并已更新！`);
                setRecalculateRecord(null);
              }}
              className="p-6 space-y-6 text-xs font-sans max-h-[80vh] overflow-y-auto bg-[#061710]"
            >
              {/* SECTION 1: 林业信息 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/40">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full" />
                  <span className="text-xs font-bold text-emerald-400">林业信息</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-slate-300 bg-slate-950/70 p-4 rounded-xl border border-emerald-900/50">
                  <div className="flex items-center justify-between py-1 border-b border-emerald-900/40">
                    <span className="text-slate-400">小班编号:</span>
                    <span className="font-mono font-bold text-slate-100">{recalculateRecord.compartmentNo}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-emerald-900/40">
                    <span className="text-slate-400">林种:</span>
                    <span className="font-medium text-slate-100">{recalculateRecord.forestType}-中龄林</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-emerald-900/40">
                    <span className="text-slate-400">林业面积:</span>
                    <span className="font-mono text-slate-100">{recalculateRecord.area}hm²</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-emerald-900/40">
                    <span className="text-slate-400">蓄积量:</span>
                    <span className="font-mono text-slate-100">{recalculateRecord.growingStock} m³/hm²</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-emerald-900/40">
                    <span className="text-slate-400">生物量转换因子:</span>
                    <span className="font-mono text-slate-100">2.25</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-emerald-900/40">
                    <span className="text-slate-400">含碳率:</span>
                    <span className="font-mono text-slate-100">0.50</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-emerald-900/40">
                    <span className="text-slate-400">土壤有机碳含量:</span>
                    <span className="font-mono text-slate-100">2.8%</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-emerald-900/40">
                    <span className="text-slate-400">土层厚度:</span>
                    <span className="font-mono text-slate-100">30cm</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">土壤容重:</span>
                    <span className="font-mono text-slate-100">1.3 g/cm³</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">面积:</span>
                    <span className="font-mono text-slate-100">{(recalculateRecord.area * 1.26).toFixed(2)}hm²</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 核算模型 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/40">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full" />
                  <span className="text-xs font-bold text-emerald-400">核算模型</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Card 1: IPCC */}
                  <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-950/60 space-y-2 relative shadow-sm">
                    <div className="font-bold text-emerald-300 text-xs">IPCC</div>
                    <div className="font-mono text-[11px] text-slate-400">2006</div>
                    <div className="text-[10px] text-slate-300 leading-relaxed font-sans">
                      联合国政府间气候变化专门委员会国家温室气体清单指南，适用于全球森林生态系统碳储量基准评估与各碳库估算。
                    </div>
                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">✓</div>
                  </div>

                  {/* Card 2: CCER */}
                  <div className="p-4 rounded-xl border border-emerald-900/60 bg-slate-950/70 space-y-2 hover:border-emerald-500 transition-colors cursor-pointer">
                    <div className="font-bold text-slate-200 text-xs">CCER</div>
                    <div className="font-mono text-[11px] text-slate-400">AR-CM-001-V01</div>
                    <div className="text-[10px] text-slate-400 leading-relaxed font-sans">
                      中国温室气体自愿减排造林碳汇项目方法学，结合我国林分生长模型与实测生物量方程进行精准计量。
                    </div>
                  </div>

                  {/* Card 3: VCS */}
                  <div className="p-4 rounded-xl border border-emerald-900/60 bg-slate-950/70 space-y-2 hover:border-emerald-500 transition-colors cursor-pointer">
                    <div className="font-bold text-slate-200 text-xs">VCS</div>
                    <div className="font-mono text-[11px] text-slate-400">VM0033</div>
                    <div className="text-[10px] text-slate-400 leading-relaxed font-sans">
                      Verified Carbon Standard 国际核证碳标准群落与土壤碳汇计量方法，采用高精度遥感影像与地面样地联合反演。
                    </div>
                  </div>

                  {/* Card 4: Action Box with Calculate button */}
                  <div className="p-4 rounded-xl border border-dashed border-emerald-700 bg-emerald-950/40 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-900/80 flex items-center justify-center text-emerald-400">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const randFactor = 0.98 + Math.random() * 0.04;
                        setRecalculateRecord({
                          ...recalculateRecord,
                          aboveGroundCarbon: Number((recalculateRecord.aboveGroundCarbon * randFactor).toFixed(2)),
                          belowGroundCarbon: Number((recalculateRecord.belowGroundCarbon * randFactor).toFixed(2)),
                          totalCarbon: Number((recalculateRecord.totalCarbon * randFactor).toFixed(2)),
                        });
                        triggerToast('模型核算运算完成！最新测算结果已填充');
                      }}
                      className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow transition-colors cursor-pointer"
                    >
                      核算
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 3: 核算结果 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/40">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full" />
                  <span className="text-xs font-bold text-emerald-400">核算结果</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 text-center">地上生物量碳</label>
                    <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                      <input
                        type="number"
                        step="0.01"
                        value={recalculateRecord.aboveGroundCarbon}
                        onChange={(e) =>
                          setRecalculateRecord({ ...recalculateRecord, aboveGroundCarbon: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-2 bg-slate-900/90 text-slate-100 text-xs font-mono text-center outline-none"
                      />
                      <span className="bg-slate-950 px-2 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center">
                        tCO₂e
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 text-center">地下生物量碳</label>
                    <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                      <input
                        type="number"
                        step="0.01"
                        value={recalculateRecord.belowGroundCarbon}
                        onChange={(e) =>
                          setRecalculateRecord({ ...recalculateRecord, belowGroundCarbon: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-2 bg-slate-900/90 text-slate-100 text-xs font-mono text-center outline-none"
                      />
                      <span className="bg-slate-950 px-2 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center">
                        tCO₂e
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 text-center">枯落物碳</label>
                    <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                      <input
                        type="number"
                        step="0.01"
                        value={recalculateRecord.litterCarbon}
                        onChange={(e) =>
                          setRecalculateRecord({ ...recalculateRecord, litterCarbon: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-2 bg-slate-900/90 text-slate-100 text-xs font-mono text-center outline-none"
                      />
                      <span className="bg-slate-950 px-2 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center">
                        tCO₂e
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 text-center">土壤有机碳</label>
                    <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                      <input
                        type="number"
                        step="0.01"
                        value={recalculateRecord.soilCarbon}
                        onChange={(e) =>
                          setRecalculateRecord({ ...recalculateRecord, soilCarbon: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-2 bg-slate-900/90 text-slate-100 text-xs font-mono text-center outline-none"
                      />
                      <span className="bg-slate-950 px-2 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center">
                        tCO₂e
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 text-center">总碳储量</label>
                    <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                      <input
                        type="number"
                        step="0.01"
                        value={recalculateRecord.totalCarbon}
                        onChange={(e) =>
                          setRecalculateRecord({ ...recalculateRecord, totalCarbon: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-2 bg-slate-900/90 text-emerald-400 font-bold text-xs font-mono text-center outline-none"
                      />
                      <span className="bg-slate-950 px-2 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center">
                        tCO₂e
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="px-12 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer active:scale-95"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 碳储量数据导入 (Real file selection) */}
      {isStorageImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#091a13] rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-500/40 overflow-hidden text-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-emerald-900/60 flex items-center justify-between bg-[#0a1f17]">
              <span className="font-semibold text-base text-emerald-300">碳储量数据导入</span>
              <button
                type="button"
                onClick={() => {
                  setIsStorageImportModalOpen(false);
                  setStorageSelectedFile(null);
                }}
                className="text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors cursor-pointer p-1 rounded-lg"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 text-xs font-sans bg-[#061710]">
              <div className="text-slate-300 text-xs">
                国家林草局森林资源管理系统下载林业资源数据，上传文件格式为：xls、xlsx
              </div>

              <input
                type="file"
                ref={storageFileRef}
                className="hidden"
                accept=".xls,.xlsx,.csv"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setStorageSelectedFile(e.target.files[0]);
                    triggerToast(`已选择文件: ${e.target.files[0].name}`);
                  }
                }}
              />

              {/* Upload Dropzone Box */}
              <div
                onClick={() => storageFileRef.current?.click()}
                className="p-12 border-2 border-dashed border-emerald-900/60 hover:border-emerald-500 rounded-xl bg-slate-950/70 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-colors"
              >
                <div className="w-16 h-16 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 shadow-sm">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  {storageSelectedFile ? (
                    <div className="text-emerald-400 font-bold text-xs flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>已选择文件: {storageSelectedFile.name}</span>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs">点击此处或点击下方按钮选择本地文件</div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      storageFileRef.current?.click();
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-emerald-950/80 border border-emerald-900/60 rounded-lg shadow-sm text-slate-200 font-medium text-xs transition-colors cursor-pointer"
                  >
                    选择文件
                  </button>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsStorageImportModalOpen(false);
                    setStorageSelectedFile(null);
                  }}
                  className="px-8 py-2 bg-slate-900 hover:bg-slate-800 border border-emerald-900/60 rounded-lg text-slate-300 font-medium text-xs shadow-sm cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!storageSelectedFile) {
                      triggerToast('请先选择要导入的 Excel 文件 (.xls/.xlsx)');
                      return;
                    }
                    setIsStorageImportModalOpen(false);
                    triggerToast(`文件【${storageSelectedFile.name}】数据导入成功！已更新小班碳储量核算表`);
                    setStorageSelectedFile(null);
                  }}
                  className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 碳汇计量数据导入 (Real file selection) */}
      {isSinkImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#091a13] rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-500/40 overflow-hidden text-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-emerald-900/60 flex items-center justify-between bg-[#0a1f17]">
              <span className="font-semibold text-base text-emerald-300">碳汇计量数据导入</span>
              <button
                type="button"
                onClick={() => {
                  setIsSinkImportModalOpen(false);
                  setSinkSelectedFile(null);
                }}
                className="text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors cursor-pointer p-1 rounded-lg"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 text-xs font-sans bg-[#061710]">
              <div className="text-slate-300 text-xs">
                国家林草局森林资源管理系统下载碳汇计量与核证数据，上传文件格式为：xls、xlsx
              </div>

              <input
                type="file"
                ref={sinkFileRef}
                className="hidden"
                accept=".xls,.xlsx,.csv"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setSinkSelectedFile(e.target.files[0]);
                    triggerToast(`已选择文件: ${e.target.files[0].name}`);
                  }
                }}
              />

              {/* Upload Dropzone Box */}
              <div
                onClick={() => sinkFileRef.current?.click()}
                className="p-12 border-2 border-dashed border-emerald-900/60 hover:border-emerald-500 rounded-xl bg-slate-950/70 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-colors"
              >
                <div className="w-16 h-16 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 shadow-sm">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  {sinkSelectedFile ? (
                    <div className="text-emerald-400 font-bold text-xs flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>已选择文件: {sinkSelectedFile.name}</span>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs">点击此处或点击下方按钮选择本地文件</div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sinkFileRef.current?.click();
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-emerald-950/80 border border-emerald-900/60 rounded-lg shadow-sm text-slate-200 font-medium text-xs transition-colors cursor-pointer"
                  >
                    选择文件
                  </button>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSinkImportModalOpen(false);
                    setSinkSelectedFile(null);
                  }}
                  className="px-8 py-2 bg-slate-900 hover:bg-slate-800 border border-emerald-900/60 rounded-lg text-slate-300 font-medium text-xs shadow-sm cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!sinkSelectedFile) {
                      triggerToast('请先选择要导入的 Excel 文件 (.xls/.xlsx)');
                      return;
                    }
                    setIsSinkImportModalOpen(false);
                    triggerToast(`文件【${sinkSelectedFile.name}】碳汇计量数据批量导入成功！`);
                    setSinkSelectedFile(null);
                  }}
                  className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 碳汇计量项目详情 (Matching uploaded screenshot) */}
      {detailSink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#091a13] rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-500/40 overflow-hidden text-slate-200 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-emerald-900/60 flex items-center justify-between bg-[#0a1f17]">
              <span className="font-semibold text-base text-emerald-300">碳汇计量项目详情</span>
              <button
                type="button"
                onClick={() => setDetailSink(null)}
                className="text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors cursor-pointer p-1 rounded-lg"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-sans bg-[#061710]">
              {/* SECTION 1: 基本信息 */}
              <div className="border border-emerald-900/50 rounded-xl p-5 bg-slate-950/70 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/40">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full" />
                  <span className="text-xs font-bold text-emerald-400 tracking-wide">基本信息</span>
                </div>

                <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">项目编号:</span>
                    <span className="font-mono text-slate-100 font-medium">{detailSink.projectNo}</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">项目名称:</span>
                    <span className="text-slate-100 font-medium">{detailSink.projectName}</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">项目边界面积:</span>
                    <span className="font-mono text-slate-100">{detailSink.boundaryArea.toLocaleString()} hm²</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">基线期碳储量:</span>
                    <span className="font-mono text-slate-100">{detailSink.baselineCarbon.toLocaleString()} tCO₂e</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">项目期碳储量:</span>
                    <span className="font-mono text-slate-100">{detailSink.projectCarbon.toLocaleString()} tCO₂e</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">碳储量变化量:</span>
                    <span className="font-mono text-emerald-400 font-bold">+{detailSink.carbonChange.toLocaleString()} tCO₂e</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">排放量扣减:</span>
                    <span className="font-mono text-slate-100">-21.34 tCO₂e</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">泄漏量:</span>
                    <span className="font-mono text-slate-100">-15.34 tCO₂e</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">持久性扣减:</span>
                    <span className="font-mono text-slate-100">10%</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">净碳汇量:</span>
                    <span className="font-mono text-emerald-400 font-bold">{detailSink.netSink.toLocaleString()} tCO₂e</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 核证信息 */}
              <div className="border border-emerald-900/50 rounded-xl p-5 bg-slate-950/70 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/40">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full" />
                  <span className="text-xs font-bold text-emerald-400 tracking-wide">核证信息</span>
                </div>

                <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">核证状态:</span>
                    <span className="text-amber-400 font-medium">{detailSink.certStatus}</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">审定机构:</span>
                    <span className="text-slate-100">中国质量认证中心</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">签发日期:</span>
                    <span className="font-mono text-slate-100">{detailSink.issueDate}</span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 w-28 shrink-0">有效期至:</span>
                    <span className="font-mono text-slate-100">2030-04-13</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 数据修正 (Matching uploaded screenshot) */}
      {isSinkCorrectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#091a13] rounded-2xl shadow-2xl max-w-4xl w-full border border-emerald-500/40 overflow-hidden text-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-emerald-900/60 flex items-center justify-between bg-[#0a1f17]">
              <span className="font-semibold text-base text-emerald-300">数据修正</span>
              <button
                type="button"
                onClick={() => setIsSinkCorrectionModalOpen(false)}
                className="text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors cursor-pointer p-1 rounded-lg"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast(`项目【${correctionRecord.projectNo}】计量数据修正成功！`);
                setIsSinkCorrectionModalOpen(false);
              }}
              className="p-6 space-y-6 text-xs font-sans bg-[#061710]"
            >
              {/* SECTION: 项目信息 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/40">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full" />
                  <span className="text-xs font-bold text-emerald-400">项目信息</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 项目编号 */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">项目编号</label>
                    <input
                      type="text"
                      value={correctionRecord.projectNo}
                      onChange={(e) => setCorrectionRecord({ ...correctionRecord, projectNo: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-emerald-900/60 rounded text-slate-100 text-xs font-mono outline-none"
                    />
                  </div>

                  {/* 项目名称 */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">项目名称</label>
                    <input
                      type="text"
                      value={correctionRecord.projectName}
                      onChange={(e) => setCorrectionRecord({ ...correctionRecord, projectName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-emerald-900/60 rounded text-slate-100 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 项目边界面积 */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">项目边界面积</label>
                    <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                      <input
                        type="number"
                        step="0.01"
                        value={correctionRecord.boundaryArea}
                        onChange={(e) => setCorrectionRecord({ ...correctionRecord, boundaryArea: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-900 text-slate-100 text-xs font-mono outline-none"
                      />
                      <span className="bg-slate-950 px-3 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center font-mono">
                        hm²
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2-column Carbon metrics inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        <span className="text-rose-400 mr-1">*</span>基线期碳储量
                      </label>
                      <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                        <input
                          type="number"
                          step="0.01"
                          value={correctionRecord.baselineCarbon}
                          onChange={(e) => setCorrectionRecord({ ...correctionRecord, baselineCarbon: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900/90 text-slate-100 text-xs font-mono outline-none"
                        />
                        <span className="bg-slate-950 px-3 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center font-mono">
                          tCO₂e
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        <span className="text-rose-400 mr-1">*</span>排放量扣减
                      </label>
                      <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                        <input
                          type="number"
                          step="0.01"
                          value={correctionRecord.emissionDeduction}
                          onChange={(e) => setCorrectionRecord({ ...correctionRecord, emissionDeduction: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900/90 text-slate-100 text-xs font-mono outline-none"
                        />
                        <span className="bg-slate-950 px-3 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center font-mono">
                          tCO₂e
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        <span className="text-rose-400 mr-1">*</span>持久性扣减
                      </label>
                      <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                        <input
                          type="number"
                          step="0.01"
                          value={correctionRecord.permanenceDeduction}
                          onChange={(e) => setCorrectionRecord({ ...correctionRecord, permanenceDeduction: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900/90 text-slate-100 text-xs font-mono outline-none"
                        />
                        <span className="bg-slate-950 px-3 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center font-mono">
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        <span className="text-rose-400 mr-1">*</span>项目期碳储量
                      </label>
                      <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                        <input
                          type="number"
                          step="0.01"
                          value={correctionRecord.projectPeriodCarbon}
                          onChange={(e) => setCorrectionRecord({ ...correctionRecord, projectPeriodCarbon: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900/90 text-slate-100 text-xs font-mono outline-none"
                        />
                        <span className="bg-slate-950 px-3 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center font-mono">
                          tCO₂e
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        <span className="text-rose-400 mr-1">*</span>泄漏量
                      </label>
                      <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                        <input
                          type="number"
                          step="0.01"
                          value={correctionRecord.leakage}
                          onChange={(e) => setCorrectionRecord({ ...correctionRecord, leakage: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900/90 text-slate-100 text-xs font-mono outline-none"
                        />
                        <span className="bg-slate-950 px-3 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center font-mono">
                          tCO₂e
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        <span className="text-rose-400 mr-1">*</span>净碳汇量
                      </label>
                      <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                        <input
                          type="number"
                          step="0.01"
                          value={correctionRecord.netSink}
                          onChange={(e) => setCorrectionRecord({ ...correctionRecord, netSink: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900/90 text-emerald-400 font-bold text-xs font-mono outline-none"
                        />
                        <span className="bg-slate-950 px-3 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center font-mono">
                          tCO₂e
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="px-12 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer active:scale-95"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 申请核定 */}
      {isApplyAuditModalOpen && applyAuditRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#091a13] rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-500/40 overflow-hidden text-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-emerald-900/60 flex items-center justify-between bg-[#0a1f17]">
              <span className="font-semibold text-base text-emerald-300">申请核定</span>
              <button
                type="button"
                onClick={() => setIsApplyAuditModalOpen(false)}
                className="text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors cursor-pointer p-1 rounded-lg"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast(`成功提交【${applyAuditRecord.projectNo}】审定核证申请，已转送至 ${auditBody}`);
                setIsApplyAuditModalOpen(false);
              }}
              className="p-6 space-y-5 text-xs font-sans bg-[#061710]"
            >
              {/* SECTION: 项目与核定申报信息 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/40">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full" />
                  <span className="text-xs font-bold text-emerald-400">项目与核定申报信息</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 项目编号 */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">项目编号</label>
                    <input
                      type="text"
                      disabled
                      value={applyAuditRecord.projectNo}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-400 text-xs font-mono outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* 项目名称 */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">项目名称</label>
                    <input
                      type="text"
                      disabled
                      value={applyAuditRecord.projectName}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-400 text-xs outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 审定机构 */}
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      <span className="text-rose-400 mr-1">*</span>审定核证机构
                    </label>
                    <select
                      value={auditBody}
                      onChange={(e) => setAuditBody(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/60 rounded text-slate-100 text-xs outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="中国质量认证中心 (CQC)">中国质量认证中心 (CQC)</option>
                      <option value="中环联合认证中心 (CEC)">中环联合认证中心 (CEC)</option>
                      <option value="北京国鉴认证中心">北京国鉴认证中心</option>
                      <option value="广州赛宝认证中心">广州赛宝认证中心</option>
                    </select>
                  </div>

                  {/* 申请核证碳量 */}
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      <span className="text-rose-400 mr-1">*</span>申请核证碳量 (tCO₂e)
                    </label>
                    <div className="flex rounded border border-emerald-900/60 overflow-hidden focus-within:border-emerald-500">
                      <input
                        type="number"
                        step="0.01"
                        value={appliedVolume}
                        onChange={(e) => setAppliedVolume(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900/90 text-slate-100 text-xs font-mono outline-none"
                      />
                      <span className="bg-slate-950 px-3 py-2 text-slate-400 text-[10px] border-l border-emerald-900/60 flex items-center font-mono">
                        tCO₂e
                      </span>
                    </div>
                  </div>
                </div>

                {/* File upload */}
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    <span className="text-rose-400 mr-1">*</span>项目设计书与监测报告 (PDF/ZIP)
                  </label>
                  <input
                    type="file"
                    ref={auditFileRef}
                    className="hidden"
                    accept=".pdf,.zip,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setAuditFile(e.target.files[0]);
                        triggerToast(`已选择附件: ${e.target.files[0].name}`);
                      }
                    }}
                  />
                  <div
                    onClick={() => auditFileRef.current?.click()}
                    className="p-4 border border-dashed border-emerald-900/60 rounded-lg bg-slate-950/70 flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-slate-300">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs">
                        {auditFile ? auditFile.name : '点击上传项目审定核证材料包 (.pdf/.zip)'}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-400 font-medium underline">浏览文件</span>
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">申报备注说明</label>
                  <textarea
                    rows={3}
                    value={auditRemarks}
                    onChange={(e) => setAuditRemarks(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/60 rounded text-slate-100 text-xs outline-none focus:border-emerald-500 placeholder-slate-500"
                    placeholder="请输入对审定机构的补充说明..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  className="px-12 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer active:scale-95"
                >
                  提交申请
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
