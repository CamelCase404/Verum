import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2, ShieldCheck, Lock, Database, MessageSquare } from "lucide-react";
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
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const isEnterprise = backendUser?.plan === "enterprise";
    const cost = candidate?.token_cost || 0;
    const tokensLeft = backendUser?.tokens ?? 0;
    const hasEnough = isEnterprise || tokensLeft >= cost;

    const handleHire = async () => {
        if (!hasEnough) {
            navigate("/pricing");
            return;
        }
        setSubmitting(true);
        try {
            const res = await companyApi.hire(candidate.id);
            toast(`Чат открыт. Списано ${res.data.cost} токенов.`, "success");
            
            if (setBackendUser && backendUser) {
                setBackendUser({ ...backendUser, tokens: res.data.tokens_left });
            }
            
            navigate(`/messages?chat=${res.data.conversation_id}`);
            onClose();
        } catch (e: any) {
            toast(e.message || "Ошибка");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface border border-line rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-ink-3 hover:text-ink">
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-accent-soft text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare size={32} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Начать диалог</h2>
                    <p className="text-ink-2 text-sm">
                        Открытие чата с <b>{candidate.full_name}</b> ({candidate.final_grade})
                    </p>
                </div>

                <div className="bg-surface-2 border border-line rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center text-sm mb-3">
                        <span className="text-ink-3 flex items-center gap-2">
                            <Database size={16} /> Стоимость:
                        </span>
                        <span className="font-bold text-ink text-lg text-accent">
                            {isEnterprise ? "0" : cost} токенов
                        </span>
                    </div>
                    <div className="pt-3 border-t border-line flex justify-between items-center text-[12px]">
                        <span className="text-ink-3">Остаток:</span>
                        <span className="font-medium text-ink">
                            {isEnterprise ? "∞" : tokensLeft} токенов
                        </span>
                    </div>
                </div>

                <div className="bg-surface-2 border border-line rounded-xl p-3 mb-6 flex items-start gap-2 text-[12px] text-ink-3">
                    <ShieldCheck size={16} className="text-accent shrink-0 mt-0.5" />
                    <span>
                        <b>Гарантия возврата:</b> Если разработчик не ответит в течение 3 дней, токены вернутся на ваш счет автоматически.
                    </span>
                </div>

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
                        Я согласен со списанием токенов и условиями возврата.
                    </span>
                </label>

                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium hover:bg-surface-2 transition-colors">
                        Отмена
                    </button>
                    {!hasEnough ? (
                        <button onClick={() => { onClose(); navigate("/pricing"); }} className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 flex items-center gap-2">
                            Пополнить
                        </button>
                    ) : (
                        <button
                            onClick={handleHire}
                            disabled={!agreed || submitting || loading} 
                            className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting || loading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                            Нанять
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
