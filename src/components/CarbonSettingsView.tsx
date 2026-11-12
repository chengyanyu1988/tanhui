import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  Search,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  Home,
  Globe,
  Users,
  Settings,
  Shield,
  ShieldCheck,
  Layers,
  Award,
  DollarSign,
  TrendingUp,
  FileText,
  UserCheck,
  Building,
  Key,
  X,
  CheckCircle,
  HelpCircle,
  Activity,
  Sliders,
  Sparkles,
  Lock,
  CreditCard,
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  iconName?: string;
  orderNum: number;
  perms: string;
  component: string;
  status: boolean; // true = 正常, false = 停用
  parentId?: string;
  children?: MenuItem[];
  updatedAt?: string;
}

interface RoleItem {
  id: string;
  roleName: string;
  roleKey: string;
  orderNum: number;
  status: boolean;
  userCount: number;
  createTime: string;
  updateTime?: string;
  remark: string;
  menuPermissions?: string[];
  dataScope?: string;
}

interface DeptItem {
  id: string;
  deptName: string;
  leader: string;
  phone: string;
  email: string;
  orderNum: number;
  status: boolean;
  createTime: string;
  updateTime?: string;
  parentId?: string;
  children?: DeptItem[];
}

interface UserItem {
  id: string;
  username: string;
  nickname: string;
  deptName: string;
  phone: string;
  roleName: string;
  status: boolean;
  loginIp?: string;
  lastLoginTime?: string;
  createTime?: string;
  email?: string;
  updateTime?: string;
}

interface CarbonSettingsViewProps {
  username?: string;
  onBackToPortal: () => void;
}

export const CarbonSettingsView: React.FC<CarbonSettingsViewProps> = ({
  username = 'admin',
  onBackToPortal,
}) => {
  // Top Active Tab: 'menu' | 'role' | 'dept' | 'user' - Default to 'user' per user request
  const [activeTab, setActiveTab] = useState<'menu' | 'role' | 'dept' | 'user'>('user');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // =========================================================================
  // 1. 菜单管理数据与状态 (Menu Management) - 严格遵循截图样式与交互
  // =========================================================================
  const INITIAL_MENU_DATA: MenuItem[] = [
    {
      id: '1',
      name: '首页',
      iconName: 'Home',
      orderNum: 1,
      perms: 'index',
      component: 'index',
      status: true,
      updatedAt: '2026-10-24 09:30:12',
    },
    {
      id: '2',
      name: '一张图',
      iconName: 'Globe',
      orderNum: 2,
      perms: 'sdyzt:index',
      component: 'module/sdyzt/index',
      status: true,
      updatedAt: '2026-10-25 14:12:08',
    },
    {
      id: '3',
      name: '产品交易',
      iconName: 'Users',
      orderNum: 3,
      perms: '',
      component: '',
      status: true,
      updatedAt: '2026-10-26 11:20:45',
      children: [
        {
          id: '3-1',
          name: '企业入驻',
          orderNum: 1,
          perms: 'bszx:cdgl:index',
          component: 'module/bszx/cdgl/index',
          status: true,
          parentId: '3',
          updatedAt: '2026-10-27 16:05:30',
        },
        {
          id: '3-2',
          name: '供应信息',
          orderNum: 2,
          perms: 'bszx:gxsb:index',
          component: 'module/bszx/gxsb/index',
          status: true,
          parentId: '3',
          updatedAt: '2026-10-27 16:15:10',
        },
        {
          id: '3-3',
          name: '需求信息',
          orderNum: 3,
          perms: 'bszx:bjjl:index',
          component: 'module/bszx/bjjl/index',
          status: true,
          parentId: '3',
          updatedAt: '2026-10-28 09:40:22',
        },
        {
          id: '3-4',
          name: '交易记录',
          orderNum: 4,
          perms: 'bszx:sjcl:index',
          component: 'module/bszx/sjcl/index',
          status: true,
          parentId: '3',
          updatedAt: '2026-10-28 10:22:15',
        },
      ],
    },
    {
      id: '4',
      name: '系统管理',
      iconName: 'Settings',
      orderNum: 4,
      perms: 'system:manage',
      component: 'module/system',
      status: true,
      updatedAt: '2026-10-29 08:50:00',
      children: [
        {
          id: '4-1',
          name: '菜单管理',
          orderNum: 1,
          perms: 'system:menu:list',
          component: 'module/system/menu/index',
          status: true,
          parentId: '4',
          updatedAt: '2026-10-29 08:51:10',
        },
        {
          id: '4-2',
          name: '角色管理',
          orderNum: 2,
          perms: 'system:role:list',
          component: 'module/system/role/index',
          status: true,
          parentId: '4',
          updatedAt: '2026-10-29 08:52:20',
        },
        {
          id: '4-3',
          name: '部门管理',
          orderNum: 3,
          perms: 'system:dept:list',
          component: 'module/system/dept/index',
          status: true,
          parentId: '4',
          updatedAt: '2026-10-29 08:53:30',
        },
        {
          id: '4-4',
          name: '用户管理',
          orderNum: 4,
          perms: 'system:user:list',
          component: 'module/system/user/index',
          status: true,
          parentId: '4',
          updatedAt: '2026-10-29 08:54:40',
        },
      ],
    },
    {
      id: '5',
      name: '项目开发',
      iconName: 'Layers',
      orderNum: 5,
      perms: 'project:dev',
      component: 'module/project/dev',
      status: true,
      updatedAt: '2026-10-29 09:10:00',
      children: [
        {
          id: '5-1',
          name: '立项登记',
          orderNum: 1,
          perms: 'project:init:index',
          component: 'module/project/init/index',
          status: true,
          parentId: '5',
          updatedAt: '2026-10-29 09:12:00',
        },
        {
          id: '5-2',
          name: '样地调查',
          orderNum: 2,
          perms: 'project:survey:index',
          component: 'module/project/survey/index',
          status: true,
          parentId: '5',
          updatedAt: '2026-10-29 09:15:00',
        },
      ],
    },
    {
      id: '6',
      name: '金融服务',
      iconName: 'DollarSign',
      orderNum: 6,
      perms: 'finance:index',
      component: 'module/finance/index',
      status: true,
      updatedAt: '2026-10-29 10:00:00',
      children: [
        {
          id: '6-1',
          name: '碳汇质押',
          orderNum: 1,
          perms: 'finance:pledge:list',
          component: 'module/finance/pledge/index',
          status: true,
          parentId: '6',
          updatedAt: '2026-10-29 10:05:00',
        },
        {
          id: '6-2',
          name: '绿色碳保',
          orderNum: 2,
          perms: 'finance:insurance:list',
          component: 'module/finance/insurance/index',
          status: true,
          parentId: '6',
          updatedAt: '2026-10-29 10:10:00',
        },
      ],
    },
  ];

  const [menuList, setMenuList] = useState<MenuItem[]>(INITIAL_MENU_DATA);

  // Search Filter Form States
  const [menuSearchKeyword, setMenuSearchKeyword] = useState('');
  const [menuStatusFilter, setMenuStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  // Expanded Tree Node IDs (default: '3' 产品交易 is expanded, matching screenshot)
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set(['3']));

  // Selected Checkboxes for Bulk Delete / Operations
  const [selectedMenuIds, setSelectedMenuIds] = useState<Set<string>>(new Set(['3-1', '3-2']));

  // Pagination states matching screenshot
  const [menuPage, setMenuPage] = useState(1);
  const [menuPageSize, setMenuPageSize] = useState(10);
  const [menuJumpPage, setMenuJumpPage] = useState('');

  // Modal Dialog States
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [menuModalMode, setMenuModalMode] = useState<'create' | 'edit'>('create');
  const [activeMenuForm, setActiveMenuForm] = useState<{
    id?: string;
    parentId?: string;
    name: string;
    iconName: string;
    orderNum: number;
    perms: string;
    component: string;
    status: boolean;
  }>({
    name: '',
    iconName: 'Layers',
    orderNum: 1,
    perms: '',
    component: '',
    status: true,
  });

  // Delete Confirmation Modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Toggle single node expansion
  const toggleNodeExpand = (id: string) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Global Expand / Collapse All
  const handleToggleAllExpand = () => {
    if (expandedNodeIds.size > 0) {
      setExpandedNodeIds(new Set());
      showToast('已折叠全部菜单节点');
    } else {
      const allParentIds = new Set<string>();
      menuList.forEach((m) => {
        if (m.children && m.children.length > 0) allParentIds.add(m.id);
      });
      setExpandedNodeIds(allParentIds);
      showToast('已展开全部菜单节点');
    }
  };

  // Toggle Checkbox Selection
  const toggleSelectMenu = (id: string) => {
    setSelectedMenuIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Select all or deselect all
  const handleSelectAll = () => {
    if (selectedMenuIds.size > 0) {
      setSelectedMenuIds(new Set());
    } else {
      const allIds = new Set<string>();
      const collect = (items: MenuItem[]) => {
        items.forEach((item) => {
          allIds.add(item.id);
          if (item.children) collect(item.children);
        });
      };
      collect(menuList);
      setSelectedMenuIds(allIds);
    }
  };

  // Toggle status of a menu item
  const handleToggleMenuStatus = (id: string, currentStatus: boolean) => {
    const updateStatus = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: !currentStatus,
            updatedAt: '2026-10-29 11:30:00',
          };
        }
        if (item.children) {
          return { ...item, children: updateStatus(item.children) };
        }
        return item;
      });
    };
    setMenuList(updateStatus(menuList));
    showToast(`菜单状态已切换为: ${!currentStatus ? '已启用' : '已停用'}`);
  };

  // Open Create Menu Modal
  const handleOpenCreateModal = (parentId?: string) => {
    setActiveMenuForm({
      parentId: parentId || '',
      name: '',
      iconName: 'Layers',
      orderNum: 1,
      perms: '',
      component: '',
      status: true,
    });
    setMenuModalMode('create');
    setMenuModalOpen(true);
  };

  // Open Edit Menu Modal
  const handleOpenEditModal = (item: MenuItem) => {
    setActiveMenuForm({
      id: item.id,
      parentId: item.parentId || '',
      name: item.name,
      iconName: item.iconName || 'Layers',
      orderNum: item.orderNum,
      perms: item.perms,
      component: item.component,
      status: item.status,
    });
    setMenuModalMode('edit');
    setMenuModalOpen(true);
  };

  // Save Menu (Create / Update)
  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMenuForm.name.trim()) {
      showToast('请输入菜单名称');
      return;
    }

    if (menuModalMode === 'create') {
      const newItem: MenuItem = {
        id: String(Date.now()),
        name: activeMenuForm.name,
        iconName: activeMenuForm.iconName,
        orderNum: Number(activeMenuForm.orderNum) || 1,
        perms: activeMenuForm.perms,
        component: activeMenuForm.component,
        status: activeMenuForm.status,
        parentId: activeMenuForm.parentId || undefined,
        updatedAt: '2026-10-29 11:35:00',
      };

      if (activeMenuForm.parentId) {
        const addChild = (items: MenuItem[]): MenuItem[] => {
          return items.map((it) => {
            if (it.id === activeMenuForm.parentId) {
              return {
                ...it,
                children: [...(it.children || []), newItem],
              };
            }
            if (it.children) {
              return { ...it, children: addChild(it.children) };
            }
            return it;
          });
        };
        setMenuList(addChild(menuList));
        setExpandedNodeIds((prev) => new Set([...prev, activeMenuForm.parentId!]));
      } else {
        setMenuList([...menuList, newItem]);
      }
      showToast(`成功新增菜单: ${activeMenuForm.name}`);
    } else {
      // Edit mode: handles property changes and possible re-parenting
      const currentId = activeMenuForm.id!;
      const newParentId = activeMenuForm.parentId || undefined;

      let extractedNode: MenuItem | null = null;
      const removeNode = (items: MenuItem[]): MenuItem[] => {
        const result: MenuItem[] = [];
        for (const item of items) {
          if (item.id === currentId) {
            extractedNode = {
              ...item,
              name: activeMenuForm.name,
              iconName: activeMenuForm.iconName,
              orderNum: Number(activeMenuForm.orderNum) || 1,
              perms: activeMenuForm.perms,
              component: activeMenuForm.component,
              status: activeMenuForm.status,
              parentId: newParentId,
              updatedAt: '2026-10-29 11:45:00',
            };
          } else {
            result.push({
              ...item,
              children: item.children ? removeNode(item.children) : undefined,
            });
          }
        }
        return result;
      };

      const treeWithoutNode = removeNode(menuList);
      if (extractedNode) {
        if (newParentId) {
          const insertIntoParent = (items: MenuItem[]): MenuItem[] => {
            return items.map((it) => {
              if (it.id === newParentId) {
                return {
                  ...it,
                  children: [...(it.children || []), extractedNode!],
                };
              }
              if (it.children) {
                return { ...it, children: insertIntoParent(it.children) };
              }
              return it;
            });
          };
          setMenuList(insertIntoParent(treeWithoutNode));
          setExpandedNodeIds((prev) => new Set([...prev, newParentId]));
        } else {
          setMenuList([...treeWithoutNode, extractedNode]);
        }
      }
      showToast(`已保存菜单: ${activeMenuForm.name}`);
    }

    setMenuModalOpen(false);
  };

  // Confirm and Execute Delete Menu
  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      const removeItem = (items: MenuItem[]): MenuItem[] => {
        return items
          .filter((it) => it.id !== deleteTargetId)
          .map((it) => (it.children ? { ...it, children: removeItem(it.children) } : it));
      };
      setMenuList(removeItem(menuList));
      setSelectedMenuIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteTargetId);
        return next;
      });
      showToast('该菜单项已成功删除');
    } else if (selectedMenuIds.size > 0) {
      // Bulk delete
      const removeBatch = (items: MenuItem[]): MenuItem[] => {
        return items
          .filter((it) => !selectedMenuIds.has(it.id))
          .map((it) => (it.children ? { ...it, children: removeBatch(it.children) } : it));
      };
      setMenuList(removeBatch(menuList));
      showToast(`已批量删除选中的 ${selectedMenuIds.size} 项菜单`);
      setSelectedMenuIds(new Set());
    }
    setDeleteConfirmOpen(false);
    setDeleteTargetId(null);
  };

  // Reset Search
  const handleResetSearch = () => {
    setMenuSearchKeyword('');
    setMenuStatusFilter('all');
    showToast('已重置搜索筛选条件');
  };

  // Filtered menu items
  const filteredMenuList = useMemo(() => {
    const kw = menuSearchKeyword.trim().toLowerCase();
    const filterTree = (items: MenuItem[]): MenuItem[] => {
      const result: MenuItem[] = [];
      items.forEach((item) => {
        const matchesKw =
          !kw ||
          item.name.toLowerCase().includes(kw) ||
          item.perms.toLowerCase().includes(kw) ||
          item.component.toLowerCase().includes(kw);

        const matchesStatus =
          menuStatusFilter === 'all' ||
          (menuStatusFilter === 'enabled' && item.status) ||
          (menuStatusFilter === 'disabled' && !item.status);

        const filteredChildren = item.children ? filterTree(item.children) : [];

        if ((matchesKw && matchesStatus) || filteredChildren.length > 0) {
          result.push({
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children,
          });
        }
      });
      return result;
    };

    return filterTree(menuList);
  }, [menuList, menuSearchKeyword, menuStatusFilter]);

  // Render Icon helper
  const renderIconBadge = (iconName?: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-4 h-4 text-emerald-400" />;
      case 'Globe':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'Users':
        return <Users className="w-4 h-4 text-emerald-300" />;
      case 'Settings':
        return <Settings className="w-4 h-4 text-emerald-400" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-emerald-300" />;
      case 'DollarSign':
        return <DollarSign className="w-4 h-4 text-amber-400" />;
      default:
        return null;
    }
  };

  // =========================================================================
  // 2. 角色管理数据与状态 (Role Management) - 严格遵循截图 image_80dfb05f.png
  // =========================================================================
  const INITIAL_ROLE_DATA: RoleItem[] = [
    {
      id: '1',
      roleName: '超级管理员',
      roleKey: 'superadmin',
      orderNum: 1,
      status: true,
      userCount: 3,
      createTime: '2026-10-12 09:30:00',
      updateTime: '2026-10-29 08:30:00',
      remark: '超级管理员拥有最高权限，具备全局系统配置、密钥运维与全域数据下发',
      menuPermissions: ['all'],
      dataScope: '全部数据权限',
    },
    {
      id: '2',
      roleName: '管理员',
      roleKey: 'admin',
      orderNum: 2,
      status: true,
      userCount: 8,
      createTime: '2026-10-14 11:20:00',
      updateTime: '2026-10-28 17:15:00',
      remark: '各业务模块主管管理员，负责全平台运维管理、用户权限审计及各子系统协同',
      menuPermissions: ['1', '2', '3', '4', '5', '6'],
      dataScope: '本部门及以下数据权限',
    },
    {
      id: '3',
      roleName: '普通角色',
      roleKey: 'ptjs',
      orderNum: 3,
      status: true,
      userCount: 25,
      createTime: '2026-10-16 15:40:00',
      updateTime: '2026-10-28 14:00:00',
      remark: '普通业务操作员，具备基础双碳数据录入、工单流转与日常报表查阅权限',
      menuPermissions: ['1', '2'],
      dataScope: '仅本人数据权限',
    },
    {
      id: '4',
      roleName: '空间遥感解译专员',
      roleKey: 'rs_specialist',
      orderNum: 4,
      status: true,
      userCount: 12,
      createTime: '2026-10-18 10:00:00',
      updateTime: '2026-10-29 09:15:00',
      remark: '负责高分遥感与GIS样地空间栅格解译、通量塔监测数据入库与NDVI植被覆被运算',
      menuPermissions: ['2', '5'],
      dataScope: '本部门数据权限',
    },
    {
      id: '5',
      roleName: '碳汇价值量化核算师',
      roleKey: 'carbon_accountant',
      orderNum: 5,
      status: true,
      userCount: 10,
      createTime: '2026-10-20 14:30:00',
      updateTime: '2026-10-28 16:45:00',
      remark: '负责生物量蓄积膨胀法、地下碳库模型测算及CCER价值敏感性量化评估',
      menuPermissions: ['1', '5'],
      dataScope: '本部门数据权限',
    },
    {
      id: '6',
      roleName: '碳资产交易经纪人',
      roleKey: 'carbon_broker',
      orderNum: 6,
      status: true,
      userCount: 18,
      createTime: '2026-10-22 09:10:00',
      updateTime: '2026-10-29 10:20:00',
      remark: '负责国家CCER配额与企业碳票挂牌撮合、大宗协议转让与电子注销履约',
      menuPermissions: ['3'],
      dataScope: '本部门数据权限',
    },
    {
      id: '7',
      roleName: '绿色金融风控官',
      roleKey: 'green_fin_officer',
      orderNum: 7,
      status: true,
      userCount: 6,
      createTime: '2026-10-24 16:00:00',
      updateTime: '2026-10-28 11:30:00',
      remark: '负责碳汇预期收益权质押增信评估、生态指数气象保险与ESG绿色信贷风控',
      menuPermissions: ['6'],
      dataScope: '本部门数据权限',
    },
    {
      id: '8',
      roleName: '第三方MRV核证审计员',
      roleKey: 'mrv_auditor',
      orderNum: 8,
      status: true,
      userCount: 5,
      createTime: '2026-10-26 13:20:00',
      updateTime: '2026-10-29 08:40:00',
      remark: '具备国家资质的独立第三方MRV样地复测抽检、核证报告签署与防重计核查',
      menuPermissions: ['1', '2', '3', '4', '5', '6'],
      dataScope: '全部数据权限',
    },
    {
      id: '9',
      roleName: '产业协同运营专员',
      roleKey: 'industry_operator',
      orderNum: 9,
      status: true,
      userCount: 14,
      createTime: '2026-10-27 10:45:00',
      updateTime: '2026-10-29 09:50:00',
      remark: '负责双碳看板宏观指标分析、各地碳达峰管控调度及中和企业台账跟踪',
      menuPermissions: ['1', '3'],
      dataScope: '本部门数据权限',
    },
    {
      id: '10',
      roleName: '样地外业调查员',
      roleKey: 'field_surveyor',
      orderNum: 10,
      status: true,
      userCount: 20,
      createTime: '2026-10-28 09:00:00',
      updateTime: '2026-10-29 11:10:00',
      remark: '负责碳汇样地地面实测调绘、乔木胸径树高录入与物候数据手持终端采集',
      menuPermissions: ['2', '5'],
      dataScope: '仅本人数据权限',
    },
  ];

  const [roleList, setRoleList] = useState<RoleItem[]>(INITIAL_ROLE_DATA);

  // Search Filter Form States for Role
  const [roleSearchKeyword, setRoleSearchKeyword] = useState('');
  const [roleStatusFilter, setRoleStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  // Selected Checkboxes for Bulk Delete / Operations
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(new Set());

  // Pagination states matching screenshot
  const [rolePage, setRolePage] = useState(1);
  const [rolePageSize, setRolePageSize] = useState(10);
  const [roleJumpPage, setRoleJumpPage] = useState('');

  // Role Form Modal (Create / Edit)
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleModalMode, setRoleModalMode] = useState<'create' | 'edit'>('create');
  const [activeRoleForm, setActiveRoleForm] = useState<{
    id?: string;
    roleName: string;
    roleKey: string;
    orderNum: number;
    status: boolean;
    remark: string;
    menuPermissions: string[];
  }>({
    roleName: '',
    roleKey: '',
    orderNum: 1,
    status: true,
    remark: '',
    menuPermissions: ['1', '2'],
  });

  // Role Detail Drawer/Modal
  const [roleDetailModalOpen, setRoleDetailModalOpen] = useState(false);
  const [activeDetailRole, setActiveDetailRole] = useState<RoleItem | null>(null);

  // Data Scope / Permissions Modal (3rd action button)
  const [rolePermissionModalOpen, setRolePermissionModalOpen] = useState(false);
  const [activePermissionRole, setActivePermissionRole] = useState<RoleItem | null>(null);
  const [dataScopeSelection, setDataScopeSelection] = useState('1');

  // Role Delete Confirm Modal
  const [roleDeleteConfirmOpen, setRoleDeleteConfirmOpen] = useState(false);
  const [roleDeleteTargetId, setRoleDeleteTargetId] = useState<string | null>(null);

  // Toggle Single Role Checkbox
  const toggleSelectRole = (id: string) => {
    setSelectedRoleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Select All Roles
  const handleSelectAllRoles = () => {
    if (selectedRoleIds.size > 0 && selectedRoleIds.size >= filteredRoleList.length) {
      setSelectedRoleIds(new Set());
    } else {
      setSelectedRoleIds(new Set(filteredRoleList.map((r) => r.id)));
    }
  };

  // Toggle Role Status
  const handleToggleRoleStatus = (id: string, currentStatus: boolean) => {
    setRoleList((prev) =>
      prev.map((role) =>
        role.id === id
          ? {
              ...role,
              status: !currentStatus,
              updateTime: '2026-10-29 11:50:00',
            }
          : role
      )
    );
    showToast(`角色状态已切换为: ${!currentStatus ? '正常启用' : '已停用'}`);
  };

  // Open Create Role Modal
  const handleOpenCreateRoleModal = () => {
    setActiveRoleForm({
      roleName: '',
      roleKey: '',
      orderNum: roleList.length + 1,
      status: true,
      remark: '',
      menuPermissions: ['1', '2', '3'],
    });
    setRoleModalMode('create');
    setRoleModalOpen(true);
  };

  // Open Edit Role Modal
  const handleOpenEditRoleModal = (role: RoleItem) => {
    setActiveRoleForm({
      id: role.id,
      roleName: role.roleName,
      roleKey: role.roleKey,
      orderNum: role.orderNum,
      status: role.status,
      remark: role.remark,
      menuPermissions: role.menuPermissions || ['1', '2'],
    });
    setRoleModalMode('edit');
    setRoleModalOpen(true);
  };

  // Save Role
  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoleForm.roleName.trim()) {
      showToast('请输入角色名称');
      return;
    }
    if (!activeRoleForm.roleKey.trim()) {
      showToast('请输入权限字符');
      return;
    }

    if (roleModalMode === 'create') {
      const newRole: RoleItem = {
        id: String(Date.now()),
        roleName: activeRoleForm.roleName,
        roleKey: activeRoleForm.roleKey,
        orderNum: Number(activeRoleForm.orderNum) || 1,
        status: activeRoleForm.status,
        userCount: 0,
        createTime: '2026-10-29 11:55:00',
        updateTime: '2026-10-29 11:55:00',
        remark: activeRoleForm.remark || '无描述',
        menuPermissions: activeRoleForm.menuPermissions,
        dataScope: '本部门数据权限',
      };
      setRoleList([...roleList, newRole]);
      showToast(`成功新增角色: ${activeRoleForm.roleName}`);
    } else {
      setRoleList((prev) =>
        prev.map((role) =>
          role.id === activeRoleForm.id
            ? {
                ...role,
                roleName: activeRoleForm.roleName,
                roleKey: activeRoleForm.roleKey,
                orderNum: Number(activeRoleForm.orderNum) || 1,
                status: activeRoleForm.status,
                remark: activeRoleForm.remark,
                menuPermissions: activeRoleForm.menuPermissions,
                updateTime: '2026-10-29 11:55:00',
              }
            : role
        )
      );
      showToast(`已成功保存角色配置: ${activeRoleForm.roleName}`);
    }
    setRoleModalOpen(false);
  };

  // Open Data Scope / Permissions Modal
  const handleOpenPermissionModal = (role: RoleItem) => {
    setActivePermissionRole(role);
    setDataScopeSelection(role.dataScope === '全部数据权限' ? '1' : '2');
    setRolePermissionModalOpen(true);
  };

  // Open Detail Modal
  const handleOpenRoleDetail = (role: RoleItem) => {
    setActiveDetailRole(role);
    setRoleDetailModalOpen(true);
  };

  // Confirm Delete Role
  const handleConfirmDeleteRole = () => {
    if (roleDeleteTargetId) {
      setRoleList((prev) => prev.filter((r) => r.id !== roleDeleteTargetId));
      setSelectedRoleIds((prev) => {
        const next = new Set(prev);
        next.delete(roleDeleteTargetId);
        return next;
      });
      showToast('该角色已成功删除');
    } else if (selectedRoleIds.size > 0) {
      setRoleList((prev) => prev.filter((r) => !selectedRoleIds.has(r.id)));
      showToast(`已批量删除选中的 ${selectedRoleIds.size} 个角色`);
      setSelectedRoleIds(new Set());
    }
    setRoleDeleteConfirmOpen(false);
    setRoleDeleteTargetId(null);
  };

  // Reset Role Search
  const handleResetRoleSearch = () => {
    setRoleSearchKeyword('');
    setRoleStatusFilter('all');
    showToast('已重置角色搜索条件');
  };

  // Filtered Role List
  const filteredRoleList = useMemo(() => {
    const kw = roleSearchKeyword.trim().toLowerCase();
    return roleList.filter((role) => {
      const matchesKw =
        !kw ||
        role.roleName.toLowerCase().includes(kw) ||
        role.roleKey.toLowerCase().includes(kw) ||
        role.remark.toLowerCase().includes(kw);

      const matchesStatus =
        roleStatusFilter === 'all' ||
        (roleStatusFilter === 'enabled' && role.status) ||
        (roleStatusFilter === 'disabled' && !role.status);

      return matchesKw && matchesStatus;
    });
  }, [roleList, roleSearchKeyword, roleStatusFilter]);

  // =========================================================================
  // 3. 部门管理数据与状态 (Department Management) - 严格遵循截图 image_ea23238a.png
  // =========================================================================
  const INITIAL_DEPT_DATA: DeptItem[] = [
    {
      id: '1',
      deptName: '黑耳科技',
      leader: '赵风林',
      phone: '0550-666888',
      email: 'blackear@carbon.gov.cn',
      orderNum: 1,
      status: true,
      createTime: '2026-10-01 08:30:00',
      updateTime: '2026-10-29 08:30:00',
      children: [
        {
          id: '1-1',
          deptName: '合肥总公司',
          leader: '张明辉',
          phone: '0550-666887',
          email: 'hefei@carbon.gov.cn',
          orderNum: 1,
          status: true,
          parentId: '1',
          createTime: '2026-10-05 09:00:00',
          updateTime: '2026-10-28 17:00:00',
          children: [
            {
              id: '1-1-1',
              deptName: '财务部门',
              leader: '李晓华',
              phone: '0550-666886',
              email: 'caiwu@carbon.gov.cn',
              orderNum: 1,
              status: false, // 对应截图中的灰色停用开关
              parentId: '1-1',
              createTime: '2026-10-06 09:10:00',
              updateTime: '2026-10-28 15:30:00',
            },
            {
              id: '1-1-2',
              deptName: '行政部门',
              leader: '王丽娟',
              phone: '0550-666885',
              email: 'xingzheng@carbon.gov.cn',
              orderNum: 2,
              status: true,
              parentId: '1-1',
              createTime: '2026-10-06 09:20:00',
              updateTime: '2026-10-29 09:00:00',
            },
            {
              id: '1-1-3',
              deptName: '研发部门',
              leader: '孙志强',
              phone: '0550-666884',
              email: 'yanfa@carbon.gov.cn',
              orderNum: 3,
              status: true,
              parentId: '1-1',
              createTime: '2026-10-06 09:30:00',
              updateTime: '2026-10-29 09:30:00',
            },
            {
              id: '1-1-4',
              deptName: '市场部门',
              leader: '朱宏伟',
              phone: '0550-666883',
              email: 'shichang@carbon.gov.cn',
              orderNum: 4,
              status: false, // 对应截图中的灰色停用开关
              parentId: '1-1',
              createTime: '2026-10-06 09:40:00',
              updateTime: '2026-10-28 14:20:00',
            },
            {
              id: '1-1-5',
              deptName: '人事部门',
              leader: '夏雨晴',
              phone: '0550-666882',
              email: 'renshi@carbon.gov.cn',
              orderNum: 5,
              status: true,
              parentId: '1-1',
              createTime: '2026-10-06 09:50:00',
              updateTime: '2026-10-29 10:15:00',
            },
            {
              id: '1-1-6',
              deptName: '碳资产运营部',
              leader: '邓子轩',
              phone: '0550-666881',
              email: 'tanzi@carbon.gov.cn',
              orderNum: 6,
              status: true,
              parentId: '1-1',
              createTime: '2026-10-06 10:00:00',
              updateTime: '2026-10-29 10:30:00',
            },
          ],
        },
        {
          id: '1-2',
          deptName: '南京分公司',
          leader: '王俊杰',
          phone: '0450-666888',
          email: 'nanjing@carbon.gov.cn',
          orderNum: 2,
          status: true,
          parentId: '1',
          createTime: '2026-10-10 10:00:00',
          updateTime: '2026-10-28 16:00:00',
        },
        {
          id: '1-3',
          deptName: '杭州分公司',
          leader: '周文斌',
          phone: '0280-666888',
          email: 'hangzhou@carbon.gov.cn',
          orderNum: 3,
          status: true,
          parentId: '1',
          createTime: '2026-10-12 11:30:00',
          updateTime: '2026-10-29 10:45:00',
        },
        {
          id: '1-4',
          deptName: '上海分公司',
          leader: '陆家豪',
          phone: '0210-666888',
          email: 'shanghai@carbon.gov.cn',
          orderNum: 4,
          status: true,
          parentId: '1',
          createTime: '2026-10-15 09:30:00',
          updateTime: '2026-10-29 11:00:00',
        },
      ],
    },
  ];

  const [deptList, setDeptList] = useState<DeptItem[]>(INITIAL_DEPT_DATA);

  // Search Filter Form States for Dept
  const [deptSearchKeyword, setDeptSearchKeyword] = useState('');
  const [deptStatusFilter, setDeptStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  // Expanded Tree Node IDs for Dept (Matching screenshot: Root '1' and Branch '1-1' expanded by default)
  const [deptExpandedNodeIds, setDeptExpandedNodeIds] = useState<Set<string>>(new Set(['1', '1-1']));

  // Selected Checkboxes for Bulk Delete / Operations
  const [selectedDeptIds, setSelectedDeptIds] = useState<Set<string>>(new Set());

  // Pagination states matching screenshot
  const [deptPage, setDeptPage] = useState(1);
  const [deptPageSize, setDeptPageSize] = useState(10);
  const [deptJumpPage, setDeptJumpPage] = useState('');

  // Dept Modal Dialog States (Create / Edit)
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [deptModalMode, setDeptModalMode] = useState<'create' | 'edit'>('create');
  const [activeDeptForm, setActiveDeptForm] = useState<{
    id?: string;
    parentId?: string;
    deptName: string;
    orderNum: number;
    leader: string;
    phone: string;
    email: string;
    status: boolean;
  }>({
    deptName: '',
    orderNum: 1,
    leader: '',
    phone: '',
    email: '',
    status: true,
  });

  // Dept Delete Confirm Modal
  const [deptDeleteConfirmOpen, setDeptDeleteConfirmOpen] = useState(false);
  const [deptDeleteTargetId, setDeptDeleteTargetId] = useState<string | null>(null);

  // Toggle single dept node expand
  const toggleDeptNodeExpand = (id: string) => {
    setDeptExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Global Expand / Collapse All Dept Nodes
  const handleToggleAllDeptExpand = () => {
    if (deptExpandedNodeIds.size > 0) {
      setDeptExpandedNodeIds(new Set());
      showToast('已折叠全部部门节点');
    } else {
      const allParentIds = new Set<string>();
      const collect = (items: DeptItem[]) => {
        items.forEach((it) => {
          if (it.children && it.children.length > 0) {
            allParentIds.add(it.id);
            collect(it.children);
          }
        });
      };
      collect(deptList);
      setDeptExpandedNodeIds(allParentIds);
      showToast('已展开全部部门节点');
    }
  };

  // Toggle Dept Status
  const handleToggleDeptStatus = (id: string, currentStatus: boolean) => {
    const updateStatus = (items: DeptItem[]): DeptItem[] => {
      return items.map((it) => {
        if (it.id === id) {
          return {
            ...it,
            status: !currentStatus,
            updateTime: '2026-10-29 12:00:00',
          };
        }
        if (it.children) {
          return { ...it, children: updateStatus(it.children) };
        }
        return it;
      });
    };
    setDeptList(updateStatus(deptList));
    showToast(`部门状态已切换为: ${!currentStatus ? '正常启用' : '已停用'}`);
  };

  // Open Create Dept Modal
  const handleOpenCreateDeptModal = (parentId?: string) => {
    setActiveDeptForm({
      parentId: parentId || '',
      deptName: '',
      orderNum: 1,
      leader: '',
      phone: '',
      email: '',
      status: true,
    });
    setDeptModalMode('create');
    setDeptModalOpen(true);
  };

  // Open Edit Dept Modal
  const handleOpenEditDeptModal = (dept: DeptItem) => {
    setActiveDeptForm({
      id: dept.id,
      parentId: dept.parentId || '',
      deptName: dept.deptName,
      orderNum: dept.orderNum,
      leader: dept.leader,
      phone: dept.phone,
      email: dept.email,
      status: dept.status,
    });
    setDeptModalMode('edit');
    setDeptModalOpen(true);
  };

  // Save Dept (Create / Update)
  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDeptForm.deptName.trim()) {
      showToast('请输入部门名称');
      return;
    }

    if (deptModalMode === 'create') {
      const newDept: DeptItem = {
        id: String(Date.now()),
        deptName: activeDeptForm.deptName,
        leader: activeDeptForm.leader || '未指定',
        phone: activeDeptForm.phone || '-',
        email: activeDeptForm.email || '-',
        orderNum: Number(activeDeptForm.orderNum) || 1,
        status: activeDeptForm.status,
        parentId: activeDeptForm.parentId || undefined,
        createTime: '2026-10-29 12:05:00',
        updateTime: '2026-10-29 12:05:00',
      };

      if (activeDeptForm.parentId) {
        const addChild = (items: DeptItem[]): DeptItem[] => {
          return items.map((it) => {
            if (it.id === activeDeptForm.parentId) {
              return {
                ...it,
                children: [...(it.children || []), newDept],
              };
            }
            if (it.children) {
              return { ...it, children: addChild(it.children) };
            }
            return it;
          });
        };
        setDeptList(addChild(deptList));
        setDeptExpandedNodeIds((prev) => new Set([...prev, activeDeptForm.parentId!]));
      } else {
        setDeptList([...deptList, newDept]);
      }
      showToast(`成功新增部门: ${activeDeptForm.deptName}`);
    } else {
      // Edit mode: handles property changes and possible re-parenting
      const currentId = activeDeptForm.id!;
      const newParentId = activeDeptForm.parentId || undefined;

      let extractedNode: DeptItem | null = null;
      const removeNode = (items: DeptItem[]): DeptItem[] => {
        const result: DeptItem[] = [];
        for (const item of items) {
          if (item.id === currentId) {
            extractedNode = {
              ...item,
              deptName: activeDeptForm.deptName,
              leader: activeDeptForm.leader,
              phone: activeDeptForm.phone,
              email: activeDeptForm.email,
              orderNum: Number(activeDeptForm.orderNum) || 1,
              status: activeDeptForm.status,
              parentId: newParentId,
              updateTime: '2026-10-29 12:05:00',
            };
          } else {
            result.push({
              ...item,
              children: item.children ? removeNode(item.children) : undefined,
            });
          }
        }
        return result;
      };

      const treeWithoutNode = removeNode(deptList);
      if (extractedNode) {
        if (newParentId) {
          const insertIntoParent = (items: DeptItem[]): DeptItem[] => {
            return items.map((it) => {
              if (it.id === newParentId) {
                return {
                  ...it,
                  children: [...(it.children || []), extractedNode!],
                };
              }
              if (it.children) {
                return { ...it, children: insertIntoParent(it.children) };
              }
              return it;
            });
          };
          setDeptList(insertIntoParent(treeWithoutNode));
          setDeptExpandedNodeIds((prev) => new Set([...prev, newParentId]));
        } else {
          setDeptList([...treeWithoutNode, extractedNode]);
        }
      }
      showToast(`已成功保存部门配置: ${activeDeptForm.deptName}`);
    }

    setDeptModalOpen(false);
  };

  // Confirm Delete Dept
  const handleConfirmDeleteDept = () => {
    if (deptDeleteTargetId) {
      const removeItem = (items: DeptItem[]): DeptItem[] => {
        return items
          .filter((it) => it.id !== deptDeleteTargetId)
          .map((it) => (it.children ? { ...it, children: removeItem(it.children) } : it));
      };
      setDeptList(removeItem(deptList));
      showToast('该部门项已成功删除');
    }
    setDeptDeleteConfirmOpen(false);
    setDeptDeleteTargetId(null);
  };

  // Reset Dept Search
  const handleResetDeptSearch = () => {
    setDeptSearchKeyword('');
    setDeptStatusFilter('all');
    showToast('已重置部门搜索条件');
  };

  // Filtered Dept List
  const filteredDeptList = useMemo(() => {
    const kw = deptSearchKeyword.trim().toLowerCase();
    const filterTree = (items: DeptItem[]): DeptItem[] => {
      const result: DeptItem[] = [];
      items.forEach((item) => {
        const matchesKw =
          !kw ||
          item.deptName.toLowerCase().includes(kw) ||
          item.leader.toLowerCase().includes(kw) ||
          item.phone.toLowerCase().includes(kw);

        const matchesStatus =
          deptStatusFilter === 'all' ||
          (deptStatusFilter === 'enabled' && item.status) ||
          (deptStatusFilter === 'disabled' && !item.status);

        const filteredChildren = item.children ? filterTree(item.children) : [];

        if ((matchesKw && matchesStatus) || filteredChildren.length > 0) {
          result.push({
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children,
          });
        }
      });
      return result;
    };

    return filterTree(deptList);
  }, [deptList, deptSearchKeyword, deptStatusFilter]);

  // =========================================================================
  // 4. 用户管理数据与状态 (User Management) - 严格遵循截图 image_64311cdb.png
  // =========================================================================
  const INITIAL_USER_DATA: UserItem[] = [
    {
      id: '1',
      username: 'zhangsan',
      nickname: '张三峰',
      deptName: '全球事业部',
      phone: '18866668888',
      roleName: '全球业务总监',
      status: true, // 截图中的开启状态 (绿滑块)
      email: 'zhangsan@carbon.gov.cn',
      loginIp: '192.168.1.101',
      lastLoginTime: '2026-10-29 09:30:15',
      createTime: '2026-10-01 09:00:00',
      updateTime: '2026-10-29 09:30:15',
    },
    {
      id: '2',
      username: 'lisi',
      nickname: '李四海',
      deptName: '投标管理部',
      phone: '18888886666',
      roleName: '投标项目经理',
      status: true, // 截图中的开启状态 (绿滑块)
      email: 'lisi@carbon.gov.cn',
      loginIp: '192.168.1.102',
      lastLoginTime: '2026-10-29 08:45:22',
      createTime: '2026-10-03 10:15:00',
      updateTime: '2026-10-29 08:45:22',
    },
    {
      id: '3',
      username: 'wangwu',
      nickname: '王武斌',
      deptName: '行政人事部',
      phone: '18888888888',
      roleName: '行政人事专员',
      status: true, // 截图中的开启状态 (绿滑块)
      email: 'wangwu@carbon.gov.cn',
      loginIp: '192.168.1.103',
      lastLoginTime: '2026-10-28 17:20:00',
      createTime: '2026-10-05 14:30:00',
      updateTime: '2026-10-28 17:20:00',
    },
    {
      id: '4',
      username: 'lixiaoran',
      nickname: '李晓冉',
      deptName: '综合管理部',
      phone: '18886868686',
      roleName: '综合运营主管',
      status: true, // 截图中的开启状态 (绿滑块)
      email: 'lixiaoran@carbon.gov.cn',
      loginIp: '192.168.1.104',
      lastLoginTime: '2026-10-29 10:05:40',
      createTime: '2026-10-08 11:00:00',
      updateTime: '2026-10-29 10:05:40',
    },
    {
      id: '5',
      username: 'chenmingzhe',
      nickname: '陈明哲',
      deptName: '研发科技部',
      phone: '18868686868',
      roleName: '碳汇算法架构师',
      status: false, // 严格对应截图中的灰色停用开关
      email: 'chenmingzhe@carbon.gov.cn',
      loginIp: '192.168.1.105',
      lastLoginTime: '2026-10-27 16:50:33',
      createTime: '2026-10-10 16:40:00',
      updateTime: '2026-10-27 16:50:33',
    },
    {
      id: '6',
      username: 'zhaoxuemei',
      nickname: '赵雪梅',
      deptName: '全球事业部',
      phone: '18866669991',
      roleName: '全球业务总监',
      status: true,
      email: 'zhaoxuemei@carbon.gov.cn',
      loginIp: '192.168.1.106',
      lastLoginTime: '2026-10-29 09:15:30',
      createTime: '2026-10-12 10:20:00',
      updateTime: '2026-10-29 09:15:30',
    },
    {
      id: '7',
      username: 'sunzhilin',
      nickname: '孙志林',
      deptName: '投标管理部',
      phone: '18888887772',
      roleName: '投标项目经理',
      status: true,
      email: 'sunzhilin@carbon.gov.cn',
      loginIp: '192.168.1.107',
      lastLoginTime: '2026-10-28 16:40:12',
      createTime: '2026-10-14 11:30:00',
      updateTime: '2026-10-28 16:40:12',
    },
    {
      id: '8',
      username: 'qianyifan',
      nickname: '钱一帆',
      deptName: '研发科技部',
      phone: '18868689993',
      roleName: '碳汇算法架构师',
      status: true,
      email: 'qianyifan@carbon.gov.cn',
      loginIp: '192.168.1.108',
      lastLoginTime: '2026-10-29 11:20:00',
      createTime: '2026-10-16 14:15:00',
      updateTime: '2026-10-29 11:20:00',
    },
    {
      id: '9',
      username: 'zhouhaoran',
      nickname: '周浩然',
      deptName: '综合管理部',
      phone: '18886861114',
      roleName: '综合运营主管',
      status: true,
      email: 'zhouhaoran@carbon.gov.cn',
      loginIp: '192.168.1.109',
      lastLoginTime: '2026-10-27 15:30:45',
      createTime: '2026-10-18 09:40:00',
      updateTime: '2026-10-27 15:30:45',
    },
    {
      id: '10',
      username: 'wutingting',
      nickname: '吴婷婷',
      deptName: '行政人事部',
      phone: '18888882225',
      roleName: '行政人事专员',
      status: true,
      email: 'wutingting@carbon.gov.cn',
      loginIp: '192.168.1.110',
      lastLoginTime: '2026-10-29 10:10:20',
      createTime: '2026-10-20 15:50:00',
      updateTime: '2026-10-29 10:10:20',
    },
  ];

  const [userList, setUserList] = useState<UserItem[]>(INITIAL_USER_DATA);

  // Left Sidebar Department Tree Filter
  const [userDeptSearchKeyword, setUserDeptSearchKeyword] = useState('');
  const [selectedDeptTreeItem, setSelectedDeptTreeItem] = useState<string>('黑耳科技');

  // Search filter states on right
  const [userSearchKeyword, setUserSearchKeyword] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  // Multi-select checkboxes
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Pagination states
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(10);
  const [userJumpPage, setUserJumpPage] = useState('');

  // User Create / Edit Modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<'create' | 'edit'>('create');
  const [activeUserForm, setActiveUserForm] = useState<{
    id?: string;
    username: string;
    nickname: string;
    deptName: string;
    phone: string;
    email: string;
    roleName: string;
    status: boolean;
  }>({
    username: '',
    nickname: '',
    deptName: '综合管理部',
    phone: '',
    email: '',
    roleName: '综合运营主管',
    status: true,
  });

  // User Reset Password Modal
  const [userResetPwdModalOpen, setUserResetPwdModalOpen] = useState(false);
  const [activeResetUser, setActiveResetUser] = useState<UserItem | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('Carbon@2026#');

  // User Role / Permissions Modal
  const [userRoleModalOpen, setUserRoleModalOpen] = useState(false);
  const [activeRoleAssignUser, setActiveRoleAssignUser] = useState<UserItem | null>(null);
  const [assignedRoleValue, setAssignedRoleValue] = useState('综合运营主管');

  // User Detail Profile Modal
  const [userDetailModalOpen, setUserDetailModalOpen] = useState(false);
  const [activeDetailUser, setActiveDetailUser] = useState<UserItem | null>(null);

  // User Delete Confirm Modal
  const [userDeleteConfirmOpen, setUserDeleteConfirmOpen] = useState(false);
  const [userDeleteTargetId, setUserDeleteTargetId] = useState<string | null>(null);

  // Department Tree Data for Left Sidebar (Matching screenshot: 黑耳科技 -> 综合管理部, 行政人事部, 研发科技部)
  const DEPT_TREE_NODES = [
    { name: '综合管理部', key: 'zh' },
    { name: '行政人事部', key: 'rs' },
    { name: '研发科技部', key: 'yf' },
    { name: '全球事业部', key: 'qq' },
    { name: '投标管理部', key: 'tb' },
  ];

  // Filtered Dept Tree Nodes by Search Input
  const filteredDeptTreeNodes = useMemo(() => {
    const kw = userDeptSearchKeyword.trim().toLowerCase();
    if (!kw) return DEPT_TREE_NODES;
    return DEPT_TREE_NODES.filter((d) => d.name.toLowerCase().includes(kw));
  }, [userDeptSearchKeyword]);

  // Toggle Single User Status (switch on row)
  const handleToggleUserStatus = (id: string, currentStatus: boolean) => {
    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: !currentStatus, updateTime: '2026-10-29 12:40:00' } : u))
    );
    showToast(`用户账号状态已切换为: ${!currentStatus ? '正常启用' : '已停用'}`);
  };

  // Select / Deselect All Users
  const handleSelectAllUsers = () => {
    if (selectedUserIds.size > 0) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUserList.map((u) => u.id)));
    }
  };

  // Toggle Single User Checkbox
  const handleToggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Open Create User Modal
  const handleOpenCreateUserModal = () => {
    setActiveUserForm({
      username: `cb_user0${userList.length + 1}`,
      nickname: '',
      deptName: selectedDeptTreeItem !== '黑耳科技' ? selectedDeptTreeItem : '综合管理部',
      phone: '',
      email: '',
      roleName: '综合运营主管',
      status: true,
    });
    setUserModalMode('create');
    setUserModalOpen(true);
  };

  // Open Edit User Modal
  const handleOpenEditUserModal = (user: UserItem) => {
    setActiveUserForm({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      deptName: user.deptName,
      phone: user.phone,
      email: user.email || '',
      roleName: user.roleName,
      status: user.status,
    });
    setUserModalMode('edit');
    setUserModalOpen(true);
  };

  // Save User (Create / Edit)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUserForm.username.trim()) {
      showToast('请输入用户账号');
      return;
    }
    if (!activeUserForm.nickname.trim()) {
      showToast('请输入用户姓名');
      return;
    }

    if (userModalMode === 'create') {
      const newUser: UserItem = {
        id: String(Date.now()),
        username: activeUserForm.username,
        nickname: activeUserForm.nickname,
        deptName: activeUserForm.deptName,
        phone: activeUserForm.phone || '-',
        email: activeUserForm.email || '-',
        roleName: activeUserForm.roleName,
        status: activeUserForm.status,
        loginIp: '192.168.1.120',
        lastLoginTime: '2026-10-29 12:45:00',
        createTime: '2026-10-29 12:45:00',
        updateTime: '2026-10-29 12:45:00',
      };
      setUserList([...userList, newUser]);
      showToast(`成功新增用户: ${activeUserForm.nickname} (${activeUserForm.username})`);
    } else {
      setUserList((prev) =>
        prev.map((u) =>
          u.id === activeUserForm.id
            ? {
                ...u,
                username: activeUserForm.username,
                nickname: activeUserForm.nickname,
                deptName: activeUserForm.deptName,
                phone: activeUserForm.phone,
                email: activeUserForm.email,
                roleName: activeUserForm.roleName,
                status: activeUserForm.status,
                updateTime: '2026-10-29 12:45:00',
              }
            : u
        )
      );
      showToast(`已成功保存用户: ${activeUserForm.nickname}`);
    }
    setUserModalOpen(false);
  };

  // Open Reset Password
  const handleOpenResetPwdModal = (user: UserItem) => {
    setActiveResetUser(user);
    setNewPasswordValue('Carbon@2026#');
    setUserResetPwdModalOpen(true);
  };

  // Confirm Reset Password
  const handleConfirmResetPwd = () => {
    if (activeResetUser) {
      showToast(`已成功将 [${activeResetUser.username} · ${activeResetUser.nickname}] 密码重置为: ${newPasswordValue}`);
    }
    setUserResetPwdModalOpen(false);
  };

  // Open Role Assign Modal
  const handleOpenRoleAssignModal = (user: UserItem) => {
    setActiveRoleAssignUser(user);
    setAssignedRoleValue(user.roleName);
    setUserRoleModalOpen(true);
  };

  // Confirm Role Assign
  const handleConfirmRoleAssign = () => {
    if (activeRoleAssignUser) {
      setUserList((prev) =>
        prev.map((u) =>
          u.id === activeRoleAssignUser.id ? { ...u, roleName: assignedRoleValue, updateTime: '2026-10-29 12:45:00' } : u
        )
      );
      showToast(`已成功为 [${activeRoleAssignUser.nickname}] 更新分配角色为: ${assignedRoleValue}`);
    }
    setUserRoleModalOpen(false);
  };

  // Open Detail Modal
  const handleOpenUserDetailModal = (user: UserItem) => {
    setActiveDetailUser(user);
    setUserDetailModalOpen(true);
  };

  // Confirm Delete User
  const handleConfirmDeleteUser = () => {
    if (userDeleteTargetId) {
      setUserList((prev) => prev.filter((u) => u.id !== userDeleteTargetId));
      setSelectedUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userDeleteTargetId);
        return next;
      });
      showToast('该用户已成功注销删除');
    } else if (selectedUserIds.size > 0) {
      setUserList((prev) => prev.filter((u) => !selectedUserIds.has(u.id)));
      showToast(`已批量删除选中的 ${selectedUserIds.size} 名用户`);
      setSelectedUserIds(new Set());
    }
    setUserDeleteConfirmOpen(false);
    setUserDeleteTargetId(null);
  };

  // Reset User Search Filters
  const handleResetUserSearch = () => {
    setUserSearchKeyword('');
    setUserStatusFilter('all');
    setSelectedDeptTreeItem('黑耳科技');
    showToast('已重置用户搜索条件');
  };

  // Filtered User List
  const filteredUserList = useMemo(() => {
    const kw = userSearchKeyword.trim().toLowerCase();
    return userList.filter((user) => {
      // Dept Tree filter
      const matchesDept =
        !selectedDeptTreeItem ||
        selectedDeptTreeItem === '黑耳科技' ||
        user.deptName === selectedDeptTreeItem;

      // Keyword filter
      const matchesKw =
        !kw ||
        user.username.toLowerCase().includes(kw) ||
        user.nickname.toLowerCase().includes(kw) ||
        user.phone.toLowerCase().includes(kw) ||
        user.deptName.toLowerCase().includes(kw);

      // Status filter
      const matchesStatus =
        userStatusFilter === 'all' ||
        (userStatusFilter === 'enabled' && user.status) ||
        (userStatusFilter === 'disabled' && !user.status);

      return matchesDept && matchesKw && matchesStatus;
    });
  }, [userList, selectedDeptTreeItem, userSearchKeyword, userStatusFilter]);

  return (
    <div className="min-h-screen bg-[#040e09] text-slate-100 flex flex-col font-sans select-none animate-in fade-in">
      {/* Toast 提示框 */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-950/95 border border-emerald-500/80 rounded-xl text-xs text-emerald-200 shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 顶部主横幅导航 (严格匹配截图: 林业碳汇系统设置 + 菜单/角色/部门/用户管理 + 返回按钮) */}
      {/* ========================================================================= */}
      <header className="relative z-20 h-16 px-6 lg:px-8 bg-gradient-to-r from-[#031d13] via-[#05261a] to-[#041910] border-b border-emerald-800/60 shadow-lg flex items-center justify-between">
        {/* 左侧系统标题 */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-wide text-white drop-shadow-md">
            碳汇系统设置
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400/80 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
            安全运维与权限控制底座
          </span>
        </div>

        {/* 中间四项子系统 Tab: 菜单管理 / 角色管理 / 部门管理 / 用户管理 */}
        <div className="flex items-center gap-3">
          {/* 菜单管理 (对应截图默认激活态: 纯白药丸底色 + 深绿字 + 图标) */}
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-white text-emerald-800 shadow-md scale-105'
                : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>菜单管理</span>
          </button>

          {/* 角色管理 */}
          <button
            type="button"
            onClick={() => setActiveTab('role')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'role'
                ? 'bg-white text-emerald-800 shadow-md scale-105 font-bold'
                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-slate-300 border border-emerald-900/50'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>角色管理</span>
          </button>

          {/* 部门管理 */}
          <button
            type="button"
            onClick={() => setActiveTab('dept')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'dept'
                ? 'bg-white text-emerald-800 shadow-md scale-105 font-bold'
                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-slate-300 border border-emerald-900/50'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>部门管理</span>
          </button>

          {/* 用户管理 */}
          <button
            type="button"
            onClick={() => setActiveTab('user')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'user'
                ? 'bg-white text-emerald-800 shadow-md scale-105 font-bold'
                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-slate-300 border border-emerald-900/50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>用户管理</span>
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

      {/* 主体内容区域 (统一高科技暗色科技底色，背景颜色统一且专业) */}
      <main className="flex-1 p-4 lg:p-6 flex flex-col space-y-4 max-w-[1720px] w-full mx-auto">
        {/* ========================================================================= */}
        {/* TAB 1: 菜单管理 (严格对应所提供截图: 筛选搜索 + 数据列表树形表格 + 分页) */}
        {/* ========================================================================= */}
        {activeTab === 'menu' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 卡片一: 筛选搜索 (包含模糊查找、菜单状态、搜索、重置、展开/折叠、新增、删除) */}
            <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl space-y-4">
              {/* 标头: 绿色竖条指示器 + 筛选搜索 */}
              <div className="flex items-center justify-between border-b border-[#18284c]/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                  <h2 className="text-sm font-bold text-white tracking-wide">筛选搜索</h2>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>支持按菜单名称、权限标识或路由路径即时检索</span>
                </div>
              </div>

              {/* 第一排表单控件: 模糊查找 + 菜单状态 + 搜索/重置按钮 */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  {/* 模糊查找 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium whitespace-nowrap">模糊查找</span>
                    <div className="relative">
                      <input
                        type="text"
                        value={menuSearchKeyword}
                        onChange={(e) => setMenuSearchKeyword(e.target.value)}
                        placeholder="请输入菜单名称/权限标识查找"
                        className="w-64 sm:w-80 bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-hidden transition-colors"
                      />
                      {menuSearchKeyword && (
                        <button
                          type="button"
                          onClick={() => setMenuSearchKeyword('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 菜单状态下拉框 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium whitespace-nowrap">菜单状态</span>
                    <select
                      aria-label="菜单状态筛选"
                      value={menuStatusFilter}
                      onChange={(e) => setMenuStatusFilter(e.target.value as any)}
                      className="bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-hidden cursor-pointer min-w-[120px]"
                    >
                      <option value="all">请选择 (全部)</option>
                      <option value="enabled">正常启用</option>
                      <option value="disabled">已停用</option>
                    </select>
                  </div>
                </div>

                {/* 搜索与重置按钮 */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => showToast(`已完成检索，共匹配 ${filteredMenuList.length} 个根菜单项`)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>搜索</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetSearch}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>重置</span>
                  </button>
                </div>
              </div>

              {/* 第二排操作工具条: 展开/折叠 + 新增 + 删除 (严格对应截图样式) */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-[#18284c]/40">
                {/* 展开/折叠 */}
                <button
                  type="button"
                  onClick={handleToggleAllExpand}
                  className="flex items-center gap-1 px-3 py-1 bg-transparent hover:bg-[#0c1833] border border-[#2b4170] hover:border-slate-400 text-slate-200 rounded text-xs transition-colors cursor-pointer"
                >
                  <Sliders className="w-3 h-3 text-slate-400" />
                  <span>{expandedNodeIds.size > 0 ? '折叠全部' : '展开/折叠'}</span>
                </button>

                {/* 新增按钮 (绿色边框与浅绿字) */}
                <button
                  type="button"
                  onClick={() => handleOpenCreateModal()}
                  className="flex items-center gap-1 px-3 py-1 bg-[#00c88c]/15 hover:bg-[#00c88c]/25 border border-[#00c88c] text-[#00e699] hover:text-emerald-300 rounded text-xs font-medium transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增</span>
                </button>

                {/* 删除按钮 (红色边框与红字，批量删除) */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedMenuIds.size === 0) {
                      showToast('请先勾选需要删除的菜单项');
                      return;
                    }
                    setDeleteTargetId(null);
                    setDeleteConfirmOpen(true);
                  }}
                  disabled={selectedMenuIds.size === 0}
                  className="flex items-center gap-1 px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500 text-rose-400 hover:text-rose-300 disabled:opacity-40 disabled:cursor-not-allowed rounded text-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除 {selectedMenuIds.size > 0 ? `(${selectedMenuIds.size})` : ''}</span>
                </button>
              </div>
            </div>

            {/* 卡片二: 数据列表树形表格 (对应截图) */}
            <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl">
              {/* 标头: 绿色竖条指示器 + 数据列表 */}
              <div className="flex items-center justify-between border-b border-[#18284c]/60 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                  <h2 className="text-sm font-bold text-white tracking-wide">数据列表</h2>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>已勾选 <strong className="text-emerald-400 font-mono">{selectedMenuIds.size}</strong> 项</span>
                  <span className="text-slate-600">|</span>
                  <span className="font-mono text-[11px] text-slate-500">更新时间已同步至 2026-10 近期</span>
                </div>
              </div>

              {/* 树形数据表格 */}
              <div className="overflow-x-auto rounded-lg border border-[#18284c]">
                <table className="w-full text-xs text-left border-collapse">
                  {/* 表头 (统一暗蓝/墨绿科技底色) */}
                  <thead>
                    <tr className="bg-[#0c1833] text-slate-300 font-semibold border-b border-[#18284c]">
                      <th className="py-3 px-4 w-[280px]">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={selectedMenuIds.size > 0 && selectedMenuIds.size >= menuList.length}
                            onChange={handleSelectAll}
                            className="rounded border-[#18284c] text-[#00c88c] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#00c88c]"
                          />
                          <span>菜单名称</span>
                        </div>
                      </th>
                      <th className="py-3 px-3 text-center w-[90px]">菜单图标</th>
                      <th className="py-3 px-3 text-center w-[80px]">排序</th>
                      <th className="py-3 px-3 w-[200px]">权限标识</th>
                      <th className="py-3 px-3 w-[240px]">菜单路径</th>
                      <th className="py-3 px-3 text-center w-[110px]">菜单状态</th>
                      <th className="py-3 px-3 text-center w-[140px]">操作</th>
                    </tr>
                  </thead>

                  {/* 表格内容 */}
                  <tbody className="divide-y divide-[#18284c]/60">
                    {filteredMenuList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          未检索到符合条件的菜单数据
                        </td>
                      </tr>
                    ) : (
                      filteredMenuList.map((item) => {
                        const hasChildren = Boolean(item.children && item.children.length > 0);
                        const isExpanded = expandedNodeIds.has(item.id);
                        const isSelected = selectedMenuIds.has(item.id);

                        return (
                          <React.Fragment key={item.id}>
                            {/* 父级主菜单行 */}
                            <tr
                              className={`transition-colors ${
                                isSelected ? 'bg-emerald-950/20' : 'hover:bg-[#0c1833]/60 bg-[#060c1d]/40'
                              }`}
                            >
                              {/* 菜单名称 + 展开箭头 + Checkbox */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  {/* 展开/折叠箭头 (若是父节点) */}
                                  {hasChildren ? (
                                    <button
                                      type="button"
                                      onClick={() => toggleNodeExpand(item.id)}
                                      className="w-4 h-4 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  ) : (
                                    <span className="w-4 h-4 inline-block" />
                                  )}

                                  {/* Checkbox */}
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelectMenu(item.id)}
                                    className="rounded border-[#18284c] text-[#00c88c] focus:ring-0 cursor-pointer accent-[#00c88c]"
                                  />

                                  {/* 菜单名 */}
                                  <span className="font-medium text-white tracking-wide">
                                    {item.name}
                                  </span>
                                </div>
                              </td>

                              {/* 菜单图标 */}
                              <td className="py-3 px-3 text-center">
                                <div className="inline-flex items-center justify-center">
                                  {renderIconBadge(item.iconName)}
                                </div>
                              </td>

                              {/* 排序 */}
                              <td className="py-3 px-3 text-center font-mono text-slate-300">
                                {item.orderNum}
                              </td>

                              {/* 权限标识 */}
                              <td className="py-3 px-3 font-mono text-xs text-slate-300">
                                {item.perms || '-'}
                              </td>

                              {/* 菜单路径 */}
                              <td className="py-3 px-3 font-mono text-xs text-slate-300 truncate max-w-[240px]">
                                {item.component || '-'}
                              </td>

                              {/* 菜单状态 Toggle 开关 (匹配截图: 绿色药丸滑块) */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleMenuStatus(item.id, item.status)}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                    item.status ? 'bg-[#00c88c]' : 'bg-slate-700'
                                  }`}
                                  title={item.status ? '点击停用' : '点击启用'}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                      item.status ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </td>

                              {/* 操作 (三个小按钮: 编辑(橙/黄) + 删除(红) + 新增子项(绿)) */}
                              <td className="py-3 px-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* 编辑按钮 (橙色/琥珀色) */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(item)}
                                    className="w-6 h-6 rounded bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/70 text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                                    title="修改菜单"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>

                                  {/* 删除按钮 (红色) */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeleteTargetId(item.id);
                                      setDeleteConfirmOpen(true);
                                    }}
                                    className="w-6 h-6 rounded bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/70 text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                                    title="删除菜单"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>

                                  {/* 新增子级按钮 (绿色) */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenCreateModal(item.id)}
                                    className="w-6 h-6 rounded bg-[#00c88c]/15 hover:bg-[#00c88c]/30 border border-[#00c88c]/70 text-[#00e699] flex items-center justify-center transition-colors cursor-pointer"
                                    title="新增子级菜单"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* 展开的子级菜单渲染 */}
                            {hasChildren &&
                              isExpanded &&
                              item.children!.map((child) => {
                                const isChildSelected = selectedMenuIds.has(child.id);

                                return (
                                  <tr
                                    key={child.id}
                                    className={`transition-colors ${
                                      isChildSelected
                                        ? 'bg-emerald-950/25'
                                        : 'hover:bg-[#0c1833]/80 bg-[#060c1d]/70'
                                    }`}
                                  >
                                    {/* 子菜单名称 (缩进 + Checkbox) */}
                                    <td className="py-2.5 px-4 pl-10">
                                      <div className="flex items-center gap-2.5">
                                        <input
                                          type="checkbox"
                                          checked={isChildSelected}
                                          onChange={() => toggleSelectMenu(child.id)}
                                          className="rounded border-[#18284c] text-[#00c88c] focus:ring-0 cursor-pointer accent-[#00c88c]"
                                        />
                                        <span className="text-slate-300 font-medium hover:text-white">
                                          {child.name}
                                        </span>
                                      </div>
                                    </td>

                                    {/* 菜单图标 (子项通常留空或默认图标) */}
                                    <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                                      -
                                    </td>

                                    {/* 排序 */}
                                    <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                                      {child.orderNum}
                                    </td>

                                    {/* 权限标识 */}
                                    <td className="py-2.5 px-3 font-mono text-xs text-emerald-400/90">
                                      {child.perms || '-'}
                                    </td>

                                    {/* 菜单路径 */}
                                    <td className="py-2.5 px-3 font-mono text-xs text-slate-300 truncate max-w-[240px]">
                                      {child.component || '-'}
                                    </td>

                                    {/* 菜单状态 Toggle */}
                                    <td className="py-2.5 px-3 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleMenuStatus(child.id, child.status)}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                          child.status ? 'bg-[#00c88c]' : 'bg-slate-700'
                                        }`}
                                        title={child.status ? '点击停用' : '点击启用'}
                                      >
                                        <span
                                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                            child.status ? 'translate-x-4' : 'translate-x-0'
                                          }`}
                                        />
                                      </button>
                                    </td>

                                    {/* 操作 (编辑 + 删除 + 新增子项) */}
                                    <td className="py-2.5 px-3 text-center">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditModal(child)}
                                          className="w-6 h-6 rounded bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/70 text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                                          title="修改菜单"
                                        >
                                          <Edit className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setDeleteTargetId(child.id);
                                            setDeleteConfirmOpen(true);
                                          }}
                                          className="w-6 h-6 rounded bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/70 text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                                          title="删除菜单"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenCreateModal(child.id)}
                                          className="w-6 h-6 rounded bg-[#00c88c]/15 hover:bg-[#00c88c]/30 border border-[#00c88c]/70 text-[#00e699] flex items-center justify-center transition-colors cursor-pointer"
                                          title="新增按钮/子项"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* 表格底部综合分页控件 (严格匹配截图布局: 共2000条数据 每页[10]条 < 1 2 3 4 5 ... 20 > 跳转 [] 页) */}
              <div className="mt-4 pt-3 border-t border-[#18284c] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-sans">
                {/* 左侧条数统计与单页容量切换 */}
                <div className="flex items-center gap-2">
                  <span>共 <strong className="text-emerald-400 font-mono font-bold">2000</strong> 条数据</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    每页
                    <select
                      aria-label="每页显示条数"
                      value={menuPageSize}
                      onChange={(e) => {
                        setMenuPageSize(Number(e.target.value));
                        setMenuPage(1);
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
                    onClick={() => setMenuPage((p) => Math.max(1, p - 1))}
                    disabled={menuPage === 1}
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
                      onClick={() => setMenuPage(num)}
                      className={`w-7 h-7 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                        menuPage === num
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
                    onClick={() => setMenuPage(20)}
                    className={`w-7 h-7 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                      menuPage === 20
                        ? 'bg-[#00c88c] text-slate-950 font-bold shadow-xs'
                        : 'border border-[#18284c] bg-[#060c1d] text-slate-300 hover:bg-[#0c1833] hover:border-emerald-600'
                    }`}
                  >
                    20
                  </button>

                  {/* 下一页 */}
                  <button
                    type="button"
                    onClick={() => setMenuPage((p) => Math.min(20, p + 1))}
                    disabled={menuPage === 20}
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
                      value={menuJumpPage}
                      onChange={(e) => setMenuJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const p = parseInt(menuJumpPage, 10);
                          if (!isNaN(p) && p >= 1 && p <= 20) {
                            setMenuPage(p);
                            setMenuJumpPage('');
                          }
                        }
                      }}
                      placeholder={String(menuPage)}
                      className="w-10 h-7 bg-[#060c1d] border border-[#18284c] rounded text-center text-slate-200 font-mono text-xs outline-hidden focus:border-[#00c88c]"
                    />
                    <span>页</span>
                    <button
                      type="button"
                      onClick={() => {
                        const p = parseInt(menuJumpPage, 10);
                        if (!isNaN(p) && p >= 1 && p <= 20) {
                          setMenuPage(p);
                          setMenuJumpPage('');
                        }
                      }}
                      className="px-2 h-7 bg-[#060c1d] hover:bg-[#0c1833] border border-[#18284c] text-slate-300 rounded text-xs transition-colors cursor-pointer"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 角色管理 (Role Management) - 严格遵循截图 image_80dfb05f.png */}
        {/* ========================================================================= */}
        {activeTab === 'role' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 卡片一: 筛选搜索 (包含模糊查找、角色状态、搜索、重置、新增、删除) */}
            <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl space-y-4">
              {/* 标头: 绿色竖条指示器 + 筛选搜索 */}
              <div className="flex items-center justify-between border-b border-[#18284c]/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                  <h2 className="text-sm font-bold text-white tracking-wide">筛选搜索</h2>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>支持按角色名称、权限字符或职责描述快速过滤</span>
                </div>
              </div>

              {/* 第一排表单控件: 模糊查找 + 角色状态 + 搜索/重置按钮 */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  {/* 模糊查找 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium whitespace-nowrap">模糊查找</span>
                    <div className="relative">
                      <input
                        type="text"
                        value={roleSearchKeyword}
                        onChange={(e) => setRoleSearchKeyword(e.target.value)}
                        placeholder="请输入角色名称/权限标识查找"
                        className="w-64 sm:w-80 bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-hidden transition-colors"
                      />
                      {roleSearchKeyword && (
                        <button
                          type="button"
                          onClick={() => setRoleSearchKeyword('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 角色状态下拉框 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium whitespace-nowrap">角色状态</span>
                    <select
                      aria-label="角色状态筛选"
                      value={roleStatusFilter}
                      onChange={(e) => setRoleStatusFilter(e.target.value as any)}
                      className="bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-hidden cursor-pointer min-w-[120px]"
                    >
                      <option value="all">请选择</option>
                      <option value="enabled">正常启用</option>
                      <option value="disabled">已停用</option>
                    </select>
                  </div>
                </div>

                {/* 搜索与重置按钮 */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => showToast(`已完成检索，共匹配 ${filteredRoleList.length} 项系统角色`)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>搜索</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetRoleSearch}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>重置</span>
                  </button>
                </div>
              </div>

              {/* 第二排操作工具条: 新增 + 删除 (严格对应截图 image_80dfb05f.png 样式) */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-[#18284c]/40">
                {/* 新增按钮 (绿色边框与浅绿字) */}
                <button
                  type="button"
                  onClick={handleOpenCreateRoleModal}
                  className="flex items-center gap-1 px-3 py-1 bg-[#00c88c]/15 hover:bg-[#00c88c]/25 border border-[#00c88c] text-[#00e699] hover:text-emerald-300 rounded text-xs font-medium transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增</span>
                </button>

                {/* 删除按钮 (红色边框与红字，批量删除) */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedRoleIds.size === 0) {
                      showToast('请先勾选需要删除的角色项');
                      return;
                    }
                    setRoleDeleteTargetId(null);
                    setRoleDeleteConfirmOpen(true);
                  }}
                  disabled={selectedRoleIds.size === 0}
                  className="flex items-center gap-1 px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500 text-rose-400 hover:text-rose-300 disabled:opacity-40 disabled:cursor-not-allowed rounded text-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除 {selectedRoleIds.size > 0 ? `(${selectedRoleIds.size})` : ''}</span>
                </button>
              </div>
            </div>

            {/* 卡片二: 数据列表表格 (严格遵循截图: 复选框, 序号, 角色名称, 权限字符, 描述, 显示顺序, 角色状态, 操作) */}
            <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl">
              {/* 标头: 绿色竖条指示器 + 数据列表 */}
              <div className="flex items-center justify-between border-b border-[#18284c]/60 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                  <h2 className="text-sm font-bold text-white tracking-wide">数据列表</h2>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>已勾选 <strong className="text-emerald-400 font-mono">{selectedRoleIds.size}</strong> 项角色</span>
                  <span className="text-slate-600">|</span>
                  <span className="font-mono text-[11px] text-slate-500">更新时间已同步至 2026-10 近期</span>
                </div>
              </div>

              {/* 数据表格 */}
              <div className="overflow-x-auto rounded-lg border border-[#18284c]">
                <table className="w-full text-xs text-left border-collapse">
                  {/* 表头 (统一暗蓝/墨绿科技底色) */}
                  <thead>
                    <tr className="bg-[#0c1833] text-slate-300 font-semibold border-b border-[#18284c]">
                      <th className="py-3 px-4 w-[50px] text-center">
                        <input
                          type="checkbox"
                          checked={selectedRoleIds.size > 0 && selectedRoleIds.size >= filteredRoleList.length}
                          onChange={handleSelectAllRoles}
                          className="rounded border-[#18284c] text-[#00c88c] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#00c88c]"
                        />
                      </th>
                      <th className="py-3 px-3 text-center w-[70px]">序号</th>
                      <th className="py-3 px-4 w-[160px]">角色名称</th>
                      <th className="py-3 px-4 w-[160px]">权限字符</th>
                      <th className="py-3 px-4">描述</th>
                      <th className="py-3 px-3 text-center w-[90px]">显示顺序</th>
                      <th className="py-3 px-3 text-center w-[110px]">角色状态</th>
                      <th className="py-3 px-4 text-center w-[140px]">操作</th>
                    </tr>
                  </thead>

                  {/* 表格内容 */}
                  <tbody className="divide-y divide-[#18284c]/60">
                    {filteredRoleList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          未检索到符合条件的角色数据
                        </td>
                      </tr>
                    ) : (
                      filteredRoleList.map((role, idx) => {
                        const isSelected = selectedRoleIds.has(role.id);

                        return (
                          <tr
                            key={role.id}
                            className={`transition-colors ${
                              isSelected
                                ? 'bg-emerald-950/20'
                                : 'hover:bg-[#0c1833]/60 bg-[#060c1d]/40'
                            }`}
                          >
                            {/* 复选框 */}
                            <td className="py-3.5 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectRole(role.id)}
                                className="rounded border-[#18284c] text-[#00c88c] focus:ring-0 cursor-pointer accent-[#00c88c]"
                              />
                            </td>

                            {/* 序号 */}
                            <td className="py-3.5 px-3 text-center font-mono text-slate-400">
                              {idx + 1}
                            </td>

                            {/* 角色名称 (匹配截图: 绿色链接文字，点击查看详情档案) */}
                            <td className="py-3.5 px-4 font-medium">
                              <button
                                type="button"
                                onClick={() => handleOpenRoleDetail(role)}
                                className="text-[#00e699] hover:text-emerald-300 font-semibold cursor-pointer transition-colors underline decoration-emerald-500/40 hover:decoration-emerald-300 text-left"
                                title="点击查看角色详细档案与分配用户"
                              >
                                {role.roleName}
                              </button>
                            </td>

                            {/* 权限字符 */}
                            <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                              {role.roleKey}
                            </td>

                            {/* 描述 */}
                            <td className="py-3.5 px-4 text-slate-300 leading-relaxed max-w-[420px]">
                              {role.remark}
                            </td>

                            {/* 显示顺序 */}
                            <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                              {role.orderNum}
                            </td>

                            {/* 角色状态 Toggle 开关 (匹配截图: 绿色药丸滑块) */}
                            <td className="py-3.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleRoleStatus(role.id, role.status)}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                  role.status ? 'bg-[#00c88c]' : 'bg-slate-700'
                                }`}
                                title={role.status ? '点击停用角色' : '点击启用角色'}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                    role.status ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </td>

                            {/* 操作 (三个小按钮: 编辑(橙/黄) + 删除(红) + 数据/权限(绿)) */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {/* 编辑按钮 (橙色/琥珀色) */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditRoleModal(role)}
                                  className="w-6 h-6 rounded bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/70 text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                                  title="修改角色"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>

                                {/* 删除按钮 (红色) */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRoleDeleteTargetId(role.id);
                                    setRoleDeleteConfirmOpen(true);
                                  }}
                                  className="w-6 h-6 rounded bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/70 text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                                  title="删除角色"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>

                                {/* 数据权限 / 授权范围按钮 (绿色 - 对应截图第三个按钮) */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenPermissionModal(role)}
                                  className="w-6 h-6 rounded bg-[#00c88c]/15 hover:bg-[#00c88c]/30 border border-[#00c88c]/70 text-[#00e699] flex items-center justify-center transition-colors cursor-pointer"
                                  title="数据权限与功能授权范围"
                                >
                                  <ShieldCheck className="w-3 h-3" />
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

              {/* 表格底部综合分页控件 (严格匹配截图布局: 共2000条数据 每页[10]条 < 1 2 3 4 5 ... 20 > 跳转 [] 页) */}
              <div className="mt-4 pt-3 border-t border-[#18284c] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-sans">
                {/* 左侧条数统计与单页容量切换 */}
                <div className="flex items-center gap-2">
                  <span>共 <strong className="text-emerald-400 font-mono font-bold">2000</strong> 条数据</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    每页
                    <select
                      aria-label="每页显示条数"
                      value={rolePageSize}
                      onChange={(e) => {
                        setRolePageSize(Number(e.target.value));
                        setRolePage(1);
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
                    onClick={() => setRolePage((p) => Math.max(1, p - 1))}
                    disabled={rolePage === 1}
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
                      onClick={() => setRolePage(num)}
                      className={`w-7 h-7 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                        rolePage === num
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
                    onClick={() => setRolePage(20)}
                    className={`w-7 h-7 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                      rolePage === 20
                        ? 'bg-[#00c88c] text-slate-950 font-bold shadow-xs'
                        : 'border border-[#18284c] bg-[#060c1d] text-slate-300 hover:bg-[#0c1833] hover:border-emerald-600'
                    }`}
                  >
                    20
                  </button>

                  {/* 下一页 */}
                  <button
                    type="button"
                    onClick={() => setRolePage((p) => Math.min(20, p + 1))}
                    disabled={rolePage === 20}
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
                      value={roleJumpPage}
                      onChange={(e) => setRoleJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const p = parseInt(roleJumpPage, 10);
                          if (!isNaN(p) && p >= 1 && p <= 20) {
                            setRolePage(p);
                            setRoleJumpPage('');
                          }
                        }
                      }}
                      placeholder={String(rolePage)}
                      className="w-10 h-7 bg-[#060c1d] border border-[#18284c] rounded text-center text-slate-200 font-mono text-xs outline-hidden focus:border-[#00c88c]"
                    />
                    <span>页</span>
                    <button
                      type="button"
                      onClick={() => {
                        const p = parseInt(roleJumpPage, 10);
                        if (!isNaN(p) && p >= 1 && p <= 20) {
                          setRolePage(p);
                          setRoleJumpPage('');
                        }
                      }}
                      className="px-2 h-7 bg-[#060c1d] hover:bg-[#0c1833] border border-[#18284c] text-slate-300 rounded text-xs transition-colors cursor-pointer"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 部门管理 (Department Management) - 严格遵循截图 image_ea23238a.png */}
        {/* ========================================================================= */}
        {activeTab === 'dept' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 卡片一: 筛选搜索 (包含部门名称、部门状态、搜索、重置、展开/折叠、新增、删除) */}
            <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl space-y-4">
              {/* 标头: 绿色竖条指示器 + 筛选搜索 */}
              <div className="flex items-center justify-between border-b border-[#18284c]/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                  <h2 className="text-sm font-bold text-white tracking-wide">筛选搜索</h2>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>支持按部门名称、负责人姓名或办公电话即时检索</span>
                </div>
              </div>

              {/* 第一排表单控件: 部门名称 + 部门状态 + 搜索/重置按钮 */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  {/* 部门名称输入框 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium whitespace-nowrap">部门名称</span>
                    <div className="relative">
                      <input
                        type="text"
                        value={deptSearchKeyword}
                        onChange={(e) => setDeptSearchKeyword(e.target.value)}
                        placeholder="请输入部门名称查找"
                        className="w-64 sm:w-80 bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-hidden transition-colors"
                      />
                      {deptSearchKeyword && (
                        <button
                          type="button"
                          onClick={() => setDeptSearchKeyword('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 部门状态下拉框 */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium whitespace-nowrap">部门状态</span>
                    <select
                      aria-label="部门状态筛选"
                      value={deptStatusFilter}
                      onChange={(e) => setDeptStatusFilter(e.target.value as any)}
                      className="bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-hidden cursor-pointer min-w-[120px]"
                    >
                      <option value="all">请选择</option>
                      <option value="enabled">正常启用</option>
                      <option value="disabled">已停用</option>
                    </select>
                  </div>
                </div>

                {/* 搜索与重置按钮 */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => showToast(`已完成检索，共匹配 ${filteredDeptList.length} 个组织节点`)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>搜索</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetDeptSearch}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>重置</span>
                  </button>
                </div>
              </div>

              {/* 第二排操作工具条: 展开/折叠 + 新增 + 删除 (严格对应截图 image_ea23238a.png 样式) */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-[#18284c]/40">
                {/* 展开/折叠 */}
                <button
                  type="button"
                  onClick={handleToggleAllDeptExpand}
                  className="flex items-center gap-1 px-3 py-1 bg-transparent hover:bg-[#0c1833] border border-[#2b4170] hover:border-slate-400 text-slate-200 rounded text-xs transition-colors cursor-pointer"
                >
                  <Sliders className="w-3 h-3 text-slate-400" />
                  <span>{deptExpandedNodeIds.size > 0 ? '折叠全部' : '展开/折叠'}</span>
                </button>

                {/* 新增按钮 (绿色边框与浅绿字) */}
                <button
                  type="button"
                  onClick={() => handleOpenCreateDeptModal()}
                  className="flex items-center gap-1 px-3 py-1 bg-[#00c88c]/15 hover:bg-[#00c88c]/25 border border-[#00c88c] text-[#00e699] hover:text-emerald-300 rounded text-xs font-medium transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增</span>
                </button>

                {/* 删除按钮 (红色边框与红字) */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedDeptIds.size === 0) {
                      showToast('请在列表中指定要删除的部门项');
                      return;
                    }
                    setDeptDeleteTargetId(null);
                    setDeptDeleteConfirmOpen(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500 text-rose-400 hover:text-rose-300 rounded text-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除</span>
                </button>
              </div>
            </div>

            {/* 卡片二: 数据列表树形表格 (严格遵循截图: 部门名称, 排序, 负责人, 联系电话, 部门状态, 操作) */}
            <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl">
              {/* 标头: 绿色竖条指示器 + 数据列表 */}
              <div className="flex items-center justify-between border-b border-[#18284c]/60 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                  <h2 className="text-sm font-bold text-white tracking-wide">数据列表</h2>
                </div>
                <div className="text-xs text-slate-400 font-mono text-[11px]">
                  更新时间已同步至 2026-10 近期
                </div>
              </div>

              {/* 树形数据表格 */}
              <div className="overflow-x-auto rounded-lg border border-[#18284c]">
                <table className="w-full text-xs text-left border-collapse">
                  {/* 表头 (统一暗蓝/墨绿科技底色) */}
                  <thead>
                    <tr className="bg-[#0c1833] text-slate-300 font-semibold border-b border-[#18284c]">
                      <th className="py-3 px-5 w-[380px]">部门名称</th>
                      <th className="py-3 px-3 text-center w-[90px]">排序</th>
                      <th className="py-3 px-4 w-[160px]">负责人</th>
                      <th className="py-3 px-4 w-[180px]">联系电话</th>
                      <th className="py-3 px-3 text-center w-[120px]">部门状态</th>
                      <th className="py-3 px-4 text-center w-[140px]">操作</th>
                    </tr>
                  </thead>

                  {/* 表格内容 */}
                  <tbody className="divide-y divide-[#18284c]/60">
                    {filteredDeptList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          未检索到符合条件的部门数据
                        </td>
                      </tr>
                    ) : (
                      filteredDeptList.map((root) => {
                        const hasLevel2 = Boolean(root.children && root.children.length > 0);
                        const isRootExpanded = deptExpandedNodeIds.has(root.id);

                        return (
                          <React.Fragment key={root.id}>
                            {/* 一级根机构行 (对应截图: 黑耳科技) */}
                            <tr className="hover:bg-[#0c1833]/60 bg-[#060c1d]/50 transition-colors">
                              {/* 部门名称 + 展开箭头 */}
                              <td className="py-3 px-5">
                                <div className="flex items-center gap-2">
                                  {hasLevel2 ? (
                                    <button
                                      type="button"
                                      onClick={() => toggleDeptNodeExpand(root.id)}
                                      className="w-4 h-4 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                                    >
                                      {isRootExpanded ? (
                                        <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  ) : (
                                    <span className="w-4 h-4 inline-block" />
                                  )}
                                  <span className="font-semibold text-white tracking-wide">
                                    {root.deptName}
                                  </span>
                                </div>
                              </td>

                              {/* 排序 */}
                              <td className="py-3 px-3 text-center font-mono text-slate-300">
                                {root.orderNum}
                              </td>

                              {/* 负责人 */}
                              <td className="py-3 px-4 text-slate-200">
                                {root.leader}
                              </td>

                              {/* 联系电话 */}
                              <td className="py-3 px-4 font-mono text-slate-300">
                                {root.phone}
                              </td>

                              {/* 部门状态 Toggle 开关 (绿色药丸滑块) */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleDeptStatus(root.id, root.status)}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                    root.status ? 'bg-[#00c88c]' : 'bg-slate-700'
                                  }`}
                                  title={root.status ? '点击停用' : '点击启用'}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                      root.status ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </td>

                              {/* 操作 (三个小按钮: 编辑(橙) + 删除(红) + 新增子项(绿)) */}
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditDeptModal(root)}
                                    className="w-6 h-6 rounded bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/70 text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                                    title="修改部门"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeptDeleteTargetId(root.id);
                                      setDeptDeleteConfirmOpen(true);
                                    }}
                                    className="w-6 h-6 rounded bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/70 text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                                    title="删除部门"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenCreateDeptModal(root.id)}
                                    className="w-6 h-6 rounded bg-[#00c88c]/15 hover:bg-[#00c88c]/30 border border-[#00c88c]/70 text-[#00e699] flex items-center justify-center transition-colors cursor-pointer"
                                    title="新增子级部门"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* 二级分支 (对应截图: 合肥总公司, 南京分公司, 杭州分公司) */}
                            {hasLevel2 &&
                              isRootExpanded &&
                              root.children!.map((sub) => {
                                const hasLevel3 = Boolean(sub.children && sub.children.length > 0);
                                const isSubExpanded = deptExpandedNodeIds.has(sub.id);

                                return (
                                  <React.Fragment key={sub.id}>
                                    <tr className="hover:bg-[#0c1833]/70 bg-[#060c1d]/40 transition-colors">
                                      {/* 二级部门名称 (缩进 + 展开箭头) */}
                                      <td className="py-3 px-5 pl-10">
                                        <div className="flex items-center gap-2">
                                          {hasLevel3 ? (
                                            <button
                                              type="button"
                                              onClick={() => toggleDeptNodeExpand(sub.id)}
                                              className="w-4 h-4 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                                            >
                                              {isSubExpanded ? (
                                                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                                              ) : (
                                                <ChevronRight className="w-3.5 h-3.5" />
                                              )}
                                            </button>
                                          ) : (
                                            <span className="w-4 h-4 inline-block" />
                                          )}
                                          <span className="font-medium text-slate-200 hover:text-white">
                                            {sub.deptName}
                                          </span>
                                        </div>
                                      </td>

                                      {/* 排序 */}
                                      <td className="py-3 px-3 text-center font-mono text-slate-300">
                                        {sub.orderNum}
                                      </td>

                                      {/* 负责人 */}
                                      <td className="py-3 px-4 text-slate-300">
                                        {sub.leader}
                                      </td>

                                      {/* 联系电话 */}
                                      <td className="py-3 px-4 font-mono text-slate-300">
                                        {sub.phone}
                                      </td>

                                      {/* 部门状态 Toggle */}
                                      <td className="py-3 px-3 text-center">
                                        <button
                                          type="button"
                                          onClick={() => handleToggleDeptStatus(sub.id, sub.status)}
                                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                            sub.status ? 'bg-[#00c88c]' : 'bg-slate-700'
                                          }`}
                                          title={sub.status ? '点击停用' : '点击启用'}
                                        >
                                          <span
                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                              sub.status ? 'translate-x-4' : 'translate-x-0'
                                            }`}
                                          />
                                        </button>
                                      </td>

                                      {/* 操作 (编辑 + 删除 + 新增子项) */}
                                      <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() => handleOpenEditDeptModal(sub)}
                                            className="w-6 h-6 rounded bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/70 text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                                            title="修改部门"
                                          >
                                            <Edit className="w-3 h-3" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setDeptDeleteTargetId(sub.id);
                                              setDeptDeleteConfirmOpen(true);
                                            }}
                                            className="w-6 h-6 rounded bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/70 text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                                            title="删除部门"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleOpenCreateDeptModal(sub.id)}
                                            className="w-6 h-6 rounded bg-[#00c88c]/15 hover:bg-[#00c88c]/30 border border-[#00c88c]/70 text-[#00e699] flex items-center justify-center transition-colors cursor-pointer"
                                            title="新增子级部门"
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>

                                    {/* 三级职能部门 (对应截图: 财务部门, 行政部门, 研发部门, 市场部门, 人事部门) */}
                                    {hasLevel3 &&
                                      isSubExpanded &&
                                      sub.children!.map((dept3) => (
                                        <tr
                                          key={dept3.id}
                                          className="hover:bg-[#0c1833]/80 bg-[#060c1d]/60 transition-colors"
                                        >
                                          {/* 三级名称 (缩进 + 无箭头) */}
                                          <td className="py-2.5 px-5 pl-18">
                                            <span className="text-slate-300 font-normal hover:text-white">
                                              {dept3.deptName}
                                            </span>
                                          </td>

                                          {/* 排序 */}
                                          <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                                            {dept3.orderNum}
                                          </td>

                                          {/* 负责人 */}
                                          <td className="py-2.5 px-4 text-slate-300">
                                            {dept3.leader}
                                          </td>

                                          {/* 联系电话 */}
                                          <td className="py-2.5 px-4 font-mono text-slate-400">
                                            {dept3.phone}
                                          </td>

                                          {/* 部门状态 Toggle (注意财务与市场部门状态为已停用/灰色滑块，完全匹配截图) */}
                                          <td className="py-2.5 px-3 text-center">
                                            <button
                                              type="button"
                                              onClick={() => handleToggleDeptStatus(dept3.id, dept3.status)}
                                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                                dept3.status ? 'bg-[#00c88c]' : 'bg-slate-700'
                                              }`}
                                              title={dept3.status ? '点击停用' : '点击启用'}
                                            >
                                              <span
                                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                                  dept3.status ? 'translate-x-4' : 'translate-x-0'
                                                }`}
                                              />
                                            </button>
                                          </td>

                                          {/* 操作 */}
                                          <td className="py-2.5 px-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                              <button
                                                type="button"
                                                onClick={() => handleOpenEditDeptModal(dept3)}
                                                className="w-6 h-6 rounded bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/70 text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                                                title="修改部门"
                                              >
                                                <Edit className="w-3 h-3" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setDeptDeleteTargetId(dept3.id);
                                                  setDeptDeleteConfirmOpen(true);
                                                }}
                                                className="w-6 h-6 rounded bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/70 text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                                                title="删除部门"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleOpenCreateDeptModal(dept3.id)}
                                                className="w-6 h-6 rounded bg-[#00c88c]/15 hover:bg-[#00c88c]/30 border border-[#00c88c]/70 text-[#00e699] flex items-center justify-center transition-colors cursor-pointer"
                                                title="新增科室/班组"
                                              >
                                                <Plus className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))
                                    }
                                  </React.Fragment>
                                );
                              })
                            }
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* 表格底部综合分页控件 (严格匹配截图布局: 共2000条数据 每页[10]条 < 1 2 3 4 5 ... 20 > 跳转 [] 页) */}
              <div className="mt-4 pt-3 border-t border-[#18284c] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-sans">
                {/* 左侧条数统计与单页容量切换 */}
                <div className="flex items-center gap-2">
                  <span>共 <strong className="text-emerald-400 font-mono font-bold">2000</strong> 条数据</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    每页
                    <select
                      aria-label="每页显示条数"
                      value={deptPageSize}
                      onChange={(e) => {
                        setDeptPageSize(Number(e.target.value));
                        setDeptPage(1);
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
                    onClick={() => setDeptPage((p) => Math.max(1, p - 1))}
                    disabled={deptPage === 1}
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
                      onClick={() => setDeptPage(num)}
                      className={`w-7 h-7 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                        deptPage === num
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
                    onClick={() => setDeptPage(20)}
                    className={`w-7 h-7 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                      deptPage === 20
                        ? 'bg-[#00c88c] text-slate-950 font-bold shadow-xs'
                        : 'border border-[#18284c] bg-[#060c1d] text-slate-300 hover:bg-[#0c1833] hover:border-emerald-600'
                    }`}
                  >
                    20
                  </button>

                  {/* 下一页 */}
                  <button
                    type="button"
                    onClick={() => setDeptPage((p) => Math.min(20, p + 1))}
                    disabled={deptPage === 20}
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
                      value={deptJumpPage}
                      onChange={(e) => setDeptJumpPage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const p = parseInt(deptJumpPage, 10);
                          if (!isNaN(p) && p >= 1 && p <= 20) {
                            setDeptPage(p);
                            setDeptJumpPage('');
                          }
                        }
                      }}
                      placeholder={String(deptPage)}
                      className="w-10 h-7 bg-[#060c1d] border border-[#18284c] rounded text-center text-slate-200 font-mono text-xs outline-hidden focus:border-[#00c88c]"
                    />
                    <span>页</span>
                    <button
                      type="button"
                      onClick={() => {
                        const p = parseInt(deptJumpPage, 10);
                        if (!isNaN(p) && p >= 1 && p <= 20) {
                          setDeptPage(p);
                          setDeptJumpPage('');
                        }
                      }}
                      className="px-2 h-7 bg-[#060c1d] hover:bg-[#0c1833] border border-[#18284c] text-slate-300 rounded text-xs transition-colors cursor-pointer"
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: 用户管理 (User Management) - 严格遵循截图 image_64311cdb.png */}
        {/* ========================================================================= */}
        {activeTab === 'user' && (
          <div className="flex flex-col lg:flex-row items-start gap-4 animate-in fade-in duration-200">
            {/* 左侧部门树面板 (Department Filter Sidebar) */}
            <div className="w-full lg:w-60 bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl flex flex-col shrink-0">
              {/* 搜索部门输入框 */}
              <div className="relative mb-3.5">
                <input
                  type="text"
                  value={userDeptSearchKeyword}
                  onChange={(e) => setUserDeptSearchKeyword(e.target.value)}
                  placeholder="请输入部门名称搜索"
                  className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg pl-3 pr-8 py-1.5 text-xs text-white placeholder-slate-500 outline-hidden"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 部门层级结构 */}
              <div className="space-y-1 text-xs">
                {/* 根节点: 黑耳科技 */}
                <button
                  type="button"
                  onClick={() => setSelectedDeptTreeItem('黑耳科技')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer font-bold ${
                    selectedDeptTreeItem === '黑耳科技'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                      : 'text-slate-200 hover:bg-[#0c1833]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-400" />
                    <span>黑耳科技</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-normal">全部</span>
                </button>

                {/* 子节点: 综合管理部, 行政人事部, 研发科技部, 等 */}
                <div className="pl-3 space-y-1 pt-1 border-l border-[#18284c]/60 ml-3">
                  {filteredDeptTreeNodes.map((dept) => {
                    const isSelected = selectedDeptTreeItem === dept.name;
                    return (
                      <button
                        key={dept.key}
                        type="button"
                        onClick={() => setSelectedDeptTreeItem(dept.name)}
                        className={`w-full text-left px-2 py-1.5 rounded flex items-center gap-2 transition-colors cursor-pointer text-xs ${
                          isSelected
                            ? 'bg-[#0c1833] text-[#00e699] font-medium border border-emerald-500/40'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1833]/60'
                        }`}
                      >
                        <ChevronRight
                          className={`w-3 h-3 text-slate-500 transition-transform ${
                            isSelected ? 'rotate-90 text-emerald-400' : ''
                          }`}
                        />
                        <span className="truncate">{dept.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 右侧主业务面板 (筛选搜索 + 用户数据列表) */}
            <div className="flex-1 w-full space-y-4">
              {/* 1. 筛选搜索区域 (严格匹配截图格式与布局) */}
              <div className="bg-[#091126] border border-[#18284c] rounded-xl p-4 shadow-xl space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-[#00c88c] rounded-xs inline-block" />
                  <span className="text-xs font-bold text-white tracking-wide">筛选搜索</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* 模糊查找 */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-300 font-medium whitespace-nowrap">模糊查找</label>
                      <input
                        type="text"
                        value={userSearchKeyword}
                        onChange={(e) => setUserSearchKeyword(e.target.value)}
                        placeholder="请输入用户账号/姓名/手机号码查找"
                        className="w-64 bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-hidden"
                      />
                    </div>

                    {/* 用户状态下拉选择 */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-300 font-medium whitespace-nowrap">用户状态</label>
                      <select
                        value={userStatusFilter}
                        onChange={(e) => setUserStatusFilter(e.target.value as any)}
                        className="w-36 bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-1.5 text-xs text-white outline-hidden cursor-pointer"
                      >
                        <option value="all">请选择</option>
                        <option value="enabled">正常</option>
                        <option value="disabled">停用</option>
                      </select>
                    </div>
                  </div>

                  {/* 搜索与重置按钮 */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        showToast(`已完成检索，匹配 ${filteredUserList.length} 条用户数据`)
                      }
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>搜索</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetUserSearch}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-300 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                  </div>
                </div>

                {/* 次级操作工具栏: + 新增 / 删除 */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#18284c]/50">
                  <button
                    type="button"
                    onClick={handleOpenCreateUserModal}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 hover:bg-emerald-900/60 border border-[#00c88c] text-emerald-300 rounded text-xs transition-colors cursor-pointer font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedUserIds.size === 0) {
                        showToast('请先勾选需要删除的用户');
                        return;
                      }
                      setUserDeleteTargetId(null);
                      setUserDeleteConfirmOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/80 text-rose-300 rounded text-xs transition-colors cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>删除</span>
                  </button>
                </div>
              </div>

              {/* 2. 数据列表 (严格匹配截图格式与布局) */}
              <div className="bg-[#091126] border border-[#18284c] rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-[#18284c]/60 pb-3">
                  <span className="w-1 h-3.5 bg-[#00c88c] rounded-xs inline-block" />
                  <span className="text-xs font-bold text-white tracking-wide">数据列表</span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-[#18284c]">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0c1833] text-slate-300 font-semibold border-b border-[#18284c]">
                        <th className="py-3 px-4 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={
                              filteredUserList.length > 0 &&
                              selectedUserIds.size === filteredUserList.length
                            }
                            onChange={handleSelectAllUsers}
                            className="rounded border-[#18284c] text-[#00c88c] accent-[#00c88c] cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-4 w-16 text-center">序号</th>
                        <th className="py-3 px-4">用户账号</th>
                        <th className="py-3 px-4">用户姓名</th>
                        <th className="py-3 px-4">所属部门</th>
                        <th className="py-3 px-4">手机号码</th>
                        <th className="py-3 px-4 text-center">用户状态</th>
                        <th className="py-3 px-4 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#18284c]/60">
                      {filteredUserList.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-500 bg-[#060c1d]/30">
                            未匹配到符合条件的用户数据
                          </td>
                        </tr>
                      ) : (
                        filteredUserList.map((u, idx) => {
                          const isChecked = selectedUserIds.has(u.id);
                          return (
                            <tr
                              key={u.id}
                              className={`transition-colors ${
                                isChecked
                                  ? 'bg-[#00c88c]/10'
                                  : 'hover:bg-[#0c1833]/60 bg-[#060c1d]/40'
                              }`}
                            >
                              <td className="py-3 px-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleSelectUser(u.id)}
                                  className="rounded border-[#18284c] text-[#00c88c] accent-[#00c88c] cursor-pointer"
                                />
                              </td>
                              <td className="py-3 px-4 text-center font-mono text-slate-400">
                                {idx + 1}
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  type="button"
                                  onClick={() => handleOpenUserDetailModal(u)}
                                  className="text-cyan-400 hover:text-cyan-300 hover:underline font-mono font-medium cursor-pointer"
                                  title="点击查看用户详细档案"
                                >
                                  {u.username}
                                </button>
                              </td>
                              <td className="py-3 px-4 text-white font-medium">{u.nickname}</td>
                              <td className="py-3 px-4 text-slate-300">{u.deptName}</td>
                              <td className="py-3 px-4 font-mono text-slate-300">{u.phone}</td>
                              <td className="py-3 px-4 text-center">
                                {/* 绿色/灰色滑块开关 */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserStatus(u.id, u.status)}
                                  title={u.status ? '点击停用' : '点击启用'}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                    u.status ? 'bg-[#00c88c]' : 'bg-slate-600'
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                      u.status ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {/* 四个操作图标: 编辑(黄), 删除(红), 重置密码(绿钥匙), 分配角色(青卡片) */}
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditUserModal(u)}
                                    title="修改用户"
                                    className="w-6 h-6 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setUserDeleteTargetId(u.id);
                                      setUserDeleteConfirmOpen(true);
                                    }}
                                    title="删除用户"
                                    className="w-6 h-6 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/60 text-rose-300 flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenResetPwdModal(u)}
                                    title="重置登录密码"
                                    className="w-6 h-6 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/60 text-emerald-300 flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    <Key className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenRoleAssignModal(u)}
                                    title="分配角色与数据权限"
                                    className="w-6 h-6 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/60 text-cyan-300 flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    <CreditCard className="w-3.5 h-3.5" />
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

                {/* 底部分页栏 (严格匹配截图格式: 共 2000 条数据 每页 10 条, 1 2 3 4 5 ... 20, 跳转) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-slate-400 border-t border-[#18284c]/60">
                  <div className="flex items-center gap-2">
                    <span>
                      共 <strong className="text-emerald-400 font-mono">2000</strong> 条数据
                    </span>
                    <span>每页</span>
                    <select
                      value={userPageSize}
                      onChange={(e) => setUserPageSize(Number(e.target.value))}
                      className="bg-[#060c1d] border border-[#18284c] rounded px-2 py-0.5 text-xs text-white outline-hidden cursor-pointer"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>条</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono">
                    <button
                      type="button"
                      disabled={userPage <= 1}
                      onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                      className="w-7 h-7 rounded border border-[#18284c] bg-[#060c1d] text-slate-400 hover:text-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
                    >
                      &lt;
                    </button>
                    {[1, 2, 3, 4, 5].map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setUserPage(pageNum)}
                        className={`w-7 h-7 rounded text-xs transition-colors cursor-pointer font-bold ${
                          userPage === pageNum
                            ? 'bg-[#00c88c] text-slate-950 shadow-md'
                            : 'border border-[#18284c] bg-[#060c1d] text-slate-300 hover:text-white hover:bg-[#0c1833]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <span className="px-1 text-slate-500">...</span>
                    <button
                      type="button"
                      onClick={() => setUserPage(20)}
                      className={`w-7 h-7 rounded text-xs transition-colors cursor-pointer ${
                        userPage === 20
                          ? 'bg-[#00c88c] text-slate-950 font-bold'
                          : 'border border-[#18284c] bg-[#060c1d] text-slate-300 hover:text-white'
                      }`}
                    >
                      20
                    </button>
                    <button
                      type="button"
                      disabled={userPage >= 20}
                      onClick={() => setUserPage((p) => Math.min(20, p + 1))}
                      className="w-7 h-7 rounded border border-[#18284c] bg-[#060c1d] text-slate-400 hover:text-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
                    >
                      &gt;
                    </button>

                    <div className="flex items-center gap-1.5 ml-2 text-slate-400 font-sans">
                      <span>跳转</span>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={userJumpPage}
                        onChange={(e) => setUserJumpPage(e.target.value)}
                        className="w-10 h-7 bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded text-center text-xs text-white outline-hidden font-mono"
                      />
                      <span>页</span>
                      <button
                        type="button"
                        onClick={() => {
                          const p = parseInt(userJumpPage, 10);
                          if (!isNaN(p) && p >= 1 && p <= 20) {
                            setUserPage(p);
                            setUserJumpPage('');
                          }
                        }}
                        className="px-2 h-7 bg-[#060c1d] hover:bg-[#0c1833] border border-[#18284c] text-slate-300 rounded text-xs transition-colors cursor-pointer"
                      >
                        确定
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 新增 / 修改菜单 Modal 弹窗 */}
      {/* ========================================================================= */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-[#00c88c] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18284c] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  <span>
                    {menuModalMode === 'create'
                      ? activeMenuForm.parentId
                        ? '新增子菜单'
                        : '新增菜单项'
                      : '修改菜单配置'}
                  </span>
                  {activeMenuForm.parentId && (
                    <span className="text-[10px] font-mono font-normal bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded">
                      子级节点
                    </span>
                  )}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMenuModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#060c1d] border border-[#18284c] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
              {/* 上级菜单选项 (支持选择顶级类目或任一主菜单作为上级) */}
              <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-3 space-y-1.5">
                <label className="block text-slate-300 font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-[#00c88c] rounded-xs inline-block" />
                    <span>上级菜单</span>
                    <span className="text-rose-400">*</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {activeMenuForm.parentId
                      ? `已选挂载父级: ${menuList.find((m) => m.id === activeMenuForm.parentId)?.name || activeMenuForm.parentId}`
                      : '当前设为: 顶级类目 (一级菜单)'}
                  </span>
                </label>
                <select
                  value={activeMenuForm.parentId || ''}
                  onChange={(e) =>
                    setActiveMenuForm({ ...activeMenuForm, parentId: e.target.value })
                  }
                  className="w-full bg-[#091126] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden cursor-pointer text-xs"
                >
                  <option value="">📁 主类目 / 顶级主菜单 (无上级节点)</option>
                  {menuList.map((parent) => (
                    <React.Fragment key={parent.id}>
                      <option
                        value={parent.id}
                        disabled={menuModalMode === 'edit' && parent.id === activeMenuForm.id}
                      >
                        📂 {parent.name} (一级主目录, 排序 {parent.orderNum})
                      </option>
                      {parent.children?.map((child) => (
                        <option
                          key={child.id}
                          value={child.id}
                          disabled={
                            menuModalMode === 'edit' &&
                            (child.id === activeMenuForm.id || parent.id === activeMenuForm.id)
                          }
                        >
                          &nbsp;&nbsp;&nbsp;&nbsp;└ 📄 {child.name} (二级节点)
                        </option>
                      ))}
                    </React.Fragment>
                  ))}
                </select>
                <div className="text-[10px] text-slate-400">
                  若需创建二级或三级子功能，请在此选择归属的上级菜单；如作为主导航请选“主类目 / 顶级主菜单”。
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    菜单名称 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={activeMenuForm.name}
                    onChange={(e) => setActiveMenuForm({ ...activeMenuForm, name: e.target.value })}
                    placeholder="如: 碳汇一张图 / 需求信息"
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">显示排序</label>
                  <input
                    type="number"
                    value={activeMenuForm.orderNum}
                    onChange={(e) =>
                      setActiveMenuForm({ ...activeMenuForm, orderNum: Number(e.target.value) })
                    }
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">权限标识 (Perms)</label>
                  <input
                    type="text"
                    value={activeMenuForm.perms}
                    onChange={(e) => setActiveMenuForm({ ...activeMenuForm, perms: e.target.value })}
                    placeholder="如: sdyzt:index 或 bszx:cdgl:index"
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white font-mono outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">组件/路由路径</label>
                  <input
                    type="text"
                    value={activeMenuForm.component}
                    onChange={(e) =>
                      setActiveMenuForm({ ...activeMenuForm, component: e.target.value })
                    }
                    placeholder="如: module/sdyzt/index"
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white font-mono outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">菜单图标</label>
                  <select
                    value={activeMenuForm.iconName}
                    onChange={(e) =>
                      setActiveMenuForm({ ...activeMenuForm, iconName: e.target.value })
                    }
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden cursor-pointer"
                  >
                    <option value="Home">Home (首页)</option>
                    <option value="Globe">Globe (空间遥感一张图)</option>
                    <option value="Users">Users (交易与机构)</option>
                    <option value="Layers">Layers (项目开发)</option>
                    <option value="DollarSign">DollarSign (金融服务)</option>
                    <option value="Settings">Settings (系统管理)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">菜单启用状态</label>
                  <div className="flex items-center gap-4 pt-1.5">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
                      <input
                        type="radio"
                        checked={activeMenuForm.status === true}
                        onChange={() => setActiveMenuForm({ ...activeMenuForm, status: true })}
                        className="accent-[#00c88c]"
                      />
                      <span>正常启用</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-400">
                      <input
                        type="radio"
                        checked={activeMenuForm.status === false}
                        onChange={() => setActiveMenuForm({ ...activeMenuForm, status: false })}
                        className="accent-slate-500"
                      />
                      <span>已停用</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#18284c]">
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className="px-4 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-300 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer shadow-md"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 删除确认对话框 */}
      {/* ========================================================================= */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-rose-500/80 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">确认删除菜单项</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              您确定要删除选中的菜单项目吗？此操作将级联影响绑定的子级功能路由，请谨慎操作。
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-3.5 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-300 rounded-lg text-xs cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow-md"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 新增 / 修改角色 Modal 弹窗 */}
      {/* ========================================================================= */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-[#00c88c] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18284c] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {roleModalMode === 'create' ? '新增系统角色' : '修改角色配置'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#060c1d] border border-[#18284c] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    角色名称 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={activeRoleForm.roleName}
                    onChange={(e) => setActiveRoleForm({ ...activeRoleForm, roleName: e.target.value })}
                    placeholder="如: 碳汇交易经纪人"
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    权限字符 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={activeRoleForm.roleKey}
                    onChange={(e) => setActiveRoleForm({ ...activeRoleForm, roleKey: e.target.value })}
                    placeholder="如: carbon_broker 或 admin"
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">角色显示顺序</label>
                  <input
                    type="number"
                    value={activeRoleForm.orderNum}
                    onChange={(e) =>
                      setActiveRoleForm({ ...activeRoleForm, orderNum: Number(e.target.value) })
                    }
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">角色状态</label>
                  <div className="flex items-center gap-4 pt-1.5">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
                      <input
                        type="radio"
                        checked={activeRoleForm.status === true}
                        onChange={() => setActiveRoleForm({ ...activeRoleForm, status: true })}
                        className="accent-[#00c88c]"
                      />
                      <span>正常启用</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-400">
                      <input
                        type="radio"
                        checked={activeRoleForm.status === false}
                        onChange={() => setActiveRoleForm({ ...activeRoleForm, status: false })}
                        className="accent-slate-500"
                      />
                      <span>已停用</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">角色职责与描述</label>
                <textarea
                  rows={2}
                  value={activeRoleForm.remark}
                  onChange={(e) => setActiveRoleForm({ ...activeRoleForm, remark: e.target.value })}
                  placeholder="请输入该角色负责的业务板块与核心权限范围..."
                  className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg p-2.5 text-white outline-hidden"
                />
              </div>

              {/* 菜单权限快捷分配树 */}
              <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">功能菜单权限分配</span>
                  <span className="text-[10px] text-emerald-400 font-mono">已挂载 2026 最新 RBAC 权限模版</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                  {[
                    '首页 (index)',
                    '碳汇一张图 (onemap)',
                    '产品交易 (trading)',
                    '项目开发 (project)',
                    '价值核算 (value_calc)',
                    '金融服务 (finance)',
                    '评估认证 (assessment)',
                    '产业服务 (industry)',
                    '系统设置 (system)',
                  ].map((perm, idx) => (
                    <label key={idx} className="flex items-center gap-1.5 text-slate-300 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        defaultChecked={idx < 5}
                        className="rounded border-[#18284c] text-[#00c88c] accent-[#00c88c]"
                      />
                      <span className="truncate">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#18284c]">
                <button
                  type="button"
                  onClick={() => setRoleModalOpen(false)}
                  className="px-4 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-300 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer shadow-md"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 角色数据权限分配 Modal (点击操作列第3个绿色盾牌/卡片按钮打开) */}
      {/* ========================================================================= */}
      {rolePermissionModalOpen && activePermissionRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-[#00c88c] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18284c] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00e699]" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  数据权限与范围分配 · {activePermissionRole.roleName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRolePermissionModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#060c1d] border border-[#18284c] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-3 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">角色名称：</span>
                  <span className="text-white font-medium">{activePermissionRole.roleName}</span>
                </div>
                <div>
                  <span className="text-slate-400">权限字符：</span>
                  <span className="text-emerald-400 font-mono">{activePermissionRole.roleKey}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">数据范围 (Data Scope)</label>
                <select
                  value={dataScopeSelection}
                  onChange={(e) => setDataScopeSelection(e.target.value)}
                  className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden cursor-pointer"
                >
                  <option value="1">全部数据权限 (无限制跨部门调阅)</option>
                  <option value="2">本部门及以下数据权限 (层级穿透)</option>
                  <option value="3">本部门数据权限 (同级部门隔离)</option>
                  <option value="4">仅本人数据权限 (个人私有工作流)</option>
                  <option value="5">自定数据权限 (指定样地与机构白名单)</option>
                </select>
              </div>

              <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-3 space-y-2">
                <div className="text-slate-300 font-medium">授权生效范围节点</div>
                <div className="space-y-1.5 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded accent-[#00c88c]" />
                    <span>国家碳汇智能运营中心 (本部)</span>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <input type="checkbox" defaultChecked className="rounded accent-[#00c88c]" />
                    <span>空间遥感与GIS时空信息部</span>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <input type="checkbox" defaultChecked className="rounded accent-[#00c88c]" />
                    <span>碳储量核算与量化实验室</span>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <input type="checkbox" defaultChecked className="rounded accent-[#00c88c]" />
                    <span>碳资产流转与市场交易部</span>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <input type="checkbox" defaultChecked className="rounded accent-[#00c88c]" />
                    <span>绿色金融与风控审计室</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#18284c]">
                <span className="text-[10px] text-slate-500 font-mono">
                  更新时间：{activePermissionRole.updateTime || '2026-10-29 11:50:00'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRolePermissionModalOpen(false)}
                    className="px-4 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-300 rounded-lg cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`已成功保存 [${activePermissionRole.roleName}] 数据权限范围配置`);
                      setRolePermissionModalOpen(false);
                    }}
                    className="px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer shadow-md"
                  >
                    保存授权
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 角色详细档案 Modal (点击绿色角色名称打开) */}
      {/* ========================================================================= */}
      {roleDetailModalOpen && activeDetailRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-[#00c88c] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18284c] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  角色档案明细 · {activeDetailRole.roleName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRoleDetailModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#060c1d] border border-[#18284c] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#060c1d] border border-[#18284c] rounded-xl p-3.5">
                <div>
                  <div className="text-[10px] text-slate-400">角色标识</div>
                  <div className="text-emerald-400 font-mono font-semibold text-sm mt-0.5">
                    {activeDetailRole.roleKey}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">显示顺序</div>
                  <div className="text-white font-mono font-semibold text-sm mt-0.5">
                    第 {activeDetailRole.orderNum} 级
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">在册用户</div>
                  <div className="text-[#38bdf8] font-mono font-semibold text-sm mt-0.5">
                    {activeDetailRole.userCount} 位授权成员
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">当前状态</div>
                  <div className="mt-0.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-medium">
                      {activeDetailRole.status ? '正常启用' : '已停用'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-3.5 space-y-1">
                <div className="text-slate-400 font-medium">职责定位与权限描述</div>
                <div className="text-slate-200 leading-relaxed">{activeDetailRole.remark}</div>
              </div>

              <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">近期认证与运维时间 (2026年)</span>
                  <span className="text-emerald-400 font-mono text-[11px]">等保三级安全审计在网</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                  <div>创建时间: {activeDetailRole.createTime}</div>
                  <div>更新时间: {activeDetailRole.updateTime || '2026-10-29 08:30:00'}</div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-[#18284c]">
                <button
                  type="button"
                  onClick={() => setRoleDetailModalOpen(false)}
                  className="px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 删除角色确认对话框 */}
      {/* ========================================================================= */}
      {roleDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-rose-500/80 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">确认删除系统角色</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              您确定要删除选中的系统角色吗？若该角色已绑定在册操作员，删除后将降级为普通无权限状态，请谨慎操作。
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRoleDeleteConfirmOpen(false)}
                className="px-3.5 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-300 rounded-lg text-xs cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteRole}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow-md"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 新增 / 修改部门 Modal 弹窗 (严格支持包含上级部门的配置) */}
      {/* ========================================================================= */}
      {deptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-[#00c88c] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18284c] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {deptModalMode === 'create' ? '新增组织部门' : '修改部门档案'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDeptModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#060c1d] border border-[#18284c] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDept} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  上级部门 <span className="text-slate-400 font-normal">(顶级部门无上级)</span>
                </label>
                <select
                  value={activeDeptForm.parentId || ''}
                  onChange={(e) => setActiveDeptForm({ ...activeDeptForm, parentId: e.target.value })}
                  className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden cursor-pointer"
                >
                  <option value="">🏢 顶级部门 / 集团总部 (无上级)</option>
                  <option value="1">📁 黑耳科技 (集团本部)</option>
                  <option value="1-1">&nbsp;&nbsp;&nbsp;&nbsp;└ 📂 合肥总公司</option>
                  <option value="1-2">&nbsp;&nbsp;&nbsp;&nbsp;└ 📂 南京分公司</option>
                  <option value="1-3">&nbsp;&nbsp;&nbsp;&nbsp;└ 📂 杭州分公司</option>
                  <option value="1-4">&nbsp;&nbsp;&nbsp;&nbsp;└ 📂 上海分公司</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    部门名称 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={activeDeptForm.deptName}
                    onChange={(e) => setActiveDeptForm({ ...activeDeptForm, deptName: e.target.value })}
                    placeholder="如: 碳核算与资产运营部"
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">显示排序</label>
                  <input
                    type="number"
                    value={activeDeptForm.orderNum}
                    onChange={(e) =>
                      setActiveDeptForm({ ...activeDeptForm, orderNum: Number(e.target.value) })
                    }
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">负责人</label>
                  <input
                    type="text"
                    value={activeDeptForm.leader}
                    onChange={(e) => setActiveDeptForm({ ...activeDeptForm, leader: e.target.value })}
                    placeholder="如: 张主管"
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">联系电话</label>
                  <input
                    type="text"
                    value={activeDeptForm.phone}
                    onChange={(e) => setActiveDeptForm({ ...activeDeptForm, phone: e.target.value })}
                    placeholder="如: 0550-666888"
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">部门状态</label>
                <div className="flex items-center gap-4 pt-1.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
                    <input
                      type="radio"
                      checked={activeDeptForm.status === true}
                      onChange={() => setActiveDeptForm({ ...activeDeptForm, status: true })}
                      className="accent-[#00c88c]"
                    />
                    <span>正常启用</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-400">
                    <input
                      type="radio"
                      checked={activeDeptForm.status === false}
                      onChange={() => setActiveDeptForm({ ...activeDeptForm, status: false })}
                      className="accent-slate-500"
                    />
                    <span>已停用</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#18284c]">
                <button
                  type="button"
                  onClick={() => setDeptModalOpen(false)}
                  className="px-4 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-300 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer shadow-md"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 删除部门确认对话框 */}
      {/* ========================================================================= */}
      {deptDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-rose-500/80 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">确认删除部门</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              您确定要删除选中的组织部门吗？该部门下关联的子级团队及业务数据流向将受影响，请谨慎操作。
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeptDeleteConfirmOpen(false)}
                className="px-3.5 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-300 rounded-lg text-xs cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteDept}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow-md"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 新增 / 修改用户 Modal 弹窗 */}
      {/* ========================================================================= */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-[#00c88c] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18284c] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {userModalMode === 'create' ? '新增系统操作用户' : '修改操作用户信息'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#060c1d] border border-[#18284c] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    用户账号 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={activeUserForm.username}
                    onChange={(e) =>
                      setActiveUserForm({ ...activeUserForm, username: e.target.value })
                    }
                    placeholder="如: zhangsan / user06"
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    用户姓名 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={activeUserForm.nickname}
                    onChange={(e) =>
                      setActiveUserForm({ ...activeUserForm, nickname: e.target.value })
                    }
                    placeholder="如: 赵六"
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    所属部门 <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={activeUserForm.deptName}
                    onChange={(e) =>
                      setActiveUserForm({ ...activeUserForm, deptName: e.target.value })
                    }
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden cursor-pointer"
                  >
                    <option value="全球事业部">全球事业部</option>
                    <option value="投标管理部">投标管理部</option>
                    <option value="行政人事部">行政人事部</option>
                    <option value="综合管理部">综合管理部</option>
                    <option value="研发科技部">研发科技部</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">分配角色</label>
                  <select
                    value={activeUserForm.roleName}
                    onChange={(e) =>
                      setActiveUserForm({ ...activeUserForm, roleName: e.target.value })
                    }
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden cursor-pointer"
                  >
                    <option value="超级管理员">超级管理员</option>
                    <option value="全球业务总监">全球业务总监</option>
                    <option value="投标项目经理">投标项目经理</option>
                    <option value="行政人事专员">行政人事专员</option>
                    <option value="综合运营主管">综合运营主管</option>
                    <option value="碳汇算法架构师">碳汇算法架构师</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">手机号码</label>
                  <input
                    type="text"
                    value={activeUserForm.phone}
                    onChange={(e) =>
                      setActiveUserForm({ ...activeUserForm, phone: e.target.value })
                    }
                    placeholder="如: 18866668888"
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">电子邮箱</label>
                  <input
                    type="email"
                    value={activeUserForm.email}
                    onChange={(e) =>
                      setActiveUserForm({ ...activeUserForm, email: e.target.value })
                    }
                    placeholder="如: user@carbon.gov.cn"
                    className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">账号启用状态</label>
                <div className="flex items-center gap-4 pt-1.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
                    <input
                      type="radio"
                      checked={activeUserForm.status === true}
                      onChange={() => setActiveUserForm({ ...activeUserForm, status: true })}
                      className="accent-[#00c88c]"
                    />
                    <span>正常启用</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-400">
                    <input
                      type="radio"
                      checked={activeUserForm.status === false}
                      onChange={() => setActiveUserForm({ ...activeUserForm, status: false })}
                      className="accent-slate-500"
                    />
                    <span>已停用</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#18284c]">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-300 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer shadow-md"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 重置用户密码 Modal */}
      {/* ========================================================================= */}
      {userResetPwdModalOpen && activeResetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-[#00c88c] rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18284c] pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Key className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">重置操作员登录密码</h3>
              </div>
              <button
                type="button"
                onClick={() => setUserResetPwdModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#060c1d] border border-[#18284c] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#060c1d] border border-[#18284c] rounded-lg p-3 space-y-1">
                <div className="text-slate-400">
                  目标账号：<span className="text-cyan-400 font-mono font-bold">{activeResetUser.username}</span>
                </div>
                <div className="text-slate-400">
                  用户姓名：<span className="text-white font-medium">{activeResetUser.nickname}</span>
                </div>
                <div className="text-slate-400">
                  归属部门：<span className="text-slate-300">{activeResetUser.deptName}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  新登录密码 <span className="text-emerald-400">(已自动生成安全强密码)</span>
                </label>
                <input
                  type="text"
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  className="w-full bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-lg px-3 py-2 text-white font-mono outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#18284c]">
                <button
                  type="button"
                  onClick={() => setUserResetPwdModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-300 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetPwd}
                  className="px-3.5 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer shadow-md"
                >
                  确认重置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 分配角色与数据权限 Modal */}
      {/* ========================================================================= */}
      {userRoleModalOpen && activeRoleAssignUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-[#00c88c] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18284c] pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  分配用户角色与权限 · {activeRoleAssignUser.nickname}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUserRoleModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#060c1d] border border-[#18284c] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-3 grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-400">账号：</span>
                  <span className="text-cyan-400 font-mono font-medium">{activeRoleAssignUser.username}</span>
                </div>
                <div>
                  <span className="text-slate-400">部门：</span>
                  <span className="text-white">{activeRoleAssignUser.deptName}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">授予系统角色</label>
                <div className="space-y-2 bg-[#060c1d] border border-[#18284c] rounded-xl p-3">
                  {[
                    '超级管理员',
                    '全球业务总监',
                    '投标项目经理',
                    '行政人事专员',
                    '综合运营主管',
                    '碳汇算法架构师',
                  ].map((role) => (
                    <label key={role} className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="radio"
                        name="assignedRole"
                        checked={assignedRoleValue === role}
                        onChange={() => setAssignedRoleValue(role)}
                        className="accent-[#00c88c]"
                      />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#18284c]">
                <button
                  type="button"
                  onClick={() => setUserRoleModalOpen(false)}
                  className="px-4 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-300 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRoleAssign}
                  className="px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer shadow-md"
                >
                  保存授权
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 用户详细档案 Modal (点击青色用户账号进入) */}
      {/* ========================================================================= */}
      {userDetailModalOpen && activeDetailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-[#00c88c] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18284c] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#00c88c] rounded-xs inline-block" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  用户档案明细 · {activeDetailUser.nickname}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUserDetailModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#060c1d] border border-[#18284c] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#060c1d] border border-[#18284c] rounded-xl p-3.5">
                <div>
                  <div className="text-[10px] text-slate-400">登录账号</div>
                  <div className="text-cyan-400 font-mono font-semibold text-sm mt-0.5">
                    {activeDetailUser.username}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">真实姓名</div>
                  <div className="text-white font-medium text-sm mt-0.5">
                    {activeDetailUser.nickname}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">所属部门</div>
                  <div className="text-slate-200 font-medium text-sm mt-0.5">
                    {activeDetailUser.deptName}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">手机号码</div>
                  <div className="text-slate-300 font-mono text-sm mt-0.5">
                    {activeDetailUser.phone}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">所属角色</div>
                  <div className="mt-0.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-950 border border-blue-800 text-cyan-300 font-medium">
                      {activeDetailUser.roleName}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">账号状态</div>
                  <div className="mt-0.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        activeDetailUser.status
                          ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                          : 'bg-slate-800 border border-slate-700 text-slate-400'
                      }`}
                    >
                      {activeDetailUser.status ? '正常启用' : '已停用'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#060c1d] border border-[#18284c] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">近期认证与登录安全 (2026年)</span>
                  <span className="text-emerald-400 font-mono text-[11px]">IP白名单已就绪</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                  <div>最后登录: {activeDetailUser.lastLoginTime}</div>
                  <div>登录地址: {activeDetailUser.loginIp}</div>
                  <div>在册创建: {activeDetailUser.createTime}</div>
                  <div>电子邮箱: {activeDetailUser.email || '未绑定'}</div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-[#18284c]">
                <button
                  type="button"
                  onClick={() => setUserDetailModalOpen(false)}
                  className="px-4 py-1.5 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 删除用户确认对话框 */}
      {/* ========================================================================= */}
      {userDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#091126] border border-rose-500/80 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">确认注销系统用户</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              您确定要删除选中的操作用户吗？该操作将即时注销该账号的所有会话令牌与数据读写权限。
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserDeleteConfirmOpen(false)}
                className="px-3.5 py-1.5 bg-[#18284c] hover:bg-[#223868] text-slate-300 rounded-lg text-xs cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow-md"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
