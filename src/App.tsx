/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OneMapView } from './components/OneMapView';
import { PortalView } from './components/PortalView';
import { ProjectDevView } from './components/ProjectDevView';
import { ModuleDetailModal } from './components/ModuleDetailModal';
import { CanvasBackground } from './components/CanvasBackground';
import { LeftShowcase } from './components/LeftShowcase';
import { LoginForm } from './components/LoginForm';
import { TermsModal } from './components/TermsModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { CarbonValueView } from './components/CarbonValueView';
import { TradingSystemView } from './components/TradingSystemView';
import { CarbonFinanceView } from './components/CarbonFinanceView';
import { CarbonAssessmentView } from './components/CarbonAssessmentView';
import { CarbonIndustryView } from './components/CarbonIndustryView';
import { CarbonSettingsView } from './components/CarbonSettingsView';
import { PortalModule } from './data/portalModules';
import { UserRole } from './types';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Default null so the user directly sees the new streamlined login screen
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    role: UserRole;
    roleName: string;
    department: string;
  } | null>(null);

  // Current view mode: 'settings' | 'finance' | 'value_calc' | 'project_dev' | 'onemap' | 'trading' | 'portal' | 'assessment' | 'industry'
  const [currentView, setCurrentView] = useState<'settings' | 'finance' | 'value_calc' | 'project_dev' | 'onemap' | 'trading' | 'portal' | 'assessment' | 'industry'>('settings');

  // Selected module for detail modal
  const [selectedModule, setSelectedModule] = useState<PortalModule | null>(null);

  // Modals for login screen
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // System toast notification
  const [notification, setNotification] = useState<string | null>(null);

  // Login layout mode: 'split' (left SVG telemetry + right login) vs 'single' (centered pure login card)
  const [loginLayoutMode, setLoginLayoutMode] = useState<'split' | 'single'>('split');

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // If user is authenticated
  if (currentUser) {
    return (
      <div className="relative min-h-screen bg-[#040e09]">
        {/* System Toast Notification */}
        {notification && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-950/95 border border-emerald-500/80 rounded-xl text-xs text-emerald-200 shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* View 0: 林业碳汇金融服务系统 (Matching latest uploaded screenshot) */}
        {currentView === 'finance' && (
          <CarbonFinanceView
            username={currentUser.username}
            onBackToPortal={() => {
              setCurrentView('portal');
              triggerToast('已切换至系统功能导航中枢');
            }}
          />
        )}

        {/* View 1: 林业碳汇价值核算系统 */}
        {currentView === 'value_calc' && (
          <CarbonValueView
            username={currentUser.username}
            onBackToPortal={() => {
              setCurrentView('portal');
              triggerToast('已切换至系统功能导航中枢');
            }}
          />
        )}

        {/* View 2: 碳汇项目开发管理 */}
        {currentView === 'project_dev' && (
          <ProjectDevView
            username={currentUser.username}
            onBackToPortal={() => {
              setCurrentView('portal');
              triggerToast('已切换至系统功能导航中枢');
            }}
            onNavigateToOneMap={() => {
              setCurrentView('onemap');
              triggerToast('正在载入碳汇一张图遥感底座...');
            }}
          />
        )}

        {/* View 3: 碳汇一张图 (GIS Remote Sensing View) */}
        {currentView === 'onemap' && (
          <OneMapView
            username={currentUser.username}
            onBackToPortal={() => {
              setCurrentView('portal');
              triggerToast('已切换至系统功能导航中枢');
            }}
            onNavigateToProjectDev={() => {
              setCurrentView('project_dev');
              triggerToast('正在载入碳汇项目开发管理...');
            }}
          />
        )}

        {/* View 3b: 林业碳汇产品交易系统 */}
        {currentView === 'trading' && (
          <TradingSystemView
            username={currentUser.username}
            onBackToPortal={() => {
              setCurrentView('portal');
              triggerToast('已切换至系统功能导航中枢');
            }}
          />
        )}

        {/* View 3c: 林业碳汇评估系统 (Matching uploaded screenshot image_6c215636.png) */}
        {currentView === 'assessment' && (
          <CarbonAssessmentView
            username={currentUser.username}
            onBackToPortal={() => {
              setCurrentView('portal');
              triggerToast('已切换至系统功能导航中枢');
            }}
            onNavigateToValueCalc={() => {
              setCurrentView('value_calc');
              triggerToast('已切换至碳汇价值核算系统');
            }}
          />
        )}

        {/* View 3d: 林业碳汇项目产业服务系统 (Matching uploaded screenshot image_b96e8a6b.png) */}
        {currentView === 'industry' && (
          <CarbonIndustryView
            username={currentUser.username}
            onBackToPortal={() => {
              setCurrentView('portal');
              triggerToast('已切换至系统功能导航中枢');
            }}
          />
        )}

        {/* View 3e: 林业碳汇系统设置与菜单管理 (Matching uploaded screenshot image_5527912a.png) */}
        {currentView === 'settings' && (
          <CarbonSettingsView
            username={currentUser.username}
            onBackToPortal={() => {
              setCurrentView('portal');
              triggerToast('已切换至系统功能导航中枢');
            }}
          />
        )}

        {/* View 4: 3D全息中枢大厅 (8-Module Portal View) */}
        {currentView === 'portal' && (
          <PortalView
            username={currentUser.username}
            onLogout={() => {
              setCurrentUser(null);
              triggerToast('您已安全退出碳汇管理智能系统');
            }}
            onSelectModule={(module) => {
              if (module.id === 'one_map') {
                setCurrentView('onemap');
                triggerToast('正在载入碳汇一张图遥感底座...');
              } else if (module.id === 'project_dev') {
                setCurrentView('project_dev');
                triggerToast('正在载入碳汇项目开发管理全流程平台...');
              } else if (module.id === 'value_calc') {
                setCurrentView('value_calc');
                triggerToast('正在载入碳汇价值核算系统...');
              } else if (module.id === 'trading') {
                setCurrentView('trading');
                triggerToast('正在载入林业碳汇产品交易系统...');
              } else if (module.id === 'finance') {
                setCurrentView('finance');
                triggerToast('正在载入碳汇金融服务系统...');
              } else if (module.id === 'assessment') {
                setCurrentView('assessment');
                triggerToast('正在载入碳汇评估系统...');
              } else if (module.id === 'industry') {
                setCurrentView('industry');
                triggerToast('正在载入碳汇项目产业服务系统...');
              } else if (module.id === 'settings') {
                setCurrentView('settings');
                triggerToast('正在载入碳汇系统设置与权限管理...');
              } else {
                setSelectedModule(module);
              }
            }}
          />
        )}

        {/* Interactive Workspace Modal for Selected Subsystem Module */}
        <ModuleDetailModal
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
        />
      </div>
    );
  }

  // Otherwise, render the simplified clean Account & Password Login Page
  return (
    <div className="min-h-screen bg-[#040e09] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Generative Interactive Canvas Background */}
      <CanvasBackground />

      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-950/95 border border-emerald-500/80 rounded-xl text-xs text-emerald-200 shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-emerald-950/40 bg-slate-950/30 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold text-white tracking-tight">
            碳汇管理智能系统
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400">
            国家生态碳汇数字化云门户
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto w-full">
        {loginLayoutMode === 'split' ? (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Focused Showcase (Zero images used, pure SVG & CSS) */}
            <div className="lg:col-span-7">
              <LeftShowcase />
            </div>

            {/* Right Column: Clean Username & Password Login Card */}
            <div className="lg:col-span-5 max-w-md w-full mx-auto">
              <LoginForm
                onLoginSuccess={(account) => {
                  setCurrentUser({
                    username: account.username,
                    role: account.role,
                    roleName: account.roleName,
                    department: account.department,
                  });
                  setCurrentView('portal');
                  triggerToast('登录成功，已进入碳汇中枢大厅');
                }}
                onOpenForgotPassword={() => setIsForgotOpen(true)}
                onOpenTerms={() => setIsTermsOpen(true)}
                agreedTerms={agreedTerms}
                setAgreedTerms={setAgreedTerms}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-md w-full mx-auto">
            <LoginForm
              onLoginSuccess={(account) => {
                setCurrentUser({
                  username: account.username,
                  role: account.role,
                  roleName: account.roleName,
                  department: account.department,
                });
                setCurrentView('portal');
                triggerToast('登录成功，已进入碳汇中枢大厅');
              }}
              onOpenForgotPassword={() => setIsForgotOpen(true)}
              onOpenTerms={() => setIsTermsOpen(true)}
              agreedTerms={agreedTerms}
              setAgreedTerms={setAgreedTerms}
            />
          </div>
        )}
      </main>



      {/* Modals */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        onAccept={() => {
          setAgreedTerms(true);
          triggerToast('您已同意平台服务协议与隐私安全承诺');
        }}
      />

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSuccess={() => {
          triggerToast('安全凭证重置成功！请使用新密码登录');
        }}
      />
    </div>
  );
}
