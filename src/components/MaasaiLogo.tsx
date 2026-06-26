import React from "react";

export default function MaasaiLogo({ className = "w-16 h-16" }: { className?: string }) {
  // Bezier curve calculations for Crossed Wheat Ears
  // Adjusted to be less bowed out sideways (straighter, framing the larger shield)
  const leftP0 = { x: 190, y: 315 };
  const leftP1 = { x: 90, y: 280 };
  const leftP2 = { x: 80, y: 130 };
  const leftP3 = { x: 145, y: 90 };

  // Symmetrical Right Wheat Ear curves up the right side of the shield
  const rightP0 = { x: 210, y: 315 };
  const rightP1 = { x: 310, y: 280 };
  const rightP2 = { x: 320, y: 130 };
  const rightP3 = { x: 255, y: 90 };

  const getBezierPoint = (t: number, p0: typeof leftP0, p1: typeof leftP0, p2: typeof leftP0, p3: typeof leftP0) => {
    const mt = 1 - t;
    const x = mt*mt*mt * p0.x + 3*mt*mt * t * p1.x + 3*mt * t*t * p2.x + t*t*t * p3.x;
    const y = mt*mt*mt * p0.y + 3*mt*mt * t * p1.y + 3*mt * t*t * p2.y + t*t*t * p3.y;
    return { x, y };
  };

  const getBezierTangent = (t: number, p0: typeof leftP0, p1: typeof leftP0, p2: typeof leftP0, p3: typeof leftP0) => {
    const mt = 1 - t;
    const dx = 3*mt*mt * (p1.x - p0.x) + 6*mt * t * (p2.x - p1.x) + 3*t*t * (p3.x - p2.x);
    const dy = 3*mt*mt * (p1.y - p0.y) + 6*mt * t * (p2.y - p1.y) + 3*t*t * (p3.y - p2.y);
    return { dx, dy };
  };

  const grainSteps = Array.from({ length: 14 }, (_, i) => 0.08 + i * 0.065);

  return (
    <svg
      viewBox="0 0 400 400"
      className={`${className} select-none`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sky gradient */}
        <linearGradient id="sky-gradient-new" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#29b6f6" />
          <stop offset="100%" stopColor="#81d4fa" />
        </linearGradient>

        {/* Golden wheat grain gradient */}
        <linearGradient id="gold-grain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff59d" />
          <stop offset="40%" stopColor="#fbc02d" />
          <stop offset="100%" stopColor="#f57f17" />
        </linearGradient>

        {/* Shield inner area clip path */}
        {/* Scaled up in defs to match shield size increase of 8% */}
        <clipPath id="shield-clip-new" transform="translate(200, 190) scale(1.08) translate(-200, -190)">
          <path d="M 200,60 C 260,103 260,277 200,320 C 140,277 140,103 200,60 Z" />
        </clipPath>

        {/* Path for curved ribbon text */}
        <path id="text-path-new" d="M 92,336 Q 200,370 308,336" fill="none" />
      </defs>

      {/* 1. Crossed Spears (Behind the Shield) */}
      <g stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round">
        {/* Left-bottom to Right-top spear shaft */}
        <line x1="85" y1="345" x2="315" y2="55" />
        {/* Right-bottom to Left-top spear shaft */}
        <line x1="315" y1="345" x2="85" y2="55" />
      </g>

      {/* Traditional Spear Heads */}
      <g transform="translate(85, 55) rotate(-45)">
        <path d="M 0,-45 C 10,-25 12,15 0,35 C -12,15 -10,-25 0,-45 Z" fill="#212121" stroke="#000000" strokeWidth="2" />
        <line x1="0" y1="-45" x2="0" y2="35" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
        <path d="M -4,35 L 4,35 L 2,45 L -2,45 Z" fill="#424242" stroke="#000000" strokeWidth="1" />
      </g>
      <g transform="translate(315, 55) rotate(45)">
        <path d="M 0,-45 C 10,-25 12,15 0,35 C -12,15 -10,-25 0,-45 Z" fill="#212121" stroke="#000000" strokeWidth="2" />
        <line x1="0" y1="-45" x2="0" y2="35" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
        <path d="M -4,35 L 4,35 L 2,45 L -2,45 Z" fill="#424242" stroke="#000000" strokeWidth="1" />
      </g>

      {/* 2. Ears of Wheat (Framing the Shield on both sides) - straighter, less curved */}
      <g id="wheat-ears">
        {/* Left Wheat Stalk Stem */}
        <path
          d={`M ${leftP0.x},${leftP0.y} C ${leftP1.x},${leftP1.y} ${leftP2.x},${leftP2.y} ${leftP3.x},${leftP3.y}`}
          fill="none"
          stroke="#f57f17"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Left Wheat Grains */}
        {grainSteps.map((t, idx) => {
          const pos = getBezierPoint(t, leftP0, leftP1, leftP2, leftP3);
          const tangent = getBezierTangent(t, leftP0, leftP1, leftP2, leftP3);
          const angleDeg = Math.atan2(tangent.dy, tangent.dx) * 180 / Math.PI;
          
          const isLeft = idx % 2 === 0;
          const offsetDist = isLeft ? -7 : 4;
          const offsetAngle = angleDeg + 90;
          const rad = (offsetAngle * Math.PI) / 180;
          
          const ox = pos.x + offsetDist * Math.cos(rad);
          const oy = pos.y + offsetDist * Math.sin(rad);
          
          const scale = (0.55 + 0.45 * Math.sin(t * Math.PI)) * 0.95;
          const rotationOffset = isLeft ? -25 : 25;

          return (
            <g
              key={`l-grain-${idx}`}
              transform={`translate(${ox}, ${oy}) rotate(${angleDeg + 90 + rotationOffset}) scale(${scale})`}
            >
              <path
                d="M 0,0 C -5,-13 -13,-6 -1,4 Z"
                fill="url(#gold-grain)"
                stroke="#e65100"
                strokeWidth="1.2"
              />
              <path
                d="M 0,0 C 5,-13 13,-6 1,4 Z"
                fill="url(#gold-grain)"
                stroke="#e65100"
                strokeWidth="1.2"
              />
              {/* Wheat awns (long needle-like spikes) */}
              <line x1="-3" y1="-6" x2="-12" y2="-30" stroke="#f57f17" strokeWidth="0.8" opacity="0.9" />
              <line x1="3" y1="-6" x2="12" y2="-30" stroke="#f57f17" strokeWidth="0.8" opacity="0.9" />
            </g>
          );
        })}

        {/* Right Wheat Stalk Stem */}
        <path
          d={`M ${rightP0.x},${rightP0.y} C ${rightP1.x},${rightP1.y} ${rightP2.x},${rightP2.y} ${rightP3.x},${rightP3.y}`}
          fill="none"
          stroke="#f57f17"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Right Wheat Grains */}
        {grainSteps.map((t, idx) => {
          const pos = getBezierPoint(t, rightP0, rightP1, rightP2, rightP3);
          const tangent = getBezierTangent(t, rightP0, rightP1, rightP2, rightP3);
          const angleDeg = Math.atan2(tangent.dy, tangent.dx) * 180 / Math.PI;
          
          const isRight = idx % 2 === 0;
          const offsetDist = isRight ? 7 : -4;
          const offsetAngle = angleDeg + 90;
          const rad = (offsetAngle * Math.PI) / 180;
          
          const ox = pos.x + offsetDist * Math.cos(rad);
          const oy = pos.y + offsetDist * Math.sin(rad);
          
          const scale = (0.55 + 0.45 * Math.sin(t * Math.PI)) * 0.95;
          const rotationOffset = isRight ? 25 : -25;

          return (
            <g
              key={`r-grain-${idx}`}
              transform={`translate(${ox}, ${oy}) rotate(${angleDeg + 90 + rotationOffset}) scale(${scale})`}
            >
              <path
                d="M 0,0 C -5,-13 -13,-6 -1,4 Z"
                fill="url(#gold-grain)"
                stroke="#e65100"
                strokeWidth="1.2"
              />
              <path
                d="M 0,0 C 5,-13 13,-6 1,4 Z"
                fill="url(#gold-grain)"
                stroke="#e65100"
                strokeWidth="1.2"
              />
              {/* Wheat awns (long needle-like spikes) */}
              <line x1="-3" y1="-6" x2="-12" y2="-30" stroke="#f57f17" strokeWidth="0.8" opacity="0.9" />
              <line x1="3" y1="-6" x2="12" y2="-30" stroke="#f57f17" strokeWidth="0.8" opacity="0.9" />
            </g>
          );
        })}
      </g>

      {/* 3. Maasai Shield (Scaled Up by 8% in-place around center 200,190) */}
      <g transform="translate(200, 190) scale(1.08) translate(-200, -190)">
        <path
          d="M 200,52 C 268,98 268,282 200,328 C 132,282 132,98 200,52 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="3.5"
        />
        <path
          d="M 200,56 C 264,100 264,280 200,324 C 136,280 136,100 200,56 Z"
          fill="none"
          stroke="#000000"
          strokeWidth="2.5"
        />
        <path
          d="M 200,59 C 261,102 261,278 200,321 C 139,278 139,102 200,59 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
        />

        <g clipPath="url(#shield-clip-new)">
          {/* Background base for Shield Panels */}
          <rect x="100" y="50" width="200" height="280" fill="#000000" />

          {/* 3a. Top Segment (Landscape: Sky, Sun, Hills, Mara River, Galloping Wildebeest) */}
          <g id="top-sky-segment">
            <path d="M 100,55 L 300,55 L 300,158 L 100,158 Z" fill="url(#sky-gradient-new)" />
            
            {/* Glowing Sun & Rays */}
            <circle cx="200" cy="58" r="16" fill="#ffffff" />
            <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
              <line x1="200" y1="74" x2="200" y2="110" />
              <line x1="188" y1="71" x2="170" y2="102" />
              <line x1="178" y1="65" x2="148" y2="88" />
              <line x1="212" y1="71" x2="230" y2="102" />
              <line x1="222" y1="65" x2="252" y2="88" />
              <line x1="168" y1="58" x2="135" y2="58" />
              <line x1="232" y1="58" x2="265" y2="58" />
            </g>

            {/* Green Hills */}
            <path d="M 120,158 Q 165,130 200,146 T 280,158 L 280,165 L 120,165 Z" fill="#2e7d32" />
            <path d="M 130,158 Q 185,134 220,151 T 270,158 L 270,165 L 130,165 Z" fill="#4caf50" opacity="0.85" />

            {/* Mara River curving through the landscape */}
            <path
              d="M 200,146 C 190,148 192,152 197,154 T 200,158"
              fill="none"
              stroke="#0288d1"
              strokeWidth="5.5"
              strokeLinecap="round"
            />

            {/* High-Fidelity Wildebeest Silhouette (in mid-leap representing the Great Migration) */}
            <g transform="translate(162, 102) scale(0.52)">
              {/* Body & neck */}
              <path d="M 22,24 C 30,14 48,15 62,24 L 75,22 L 78,32 C 70,42 55,41 42,40 C 30,40 22,36 18,30 Z" fill="#3e2723" stroke="#1b0000" strokeWidth="1" />
              {/* Sloping back & hump */}
              <path d="M 20,24 Q 38,12 55,18 L 52,24 Z" fill="#1b0500" />
              {/* Mane & head beard */}
              <path d="M 72,22 Q 82,18 84,26 L 76,32 Z" fill="#1b0500" />
              {/* Curved Horns */}
              <path d="M 74,20 Q 72,6 63,11" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 75,20 Q 82,6 87,11" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
              {/* Front legs in gallop */}
              <line x1="72" y1="30" x2="92" y2="36" stroke="#1b0500" strokeWidth="3" strokeLinecap="round" />
              <line x1="74" y1="32" x2="88" y2="44" stroke="#1b0500" strokeWidth="3" strokeLinecap="round" />
              {/* Hind legs pushing off */}
              <line x1="24" y1="28" x2="-2" y2="36" stroke="#1b0500" strokeWidth="3" strokeLinecap="round" />
              <line x1="20" y1="32" x2="2" y2="42" stroke="#1b0500" strokeWidth="3" strokeLinecap="round" />
              {/* Tail */}
              <path d="M 18,28 C 12,32 10,42 6,46" fill="none" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </g>

          <line x1="120" y1="158" x2="280" y2="158" stroke="#000000" strokeWidth="2.5" />

          {/* 3b. Left Red Panel (Traditional Zebu Cattle) */}
          <path d="M 100,158 L 193,158 C 178,188 178,228 193,258 L 100,258 Z" fill="#c62828" />
          {/* High-Fidelity Cattle (Bull/Cow representing Pastoralism) */}
          <g transform="translate(122, 185) scale(0.5)">
            {/* Main body, legs, head */}
            <path d="M 15,22 C 22,12 55,14 65,22 L 72,24 L 75,34 C 70,44 58,44 42,42 C 28,42 18,38 12,30 Z" fill="#111111" />
            {/* Hump (Zebu breed signature) */}
            <path d="M 45,16 Q 58,10 65,22 Z" fill="#000000" />
            {/* Curved Horns */}
            <path d="M 68,24 Q 78,12 73,4" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
            {/* Head & snout */}
            <path d="M 15,22 Q 3,18 5,10 Q 11,12 14,21 Z" fill="#111111" />
            {/* Ears */}
            <path d="M 6,12 Q -2,6 3,6" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
            <path d="M 8,11 Q 12,4 16,8" fill="none" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
            {/* Standing legs */}
            <rect x="18" y="38" width="4" height="20" fill="#111111" rx="1" />
            <rect x="27" y="38" width="4" height="20" fill="#111111" rx="1" />
            <rect x="52" y="38" width="4" height="20" fill="#111111" rx="1" />
            <rect x="61" y="38" width="4" height="20" fill="#111111" rx="1" />
            {/* Cow tail */}
            <path d="M 68,24 Q 75,32 73,48" fill="none" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />
          </g>

          {/* 3c. Right Red Panel (Maasai Moran/Warrior with Spear and Shuka) */}
          <path d="M 300,158 L 207,158 C 222,188 222,228 207,258 L 300,258 Z" fill="#c62828" />
          {/* High-Fidelity Maasai Moran (Warrior) */}
          <g transform="translate(225, 178) scale(0.55)">
            {/* Head/Face */}
            <circle cx="28" cy="12" r="5" fill="#5d4037" />
            <path d="M 28,17 L 28,21" stroke="#5d4037" strokeWidth="2" />
            {/* Traditional Hair/Headdress */}
            <path d="M 24,9 Q 28,3 32,9" stroke="#d32f2f" strokeWidth="2" fill="none" />
            {/* Shuka (Traditional robe draped across shoulders in brilliant blue & red patterns) */}
            <path d="M 21,21 C 18,36 18,52 22,60 C 28,60 32,52 35,21 Z" fill="#1565c0" />
            <path d="M 23,21 L 20,48 L 29,56 L 29,21 Z" fill="#d32f2f" />
            {/* Slender legs */}
            <line x1="24" y1="60" x2="24" y2="78" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="29" y1="60" x2="29" y2="78" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round" />
            {/* Traditional Spear held in hand */}
            <line x1="15" y1="5" x2="15" y2="76" stroke="#111111" strokeWidth="1.5" />
            {/* Spear blade */}
            <path d="M 15,5 L 12,14 L 18,14 Z" fill="#757575" stroke="#111111" strokeWidth="0.8" />
            {/* Arm holding the spear */}
            <path d="M 23,26 L 15,36" stroke="#5d4037" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Thick vertical divide line */}
          <line x1="200" y1="158" x2="200" y2="258" stroke="#000000" strokeWidth="5" />

          {/* 3d. Bottom Segment (Richly detailed Beaded Necklet / Ornaments) */}
          <g id="bottom-beaded-necklet" transform="translate(200, 280)">
            <circle cx="0" cy="0" r="23" fill="none" stroke="#ffffff" strokeWidth="5.5" />
            <circle cx="0" cy="0" r="23" fill="none" stroke="#d32f2f" strokeWidth="5.5" strokeDasharray="8,20" />
            <circle cx="0" cy="0" r="23" fill="none" stroke="#1565c0" strokeWidth="5.5" strokeDasharray="5,24" />
            <circle cx="0" cy="0" r="23" fill="none" stroke="#4caf50" strokeWidth="5.5" strokeDasharray="4,28" />
            <circle cx="0" cy="0" r="23" fill="none" stroke="#ffeb3b" strokeWidth="5.5" strokeDasharray="3,31" />
            <circle cx="0" cy="0" r="19" fill="none" stroke="#000000" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="14" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            {/* Hanging rectangular beaded pendants */}
            <g transform="translate(0, 0)">
              <rect x="-10" y="22" width="3" height="12" fill="#d32f2f" stroke="#000000" strokeWidth="0.5" />
              <rect x="-6" y="24" width="3" height="14" fill="#ffffff" stroke="#000000" strokeWidth="0.5" />
              <rect x="-2" y="25" width="3" height="15" fill="#4caf50" stroke="#000000" strokeWidth="0.5" />
              <rect x="2" y="25" width="3" height="15" fill="#1565c0" stroke="#000000" strokeWidth="0.5" />
              <rect x="6" y="24" width="3" height="14" fill="#ffeb3b" stroke="#000000" strokeWidth="0.5" />
              <rect x="10" y="22" width="3" height="12" fill="#d32f2f" stroke="#000000" strokeWidth="0.5" />
            </g>
          </g>
        </g>
      </g>

      {/* 4. Curved Ribbon Banner at the bottom */}
      <g id="banner-group-new" transform="translate(0, 0)">
        <path d="M 85,325 L 55,345 L 95,355 Z" fill="#9f1239" stroke="#000000" strokeWidth="1.5" />
        <path d="M 315,325 L 345,345 L 305,355 Z" fill="#9f1239" stroke="#000000" strokeWidth="1.5" />
        <path d="M 55,345 L 35,325 L 45,360 L 95,355 Z" fill="#d32f2f" stroke="#000000" strokeWidth="1.8" />
        <path d="M 345,345 L 365,325 L 355,360 L 305,355 Z" fill="#d32f2f" stroke="#000000" strokeWidth="1.8" />
        <path
          d="M 90,320 Q 200,355 310,320 L 300,350 Q 200,385 100,350 Z"
          fill="#e53935"
          stroke="#000000"
          strokeWidth="2.2"
        />
        <path d="M 155,310 Q 200,335 245,310" fill="none" stroke="#fbc02d" strokeWidth="2.5" />
        <path d="M 165,313 Q 200,332 235,313" fill="none" stroke="#f57f17" strokeWidth="1.5" />
        <text
          fill="#ffffff"
          fontSize="13"
          fontWeight="900"
          fontFamily="'Inter', 'Space Grotesk', sans-serif"
          letterSpacing="1.6"
        >
          <textPath href="#text-path-new" startOffset="50%" textAnchor="middle">
            LAND OF DIVERSITY
          </textPath>
        </text>
      </g>
    </svg>
  );
}
