export type AuthMode = 'password' | 'sms' | 'qrcode' | 'ca';

export type UserRole = 'admin' | 'auditor' | 'trader' | 'regulator';

export interface UserRoleInfo {
  id: UserRole;
  name: string;
  nameEn: string;
  tag: string;
  desc: string;
}

export interface DemoAccount {
  role: UserRole;
  roleName: string;
  username: string;
  password: string;
  phone: string;
  avatar: string;
  department: string;
}

export interface CarbonProject {
  id: string;
  name: string;
  location: string;
  category: '林业碳汇' | '海洋蓝碳' | '湿地草地' | '退耕还林';
  areaHectares: number;
  annualCO2Sequestration: number; // in tonnes
  ndvIndex: number;
  status: 'active' | 'verifying' | 'trading';
  updateTime: string;
}

export interface RealtimeTelemetry {
  co2FluxPPM: number;
  totalForestBiomass: number; // 万吨
  annualReductionTons: number;
  todayIncrementalCO2: number;
  sensorCount: number;
  ndviAverage: number;
}
