import React from 'react';
import { TreePine, Activity, Radio, Cpu, Layers } from 'lucide-react';

export const LeftShowcase: React.FC = () => {
  return (
    <div className="relative h-full min-h-[440px] lg:min-h-[500px] w-full rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-[#061811] via-[#04120c] to-[#020b07]">
      {/* 纯SVG生态碳汇遥感网格底纹（不使用任何外部图片） */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="carbon-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2 3" />
            </pattern>
            <linearGradient id="flux-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#carbon-grid)" />
          {/* 生态林冠拓扑等高曲线 */}
          <path
            d="M 0,280 C 120,200 240,320 380,240 C 500,160 620,280 800,210 L 800,500 L 0,500 Z"
            fill="url(#flux-grad)"
          />
          <path
            d="M 0,330 C 140,260 280,380 440,300 C 600,220 720,340 800,290 L 800,500 L 0,500 Z"
            fill="#064e3b"
            fillOpacity="0.2"
          />
        </svg>
      </div>

      {/* 顶部标签 */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-emerald-950/85 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-lg">
          <TreePine className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white tracking-wide">国家碳汇大数据平台</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>通量基准线在线</span>
        </div>
      </div>

      {/* 中部生态图谱与数据矩阵（纯UI绘制，不使用图片） */}
      <div className="relative z-10 my-auto py-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/50 text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-3">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>MRV Remote Sensing Cloud Engine</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
          碳汇管理智能系统
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed max-w-md font-light">
          融合高分辨率多源遥感、样地实测通量反演与 MRV 核算方法学，构筑可溯源、高精度的国家级碳资产全生命周期数字底座。
        </p>

        {/* 关键特性轻量胶囊 */}
        <div className="flex flex-wrap gap-2 mt-4 text-[11px] text-slate-300">
          <div className="flex items-center gap-1 bg-black/40 border border-emerald-900/60 px-2.5 py-1 rounded-lg">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>通量动态反演</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 border border-emerald-900/60 px-2.5 py-1 rounded-lg">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>遥感一张图底图</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 border border-emerald-900/60 px-2.5 py-1 rounded-lg">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>自动价值核算</span>
          </div>
        </div>
      </div>

    </div>
  );
};
