import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2, Loader2, ShieldCheck } from "lucide-react";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { FaqBlock } from "@/components/ui/FaqBlock";
import { billingApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";
import { useAppStore } from "@/store/useAppStore";

const ICONS: Record<string, any> = { start: Zap, pro: Crown, enterprise: Building2 };

export function Pricing() {
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);
    const backendUser = useAppStore((s) => s.backendUser);
    const setBackendUser = useAppStore((s) => s.setBackendUser);

    const [plans, setPlans] = useState<any[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    useEffect(() => {
        billingApi.getPlans()
            .then((res) => {
                const list = res?.data?.plans;
                setPlans(Array.isArray(list) ? list : []);
            })
            .catch((e: any) => {
                console.error("billing/plans", e);
                setLoadError(e?.message || "Не удалось загрузить тарифы");
            })
            .finally(() => setLoaded(true));
    }, []);

    const handleSubscribe = async (planId: string) => {
        if (!user) { navigate("/register?role=company"); return; }
        if (user.role !== "company") { toast("Тарифы доступны только компаниям"); return; }
        setLoadingPlan(planId);
        try {
            const res = await billingApi.subscribe(planId);
            if (setBackendUser && backendUser) {
                setBackendUser({
                    ...backendUser,
                    plan: res.data.plan,
                    verifications_left: res.data.verifications_left,
                    subscription_until: res.data.subscription_until,
                });
            }
            toast("Тариф активирован", "success");
            navigate("/dashboard");
        } catch (e: any) {
            toast(e.message || "Ошибка активации");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <>
            <PageHero
                eyebrow="Тарифы"
                title={<>Выберите <span className="text-accent">подходящий тариф</span></>}
                lede="Ежемесячная подписка за доступ к платформе. Пакет верификаций включён, при необходимости докупается отдельно. Для разработчиков платформа полностью бесплатна."
                centered
            />

            <section className="py-12 md:py-16">
                <div className="wrap">
                    {!loaded && (
                        <div className="grid md:grid-cols-3 gap-5">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="h-[520px] rounded-2xl bg-surface border border-line animate-pulse" />
                            ))}
                        </div>
                    )}

                    {loaded && loadError && (
                        <div className="max-w-[520px] mx-auto text-center py-12">
                            <div className="text-[15px] font-medium text-ink mb-2">Не удалось загрузить тарифы</div>
                            <p className="text-[13px] text-ink-3 mb-4">{loadError}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-5 py-2.5 rounded-xl bg-surface-2 border border-line text-ink text-[13px] font-medium hover:bg-surface-3 transition-colors"
                            >
                                Повторить
                            </button>
                        </div>
                    )}

                    {loaded && !loadError && plans.length === 0 && (
                        <div className="text-center py-12 text-ink-3">Тарифы пока не настроены.</div>
                    )}

                    {loaded && plans.length > 0 && (
                        <div className="grid md:grid-cols-3 gap-5">
                            {plans.map((p, i) => {
                                const Icon = ICONS[p.id] || Zap;
                                const isCurrent = backendUser?.plan === p.id;
                                const isPro = p.id === "pro";
                                return (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: i * 0.08 }}
                                        className={`relative flex flex-col p-6 md:p-7 rounded-2xl h-full border transition-all ${
                                            isPro
                                                ? "border-accent bg-surface shadow-xl shadow-accent/5"
                                                : "border-line bg-surface hover:border-line-2 hover:shadow-lg"
                                        }`}
                                    >
                                        {isPro && (
                                            <div className="absolute -top-2.5 left-7 px-2.5 py-0.5 bg-accent text-white text-[11px] font-semibold uppercase tracking-wider rounded">
                                                Хит продаж
                                            </div>
                                        )}
                                        {isCurrent && (
                                            <div className="absolute -top-2.5 right-7 px-2.5 py-0.5 bg-surface-2 text-accent border border-accent text-[11px] font-semibold uppercase tracking-wider rounded">
                                                Ваш тариф
                                            </div>
                                        )}
                                        <div className="w-11 h-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-4">
                                            <Icon size={22} />
                                        </div>
                                        <h3 className="text-[22px] font-semibold mb-1">{p.name}</h3>
                                        <div className="flex items-baseline gap-1.5 mb-1">
                                            <span className="text-[32px] font-bold text-ink tabular-nums">
                                                {(p.price_month / 1000).toFixed(0)} 000
                                            </span>
                                            <span className="text-ink-3 text-[13px]">₽ / мес</span>
                                        </div>
                                        <div className="text-[13px] text-ink-3 mb-5">
                                            {p.verifications_per_month === null
                                                ? "Безлимитные верификации"
                                                : `${p.verifications_per_month} верификаций в месяц`}
                                        </div>
                                        <ul className="flex-1 space-y-2.5 mb-6">
                                            {(p.features || []).map((f: string, j: number) => (
                                                <li key={j} className="flex gap-2.5 text-[13.5px] text-ink-2 leading-snug">
                                                    <Check size={14} className="text-accent shrink-0 mt-0.5" />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            onClick={() => handleSubscribe(p.id)}
                                            disabled={isCurrent || loadingPlan === p.id}
                                            className={`h-[44px] rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                                                isCurrent
                                                    ? "bg-surface-2 text-ink-3 cursor-default"
                                                    : isPro
                                                    ? "bg-accent text-white hover:bg-accent-2 shadow-lg shadow-accent/20"
                                                    : "bg-surface-2 border border-line-2 text-ink hover:bg-surface-3"
                                            }`}
                                        >
                                            {loadingPlan === p.id && <Loader2 size={16} className="animate-spin" />}
                                            {isCurrent ? "Активен" : "Выбрать тариф"}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-12 bg-surface-2">
                <div className="wrap max-w-[900px]">
                    <SectionHead
                        eyebrow="Объём сверх пакета"
                        title="Платите только за превышение"
                        lede="Пиковый сезон найма? Лимиты не блокируют работу — просто доплачиваете за превышение."
                        centered
                    />
                    <div className="grid sm:grid-cols-2 gap-5 mt-8">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="bg-surface border border-line rounded-2xl p-6"
                        >
                            <div className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold mb-2">Доп. ИИ-интервью</div>
                            <div className="text-[32px] font-bold text-ink mb-1 tabular-nums">1 500 ₽</div>
                            <p className="text-[13px] text-ink-2 leading-relaxed">
                                За каждое дополнительное собеседование сверх пакета подписки.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="bg-surface border border-line rounded-2xl p-6"
                        >
                            <div className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold mb-2">Доп. открытие контактов</div>
                            <div className="text-[32px] font-bold text-ink mb-1 tabular-nums">5 000 ₽</div>
                            <p className="text-[13px] text-ink-2 leading-relaxed">
                                За открытие контактов проверенного инженера сверх пакета.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="wrap max-w-[820px]">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="bg-surface border border-line rounded-2xl p-8 md:p-10 text-center"
                    >
                        <div className="w-12 h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-[20px] font-semibold mb-2">Для разработчиков — бесплатно</h3>
                        <p className="text-ink-2 text-[14px] leading-relaxed max-w-[520px] mx-auto">
                            Прохождение ИИ-собеседования, верификация профиля и попадание в базу — 
                            без оплаты. Компании сами приходят к вам.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="wrap">
                    <SectionHead eyebrow="FAQ" title="Частые вопросы" centered />
                    <FaqBlock items={[
                        { q: "Что такое «Успешная верификация»?", a: "Одно успешное действие: запуск ИИ-интервью для кандидата ИЛИ открытие контактов проверенного инженера. Оба расходуют 1 единицу из пакета." },
                        { q: "Что если модератор отклонил кандидата?", a: "Верификация не списывается. Кандидат блокируется, а вы видите сообщение о нарушении." },
                        { q: "Можно ли перейти на другой тариф в середине месяца?", a: "Да, новый тариф активируется сразу, остаток пакета обновляется." },
                        { q: "Сколько времени занимает модерация?", a: "2–3 минуты с момента запроса «Открыть контакты». Модератор смотрит только тайм-коды аномалий." },
                        { q: "Разработчик платит что-то?", a: "Нет, полностью бесплатно. B2C — магнит трафика платформы." },
                        { q: "Есть ли скрытые платежи?", a: "Нет. Подписка + доплата за превышение пакета. Всё прозрачно." },
                    ]} />
                </div>
            </section>
        </>
    );
}
