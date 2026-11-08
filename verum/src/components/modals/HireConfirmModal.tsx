import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2, ShieldCheck, Lock, Sparkles, FileText } from "lucide-react";
import { companyApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";

export function HireConfirmModal({
    candidate,
    onClose,
    onConfirm,
    loading,
}: {
    candidate: any;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}) {
    const navigate = useNavigate();
    const backendUser = useAppStore((s) => s.backendUser);
    const setBackendUser = useAppStore((s) => s.setBackendUser);
    const [submitting, setSubmitting] = useState(false);
    const [agreed, setAgreed] = useState(false);

    useEffect(() => {
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflow = "";
            window.scrollTo(0, scrollY);
        };
    }, []);

    const isEnterprise = backendUser?.plan === "enterprise";
    const left = backendUser?.verifications_left;
    const hasUnlimited = isEnterprise || left === null || left === undefined;
    const hasEnough = hasUnlimited || (typeof left === "number" && left > 0);

    const handleUnlock = async () => {
        if (!hasEnough) {
            navigate("/pricing");
            return;
        }
        setSubmitting(true);
        try {
            const res = await companyApi.requestUnlock(candidate.id);
            if (res.data.status === "pending") {
                toast("Запрос отправлен модератору. Ожидайте подтверждения (2–3 минуты).", "success");
            } else if (res.data.status === "already_unlocked") {
                toast("Контакты уже открыты", "success");
            } else if (res.data.status === "already_pending") {
                toast("Запрос уже в очереди модерации", "success");
            }
            // Обновим локальный счётчик оптимистично (уменьшим на 1 при pending)
            if (res.data.status === "pending" && backendUser && typeof left === "number" && left > 0) {
                setBackendUser({ ...backendUser, verifications_left: left - 1 });
            }
            onConfirm();
            onClose();
        } catch (e: any) {
            toast(e.message || "Ошибка запроса");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface border border-line rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-ink-3 hover:text-ink">
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-accent-soft text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Открыть контакты</h2>
                    <p className="text-ink-2 text-sm">
                        Запрос на <b>{candidate.full_name}</b> уйдёт модератору Verum.
                        Проверка занимает 2–3 минуты, затем откроются контакты и чат.
                    </p>
                </div>

                {/* Счётчик верификаций */}
                <div className="bg-surface-2 border border-line rounded-xl p-4 mb-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-ink-3 flex items-center gap-2">
                            <Sparkles size={16} className="text-accent" />
                            Остаток верификаций:
                        </span>
                        <span className="font-bold text-ink text-lg">
                            {isEnterprise ? "∞" : (left ?? 0)}
                        </span>
                    </div>
                    <div className="pt-3 border-t border-line flex justify-between items-center">
                        <span className="text-ink font-medium">Списание за запрос:</span>
                        <span className="text-lg font-bold text-accent">
                            {isEnterprise ? "0" : "1"} верификация
                        </span>
                    </div>
                </div>

                {!hasEnough && (
                    <div className="bg-warn-soft border border-warn/20 text-warn text-[13px] rounded-xl p-3 mb-6 flex items-start gap-2">
                        <Lock size={16} className="shrink-0 mt-0.5" />
                        <span>Лимит верификаций исчерпан. Пополните пакет или обновите тариф, чтобы продолжить.</span>
                    </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer group mb-6">
                    <div className="relative flex items-center mt-0.5">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="peer sr-only"
                        />
                        <div className="w-5 h-5 rounded border border-line-2 peer-checked:bg-accent peer-checked:border-accent flex items-center justify-center transition-colors">
                            {agreed && <ShieldCheck size={14} className="text-white" />}
                        </div>
                    </div>
                    <span className="text-[13px] text-ink-2 leading-relaxed select-none group-hover:text-ink transition-colors">
                        Я согласен с правилами платформы. Если модератор обнаружит читерство,
                        списание не произойдёт, а кандидат будет заблокирован.
                    </span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-medium hover:bg-surface-2 transition-colors"
                    >
                        Отмена
                    </button>
                    {!hasEnough ? (
                        <button
                            onClick={() => { onClose(); navigate("/pricing"); }}
                            className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors flex items-center justify-center gap-2"
                        >
                            <Sparkles size={16} />
                            Пополнить пакет
                        </button>
                    ) : (
                        <button
                            onClick={handleUnlock}
                            disabled={!agreed || submitting || loading}
                            className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {submitting || loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <FileText size={16} />
                            )}
                            Открыть контакты
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
