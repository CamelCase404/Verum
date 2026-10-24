import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/Reveal";

export function Footer() {
  return (
    <footer className="border-t border-line py-14 bg-surface-2 mt-10">
      <div className="wrap">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2">
              <Link to="/" className="font-bold text-xl tracking-tight mb-3.5 inline-block">
                Верум<span className="text-accent">.</span>
              </Link>
              <p className="text-[13.5px] text-ink-3 max-w-[34ch] leading-relaxed mb-4">
                Платформа проверенных IT-специалистов. Навыки подтверждаются анализом архитектурного мышления.
              </p>
              <div className="text-[12.5px] text-ink-3">Москва · удалённо по России и СНГ</div>
            </div>
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-ink-3 mb-4">Клиентам</h5>
              <Link to="/clients" className="block text-[13.5px] text-ink-2 py-1.5 hover:text-ink transition-colors">Для компаний</Link>
              <Link to="/pricing" className="block text-[13.5px] text-ink-2 py-1.5 hover:text-ink transition-colors">Как зарабатываем</Link>
              <Link to="/cases" className="block text-[13.5px] text-ink-2 py-1.5 hover:text-ink transition-colors">Кейсы</Link>
            </div>
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-ink-3 mb-4">Специалистам</h5>
              <Link to="/specialists" className="block text-[13.5px] text-ink-2 py-1.5 hover:text-ink transition-colors">Для специалистов</Link>
              <Link to="/how" className="block text-[13.5px] text-ink-2 py-1.5 hover:text-ink transition-colors">Как работает</Link>
              <Link to="/blog" className="block text-[13.5px] text-ink-2 py-1.5 hover:text-ink transition-colors">Блог</Link>
            </div>
          </div>
        </Reveal>
        <div className="pt-7 border-t border-line flex justify-between items-center text-[12.5px] text-ink-3 flex-wrap gap-3">
          <span>© 2025 Верум. Все права защищены.</span>
        </div>
      </div>
    </footer>
  );
}
