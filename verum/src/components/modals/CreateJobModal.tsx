import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles, ChevronDown, Check } from "lucide-react";
import { authApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";

const STACKS = ["Frontend", "Backend", "Fullstack", "Mobile", "DevOps", "Data / ML"];
const LEVELS = ["Junior", "Middle", "Senior"];
const FORMATS = ["Удалённо", "Гибрид", "Офис"];

export function CreateJobModal({ onClose, backendUser, onRefresh, jobToEdit }: { onClose: () => void, backendUser: any, onRefresh: () => void, jobToEdit?: any }) {
  const isEditing = !!jobToEdit;
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stack, setStack] = useState("Frontend");
  const [level, setLevel] = useState("Middle");
  const [format, setFormat] = useState("Удалённо");
  
  // Зарплата
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [openStack, setOpenStack] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);
  const [openFormat, setOpenFormat] = useState(false);

  // Блокировка скролла
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

  // Заполнение полей при редактировании
  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title || "");
      setDescription(jobToEdit.description || "");
      setStack(jobToEdit.stack || "Frontend");
      setLevel(jobToEdit.level || "Middle");
      setFormat(jobToEdit.format || "Удалённо");
      
      // Парсим старую зарплату
      const sal = jobToEdit.salary || "";
      if (sal.includes("договоренности") || sal === "") {
          setIsNegotiable(true);
      } else {
          const numbers = sal.match(/\d+/g);
          if (numbers && numbers.length >= 2) {
              setSalaryFrom(parseInt(numbers[0]).toLocaleString("ru-RU"));
              setSalaryTo(parseInt(numbers[1]).toLocaleString("ru-RU"));
          } else if (numbers && numbers.length === 1) {
              setSalaryFrom(parseInt(numbers[0]).toLocaleString("ru-RU"));
          }
      }
    }
  }, [jobToEdit]);

  const handleAiParse = async () => {
    if (!description.trim()) return toast("Сначала вставьте описание вакансии");
    setIsAiLoading(true);
    try {
      const res = await authApi.parseJob(description);
      if (res.data.title) setTitle(res.data.title);
      if (res.data.stack) setStack(res.data.stack);
      if (res.data.level) setLevel(res.data.level);
      if (res.data.format) setFormat(res.data.format);
      
      if (res.data.suggested_salary) {
        const num = parseInt(res.data.suggested_salary.replace(/\D/g, ''));
        if (!isNaN(num)) setSalaryFrom(num.toString());
      }
      toast("ИИ успешно разобрал вакансию!", "success");
    } catch (e: any) {
      toast(e.message || "Ошибка ИИ");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return toast("Введите название вакансии");
    setLoading(true);
    try {
      let finalSalary = "По договоренности";
      if (!isNegotiable) {
          const cleanFrom = salaryFrom.replace(/\D/g, "");
          const cleanTo = salaryTo.replace(/\D/g, "");
          if (cleanFrom && cleanTo) finalSalary = `от ${cleanFrom} до ${cleanTo} ₽`;
          else if (cleanFrom) finalSalary = `от ${cleanFrom} ₽`;
          else if (cleanTo) finalSalary = `до ${cleanTo} ₽`;
          else finalSalary = "По договоренности";
      }

      const currentJobs = backendUser?.job_postings || [];
      
      if (isEditing) {
        const updatedJobs = currentJobs.map((j: any) => 
          j.id === jobToEdit.id ? { ...j, title, description, stack, level, salary: finalSalary, format } : j
        );
        await authApi.updateJobs(updatedJobs);
        toast("Вакансия обновлена", "success");
      } else {
        const newJob = { id: Date.now().toString(), title, description, stack, level, salary: finalSalary, format };
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-line rounded-[22px] p-4 sm:p-6 w-full max-w-[calc(100vw-2rem)] sm:max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 text-ink-3 hover:text-ink"><X size={20} /></button>
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Редактировать вакансию" : "Создать вакансию"}</h2>
        
        <div className="space-y-4 mb-6">
          <div className="relative">
            <label className="text-sm font-medium mb-1 flex justify-between items-end">
              <span>Описание вакансии</span>
              <button onClick={handleAiParse} disabled={isAiLoading} className="text-xs font-semibold text-accent hover:text-accent-2 flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-md transition-colors">
                {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Определить автоматически
              </button>
            </label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-bg-2 border border-transparent focus:border-accent rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-accent transition-colors placeholder:text-ink-4" placeholder="Скопируйте сюда текст вакансии..." />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Название вакансии</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-bg-2 border border-transparent focus:border-accent rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-accent transition-colors" placeholder="Например: Senior React Developer" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="text-sm font-medium mb-1 block">Стек</label>
              <button onClick={() => { setOpenStack(!openStack); setOpenLevel(false); setOpenFormat(false); }} className="w-full bg-bg-2 border border-transparent hover:border-line-2 rounded-xl p-3 text-sm text-left flex justify-between items-center transition-colors">
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
              <label className="text-sm font-medium mb-1 block">Уровень</label>
              <button onClick={() => { setOpenLevel(!openLevel); setOpenStack(false); setOpenFormat(false); }} className="w-full bg-bg-2 border border-transparent hover:border-line-2 rounded-xl p-3 text-sm text-left flex justify-between items-center transition-colors">
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

          <div className="relative">
            <label className="text-sm font-medium mb-1 block">Формат</label>
            <button onClick={() => { setOpenFormat(!openFormat); setOpenStack(false); setOpenLevel(false); }} className="w-full bg-bg-2 border border-transparent hover:border-line-2 rounded-xl p-3 text-sm text-left flex justify-between items-center transition-colors">
              {format} <ChevronDown size={16} className={`transition-transform duration-200 ${openFormat ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {openFormat && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 mt-1.5 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 max-h-48 overflow-y-auto custom-scrollbar">
                  {FORMATS.map(f => (
                    <button key={f} onClick={() => { setFormat(f); setOpenFormat(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex items-center justify-between transition-colors text-ink-2">
                      {f} {format === f && <Check size={14} className="text-accent" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium block">Зарплата (₽)</label>
              
              {/* Кастомный чекбокс */}
              <button 
                type="button"
                onClick={() => setIsNegotiable(!isNegotiable)}
                className="flex items-center gap-2 group cursor-pointer py-2 -my-2"
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isNegotiable ? 'bg-accent border-accent' : 'border-line-2 group-hover:border-accent bg-surface'}`}>
                  {isNegotiable && <Check size={14} className="text-white" />}
                </div>
                <span className={`text-[13px] transition-colors ${isNegotiable ? 'text-ink font-medium' : 'text-ink-3 group-hover:text-ink'}`}>По договоренности</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <input 
                value={salaryFrom} 
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setSalaryFrom(raw ? parseInt(raw).toLocaleString("ru-RU") : "");
                }} 
                disabled={isNegotiable}
                className="w-full bg-bg-2 border border-transparent focus:border-accent rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-accent/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed" 
                placeholder="От" 
              />
              <span className="text-ink-3 font-medium text-center sm:text-left hidden sm:block">—</span>
              <span className="text-ink-3 font-medium text-center block sm:hidden text-xs my-1">до</span>
              <input 
                value={salaryTo} 
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setSalaryTo(raw ? parseInt(raw).toLocaleString("ru-RU") : "");
                }} 
                disabled={isNegotiable}
                className="w-full bg-bg-2 border border-transparent focus:border-accent rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-accent/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed" 
                placeholder="До" 
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-line">
          <button onClick={onClose} className="px-4 py-2 rounded-xl font-medium hover:bg-surface-2 transition-colors">Отмена</button>
          <button onClick={handleSave} disabled={loading} className="px-5 py-2 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors flex items-center gap-2 shadow-lg">
            {loading && <Loader2 size={16} className="animate-spin" />} {isEditing ? "Сохранить" : "Опубликовать"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
