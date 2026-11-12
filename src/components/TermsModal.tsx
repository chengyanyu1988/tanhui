import React from 'react';
import { X, ShieldCheck, Lock, FileText, Check } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0b1611] border border-emerald-800/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-950/80 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">
              平台服务协议与碳汇数据安全保密承诺
            </h3>
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
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-300 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-emerald-200 mb-0.5">国家双碳大数据主权与地理空间安全说明</p>
              <p className="text-[11px] text-emerald-300/80">
                本平台涉及重点生态功能区林权斑块、高分遥感光谱反演及温室气体减排凭证等敏感信息，受《中华人民共和国数据安全法》及《温室气体自愿减排交易管理办法》严格保护。
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              一、 用户资质与真实性承诺
            </h4>
            <p>
              登录本系统的机构用户须具备合法的统一社会信用代码，包括林业碳汇开发主体、第三方MRV核查认证机构、重点排放履约单位或相关生态主管机关。严禁借用、转让或伪造授权账户访问碳核算后台。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              二、 碳汇样地测量与防重计（Anti-Double-Counting）责任
            </h4>
            <p>
              所有录入系统的通量观测数据、样地木材蓄积量及遥感NDVI估算值，必须与实地林权档案保持一致。系统内置防重计电子指纹审计，对任何重复申报同一地理网格CCER额度的违规行为保留上报国家监管部门的权利。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              三、 CA证书电子签章与法律效力
            </h4>
            <p>
              核查机构与交易方在平台上完成的减排量复核结论与资产划转指令均采用符合国家密码管理局标准的GM/T商用密码算法签名，具有同纸质公章同等的不可抵赖性与法律效力。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-emerald-950/80 bg-slate-900/40">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            关闭
          </button>
          <button
            onClick={() => {
              onAccept();
              onClose();
            }}
            type="button"
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-md shadow-emerald-950/50"
          >
            <Check className="w-4 h-4" />
            我已阅读并同意
          </button>
        </div>
      </div>
    </div>
  );
};
