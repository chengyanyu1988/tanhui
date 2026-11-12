import React, { useState } from 'react';
import { UserRole } from '../types';
import { DEMO_ACCOUNTS } from '../data/carbonData';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: (account: {
    username: string;
    role: UserRole;
    roleName: string;
    department: string;
  }) => void;
  onOpenForgotPassword?: () => void;
  onOpenTerms?: () => void;
  agreedTerms?: boolean;
  setAgreedTerms?: (agreed: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onOpenForgotPassword,
}) => {
  // Purely account & password login with 'admin' default
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Quick fill admin account
  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin');
    setErrorMessage('');
  };

  // Main Submit Login Handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedUser = username.trim();
    if (!trimmedUser) {
      setErrorMessage('请输入登录账号');
      return;
    }
    if (!password) {
      setErrorMessage('请输入登录密码');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      // Find matching demo account or fallback to admin
      const matched = DEMO_ACCOUNTS.find(
        (acc) => acc.username.toLowerCase() === trimmedUser.toLowerCase()
      );

      onLoginSuccess({
        username: matched ? matched.username : trimmedUser,
        role: matched ? matched.role : 'admin',
        roleName: matched ? matched.roleName : '超级管理员',
        department: matched ? matched.department : '国家碳汇管理智能运营中心',
      });
    }, 300);
  };

  return (
    <div className="w-full bg-[#091126]/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between min-h-[440px] lg:min-h-[500px]">
      <div>
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c88c]" />
            <span>安全认证通道</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">欢迎登录</h2>
          <p className="text-xs text-slate-400 mt-1">
            请输入账号与密码登录碳汇管理智能系统
          </p>

        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="mb-4 p-2.5 bg-rose-950/70 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Username input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              用户账号
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/80" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入登录账号 (如: admin)"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden transition-colors font-mono"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                登录密码
              </label>
              {onOpenForgotPassword && (
                <button
                  type="button"
                  onClick={onOpenForgotPassword}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  忘记密码？
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/80" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入登录密码 (如: admin)"
                className="w-full pl-10 pr-10 py-2.5 bg-[#060c1d] border border-[#18284c] focus:border-[#00c88c] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Quick fill */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#060c1d] border-[#18284c] text-emerald-500 accent-[#00c88c] cursor-pointer"
              />
              <span>记住登录账号</span>
            </label>

            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] text-emerald-400/90 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>一键重置为 admin</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-2.5 px-4 bg-[#00c88c] hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold tracking-wider transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 mt-5 cursor-pointer active:scale-98"
          >
            {isAuthenticating ? (
              <span>正在验证登录...</span>
            ) : (
              <>
                <span>登 录 系 统</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Security badge at bottom */}
      <div className="pt-5 border-t border-[#18284c]/60 flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" />
        <span>等保三级安全认证 · 国密加密通道</span>
      </div>
    </div>
  );
};
