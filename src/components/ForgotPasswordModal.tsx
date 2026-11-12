import React, { useState } from 'react';
import { X, KeyRound, Mail, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [account, setAccount] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSendCode = () => {
    if (!account) {
      setErrorMsg('请输入注册手机号或统一社会信用代码绑定邮箱');
      return;
    }
    setErrorMsg('');
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setErrorMsg('请输入账号凭证');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode || verifyCode.length < 4) {
      setErrorMsg('请输入有效的安全验证码（测试可填 8888）');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleFinishReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('新密码长度不能少于8位，且需包含字母与数字组合');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('两次输入的密码不一致，请重新检查');
      return;
    }
    setErrorMsg('');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0b1611] border border-emerald-800/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-950/80 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">重置安全凭证 / 找回密码</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress steps */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-900 flex items-center justify-between text-xs text-slate-400">
          <span className={step >= 1 ? 'text-emerald-400 font-semibold' : ''}>1. 身份校验</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-emerald-400 font-semibold' : ''}>2. 验证码核验</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-emerald-400 font-semibold' : ''}>3. 设置新凭证</span>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  输入注册手机号或机构管理邮箱
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="例如: admin@ecocarbon.cn 或 13800108866"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                下一步：安全验证
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  已向 {account} 发送动态验证码
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="输入6位验证码 (演示填 8888)"
                    className="flex-1 px-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono tracking-widest text-center"
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className="px-3 py-2.5 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-lg whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  上一步
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  核验通过
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleFinishReset} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  设置新登录密码
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="8-20位字符，包含英文字母与数字"
                  className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  确认新密码
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入以确认"
                  className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-lg shadow-emerald-950/40"
              >
                <CheckCircle2 className="w-4 h-4" />
                确认重置并登录
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
