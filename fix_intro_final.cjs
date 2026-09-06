const fs = require('fs');
const path = 'src/components/BrandIntroCinematic.tsx';
let code = fs.readFileSync(path, 'utf8');

const splitPoint = code.indexOf('      <canvas');
if (splitPoint === -1) process.exit(1);

const cleanEnding = `      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{
          backgroundColor: '#000000',
        }}
      />

      {/* ONLY THE ORIGINAL UNDERGROUNDZ TITLE REVEALED FROM LEFT TO RIGHT */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center px-6">
        <div className="relative w-full max-w-2xl sm:max-w-3xl md:max-w-4xl flex items-center justify-center">
          
          {/* Logo Container with Left-to-Right Reveal Mask */}
          <div
            ref={logoWrapperRef}
            className="relative w-full flex flex-col items-center justify-center"
            style={{
              clipPath: 'inset(0 100% 0 0)',
              willChange: 'clip-path',
            }}
          >
            {/* The Official UNDERGROUNDZ Logo from Homepage */}
            <img
              src="/logo.png"
              alt="UNDERGROUNDZ"
              className="w-full max-h-[160px] md:max-h-[220px] object-contain brightness-125 contrast-125"
              style={{
                willChange: 'transform',
              }}
            />
            <div className="mt-4 font-body text-[#8e8e98] text-xs sm:text-sm md:text-base tracking-[0.3em] sm:tracking-[0.5em] font-bold uppercase text-center">
              WHEN ENGINE SPEAKS
            </div>
          </div>

          {/* Slicing Vertical White Light Beam at the Reveal Leading Edge */}
          <div
            ref={beamRef}
            className="absolute top-0 bottom-0 pointer-events-none z-40 flex items-center justify-center opacity-0"
            style={{
              left: '0%',
              transform: 'translateX(-50%)',
              width: '4px',
              willChange: 'left, opacity',
            }}
          >
            <div className="w-[2px] h-full bg-white shadow-[0_0_15px_#ffffff,0_0_30px_#ffffff]" />
            <div className="absolute w-6 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* Discreet Minimalist Skip Button in Top Right */}
      {onComplete && (
        <button
          id="btn-intro-skip-minimal"
          onClick={handleSkip}
          className="absolute top-6 right-6 z-50 p-2 text-white/30 hover:text-white transition-colors cursor-pointer rounded-none"
          title="Skip"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
`;

code = code.substring(0, splitPoint) + cleanEnding;
fs.writeFileSync(path, code);
