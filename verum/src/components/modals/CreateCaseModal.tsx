import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles, ChevronDown, Check } from "lucide-react";
import { authApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";

const STACKS = ["Mobile (iOS)", "Mobile (Android)", "Frontend", "Backend", "GameDev", "DevOps / SRE", "Data / ML"];
const LEVELS = ["Junior", "Middle", "Senior"];

export function CreateCaseModal({ onClose, backendUser, onRefresh }: { onClose: () => void, backendUser: any, onRefresh: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stack, setStack] = useState("Frontend");
  const [level, setLevel] = useState("Middle");
  const [budget, setBudget] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [openStack, setOpenStack] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);

  useEffect(() => {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      return () => {
          const scrollY = document.body.style.top;
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          document.body.style.overflow = '';
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
  }, []);

  const handleAiParse = async () => {
    if (!description.trim()) return toast("Сначала вставьте описание задачи");
    setIsAiLoading(true);
    try {
      const res = await authApi.parseJob(description); // Тот же парсер, что и для вакансий
      if (res.data.title) setTitle(res.data.title);
      if (res.data.stack) setStack(res.data.stack);
      if (res.data.level) setLevel(res.data.level);
      toast("ИИ успешно разобрал задачу!", "success");
    } catch (e: any) {
      toast(e.message || "Ошибка ИИ");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return toast("Введите название кейса");
    setLoading(true);
    try {
      const currentJobs = backendUser?.job_postings || [];
      const newCase = { 
          id: Date.now().toString(), 
          title, 
          description, 
          stack, 
          level, 
          salary: budget ? `Бюджет: ${budget} ₽` : "По договоренности", 
          format: "Удалённо (кейс)",
          type: "case" // Отличаем кейс от вакансии
      };
      await authApi.updateJobs([...currentJobs, newCase]);
      toast("Кейс опубликован", "success");
      onRefresh();
      onClose();
    } catch (e: any) {
      toast(e.message || "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-line rounded-[22px] p-4 sm:p-6 w-full max-w-[calc(100vw-2rem)] sm:max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 text-ink-3 hover:text-ink"><X size={20} /></button>
        <h2 className="text-xl font-bold mb-4">Создать кейс</h2>
        
        <div className="space-y-4 mb-6">
          <div className="relative">
            <label className="text-sm font-medium mb-1 flex justify-between items-end">
              <span>Описание задачи</span>
              <button onClick={handleAiParse} disabled={isAiLoading} className="text-xs font-semibold text-accent hover:text-accent-2 flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-md transition-colors">
                {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Определить автоматически
              </button>
            </label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-bg-2 border border-transparent focus:border-accent rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-accent transition-colors placeholder:text-ink-4" placeholder="Опишите, что нужно сделать..." />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Название кейса</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-bg-2 border border-transparent focus:border-accent rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-accent transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="text-sm font-medium mb-1 block">Стек</label>
              <button onClick={() => { setOpenStack(!openStack); setOpenLevel(false); }} className="w-full bg-bg-2 border border-transparent hover:border-line-2 rounded-xl p-3 text-sm text-left flex justify-between items-center transition-colors">
                {stack} <ChevronDown size={16} className={`transition-transform duration-200 ${openStack ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openStack && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 mt-1.5 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 max-h-48 overflow-y-auto custom-scrollbar">
                    {STACKS.map(s => (
                      <button key={s} onClick={() => { setStack(s); setOpenStack(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex items-center justify-between transition-colors text-ink-2">
                        {s} {stack === s && <Check size={14} className="text-accent" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <label className="text-sm font-medium mb-1 block">Требуемый уровень</label>
              <button onClick={() => { setOpenLevel(!openLevel); setOpenStack(false); }} className="w-full bg-bg-2 border border-transparent hover:border-line-2 rounded-xl p-3 text-sm text-left flex justify-between items-center transition-colors">
                {level} <ChevronDown size={16} className={`transition-transform duration-200 ${openLevel ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openLevel && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 mt-1.5 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 max-h-48 overflow-y-auto custom-scrollbar">
                    {LEVELS.map(l => (
                      <button key={l} onClick={() => { setLevel(l); setOpenLevel(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex items-center justify-between transition-colors text-ink-2">
                        {l} {level === l && <Check size={14} className="text-accent" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Бюджет (₽)</label>
            <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Например: 50 000" className="w-full bg-bg-2 border border-transparent focus:border-accent rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-accent transition-colors" />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-line">
          <button onClick={onClose} className="px-4 py-2 rounded-xl font-medium hover:bg-surface-2 transition-colors">Отмена</button>
          <button onClick={handleSave} disabled={loading} className="px-5 py-2 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors flex items-center gap-2 shadow-lg">
            {loading && <Loader2 size={16} className="animate-spin" />} Опубликовать
          </button>
        </div>
      </motion.div>
    </div>
  );
}
