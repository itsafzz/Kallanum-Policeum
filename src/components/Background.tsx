/** ambient night backdrop — drifting siren glows, floating Malayalam glyphs, grain */
export default function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden grain"
    >
      {/* base vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,#0d0b1a_0%,#07060c_55%,#050409_100%)]" />

      {/* police blue / thief red drifting glows */}
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(59,99,246,0.22),transparent_65%)] blur-2xl animate-drift-a" />
      <div className="absolute -bottom-36 -right-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.16),transparent_65%)] blur-2xl animate-drift-b" />
      <div className="absolute top-1/3 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,176,32,0.08),transparent_65%)] blur-2xl animate-drift-a" />

      {/* floating malayalam glyphs */}
      <span className="absolute left-[6%] top-[16%] font-display text-[5rem] leading-none text-stroke opacity-60 animate-floaty [--fl-rot:-8deg] select-none">
        കൾ
      </span>
      <span className="absolute right-[4%] top-[52%] font-display text-[6.5rem] leading-none text-stroke opacity-50 animate-floaty-late [--fl-rot:7deg] select-none">
        പോ
      </span>
      <span className="absolute left-[14%] bottom-[8%] font-display text-[4rem] leading-none text-stroke opacity-40 animate-floaty [--fl-rot:5deg] select-none">
        നും
      </span>

      {/* vignette to focus center */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_45%,transparent_55%,rgba(5,4,9,0.75)_100%)]" />
    </div>
  );
}
