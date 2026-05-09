// import { motion } from 'framer-motion';
// import { cn } from '@/lib/utils';

// interface LogoProps {
//   className?: string;
//   variant?: 'full' | 'icon';
//   theme?: 'light' | 'dark' | 'auto';
// }

// export function Logo({ className, variant = 'full', theme = 'auto' }: LogoProps) {
//   // Colors from the brand design
//   const cyan = '#ff8800ff';
//   const deepBlue = '#0c1b32';

//   // For 'auto' theme, we use current text color via currentColor but can override
//   // For the sake of matching the image exactly, we'll use specific colors for the text
//   // but allow the container to pass styles.

//   return (
//     <div className={cn("flex items-center gap-3 select-none", className)}>
//       {/* Logo Icon (The Orbit) */}
//       <div className="relative w-10 h-10 flex items-center justify-center">
//         <svg
//           viewBox="0 0 100 100"
//           className="w-full h-full overflow-visible"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           {/* Main Orbit Ring */}
//           <ellipse
//             cx="50"
//             cy="50"
//             rx="45"
//             ry="30"
//             stroke={theme === 'dark' ? 'white' : deepBlue}
//             strokeWidth="2.5"
//             transform="rotate(-15 50 50)"
//             className="opacity-80"
//           />

//           {/* Pixel Trail Group */}
//           <g transform="rotate(-15 50 50)">
//              {/* We simulate the pixel trail trailing the sphere */}
//              <motion.g
//                animate={{ rotate: 360 }}
//                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
//                style={{ originX: "50px", originY: "50px" }}
//              >
//                 {/* The Cyan Sphere (Satellite) */}
//                 <circle cx="95" cy="50" r="5" fill={cyan}>
//                    <animate
//                      attributeName="r"
//                      values="5;6;5"
//                      dur="2s"
//                      repeatCount="indefinite"
//                    />
//                 </circle>
                
//                 {/* Glow Effect */}
//                 <circle cx="95" cy="50" r="8" fill={cyan} opacity="0.3" filter="blur(2px)" />

//                 {/* Pixel Trail Blocks */}
//                 <rect x="85" y="48" width="4" height="4" fill={deepBlue} opacity="0.8" />
//                 <rect x="80" y="52" width="3" height="3" fill={cyan} opacity="0.6" />
//                 <rect x="75" y="47" width="2" height="2" fill={deepBlue} opacity="0.4" />
//              </motion.g>
//           </g>
//         </svg>
//       </div>

//       {variant === 'full' && (
//         <div className="flex flex-col leading-none">
//           <div className="flex items-baseline gap-0">
//             <span 
//               className="text-2xl font-black italic tracking-tighter"
//               style={{ color: theme === 'dark' ? 'white' : deepBlue }}
//             >
//               Sat
//             </span>
//             <span 
//               className="text-2xl font-black italic tracking-tighter"
//               style={{ color: cyan }}
//             >
//               Byte
//             </span>
//           </div>
//           <span 
//             className="text-[8px] font-bold tracking-[0.3em] uppercase opacity-70"
//             style={{ color: theme === 'dark' ? 'white' : deepBlue }}
//           >
//             Technologies
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  theme?: 'light' | 'dark' | 'auto';
  speed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
  trailBlocks?: number; // 2–6
}

export function Logo({ 
  className, 
  variant = 'full', 
  theme = 'auto', 
  speed = 'normal',
  pauseOnHover = true,
  trailBlocks = 4 
}: LogoProps) {
  const prefersReducedMotion = useReducedMotion();
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [isHovered, setIsHovered] = useState(false);

  // Resolve 'auto' theme on client
  useEffect(() => {
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(isDark ? 'dark' : 'light');
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  const speedMap = {
    slow: 16,
    normal: 8,
    fast: 4,
  };
  const duration = prefersReducedMotion ? 0 : speedMap[speed];

  // Colors – using CSS variables for easy override
  const textColor = resolvedTheme === 'dark' ? 'white' : '#0c1b32';
  const cyan = '#ff8800ff';

  // Build pixel trail blocks (positioned relative to the moving satellite)
  const trailPositions = Array.from({ length: trailBlocks }).map((_, i) => {
    const angleStep = -15; // degrees behind the satellite
    const angle = -angleStep * (i + 1);
    const rad = (angle * Math.PI) / 180;
    const radius = 47; // orbit radius
    const x = 50 + radius * Math.cos(rad);
    const y = 50 + radius * Math.sin(rad);
    return { x, y, opacity: 0.7 - i * 0.15, size: 4 - i * 0.5 };
  });

  return (
    <div 
      className={cn("flex items-center gap-3 select-none", className)} 
      style={{ color: textColor }}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      {/* Icon with Orbit + Satellite + Trail */}
      <div 
        className="relative w-10 h-10 flex items-center justify-center"
        aria-label="SatByte logo icon"
        role="img"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Static Orbit Ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="45"
            ry="30"
            stroke={textColor}
            strokeWidth="2.5"
            transform="rotate(-15 50 50)"
            className="opacity-80"
          />

          {/* Pixel Trail (static position – they don't rotate, they just stay behind the satellite) */}
          <g transform="rotate(-15 50 50)">
            {trailPositions.map((pos, idx) => (
              <rect
                key={idx}
                x={pos.x - pos.size/2}
                y={pos.y - pos.size/2}
                width={Math.max(1, pos.size)}
                height={Math.max(1, pos.size)}
                fill={idx % 2 === 0 ? cyan : textColor}
                opacity={pos.opacity}
              />
            ))}
          </g>

          {/* Rotating Satellite Group */}
          <motion.g
            transform="rotate(-15 50 50)"
            animate={!prefersReducedMotion && !(pauseOnHover && isHovered) ? { rotate: 360 } : {}}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
          >
            {/* Satellite body */}
            <circle cx="95" cy="50" r="5" fill={cyan}>
              {/* Optional pulse animation – only if motion is allowed */}
              {!prefersReducedMotion && (
                <animate
                  attributeName="r"
                  values="5;6;5"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
            
            {/* Glow */}
            <circle cx="95" cy="50" r="8" fill={cyan} opacity="0.3">
              {!prefersReducedMotion && (
                <animate
                  attributeName="r"
                  values="8;11;8"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </motion.g>
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-0">
            <span 
              className="text-2xl font-black italic tracking-tighter"
              style={{ color: textColor }}
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
            style={{ color: textColor }}
          >
            Technologies
          </span>
        </div>
      )}
    </div>
  );
}