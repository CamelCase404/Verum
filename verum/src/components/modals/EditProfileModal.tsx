import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Loader2, UploadCloud } from "lucide-react";
import { authApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";

export function EditProfileModal({
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);
 onClose, backendUser, onRefresh }: { onClose: () => void, backendUser: any, onRefresh: () => void }) {
  const [bio, setBio] = useState(backendUser?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState(backendUser?.avatar_url || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Показываем предпросмотр
    }
  };

  const handleSave = async () => {
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
      
      toast("Профиль обновлен");
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
