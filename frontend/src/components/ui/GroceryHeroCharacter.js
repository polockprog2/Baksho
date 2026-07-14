// components/GroceryHeroCharacter.jsx
export default function GroceryHeroCharacter() {
    return (
        <div className="relative flex items-end justify-center order-1 lg:order-2 animate-fade-in animate-delay-200">
            <style>{`
        /* Advanced Professional Running Cycle (Fast Sprint towards camera) */
        @keyframes bodySprint {
            0%, 50%, 100% { transform: translateY(0) scaleY(0.98); } /* Impact */
            25%, 75% { transform: translateY(-35px) scaleY(1.02); } /* Airborne */
        }
        @keyframes headSprint {
            0%, 50%, 100% { transform: translateY(10px) rotate(6deg); }
            25%, 75% { transform: translateY(-5px) rotate(-3deg); }
        }
        @keyframes legSprintL {
            0% { transform: translateY(0) scaleY(1); }
            25% { transform: translateY(-60px) scaleY(0.45); } /* Knee lifted high towards camera */
            50% { transform: translateY(-15px) scaleY(0.85); }
            75% { transform: translateY(-5px) scaleY(1); }
            100% { transform: translateY(0) scaleY(1); }
        }
        @keyframes legSprintR {
            0% { transform: translateY(-15px) scaleY(0.85); }
            25% { transform: translateY(-5px) scaleY(1); }
            50% { transform: translateY(0) scaleY(1); }
            75% { transform: translateY(-60px) scaleY(0.45); } /* Knee lifted high towards camera */
            100% { transform: translateY(-15px) scaleY(0.85); }
        }
        @keyframes armInertiaL {
            0%, 50%, 100% { transform: translateY(25px) rotate(4deg); }
            25%, 75% { transform: translateY(-15px) rotate(-2deg); }
        }
        @keyframes armInertiaR {
            0%, 50%, 100% { transform: translateY(25px) rotate(-4deg); }
            25%, 75% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes bagInertia {
            0%, 50%, 100% { transform: translateY(15px) rotate(8deg); }
            25%, 75% { transform: translateY(-20px) rotate(-4deg); }
        }
        @keyframes shadowSprint {
            0%, 50%, 100% { transform: scaleX(1.1); opacity: 0.35; }
            25%, 75% { transform: scaleX(0.4); opacity: 0.1; }
        }
        @keyframes speedLines {
            0% { transform: translateY(-100%); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(200%); opacity: 0; }
        }
        @keyframes sweatDrop {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(-50px, -30px) scale(0); opacity: 0; }
        }
        @keyframes floatSprint {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-25px) scale(1.05); }
        }
        
        .gc-body  { animation: bodySprint 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; transform-origin: 340px 360px; }
        .gc-head  { animation: headSprint 0.8s ease-in-out infinite; transform-origin: 340px 148px; }
        .gc-leg-l { animation: legSprintL 0.8s ease-in-out infinite; transform-origin: 325px 358px; }
        .gc-leg-r { animation: legSprintR 0.8s ease-in-out infinite; transform-origin: 355px 358px; }
        .gc-arm-l { animation: armInertiaL 0.8s cubic-bezier(0.25, 1, 0.5, 1) infinite; transform-origin: 298px 230px; }
        .gc-arm-r { animation: armInertiaR 0.8s cubic-bezier(0.25, 1, 0.5, 1) infinite; transform-origin: 358px 230px; }
        .gc-bag   { animation: bagInertia 0.8s cubic-bezier(0.25, 1, 0.5, 1) infinite; transform-origin: 390px 280px; }
        .gc-shadow { animation: shadowSprint 0.8s ease-in-out infinite; transform-origin: 340px 460px; }
        
        .gc-speed-1 { animation: speedLines 0.6s linear infinite; }
        .gc-speed-2 { animation: speedLines 0.7s linear infinite 0.1s; }
        .gc-speed-3 { animation: speedLines 0.65s linear infinite 0.2s; }
        .gc-speed-4 { animation: speedLines 0.75s linear infinite 0.15s; }
        .gc-speed-5 { animation: speedLines 0.55s linear infinite 0.05s; }
        
        .gc-sweat { animation: sweatDrop 0.8s ease-out infinite; }
        
        .gc-apple, .gc-carrot, .gc-broc, .gc-lemon { animation: floatSprint 0.5s ease-in-out infinite alternate; }
        .gc-star1, .gc-star2, .gc-star3 { animation: floatSprint 1.2s ease-in-out infinite alternate; }
      `}</style>

            <svg
                viewBox="0 0 680 520"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-[420px] md:max-w-[500px] lg:max-w-[540px]"
                aria-label="Friendly person carrying fresh groceries"
            >
                {/* Speed Lines Background */}
                <g stroke="#a7f3d0" strokeWidth="4" strokeLinecap="round" opacity="0.8">
                    <line x1="120" y1="0" x2="120" y2="100" className="gc-speed-1" />
                    <line x1="200" y1="0" x2="200" y2="150" className="gc-speed-2" />
                    <line x1="480" y1="0" x2="480" y2="80" className="gc-speed-3" />
                    <line x1="560" y1="0" x2="560" y2="120" className="gc-speed-4" />
                    <line x1="260" y1="0" x2="260" y2="160" className="gc-speed-5" />
                </g>

                {/* Shadow */}
                <ellipse className="gc-shadow" cx="340" cy="462" rx="90" ry="14" fill="#059669" />

                {/* Floating Apple */}
                <g className="gc-apple">
                    <circle cx="195" cy="165" r="28" fill="#ef4444" />
                    <path d="M195 137 C195 130 202 124 208 126" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <ellipse cx="185" cy="158" rx="6" ry="9" fill="#f87171" opacity="0.5" />
                </g>

                {/* Floating Carrot */}
                <g className="gc-carrot">
                    <path d="M488 140 L476 178 L500 178 Z" fill="#f97316" />
                    <path d="M480 140 C476 128 470 122 472 118" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M488 140 C492 128 498 122 496 118" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M484 140 C484 128 484 120 484 116" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>

                {/* Floating Broccoli */}
                <g className="gc-broc">
                    <rect x="171" y="356" width="8" height="22" rx="3" fill="#15803d" />
                    <circle cx="175" cy="345" r="16" fill="#16a34a" />
                    <circle cx="162" cy="352" r="11" fill="#1816a393" />
                    <circle cx="188" cy="352" r="11" fill="#16a34a" />
                    <circle cx="175" cy="335" r="10" fill="#22c55e" />
                    <circle cx="163" cy="344" r="7" fill="#22c55e" />
                    <circle cx="187" cy="344" r="7" fill="#22c55e" />
                </g>

                {/* Floating Lemon */}
                <g className="gc-lemon">
                    <ellipse cx="502" cy="345" rx="22" ry="18" fill="#fde047" />
                    <ellipse cx="502" cy="345" rx="14" ry="11" fill="#fef08a" opacity="0.6" />
                    <path d="M502 327 C498 320 494 318 496 315" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" fill="none" />
                </g>

                {/* Sparkles */}
                <g className="gc-star1"><path d="M200 160 L203 153 L206 160 L213 163 L206 166 L203 173 L200 166 L193 163 Z" fill="#fbbf24" /></g>
                <g className="gc-star2"><path d="M480 200 L482 195 L484 200 L489 202 L484 204 L482 209 L480 204 L475 202 Z" fill="#fbbf24" /></g>
                <g className="gc-star3"><path d="M220 340 L222 335 L224 340 L229 342 L224 344 L222 349 L220 344 L215 342 Z" fill="#34d399" /></g>

                {/* Character body group */}
                <g className="gc-body">
                    {/* Legs */}
                    <g className="gc-leg-l">
                        <rect x="314" y="358" width="22" height="70" rx="11" fill="#1e40af" />
                        <rect x="310" y="418" width="26" height="16" rx="8" fill="#1e3a8a" />
                    </g>
                    <g className="gc-leg-r">
                        <rect x="344" y="358" width="22" height="70" rx="11" fill="#1e40af" />
                        <rect x="344" y="418" width="26" height="16" rx="8" fill="#1e3a8a" />
                    </g>

                    {/* Torso */}
                    <rect x="298" y="230" width="84" height="138" rx="28" fill="#059669" />
                    <rect x="310" y="248" width="24" height="18" rx="5" fill="#047857" opacity="0.7" />

                    {/* Left arm + basket */}
                    <g className="gc-arm-l">
                        <rect x="270" y="228" width="30" height="80" rx="15" fill="#f3d5b0" />
                        <ellipse cx="285" cy="315" rx="14" ry="12" fill="#f3d5b0" />
                        <g className="gc-bag" style={{ transformOrigin: '260px 340px' }}>
                            <path d="M248 330 L272 330 L268 365 L252 365 Z" fill="#92400e" stroke="#78350f" strokeWidth="2" />
                            <path d="M248 330 Q260 312 272 330" stroke="#78350f" strokeWidth="3" strokeLinecap="round" fill="none" />
                            <line x1="252" y1="338" x2="268" y2="338" stroke="#78350f" strokeWidth="1" opacity="0.5" />
                            <line x1="252" y1="348" x2="268" y2="348" stroke="#78350f" strokeWidth="1" opacity="0.5" />
                            <circle cx="253" cy="328" r="9" fill="#22c55e" />
                            <circle cx="263" cy="325" r="8" fill="#ef4444" />
                            <circle cx="272" cy="328" r="7" fill="#fde047" />
                            <g className="gc-bsktlf">
                                <path d="M278 298 C278 290 286 285 290 290 C286 290 282 294 278 298Z" fill="#16a34a" />
                            </g>
                        </g>
                    </g>

                    {/* Right arm + grocery bag */}
                    <g className="gc-arm-r">
                        <rect x="380" y="228" width="30" height="80" rx="15" fill="#f3d5b0" />
                        <ellipse cx="395" cy="315" rx="14" ry="12" fill="#f3d5b0" />
                        <g className="gc-bag">
                            <rect x="370" y="295" width="62" height="72" rx="8" fill="#d1fae5" stroke="#059669" strokeWidth="2.5" />
                            <path d="M382 295 Q382 278 390 275 Q401 275 401 295" stroke="#059669" strokeWidth="3" strokeLinecap="round" fill="none" />
                            <circle cx="401" cy="320" r="14" fill="#ecfdf5" />
                            <path d="M401 313 C397 313 393 317 393 322 C393 327 397 330 401 330 C405 330 409 327 409 322 C409 317 405 313 401 313 Z" fill="#059669" />
                            <circle cx="383" cy="294" r="10" fill="#ef4444" />
                            <rect x="393" y="285" width="14" height="10" rx="3" fill="#fde047" />
                            <circle cx="418" cy="293" r="8" fill="#f97316" />
                        </g>
                    </g>

                    {/* Head */}
                    <g className="gc-head">
                        {/* Dynamic Sweat Drops */}
                        <g className="gc-sweat" style={{ transformOrigin: '280px 140px' }}>
                            <path d="M280 145 C285 135 285 135 290 145 A 5 5 0 0 1 280 145 Z" fill="#60a5fa" />
                            <path d="M260 125 C265 115 265 115 270 125 A 5 5 0 0 1 260 125 Z" fill="#93c5fd" />
                        </g>
                        <rect x="331" y="198" width="18" height="20" rx="7" fill="#f3d5b0" />
                        <ellipse cx="340" cy="165" rx="46" ry="48" fill="#f3d5b0" />
                        <ellipse cx="340" cy="128" rx="46" ry="22" fill="#1c1917" />
                        <ellipse cx="294" cy="148" rx="10" ry="24" fill="#1c1917" />
                        <ellipse cx="386" cy="148" rx="10" ry="24" fill="#1c1917" />
                        <ellipse cx="294" cy="168" rx="9" ry="11" fill="#f3d5b0" />
                        <ellipse cx="386" cy="168" rx="9" ry="11" fill="#f3d5b0" />
                        <ellipse cx="323" cy="162" rx="8" ry="9" fill="white" />
                        <ellipse cx="357" cy="162" rx="8" ry="9" fill="white" />
                        <circle cx="325" cy="164" r="5" fill="#1c1917" />
                        <circle cx="359" cy="164" r="5" fill="#1c1917" />
                        <circle cx="327" cy="162" r="2" fill="white" />
                        <circle cx="361" cy="162" r="2" fill="white" />
                        <path d="M315 152 Q323 148 331 152" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        <path d="M349 152 Q357 148 365 152" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        <path d="M320 180 Q340 196 360 180" stroke="#c2410c" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <ellipse cx="308" cy="178" rx="11" ry="7" fill="#fca5a5" opacity="0.5" />
                        <ellipse cx="372" cy="178" rx="11" ry="7" fill="#fca5a5" opacity="0.5" />
                        <ellipse cx="340" cy="122" rx="50" ry="14" fill="#059669" />
                        <rect x="295" y="108" width="90" height="20" rx="6" fill="#059669" />
                        <rect x="280" y="118" width="30" height="10" rx="5" fill="#047857" />
                        <circle cx="340" cy="110" r="6" fill="#34d399" />
                    </g>
                </g>

                <ellipse cx="340" cy="463" rx="110" ry="8" fill="#d1fae5" opacity="0.6" />
            </svg>
        </div>
    );
}