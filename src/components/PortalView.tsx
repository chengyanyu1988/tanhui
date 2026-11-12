import React, { useState, useEffect } from 'react';
import { PORTAL_MODULES, PortalModule } from '../data/portalModules';
import {
  Globe,
  Code2,
  Calculator,
  Trees,
  BadgeDollarSign,
  FileCheck2,
  Handshake,
  Settings2,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface PortalViewProps {
  username: string;
  onLogout: () => void;
  onSelectModule: (module: PortalModule) => void;
}

export const PortalView: React.FC<PortalViewProps> = ({
  username,
  onLogout,
  onSelectModule,
}) => {
  // Live running clock
  const [currentTime, setCurrentTime] = useState<string>('');
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Icon mapping rendered in glowing amber-gold / bright cyan matching the screenshot
  const renderModuleIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 text-amber-300 group-hover:text-amber-200 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]";
    switch (iconName) {
      case 'Globe':
        return <Globe className={iconClass} />;
      case 'Code':
        return <Code2 className={iconClass} />;
      case 'Calculator':
        return <Calculator className={iconClass} />;
      case 'Trees':
        return <Trees className={iconClass} />;
      case 'Coins':
        return <BadgeDollarSign className={iconClass} />;
      case 'FileCheck':
        return <FileCheck2 className={iconClass} />;
      case 'Handshake':
        return <Handshake className={iconClass} />;
      case 'Settings':
        return <Settings2 className={iconClass} />;
      default:
        return <Globe className={iconClass} />;
    }
  };

  // Parabolic vertical offset calculation for 8 nodes to form an elegant arc
  // Higher on the sides, curving gently lower towards the center
  const getArcOffset = (index: number) => {
    // index: 0, 1, 2, 3, 4, 5, 6, 7
    // normalized distance from center (index 3.5)
    const distFromCenter = Math.abs(index - 3.5); // 3.5 -> 0.5
    // Outer items (0, 7) have dist 3.5 -> lift up by ~42px
    // Inner items (3, 4) have dist 0.5 -> dip by 0px
    const yShift = (3.5 - distFromCenter) * 16; 
    return yShift;
  };

  return (
    <div className="min-h-screen bg-[#020514] text-slate-100 flex flex-col justify-between font-sans select-none relative overflow-hidden">
      {/* Background Ambience: Deep Midnight Blue with Large Hexagonal Geometry (matching screenshot) */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle radial center light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(14,64,150,0.22)_0%,rgba(4,18,50,0.15)_45%,transparent_75%)]" />

        {/* Large Hexagonal Facets Backdrop */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
        >
          <polygon
            points="720,40 1360,240 1360,660 720,860 80,660 80,240"
            fill="none"
            stroke="rgba(30,90,210,0.28)"
            strokeWidth="1.5"
          />
          <polygon
            points="720,90 1280,270 1280,630 720,810 160,630 160,270"
            fill="rgba(8,24,70,0.18)"
            stroke="rgba(20,80,190,0.2)"
            strokeWidth="1"
          />
        </svg>

        {/* Upward Streaming Micro-Particles (simulating holographic data stream from platform to top torus) */}
        <div className="absolute top-[28%] bottom-[24%] left-[42%] right-[42%] pointer-events-none opacity-50 bg-[radial-gradient(#38bdf8_1.2px,transparent_1.2px)] [background-size:24px_24px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-30 w-full px-6 lg:px-12 pt-3 pb-2 flex items-center justify-between border-b border-blue-950/40 bg-black/30 backdrop-blur-md">
        {/* Left: Clock */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
          <span className="font-mono text-sm tracking-wider text-cyan-300 font-medium">
            {currentTime || '2026-10-15 14:47:41'}
          </span>
          <span className="hidden md:inline-block text-xs text-slate-500 ml-2">
            · 双碳大数据网格已联通
          </span>
        </div>

        {/* Right: User admin and logout */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">欢迎您，</span>
            <span className="text-cyan-300 font-bold font-mono tracking-wide">
              {username || 'admin'}
            </span>
          </div>

          <button
            onClick={onLogout}
            type="button"
            title="退出系统"
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-950/60 hover:bg-blue-900/70 border border-blue-800/60 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">退出</span>
          </button>
        </div>
      </header>

      {/* Central Viewport: Top Torus + Curved Arc of Nodes + Bottom 3D Platform */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-between py-2 px-4 max-w-7xl mx-auto w-full">
        
        {/* Top Floating Halo Ring & Platform Title */}
        <div className="relative flex flex-col items-center mt-2 z-20">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-widest text-center font-sans bg-clip-text text-transparent bg-gradient-to-b from-[#7dd3fc] via-[#38bdf8] to-[#0284c7] drop-shadow-[0_0_25px_rgba(56,189,248,0.7)]">
            碳汇管理智能系统
          </h1>

          {/* Floating Elliptical 3D Torus Ring (Matching the top ring in screenshot) */}
          <div className="w-[360px] h-[58px] -mt-2 relative flex items-center justify-center">
            {/* Outer cyan-blue glow ellipse */}
            <div className="w-[340px] h-[48px] rounded-[100%] border-2 border-cyan-400/50 shadow-[0_0_35px_rgba(56,189,248,0.45)] bg-gradient-to-b from-cyan-500/10 to-blue-900/25" />
            {/* Inner ellipse ring */}
            <div className="absolute w-[270px] h-[34px] rounded-[100%] border border-cyan-300/30" />
            {/* Center glowing aperture */}
            <div className="absolute w-[180px] h-[16px] rounded-[100%] bg-cyan-400/20 blur-sm" />
          </div>
        </div>

        {/* Middle Section: Parabolic Curved Arc of 8 Subsystem Circular Nodes */}
        <div className="w-full max-w-6xl my-auto py-4 relative z-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-2 items-center justify-items-center">
            {PORTAL_MODULES.map((module, idx) => {
              const yOffset = getArcOffset(idx);
              const isHovered = hoveredModuleId === module.id;

              return (
                <div
                  key={module.id}
                  onClick={() => onSelectModule(module)}
                  onMouseEnter={() => setHoveredModuleId(module.id)}
                  onMouseLeave={() => setHoveredModuleId(null)}
                  style={{
                    transform: `translateY(${yOffset}px)`,
                  }}
                  className="group flex flex-col items-center cursor-pointer transition-all duration-300 relative py-2"
                >
                  {/* Glowing Circular Node (Concentric rings + amber icon matching screenshot) */}
                  <div className="relative flex items-center justify-center mb-2.5">
                    {/* Outer ambient blur aura */}
                    <div className="absolute w-20 h-20 rounded-full bg-cyan-500/20 blur-xl group-hover:bg-cyan-400/40 group-hover:scale-125 transition-all duration-300" />

                    {/* Outer metallic concentric border */}
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-cyan-400/60 group-hover:border-cyan-300 p-1 bg-gradient-to-b from-[#0a2345] to-[#041126] shadow-[0_0_20px_rgba(14,165,233,0.4)] group-hover:shadow-[0_0_30px_rgba(56,189,248,0.7)] group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                      {/* Inner fine concentric ring */}
                      <div className="w-full h-full rounded-full border border-cyan-300/40 bg-gradient-to-br from-[#0b2b54] to-[#03132c] flex items-center justify-center shadow-inner">
                        {renderModuleIcon(module.iconName)}
                      </div>
                    </div>
                  </div>

                  {/* Subsystem Name Label (Clean amber/gold typography from screenshot) */}
                  <div className="text-center px-1">
                    <span className="text-xs sm:text-[13px] font-bold text-amber-300 group-hover:text-amber-200 tracking-wide transition-colors block drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]">
                      {module.name}
                    </span>
                    <span className="text-[10px] text-cyan-300/80 font-mono block mt-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      {module.keyMetric.value} {module.keyMetric.unit}
                    </span>
                  </div>

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-blue-950/95 border border-cyan-500/80 rounded px-2 py-0.5 text-[10px] text-cyan-200 whitespace-nowrap shadow-xl z-30 animate-in fade-in">
                      点击进入系统工作台
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: 3D Holographic Stage Pedestal & Central Data Cube (Matching screenshot) */}
        <div className="relative w-full max-w-4xl flex flex-col items-center justify-center mt-2 pb-2 z-10">
          
          {/* Semi-transparent Curved Ribbon / Light Shield above the stage */}
          <div className="w-[520px] h-[90px] -mb-16 relative flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-[480px] h-[80px] rounded-[100%] border border-cyan-400/40 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent blur-[1px]" />
          </div>

          {/* Center 3D Isometric Data Center Server Cubes */}
          <div className="relative z-20 flex items-center justify-center gap-8 mb-2">
            
            {/* Left Companion Cube (Smaller isometric server) */}
            <div className="w-12 h-14 relative flex items-center justify-center opacity-85">
              <svg viewBox="0 0 60 70" className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                {/* Top face */}
                <polygon points="30,5 55,20 30,35 5,20" fill="#38bdf8" />
                {/* Left face */}
                <polygon points="5,20 30,35 30,65 5,50" fill="#0369a1" />
                {/* Right face */}
                <polygon points="30,35 55,20 55,50 30,65" fill="#0284c7" />
              </svg>
            </div>

            {/* Central Master Server Cube (Labeled: 碳汇 数据中枢) */}
            <div className="w-28 h-32 relative flex items-center justify-center group cursor-pointer">
              <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-[0_0_28px_rgba(56,189,248,0.7)] group-hover:scale-105 transition-transform duration-300">
                {/* Top illuminated face */}
                <polygon points="60,10 110,40 60,70 10,40" fill="#38bdf8" />
                <polygon points="60,14 105,40 60,66 15,40" fill="#7dd3fc" opacity="0.6" />

                {/* Left face with server rack indicators */}
                <polygon points="10,40 60,70 60,130 10,100" fill="#075985" />
                {/* Rack lines */}
                <line x1="16" y1="58" x2="54" y2="81" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
                <line x1="16" y1="72" x2="54" y2="95" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
                <line x1="16" y1="86" x2="54" y2="109" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />

                {/* Right face with glowing system text */}
                <polygon points="60,70 110,40 110,100 60,130" fill="#0369a1" />
                <text
                  x="72"
                  y="92"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  transform="rotate(-28 72 92)"
                  letterSpacing="1"
                >
                  碳汇中枢
                </text>
              </svg>

              {/* Core glow light dome */}
              <div className="absolute inset-0 bg-cyan-400/15 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Right Companion Cube (Smaller isometric server) */}
            <div className="w-12 h-14 relative flex items-center justify-center opacity-85">
              <svg viewBox="0 0 60 70" className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                {/* Top face */}
                <polygon points="30,5 55,20 30,35 5,20" fill="#38bdf8" />
                {/* Left face */}
                <polygon points="5,20 30,35 30,65 5,50" fill="#0369a1" />
                {/* Right face */}
                <polygon points="30,35 55,20 55,50 30,65" fill="#0284c7" />
              </svg>
            </div>

          </div>

          {/* Multi-tier 3D Elliptical Glowing Stage Base (Matching screenshot base pedestal) */}
          <div className="relative w-[780px] h-[90px] flex items-center justify-center pointer-events-none">
            {/* Top stage tier (inner illuminated disc) */}
            <div className="absolute top-0 w-[480px] h-[46px] rounded-[100%] bg-gradient-to-b from-[#0284c7]/40 via-[#034080] to-[#051c4a] border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(56,189,248,0.5)]" />
            
            {/* Middle stage tier */}
            <div className="absolute top-4 w-[620px] h-[58px] rounded-[100%] bg-gradient-to-b from-[#0a2f6e] to-[#041638] border border-blue-500/60 shadow-[0_0_40px_rgba(37,99,235,0.4)]" />
            
            {/* Bottom ground platform rim */}
            <div className="absolute top-8 w-[760px] h-[70px] rounded-[100%] bg-gradient-to-b from-[#061e47] to-[#020b21] border border-blue-600/40 shadow-[0_0_50px_rgba(29,78,216,0.5)]" />
          </div>

        </div>

      </main>

      {/* Footer (Quiet & authoritative) */}
      <footer className="relative z-30 py-2.5 px-6 border-t border-blue-950/40 bg-black/40 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span>© 2026 碳汇管理智能系统版权所有</span>
          <span>·</span>
          <span>国家林业与草原生态数据中心</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
          <span>系统状态: 正常运行 (99.98%)</span>
          <span>算法标准: IPCC 2006 / CCER 2.0</span>
        </div>
      </footer>
    </div>
  );
};
