import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  theme?: 'light' | 'dark' | 'auto';
}

export function Logo({ className, variant = 'full', theme = 'auto' }: LogoProps) {
  // Colors from the brand design
  const cyan = '#00e5ff';
  const deepBlue = '#0c1b32';

  // For 'auto' theme, we use current text color via currentColor but can override
  // For the sake of matching the image exactly, we'll use specific colors for the text
  // but allow the container to pass styles.

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      {/* Logo Icon (The Orbit) */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Orbit Ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="45"
            ry="30"
            stroke={theme === 'dark' ? 'white' : deepBlue}
            strokeWidth="2.5"
            transform="rotate(-15 50 50)"
            className="opacity-80"
          />

          {/* Pixel Trail Group */}
          <g transform="rotate(-15 50 50)">
             {/* We simulate the pixel trail trailing the sphere */}
             <motion.g
               animate={{ rotate: 360 }}
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
               style={{ originX: "50px", originY: "50px" }}
             >
                {/* The Cyan Sphere (Satellite) */}
                <circle cx="95" cy="50" r="5" fill={cyan}>
                   <animate
                     attributeName="r"
                     values="5;6;5"
                     dur="2s"
                     repeatCount="indefinite"
                   />
                </circle>
                
                {/* Glow Effect */}
                <circle cx="95" cy="50" r="8" fill={cyan} opacity="0.3" filter="blur(2px)" />

                {/* Pixel Trail Blocks */}
                <rect x="85" y="48" width="4" height="4" fill={deepBlue} opacity="0.8" />
                <rect x="80" y="52" width="3" height="3" fill={cyan} opacity="0.6" />
                <rect x="75" y="47" width="2" height="2" fill={deepBlue} opacity="0.4" />
             </motion.g>
          </g>
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-0">
            <span 
              className="text-2xl font-black italic tracking-tighter"
              style={{ color: theme === 'dark' ? 'white' : deepBlue }}
            >
              Sat
            </span>
            <span 
              className="text-2xl font-black italic tracking-tighter"
              style={{ color: cyan }}
            >
              Byte
            </span>
          </div>
          <span 
            className="text-[8px] font-bold tracking-[0.3em] uppercase opacity-70"
            style={{ color: theme === 'dark' ? 'white' : deepBlue }}
          >
            Technologies
          </span>
        </div>
      )}
    </div>
  );
}
