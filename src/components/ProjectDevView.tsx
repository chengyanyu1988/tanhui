import React, { useState, useMemo } from 'react';
import {
  INITIAL_PROJECT_RECORDS,
  ProjectRecord,
  INITIAL_MONITORING_RECORDS,
  ProjectMonitoringRecord,
  INITIAL_REDUCTION_RECORDS,
  EmissionReductionRecord,
} from '../data/projectDevData';
import {
  ArrowLeft,
  Search,
  RotateCcw,
  Plus,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  User,
  Phone,
  Layers,
  ChevronRight,
  Eye,
  CheckSquare,
  Edit3,
  Trash2,
  X,
  Send,
  HelpCircle,
  Sparkles,
  Compass,
  FileSpreadsheet,
  UploadCloud,
  FileCheck2,
  Paperclip,
  Check,
  RefreshCw,
  File,
  Info,
  ExternalLink,
  Upload,
  ShieldCheck,
  Activity,
  Radio,
  BarChart3,
  Database,
  TrendingUp,
  Award,
} from 'lucide-react';

interface ProjectDevViewProps {
  username?: string;
  onBackToPortal: () => void;
  onNavigateToOneMap: () => void;
}

export const ProjectDevView: React.FC<ProjectDevViewProps> = ({
  username = 'admin',
  onBackToPortal,
  onNavigateToOneMap,
}) => {
  // Master projects state initialized with sorted descending records
  const [projects, setProjects] = useState<ProjectRecord[]>(() => {
    return [...INITIAL_PROJECT_RECORDS].sort(
      (a, b) => new Date(b.applyTime).getTime() - new Date(a.applyTime).getTime()
    );
  });

  // Filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [timeSortOrder, setTimeSortOrder] = useState<'desc' | 'asc'>('desc'); // Default descending (近期在前)

  // Selected row IDs for batch action
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Active modal state
  const [detailProject, setDetailProject] = useState<ProjectRecord | null>(null);
  const [auditProject, setAuditProject] = useState<ProjectRecord | null>(null);
  const [editProject, setEditProject] = useState<ProjectRecord | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Sub-navigation tab: 'declaration' (项目申报) | 'boundary' (边界页面) | 'monitoring' (项目监测) | 'reduction' (减排认定)
  const [activeDevTab, setActiveDevTab] = useState<'declaration' | 'boundary' | 'monitoring' | 'reduction'>('declaration');

  // Emission Reduction Certification state (减排认定)
  const [reductionRecords, setReductionRecords] = useState<EmissionReductionRecord[]>(() => {
    return [...INITIAL_REDUCTION_RECORDS];
  });
  const [reductionProjectName, setReductionProjectName] = useState('');
  const [reductionDeveloper, setReductionDeveloper] = useState('');
  const [reductionTypeFilter, setReductionTypeFilter] = useState('all');
  const [reductionStatusFilter, setReductionStatusFilter] = useState('all');
  const [reductionCurrentPage, setReductionCurrentPage] = useState(1);
  const reductionPageSize = 10;
  const [applyReductionItem, setApplyReductionItem] = useState<EmissionReductionRecord | null>(null);
  const [auditReductionItem, setAuditReductionItem] = useState<EmissionReductionRecord | null>(null);
  const [applyReductionAmount, setApplyReductionAmount] = useState('');
  const [applyPeriodStart, setApplyPeriodStart] = useState('2025-01-01');
  const [applyPeriodEnd, setApplyPeriodEnd] = useState('2026-10-31');
  const [applyFiles, setApplyFiles] = useState<{ id: string; name: string; size: string; type: string }[]>([
    { id: 'af-1', name: '肥西县林木碳汇监测核查盖章报告.pdf', size: '4.2 MB', type: 'pdf' },
    { id: 'af-2', name: '第三方机构现场抽样核算盖章申请表.pdf', size: '2.1 MB', type: 'pdf' },
  ]);
  const [reportUploadFiles, setReportUploadFiles] = useState<{ id: string; name: string; size: string; type: string }[]>([]);
  const [otherUploadFiles, setOtherUploadFiles] = useState<{ id: string; name: string; size: string; type: string }[]>([]);
  const [auditReductionAmount, setAuditReductionAmount] = useState('1000');
  const [auditReductionStatus, setAuditReductionStatus] = useState<'passed' | 'not_passed'>('passed');
  const [reductionThirdPartyAgency, setReductionThirdPartyAgency] = useState('中碳质量认证中心有限公司');
  const [thirdPartyFiles, setThirdPartyFiles] = useState<{ id: string; name: string; size: string; type: string }[]>([
    { id: 'tp-1', name: '第三方独立审定与核查报告盖章件.pdf', size: '3.8 MB', type: 'pdf' },
  ]);
  const [thirdPartyRemarks, setThirdPartyRemarks] = useState(
    '经对项目现场样方实地抽检核验，该项目计算模型参数合理，监测数据真实准确，同意通过第三方核定。'
  );
  const [auditStageTab, setAuditStageTab] = useState<'third_party' | 'publicity' | 'ndrc'>('third_party');
  const [publicityResult, setPublicityResult] = useState<'passed' | 'not_passed'>('passed');
  const [publicityFiles, setPublicityFiles] = useState<{ id: string; name: string; size: string; type: string }[]>([
    { id: 'pub-1', name: '减排认定结果公示表及意见公示公告.pdf', size: '2.5 MB', type: 'pdf' },
  ]);
  const [publicityRemarks, setPublicityRemarks] = useState(
    '公示期间（2026-11-01 至 2026-11-30）未收到公众或利益相关方提出的有效书面异议。核查过程规范，数据合法合规，结论予以确认。'
  );
  const [ndrcFilingNo, setNdrcFilingNo] = useState('发改气候备[2026]082号');
  const [ndrcApprovedAmount, setNdrcApprovedAmount] = useState('1000');
  const [ndrcResult, setNdrcResult] = useState<'passed' | 'not_passed'>('passed');
  const [ndrcFiles, setNdrcFiles] = useState<{ id: string; name: string; size: string; type: string }[]>([
    { id: 'ndrc-1', name: '国家发改委温室气体自愿减排量备案批准通知书.pdf', size: '4.2 MB', type: 'pdf' },
    { id: 'ndrc-2', name: '全国碳排放权注册登记簿入库凭证.pdf', size: '1.9 MB', type: 'pdf' },
  ]);
  const [ndrcRemarks, setNdrcRemarks] = useState(
    '经国家发展和改革委员会（或应对气候变化主管机关）复核，本项目减排量计算符合相关方法学规范，监测数据溯源完整，公示程序规范无异议，准予备案登记并入库。'
  );

  // Project Monitoring state
  const [monitoringRecords, setMonitoringRecords] = useState<ProjectMonitoringRecord[]>(() => {
    return [...INITIAL_MONITORING_RECORDS].sort(
      (a, b) => new Date(b.reportTime).getTime() - new Date(a.reportTime).getTime()
    );
  });
  const [monitoringKeyword, setMonitoringKeyword] = useState('');
  const [monitoringStatusFilter, setMonitoringStatusFilter] = useState('all');
  const [monitoringTypeFilter, setMonitoringTypeFilter] = useState('all');
  const [monitoringTimeSortOrder, setMonitoringTimeSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedMonitoringDocItem, setSelectedMonitoringDocItem] = useState<ProjectMonitoringRecord | null>(null);
  const [selectedMonitoringActionItem, setSelectedMonitoringActionItem] = useState<ProjectMonitoringRecord | null>(null);
  const [attachmentManagementItem, setAttachmentManagementItem] = useState<ProjectMonitoringRecord | null>(null);
  const [isNewMonitoringModalOpen, setIsNewMonitoringModalOpen] = useState(false);

  // New monitoring popup date time picker state
  const [newMonitorTime, setNewMonitorTime] = useState('2026-11-08 11:30:00');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(2026);
  const [pickerMonth, setPickerMonth] = useState(11);
  const [pickerDay, setPickerDay] = useState(8);
  const [pickerHour, setPickerHour] = useState('11');
  const [pickerMinute, setPickerMinute] = useState('30');

  // Real file upload states for 新增监测 / 附件管理
  const [methodFiles, setMethodFiles] = useState<{ id: string; name: string; size: string; type: string }[]>([
    { id: 'm-1', name: '监测方法说明书.docx', size: '2.4 MB', type: 'word' }
  ]);
  const [reportFiles, setReportFiles] = useState<{ id: string; name: string; size: string; type: string }[]>([
    { id: 'r-1', name: '第三季度样地监测核算报告.pdf', size: '5.8 MB', type: 'pdf' }
  ]);
  const [otherFiles, setOtherFiles] = useState<{ id: string; name: string; size: string; type: string }[]>([
    { id: 'o-1', name: '无人机高空DOM数据表.xlsx', size: '12.1 MB', type: 'excel' }
  ]);

  const handleFileSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFileList: React.Dispatch<React.SetStateAction<{ id: string; name: string; size: string; type: string }[]>>,
    categoryName: string
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    const newItems = files.map((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let fType = 'file';
      if (['doc', 'docx'].includes(ext)) fType = 'word';
      else if (ext === 'pdf') fType = 'pdf';
      else if (['xls', 'xlsx', 'csv'].includes(ext)) fType = 'excel';
      else if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) fType = 'image';

      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`;

      return {
        id: Math.random().toString(36).slice(2),
        name: file.name,
        size: sizeFormatted,
        type: fType,
      };
    });

    setFileList((prev) => [...prev, ...newItems]);
    triggerToast(`已成功上传【${categoryName}】文件：${newItems.map((f) => f.name).join(', ')}`);
    e.target.value = ''; // reset input
  };

  // New monitoring form state
  const [newMonitoringForm, setNewMonitoringForm] = useState({
    projectName: '',
    projectType: '森林经营碳汇' as ProjectMonitoringRecord['projectType'],
    monitorAgency: '',
    monitorLead: '',
    monitorPeriod: '',
    monitorAreaMu: '' as unknown as number,
    samplePlotsCount: '' as unknown as number,
    treeDensityAvg: '',
    measuredIncrement: '' as unknown as number,
    reportTime: '',
  });

  // Audit form state matching uploaded screenshot
  const [auditDecision, setAuditDecision] = useState<'pass' | 'reject' | 'next_stage'>('pass');
  const [auditResult, setAuditResult] = useState<'pass' | 'revision' | 'reject'>('pass');
  const [auditComment, setAuditComment] = useState(
    '经对申报材料形式审查与土地权属核验，符合国家自愿减排（CCER）开发规范，土地权属清晰无争议，同意进入下一节点。'
  );
  const [auditReviewer, setAuditReviewer] = useState('admin (超级管理员 - 国家碳汇运营中心)');
  const [auditDate, setAuditDate] = useState(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });
  const [auditStep, setAuditStep] = useState<number>(2); // 1: 项目申报, 2: PDD公示, 3: 第三方审查, 4: 国家发改委审核
  const [auditAttachment, setAuditAttachment] = useState<{ fileName: string; fileSize: string } | null>(null);

  // Step 3 (第三方审查) & Step 4 (发改委审核) specific form states
  const [thirdPartyAgency, setThirdPartyAgency] = useState('中国质量认证中心 (CQC)');
  const [thirdPartyLead, setThirdPartyLead] = useState('张建国 (国家注册审定员)');
  const [thirdPartyNo, setThirdPartyNo] = useState('DOE-VAL-CCER-2026-0098');
  const [ndrcDocNo, setNdrcDocNo] = useState('国温减备案〔2026〕096号');
  const [ndrcRegCode, setNdrcRegCode] = useState('CCER-REG-2026-9042');

  // Initial completely blank form for new project declaration (新建页面数据清空)
  const INITIAL_NEW_FORM = {
    projectName: '',
    projectType: '森林经营碳汇' as ProjectRecord['projectType'],
    projectCode: '',
    developer: '',
    legalPerson: '',
    contactPhone: '',
    locationRegion: '',
    locationFull: '',
    areaMu: '' as unknown as number,
    applyDate: '',
    creditingPeriod: '',
    estAnnualReduction: '' as unknown as number,
    baselineMethodology: '',
    devCycleMonths: '',
    totalInvestment: '' as unknown as number,
    projectDesc: '',
  };

  // New project form state (cleared initial data)
  const [newForm, setNewForm] = useState(INITIAL_NEW_FORM);

  // Template documents checklist state (initially empty uploaded files)
  const [docList, setDocList] = useState<
    Array<{
      id: string;
      name: string;
      required: boolean;
      uploadedFile?: {
        fileName: string;
        fileSize: string;
        uploadTime: string;
        fileType?: string;
      };
    }>
  >([
    { id: 'doc-1', name: '项目立项及发改备案文件', required: true },
    { id: 'doc-2', name: '土地权属证明文件及林权证复印件', required: true },
    { id: 'doc-3', name: '项目设计文件 (PDD)', required: true },
    { id: 'doc-4', name: '碳汇量监测计划与基线调查报告', required: true },
    { id: 'doc-5', name: '独立第三方审定机构出具的审定报告', required: true },
    { id: 'doc-6', name: '环境影响评价及生态效益评估报告', required: false },
    { id: 'doc-7', name: '业主委托开发协议及法人授权书', required: false },
    { id: 'doc-8', name: '现场矢量边界地理信息文件 (SHP/KML/GeoJSON)', required: false },
    { id: 'doc-9', name: '地方林草/生态环境主管部门支持意见函', required: false },
    { id: 'doc-10', name: '利益相关方咨询记录及社会公示证明材料', required: false },
    { id: 'doc-11', name: '其它补充支撑附件', required: false },
  ]);

  // Document preview modal state
  const [previewDocModal, setPreviewDocModal] = useState<{
    name: string;
    size?: string;
    time?: string;
  } | null>(null);

  // Custom document addition
  const [showAddCustomDoc, setShowAddCustomDoc] = useState(false);
  const [customDocName, setCustomDocName] = useState('');

  // ----------------------------------------------------
  // 边界页面 (Project Boundary Form) state matching 新建项目申报
  // ----------------------------------------------------
  const INITIAL_BOUNDARY_FORM = {
    projectName: '',
    projectCode: '',
    projectType: '森林经营碳汇' as ProjectRecord['projectType'],
    developer: '',
    surveyLeader: '',
    contactPhone: '',
    locationRegion: '',
    locationFull: '',
    boundaryAreaMu: '' as unknown as number,
    surveyDate: '',
    coordSystem: 'CGCS2000 国家大地坐标系',
    elevationDatum: '1985国家高程基准',
    boundaryMethodology: 'CCER-GIS-001 遥感与无人机外业林班边界测绘技术导则',
    surveyCycleDays: '',
    surveyBudget: '' as unknown as number,
    boundaryDesc: '',
  };
  const [boundaryForm, setBoundaryForm] = useState(INITIAL_BOUNDARY_FORM);
  const [selectedBoundaryProjectId, setSelectedBoundaryProjectId] = useState<string>('');

  // Boundary documents checklist state (matching 新建项目申报 upload cards)
  const [boundaryDocList, setBoundaryDocList] = useState<
    Array<{
      id: string;
      name: string;
      required: boolean;
      uploadedFile?: {
        fileName: string;
        fileSize: string;
        uploadTime: string;
        fileType?: string;
      };
    }>
  >([
    { id: 'bdoc-1', name: '现场矢量边界地理信息文件 (SHP/KML/GeoJSON)', required: true },
    { id: 'bdoc-2', name: '无人机外业航测红线正射影像图 (DOM/TIF)', required: true },
    { id: 'bdoc-3', name: '林权宗地权属界址图与不动产权证书复印件', required: true },
    { id: 'bdoc-4', name: '边界不重叠与无林权争议承诺书', required: true },
    { id: 'bdoc-5', name: '第三方乙级以上测绘资质证书及测量报告', required: true },
    { id: 'bdoc-6', name: '地方林草/自然资源主管部门边界核准确认函', required: false },
    { id: 'bdoc-7', name: '现场踏勘控制点实测坐标清单 (Excel/CSV)', required: false },
    { id: 'bdoc-8', name: '卫片遥感解译地类空间叠置比对核查表', required: false },
    { id: 'bdoc-9', name: '其它空间遥感测绘支撑附件', required: false },
  ]);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Filter and sort computation
  const filteredProjects = useMemo(() => {
    return projects
      .filter((item) => {
        if (
          searchKeyword.trim() &&
          !item.projectName.toLowerCase().includes(searchKeyword.toLowerCase()) &&
          !item.projectNo.toLowerCase().includes(searchKeyword.toLowerCase()) &&
          !item.developer.toLowerCase().includes(searchKeyword.toLowerCase()) &&
          !item.locationFull.toLowerCase().includes(searchKeyword.toLowerCase())
        ) {
          return false;
        }
        if (selectedType !== 'all' && item.projectType !== selectedType) {
          return false;
        }
        if (selectedStatus !== 'all' && item.status !== selectedStatus) {
          return false;
        }
        if (selectedCity !== 'all' && item.locationCity !== selectedCity) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.applyTime).getTime();
        const timeB = new Date(b.applyTime).getTime();
        return timeSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [projects, searchKeyword, selectedType, selectedStatus, selectedCity, timeSortOrder]);

  // Filter and sort monitoring records (descending by reportTime)
  const filteredMonitoringRecords = useMemo(() => {
    return monitoringRecords
      .filter((item) => {
        if (
          monitoringKeyword.trim() &&
          !item.projectName.toLowerCase().includes(monitoringKeyword.toLowerCase()) &&
          !item.monitorNo.toLowerCase().includes(monitoringKeyword.toLowerCase()) &&
          !item.projectNo.toLowerCase().includes(monitoringKeyword.toLowerCase()) &&
          !item.monitorAgency.toLowerCase().includes(monitoringKeyword.toLowerCase())
        ) {
          return false;
        }
        if (monitoringStatusFilter !== 'all' && item.status !== monitoringStatusFilter) {
          return false;
        }
        if (monitoringTypeFilter !== 'all' && item.projectType !== monitoringTypeFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const timeAStr = a.approvalTime || a.reportTime;
        const timeBStr = b.approvalTime || b.reportTime;
        const timeA = new Date(timeAStr.replace(/-/g, '/')).getTime();
        const timeB = new Date(timeBStr.replace(/-/g, '/')).getTime();
        return monitoringTimeSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [monitoringRecords, monitoringKeyword, monitoringStatusFilter, monitoringTypeFilter, monitoringTimeSortOrder]);

  // Filter reduction records (减排认定)
  const filteredReductionRecords = useMemo(() => {
    return reductionRecords.filter((rec) => {
      if (reductionProjectName.trim() && !rec.projectName.toLowerCase().includes(reductionProjectName.toLowerCase())) {
        return false;
      }
      if (reductionDeveloper.trim() && !rec.developer.toLowerCase().includes(reductionDeveloper.toLowerCase())) {
        return false;
      }
      if (reductionTypeFilter !== 'all' && rec.projectType !== reductionTypeFilter) {
        return false;
      }
      if (
        reductionStatusFilter !== 'all' &&
        rec.auditStatusText !== reductionStatusFilter &&
        rec.auditStatus !== reductionStatusFilter
      ) {
        return false;
      }
      return true;
    });
  }, [reductionRecords, reductionProjectName, reductionDeveloper, reductionTypeFilter, reductionStatusFilter]);

  const paginatedReductionRecords = useMemo(() => {
    const start = (reductionCurrentPage - 1) * reductionPageSize;
    return filteredReductionRecords.slice(start, start + reductionPageSize);
  }, [filteredReductionRecords, reductionCurrentPage, reductionPageSize]);

  const totalReductionPages = Math.ceil(filteredReductionRecords.length / reductionPageSize) || 1;

  // Paginated records
  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  // Load boundary data from project
  const handleLoadBoundaryProjectData = (p: ProjectRecord) => {
    setBoundaryForm({
      projectName: p.projectName,
      projectCode: p.projectNo,
      projectType: p.projectType,
      developer: p.developer,
      surveyLeader: p.contactPerson,
      contactPhone: p.contactPhone,
      locationRegion: `${p.locationCity} ${p.locationDistrict}`,
      locationFull: p.locationFull,
      boundaryAreaMu: p.areaMu,
      surveyDate: p.applyTime.slice(0, 10),
      coordSystem: 'CGCS2000 国家大地坐标系',
      elevationDatum: '1985国家高程基准',
      boundaryMethodology: 'CCER-GIS-001 遥感与无人机外业林班边界测绘技术导则',
      surveyCycleDays: '15天',
      surveyBudget: Math.round(p.totalInvestment * 0.12),
      boundaryDesc: `项目位于${p.locationFull}，拟核定边界红线范围约${p.areaMu}亩。`,
    });
    triggerToast(`已自动载入「${p.projectName}」项目边界测绘数据`);
  };


  // Toggle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(paginatedProjects.map((p) => p.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Status badge styling helper (Unified light ecological style)
  const renderStatusBadge = (status: ProjectRecord['status'], text: string) => {
    switch (status) {
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {text}
          </span>
        );
      case 'field_survey':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            {text}
          </span>
        );
      case 'expert_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            {text}
          </span>
        );
      case 'public_filing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
            {text}
          </span>
        );
      case 'quota_issued':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-[#10b981] border border-emerald-200 shadow-2xs font-semibold">
            <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
            {text}
          </span>
        );
      case 'need_revision':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs">
            <AlertCircle className="w-3 h-3 text-rose-500" />
            {text}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-200">
            {text}
          </span>
        );
    }
  };

  // Project type badge styling (Unified light ecological style)
  const renderTypeBadge = (type: ProjectRecord['projectType']) => {
    switch (type) {
      case '毛竹林增汇':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">{type}</span>;
      case '森林经营碳汇':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200">{type}</span>;
      case '造林碳汇':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-800 border border-green-200">{type}</span>;
      case '湿地保护与恢复':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-50 text-cyan-800 border border-cyan-200">{type}</span>;
      case '经济林碳汇':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">{type}</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">{type}</span>;
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedCity('all');
    setTimeSortOrder('desc'); // Always keep descending as requested
    setCurrentPage(1);
    triggerToast('已重置所有查询条件（按申报时间降序排列）');
  };

  // Handle local file selection
  const handleFileSelect = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    let fileType = 'pdf';
    if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) fileType = 'zip';
    else if (file.name.endsWith('.shp') || file.name.endsWith('.geojson') || file.name.endsWith('.kml')) fileType = 'shp';
    else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) fileType = 'doc';
    else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) fileType = 'xls';

    setDocList((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              uploadedFile: {
                fileName: file.name,
                fileSize: sizeStr,
                uploadTime: timeStr,
                fileType,
              },
            }
          : doc
      )
    );
    triggerToast(`材料「${file.name}」上传成功！`);
  };

  // Quick simulate upload for specific slot
  const handleQuickUploadSample = (docId: string) => {
    const doc = docList.find((d) => d.id === docId);
    if (!doc) return;

    const cleanTitle = doc.name.replace(/[* ]/g, '').replace(/[(（].*?[)）]/g, '');
    const prefix = newForm.projectName ? newForm.projectName.slice(0, 10) : '长白山碳汇开发';
    const isShp = doc.name.includes('SHP') || doc.name.includes('矢量');
    const ext = isShp ? '.shp' : '.pdf';
    const fileName = `${prefix}_${cleanTitle}_2026${ext}`;

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    setDocList((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              uploadedFile: {
                fileName,
                fileSize: `${(Math.random() * 8 + 2.5).toFixed(1)} MB`,
                uploadTime: timeStr,
                fileType: isShp ? 'shp' : 'pdf',
              },
            }
          : d
      )
    );
    triggerToast(`已生成并填入规范材料：「${fileName}」`);
  };

  // One-click fill all document slots for quick demo
  const handleOneClickFillAllDocs = () => {
    const prefix = newForm.projectName ? newForm.projectName.slice(0, 10) : '黄山生态增汇';
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    setDocList((prev) =>
      prev.map((d, index) => {
        const cleanTitle = d.name.replace(/[* ]/g, '').replace(/[(（].*?[)）]/g, '');
        const isShp = d.name.includes('SHP') || d.name.includes('矢量');
        const ext = isShp ? '.shp' : '.pdf';
        const fileName = `${prefix}_${cleanTitle}_V${index + 1}${ext}`;
        return {
          ...d,
          uploadedFile: {
            fileName,
            fileSize: `${(3.2 + index * 1.8).toFixed(1)} MB`,
            uploadTime: timeStr,
            fileType: isShp ? 'shp' : 'pdf',
          },
        };
      })
    );
    triggerToast('已一键装配完成全套项目申报审核资料清单（符合国家自愿减排规范）！');
  };

  // Remove uploaded file
  const handleRemoveFile = (docId: string) => {
    setDocList((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, uploadedFile: undefined } : d))
    );
    triggerToast('已移除该材料附件');
  };

  // Add custom document
  const handleAddCustomDoc = () => {
    if (!customDocName.trim()) {
      triggerToast('请输入材料名称');
      return;
    }
    const newDocItem = {
      id: `custom-${Date.now()}`,
      name: customDocName.trim(),
      required: false,
    };
    setDocList((prev) => [...prev, newDocItem]);
    setCustomDocName('');
    setShowAddCustomDoc(false);
    triggerToast(`已添加新材料行「${newDocItem.name}」`);
  };

  // Save Draft
  const handleSaveDraft = () => {
    if (!newForm.projectName.trim()) {
      triggerToast('请先输入项目名称以保存草稿');
      return;
    }
    triggerToast(`项目申报草稿「${newForm.projectName}」已安全保存至本地草稿箱！`);
  };

  // Create new project handler
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.projectName.trim()) {
      triggerToast('请输入项目名称');
      return;
    }

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const currentTimeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const codeDateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;

    // Harvest uploaded files
    const uploadedDocs = docList
      .filter((d) => d.uploadedFile)
      .map((d) => ({
        name: d.uploadedFile!.fileName,
        size: d.uploadedFile!.fileSize,
        uploadTime: d.uploadedFile!.uploadTime,
      }));

    const finalDocs =
      uploadedDocs.length > 0
        ? uploadedDocs
        : [
            {
              name: `${newForm.projectName}项目设计文件(PDD).pdf`,
              size: '12.6 MB',
              uploadTime: currentTimeStr.slice(0, 16),
            },
            {
              name: `${newForm.projectName}发改立项备案批复.pdf`,
              size: '6.4 MB',
              uploadTime: currentTimeStr.slice(0, 16),
            },
          ];

    // Extract city & district
    let city = '黄山市';
    let district = '休宁县';
    if (newForm.locationRegion) {
      const parts = newForm.locationRegion.split(/[/,， ]+/).filter(Boolean);
      if (parts.length >= 2) city = parts[1];
      if (parts.length >= 3) district = parts[2];
    }

    const newRecord: ProjectRecord = {
      id: `proj-${Date.now()}`,
      projectNo:
        newForm.projectCode ||
        `CCER-AH-${codeDateStr}-${Math.floor(10 + Math.random() * 90)}`,
      projectName: newForm.projectName,
      projectType: newForm.projectType,
      developer: newForm.developer || '安徽省碳资产发展有限公司',
      locationProvince: '安徽省',
      locationCity: city,
      locationDistrict: district,
      locationFull:
        newForm.locationFull || `${newForm.locationRegion} 重点实施林班林地`,
      areaMu: Number(newForm.areaMu) || 20000,
      areaHectare: Number(((Number(newForm.areaMu) || 20000) / 15).toFixed(1)),
      estAnnualReduction: Number(newForm.estAnnualReduction) || 5.0,
      creditingPeriod: `${newForm.creditingPeriod}年`,
      applyTime: currentTimeStr, // Always set to current latest timestamp so it's strictly descending (first position)
      status: 'pending_review',
      statusText: '待初审',
      contactPerson: newForm.legalPerson || '张立华',
      contactPhone: newForm.contactPhone || '138****6821',
      baselineMethodology: newForm.baselineMethodology,
      leakageDeductionRate: 2.5,
      totalInvestment: Number(newForm.totalInvestment) || 1500,
      accumulatedSequestration: 0,
      documents: finalDocs,
      timeline: [
        {
          title: '项目立项申报',
          date: currentTimeStr.slice(0, 10),
          status: 'completed',
          desc: '系统在线录入成功，申报材料上传齐全，等待立项初审',
        },
        {
          title: '外业样地实测',
          date: '待安排',
          status: 'pending',
          desc: '第三方技术机构建立固定监测样地',
        },
        {
          title: '额外性与基准线评审',
          date: '待安排',
          status: 'pending',
          desc: '组织行业专家审查方法学适用性',
        },
        {
          title: '国家平台公示备案',
          date: '待安排',
          status: 'pending',
          desc: '国家CCER自愿减排登记平台公示',
        },
        {
          title: '首期减排量签发',
          date: '待安排',
          status: 'pending',
          desc: '获得核证减排量进入全国碳市场',
        },
      ],
    };

    // Prepend to array so it's at the very top (descending order)
    setProjects((prev) => [newRecord, ...prev]);
    setIsNewProjectModalOpen(false);
    triggerToast(`项目「${newRecord.projectName}」申报成功，已置于近期首位！`);
  };

  // Perform audit handler matching screenshot
  const handlePerformAudit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!auditProject) return;

    let updatedStatus: ProjectRecord['status'] = auditProject.status;
    let updatedStatusText = auditProject.statusText;

    if (auditResult === 'pass' || auditDecision === 'pass') {
      if (auditProject.status === 'pending_review') {
        updatedStatus = 'field_survey';
        updatedStatusText = '样地实测中';
      } else if (auditProject.status === 'field_survey') {
        updatedStatus = 'expert_review';
        updatedStatusText = '专家评审中';
      } else if (auditProject.status === 'expert_review') {
        updatedStatus = 'public_filing';
        updatedStatusText = '公示备案中';
      } else if (auditProject.status === 'public_filing') {
        updatedStatus = 'quota_issued';
        updatedStatusText = '已签发配额';
      }
    } else if (auditResult === 'revision' || auditDecision === 'reject') {
      updatedStatus = 'need_revision';
      updatedStatusText = '需补正';
    } else if (auditResult === 'reject') {
      updatedStatus = 'need_revision';
      updatedStatusText = '已驳回';
    }

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    setProjects((prev) =>
      prev.map((item) =>
        item.id === auditProject.id
          ? {
              ...item,
              status: updatedStatus,
              statusText: updatedStatusText,
              timeline: [
                {
                  title:
                    auditResult === 'pass'
                      ? '审核通过并推进'
                      : auditResult === 'revision'
                      ? '要求退回补正'
                      : '审核驳回',
                  date: timeStr,
                  status: auditResult === 'pass' ? 'completed' : 'pending',
                  desc: auditComment || '完成审查核验批复',
                },
                ...item.timeline,
              ],
            }
          : item
      )
    );

    triggerToast(`项目 ${auditProject.projectNo} 审核批复已完成！状态已变更为【${updatedStatusText}】`);
    setAuditProject(null);
  };

  // Open project boundary in 边界页面
  const handleOpenProjectBoundary = (project: ProjectRecord) => {
    setActiveDevTab('boundary');
    setSelectedBoundaryProjectId(project.id);
    setBoundaryForm({
      projectName: project.projectName,
      projectCode: project.projectNo,
      projectType: project.projectType,
      developer: project.developer,
      surveyLeader: project.contactPerson || '张立华',
      contactPhone: project.contactPhone || '138****6821',
      locationRegion: `${project.locationProvince} / ${project.locationCity} / ${project.locationDistrict}`,
      locationFull: project.locationFull,
      boundaryAreaMu: project.areaMu,
      surveyDate: project.applyTime ? project.applyTime.slice(0, 10) : new Date().toISOString().slice(0, 10),
      coordSystem: 'CGCS2000 国家大地坐标系',
      elevationDatum: '1985国家高程基准',
      boundaryMethodology: 'CCER-GIS-001 遥感与无人机外业林班边界测绘技术导则',
      surveyCycleDays: '45',
      surveyBudget: 280,
      boundaryDesc: `已完成 ${project.projectName} 外业无人机正射航测，林班权属界线经自然资源局与林业局核准确认，无重叠争议，符合国家CCER自愿减排边界核定技术导则。`,
    });
    setBoundaryDocList([
      {
        id: 'bdoc-1',
        name: '现场矢量边界地理信息文件 (SHP/KML/GeoJSON)',
        required: true,
        uploadedFile: {
          fileName: `${project.projectName.slice(0, 8)}_现场实测边界.geojson`,
          fileSize: '4.2 MB',
          uploadTime: project.applyTime.slice(0, 16),
          fileType: 'shp',
        },
      },
      {
        id: 'bdoc-2',
        name: '无人机外业航测红线正射影像图 (DOM/TIF)',
        required: true,
        uploadedFile: {
          fileName: `${project.projectName.slice(0, 8)}_无人机航测DOM.tif`,
          fileSize: '128.5 MB',
          uploadTime: project.applyTime.slice(0, 16),
          fileType: 'zip',
        },
      },
      {
        id: 'bdoc-3',
        name: '林权宗地权属界址图与不动产权证书复印件',
        required: true,
        uploadedFile: {
          fileName: `${project.projectName.slice(0, 8)}_不动产林权界址核定.pdf`,
          fileSize: '8.6 MB',
          uploadTime: project.applyTime.slice(0, 16),
          fileType: 'pdf',
        },
      },
      {
        id: 'bdoc-4',
        name: '边界不重叠与无林权争议承诺书',
        required: true,
        uploadedFile: {
          fileName: `${project.projectName.slice(0, 8)}_边界无权属争议承诺书.pdf`,
          fileSize: '2.1 MB',
          uploadTime: project.applyTime.slice(0, 16),
          fileType: 'pdf',
        },
      },
      {
        id: 'bdoc-5',
        name: '第三方乙级以上测绘资质证书及测量报告',
        required: true,
        uploadedFile: {
          fileName: '安徽省遥感测绘院_外业工程测量技术报告.pdf',
          fileSize: '15.4 MB',
          uploadTime: project.applyTime.slice(0, 16),
          fileType: 'pdf',
        },
      },
      { id: 'bdoc-6', name: '地方林草/自然资源主管部门边界核准确认函', required: false },
      { id: 'bdoc-7', name: '现场踏勘控制点实测坐标清单 (Excel/CSV)', required: false },
      { id: 'bdoc-8', name: '卫片遥感解译地类空间叠置比对核查表', required: false },
      { id: 'bdoc-9', name: '其它空间遥感测绘支撑附件', required: false },
    ]);
    triggerToast(`已载入「${project.projectName}」项目边界测绘档案`);
  };

  // Boundary file upload handler
  const handleBoundaryFileSelect = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    let fileType = 'shp';
    if (file.name.endsWith('.pdf')) fileType = 'pdf';
    else if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) fileType = 'zip';
    else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) fileType = 'doc';

    setBoundaryDocList((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              uploadedFile: {
                fileName: file.name,
                fileSize: sizeStr,
                uploadTime: timeStr,
                fileType,
              },
            }
          : doc
      )
    );
    triggerToast(`边界测绘材料「${file.name}」上传成功！`);
  };

  const handleBoundaryQuickUploadSample = (docId: string) => {
    const doc = boundaryDocList.find((d) => d.id === docId);
    if (!doc) return;

    const cleanTitle = doc.name.replace(/[* ]/g, '').replace(/[(（].*?[)）]/g, '');
    const prefix = boundaryForm.projectName ? boundaryForm.projectName.slice(0, 10) : '黄山生态空间测绘';
    const isShp = doc.name.includes('SHP') || doc.name.includes('矢量') || doc.name.includes('GeoJSON');
    const ext = isShp ? '.geojson' : '.pdf';
    const fileName = `${prefix}_${cleanTitle}_2026${ext}`;

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    setBoundaryDocList((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              uploadedFile: {
                fileName,
                fileSize: `${(Math.random() * 8 + 3.2).toFixed(1)} MB`,
                uploadTime: timeStr,
                fileType: isShp ? 'shp' : 'pdf',
              },
            }
          : d
      )
    );
    triggerToast(`已生成并填入规范边界测绘材料：「${fileName}」`);
  };

  const handleBoundaryOneClickFillAllDocs = () => {
    const prefix = boundaryForm.projectName ? boundaryForm.projectName.slice(0, 10) : '皖南示范林';
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    setBoundaryDocList((prev) =>
      prev.map((d, index) => {
        const cleanTitle = d.name.replace(/[* ]/g, '').replace(/[(（].*?[)）]/g, '');
        const isShp = d.name.includes('SHP') || d.name.includes('矢量') || d.name.includes('GeoJSON');
        const ext = isShp ? '.geojson' : index === 1 ? '.tif' : '.pdf';
        const fileName = `${prefix}_${cleanTitle}_V${index + 1}${ext}`;
        return {
          ...d,
          uploadedFile: {
            fileName,
            fileSize: `${(4.5 + index * 2.3).toFixed(1)} MB`,
            uploadTime: timeStr,
            fileType: isShp ? 'shp' : 'pdf',
          },
        };
      })
    );
    triggerToast('已一键装配完成全套项目空间边界核定测绘材料清单！');
  };

  const handleBoundaryRemoveFile = (docId: string) => {
    setBoundaryDocList((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, uploadedFile: undefined } : d))
    );
    triggerToast('已移除该边界材料附件');
  };

  const handleSaveBoundaryDraft = () => {
    if (!boundaryForm.projectName.trim()) {
      triggerToast('请先输入项目名称以保存边界草稿');
      return;
    }
    triggerToast(`项目边界申报草稿「${boundaryForm.projectName}」已安全保存！`);
  };

  const handleSubmitBoundaryForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boundaryForm.projectName.trim()) {
      triggerToast('请输入项目名称');
      return;
    }
    triggerToast(`项目「${boundaryForm.projectName}」边界空间核准申报已成功提交！`);
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== id));
    setDeleteConfirmId(null);
    triggerToast('已成功撤销并删除该项目申报档案');
  };

  // Batch delete
  const handleBatchDelete = () => {
    if (selectedRowIds.length === 0) return;
    setProjects((prev) => prev.filter((p) => !selectedRowIds.includes(p.id)));
    triggerToast(`已批量删除 ${selectedRowIds.length} 个申报项目`);
    setSelectedRowIds([]);
  };

  // Export excel simulation
  const handleExportData = () => {
    triggerToast(`正在导出 ${filteredProjects.length} 条碳汇项目开发全流程数据清单 (XLSX)...`);
    setTimeout(() => {
      triggerToast('导出完成，请在浏览器下载目录查收「碳汇项目开发管理清单_2026.xlsx」');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#040e09] text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Dynamic Background Cyber Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12)_0%,rgba(5,25,18,0.08)_50%,transparent_80%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Floating System Notification Toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-emerald-950/95 border border-emerald-500/80 rounded-xl text-xs text-emerald-200 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Main Navigation Bar */}
      <header className="relative z-20 h-16 px-6 lg:px-8 bg-gradient-to-b from-[#031c12] via-[#051f15] to-[#03150e]/95 border-b border-emerald-800/60 backdrop-blur-md flex items-center justify-between">
        {/* Left: Brand, Back, and Title */}
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
                碳汇项目开发管理
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/90 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>CCER 全生命周期</span>
              </span>
            </div>
            <div className="text-[9px] font-mono text-emerald-500/80 tracking-widest uppercase">
              CARBON SINK PROJECT LIFECYCLE & MRV REGISTRY PLATFORM
            </div>
          </div>
        </div>

        {/* Center / Right Quick Action Links */}
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
            onClick={() => setActiveDevTab('declaration')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeDevTab === 'declaration'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>项目申报</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDevTab('monitoring')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeDevTab === 'monitoring'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-teal-300" />
            <span>项目监测</span>
            <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40 font-mono">
              MRV
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDevTab('reduction')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeDevTab === 'reduction'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/80 border border-emerald-400/50 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            <span>减排认定</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="relative z-10 flex-1 p-4 lg:p-6 max-w-[1720px] mx-auto w-full space-y-5">
        {/* VIEW 1: 项目申报 (Declaration Tab) */}
        {activeDevTab === 'declaration' && (
          <>
            {/* 2. Filter & Query Conditions Box (符合截图的企业级查询控制栏) */}
            <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white tracking-wide">项目检索与精准筛选</span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs text-emerald-400/90 font-mono">
                时间默认降序排列（最新申报在前）
              </span>
            </div>

            {/* Top Right Action Buttons: + 新增项目申报, 批量导出 */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ 新增项目申报</span>
              </button>

              <button
                onClick={handleExportData}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors"
                title="导出筛选结果为 Excel"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>批量导出</span>
              </button>

              {selectedRowIds.length > 0 && (
                <button
                  onClick={handleBatchDelete}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 rounded-lg text-xs font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>批量撤销 ({selectedRowIds.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Form Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative">
              <label className="block text-[11px] text-slate-400 mb-1">关键词搜索</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="项目名称 / 编号 / 申报主体..."
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">项目类型</label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">全部类型 (全部6类)</option>
                <option value="毛竹林增汇">毛竹林增汇</option>
                <option value="森林经营碳汇">森林经营碳汇</option>
                <option value="造林碳汇">造林碳汇</option>
                <option value="湿地保护与恢复">湿地保护与恢复</option>
                <option value="经济林碳汇">经济林碳汇</option>
                <option value="草原改良碳汇">草原改良碳汇</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">审核生命周期状态</label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">全部生命周期状态</option>
                <option value="pending_review">待初审</option>
                <option value="field_survey">样地实测中</option>
                <option value="expert_review">专家评审中</option>
                <option value="public_filing">公示备案中</option>
                <option value="quota_issued">已签发配额</option>
                <option value="need_revision">需补正</option>
              </select>
            </div>

            {/* City Location Filter */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">实施区域 (安徽省地市)</label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">全省所有地市</option>
                <option value="黄山市">黄山市</option>
                <option value="六安市">六安市</option>
                <option value="安庆市">安庆市</option>
                <option value="池州市">池州市</option>
                <option value="宣城市">宣城市</option>
                <option value="合肥市">合肥市</option>
                <option value="滁州市">滁州市</option>
                <option value="宿州市">宿州市</option>
              </select>
            </div>

            {/* Sort & Action Reset */}
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setTimeSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                className="flex-1 py-1.5 px-2 bg-slate-900 border border-emerald-900/60 hover:border-emerald-500/60 rounded-lg text-xs text-emerald-300 flex items-center justify-center gap-1 transition-colors"
                title="切换时间排序"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{timeSortOrder === 'desc' ? '近期在前 (降序)' : '远期在前 (升序)'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                className="p-1.5 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="重置检索条件"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Data Table Container (高规格企业数据表格) */}
        <div className="bg-slate-950/90 border border-emerald-950/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Table Header Controls */}
          <div className="px-5 py-3 border-b border-emerald-950 flex flex-wrap items-center justify-between gap-2 bg-slate-900/50">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>查询结果：共检索到</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">
                {filteredProjects.length}
              </span>
              <span>个申报项目</span>
              {selectedRowIds.length > 0 && (
                <span className="ml-2 text-emerald-300 font-semibold">
                  (已勾选 {selectedRowIds.length} 项)
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>数据已实时更新 · 遵循国家最新CCER自愿减排方法学</span>
            </div>
          </div>

          {/* Responsive Table Body */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-emerald-950 bg-slate-900/80 text-slate-400 font-medium">
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedProjects.length > 0 &&
                        paginatedProjects.every((p) => selectedRowIds.includes(p.id))
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 w-12 text-center text-slate-500">序号</th>
                  <th className="py-3 px-3 min-w-[140px]">项目编号</th>
                  <th className="py-3 px-4 min-w-[240px]">项目名称</th>
                  <th className="py-3 px-3 min-w-[110px]">项目类型</th>
                  <th className="py-3 px-3 min-w-[180px]">开发主体</th>
                  <th className="py-3 px-3 min-w-[130px]">实施区域</th>
                  <th className="py-3 px-3 min-w-[95px] text-right">规划规模</th>
                  <th className="py-3 px-3 min-w-[100px] text-right">预估年固碳</th>
                  <th className="py-3 px-3 min-w-[110px]">计入期</th>
                  <th
                    className="py-3 px-3 min-w-[145px] cursor-pointer hover:text-emerald-400 transition-colors"
                    onClick={() => setTimeSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                    title="点击可切换时间排序顺序"
                  >
                    <div className="flex items-center gap-1">
                      <span>申报时间</span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {timeSortOrder === 'desc' ? '▼近期在前' : '▲远期在前'}
                      </span>
                    </div>
                  </th>
                  <th className="py-3 px-3 min-w-[100px] text-center">当前状态</th>
                  <th className="py-3 px-4 min-w-[140px] text-center">操作</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {paginatedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-slate-600" />
                        <span>暂无符合条件的碳汇申报项目</span>
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="mt-1 text-xs text-emerald-400 hover:underline"
                        >
                          清空筛选重置列表
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map((project, index) => {
                    const rowGlobalIndex = (currentPage - 1) * pageSize + index + 1;
                    const isSelected = selectedRowIds.includes(project.id);

                    return (
                      <tr
                        key={project.id}
                        className={`transition-colors group hover:bg-emerald-950/30 ${
                          isSelected ? 'bg-emerald-950/40' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRow(project.id)}
                            className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>

                        {/* Global Index */}
                        <td className="py-3.5 px-3 text-center text-slate-500 font-mono">
                          {rowGlobalIndex}
                        </td>

                        {/* Project Code */}
                        <td className="py-3.5 px-3">
                          <span className="font-mono text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60 text-[11px]">
                            {project.projectNo}
                          </span>
                        </td>

                        {/* Project Name */}
                        <td className="py-3.5 px-4">
                          <div
                            onClick={() => setDetailProject(project)}
                            className="font-medium text-slate-100 hover:text-emerald-300 cursor-pointer transition-colors line-clamp-1"
                            title={project.projectName}
                          >
                            {project.projectName}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span className="truncate max-w-[230px]">{project.locationFull}</span>
                          </div>
                        </td>

                        {/* Project Type */}
                        <td className="py-3.5 px-3">
                          {renderTypeBadge(project.projectType)}
                        </td>

                        {/* Developer */}
                        <td className="py-3.5 px-3">
                          <div className="text-slate-300 font-normal truncate max-w-[180px]" title={project.developer}>
                            {project.developer}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <User className="w-2.5 h-2.5" />
                            <span>{project.contactPerson}</span>
                            <span className="text-slate-600">·</span>
                            <span>{project.contactPhone}</span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-3">
                          <span className="text-slate-300 font-medium">
                            {project.locationCity} · {project.locationDistrict}
                          </span>
                        </td>

                        {/* Area */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="font-mono font-bold text-slate-200">
                            {project.areaMu.toLocaleString()}
                            <span className="text-[10px] font-sans text-slate-400 ml-0.5">亩</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            ≈ {project.areaHectare} ha
                          </div>
                        </td>

                        {/* Est Annual Reduction */}
                        <td className="py-3.5 px-3 text-right font-mono">
                          <span className="font-bold text-emerald-400">
                            {project.estAnnualReduction}
                          </span>
                          <span className="text-[10px] font-sans text-slate-400 ml-0.5">万吨/年</span>
                        </td>

                        {/* Crediting Period */}
                        <td className="py-3.5 px-3 text-slate-300 font-mono text-[11px]">
                          {project.creditingPeriod}
                        </td>

                        {/* Apply Time (Sorted descending: most recent first) */}
                        <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{project.applyTime}</span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          {renderStatusBadge(project.status, project.statusText)}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setDetailProject(project)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors text-[11px] font-medium"
                              title="查看全生命周期进度与材料"
                            >
                              详情
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setAuditProject(project);
                                setAuditDecision('pass');
                              }}
                              className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/70 text-emerald-300 hover:text-white transition-colors text-[11px] font-medium"
                              title="审核流转与批注"
                            >
                              审核
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditProject(project)}
                              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                              title="修改参数"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(project.id)}
                              className="p-1 rounded hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                              title="撤销申报"
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

          {/* Table Bottom: Pagination & Info */}
          <div className="p-4 border-t border-emerald-950 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span>
                显示第 <span className="text-white font-mono">{filteredProjects.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> 至{' '}
                <span className="text-white font-mono">
                  {Math.min(currentPage * pageSize, filteredProjects.length)}
                </span>{' '}
                条，共 <span className="text-white font-mono">{filteredProjects.length}</span> 条
              </span>
              <span className="text-slate-600">|</span>
              <span>每页 {pageSize} 条</span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                上一页
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded text-xs font-mono font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </>
    )}

      {/* VIEW 2: 边界核定 (Boundary Verification Tab) */}
      {activeDevTab === 'boundary' && (
        <div className="bg-[#081812] border border-emerald-900/80 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-900/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span className="text-base font-bold text-white tracking-wide">
                  项目空间矢量边界核定申报
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                依据《国家温室气体自愿减排（CCER）外业勘测与遥感定界规范》，上传与审核项目宗地边界与无人机航测数据。
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBoundaryOneClickFillAllDocs}
                className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>一键装配全套边界档案</span>
              </button>
            </div>
          </div>

          {/* Boundary Form Body */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1">
                    <span className="text-rose-500 mr-1">*</span>关联申报项目
                  </label>
                  <select
                    value={selectedBoundaryProjectId}
                    onChange={(e) => {
                      setSelectedBoundaryProjectId(e.target.value);
                      const p = projects.find((proj) => proj.id === e.target.value);
                      if (p) {
                        handleLoadBoundaryProjectData(p);
                      }
                    }}
                    className="w-full px-3 py-2 bg-[#05130d] border border-slate-700 rounded-lg text-slate-200 text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="">-- 请选择需要核发边界的项目 --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectName} ({p.projectNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1">
                    <span className="text-rose-500 mr-1">*</span>测绘边界面积 (亩)
                  </label>
                  <input
                    type="number"
                    value={boundaryForm.boundaryAreaMu || ''}
                    onChange={(e) =>
                      setBoundaryForm({ ...boundaryForm, boundaryAreaMu: Number(e.target.value) })
                    }
                    placeholder="请输入测绘地块红线总面积"
                    className="w-full px-3 py-2 bg-[#05130d] border border-slate-700 rounded-lg text-slate-200 text-xs font-mono outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">大地坐标基准系统</label>
                  <input
                    type="text"
                    value={boundaryForm.coordSystem}
                    onChange={(e) => setBoundaryForm({ ...boundaryForm, coordSystem: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#05130d] border border-slate-800 rounded-lg text-slate-300 text-xs outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">高程基准面</label>
                  <input
                    type="text"
                    value={boundaryForm.elevationDatum}
                    onChange={(e) => setBoundaryForm({ ...boundaryForm, elevationDatum: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#05130d] border border-slate-800 rounded-lg text-slate-300 text-xs outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">测绘勘界导则</label>
                  <input
                    type="text"
                    value={boundaryForm.boundaryMethodology}
                    onChange={(e) => setBoundaryForm({ ...boundaryForm, boundaryMethodology: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#05130d] border border-slate-800 rounded-lg text-slate-300 text-xs outline-none truncate"
                  />
                </div>
              </div>

              {/* Boundary Documents Grid */}
              <div>
                <label className="block text-slate-200 font-bold text-xs mb-2.5">
                  外业空间遥感与宗地边界核验支撑材料 (SHP/KML/DOM)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {boundaryDocList.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-[#05120c] border border-emerald-950 hover:border-emerald-800/80 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-medium text-slate-200">
                          {doc.required && <span className="text-rose-500">*</span>}
                          <span className="truncate max-w-[200px]">{doc.name}</span>
                        </div>
                        {doc.uploadedFile ? (
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] rounded font-bold border border-emerald-800">
                            已归档
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-900 text-slate-500 text-[10px] rounded">
                            未装配
                          </span>
                        )}
                      </div>

                      {doc.uploadedFile ? (
                        <div className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="text-[11px] text-emerald-300 font-mono truncate">
                              {doc.uploadedFile.fileName}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {doc.uploadedFile.fileSize} · {doc.uploadedFile.uploadTime}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleBoundaryRemoveFile(doc.id)}
                            className="p-1 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded transition-colors"
                            title="移除附件"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-1">
                          <label className="flex-1 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded text-[11px] text-center cursor-pointer transition-colors">
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleBoundaryFileSelect(doc.id, e)}
                            />
                            选择外业文件
                          </label>
                          <button
                            type="button"
                            onClick={() => handleBoundaryQuickUploadSample(doc.id)}
                            className="py-1.5 px-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 rounded text-[11px] transition-colors"
                            title="自动一键生成支撑文档"
                          >
                            示例补齐
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSaveBoundaryDraft}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  保存草稿箱
                </button>
                <button
                  type="button"
                  onClick={handleSubmitBoundaryForm}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-950"
                >
                  提交空间边界核准
                </button>
              </div>
            </div>

            {/* Map GIS Card */}
            <div className="p-4 bg-slate-950 border border-emerald-900/60 rounded-xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>遥感边界红线空间叠置预览</span>
                  </span>
                  <button
                    type="button"
                    onClick={onNavigateToOneMap}
                    className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <span>全屏底座</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  依据矢量边界(GeoJSON/SHP)与高分六号遥感卫片实时比对地类三调数据，核查林权边界重叠情况。
                </p>
              </div>

              <div className="relative h-64 bg-[#03130c] rounded-lg border border-emerald-900/80 overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 text-center space-y-2 p-4">
                  <MapPin className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                  <div className="text-xs font-bold text-white">
                    {boundaryForm.projectName || '休宁县齐云山毛竹林增汇示范区'}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    CGCS2000 坐标系 · 红线闭合率 100%
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#06140e] rounded-lg border border-emerald-950 text-[11px] text-slate-400 space-y-1 font-mono">
                <div>· 空间核查算法: CCER-GIS-OVERLAY-V2</div>
                <div>· 宗地无重叠承诺: 已通过数字印章核验</div>
                <div>· 卫星反演时段: 2026年Q1最新高分遥感底座</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 项目监测 (Project Monitoring Tab) */}
      {activeDevTab === 'monitoring' && (
        <div className="space-y-5">
          {/* 2. Filter & Action Controls Box for Monitoring */}
          <div className="p-4 bg-slate-950/80 border border-emerald-900/60 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white tracking-wide">
                  项目监测数据检索与动态分析
                </span>
                <span className="text-xs text-slate-500">|</span>
                <span className="text-xs text-emerald-400/90 font-mono">
                  时间默认降序排列（近期监测排在前）
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    const now = new Date();
                    const pad = (n: number) => String(n).padStart(2, '0');
                    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
                    setNewMonitoringForm({
                      projectName: '黄山风景区碳汇造林开发项目',
                      projectType: '造林碳汇',
                      monitorAgency: '安徽省林业调查规划院 (乙级遥感测绘)',
                      monitorLead: '张建国 (高级工程师)',
                      monitorPeriod: '2026年Q2例行监测周期',
                      monitorAreaMu: 28600,
                      samplePlotsCount: 36,
                      treeDensityAvg: '胸径 15.6cm · 平均树高 12.1m',
                      measuredIncrement: 2300,
                      reportTime: timeStr,
                    });
                    setIsNewMonitoringModalOpen(true);
                  }}
                  type="button"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-950/60 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ 新增监测数据填报</span>
                </button>

                <button
                  onClick={() => {
                    triggerToast(`正在导出 ${filteredMonitoringRecords.length} 项监测核查数据报表 (XLSX)...`);
                    setTimeout(() => {
                      triggerToast('导出成功，请查收「碳汇项目监测核查分析表_2026.xlsx」');
                    }, 1200);
                  }}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>导出监测报表</span>
                </button>

                <button
                  onClick={() => {
                    triggerToast('遥感卫片与无人机样方高程反演数据刷新完成！');
                  }}
                  type="button"
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                  title="刷新高分遥感图层"
                >
                  <RefreshCw className="w-4 h-4 text-teal-400" />
                </button>
              </div>
            </div>

            {/* Monitoring Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <div className="relative">
                <label className="block text-[11px] text-slate-400 mb-1">检索关键字</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="项目名称 / 监测编号 / 监测单位..."
                    value={monitoringKeyword}
                    onChange={(e) => setMonitoringKeyword(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">监测审核状态</label>
                <select
                  value={monitoringStatusFilter}
                  onChange={(e) => setMonitoringStatusFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">全部监测状态</option>
                  <option value="collecting">监测数据采集中</option>
                  <option value="verifying">第三方核查中</option>
                  <option value="passed">已通过监测核查</option>
                  <option value="revision">异常待复核</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">项目类型</label>
                <select
                  value={monitoringTypeFilter}
                  onChange={(e) => setMonitoringTypeFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900/90 border border-emerald-950/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">全部项目类型</option>
                  <option value="造林碳汇">造林碳汇</option>
                  <option value="森林经营碳汇">森林经营碳汇</option>
                  <option value="毛竹林增汇">毛竹林增汇</option>
                  <option value="湿地保护与恢复">湿地保护与恢复</option>
                  <option value="经济林碳汇">经济林碳汇</option>
                </select>
              </div>

              <div className="flex items-end gap-2 col-span-2">
                <button
                  type="button"
                  onClick={() => setMonitoringTimeSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                  className="flex-1 py-1.5 px-3 bg-slate-900 border border-emerald-900/60 hover:border-emerald-500/60 rounded-lg text-xs text-emerald-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {monitoringTimeSortOrder === 'desc'
                      ? '报送时间：近期在前 (降序)'
                      : '报送时间：远期在前 (升序)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMonitoringKeyword('');
                    setMonitoringStatusFilter('all');
                    setMonitoringTypeFilter('all');
                    setMonitoringTimeSortOrder('desc');
                  }}
                  className="p-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="重置监测筛选"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Monitoring Main Data Table */}
          <div className="bg-slate-950/90 border border-emerald-950/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
            <div className="px-5 py-3 border-b border-emerald-950 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>监测结果：共检索到</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {filteredMonitoringRecords.length}
                </span>
                <span>个项目监测期记录</span>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>遵循国家CCER-MRV高精度遥感测绘规程</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-emerald-950 bg-slate-900/90 text-slate-400 font-semibold">
                    <th className="py-3.5 px-4 w-16 text-center text-slate-400">序号</th>
                    <th className="py-3.5 px-4 min-w-[220px]">项目名称</th>
                    <th className="py-3.5 px-4 min-w-[200px]">开发单位</th>
                    <th className="py-3.5 px-4 min-w-[120px] text-right">项目面积(亩)</th>
                    <th className="py-3.5 px-4 min-w-[120px]">项目类型</th>
                    <th className="py-3.5 px-4 min-w-[110px] text-center">项目周期(月)</th>
                    <th
                      className="py-3.5 px-4 min-w-[170px] cursor-pointer hover:text-emerald-400 transition-colors"
                      onClick={() =>
                        setMonitoringTimeSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
                      }
                    >
                      <div className="flex items-center gap-1">
                        <span>批准时间</span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {monitoringTimeSortOrder === 'desc' ? '▼近期在前' : '▲远期在前'}
                        </span>
                      </div>
                    </th>
                    <th className="py-3.5 px-4 min-w-[140px] text-center">操作</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60">
                  {filteredMonitoringRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-2">
                          <Activity className="w-8 h-8 text-slate-600" />
                          <span>暂无符合条件的项目监测记录</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredMonitoringRecords.map((item, idx) => {
                      return (
                        <tr
                          key={item.id}
                          className="transition-colors hover:bg-emerald-950/30 group"
                        >
                          <td className="py-3.5 px-4 text-center text-slate-400 font-mono">
                            {idx + 1}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              onClick={() => {
                                const matched = projects.find(
                                  (p) => p.id === (item as any).projectId || p.projectName === item.projectName
                                );
                                if (matched) {
                                  setDetailProject(matched);
                                } else {
                                  setDetailProject({
                                    id: item.id || 'proj-det',
                                    projectNo: item.projectNo || 'CCER-AH-202610-01',
                                    projectName: item.projectName,
                                    projectType: item.projectType || '碳汇造林',
                                    developer: item.developer || item.monitorAgency || '安徽省森林开发有限公司',
                                    locationProvince: '安徽省',
                                    locationCity: '合肥市',
                                    locationDistrict: '肥西县',
                                    locationFull: item.locationFull || '安徽省境内项目实施地段',
                                    areaMu: item.areaMu || item.monitorAreaMu || 1000,
                                    areaHectare: Math.round((item.areaMu || 1000) / 15),
                                    estAnnualReduction: item.estAnnualReduction || 1.2,
                                    creditingPeriod: '2026-2046 (20年)',
                                    applyTime: item.approvalTime || item.reportTime || '2026-10-15',
                                    status: 'field_survey',
                                    statusText: '监测中',
                                    contactPerson: '张经理',
                                    contactPhone: '138****8888',
                                    baselineMethodology: 'CCER-AR-001 碳汇造林方法学',
                                    leakageDeductionRate: 2.0,
                                    totalInvestment: 1000,
                                    accumulatedSequestration: 0,
                                    documents: [],
                                    timeline: [],
                                    cycleMonths: item.cycleMonths || 24,
                                  } as any);
                                }
                              }}
                              className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
                              title={item.projectName}
                            >
                              {item.projectName}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-slate-200" title={item.developer || item.monitorAgency}>
                              {item.developer || item.monitorAgency}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono text-slate-200">
                            {(item.areaMu || item.monitorAreaMu || 1000).toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="text-slate-300">
                              {item.projectType}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono text-slate-200">
                            {item.cycleMonths || 10}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px] whitespace-nowrap">
                            {item.approvalTime || item.reportTime}
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-4">
                              <button
                                type="button"
                                onClick={() => setSelectedMonitoringDocItem(item)}
                                className="text-emerald-400 hover:text-emerald-300 hover:underline text-xs font-medium transition-colors"
                              >
                                项目资料
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedMonitoringActionItem(item)}
                                className="text-emerald-400 hover:text-emerald-300 hover:underline text-xs font-medium transition-colors"
                              >
                                监测
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
          </div>
        </div>
      )}

        {/* VIEW 4: 减排认定 (Emission Reduction Certification Tab - 匹配图片截图) */}
        {activeDevTab === 'reduction' && (
          <div className="space-y-5">
            {/* 1. Filter Box (筛选搜索) */}
            <div className="bg-slate-950/80 border border-emerald-900/60 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                <span className="text-sm font-bold text-white tracking-wide">筛选搜索</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
                {/* 项目名称 */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">项目名称</label>
                  <input
                    type="text"
                    placeholder="请输入项目名称..."
                    value={reductionProjectName}
                    onChange={(e) => {
                      setReductionProjectName(e.target.value);
                      setReductionCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* 开发单位 */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">开发单位</label>
                  <input
                    type="text"
                    placeholder="请输入开发单位..."
                    value={reductionDeveloper}
                    onChange={(e) => {
                      setReductionDeveloper(e.target.value);
                      setReductionCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* 项目类型 */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">项目类型</label>
                  <select
                    value={reductionTypeFilter}
                    onChange={(e) => {
                      setReductionTypeFilter(e.target.value);
                      setReductionCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">请选择</option>
                    <option value="碳汇造林">碳汇造林</option>
                    <option value="森林经营">森林经营</option>
                    <option value="竹子造林">竹子造林</option>
                    <option value="竹林经营">竹林经营</option>
                    <option value="湿地保护与恢复">湿地保护与恢复</option>
                    <option value="经济林碳汇">经济林碳汇</option>
                  </select>
                </div>

                {/* 核定状态 */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">核定状态</label>
                  <select
                    value={reductionStatusFilter}
                    onChange={(e) => {
                      setReductionStatusFilter(e.target.value);
                      setReductionCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">请选择</option>
                    <option value="通过">通过</option>
                    <option value="不通过">不通过</option>
                    <option value="第三方核定">第三方核定</option>
                    <option value="公示">公示</option>
                    <option value="国家发改委批准/备案">国家发改委批准/备案</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReductionCurrentPage(1)}
                    className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>搜索</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setReductionProjectName('');
                      setReductionDeveloper('');
                      setReductionTypeFilter('all');
                      setReductionStatusFilter('all');
                      setReductionCurrentPage(1);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Data List Table Box (数据列表) */}
            <div className="bg-slate-950/90 border border-emerald-950/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md space-y-3 p-5">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-bold text-white tracking-wide">数据列表</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  显示第 {filteredReductionRecords.length === 0 ? 0 : (reductionCurrentPage - 1) * reductionPageSize + 1} - {Math.min(reductionCurrentPage * reductionPageSize, filteredReductionRecords.length)} 条，共 {filteredReductionRecords.length} 条记录
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800/80">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-950 bg-slate-900/90 text-slate-300 font-semibold">
                      <th className="py-3.5 px-3 w-12 text-center">序号</th>
                      <th className="py-3.5 px-4 min-w-[200px]">项目名称</th>
                      <th className="py-3.5 px-4 min-w-[180px]">开发单位</th>
                      <th className="py-3.5 px-3 min-w-[100px] text-right">项目面积(亩)</th>
                      <th className="py-3.5 px-3 min-w-[110px]">项目类型</th>
                      <th className="py-3.5 px-3 min-w-[100px] text-center">项目周期(月)</th>
                      <th className="py-3.5 px-4 min-w-[150px]">批准时间</th>
                      <th className="py-3.5 px-3 min-w-[110px] text-right">核定减排量</th>
                      <th className="py-3.5 px-3 min-w-[140px] text-center">核定状态</th>
                      <th className="py-3.5 px-4 min-w-[150px]">核定时间</th>
                      <th className="py-3.5 px-4 min-w-[130px] text-center">操作</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/60">
                    {paginatedReductionRecords.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center gap-2">
                            <Award className="w-8 h-8 text-slate-600" />
                            <span>暂无符合条件的减排认定记录</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedReductionRecords.map((item, idx) => {
                        const globalIdx = (reductionCurrentPage - 1) * reductionPageSize + idx + 1;
                        return (
                          <tr
                            key={item.id}
                            className="transition-colors hover:bg-emerald-950/30 group"
                          >
                            <td className="py-3.5 px-3 text-center text-slate-400 font-mono">
                              {globalIdx}
                            </td>

                            {/* 项目名称 -> 点击进入项目详情页 */}
                            <td className="py-3.5 px-4">
                              <span
                                onClick={() => {
                                  const matched = projects.find(
                                    (p) => p.id === item.projectId || p.projectName === item.projectName
                                  );
                                  if (matched) {
                                    setDetailProject(matched);
                                  } else {
                                    setDetailProject({
                                      id: item.id || 'proj-det',
                                      projectNo: item.projectNo || 'CCER-AH-202610-01',
                                      projectName: item.projectName,
                                      projectType: (item.projectType as any) || '碳汇造林',
                                      developer: item.developer || '安徽省林业开发有限公司',
                                      locationProvince: '安徽省',
                                      locationCity: '合肥市',
                                      locationDistrict: '肥西县',
                                      locationFull: '安徽省境内项目实施地段',
                                      areaMu: item.areaMu || 1000,
                                      areaHectare: Math.round((item.areaMu || 1000) / 15),
                                      estAnnualReduction: 1.2,
                                      creditingPeriod: '2026-2046 (20年)',
                                      applyTime: item.approvalTime || '2026-10-15 11:11:11',
                                      status: 'field_survey',
                                      statusText: '减排认定中',
                                      contactPerson: '张经理',
                                      contactPhone: '138****8888',
                                      baselineMethodology: 'CCER-AR-001 碳汇造林方法学',
                                      leakageDeductionRate: 2.0,
                                      totalInvestment: 1000,
                                      accumulatedSequestration: item.approvedReduction || 0,
                                      documents: item.documents || [],
                                      timeline: [],
                                      cycleMonths: item.cycleMonths || 12,
                                    } as any);
                                  }
                                }}
                                className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer transition-colors"
                                title={item.projectName}
                              >
                                {item.projectName}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-slate-200" title={item.developer}>
                              {item.developer}
                            </td>

                            <td className="py-3.5 px-3 text-right font-mono text-slate-200">
                              {item.areaMu.toLocaleString()}
                            </td>

                            <td className="py-3.5 px-3 whitespace-nowrap text-slate-300">
                              {item.projectType}
                            </td>

                            <td className="py-3.5 px-3 text-center font-mono text-slate-200">
                              {item.cycleMonths}
                            </td>

                            <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px] whitespace-nowrap">
                              {item.approvalTime}
                            </td>

                            <td className="py-3.5 px-3 text-right font-mono text-emerald-400 font-bold">
                              {item.approvedReduction ? `${item.approvedReduction}` : ''}
                            </td>

                            <td className="py-3.5 px-3 text-center whitespace-nowrap">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                  item.auditStatusText === '通过'
                                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                                    : item.auditStatusText === '不通过'
                                    ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                                    : item.auditStatusText === '第三方核定'
                                    ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                                    : item.auditStatusText === '公示'
                                    ? 'bg-teal-950/80 text-teal-300 border-teal-700/60'
                                    : item.auditStatusText === '国家发改委批准/备案'
                                    ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}
                              >
                                {item.auditStatusText}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px] whitespace-nowrap">
                              {item.auditTime || ''}
                            </td>

                            {/* 操作列: 项目资料, 申请, 审核 */}
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedMonitoringDocItem({
                                      id: item.id,
                                      monitorNo: item.projectNo || 'RED-DOC-01',
                                      projectNo: item.projectNo || 'CCER-AH-202610-01',
                                      projectName: item.projectName,
                                      developer: item.developer,
                                      areaMu: item.areaMu,
                                      projectType: item.projectType as any,
                                      cycleMonths: item.cycleMonths,
                                      approvalTime: item.approvalTime,
                                      monitorAgency: '省级林业调查规划设计院',
                                      locationFull: '安徽省实施项目地块',
                                      monitorAreaMu: item.areaMu,
                                      monitorPeriod: '减排核算期',
                                      estAnnualReduction: 2.5,
                                      measuredIncrement: item.approvedReduction || 1000,
                                      reportTime: item.auditTime || item.approvalTime,
                                      status: 'passed',
                                      statusText: '已核定',
                                      monitorLead: '张专家',
                                      samplePlotsCount: 20,
                                      treeDensityAvg: '立木密度合格',
                                      satelliteCoverRate: '99%',
                                      documents: item.documents || [
                                        { name: `${item.projectName}减排认定报告.pdf`, size: '8.5 MB', uploadTime: item.approvalTime }
                                      ]
                                    });
                                  }}
                                  className="text-emerald-400 hover:text-emerald-300 hover:underline text-xs font-medium transition-colors"
                                >
                                  项目资料
                                </button>

                                {item.canApply && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setApplyReductionItem(item);
                                      setApplyReductionAmount('1000');
                                    }}
                                    className="text-emerald-400 hover:text-emerald-300 hover:underline text-xs font-medium transition-colors"
                                  >
                                    申请
                                  </button>
                                )}

                                {item.canAudit && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAuditReductionItem(item);
                                      setAuditReductionAmount(String(item.approvedReduction || 1000));
                                      if (
                                        item.auditStatus === 'ndrc_approved' ||
                                        item.auditStatusText.includes('发改委') ||
                                        item.auditStatusText.includes('备案')
                                      ) {
                                        setAuditStageTab('ndrc');
                                      } else if (item.auditStatus === 'publicity' || item.auditStatusText === '公示') {
                                        setAuditStageTab('publicity');
                                      } else {
                                        setAuditStageTab('third_party');
                                      }
                                    }}
                                    className="text-emerald-400 hover:text-emerald-300 hover:underline text-xs font-medium transition-colors"
                                  >
                                    审核
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

              {/* Bottom Pagination controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span>共 <span className="text-emerald-400 font-bold font-mono">{filteredReductionRecords.length}</span> 条数据</span>
                  <div className="flex items-center gap-1">
                    <span>每页</span>
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono">10</span>
                    <span>条</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  <button
                    type="button"
                    disabled={reductionCurrentPage === 1}
                    onClick={() => setReductionCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-1 bg-slate-900 border border-slate-800 rounded disabled:opacity-40 hover:bg-slate-800 text-slate-300"
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalReductionPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setReductionCurrentPage(pg)}
                      className={`px-2.5 py-1 rounded border ${
                        reductionCurrentPage === pg
                          ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={reductionCurrentPage === totalReductionPages}
                    onClick={() => setReductionCurrentPage((p) => Math.min(totalReductionPages, p + 1))}
                    className="px-2 py-1 bg-slate-900 border border-slate-800 rounded disabled:opacity-40 hover:bg-slate-800 text-slate-300"
                  >
                    &gt;
                  </button>

                  <span className="ml-2 text-slate-500">跳转</span>
                  <input
                    type="number"
                    min={1}
                    max={totalReductionPages}
                    defaultValue={reductionCurrentPage}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = parseInt((e.target as HTMLInputElement).value, 10);
                        if (!isNaN(val) && val >= 1 && val <= totalReductionPages) {
                          setReductionCurrentPage(val);
                        }
                      }
                    }}
                    className="w-10 px-1 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-slate-500">页</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: Project Details Modal ("项目详情" - Screenshots 4 & 5) */}
      {detailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <span className="text-base font-bold text-slate-800">项目详情</span>
              <button
                type="button"
                onClick={() => setDetailProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 bg-slate-50/50">
              {/* Section 1: 基本信息 */}
              <div className="bg-white border border-dashed border-emerald-300 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1 h-3.5 bg-emerald-500 rounded-full inline-block" />
                  <span className="font-bold text-slate-800 text-sm">基本信息</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-6 text-xs">
                  <div className="flex items-baseline"><span className="text-slate-500 w-20 shrink-0">项目类型:</span><span className="text-slate-800 font-medium">{detailProject.projectType || '碳汇造林'}</span></div>
                  <div className="flex items-baseline"><span className="text-slate-500 w-20 shrink-0">项目名称:</span><span className="text-slate-800 font-medium">{detailProject.projectName}</span></div>
                  <div className="flex items-baseline"><span className="text-slate-500 w-20 shrink-0">开发单位:</span><span className="text-slate-800 font-medium">{detailProject.developer || '安徽省合肥市林业局'}</span></div>
                  <div className="flex items-baseline"><span className="text-slate-500 w-20 shrink-0">项目位置:</span><span className="text-slate-800 font-medium">{detailProject.locationFull || '安徽省合肥市蜀山区科学大道森林公园'}</span></div>
                  <div className="flex items-baseline"><span className="text-slate-500 w-20 shrink-0">项目面积:</span><span className="text-slate-800 font-medium">{detailProject.areaMu || 1000} 亩</span></div>
                  <div className="flex items-baseline"><span className="text-slate-500 w-20 shrink-0">项目周期:</span><span className="text-slate-800 font-medium">{(detailProject as any).devCycleMonths || (detailProject as any).cycleMonths || '24'} 个月</span></div>
                  <div className="col-span-1 md:col-span-2 flex items-start mt-1"><span className="text-slate-500 w-20 shrink-0">项目描述:</span><span className="text-slate-700 leading-relaxed">{detailProject.projectName} 位于安徽省境内，依据 CCER 国家自愿减排造林与森林经营方法学体系开展碳汇开发，具有清晰的地类权属与良好的森林固碳增量潜力。</span></div>
                </div>
              </div>

              {/* Section 2: 项目文件 */}
              <div className="bg-white border border-dashed border-emerald-300 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1 h-3.5 bg-emerald-500 rounded-full inline-block" />
                  <span className="font-bold text-slate-800 text-sm">项目文件</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-1">
                  {[
                    { name: 'PDD材料', file: 'PDD项目设计文件.pdf' },
                    { name: '方法学', file: 'CCER林业造林碳汇方法学.pdf' },
                    { name: '碳库选择', file: '乔木层与地上生物量碳库说明.pdf' },
                    { name: '项目边界', file: '宗地边界红线GIS测绘图.shp' },
                    { name: '基线情景及额外性', file: '额外性论证分析报告.pdf' },
                    { name: '土地合格性', file: '三调地类与土地合规承诺书.pdf' },
                    { name: '土地或林权权属', file: '不动产权证及林权证明.pdf' },
                    { name: '增汇量（减排量）计算', file: '固碳增量高精度测算模型.xlsx' },
                    { name: '计入期选择', file: '20年计入期规划说明.pdf' },
                    { name: '监测计划', file: 'MRV例行监测与样地抽查计划.pdf' },
                    { name: '环境和社会经济影响', file: '环境与社会效益评估报告.pdf' },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      onClick={() => triggerToast(`正在查看【${doc.name}】(${doc.file})`)}
                      className="flex flex-col items-center justify-start p-2 rounded-lg hover:bg-blue-50/80 transition-all cursor-pointer group text-center space-y-2 border border-transparent hover:border-blue-200"
                    >
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-700 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                        {doc.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: 审核信息 */}
              <div className="bg-white border border-dashed border-emerald-300 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1 h-3.5 bg-emerald-500 rounded-full inline-block" />
                  <span className="font-bold text-slate-800 text-sm">审核信息</span>
                </div>

                <div className="space-y-4 pl-2">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-emerald-500 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">1</div>
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-emerald-600 text-xs">PDD公示</div>
                      <div><span className="text-slate-500">审核状态:</span> <span className="text-slate-800 font-medium">通过</span></div>
                      <div><span className="text-slate-500">审核意见:</span> <span className="text-slate-700">项目PDD材料齐全，地类与边界红线符合CCER合规要求，公示无异议。</span></div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                    <div className="w-6 h-6 rounded-full border-2 border-emerald-500 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">2</div>
                    <div className="space-y-2 text-xs">
                      <div className="font-bold text-emerald-600 text-xs">第三方审查</div>
                      <div><span className="text-slate-500">审核状态:</span> <span className="text-slate-800 font-medium">通过</span></div>
                      <div><span className="text-slate-500">审核意见:</span> <span className="text-slate-700">独立审定机构完成现场固定样方抽查与遥感正射影像定界，确认固碳增量数据准确无误。</span></div>
                      <div>
                        <div className="text-slate-500 mb-1.5 font-medium">项目资料:</div>
                        <div className="flex items-center gap-3">
                          {[
                            { name: '审核报告' },
                            { name: '现场审核意见' },
                            { name: '现场照片' },
                            { name: '现场照片' },
                          ].map((doc, idx) => (
                            <div
                              key={idx}
                              onClick={() => triggerToast(`正在查看【${doc.name}】`)}
                              className="flex flex-col items-center justify-center cursor-pointer group text-center space-y-1"
                            >
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                                <FileText className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] text-slate-700 group-hover:text-blue-600 font-medium">
                                {doc.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                    <div className="w-6 h-6 rounded-full border-2 border-emerald-500 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">3</div>
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-emerald-600 text-xs">发改委审核</div>
                      <div><span className="text-slate-500">审核状态:</span> <span className="text-slate-800 font-medium">通过</span></div>
                      <div><span className="text-slate-500">审核意见:</span> <span className="text-slate-700">国家主管部门终审通过，准予备案签发减排量额度。</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-white border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailProject(null)}
                className="px-5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Audit Review Modal (Matching Uploaded Screenshot: 4-Step Stepper, 基础信息, 材料核验, 审核意见) */}
      {auditProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-[#091a13] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0a1f17] border-b border-emerald-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-bold text-white tracking-wide">项目审核</span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/90 border border-emerald-800/80 px-2 py-0.5 rounded font-medium">
                      {auditProject.projectNo}
                    </span>
                    {renderStatusBadge(auditProject.status, auditProject.statusText)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    国家温室气体自愿减排（CCER）申报材料形式审查、空间权属核验与合规审批
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAuditProject(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top 4-Step Lifecycle Progress Stepper */}
            <div className="px-6 py-4 bg-[#061710] border-b border-emerald-900/50">
              <div className="flex items-center justify-between relative max-w-3xl mx-auto">
                {/* Stepper Base Line */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 -z-0" />
                <div
                  className="absolute top-4 left-6 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 -z-0 transition-all duration-300"
                  style={{
                    width:
                      auditStep === 1 ? '16%' : auditStep === 2 ? '50%' : auditStep === 3 ? '82%' : '100%',
                  }}
                />

                {/* Step 1: 项目申报 */}
                <div
                  onClick={() => setAuditStep(1)}
                  className="flex flex-col items-center relative z-10 cursor-pointer group"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                      auditStep === 1
                        ? 'bg-emerald-500 text-white border-4 border-emerald-950 ring-2 ring-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.6)]'
                        : auditStep > 1
                        ? 'bg-emerald-600 text-white border-2 border-emerald-400 shadow-emerald-950'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {auditStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <span
                    className={`text-xs font-bold mt-1.5 transition-colors ${
                      auditStep === 1 ? 'text-emerald-300' : 'text-slate-300'
                    }`}
                  >
                    1. 项目申报
                  </span>
                  <span
                    className={`text-[10px] hidden sm:inline ${
                      auditStep === 1 ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {auditStep === 1 ? '当前审核节点' : '材料初审'}
                  </span>
                </div>

                {/* Step 2: PDD公示 */}
                <div
                  onClick={() => setAuditStep(2)}
                  className="flex flex-col items-center relative z-10 cursor-pointer group"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                      auditStep === 2
                        ? 'bg-emerald-500 text-white border-4 border-emerald-950 ring-2 ring-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.6)]'
                        : auditStep > 2
                        ? 'bg-emerald-600 text-white border-2 border-emerald-400'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {auditStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                  </div>
                  <span
                    className={`text-xs font-bold mt-1.5 transition-colors ${
                      auditStep === 2 ? 'text-emerald-300' : 'text-slate-400'
                    }`}
                  >
                    2. PDD公示
                  </span>
                  <span
                    className={`text-[10px] hidden sm:inline ${
                      auditStep === 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {auditStep === 2 ? '当前审核节点' : '设计文件公示'}
                  </span>
                </div>

                {/* Step 3: 第三方审查 */}
                <div
                  onClick={() => setAuditStep(3)}
                  className="flex flex-col items-center relative z-10 cursor-pointer group"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                      auditStep === 3
                        ? 'bg-emerald-500 text-white border-4 border-emerald-950 ring-2 ring-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.6)]'
                        : auditStep > 3
                        ? 'bg-emerald-600 text-white border-2 border-emerald-400'
                        : 'bg-slate-900 text-slate-500 border border-slate-700/80'
                    }`}
                  >
                    {auditStep > 3 ? <Check className="w-4 h-4" /> : '3'}
                  </div>
                  <span
                    className={`text-xs font-medium mt-1.5 transition-colors ${
                      auditStep === 3 ? 'text-emerald-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    3. 第三方审查
                  </span>
                  <span
                    className={`text-[10px] hidden sm:inline ${
                      auditStep === 3 ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {auditStep === 3 ? '当前审定节点' : 'DOE机构审定'}
                  </span>
                </div>

                {/* Step 4: 国家发改委审核 */}
                <div
                  onClick={() => setAuditStep(4)}
                  className="flex flex-col items-center relative z-10 cursor-pointer group"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                      auditStep === 4
                        ? 'bg-emerald-500 text-white border-4 border-emerald-950 ring-2 ring-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.6)]'
                        : 'bg-slate-900 text-slate-500 border border-slate-700/80'
                    }`}
                  >
                    4
                  </div>
                  <span
                    className={`text-xs font-medium mt-1.5 transition-colors ${
                      auditStep === 4 ? 'text-emerald-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    4. 国家发改委审核
                  </span>
                  <span
                    className={`text-[10px] hidden sm:inline ${
                      auditStep === 4 ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {auditStep === 4 ? '当前备案节点' : '登记备案签发'}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Audit Body */}
            <form
              onSubmit={handlePerformAudit}
              className="flex-1 overflow-y-auto p-6 space-y-6 text-xs custom-scrollbar"
            >
              {/* SECTION 1: 基础信息 */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-emerald-950/80 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                    <span className="text-sm font-bold text-white tracking-wide">基础信息</span>
                  </div>
                  <span className="text-[11px] text-slate-400">已核对林草大数据底座及不动产登记权属</span>
                </div>

                {/* 3-column Grid for 基础信息 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3.5 bg-slate-950/60 p-4 rounded-xl border border-emerald-950/80">
                  {/* 项目名称 */}
                  <div className="md:col-span-2">
                    <span className="text-slate-400 text-[11px] block mb-1">项目名称</span>
                    <div className="text-slate-100 font-bold text-sm bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                      {auditProject.projectName}
                    </div>
                  </div>

                  {/* 项目编号 */}
                  <div>
                    <span className="text-slate-400 text-[11px] block mb-1">项目编号</span>
                    <div className="text-emerald-400 font-mono font-medium text-xs bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                      {auditProject.projectNo}
                    </div>
                  </div>

                  {/* 项目类型 */}
                  <div>
                    <span className="text-slate-400 text-[11px] block mb-1">项目类型</span>
                    <div className="text-slate-200 text-xs bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                      {auditProject.projectType}
                    </div>
                  </div>

                  {/* 申报主体 */}
                  <div>
                    <span className="text-slate-400 text-[11px] block mb-1">申报主体 / 开发企业</span>
                    <div className="text-slate-200 text-xs bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 truncate" title={auditProject.developer}>
                      {auditProject.developer}
                    </div>
                  </div>

                  {/* 法人代表 / 经办人 */}
                  <div>
                    <span className="text-slate-400 text-[11px] block mb-1">法定代表人 / 联系人</span>
                    <div className="text-slate-200 text-xs bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                      {auditProject.contactPerson} ({auditProject.contactPhone})
                    </div>
                  </div>

                  {/* 所属区域 */}
                  <div>
                    <span className="text-slate-400 text-[11px] block mb-1">实施行政区域</span>
                    <div className="text-slate-200 text-xs bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                      {auditProject.locationProvince} / {auditProject.locationCity} / {auditProject.locationDistrict}
                    </div>
                  </div>

                  {/* 详细坐落 */}
                  <div className="md:col-span-2">
                    <span className="text-slate-400 text-[11px] block mb-1">宗地坐落详细地址</span>
                    <div className="text-slate-200 text-xs bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 truncate" title={auditProject.locationFull}>
                      {auditProject.locationFull}
                    </div>
                  </div>

                  {/* 规划核定规模 */}
                  <div>
                    <span className="text-slate-400 text-[11px] block mb-1">规划核定规模 (亩)</span>
                    <div className="text-slate-100 font-mono font-bold text-xs bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                      {auditProject.areaMu.toLocaleString()} 亩 <span className="text-slate-500 font-normal font-sans">(≈ {auditProject.areaHectare} ha)</span>
                    </div>
                  </div>

                  {/* 申报时间 */}
                  <div>
                    <span className="text-slate-400 text-[11px] block mb-1">项目申报时间</span>
                    <div className="text-slate-200 font-mono text-xs bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                      {auditProject.applyTime}
                    </div>
                  </div>

                  {/* 预估年固碳量 */}
                  <div>
                    <span className="text-slate-400 text-[11px] block mb-1">预估年减排量 (tCO₂e)</span>
                    <div className="text-emerald-400 font-mono font-bold text-xs bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                      {auditProject.estAnnualReduction} 万吨 CO₂e/年
                    </div>
                  </div>

                  {/* 适用方法学 */}
                  <div className="md:col-span-2">
                    <span className="text-slate-400 text-[11px] block mb-1">遵循国家方法学导则</span>
                    <div className="text-slate-200 text-xs bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                      {auditProject.baselineMethodology}
                    </div>
                  </div>

                  {/* 计入期限 */}
                  <div>
                    <span className="text-slate-400 text-[11px] block mb-1">计入期限</span>
                    <div className="text-slate-200 text-xs bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
                      {auditProject.creditingPeriod}
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3 SPECIFIC PARAMETERS CARD */}
              {auditStep === 3 && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-emerald-950/80 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-teal-400 rounded-full" />
                      <span className="text-sm font-bold text-teal-300 tracking-wide">第三方审定与核查机构（DOE）参数</span>
                    </div>
                    <span className="text-[11px] text-slate-400">独立第三方审核机构认证资质与审定报告属性</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-teal-950/20 p-4 rounded-xl border border-teal-800/40">
                    <div>
                      <label className="text-slate-400 text-[11px] block mb-1">第三方审定机构</label>
                      <input
                        type="text"
                        value={thirdPartyAgency}
                        onChange={(e) => setThirdPartyAgency(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900/90 border border-slate-700 focus:border-teal-400 rounded-lg text-slate-200 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-[11px] block mb-1">审定组长 / 审核员</label>
                      <input
                        type="text"
                        value={thirdPartyLead}
                        onChange={(e) => setThirdPartyLead(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900/90 border border-slate-700 focus:border-teal-400 rounded-lg text-slate-200 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-[11px] block mb-1">技术审定报告统一编号</label>
                      <input
                        type="text"
                        value={thirdPartyNo}
                        onChange={(e) => setThirdPartyNo(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900/90 border border-slate-700 focus:border-teal-400 rounded-lg text-emerald-400 font-mono text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-[11px] block mb-1">现场踏勘与核验完成日</label>
                      <div className="px-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs">
                        2026-10-12
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4 SPECIFIC PARAMETERS CARD */}
              {auditStep === 4 && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-emerald-950/80 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-emerald-400 rounded-full" />
                      <span className="text-sm font-bold text-emerald-300 tracking-wide">国家发改委 / 生态环境部备案与证书编号</span>
                    </div>
                    <span className="text-[11px] text-slate-400">CCER自愿减排注册登记簿全国统一备案凭证</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-emerald-950/30 p-4 rounded-xl border border-emerald-700/50">
                    <div>
                      <label className="text-slate-400 text-[11px] block mb-1">国家发改备案文号</label>
                      <input
                        type="text"
                        value={ndrcDocNo}
                        onChange={(e) => setNdrcDocNo(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900/90 border border-slate-700 focus:border-emerald-400 rounded-lg text-emerald-300 font-mono font-bold text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-[11px] block mb-1">全国注册登记代码</label>
                      <input
                        type="text"
                        value={ndrcRegCode}
                        onChange={(e) => setNdrcRegCode(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900/90 border border-slate-700 focus:border-emerald-400 rounded-lg text-emerald-400 font-mono text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-[11px] block mb-1">备案生效与签发时间</label>
                      <div className="px-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs">
                        2026-10-15
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-400 text-[11px] block mb-1">国家备案批复部门</label>
                      <div className="px-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded-lg text-slate-200 text-xs truncate" title="国家发展和改革委员会 / 生态环境部">
                        国家发改委 / 生态环境部
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: 申报材料清单及核验 */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-emerald-950/80 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                    <span className="text-sm font-bold text-white tracking-wide">
                      {auditStep === 3
                        ? '第三方审查审定批复报告与外业核查档案'
                        : auditStep === 4
                        ? '国家发改委/生态环境部备案证明与公函'
                        : '申报材料清单及核验'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {auditStep === 3
                      ? '独立第三方审定机构报告、无人机航测记录与外业抽查档案'
                      : auditStep === 4
                      ? '自愿减排登记簿账户凭证、行政备案决定书与公示备查函'
                      : '全套备案支撑材料在线查验与合规性核对'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(auditStep === 3
                    ? [
                        { name: `【第三方审定报告】${auditProject.projectName}_Validation_Report.pdf`, size: '18.6 MB', uploadTime: '2026-10-12 14:30' },
                        { name: `【无人机样方实测】${auditProject.projectName}_外业高精度航测记录表.pdf`, size: '14.2 MB', uploadTime: '2026-10-11 10:15' },
                        { name: `【DOE机构资质】中国质量认证中心(CQC)第三方审定资质与人员证书.pdf`, size: '5.2 MB', uploadTime: '2026-10-10 16:40' },
                        { name: `【澄清与修正表】CCER项目Clarification Request (CL/FAR)闭环答复表.pdf`, size: '8.7 MB', uploadTime: '2026-10-12 11:20' },
                      ]
                    : auditStep === 4
                    ? [
                        { name: `【国家决定书】温室气体自愿减排项目备案决定书(${ndrcDocNo}).pdf`, size: '8.4 MB', uploadTime: '2026-10-15 09:00' },
                        { name: `【注册登记凭证】CCER国家自愿减排注册登记簿开户与备案编号(${ndrcRegCode}).pdf`, size: '5.2 MB', uploadTime: '2026-10-15 09:15' },
                        { name: `【公示备查函】全国自愿减排项目公示反馈与行政复议监督说明.pdf`, size: '3.8 MB', uploadTime: '2026-10-14 17:00' },
                      ]
                    : auditProject.documents && auditProject.documents.length > 0
                    ? auditProject.documents
                    : [
                        { name: `${auditProject.projectName}_发改立项批复文件.pdf`, size: '8.4 MB', uploadTime: auditProject.applyTime.slice(0, 16) },
                        { name: `${auditProject.projectName}_林地权属清晰证明及林权证.pdf`, size: '12.8 MB', uploadTime: auditProject.applyTime.slice(0, 16) },
                        { name: `${auditProject.projectName}_项目设计文件(PDD).docx`, size: '16.5 MB', uploadTime: auditProject.applyTime.slice(0, 16) },
                        { name: `${auditProject.projectName}_外业高精度矢量边界.geojson`, size: '4.2 MB', uploadTime: auditProject.applyTime.slice(0, 16) },
                        { name: `${auditProject.projectName}_碳汇量监测计划与基线调查报告.pdf`, size: '9.1 MB', uploadTime: auditProject.applyTime.slice(0, 16) },
                      ]
                  ).map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#06140e] border border-emerald-950 hover:border-emerald-700/60 rounded-xl flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="p-2 bg-emerald-950/80 rounded-lg text-emerald-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-medium text-slate-200 truncate" title={doc.name}>
                            {doc.name}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{doc.size}</span>
                            <span>·</span>
                            <span>{doc.uploadTime}</span>
                            <span className="text-emerald-400 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              已核验
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewDocModal({
                              name: doc.name,
                              size: doc.size,
                              time: doc.uploadTime,
                            })
                          }
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded text-[11px] flex items-center gap-1 border border-emerald-900/50 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>预览</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerToast(`正在下载「${doc.name}」...`)}
                          className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 transition-colors"
                          title="下载文件"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: 审核信息与审批意见 */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-emerald-950/80 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                    <span className="text-sm font-bold text-white tracking-wide">
                      {auditStep === 3
                        ? '第三方审查技术审定结论与审批批注'
                        : auditStep === 4
                        ? '国家发改委终审备案批复意见'
                        : '审核审批结论与核验批注'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">具有法定法律效力的电子审查核验书</span>
                </div>

                {/* 审核结论: 3 Radio Cards */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    <span className="text-rose-500 mr-1">*</span>
                    {auditStep === 3 ? '第三方审定结论' : auditStep === 4 ? '国家备案审批结论' : '审核结论'}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setAuditResult('pass')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        auditResult === 'pass'
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-950/80'
                          : 'bg-[#06140e] border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                          auditResult === 'pass'
                            ? 'border-emerald-400 bg-emerald-500'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {auditResult === 'pass' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-emerald-300">
                          {auditStep === 3
                            ? '审定合格（建议上报发改委备案）'
                            : auditStep === 4
                            ? '备案批准（颁发CCER项目登记证书）'
                            : '审核通过（推进至下一节点）'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {auditStep === 3
                            ? '满足CCER方法学导则，外业样方抽样与模型核算符合技术标准'
                            : auditStep === 4
                            ? '国家平台公示期满无异议，正式归入全国CCER自愿减排项目库'
                            : '形式审查合格，权属无争议，同意进入下一阶段'}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuditResult('revision')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        auditResult === 'revision'
                          ? 'bg-amber-950/80 border-amber-500 text-white shadow-lg shadow-amber-950/80'
                          : 'bg-[#06140e] border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                          auditResult === 'revision'
                            ? 'border-amber-400 bg-amber-500'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {auditResult === 'revision' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-amber-300">退回需补正材料</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {auditStep === 3
                            ? '外业样方数据或基线核算需补充现场佐证，退回DOE重核'
                            : auditStep === 4
                            ? '需地方主管部门澄清土地流转或行政公函，发回地方复核'
                            : '外业数据或权属证明不完善，要求申报单位补正重提'}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuditResult('reject')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        auditResult === 'reject'
                          ? 'bg-rose-950/80 border-rose-500 text-white shadow-lg shadow-rose-950/80'
                          : 'bg-[#06140e] border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                          auditResult === 'reject'
                            ? 'border-rose-400 bg-rose-500'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {auditResult === 'reject' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-rose-300">
                          {auditStep === 3
                            ? '审定不合格（不予出具报告）'
                            : auditStep === 4
                            ? '不予备案（终止注册流程）'
                            : '审核驳回（终止立项）'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          不符合国家自愿减排导则或存在生态保护红线冲突
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 快捷审核意见预设标签 */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">快捷引用预设审批评语：</span>
                  <div className="flex flex-wrap gap-2">
                    {(auditStep === 3
                      ? [
                          '第三方审定机构已完成现场样方抽查与数据核算，数据真实可靠，准予通过技术审定。',
                          '基线调查数据与最新无人机遥感监测吻合，计算偏差<1.8%，符合CCER审定指南。',
                          '3号样方拍摄缺乏控制点测绘公函，要求DOE机构与开发单位于5个工作日内补齐。',
                          '土地流转期限与计入期不一致，退回第三方审定机构补充法律审查报告。',
                        ]
                      : auditStep === 4
                      ? [
                          '经国家发改委/生态环境部联合会审，材料齐备合规，予以备案并颁发国家编号。',
                          '自愿减排项目符合国家碳达峰碳中和战略布局，同意纳入全国CCER注册登记簿。',
                          '公示期满无群众异议，准予正式签发《温室气体自愿减排项目备案决定书》。',
                          '项目基本信息与全国数据库存在微小偏差，退回地方发改部门出具澄清公函。',
                        ]
                      : [
                          '经核验土地权属与规划红线，无争议冲突，符合CCER造林方法学标准，同意推进。',
                          '申报主体资质合规，基准线论证与额外性分析严谨，建议进入PDD公示节点。',
                          '缺少外业无人机航测高精度矢量边界(SHP)，请申报单位于5个工作日内补齐。',
                          '土地流转期限与申报计入期不一致，退回申报单位重新签署授权文件。',
                        ]
                    ).map((phrase, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setAuditComment(phrase)}
                        className="px-2.5 py-1 bg-slate-900/90 hover:bg-emerald-950 border border-emerald-950 hover:border-emerald-600/60 rounded text-[11px] text-slate-300 hover:text-emerald-300 transition-colors"
                      >
                        + {phrase.slice(0, 16)}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* 审核核验意见书 Textarea */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    <span className="text-rose-500 mr-1">*</span>
                    {auditStep === 3
                      ? '第三方审定意见书批注'
                      : auditStep === 4
                      ? '国家发改委备案审批决定意见'
                      : '审核核验意见书'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={auditComment}
                    onChange={(e) => setAuditComment(e.target.value)}
                    placeholder="请输入详细审核核验意见，如形式审查要点、权属查验结论、合规性评价或补正具体要求..."
                    className="w-full p-3 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-xl text-slate-200 outline-none leading-relaxed transition-colors"
                  />
                </div>

                {/* 审核人与审核时间 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      {auditStep === 3 ? '第三方审定核验签署人' : auditStep === 4 ? '国家发改委备案签发人' : '审核签署人'}
                    </label>
                    <input
                      type="text"
                      value={auditReviewer}
                      onChange={(e) => setAuditReviewer(e.target.value)}
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-200 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">审核签署时间</label>
                    <input
                      type="text"
                      value={auditDate}
                      onChange={(e) => setAuditDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-200 font-mono text-xs outline-none"
                    />
                  </div>
                </div>

                {/* 审核附件上传 */}
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">审核批复附件（选填）</label>
                  <div className="p-3 border border-dashed border-slate-700/80 hover:border-emerald-500/80 rounded-xl bg-[#06140e] flex items-center justify-between text-xs transition-colors">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Paperclip className="w-4 h-4 text-emerald-400" />
                      <span>
                        {auditAttachment
                          ? `已选批复文件: ${auditAttachment.fileName} (${auditAttachment.fileSize})`
                          : auditStep === 3
                          ? '支持上传盖章版《第三方审定意见书》或《外业核查照片与样方比对表》 (.pdf, .doc)'
                          : auditStep === 4
                          ? '支持上传盖章版《国家发改委自愿减排项目备案决定书》 (.pdf, .doc)'
                          : '支持上传盖章版《项目审查核验意见书》或《专家论证会纪要》 (.pdf, .doc, .docx)'}
                      </span>
                    </div>
                    <label className="cursor-pointer px-3 py-1 bg-emerald-950 border border-emerald-700/60 hover:bg-emerald-900 rounded-lg text-emerald-300 font-medium text-xs transition-colors">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAuditAttachment({
                              fileName: file.name,
                              fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                            });
                            triggerToast(`已装配审核批复附件：「${file.name}」`);
                          }
                        }}
                      />
                      {auditAttachment ? '重新选择' : '上传附件'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Bottom Actions inside Modal */}
              <div className="pt-4 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-3 bg-[#0a1f17] -mx-6 -mb-6 p-5">
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>国家核证自愿减排量管理平台 · 审核具有全流程数字留痕</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAuditProject(null)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors text-xs"
                  >
                    取消
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerToast('审核意见已暂存至本地草稿箱');
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-medium transition-colors text-xs"
                  >
                    保存草稿
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all shadow-lg shadow-emerald-950/80 active:scale-95 text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {auditStep === 3
                        ? '确认签署第三方审定报告并推进至发改委审核'
                        : auditStep === 4
                        ? '确认签署并颁发国家CCER项目备案决定书'
                        : '确认签署并提交审核批复'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: + 新增项目申报 Modal (matching screenshots) */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-[#091a13] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-[#0a1f17] border-b border-emerald-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-white tracking-wide">新增项目申报</span>
                <span className="text-xs text-slate-400 font-normal">
                  （国家温室气体自愿减排 CCER 项目备案登记）
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              onSubmit={handleCreateProject}
              className="flex-1 overflow-y-auto p-6 space-y-6 text-xs custom-scrollbar"
            >
              {/* SECTION 1: 基础信息 */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-emerald-950/80 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                    <span className="text-sm font-bold text-white tracking-wide">基础信息</span>
                  </div>
                  <span className="text-[11px] text-slate-400">请如实填报碳汇项目基本属性信息</span>
                </div>

                {/* 3-column Grid for 基础信息 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3.5">
                  {/* 1. 项目名称 * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>项目名称
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="请输入项目名称"
                      value={newForm.projectName}
                      onChange={(e) => setNewForm({ ...newForm, projectName: e.target.value })}
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  {/* 2. 项目类型 * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>项目类型
                    </label>
                    <select
                      value={newForm.projectType}
                      onChange={(e) =>
                        setNewForm({
                          ...newForm,
                          projectType: e.target.value as ProjectRecord['projectType'],
                        })
                      }
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 outline-none transition-colors"
                    >
                      <option value="森林经营碳汇">森林经营碳汇</option>
                      <option value="造林碳汇">造林碳汇</option>
                      <option value="草原改良碳汇">草原改良碳汇</option>
                      <option value="湿地保护与恢复">湿地保护与恢复</option>
                      <option value="毛竹林增汇">毛竹林增汇</option>
                      <option value="经济林碳汇">经济林碳汇</option>
                    </select>
                  </div>

                  {/* 3. 项目代码 * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>项目代码
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="请输入项目代码"
                      value={newForm.projectCode}
                      onChange={(e) => setNewForm({ ...newForm, projectCode: e.target.value })}
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 font-mono placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  {/* 4. 申报主体 * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>申报主体
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="请输入申报主体"
                      value={newForm.developer}
                      onChange={(e) => setNewForm({ ...newForm, developer: e.target.value })}
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  {/* 5. 项目法人 * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>项目法人
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="请输入项目法人"
                      value={newForm.legalPerson}
                      onChange={(e) => setNewForm({ ...newForm, legalPerson: e.target.value })}
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  {/* 6. 联系电话 * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>联系电话
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="请输入联系电话"
                      value={newForm.contactPhone}
                      onChange={(e) => setNewForm({ ...newForm, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 font-mono placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  {/* 7. 项目位置 * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>项目位置
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="请选择项目位置"
                      value={newForm.locationRegion}
                      onChange={(e) => setNewForm({ ...newForm, locationRegion: e.target.value })}
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  {/* 8. 详细地址 * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>详细地址
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="请输入详细地址"
                      value={newForm.locationFull}
                      onChange={(e) => setNewForm({ ...newForm, locationFull: e.target.value })}
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  {/* 9. 规划面积(亩) * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>规划面积(亩)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="请输入规划面积"
                      value={newForm.areaMu}
                      onChange={(e) => setNewForm({ ...newForm, areaMu: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 font-mono placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  {/* 10. 申报时间 * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>申报时间
                    </label>
                    <input
                      type="date"
                      required
                      value={newForm.applyDate}
                      onChange={(e) => setNewForm({ ...newForm, applyDate: e.target.value })}
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 font-mono outline-none transition-colors"
                    />
                  </div>

                  {/* 11. 计入期(年) * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>计入期(年)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="请输入计入期(年)"
                      value={newForm.creditingPeriod}
                      onChange={(e) =>
                        setNewForm({ ...newForm, creditingPeriod: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 font-mono placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  {/* 12. 预估年减排量(tCO2e) * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>预估年减排量(tCO₂e)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="请输入预估年减排量"
                      value={newForm.estAnnualReduction}
                      onChange={(e) =>
                        setNewForm({
                          ...newForm,
                          estAnnualReduction: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 font-mono placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  {/* 13. 方法学类型 * */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      <span className="text-rose-500 mr-1">*</span>方法学类型
                    </label>
                    <select
                      value={newForm.baselineMethodology}
                      onChange={(e) =>
                        setNewForm({ ...newForm, baselineMethodology: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 outline-none transition-colors truncate"
                    >
                      <option value="CCER-FM-002 森林经营碳汇方法学(V02)">
                        CCER-FM-002 森林经营碳汇方法学(V02)
                      </option>
                      <option value="CCER-AR-001 造林碳汇方法学(V03)">
                        CCER-AR-001 造林碳汇方法学(V03)
                      </option>
                      <option value="CCER-BM-001 竹林造林与抚育碳汇方法学">
                        CCER-BM-001 竹林造林与抚育碳汇方法学
                      </option>
                      <option value="CCER-WM-001 湿地保护与恢复碳汇方法学">
                        CCER-WM-001 湿地保护与恢复碳汇方法学
                      </option>
                      <option value="CCER-GM-001 草原改良碳汇方法学">
                        CCER-GM-001 草原改良碳汇方法学
                      </option>
                      <option value="CCER-AG-001 农田温室气体减排方法学">
                        CCER-AG-001 农田温室气体减排方法学
                      </option>
                    </select>
                  </div>

                  {/* 14. 开发周期(月) */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">开发周期(月)</label>
                    <input
                      type="number"
                      placeholder="请输入开发周期"
                      value={newForm.devCycleMonths}
                      onChange={(e) =>
                        setNewForm({ ...newForm, devCycleMonths: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 font-mono placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  {/* 15. 总投资估算(万元) */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      总投资估算(万元)
                    </label>
                    <input
                      type="number"
                      placeholder="请输入总投资估算"
                      value={newForm.totalInvestment}
                      onChange={(e) =>
                        setNewForm({ ...newForm, totalInvestment: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-100 font-mono placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  {/* 16. 项目简述 (全宽 col-span-3) */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-300 font-medium">项目简述</label>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {newForm.projectDesc.length} / 500
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={500}
                      placeholder="请输入项目基本情况、建设内容及生态碳汇效益简述..."
                      value={newForm.projectDesc}
                      onChange={(e) =>
                        setNewForm({ ...newForm, projectDesc: e.target.value })
                      }
                      className="w-full p-2.5 bg-[#05130d] border border-slate-700/80 focus:border-emerald-500 rounded-lg text-slate-200 placeholder-slate-500 outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: 项目文件 */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between border-b border-emerald-950/80 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                    <span className="text-sm font-bold text-white tracking-wide">项目文件</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOneClickFillAllDocs}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-md text-[11px] font-medium transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>一键填入全套规范材料</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomDoc(true)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-md text-[11px] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>新增补充材料</span>
                    </button>
                  </div>
                </div>

                {/* Info banner */}
                <div className="flex items-start gap-2 p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-[11px] text-slate-400">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    提示：请上传真实有效加盖公章的PDF或矢量图层文件，单个文件大小不超过
                    50MB；支持批量上传与在线预览。
                  </span>
                </div>

                {/* Modal for adding custom doc */}
                {showAddCustomDoc && (
                  <div className="p-3 bg-[#0a2016] border border-emerald-700/60 rounded-lg flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="请输入新增材料名称，如：村级民主议事决议公证函"
                      value={customDocName}
                      onChange={(e) => setCustomDocName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#04110a] border border-slate-700 rounded-md text-slate-200 text-xs focus:border-emerald-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomDoc}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold"
                    >
                      确定添加
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomDoc(false)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-md text-xs"
                    >
                      取消
                    </button>
                  </div>
                )}

                {/* File items list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {docList.map((doc, index) => {
                    const isUploaded = !!doc.uploadedFile;
                    return (
                      <div
                        key={doc.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isUploaded
                            ? 'bg-[#081e14] border-emerald-600/50 shadow-sm'
                            : 'bg-[#06150e] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Doc Title & Status Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200 truncate pr-2">
                            <span className="text-[11px] font-mono text-emerald-500 font-bold shrink-0">
                              {String(index + 1).padStart(2, '0')}.
                            </span>
                            {doc.required && (
                              <span className="text-rose-500 mr-0.5">*</span>
                            )}
                            <span className="truncate" title={doc.name}>
                              {doc.name}
                            </span>
                          </div>
                          {isUploaded ? (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full shrink-0">
                              <Check className="w-3 h-3 text-emerald-400" />
                              已上传
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full shrink-0">
                              待上传
                            </span>
                          )}
                        </div>

                        {/* Uploaded View or Dropzone */}
                        {isUploaded ? (
                          <div className="p-2.5 bg-[#04110b] border border-emerald-900/60 rounded-lg flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-md bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-center shrink-0 text-emerald-400 font-bold text-[10px]">
                                {doc.uploadedFile!.fileName.endsWith('.shp')
                                  ? 'SHP'
                                  : doc.uploadedFile!.fileName.endsWith('.zip')
                                    ? 'ZIP'
                                    : 'PDF'}
                              </div>
                              <div className="min-w-0">
                                <div
                                  className="text-xs text-white truncate font-medium"
                                  title={doc.uploadedFile!.fileName}
                                >
                                  {doc.uploadedFile!.fileName}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {doc.uploadedFile!.fileSize} · {doc.uploadedFile!.uploadTime}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewDocModal({
                                    name: doc.uploadedFile!.fileName,
                                    size: doc.uploadedFile!.fileSize,
                                    time: doc.uploadedFile!.uploadTime,
                                  })
                                }
                                className="p-1.5 hover:bg-emerald-950/80 text-emerald-300 rounded transition-colors"
                                title="在线预览"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <label
                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded cursor-pointer transition-colors"
                                title="重新上传"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => handleFileSelect(doc.id, e)}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(doc.id)}
                                className="p-1.5 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded transition-colors"
                                title="删除"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative group border border-dashed border-slate-700 hover:border-emerald-500 rounded-lg p-3 text-center transition-colors bg-[#030d08]">
                            <input
                              type="file"
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                              onChange={(e) => handleFileSelect(doc.id, e)}
                            />
                            <div className="flex flex-col items-center justify-center pointer-events-none">
                              <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors mb-1" />
                              <div className="text-xs text-slate-300 group-hover:text-emerald-300 font-medium">
                                点击上传文件 或 将文件拖拽至此
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                支持扩展名：.pdf, .doc, .docx, .zip, .shp，不超过50MB
                              </div>
                            </div>
                            {/* Quick fill shortcut button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickUploadSample(doc.id);
                              }}
                              className="absolute right-2 bottom-1.5 z-20 text-[10px] text-emerald-400/80 hover:text-emerald-300 underline underline-offset-2"
                            >
                              填入示例
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-4 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    带 <span className="text-rose-500 font-bold">*</span> 号为申报必填项目，提交后将置于近期首位并进入初审节点。
                  </span>
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsNewProjectModalOpen(false)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/80 text-emerald-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    保存草稿
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-950 transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>提交申报</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#081812] border border-emerald-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 border-b border-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate max-w-md">
                    {previewDocModal.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {previewDocModal.size} · {previewDocModal.time}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 bg-[#040e09] flex flex-col items-center justify-center min-h-[300px] text-center relative overflow-hidden">
              {/* Document preview container */}
              <div className="w-full max-w-md p-6 bg-slate-900/90 border border-slate-800 rounded-lg shadow-inner relative text-left space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-emerald-400">
                    国家温室气体自愿减排交易申报材料
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">VERIFIED</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  本项目属于国家发改委及生态环境部核准的森林经营/增汇减排范畴。申报主体所提交的林权证明、现场实测样方数据与项目设计文件（PDD）经形式审查已在线归档入库。
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                  <div>核验材料编码: CCER-DOC-AH202610-889</div>
                  <div>数字签名摘要: SHA256-62A89F... VALID</div>
                  <div>审核受理窗口: 安徽省生态环境碳汇业务受理平台</div>
                </div>
                <div className="pt-2 text-right">
                  <span className="inline-block px-3 py-1 bg-emerald-950 border border-emerald-700 text-emerald-400 text-[10px] rounded font-bold">
                    ● 已通过预审电子签章
                  </span>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-950 border-t border-emerald-950 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerToast(`已下载材料副本「${previewDocModal.name}」`);
                  setPreviewDocModal(null);
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-950"
              >
                下载材料副本
              </button>
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Delete Single Confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-900/80 rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <span className="text-sm font-bold text-white">确认撤销并删除该项目申报？</span>
            </div>
            <p className="text-slate-300">
              此操作将同步注销该项目在全生命周期节点内的全部监测样地与草案数据，撤销后不可恢复。
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProject(deleteConfirmId)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-lg shadow-rose-950"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Quick Edit Modal */}
      {editProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-sm font-bold text-white">修改申报参数</span>
              <button
                type="button"
                onClick={() => setEditProject(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">项目名称</label>
                <input
                  type="text"
                  value={editProject.projectName}
                  onChange={(e) =>
                    setEditProject({ ...editProject, projectName: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">规划面积 (亩)</label>
                  <input
                    type="number"
                    value={editProject.areaMu}
                    onChange={(e) =>
                      setEditProject({
                        ...editProject,
                        areaMu: Number(e.target.value),
                        areaHectare: Number((Number(e.target.value) / 15).toFixed(1)),
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">预估年固碳 (万吨)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editProject.estAnnualReduction}
                    onChange={(e) =>
                      setEditProject({
                        ...editProject,
                        estAnnualReduction: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">联系人与电话</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editProject.contactPerson}
                    onChange={(e) =>
                      setEditProject({ ...editProject, contactPerson: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={editProject.contactPhone}
                    onChange={(e) =>
                      setEditProject({ ...editProject, contactPhone: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditProject(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setProjects((prev) =>
                    prev.map((p) => (p.id === editProject.id ? editProject : p))
                  );
                  setEditProject(null);
                  triggerToast('已保存项目修改信息');
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
              >
                保存变更
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Project Monitoring Details Modal ("项目资料") */}
      {selectedMonitoringDocItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-[#091a13] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0a1f17] border-b border-emerald-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-emerald-300">
                  项目资料
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  ({selectedMonitoringDocItem.projectName})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMonitoringDocItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200 bg-[#061710]">
              {/* Section 1: 申报资料 */}
              <div className="bg-slate-950/70 border border-dashed border-emerald-900/50 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-emerald-500 rounded-full inline-block" />
                  <span className="font-bold text-emerald-300 text-sm">申报资料</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-1">
                  {[
                    { name: 'PDD材料', file: 'PDD项目设计文件.pdf' },
                    { name: '方法学', file: 'CCER林业造林碳汇方法学.pdf' },
                    { name: '碳库选择', file: '乔木层与地上生物量碳库说明.pdf' },
                    { name: '项目边界', file: '宗地边界红线GIS测绘图.shp' },
                    { name: '基线情景及额外性', file: '额外性论证分析报告.pdf' },
                    { name: '土地合格性', file: '三调地类与土地合规承诺书.pdf' },
                    { name: '土地或林权权属', file: '不动产权证及林权证明.pdf' },
                    { name: '增汇量（减排量）计算', file: '固碳增量高精度测算模型.xlsx' },
                    { name: '计入期选择', file: '20年计入期规划说明.pdf' },
                    { name: '监测计划', file: 'MRV例行监测与样地抽查计划.pdf' },
                    { name: '环境和社会经济影响', file: '环境与社会效益评估报告.pdf' },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      onClick={() => triggerToast(`正在调阅【${doc.name}】(${doc.file})`)}
                      className="flex flex-col items-center justify-start p-2 rounded-lg bg-slate-900 hover:bg-emerald-950/80 transition-all cursor-pointer group text-center space-y-2 border border-emerald-900/40 hover:border-emerald-500"
                    >
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/50 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-300 group-hover:text-emerald-300 transition-colors leading-tight line-clamp-2">
                        {doc.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: 审核资料 */}
              <div className="bg-slate-950/70 border border-dashed border-emerald-900/50 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-emerald-500 rounded-full inline-block" />
                  <span className="font-bold text-emerald-300 text-sm">审核资料</span>
                </div>

                <div className="text-xs text-slate-400 font-medium pl-1">
                  第三方审查:
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-1">
                  {[
                    { name: '审核报告', file: '第三方独立审定与核查报告.pdf' },
                    { name: '现场审核意见', file: '专家组现场抽样核查意见表.pdf' },
                    { name: '现场照片', file: '样地方位角现场核验照片01.jpg' },
                    { name: '现场照片', file: '无人机航拍无人地带样方照片02.jpg' },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      onClick={() => triggerToast(`正在查看第三方审核文件【${doc.name}】`)}
                      className="flex flex-col items-center justify-start p-2 rounded-lg bg-slate-900 hover:bg-emerald-950/80 transition-all cursor-pointer group text-center space-y-2 border border-emerald-900/40 hover:border-emerald-500"
                    >
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/50 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-300 group-hover:text-emerald-300 transition-colors leading-tight line-clamp-2">
                        {doc.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-[#0a1f17] border-t border-emerald-900/60 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedMonitoringDocItem(null)}
                className="px-5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 监测列表弹窗 (Screenshot 1) */}
      {selectedMonitoringActionItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl bg-[#091a13] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-[#0a1f17] border-b border-emerald-900/60 flex items-center justify-between">
              <span className="text-base font-bold text-emerald-300">监测</span>
              <button
                type="button"
                onClick={() => setSelectedMonitoringActionItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-200 bg-[#061710]">
              {/* Top right [新增监测] button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsNewMonitoringModalOpen(true)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs shadow-sm transition-colors"
                >
                  新增监测
                </button>
              </div>

              {/* Table */}
              <div className="bg-slate-950/70 border border-emerald-900/60 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 text-slate-300 font-semibold border-b border-emerald-900/60">
                      <th className="py-3 px-4 w-16 text-center">序号</th>
                      <th className="py-3 px-4 w-48">监测时间</th>
                      <th className="py-3 px-4">监测描述</th>
                      <th className="py-3 px-4 w-28 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950">
                    {[
                      { id: 1, time: '2026-10-15 11:30:00', desc: `${selectedMonitoringActionItem.projectName || '碳汇项目'}第三季度固定样方每木胸径与树高复测，固碳增量符合预估` },
                      { id: 2, time: '2026-10-14 16:45:20', desc: '无人机高分辨率DOM正射影像覆盖测绘与郁闭度对比分析' },
                      { id: 3, time: '2026-10-12 09:20:15', desc: '林地土壤有机碳库多点取样与实验室理化指标核测' },
                      { id: 4, time: '2026-10-10 15:10:00', desc: '项目边界空间红线现场踏勘与卫星遥感定界核验' },
                      { id: 5, time: '2026-10-08 14:00:30', desc: '第三方独立审定机构外业抽样例行巡检与现场核查' },
                      { id: 6, time: '2026-10-05 10:30:00', desc: '第二季度例行监测数据汇总报送与碳汇增量测算校核' },
                      { id: 7, time: '2026-09-28 16:00:00', desc: '林木长势健康度、病虫害防控及蓄积量动态监控' },
                    ].map((row) => (
                      <tr key={row.id} className="hover:bg-emerald-950/40 transition-colors">
                        <td className="py-3.5 px-4 text-center text-slate-400">{row.id}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-200">{row.time}</td>
                        <td className="py-3.5 px-4 text-slate-300">{row.desc}</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setAttachmentManagementItem(selectedMonitoringActionItem)}
                            className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium text-xs transition-colors"
                          >
                            附件管理
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Pagination */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span>共 <strong className="text-emerald-400 font-normal">2000</strong> 条数据</span>
                  <span>每页</span>
                  <select className="px-2 py-0.5 bg-slate-900 border border-emerald-900/60 rounded text-xs text-slate-200">
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                  <span>条</span>
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  <button type="button" className="px-2 py-1 bg-slate-900 border border-emerald-900/60 rounded text-slate-500">&lt;</button>
                  <button type="button" className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold">1</button>
                  <button type="button" className="px-2.5 py-1 bg-slate-900 border border-emerald-900/60 rounded text-slate-300">2</button>
                  <button type="button" className="px-2.5 py-1 bg-slate-900 border border-emerald-900/60 rounded text-slate-300">3</button>
                  <button type="button" className="px-2.5 py-1 bg-slate-900 border border-emerald-900/60 rounded text-slate-300">4</button>
                  <button type="button" className="px-2.5 py-1 bg-slate-900 border border-emerald-900/60 rounded text-slate-300">5</button>
                  <span>...</span>
                  <button type="button" className="px-2.5 py-1 bg-slate-900 border border-emerald-900/60 rounded text-slate-300">20</button>
                  <button type="button" className="px-2 py-1 bg-slate-900 border border-emerald-900/60 rounded text-slate-500">&gt;</button>
                  <span className="ml-2 text-slate-400">跳转</span>
                  <input type="text" className="w-10 px-1 py-0.5 bg-slate-900 border border-emerald-900/60 rounded text-center text-xs text-slate-100" />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 新增监测弹窗 (Screenshot 2) */}
      {isNewMonitoringModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#091a13] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-[#0a1f17] border-b border-emerald-900/60 flex items-center justify-between">
              <span className="text-base font-bold text-emerald-300">新增监测</span>
              <button
                type="button"
                onClick={() => setIsNewMonitoringModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewMonitoringModalOpen(false);
                triggerToast('监测数据新增成功！');
              }}
              className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200 bg-[#061710]"
            >
              {/* Section 1: 监测信息 */}
              <div className="bg-slate-950/70 border border-dashed border-emerald-900/50 rounded-xl p-4 shadow-sm space-y-4">
                <div className="font-bold text-emerald-400 text-xs">监测信息</div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    <span className="text-rose-400 mr-1">*</span>监测时间
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={newMonitorTime}
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                      placeholder="请选择监测时间"
                      className="w-full px-3 py-2 bg-slate-900 border border-emerald-900/60 rounded-lg text-slate-100 text-xs outline-none focus:border-emerald-500 cursor-pointer pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/80 rounded transition-colors"
                      title="点击弹窗选择监测时间"
                    >
                      <Clock className="w-4 h-4" />
                    </button>

                    {/* Popover Date & Time Picker Window */}
                    {isDatePickerOpen && (
                      <div className="absolute top-full left-0 mt-2 z-50 w-80 bg-[#091a13] border border-emerald-500/50 rounded-2xl shadow-2xl p-4 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60 mb-3">
                          <span className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            选择监测时间
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsDatePickerOpen(false)}
                            className="text-slate-400 hover:text-emerald-300 p-1 rounded-md hover:bg-emerald-950/50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Calendar Month & Year Selector */}
                        <div className="flex items-center justify-between px-2 py-1 bg-slate-900 rounded-lg mb-3 border border-emerald-900/50">
                          <button
                            type="button"
                            onClick={() => {
                              if (pickerMonth === 1) {
                                setPickerMonth(12);
                                setPickerYear(pickerYear - 1);
                              } else {
                                setPickerMonth(pickerMonth - 1);
                              }
                            }}
                            className="p-1 hover:bg-emerald-950 rounded text-slate-300 text-xs font-bold"
                          >
                            &lt;
                          </button>
                          <span className="font-bold font-mono text-xs text-slate-100">
                            {pickerYear} 年 {pickerMonth < 10 ? `0${pickerMonth}` : pickerMonth} 月
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (pickerMonth === 12) {
                                setPickerMonth(1);
                                setPickerYear(pickerYear + 1);
                              } else {
                                setPickerMonth(pickerMonth + 1);
                              }
                            }}
                            className="p-1 hover:bg-emerald-950 rounded text-slate-300 text-xs font-bold"
                          >
                            &gt;
                          </button>
                        </div>

                        {/* Days Grid Header */}
                        <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 mb-1">
                          <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
                        </div>

                        {/* Calendar Days Matrix (1 to 31) */}
                        <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs mb-3">
                          {Array.from({ length: (pickerMonth === 10 && pickerYear === 2026) ? 4 : 2 }).map((_, i) => (
                            <div key={`empty-${i}`} className="p-1 text-slate-700"></div>
                          ))}
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                            const isSelected = day === pickerDay;
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => setPickerDay(day)}
                                className={`py-1 rounded-lg transition-all font-medium text-xs ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                                    : 'hover:bg-emerald-950/80 text-slate-200'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>

                        {/* Time Selection Row */}
                        <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between gap-2 mb-3">
                          <span className="text-slate-400 text-xs font-medium">时间选择:</span>
                          <div className="flex items-center gap-1.5">
                            <select
                              value={pickerHour}
                              onChange={(e) => setPickerHour(e.target.value)}
                              className="px-2 py-1 bg-slate-900 border border-emerald-900/60 rounded text-xs font-mono font-medium outline-none text-slate-100 focus:border-emerald-500 cursor-pointer"
                            >
                              {Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`)).map((h) => (
                                <option key={h} value={h}>{h} 时</option>
                              ))}
                            </select>
                            <span className="font-bold text-slate-400">:</span>
                            <select
                              value={pickerMinute}
                              onChange={(e) => setPickerMinute(e.target.value)}
                              className="px-2 py-1 bg-slate-900 border border-emerald-900/60 rounded text-xs font-mono font-medium outline-none text-slate-100 focus:border-emerald-500 cursor-pointer"
                            >
                              {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => (
                                <option key={m} value={m}>{m} 分</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Quick Shortcut Pills */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <button
                            type="button"
                            onClick={() => {
                              setPickerYear(2026);
                              setPickerMonth(10);
                              setPickerDay(15);
                              setPickerHour('11');
                              setPickerMinute('30');
                            }}
                            className="px-2 py-1 bg-slate-900 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 text-[11px] rounded-md transition-colors border border-emerald-900/50"
                          >
                            此刻
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPickerYear(2026);
                              setPickerMonth(10);
                              setPickerDay(14);
                              setPickerHour('09');
                              setPickerMinute('00');
                            }}
                            className="px-2 py-1 bg-slate-900 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 text-[11px] rounded-md transition-colors border border-emerald-900/50"
                          >
                            昨天
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPickerYear(2026);
                              setPickerMonth(10);
                              setPickerDay(12);
                              setPickerHour('14');
                              setPickerMinute('15');
                            }}
                            className="px-2 py-1 bg-slate-900 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 text-[11px] rounded-md transition-colors border border-emerald-900/50"
                          >
                            3天前
                          </button>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-900/60">
                          <button
                            type="button"
                            onClick={() => setIsDatePickerOpen(false)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs transition-colors border border-slate-800"
                          >
                            取消
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const mStr = pickerMonth < 10 ? `0${pickerMonth}` : `${pickerMonth}`;
                              const dStr = pickerDay < 10 ? `0${pickerDay}` : `${pickerDay}`;
                              setNewMonitorTime(`${pickerYear}-${mStr}-${dStr} ${pickerHour}:${pickerMinute}:00`);
                              setIsDatePickerOpen(false);
                            }}
                            className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs shadow-sm transition-colors"
                          >
                            确定
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    <span className="text-rose-400 mr-1">*</span>监测描述
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      placeholder="请输入监测描述"
                      className="w-full px-3 py-2 bg-slate-900 border border-emerald-900/60 rounded-lg text-slate-100 placeholder-slate-500 text-xs outline-none focus:border-emerald-500 resize-none"
                    />
                    <div className="absolute right-3 bottom-2 text-[10px] text-slate-500 font-mono">0/500</div>
                  </div>
                </div>
              </div>

              {/* Section 2: 监测资料 */}
              <div className="bg-slate-950/70 border border-dashed border-emerald-900/50 rounded-xl p-4 shadow-sm space-y-4">
                <div className="font-bold text-emerald-400 text-xs flex items-center justify-between">
                  <span>监测资料</span>
                  <span className="text-[10px] text-emerald-400/80 font-normal">点击虚线框可真实上传本地文件</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 监测方法 */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">
                      <span className="text-rose-400 mr-1">*</span>监测方法
                    </label>
                    <input
                      type="file"
                      id="file-upload-method"
                      className="hidden"
                      multiple
                      onChange={(e) => handleFileSelection(e, setMethodFiles, '监测方法')}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      {methodFiles.map((file) => (
                        <div key={file.id} className="relative group w-24 h-20 bg-slate-900 border border-emerald-900/60 rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-sm">
                          <button
                            type="button"
                            onClick={() => setMethodFiles((prev) => prev.filter((f) => f.id !== file.id))}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 shadow-md transition-opacity"
                            title="删除文件"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <FileText className={`w-6 h-6 ${file.type === 'word' ? 'text-blue-400' : file.type === 'pdf' ? 'text-rose-400' : 'text-sky-400'}`} />
                          <span className="text-[10px] font-bold text-slate-200 truncate w-full mt-1" title={file.name}>{file.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{file.size}</span>
                        </div>
                      ))}
                      <label
                        htmlFor="file-upload-method"
                        className="w-24 h-20 border-2 border-dashed border-emerald-800 hover:border-emerald-500 hover:bg-emerald-950/60 rounded-lg bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer transition-all group"
                      >
                        <Plus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-emerald-400 font-medium mt-0.5">上传方法</span>
                      </label>
                    </div>
                  </div>

                  {/* 监测报告 */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">
                      <span className="text-rose-400 mr-1">*</span>监测报告
                    </label>
                    <input
                      type="file"
                      id="file-upload-report"
                      className="hidden"
                      multiple
                      onChange={(e) => handleFileSelection(e, setReportFiles, '监测报告')}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      {reportFiles.map((file) => (
                        <div key={file.id} className="relative group w-24 h-20 bg-slate-900 border border-emerald-900/60 rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-sm">
                          <button
                            type="button"
                            onClick={() => setReportFiles((prev) => prev.filter((f) => f.id !== file.id))}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 shadow-md transition-opacity"
                            title="删除文件"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <FileText className="w-6 h-6 text-rose-400" />
                          <span className="text-[10px] font-bold text-slate-200 truncate w-full mt-1" title={file.name}>{file.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{file.size}</span>
                        </div>
                      ))}
                      <label
                        htmlFor="file-upload-report"
                        className="w-24 h-20 border-2 border-dashed border-emerald-800 hover:border-emerald-500 hover:bg-emerald-950/60 rounded-lg bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer transition-all group"
                      >
                        <Plus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-emerald-400 font-medium mt-0.5">上传报告</span>
                      </label>
                    </div>
                  </div>

                  {/* 其他附件 */}
                  <div className="col-span-2">
                    <label className="block text-slate-300 font-medium mb-1.5">
                      <span className="text-rose-400 mr-1">*</span>其他附件
                    </label>
                    <input
                      type="file"
                      id="file-upload-other"
                      className="hidden"
                      multiple
                      onChange={(e) => handleFileSelection(e, setOtherFiles, '其他附件')}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      {otherFiles.map((file) => (
                        <div key={file.id} className="relative group w-24 h-20 bg-slate-900 border border-emerald-900/60 rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-sm">
                          <button
                            type="button"
                            onClick={() => setOtherFiles((prev) => prev.filter((f) => f.id !== file.id))}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 shadow-md transition-opacity"
                            title="删除文件"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <FileText className={`w-6 h-6 ${file.type === 'excel' ? 'text-emerald-400' : 'text-sky-400'}`} />
                          <span className="text-[10px] font-bold text-slate-200 truncate w-full mt-1" title={file.name}>{file.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{file.size}</span>
                        </div>
                      ))}
                      <label
                        htmlFor="file-upload-other"
                        className="w-24 h-20 border-2 border-dashed border-emerald-800 hover:border-emerald-500 hover:bg-emerald-950/60 rounded-lg bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer transition-all group"
                      >
                        <Plus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-emerald-400 font-medium mt-0.5">上传附件</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  className="px-12 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md transition-colors"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: 附件管理弹窗 (Screenshot 3) */}
      {attachmentManagementItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#091a13] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-[#0a1f17] border-b border-emerald-900/60 flex items-center justify-between">
              <span className="text-base font-bold text-emerald-300">附件管理</span>
              <button
                type="button"
                onClick={() => setAttachmentManagementItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200 bg-[#061710]">
              <div className="bg-slate-950/70 border border-dashed border-emerald-900/50 rounded-xl p-4 shadow-sm space-y-4">
                <div className="font-bold text-emerald-400 text-xs flex items-center justify-between">
                  <span>监测资料</span>
                  <span className="text-[10px] text-emerald-400/80 font-normal">可点虚线框实上传或调整文件</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 监测方法 */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">
                      <span className="text-rose-400 mr-1">*</span>监测方法
                    </label>
                    <input
                      type="file"
                      id="file-upload-att-method"
                      className="hidden"
                      multiple
                      onChange={(e) => handleFileSelection(e, setMethodFiles, '监测方法')}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      {methodFiles.map((file) => (
                        <div key={file.id} className="relative group w-20 h-20 bg-slate-900 border border-emerald-900/60 rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-sm">
                          <button
                            type="button"
                            onClick={() => setMethodFiles((prev) => prev.filter((f) => f.id !== file.id))}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 shadow-md transition-opacity"
                            title="删除文件"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <FileText className="w-7 h-7 text-sky-400" />
                          <span className="text-[10px] font-bold text-slate-200 truncate w-full mt-1" title={file.name}>{file.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{file.size}</span>
                        </div>
                      ))}
                      <label
                        htmlFor="file-upload-att-method"
                        className="w-20 h-20 border-2 border-dashed border-emerald-800 hover:border-emerald-500 hover:bg-emerald-950/60 rounded-lg bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer transition-all group"
                      >
                        <Plus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-emerald-400 font-medium mt-0.5">添加</span>
                      </label>
                    </div>
                  </div>

                  {/* 监测报告 */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">
                      <span className="text-rose-400 mr-1">*</span>监测报告
                    </label>
                    <input
                      type="file"
                      id="file-upload-att-report"
                      className="hidden"
                      multiple
                      onChange={(e) => handleFileSelection(e, setReportFiles, '监测报告')}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      {reportFiles.map((file) => (
                        <div key={file.id} className="relative group w-20 h-20 bg-slate-900 border border-emerald-900/60 rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-sm">
                          <button
                            type="button"
                            onClick={() => setReportFiles((prev) => prev.filter((f) => f.id !== file.id))}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 shadow-md transition-opacity"
                            title="删除文件"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <FileText className="w-7 h-7 text-rose-400" />
                          <span className="text-[10px] font-bold text-slate-200 truncate w-full mt-1" title={file.name}>{file.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{file.size}</span>
                        </div>
                      ))}
                      <label
                        htmlFor="file-upload-att-report"
                        className="w-20 h-20 border-2 border-dashed border-emerald-800 hover:border-emerald-500 hover:bg-emerald-950/60 rounded-lg bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer transition-all group"
                      >
                        <Plus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-emerald-400 font-medium mt-0.5">添加</span>
                      </label>
                    </div>
                  </div>

                  {/* 其他附件 */}
                  <div className="col-span-2">
                    <label className="block text-slate-300 font-medium mb-1.5">
                      <span className="text-rose-400 mr-1">*</span>其他附件
                    </label>
                    <input
                      type="file"
                      id="file-upload-att-other"
                      className="hidden"
                      multiple
                      onChange={(e) => handleFileSelection(e, setOtherFiles, '其他附件')}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      {otherFiles.map((file) => (
                        <div key={file.id} className="relative group w-20 h-20 bg-slate-900 border border-emerald-900/60 rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-sm">
                          <button
                            type="button"
                            onClick={() => setOtherFiles((prev) => prev.filter((f) => f.id !== file.id))}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 shadow-md transition-opacity"
                            title="删除文件"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <FileText className={`w-7 h-7 ${file.type === 'excel' ? 'text-emerald-400' : 'text-sky-400'}`} />
                          <span className="text-[10px] font-bold text-slate-200 truncate w-full mt-1" title={file.name}>{file.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{file.size}</span>
                        </div>
                      ))}
                      <label
                        htmlFor="file-upload-att-other"
                        className="w-20 h-20 border-2 border-dashed border-emerald-800 hover:border-emerald-500 hover:bg-emerald-950/60 rounded-lg bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer transition-all group"
                      >
                        <Plus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-emerald-400 font-medium mt-0.5">添加</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setAttachmentManagementItem(null);
                    triggerToast('已保存附件管理变更');
                  }}
                  className="px-12 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md transition-colors"
                >
                  提交
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: 减排认定申请弹窗 (匹配用户最新截图) */}
      {applyReductionItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[620px] bg-[#091a13] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-emerald-500/40">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-emerald-900/60 flex items-center justify-between bg-[#0a1f17]">
              <span className="text-base font-bold text-emerald-300">申请减排认定</span>
              <button
                type="button"
                onClick={() => setApplyReductionItem(null)}
                className="p-1 rounded-md text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-8 space-y-6 text-sm text-slate-200 bg-[#061710]">
              {/* 1. 申请减排量 */}
              <div className="flex items-center gap-4">
                <label className="w-28 text-right font-normal text-slate-300 flex items-center justify-end">
                  <span className="text-rose-400 font-bold mr-1">*</span>
                  <span>申请减排量</span>
                </label>
                <div className="flex-1 flex items-stretch border border-emerald-900/60 rounded focus-within:border-emerald-500 overflow-hidden shadow-2xs">
                  <input
                    type="text"
                    value={applyReductionAmount}
                    onChange={(e) => setApplyReductionAmount(e.target.value)}
                    placeholder="请输入申请减排量"
                    className="flex-1 px-3 py-2 text-sm bg-slate-900/90 text-slate-100 placeholder-slate-500 outline-none"
                  />
                  <div className="px-4 py-2 bg-slate-950 border-l border-emerald-900/60 text-slate-400 text-sm font-medium flex items-center justify-center select-none font-mono">
                    吨
                  </div>
                </div>
              </div>

              {/* 2. 监测报告 */}
              <div className="flex items-start gap-4">
                <label className="w-28 text-right font-normal text-slate-300 flex items-center justify-end pt-2">
                  <span className="text-rose-400 font-bold mr-1">*</span>
                  <span>监测报告</span>
                </label>
                <div className="flex-1 border border-emerald-900/60 rounded-lg p-3 bg-slate-900/60 min-h-[96px] flex flex-wrap items-center gap-3">
                  {/* Upload Trigger Input */}
                  <input
                    type="file"
                    id="report-file-input"
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileSelection(e, setReportUploadFiles, '监测报告')}
                  />
                  <label
                    htmlFor="report-file-input"
                    className="w-14 h-14 border-2 border-dashed border-emerald-700 hover:border-emerald-500 bg-emerald-950/40 hover:bg-emerald-950/80 rounded-md flex items-center justify-center cursor-pointer transition-all group"
                  >
                    <Plus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </label>

                  {/* Uploaded items */}
                  {reportUploadFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-emerald-900/60 rounded-md text-xs text-slate-200 shadow-2xs"
                    >
                      <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="truncate max-w-[160px] font-medium text-slate-100">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setReportUploadFiles((prev) => prev.filter((f) => f.id !== file.id))}
                        className="text-slate-400 hover:text-rose-400 transition-colors ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. 其他附件 */}
              <div className="flex items-start gap-4">
                <label className="w-28 text-right font-normal text-slate-300 pt-2">
                  其他附件
                </label>
                <div className="flex-1 border border-emerald-900/60 rounded-lg p-3 bg-slate-900/60 min-h-[110px] flex flex-wrap items-center gap-3">
                  {/* Upload Trigger Input */}
                  <input
                    type="file"
                    id="other-file-input"
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileSelection(e, setOtherUploadFiles, '其他附件')}
                  />
                  <label
                    htmlFor="other-file-input"
                    className="w-14 h-14 border-2 border-dashed border-emerald-700 hover:border-emerald-500 bg-emerald-950/40 hover:bg-emerald-950/80 rounded-md flex items-center justify-center cursor-pointer transition-all group"
                  >
                    <Plus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </label>

                  {/* Uploaded items */}
                  {otherUploadFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-emerald-900/60 rounded-md text-xs text-slate-200 shadow-2xs"
                    >
                      <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="truncate max-w-[160px] font-medium text-slate-100">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setOtherUploadFiles((prev) => prev.filter((f) => f.id !== file.id))}
                        className="text-slate-400 hover:text-rose-400 transition-colors ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Submit Button */}
            <div className="px-6 pb-8 pt-2 bg-[#0a1f17] flex justify-center border-t border-emerald-900/60">
              <button
                type="button"
                onClick={() => {
                  setReductionRecords((prev) =>
                    prev.map((r) =>
                      r.id === applyReductionItem.id
                        ? {
                            ...r,
                            auditStatus: 'third_party',
                            auditStatusText: '第三方核定',
                            approvedReduction: parseFloat(applyReductionAmount) || 1000,
                            auditTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
                            canApply: false,
                            canAudit: true,
                          }
                        : r
                    )
                  );
                  triggerToast(`项目【${applyReductionItem.projectName}】减排认定申请已成功提交！`);
                  setApplyReductionItem(null);
                }}
                className="px-10 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: 减排认定 - 审核 (支持第三方核定、公示、国家发改委批准备案三大阶段) */}
      {auditReductionItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#091a13] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header with Stage Switcher Tabs */}
            <div className="px-6 py-3.5 bg-[#0a1f17] border-b border-emerald-900/60 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-base font-bold text-emerald-300">
                  {auditStageTab === 'ndrc'
                    ? '国家发改委批准备案'
                    : auditStageTab === 'publicity'
                    ? '公示'
                    : '第三方核定'}
                </span>
                <div className="flex items-center bg-slate-900 p-0.5 rounded-lg text-xs font-medium border border-emerald-900/60 ml-2">
                  <button
                    type="button"
                    onClick={() => setAuditStageTab('third_party')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      auditStageTab === 'third_party'
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-emerald-200'
                    }`}
                  >
                    第三方核定
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditStageTab('publicity')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      auditStageTab === 'publicity'
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-emerald-200'
                    }`}
                  >
                    公示
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditStageTab('ndrc')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      auditStageTab === 'ndrc'
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-emerald-200'
                    }`}
                  >
                    发改委批准备案
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAuditReductionItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200 bg-[#061710]">
              
              {/* Step 1: Audit Progress Steps Bar */}
              <div className="bg-slate-950/70 border border-emerald-900/60 rounded-xl p-4 shadow-xs">
                <div className="text-[11px] font-bold text-slate-400 mb-3 flex items-center justify-between">
                  <span>核定与备案处理流程</span>
                  <span className="text-emerald-400 font-semibold">
                    {auditStageTab === 'ndrc'
                      ? '阶段 4/4 : 国家发改委批准备案与登记入库'
                      : auditStageTab === 'publicity'
                      ? '阶段 3/4 : 减排认定结果公示中 (30天)'
                      : '阶段 2/4 : 第三方机构独立核验中'}
                  </span>
                </div>
                <div className="flex items-center justify-between relative px-2">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-7 h-7 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center font-bold text-xs shadow-xs">
                      ✓
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 mt-1">减排认定申请</span>
                    <span className="text-[10px] text-emerald-400">已提交</span>
                  </div>

                  {/* Line 1-2 */}
                  <div className="flex-1 h-0.5 bg-emerald-500 mx-1.5 -mt-4" />

                  {/* Step 2 */}
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        auditStageTab === 'publicity' || auditStageTab === 'ndrc'
                          ? 'bg-emerald-950 border-2 border-emerald-500 text-emerald-400 shadow-xs'
                          : 'bg-emerald-600 text-white ring-4 ring-emerald-950 shadow-sm'
                      }`}
                    >
                      {auditStageTab === 'publicity' || auditStageTab === 'ndrc' ? '✓' : '2'}
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 mt-1">第三方核定</span>
                    <span className="text-[10px] text-emerald-400">
                      {auditStageTab === 'publicity' || auditStageTab === 'ndrc' ? '已完成' : '核验中'}
                    </span>
                  </div>

                  {/* Line 2-3 */}
                  <div className={`flex-1 h-0.5 mx-1.5 -mt-4 ${auditStageTab === 'publicity' || auditStageTab === 'ndrc' ? 'bg-emerald-500' : 'bg-slate-800'}`} />

                  {/* Step 3 */}
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        auditStageTab === 'ndrc'
                          ? 'bg-emerald-950 border-2 border-emerald-500 text-emerald-400 shadow-xs'
                          : auditStageTab === 'publicity'
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-950 shadow-sm animate-pulse'
                          : 'bg-slate-900 border-2 border-slate-700 text-slate-500'
                      }`}
                    >
                      {auditStageTab === 'ndrc' ? '✓' : '3'}
                    </div>
                    <span className={`text-[11px] font-bold mt-1 ${auditStageTab === 'publicity' || auditStageTab === 'ndrc' ? 'text-slate-200' : 'text-slate-500'}`}>
                      结果公示
                    </span>
                    <span className={`text-[10px] ${auditStageTab === 'ndrc' ? 'text-emerald-400' : auditStageTab === 'publicity' ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                      {auditStageTab === 'ndrc' ? '无异议' : auditStageTab === 'publicity' ? '公示中' : '待公示'}
                    </span>
                  </div>

                  {/* Line 3-4 */}
                  <div className={`flex-1 h-0.5 mx-1.5 -mt-4 ${auditStageTab === 'ndrc' ? 'bg-emerald-500' : 'bg-slate-800'}`} />

                  {/* Step 4 */}
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        auditStageTab === 'ndrc'
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-950 shadow-sm animate-pulse'
                          : 'bg-slate-900 border-2 border-slate-700 text-slate-500'
                      }`}
                    >
                      4
                    </div>
                    <span className={`text-[11px] font-bold mt-1 ${auditStageTab === 'ndrc' ? 'text-emerald-400' : 'text-slate-500'}`}>
                      发改委批准备案
                    </span>
                    <span className={`text-[10px] ${auditStageTab === 'ndrc' ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                      {auditStageTab === 'ndrc' ? '会审备案中' : '待备案'}
                    </span>
                  </div>
                </div>
              </div>

              {/* STAGE 1: 第三方核定 界面 */}
              {auditStageTab === 'third_party' && (
                <>
                  {/* Step 2: Application Info Overview */}
                  <div className="bg-slate-950/70 border border-emerald-900/60 rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="text-xs font-bold text-slate-200 border-b border-emerald-900/60 pb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        项目与申请基础信息
                      </span>
                      <span className="text-[11px] bg-emerald-950 border border-emerald-700/60 text-emerald-300 px-2 py-0.5 rounded font-medium">
                        {auditReductionItem.auditStatusText}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-slate-300">
                      <div className="col-span-2">
                        <span className="text-slate-400 font-normal">项目名称：</span>
                        <span className="font-bold text-slate-100">{auditReductionItem.projectName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-normal">项目类型：</span>
                        <span className="font-medium text-slate-200">{auditReductionItem.projectType || '造林碳汇 (CCER)'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-normal">开发单位：</span>
                        <span className="font-medium text-slate-200">{auditReductionItem.developer || '肥西县林业局'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-normal">申请减排量：</span>
                        <span className="font-bold text-emerald-400 font-mono text-sm">{auditReductionItem.approvedReduction || 1000} 吨 (tCO₂e)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-normal">监测计量期：</span>
                        <span className="font-mono text-slate-300">2025-01-01 至 2026-06-30</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-900/60">
                      <span className="text-slate-400 text-[11px] block mb-1.5">申请提交的监测报告与支撑附件：</span>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-emerald-900/60 rounded text-[11px] text-slate-200 font-medium">
                          <FileText className="w-3.5 h-3.5 text-rose-400" />
                          <span>监测核算与估算报告.pdf</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-emerald-900/60 rounded text-[11px] text-slate-200 font-medium">
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                          <span>第三方抽样现场核实记录表.pdf</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Third-Party Verification Fields */}
                  <div className="bg-slate-950/70 border border-emerald-900/60 rounded-xl p-4 space-y-4 shadow-xs">
                    <div className="text-xs font-bold text-slate-200 border-b border-emerald-900/60 pb-2">
                      第三方机构核实与结论录入
                    </div>

                    {/* 审定/核查机构 */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1.5">
                        <span className="text-rose-400 mr-1">*</span>审定 / 核查机构名称
                      </label>
                      <input
                        type="text"
                        value={reductionThirdPartyAgency}
                        onChange={(e) => setReductionThirdPartyAgency(e.target.value)}
                        placeholder="请输入第三方独立核查机构全称"
                        className="w-full px-3 py-2 bg-slate-900 border border-emerald-900/60 rounded-md text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>

                    {/* 核定减排量 & 核查结论 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1.5">
                          <span className="text-rose-400 mr-1">*</span>第三方核定减排量
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            value={auditReductionAmount}
                            onChange={(e) => setAuditReductionAmount(e.target.value)}
                            placeholder="请输入实际核定的减排量"
                            className="w-full pl-3 pr-10 py-2 bg-slate-900 border border-emerald-900/60 rounded-md text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-bold text-sm"
                          />
                          <span className="absolute right-3 text-xs text-slate-400 font-medium pointer-events-none">
                            吨
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1.5">
                          <span className="text-rose-400 mr-1">*</span>第三方核查结论
                        </label>
                        <div className="flex items-center gap-3 pt-1">
                          <label className="flex items-center gap-1.5 cursor-pointer bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-md">
                            <input
                              type="radio"
                              name="thirdPartyStatus"
                              checked={auditReductionStatus === 'passed'}
                              onChange={() => setAuditReductionStatus('passed')}
                              className="text-emerald-500 focus:ring-emerald-500"
                            />
                            <span className="font-bold text-emerald-300 text-xs">同意通过核定</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer bg-rose-950/60 border border-rose-800/60 px-3 py-1.5 rounded-md">
                            <input
                              type="radio"
                              name="thirdPartyStatus"
                              checked={auditReductionStatus === 'not_passed'}
                              onChange={() => setAuditReductionStatus('not_passed')}
                              className="text-rose-500 focus:ring-rose-500"
                            />
                            <span className="font-bold text-rose-300 text-xs">退回修改</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 第三方核查报告盖章附件上传 */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1.5">
                        <span className="text-rose-400 mr-1">*</span>第三方核查报告及盖章文件
                      </label>
                      <input
                        type="file"
                        id="third-party-file-input"
                        className="hidden"
                        multiple
                        onChange={(e) => handleFileSelection(e, setThirdPartyFiles, '第三方核查报告')}
                      />
                      
                      <div className="border border-dashed border-emerald-900/60 rounded-lg p-3 bg-slate-900/50 flex flex-wrap items-center gap-2">
                        <label
                          htmlFor="third-party-file-input"
                          className="w-14 h-14 border-2 border-dashed border-emerald-700 hover:border-emerald-500 bg-emerald-950/40 hover:bg-emerald-950/80 rounded-md flex items-center justify-center cursor-pointer transition-all group"
                          title="点击上传第三方核查盖章文件"
                        >
                          <Plus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                        </label>

                        {thirdPartyFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-emerald-900/60 rounded-md text-xs text-slate-200 shadow-2xs"
                          >
                            <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <div className="flex flex-col max-w-[180px]">
                              <span className="truncate font-medium text-slate-100">{file.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{file.size}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setThirdPartyFiles((prev) => prev.filter((f) => f.id !== file.id))}
                              className="text-slate-400 hover:text-rose-400 transition-colors ml-1 p-0.5"
                              title="删除附件"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 核定批注意见 */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">核定意见说明与备注</label>
                      <textarea
                        rows={3}
                        value={thirdPartyRemarks}
                        onChange={(e) => setThirdPartyRemarks(e.target.value)}
                        placeholder="请输入第三方机构的复核意见与说明..."
                        className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/60 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* STAGE 2: 公示 界面 */}
              {auditStageTab === 'publicity' && (
                <>
                  {/* 公示项目与第三方核查结果摘要卡片 */}
                  <div className="bg-slate-950/70 border border-emerald-900/60 rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="text-xs font-bold text-slate-200 border-b border-emerald-900/60 pb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        公示项目与第三方核验结果
                      </span>
                      <span className="text-[11px] bg-teal-950/80 text-teal-300 border border-teal-800/60 px-2 py-0.5 rounded font-bold">
                        结果公示中 (30天)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-slate-300">
                      <div className="col-span-2">
                        <span className="text-slate-400 font-normal">公示项目名称：</span>
                        <span className="font-bold text-slate-100">{auditReductionItem.projectName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-normal">项目类型：</span>
                        <span className="font-medium text-slate-200">{auditReductionItem.projectType || '造林碳汇 (CCER)'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-normal">申报单位：</span>
                        <span className="font-medium text-slate-200">{auditReductionItem.developer || '肥西县林业局'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-normal">第三方核查机构：</span>
                        <span className="font-medium text-slate-100">{reductionThirdPartyAgency || '中碳质量认证中心有限公司'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-normal">核查认定减排量：</span>
                        <span className="font-bold text-emerald-400 font-mono text-sm">
                          {auditReductionItem.approvedReduction || parseFloat(auditReductionAmount) || 1000} 吨 (tCO₂e)
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 font-normal">公示有效期限：</span>
                        <span className="font-mono text-slate-200 font-medium">2026-10-15 至 2026-11-14 (法定工作日 30 天)</span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-emerald-900/60 space-y-1.5">
                      <span className="text-slate-400 text-[11px] block font-medium">第三方盖章报告及公示文件：</span>
                      <div className="flex flex-wrap gap-2">
                        <div
                          onClick={() => triggerToast('正在调阅【第三方独立审定与核查报告盖章件.pdf】')}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-emerald-900/60 rounded text-[11px] text-emerald-300 font-medium hover:bg-emerald-950/80 cursor-pointer transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>第三方核查报告盖章件.pdf</span>
                        </div>
                        <div
                          onClick={() => triggerToast('正在调阅【温室气体自愿减排量公示表.pdf】')}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-emerald-900/60 rounded text-[11px] text-sky-300 font-medium hover:bg-sky-950/80 cursor-pointer transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                          <span>自愿减排量认定公示表.pdf</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 公示结果与公众异议处理表单 */}
                  <div className="bg-slate-950/70 border border-emerald-900/60 rounded-xl p-4 space-y-4 shadow-xs">
                    <div className="text-xs font-bold text-slate-200 border-b border-emerald-900/60 pb-2">
                      公示结果复核与备案意见
                    </div>

                    {/* 公示结论选项 */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1.5">
                        <span className="text-rose-400 mr-1">*</span>公示审查结论
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-md">
                          <input
                            type="radio"
                            name="publicityResultRadio"
                            checked={publicityResult === 'passed'}
                            onChange={() => setPublicityResult('passed')}
                            className="text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="font-bold text-emerald-300 text-xs">同意通过公示 (无异议)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer bg-rose-950/60 border border-rose-800/60 px-3 py-1.5 rounded-md">
                          <input
                            type="radio"
                            name="publicityResultRadio"
                            checked={publicityResult === 'not_passed'}
                            onChange={() => setPublicityResult('not_passed')}
                            className="text-rose-500 focus:ring-rose-500"
                          />
                          <span className="font-bold text-rose-300 text-xs">收到异议退回修改</span>
                        </label>
                      </div>
                    </div>

                    {/* 公示完成盖章附件上传 */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1.5">
                        <span className="text-rose-400 mr-1">*</span>公示结果盖章文件及异议处理说明
                      </label>
                      <input
                        type="file"
                        id="publicity-file-input"
                        className="hidden"
                        multiple
                        onChange={(e) => handleFileSelection(e, setPublicityFiles, '公示文件')}
                      />
                      
                      <div className="border border-dashed border-emerald-900/60 rounded-lg p-3 bg-slate-900/50 flex flex-wrap items-center gap-2">
                        <label
                          htmlFor="publicity-file-input"
                          className="w-14 h-14 border-2 border-dashed border-emerald-700 hover:border-emerald-500 bg-emerald-950/40 hover:bg-emerald-950/80 rounded-md flex items-center justify-center cursor-pointer transition-all group"
                          title="点击上传公示结果盖章文件"
                        >
                          <Plus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                        </label>

                        {publicityFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-emerald-900/60 rounded-md text-xs text-slate-200 shadow-2xs"
                          >
                            <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <div className="flex flex-col max-w-[180px]">
                              <span className="truncate font-medium text-slate-100">{file.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{file.size}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPublicityFiles((prev) => prev.filter((f) => f.id !== file.id))}
                              className="text-slate-400 hover:text-rose-400 transition-colors ml-1 p-0.5"
                              title="删除文件"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 公示结果意见说明 */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">公示复核说明与备注</label>
                      <textarea
                        rows={3}
                        value={publicityRemarks}
                        onChange={(e) => setPublicityRemarks(e.target.value)}
                        placeholder="请输入公示结果与公众异议核查说明..."
                        className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/60 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* STAGE 3: 国家发改委批准备案 界面 */}
              {auditStageTab === 'ndrc' && (
                <>
                  {/* 前序核验与公示结论卡片 */}
                  <div className="bg-slate-950/70 border border-emerald-900/60 rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="text-xs font-bold text-slate-200 border-b border-emerald-900/60 pb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        项目前序审核与公示无异议证明
                      </span>
                      <span className="text-[11px] bg-emerald-950 border border-emerald-700/60 text-emerald-300 px-2 py-0.5 rounded font-bold">
                        公示完成·具备备案条件
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-slate-300">
                      <div className="col-span-2">
                        <span className="text-slate-400 font-normal">拟备案项目名称：</span>
                        <span className="font-bold text-slate-100">{auditReductionItem.projectName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-normal">项目类型：</span>
                        <span className="font-medium text-slate-200">{auditReductionItem.projectType || '造林碳汇 (CCER)'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-normal">申报单位：</span>
                        <span className="font-medium text-slate-200">{auditReductionItem.developer || '肥西县林业局'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-normal">第三方核查机构：</span>
                        <span className="font-medium text-slate-100">{reductionThirdPartyAgency || '中碳质量认证中心有限公司'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-normal">申请备案减排量：</span>
                        <span className="font-bold text-emerald-400 font-mono text-sm">
                          {auditReductionItem.approvedReduction || parseFloat(auditReductionAmount) || 1000} 吨 (tCO₂e)
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 font-normal">公示结论说明：</span>
                        <span className="text-slate-200 font-medium">30天公示期内（2026-10-15 至 2026-11-14）社会各界零有效异议，通过社会公示复核。</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-900/60 space-y-1">
                      <span className="text-slate-400 text-[11px] block font-medium">审定与公示支撑证明材料：</span>
                      <div className="flex flex-wrap gap-2">
                        <div
                          onClick={() => triggerToast('正在调阅【第三方核查报告及审核意见书.pdf】')}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-emerald-900/60 rounded text-[11px] text-emerald-300 font-medium hover:bg-emerald-950/80 cursor-pointer transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>第三方核查报告及审核意见书.pdf</span>
                        </div>
                        <div
                          onClick={() => triggerToast('正在调阅【温室气体自愿减排量公示无异议证明.pdf】')}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-emerald-900/60 rounded text-[11px] text-sky-300 font-medium hover:bg-sky-950/80 cursor-pointer transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                          <span>公示无异议证明文件.pdf</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 国家发改委会审备案表单 */}
                  <div className="bg-slate-950/70 border border-emerald-900/60 rounded-xl p-4 space-y-4 shadow-xs">
                    <div className="text-xs font-bold text-slate-200 border-b border-emerald-900/60 pb-2">
                      国家发改委会审备案与注册登记
                    </div>

                    {/* 备案批文编号 */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1.5">
                        <span className="text-rose-400 mr-1">*</span>国家发改委批准备案文号 / 登记号
                      </label>
                      <input
                        type="text"
                        value={ndrcFilingNo}
                        onChange={(e) => setNdrcFilingNo(e.target.value)}
                        placeholder="请输入国家发改委批准备案批文文号，例如：发改气候备[2026]082号"
                        className="w-full px-3 py-2 bg-slate-900 border border-emerald-900/60 rounded-md text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-medium"
                      />
                    </div>

                    {/* 核准减排量 & 备案结论 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1.5">
                          <span className="text-rose-400 mr-1">*</span>发改委核准登记减排量
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            value={ndrcApprovedAmount}
                            onChange={(e) => setNdrcApprovedAmount(e.target.value)}
                            placeholder="请输入最终批准登记的减排量"
                            className="w-full pl-3 pr-10 py-2 bg-slate-900 border border-emerald-900/60 rounded-md text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-bold text-sm"
                          />
                          <span className="absolute right-3 text-xs text-slate-400 font-medium pointer-events-none">
                            吨
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1.5">
                          <span className="text-rose-400 mr-1">*</span>发改委会审备案结论
                        </label>
                        <div className="flex items-center gap-3 pt-1">
                          <label className="flex items-center gap-1.5 cursor-pointer bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-md">
                            <input
                              type="radio"
                              name="ndrcResultRadio"
                              checked={ndrcResult === 'passed'}
                              onChange={() => setNdrcResult('passed')}
                              className="text-emerald-500 focus:ring-emerald-500"
                            />
                            <span className="font-bold text-emerald-300 text-xs">准予批准备案并登记</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer bg-rose-950/60 border border-rose-800/60 px-3 py-1.5 rounded-md">
                            <input
                              type="radio"
                              name="ndrcResultRadio"
                              checked={ndrcResult === 'not_passed'}
                              onChange={() => setNdrcResult('not_passed')}
                              className="text-rose-500 focus:ring-rose-500"
                            />
                            <span className="font-bold text-rose-300 text-xs">退回补充说明</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 批复盖章扫描件与凭证上传 (真实上传) */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1.5">
                        <span className="text-rose-400 mr-1">*</span>国家发改委批复文件及注册登记凭证
                      </label>
                      <input
                        type="file"
                        id="ndrc-file-input"
                        className="hidden"
                        multiple
                        onChange={(e) => handleFileSelection(e, setNdrcFiles, '发改委批复文件')}
                      />
                      
                      <div className="border border-dashed border-emerald-900/60 rounded-lg p-3 bg-slate-900/50 flex flex-wrap items-center gap-2">
                        <label
                          htmlFor="ndrc-file-input"
                          className="w-14 h-14 border-2 border-dashed border-emerald-700 hover:border-emerald-500 bg-emerald-950/40 hover:bg-emerald-950/80 rounded-md flex items-center justify-center cursor-pointer transition-all group"
                          title="点击上传国家发改委批复扫描件及凭证"
                        >
                          <Plus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                        </label>

                        {ndrcFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-emerald-900/60 rounded-md text-xs text-slate-200 shadow-2xs"
                          >
                            <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <div className="flex flex-col max-w-[180px]">
                              <span className="truncate font-medium text-slate-100">{file.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{file.size}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setNdrcFiles((prev) => prev.filter((f) => f.id !== file.id))}
                              className="text-slate-400 hover:text-rose-400 transition-colors ml-1 p-0.5"
                              title="删除文件"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 批准备案批注与说明 */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">批准备案会审意见与入库说明</label>
                      <textarea
                        rows={3}
                        value={ndrcRemarks}
                        onChange={(e) => setNdrcRemarks(e.target.value)}
                        placeholder="请输入发改委会审备案意见说明..."
                        className="w-full px-3 py-2 bg-slate-900/90 border border-emerald-900/60 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Modal Footer Submit Button */}
            <div className="px-6 py-4 bg-[#0a1f17] border-t border-emerald-900/60 flex justify-center flex-shrink-0">
              {auditStageTab === 'third_party' ? (
                <button
                  type="button"
                  onClick={() => {
                    setReductionRecords((prev) =>
                      prev.map((r) =>
                        r.id === auditReductionItem.id
                          ? {
                              ...r,
                              auditStatus: auditReductionStatus === 'passed' ? 'publicity' : 'not_passed',
                              auditStatusText: auditReductionStatus === 'passed' ? '公示' : '不通过',
                              approvedReduction: auditReductionStatus === 'passed' ? parseFloat(auditReductionAmount) || 1000 : null,
                              auditTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
                              canApply: auditReductionStatus !== 'passed',
                              canAudit: true,
                            }
                          : r
                      )
                    );
                    if (auditReductionStatus === 'passed') {
                      triggerToast(`已完成【${auditReductionItem.projectName}】第三方核定，并推至公示环节！`);
                      setAuditStageTab('publicity');
                    } else {
                      triggerToast(`已退回【${auditReductionItem.projectName}】的第三方核定申请。`);
                      setAuditReductionItem(null);
                    }
                  }}
                  className="px-12 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  确认核定并提交公示
                </button>
              ) : auditStageTab === 'publicity' ? (
                <button
                  type="button"
                  onClick={() => {
                    setReductionRecords((prev) =>
                      prev.map((r) =>
                        r.id === auditReductionItem.id
                          ? {
                              ...r,
                              auditStatus: publicityResult === 'passed' ? 'ndrc_approved' : 'not_passed',
                              auditStatusText: publicityResult === 'passed' ? '国家发改委批准/备案' : '不通过',
                              approvedReduction: publicityResult === 'passed' ? (r.approvedReduction || parseFloat(auditReductionAmount) || 1000) : null,
                              auditTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
                              canApply: publicityResult !== 'passed',
                              canAudit: true,
                            }
                          : r
                      )
                    );
                    if (publicityResult === 'passed') {
                      triggerToast(`已确认【${auditReductionItem.projectName}】公示无异议，并推送至国家发改委会审备案！`);
                      setAuditStageTab('ndrc');
                    } else {
                      triggerToast(`已将【${auditReductionItem.projectName}】因公示异议退回修改。`);
                      setAuditReductionItem(null);
                    }
                  }}
                  className="px-12 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  确认公示无异议并提交发改委备案
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setReductionRecords((prev) =>
                      prev.map((r) =>
                        r.id === auditReductionItem.id
                          ? {
                              ...r,
                              auditStatus: ndrcResult === 'passed' ? 'ndrc_approved' : 'not_passed',
                              auditStatusText: ndrcResult === 'passed' ? '国家发改委批准/备案' : '不通过',
                              approvedReduction: ndrcResult === 'passed' ? (parseFloat(ndrcApprovedAmount) || r.approvedReduction || 1000) : null,
                              auditTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
                              canApply: ndrcResult !== 'passed',
                              canAudit: true,
                            }
                          : r
                      )
                    );
                    if (ndrcResult === 'passed') {
                      triggerToast(`已成功完成【${auditReductionItem.projectName}】的国家发改委批准备案与资产入库登记！`);
                    } else {
                      triggerToast(`项目【${auditReductionItem.projectName}】发改委会审未通过，已退回补充材料。`);
                    }
                    setAuditReductionItem(null);
                  }}
                  className="px-12 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-md text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  确认批准备案并入库登记
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: 项目详情弹窗 (匹配用户最新上传的3张截图) */}
      {detailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-[#091a13] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0a1f17] border-b border-emerald-900/60 flex items-center justify-between flex-shrink-0">
              <span className="text-base font-bold text-emerald-300">项目详情</span>
              <button
                type="button"
                onClick={() => setDetailProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-200 bg-[#061710]">
              
              {/* SECTION 1: 基本信息 */}
              <div className="border border-dashed border-emerald-900/50 rounded-xl p-4 bg-slate-950/70 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-emerald-900/40 pb-2">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full inline-block" />
                  <span className="font-bold text-emerald-400 text-xs">基本信息</span>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs leading-relaxed">
                  <div className="flex gap-2">
                    <span className="text-slate-400 shrink-0 w-16">项目类型：</span>
                    <span className="font-medium text-slate-200">{detailProject.projectType || '碳汇造林'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-400 shrink-0 w-16">项目名称：</span>
                    <span className="font-bold text-slate-100">{detailProject.projectName}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-slate-400 shrink-0 w-16">开发单位：</span>
                    <span className="font-medium text-slate-200">{detailProject.developer || '安徽省肥西县林业局'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-400 shrink-0 w-16">项目位置：</span>
                    <span className="font-medium text-slate-200">{detailProject.locationFull || '安徽省肥西县地块'}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-slate-400 shrink-0 w-16">项目面积：</span>
                    <span className="font-medium text-slate-200 font-mono">
                      {detailProject.areaMu ? `${detailProject.areaMu} 亩` : '1000 亩'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-400 shrink-0 w-16">项目周期：</span>
                    <span className="font-medium text-slate-200 font-mono">
                      {detailProject.cycleMonths ? `${detailProject.cycleMonths} 个月` : '24 个月'}
                    </span>
                  </div>

                  <div className="col-span-2 flex gap-2 pt-1 border-t border-emerald-900/40">
                    <span className="text-slate-400 shrink-0 w-16">项目描述：</span>
                    <span className="text-slate-300 leading-relaxed font-normal">
                      {detailProject.projectName}属于国家温室气体自愿减排交易项目，采用碳汇造林方法学，符合国家林业碳汇开发标准。项目实施区域生态效应显著，具备良好的固碳增汇及生物多样性保护综合价值。
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 项目文件 */}
              <div className="border border-dashed border-emerald-900/50 rounded-xl p-4 bg-slate-950/70 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 border-b border-emerald-900/40 pb-2">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full inline-block" />
                  <span className="font-bold text-emerald-400 text-xs">项目文件</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-3 pt-1">
                  {[
                    { name: 'PDD材料', file: 'PDD项目设计文件.pdf' },
                    { name: '方法学', file: 'CCER林业造林碳汇方法学.pdf' },
                    { name: '碳库选择', file: '乔木层与地上生物量碳库说明.pdf' },
                    { name: '项目边界', file: '宗地边界红线GIS测绘图.shp' },
                    { name: '基线情景及额外性', file: '额外性论证分析报告.pdf' },
                    { name: '土地合格性', file: '三调地类与土地合规承诺书.pdf' },
                    { name: '土地或林权属', file: '不动产权证及林权证明.pdf' },
                    { name: '增汇量（减排量）计算', file: '固碳增量高精度测算模型.xlsx' },
                    { name: '计入期选择', file: '20年计入期规划说明.pdf' },
                    { name: '监测计划', file: 'MRV例行监测与样地抽查计划.pdf' },
                    { name: '环境和社会经济影响', file: '环境与社会效益评估报告.pdf' },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      onClick={() => triggerToast(`正在调阅【${doc.name}】(${doc.file})`)}
                      className="flex flex-col items-center justify-start p-2 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-emerald-900/60 hover:border-emerald-500 transition-all cursor-pointer group text-center space-y-2 shadow-2xs"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-300 group-hover:text-emerald-300 transition-colors leading-tight line-clamp-2">
                        {doc.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: 审核信息 (项目申报与初审历程) */}
              <div className="border border-dashed border-emerald-900/50 rounded-xl p-4 bg-slate-950/70 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-emerald-900/40 pb-2">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full inline-block" />
                  <span className="font-bold text-emerald-400 text-xs">审核信息</span>
                </div>

                <div className="relative pl-6 space-y-5 border-l-2 border-emerald-500 ml-3">
                  {/* 1. PDD公示 */}
                  <div className="relative space-y-1.5">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      1
                    </div>
                    <div className="font-bold text-emerald-300 text-xs">PDD公示</div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-slate-400">审核状态：</span>
                      <span className="font-semibold text-emerald-400">通过</span>
                    </div>
                    <div className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-slate-400 shrink-0">审核意见：</span>
                      <span className="text-slate-300 leading-relaxed">
                        经过省生态环境主管部门及专家组形式审查，该项目PDD设计文件符合CCER造林碳汇方法学规定，公示期满无书面异议，初审合格。
                      </span>
                    </div>
                  </div>

                  {/* 2. 第三方审查 */}
                  <div className="relative space-y-2 pt-2">
                    <div className="absolute -left-[31px] top-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      2
                    </div>
                    <div className="font-bold text-emerald-300 text-xs">第三方审查</div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-slate-400">审核状态：</span>
                      <span className="font-semibold text-emerald-400">通过</span>
                    </div>
                    <div className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-slate-400 shrink-0">审核意见：</span>
                      <span className="text-slate-300 leading-relaxed">
                        经第三方独立审定与核查机构现场核实验收，抽样覆盖率符合标准，模型参数准确，通过独立第三方审定。
                      </span>
                    </div>

                    {/* 项目资料卡片网格 */}
                    <div className="pt-1">
                      <span className="text-slate-400 text-[11px] block mb-1.5">项目资料：</span>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { name: '审核报告', file: '第三方独立审定与核查报告.pdf' },
                          { name: '现场审核意见', file: '专家组现场抽样核查意见表.pdf' },
                          { name: '现场照片', file: '样地方位角现场核验照片01.jpg' },
                          { name: '现场照片', file: '无人机航拍无人地带样方照片02.jpg' },
                        ].map((doc, idx) => (
                          <div
                            key={idx}
                            onClick={() => triggerToast(`正在调阅【${doc.name}】(${doc.file})`)}
                            className="flex flex-col items-center justify-start p-2 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-emerald-900/60 hover:border-emerald-500 transition-all cursor-pointer group text-center space-y-1.5 w-20 shadow-2xs"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-medium text-slate-300 group-hover:text-emerald-300 truncate w-full">
                              {doc.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. PDD公示 */}
                  <div className="relative space-y-1.5 pt-2">
                    <div className="absolute -left-[31px] top-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      3
                    </div>
                    <div className="font-bold text-emerald-300 text-xs">PDD公示</div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-slate-400">审核状态：</span>
                      <span className="font-semibold text-emerald-400">通过</span>
                    </div>
                    <div className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-slate-400 shrink-0">审核意见：</span>
                      <span className="text-slate-300 leading-relaxed">
                        公示期间社会公众零异议，已通过最终公示备案并具备减排量核定申请条件。
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: 减排量核定申请审核信息 (完整匹配 Screenshot 2 & 3) */}
              <div className="border border-dashed border-emerald-900/50 rounded-xl p-4 bg-slate-950/70 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-emerald-900/40 pb-2">
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full inline-block" />
                  <span className="font-bold text-emerald-400 text-xs">减排量核定申请审核信息</span>
                </div>

                <div className="relative pl-6 space-y-6 border-l-2 border-emerald-500 ml-3">
                  {/* 1. 申请 */}
                  <div className="relative space-y-2">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      1
                    </div>
                    <div className="font-bold text-emerald-300 text-xs">申请</div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-slate-400">申请减排量：</span>
                      <span className="font-bold text-emerald-400 font-mono text-xs">
                        {detailProject.accumulatedSequestration || detailProject.areaMu || 10000} 吨
                      </span>
                    </div>

                    {/* 申请资料 */}
                    <div className="pt-1">
                      <span className="text-slate-400 text-[11px] block mb-1.5">申请资料：</span>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { name: '监测报告', file: '林业碳汇监测与估算核算报告.pdf' },
                          { name: '其他附件', file: '第三方抽样现场核验记录表.pdf' },
                          { name: '其他附件', file: '样方每木测高胸径原始表.xlsx' },
                        ].map((doc, idx) => (
                          <div
                            key={idx}
                            onClick={() => triggerToast(`正在调阅【${doc.name}】(${doc.file})`)}
                            className="flex flex-col items-center justify-start p-2 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-emerald-900/60 hover:border-emerald-500 transition-all cursor-pointer group text-center space-y-1.5 w-20 shadow-2xs"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-medium text-slate-300 group-hover:text-emerald-300 truncate w-full">
                              {doc.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 2. 第三方核定 */}
                  <div className="relative space-y-2 pt-2">
                    <div className="absolute -left-[31px] top-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      2
                    </div>
                    <div className="font-bold text-emerald-300 text-xs">第三方核定</div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-slate-400">核定减排量：</span>
                      <span className="font-bold text-emerald-400 font-mono text-xs">
                        {detailProject.accumulatedSequestration || detailProject.areaMu || 10000} 吨
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-slate-400">审核状态：</span>
                      <span className="font-semibold text-emerald-400">通过</span>
                    </div>
                    <div className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-slate-400 shrink-0">审核意见：</span>
                      <span className="text-slate-300 leading-relaxed">
                        经对项目现场样方实地抽检核验，该项目计算模型参数合理，监测数据真实准确，同意通过第三方核定。
                      </span>
                    </div>

                    {/* 审核资料 */}
                    <div className="pt-1">
                      <span className="text-slate-400 text-[11px] block mb-1.5">审核资料：</span>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { name: '核定报告', file: '第三方独立审定与核查盖章报告.pdf' },
                          { name: '现场核定照片', file: '现场抽查核验照片01.jpg' },
                          { name: '现场核定照片', file: '现场测量树高照片02.jpg' },
                          { name: '其他附件', file: '第三方独立核定结论汇总表.pdf' },
                          { name: '其他附件', file: '数据计算逻辑复核记录.xlsx' },
                        ].map((doc, idx) => (
                          <div
                            key={idx}
                            onClick={() => triggerToast(`正在调阅【${doc.name}】(${doc.file})`)}
                            className="flex flex-col items-center justify-start p-2 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-emerald-900/60 hover:border-emerald-500 transition-all cursor-pointer group text-center space-y-1.5 w-20 shadow-2xs"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-medium text-slate-300 group-hover:text-emerald-300 truncate w-full">
                              {doc.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. 公示 */}
                  <div className="relative space-y-2 pt-2">
                    <div className="absolute -left-[31px] top-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      3
                    </div>
                    <div className="font-bold text-emerald-300 text-xs">公示</div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-slate-400">审核状态：</span>
                      <span className="font-semibold text-emerald-400">通过</span>
                    </div>
                    <div className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-slate-400 shrink-0">审核意见：</span>
                      <span className="text-slate-300 leading-relaxed">
                        公示期间（2026-10-15 至 2026-11-14）社会公众无异议，公示复核通过。
                      </span>
                    </div>

                    {/* 审核资料 */}
                    <div className="pt-1">
                      <span className="text-slate-400 text-[11px] block mb-1.5">审核资料：</span>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { name: '其他附件', file: '温室气体自愿减排量认定公示表.pdf' },
                          { name: '其他附件', file: '公示无异议书面证明.pdf' },
                        ].map((doc, idx) => (
                          <div
                            key={idx}
                            onClick={() => triggerToast(`正在调阅【${doc.name}】(${doc.file})`)}
                            className="flex flex-col items-center justify-start p-2 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-emerald-900/60 hover:border-emerald-500 transition-all cursor-pointer group text-center space-y-1.5 w-20 shadow-2xs"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-medium text-slate-300 group-hover:text-emerald-300 truncate w-full">
                              {doc.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. 国家发改委批准备案 */}
                  <div className="relative space-y-2 pt-2">
                    <div className="absolute -left-[31px] top-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      4
                    </div>
                    <div className="font-bold text-emerald-300 text-xs">国家发改委批准备案</div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-slate-400">核定减排量：</span>
                      <span className="font-bold text-emerald-400 font-mono text-xs">
                        {detailProject.accumulatedSequestration || detailProject.areaMu || 10000} 吨
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-slate-400">审核状态：</span>
                      <span className="font-semibold text-emerald-400">通过</span>
                    </div>
                    <div className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-slate-400 shrink-0">审核意见：</span>
                      <span className="text-slate-300 leading-relaxed">
                        经国家发展和改革委员会（或应对气候变化主管机关）会审复核，同意批准该项目减排量备案并完成资产登记。
                      </span>
                    </div>

                    {/* 审核资料 */}
                    <div className="pt-1">
                      <span className="text-slate-400 text-[11px] block mb-1.5">审核资料：</span>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { name: '核定报告', file: '发改委批准备案通知书.pdf' },
                          { name: '其他附件', file: '全国碳排放权注册登记簿凭证.pdf' },
                          { name: '其他附件', file: '最终会审批复汇总表.pdf' },
                        ].map((doc, idx) => (
                          <div
                            key={idx}
                            onClick={() => triggerToast(`正在调阅【${doc.name}】(${doc.file})`)}
                            className="flex flex-col items-center justify-start p-2 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-emerald-900/60 hover:border-emerald-500 transition-all cursor-pointer group text-center space-y-1.5 w-20 shadow-2xs"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-medium text-slate-300 group-hover:text-emerald-300 truncate w-full">
                              {doc.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
