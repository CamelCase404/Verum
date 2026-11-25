import { motion } from "framer-motion";

export interface SkillData {
    skill: string;
    score: number;
    verdict: "strong" | "ok" | "weak";
}

const SKILL_LABELS: Record<string, string> = {
    architecture: "Архитектура",
    code_understanding: "Понимание кода",
    prompting: "Работа с ИИ",
    adaptability: "Адаптивность",
    soft_skills: "Soft Skills",
};

export function SkillRadar({ skills }: { skills: SkillData[] }) {
    if (!skills || skills.length === 0) return null;

    const size = 300;
    const center = size / 2;
    const radius = size / 2 - 40; // отступ для подписей
    const count = skills.length;

    // Вычисляем координаты для точки на оси
    const getPoint = (index: number, value: number) => {
        const angle = (Math.PI * 2 * index) / count - Math.PI / 2; // начинаем сверху
        const r = (value / 100) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    // Строим полигон (соединяем точки)
    const points = skills
        .map((s, i) => {
            const { x, y } = getPoint(i, s.score);
            return `${x},${y}`;
        })
        .join(" ");

    // Оси (линии от центра)
    const axes = skills.map((_, i) => getPoint(i, 100));

    // Сетка (концентрические многоугольники)
    const gridLevels = [20, 40, 60, 80, 100];

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} className="overflow-visible">
                {/* 1. Сетка */}
                {gridLevels.map((level) => (
                    <polygon
                        key={level}
                        points={skills
                            .map((_, i) => {
                                const { x, y } = getPoint(i, level);
                                return `${x},${y}`;
                            })
                            .join(" ")}
                        fill="none"
                        stroke="var(--line, #e5e7eb)"
                        strokeWidth={1}
                        opacity={0.5}
                    />
                ))}

                {/* 2. Оси */}
                {axes.map((p, i) => (
                    <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={p.x}
                        y2={p.y}
                        stroke="var(--line, #e5e7eb)"
                        strokeWidth={1}
                        opacity={0.5}
                    />
                ))}

                {/* 3. Заливка (Полигон) */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                    points={points}
                    fill="var(--accent, #10b981)"
                    fillOpacity={0.2}
                    stroke="var(--accent, #10b981)"
                    strokeWidth={2}
                    style={{ transformOrigin: `${center}px ${center}px` }}
                />

                {/* 4. Точки на вершинах */}
                {skills.map((s, i) => {
                    const { x, y } = getPoint(i, s.score);
                    return (
                        <motion.circle
                            key={i}
                            initial={{ r: 0 }}
                            animate={{ r: 4 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.6 + i * 0.1 }}
                            cx={x}
                            cy={y}
                            fill="var(--accent, #10b981)"
                        />
                    );
                })}

                {/* 5. Подписи осей */}
                {skills.map((s, i) => {
                    const { x, y } = getPoint(i, 118); // Чуть дальше 100%
                    return (
                        <text
                            key={i}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-[11px] font-semibold fill-ink-2"
                        >
                            {SKILL_LABELS[s.skill] || s.skill}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
