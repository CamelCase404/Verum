import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, ShieldCheck, Database, Search, Crown, Building2, Loader2 } from "lucide-react";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { FaqBlock } from "@/components/ui/FaqBlock";
import { billingApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";
import { useAppStore } from "@/store/useAppStore";

export function Pricing() {
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);
    const backendUser = useAppStore((s) => s.backendUser);
    const setBackendUser = useAppStore((s) => s.setBackendUser);

    const [plans, setPlans] = useState<any[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    useEffect(() => {
        billingApi.getPlans()
            .then((res) => setPlans(res?.data?.plans || []))
            .finally(() => setLoaded(true));
    }, []);

    const handleSubscribe = async (planId: string) => {
        if (!user) { navigate("/register?role=company"); return; }
        if (user.role !== "company") { toast("Только для компаний"); return; }
        setLoadingPlan(planId);
        try {
            const res = await billingApi.subscribe(planId);
            if (setBackendUser && backendUser) {
                setBackendUser({ ...backendUser, ...res.data });
            }
            toast("Тариф активирован", "success");
            navigate("/dashboard");
        } catch (e: any) {
            toast(e.message || "Ошибка");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <>
            <PageHero
                eyebrow="Тарифы"
                title={<>Выберите <span className="text-accent">формат работы</span></>}
                lede="Покупайте тесты для внешних кандидатов с hh.ru или токены для доступа к базе верифицированных инженеров Verum."
                centered
            />

            <section className="py-12 md:py-16">
                <div className="wrap">
                    {!loaded && <div className="text-center py-10 text-ink-3">Загрузка...</div>}
                    
                    {loaded && (
                        <div className="grid md:grid-cols-3 gap-5">
                            {plans.map((p, i) => {
                                const isPro = p.id === "pro";
                                const isCurrent = backendUser?.plan === p.id;
                                return (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`relative flex flex-col p-7 rounded-2xl border ${isPro ? "border-accent bg-surface shadow-xl shadow-accent/5" : "border-line bg-surface"}`}
                                    >
                                        {isPro && <div className="absolute -top-2.5 left-7 px-2.5 py-0.5 bg-accent text-white text-[10px] font-bold uppercase tracking-wider rounded">Хит продаж</div>}
                                        <h3 className="text-[22px] font-semibold mb-2">{p.name}</h3>
                                        <div className="flex items-baseline gap-1.5 mb-6">
                                            <span className="text-[34px] font-bold text-ink">{(p.price_month / 1000).toFixed(0)} 000</span>
                                            <span className="text-ink-3 text-sm">₽ / мес</span>
                                        </div>
                                        <ul className="flex-1 space-y-3 mb-6">
                                            <li className="flex gap-2 text-[14px] text-ink-2">
                                                <ShieldCheck size={18} className="text-accent shrink-0" />
                                                <span><b>{p.verifications_per_month === null ? "Безлимит" : p.verifications_per_month}</b> тестов для внешних кандидатов</span>
                                            </li>
                                            <li className="flex gap-2 text-[14px] text-ink-2">
                                                <Database size={18} className="text-accent shrink-0" />
                                                <span><b>{p.tokens_per_month === null ? "Безлимит" : p.tokens_per_month}</b> токенов для доступа к базе</span>
                                            </li>
                                            {p.features.map((f: string, j: number) => (
                                                <li key={j} className="flex gap-2 text-[13.5px] text-ink-3">
                                                    <Check size={16} className="text-ink-4 shrink-0" />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            onClick={() => handleSubscribe(p.id)}
                                            disabled={isCurrent || loadingPlan === p.id}
                                            className={`h-[44px] rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${isCurrent ? "bg-surface-2 text-ink-3" : isPro ? "bg-accent text-white hover:bg-accent-2" : "bg-surface-2 border border-line-2 hover:bg-surface-3"}`}
                                        >
                                            {loadingPlan === p.id && <Loader2 size={16} className="animate-spin" />}
                                            {isCurrent ? "Активен" : "Подключить"}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Блок документации: Как это работает */}
            <section className="py-12 bg-surface-2">
                <div className="wrap max-w-[900px]">
                    <SectionHead eyebrow="Логика оплаты" title="Как расходуются средства" centered />
                    <div className="grid sm:grid-cols-2 gap-5 mt-8">
                        <div className="bg-surface border border-line rounded-2xl p-6">
                            <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center mb-4 text-ink-2"><Search size={20} /></div>
                            <h4 className="font-semibold text-[16px] mb-2 text-ink">Внешние кандидаты (hh.ru)</h4>
                            <p className="text-[13.5px] text-ink-2 leading-relaxed mb-4">
                                Вы даете ссылку на тест. Каждый пройденный тест списывает <b>1 верификацию</b> (тест) из пакета.
                            </p>
                            <div className="text-[12px] bg-surface-2 px-3 py-2 rounded text-ink-3">Стоимость доп. теста: 1 500 ₽</div>
                        </div>
                        <div className="bg-surface border border-line rounded-2xl p-6">
                            <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center mb-4 text-ink-2"><Database size={20} /></div>
                            <h4 className="font-semibold text-[16px] mb-2 text-ink">База Verum (Токены)</h4>
                            <p className="text-[13.5px] text-ink-2 leading-relaxed mb-4">
                                Вы открываете контакты готового инженера. Стоимость зависит от грейда:
                            </p>
                            <div className="flex justify-between text-[12px] bg-surface-2 px-3 py-2 rounded text-ink-3 mb-1">
                                <span>Junior</span> <b className="text-ink">50 токенов</b>
                            </div>
                            <div className="flex justify-between text-[12px] bg-surface-2 px-3 py-2 rounded text-ink-3 mb-1">
                                <span>Middle</span> <b className="text-ink">150 токенов</b>
                            </div>
                            <div className="flex justify-between text-[12px] bg-surface-2 px-3 py-2 rounded text-ink-3">
                                <span>Senior</span> <b className="text-ink">300 токенов</b>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* FAQ */}
            <section className="py-12">
                <div className="wrap max-w-[820px]">
                    <FaqBlock items={[
                        { q: "Что если я потратил все токены?", a: "Вы можете докупить пакет токенов в личном кабинете в любой момент. Токены не сгорают." },
                        { q: "Чем отличается тест от открытия контактов?", a: "Тест вы тратите, когда присылаете ссылку кандидату с hh.ru. Токены вы тратите, когда ищете готового проверенного инженера в базе Verum." },
                    ]} />
                </div>
            </section>
        </>
    );
}
