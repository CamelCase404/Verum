import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Loader2,
    Link as LinkIcon,
    Check,
    Copy,
    Briefcase,
    Globe,
} from "lucide-react";
import { authApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";

const STACKS = [
    "Mobile (iOS)",
    "Mobile (Android)",
    "Frontend",
    "Backend",
    "GameDev",
    "DevOps / SRE",
    "Data / ML",
];
const LEVELS = ["Junior", "Middle", "Senior"];
const FORMATS = ["Удалённо", "Гибрид", "Офис"];

export function CreateJobModal({
    onClose,
    backendUser,
    onRefresh,
    jobToEdit,
}: {
    onClose: () => void;
    backendUser: any;
    onRefresh: () => void;
    jobToEdit?: any;
}) {
    const isEditing = !!jobToEdit;

    const [step, setStep] = useState<1 | 2>(1);
    const [isExternal, setIsExternal] = useState(false);
    const [generatedSlug, setGeneratedSlug] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [stack, setStack] = useState("Frontend");
    const [level, setLevel] = useState("Middle");
    const [format, setFormat] = useState("Удалённо");
    const [salaryFrom, setSalaryFrom] = useState("");
    const [salaryTo, setSalaryTo] = useState("");
    const [isNegotiable, setIsNegotiable] = useState(false);

    const [loading, setLoading] = useState(false);

    const generateSlug = (t: string, l: string) => {
        const base = `${l.toLowerCase()}-${t
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}`;
        return `${base}-${Math.random().toString(36).substring(2, 6)}`;
    };

    const handleNext = () => {
        if (!title.trim()) return toast("Введите название вакансии");
        setGeneratedSlug(generateSlug(title, level));
        setStep(2);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            let finalSalary = "По договоренности";
            if (!isNegotiable) {
                const cleanFrom = salaryFrom.replace(/\D/g, "");
                const cleanTo = salaryTo.replace(/\D/g, "");
                if (cleanFrom && cleanTo)
                    finalSalary = `от ${cleanFrom} до ${cleanTo} ₽`;
                else if (cleanFrom) finalSalary = `от ${cleanFrom} ₽`;
            }

            const currentJobs = backendUser?.job_postings || [];

            if (isEditing) {
                const updatedJobs = currentJobs.map((j: any) =>
                    j.id === jobToEdit.id
                        ? {
                              ...j,
                              title,
                              description,
                              stack,
                              level,
                              salary: finalSalary,
                              format,
                              is_external: isExternal,
                          }
                        : j,
                );
                await authApi.updateJobs(updatedJobs);
                toast("Вакансия обновлена", "success");
            } else {
                const newJob = {
                    id: Date.now().toString(),
                    title,
                    description,
                    stack,
                    level,
                    salary: finalSalary,
                    format,
                    is_external: isExternal,
                    slug: isExternal ? generatedSlug : null,
                };
                await authApi.updateJobs([...currentJobs, newJob]);
                toast("Вакансия опубликована", "success");
            }

            onRefresh();
            onClose();
        } catch (e: any) {
            toast(e.message || "Ошибка сохранения");
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        const url = `${window.location.origin}/v/${generatedSlug}`;
        navigator.clipboard.writeText(url);
        toast("Ссылка скопирована", "success");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface border border-line rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-ink-3 hover:text-ink"
                >
                    <X size={20} />
                </button>

                {step === 1 && (
                    <>
                        <h2 className="text-xl font-bold mb-6">
                            {isEditing ? "Редактировать" : "Создать"} вакансию
                        </h2>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-[13px] font-medium mb-1 block">
                                    Название
                                </label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-bg-2 border border-transparent focus:border-accent rounded-xl p-3 text-sm outline-none transition-colors"
                                    placeholder="Например: Senior Backend Developer"
                                />
                            </div>
                            <div>
                                <label className="text-[13px] font-medium mb-1 block">
                                    Описание
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows={4}
                                    className="w-full bg-bg-2 border border-transparent focus:border-accent rounded-xl p-3 text-sm outline-none transition-colors"
                                    placeholder="Требования, задачи..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[13px] font-medium mb-1 block">
                                        Стек
                                    </label>
                                    <select
                                        value={stack}
                                        onChange={(e) =>
                                            setStack(e.target.value)
                                        }
                                        className="w-full bg-bg-2 border border-transparent focus:border-accent rounded-xl p-3 text-sm outline-none"
                                    >
                                        {STACKS.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[13px] font-medium mb-1 block">
                                        Уровень
                                    </label>
                                    <select
                                        value={level}
                                        onChange={(e) =>
                                            setLevel(e.target.value)
                                        }
                                        className="w-full bg-bg-2 border border-transparent focus:border-accent rounded-xl p-3 text-sm outline-none"
                                    >
                                        {LEVELS.map((l) => (
                                            <option key={l} value={l}>
                                                {l}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-line">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl font-medium hover:bg-surface-2 transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors"
                            >
                                Далее
                            </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="text-xl font-bold mb-2">
                            Где размещена вакансия?
                        </h2>
                        <p className="text-[13px] text-ink-3 mb-6">
                            Это определит, как кандидаты будут откликаться.
                        </p>

                        <div className="space-y-3 mb-8">
                            <button
                                onClick={() => setIsExternal(false)}
                                className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${!isExternal ? "border-accent bg-accent/5" : "border-line bg-surface-2 hover:border-line-2"}`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${!isExternal ? "bg-accent text-white" : "bg-surface text-ink-3"}`}
                                >
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <div className="font-semibold text-[15px] mb-1">
                                        Только на Verum
                                    </div>
                                    <div className="text-[12px] text-ink-3 leading-relaxed">
                                        Мы сами подберем кандидатов из нашей
                                        базы, подходящих под ваши требования.
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => setIsExternal(true)}
                                className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${isExternal ? "border-accent bg-accent/5" : "border-line bg-surface-2 hover:border-line-2"}`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isExternal ? "bg-accent text-white" : "bg-surface text-ink-3"}`}
                                >
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <div className="font-semibold text-[15px] mb-1">
                                        На внешнем ресурсе (hh.ru)
                                    </div>
                                    <div className="text-[12px] text-ink-3 leading-relaxed">
                                        Вы получите ссылку, которую сможете
                                        прикрепить к вакансии на hh.ru.
                                        Кандидаты пройдут тест и попадут в топ.
                                    </div>
                                </div>
                            </button>
                        </div>

                        {isExternal && (
                            <div className="bg-surface-2 border border-line rounded-xl p-4 mb-8">
                                <div className="text-[12px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
                                    Ваша персональная ссылка
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        readOnly
                                        value={`${window.location.origin}/v/${generatedSlug}`}
                                        className="flex-1 bg-bg-2 border border-line rounded-lg px-3 py-2 text-[13px] text-ink-2 outline-none"
                                    />
                                    <button
                                        onClick={copyLink}
                                        className="p-2 bg-surface border border-line rounded-lg hover:text-accent transition-colors"
                                        title="Копировать"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-line">
                            <button
                                onClick={() => setStep(1)}
                                className="px-5 py-2.5 rounded-xl font-medium hover:bg-surface-2 transition-colors"
                            >
                                Назад
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors flex items-center gap-2"
                            >
                                {loading && (
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                )}
                                {isExternal
                                    ? "Сохранить и скопировать"
                                    : "Сохранить"}
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
