import React, { useState } from 'react';
import { X, Building2, CheckCircle2, ShieldAlert, Send } from 'lucide-react';
import { USER_ROLES } from '../data/carbonData';
import { UserRole } from '../types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orgName: string) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [orgName, setOrgName] = useState('');
  const [creditCode, setCreditCode] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [areaDesc, setAreaDesc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) {
      setErrorMsg('请填写单位或机构全称');
      return;
    }
    if (!creditCode.trim() || creditCode.length < 10) {
      setErrorMsg('请填写有效的统一社会信用代码（18位）');
      return;
    }
    if (!contactName.trim() || !contactPhone.trim()) {
      setErrorMsg('请填写指定碳核算联系人与电话');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(orgName);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0b1611] border border-emerald-800/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-950/80 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">申请接入 / 机构碳汇资质审核</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              根据《碳汇计量监测与交易合规守则》，政企机构入驻需经国家双碳数据中心初审，提交后将分配临时测试账号（2小时内开通）。
            </span>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                机构类型 / 准入业务角色
              </label>
              <div className="grid grid-cols-2 gap-2">
                {USER_ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      role === r.id
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200">{r.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{r.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                机构全称（与营业执照/法人证书一致）
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="例如: 国家能源集团林业碳资产事业部"
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                统一社会信用代码 (USCC)
              </label>
              <input
                type="text"
                value={creditCode}
                onChange={(e) => setCreditCode(e.target.value)}
                placeholder="18位法人信用代码，例如: 91110000MA01XXXX"
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  业务对接责任人
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="姓名"
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  联系电话 / 手机
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="11位手机号"
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                拟入驻碳汇项目类型或履约意向（选填）
              </label>
              <input
                type="text"
                value={areaDesc}
                onChange={(e) => setAreaDesc(e.target.value)}
                placeholder="例如: 华北落叶松林下增汇 / 胶东半岛海草床蓝碳示范"
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-emerald-950/40"
            >
              {isSubmitting ? (
                <span>正在校验提交中...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  提交入驻申请
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
