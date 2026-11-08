import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Loader2, UploadCloud, Banknote, Briefcase } from "lucide-react";
import { authApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";

export function EditProfileModal({
 onClose, backendUser, onRefresh }: { onClose: () => void, backendUser: any, onRefresh: () => void }) {

  const [bio, setBio] = useState(backendUser?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState(backendUser?.avatar_url || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expectedSalary, setExpectedSalary] = useState(backendUser?.expected_salary ? backendUser.expected_salary.toLocaleString("ru-RU") : "");
  const [projectRate, setProjectRate] = useState(backendUser?.project_rate ? backendUser.project_rate.toLocaleString("ru-RU") : "");
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Показываем предпросмотр
    }
  };

  const getMaxSalary = () => {
    const grade = backendUser?.skills?.final_grade;
    if (grade === "Junior") return 90000;
    if (grade === "Middle") return 220000;
    if (grade === "Senior") return 350000;
    return 0;
  };
  const getMaxProjectRate = () => {
    const grade = backendUser?.skills?.final_grade;
    if (grade === "Junior") return 30000;
    if (grade === "Middle") return 80000;
    if (grade === "Senior") return 150000;
    return 0;
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setExpectedSalary(raw ? parseInt(raw).toLocaleString("ru-RU") : "");
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setProjectRate(raw ? parseInt(raw).toLocaleString("ru-RU") : "");
  };

  const handleSave = async () => {
    const rawSalary = expectedSalary.replace(/\D/g, "");
    const valSalary = rawSalary ? parseInt(rawSalary) : null;
    if (valSalary && valSalary > getMaxSalary()) {
      toast(`Максимальная зарплата для ${backendUser?.skills?.final_grade || "вашего грейда"} — ${getMaxSalary().toLocaleString('ru-RU')} ₽`, "error");
      return;
    }

    const rawRate = projectRate.replace(/\D/g, "");
    const valRate = rawRate ? parseInt(rawRate) : null;
    if (valRate && valRate > getMaxProjectRate()) {
      toast(`Максимальная цена кейса для ${backendUser?.skills?.final_grade || "вашего грейда"} — ${getMaxProjectRate().toLocaleString('ru-RU')} ₽`, "error");
      return;
    }

    setLoading(true);
    try {
      let finalAvatarUrl = avatarPreview;
      if (selectedFile) {
        const uploadRes = await authApi.uploadAvatar(selectedFile);
        finalAvatarUrl = uploadRes.url;
      }
      await authApi.updateProfile({ 
        bio, 
        avatar_url: finalAvatarUrl,
        expected_salary: valSalary,
        project_rate: valRate
      });
      toast("Профиль обновлен", "success");
      onRefresh();
      onClose();
    } catch (e: any) {
      toast(e.message || "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };
    setLoading(true);
    try {
      let finalAvatarUrl = avatarPreview;

      // 1. Если выбран новый файл — загружаем его
      if (selectedFile) {
        const uploadRes = await authApi.uploadAvatar(selectedFile);
        finalAvatarUrl = uploadRes.url;
      }

      // 2. Сохраняем остальные данные (био)
      await authApi.updateProfile({ bio });
      
      toast("Профиль обновлен", "success");
      onRefresh();
      onClose();
    } catch (e: any) {
      toast(e.message || "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-line rounded-2xl p-4 sm:p-6 w-full max-w-[calc(100vw-2rem)] sm:max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-ink-3 hover:text-ink"><X size={20} /></button>
        <h2 className="text-xl font-bold mb-4">Редактировать профиль</h2>
        
        <div className="space-y-4 mb-6">
          {/* Загрузка аватара */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-surface-2 border border-line overflow-hidden flex-shrink-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-4"><UploadCloud size={24} /></div>
              )}
            </div>
            <div>
              <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-surface-2 border border-line rounded-lg text-sm font-medium hover:bg-surface-3 transition-colors">
                Выбрать фото
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <p className="text-[11px] text-ink-3 mt-2">JPG, PNG или GIF</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">О себе</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full bg-bg-2 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 placeholder:text-ink-4" placeholder="Расскажите о своем опыте..." />
          </div>

          {/* Цены (только если есть навыки) */}
          {backendUser?.skills?.final_grade && backendUser.skills.final_grade !== "Reject" && (
            <div className="bg-surface-2 border border-line rounded-xl p-4 space-y-4">
              <div className="text-[12px] font-semibold text-ink-3 uppercase tracking-wider mb-2">Ваши ставки</div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center gap-2 text-ink-2">
                  <Banknote size={14} className="text-accent"/> Желаемая зарплата (в месяц)
                </label>
                <div className="flex items-center bg-bg-2 border border-line rounded-lg px-3 py-2 focus-within:border-accent transition-colors">
                  <input 
                    type="text" 
                    value={expectedSalary} 
                    onChange={handleSalaryChange} 
                    className="w-full bg-transparent outline-none text-sm font-semibold"
                    placeholder={`Авто (макс. ${getMaxSalary().toLocaleString('ru-RU')} ₽)`}
                  />
                  <span className="text-ink-3 ml-2 font-medium">₽</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center gap-2 text-ink-2">
                  <Briefcase size={14} className="text-accent"/> Стоимость кейса (за проект)
                </label>
                <div className="flex items-center bg-bg-2 border border-line rounded-lg px-3 py-2 focus-within:border-accent transition-colors">
                  <input 
                    type="text" 
                    value={projectRate} 
                    onChange={handleRateChange} 
                    className="w-full bg-transparent outline-none text-sm font-semibold"
                    placeholder={`Авто (макс. ${getMaxProjectRate().toLocaleString('ru-RU')} ₽)`}
                  />
                  <span className="text-ink-3 ml-2 font-medium">₽</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg font-medium hover:bg-surface-2 transition-colors">Отмена</button>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-2 transition-colors flex items-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />} Сохранить
          </button>
        </div>
      </motion.div>
    </div>
  );
}
