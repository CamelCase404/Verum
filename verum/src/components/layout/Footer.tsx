import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/Reveal";

export function Footer() {
    return (
        <footer className="border-t border-line py-16 bg-surface-2 mt-0">
            <div className="max-w-[1400px] mx-auto px-6">
                <Reveal>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
                        <div className="md:col-span-2">
                            <Link to="/" className="font-heading font-extrabold text-2xl tracking-tight mb-4 inline-block text-ink">
                                Верум<span className="text-accent">.</span>
                            </Link>
                            <p className="text-[14px] text-ink-3 max-w-[38ch] leading-relaxed mb-5 font-medium">
                                Платформа проверенных IT-специалистов. Навыки
                                подтверждаются анализом архитектурного мышления.
                            </p>
                            <div className="text-[13px] text-ink-3 font-semibold">
                                Москва · удалённо по России и СНГ
                            </div>
                        </div>
                        <div>
                            <h5 className="text-[12px] font-bold uppercase tracking-wider text-ink-4 mb-5 font-heading">
                                Клиентам
                            </h5>
                            <Link to="/clients" className="block text-[14px] font-medium text-ink-2 py-1.5 hover:text-accent transition-colors">
                                Для компаний
                            </Link>
                            <Link to="/pricing" className="block text-[14px] font-medium text-ink-2 py-1.5 hover:text-accent transition-colors">
                                Как зарабатываем
                            </Link>
                            <Link to="/cases" className="block text-[14px] font-medium text-ink-2 py-1.5 hover:text-accent transition-colors">
                                Кейсы
                            </Link>
                        </div>
                        <div>
                            <h5 className="text-[12px] font-bold uppercase tracking-wider text-ink-4 mb-5 font-heading">
                                Специалистам
                            </h5>
                            <Link to="/specialists" className="block text-[14px] font-medium text-ink-2 py-1.5 hover:text-accent transition-colors">
                                Для специалистов
                            </Link>
                            <Link to="/how" className="block text-[14px] font-medium text-ink-2 py-1.5 hover:text-accent transition-colors">
                                Как работает
                            </Link>
                            <Link to="/blog" className="block text-[14px] font-medium text-ink-2 py-1.5 hover:text-accent transition-colors">
                                Блог
                            </Link>
                        </div>
                    </div>
                </Reveal>
                <div className="pt-8 border-t border-line/50 flex justify-between items-center text-[13px] font-medium text-ink-3 flex-wrap gap-4">
                    <span>© 2026 Верум. Все права защищены.</span>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-ink transition-colors">Политика конфиденциальности</Link>
                        <Link to="/terms" className="hover:text-ink transition-colors">Оферта</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
