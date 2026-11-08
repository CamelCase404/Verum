import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { FaqBlock } from "@/components/ui/FaqBlock";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, Building2, Loader2 } from "lucide-react";
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
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    useEffect(() => {
        billingApi.getPlans().then((res) => setPlans(res.data.plans)).catch(console.error);
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
                title={<>Гибридный SaaS: подписка + <span className="text-accent">Pay-per-Test</span></>}
                lede="Ежемесячная подписка за доступ к платформе. Пакет «Успешных верификаций» включён. Сверх пакета — доплата за доп. ИИ-интервью и открытие контактов. Разработчики проходят тест бесплатно."
                centered
            />

            <section className="py-12 md:py-16">
                <div className="wrap">
                    <Stagger className="grid md:grid-cols-3 gap-5">
                        {plans.map((p: any) => {
                            const Icon = ICONS[p.id] || Zap;
                            const isCurrent = backendUser?.plan === p.id;
                            const isPro = p.id === "pro";
                            return (
                                <StaggerItem key={p.id}>
                                    <div className={`relative flex flex-col p-6 md:p-7 rounded-2xl h-full border transition-all ${
                                        isPro ? "border-accent bg-surface shadow-xl shadow-accent/5" : "border-line bg-surface hover:border-line-2 hover:shadow-lg"
                                    }`}>
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
                                        <div className="w-12 h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-5">
                                            <Icon size={24} />
                                        </div>
                                        <h3 className="text-[24px] font-semibold mb-1">{p.name}</h3>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-[34px] font-bold text-ink">
                                                {(p.price_month / 1000).toFixed(0)} 000
                                            </span>
                                            <span className="text-ink-3 text-sm">₽ / мес</span>
                                        </div>
                                        <div className="text-[13px] text-ink-3 mb-5">
                                            {p.verifications_per_month === null
                                                ? "Безлимитные верификации"
                                                : `${p.verifications_per_month} верификаций в месяц`}
                                        </div>
                                        <ul className="flex-1 space-y-2.5 mb-6">
                                            {p.features.map((f: string, i: number) => (
                                                <li key={i} className="flex gap-2.5 text-[13.5px] text-ink-2 leading-snug">
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
                                                    ? "bg-accent text-white hover:bg-accent-2"
                                                    : "bg-surface-2 border border-line-2 text-ink hover:bg-surface-3"
                                            }`}
                                        >
                                            {loadingPlan === p.id && <Loader2 size={16} className="animate-spin" />}
                                            {isCurrent ? "Активен" : "Выбрать тариф"}
                                        </button>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </Stagger>

                    {plans.length === 0 && (
                        <div className="text-center text-ink-3 py-10">Загрузка тарифов...</div>
                    )}
                </div>
            </section>

            <section className="py-12 bg-surface-2">
                <div className="wrap max-w-[900px]">
                    <Reveal>
                        <SectionHead
                            eyebrow="Pay-per-Test"
                            title="Сверх пакета — доплата за объём"
                            lede="Пиковый сезон найма? Лимиты не блокируют работу — просто доплачиваете за превышение."
                            centered
                        />
                    </Reveal>
                    <Reveal delay={0.15}>
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div className="bg-surface border border-line rounded-2xl p-6">
                                <div className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold mb-2">Pay-per-Test</div>
                                <div className="text-[32px] font-bold text-ink mb-1">1 500 ₽</div>
                                <p className="text-[13px] text-ink-2 leading-relaxed">
                                    За каждое дополнительное ИИ-собеседование сверх пакета подписки.
                                </p>
                            </div>
                            <div className="bg-surface border border-line rounded-2xl p-6">
                                <div className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold mb-2">Pay-per-Unlock</div>
                                <div className="text-[32px] font-bold text-ink mb-1">5 000 ₽</div>
                                <p className="text-[13px] text-ink-2 leading-relaxed">
                                    За открытие контактов проверенного инженера сверх пакета.
                                </p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section className="py-12">
                <div className="wrap max-w-[820px]">
                    <Reveal>
                        <div className="bg-gradient-to-br from-accent/5 via-transparent to-accent/5 border border-line rounded-2xl p-8 md:p-10 text-center">
                            <Sparkles className="text-accent mx-auto mb-4" size={32} />
                            <h3 className="text-[22px] font-semibold mb-2">Для разработчиков — 0 ₽</h3>
                            <p className="text-ink-2 text-[14.5px] leading-relaxed max-w-[520px] mx-auto">
                                Прохождение ИИ-собеседования, верификация профиля и попадание в базу —
                                полностью бесплатны. Компании сами приходят к вам.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="wrap">
                    <Reveal>
                        <SectionHead eyebrow="FAQ" title="Частые вопросы" centered />
                    </Reveal>
                    <FaqBlock items={[
                        { q: "Что такое «Успешная верификация»?", a: "Одно успешное действие: запуск ИИ-интервью для кандидата ИЛИ открытие контактов проверенного инженера. Оба расходуют 1 единицу из пакета." },
                        { q: "Что если модератор отклонил кандидата?", a: "Верификация не списывается. Кандидат блокируется, а вы видите сообщение о нарушении." },
                        { q: "Можно ли перейти на другой тариф в середине месяца?", a: "Да, новый тариф активируется сразу, остаток пакета обновляется." },
                        { q: "Сколько времени занимает модерация?", a: "2–3 минуты с момента запроса «Открыть контакты». Модератор смотрит только тайм-коды аномалий." },
                        { q: "Разработчик платит что-то?", a: "Нет, полностью бесплатно. B2C — магнит трафика платформы." },
                        { q: "Есть ли скрытые платежи?", a: "Нет. Подписка + Pay-per-Test/Unlock сверх пакета. Всё прозрачно." },
                    ]} />
                </div>
            </section>
        </>
    );
}
