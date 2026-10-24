import { useState, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { UploadCloud, X, Camera } from "lucide-react";
import { toast } from "@/components/layout/ToastContainer";

const COLORS = [
  { id: "accent", bg: "bg-[#1e4d3a]" },
  { id: "blue", bg: "bg-[#2563eb]" },
  { id: "violet", bg: "bg-[#7c3aed]" },
  { id: "amber", bg: "bg-[#d97706]" },
  { id: "rose", bg: "bg-[#e11d48]" },
];

export function EditProfileModal({ onClose }: { onClose: () => void }) {
  const { user, profile, updateProfile } = useAppStore();
  const [bio, setBio] = useState(profile.bio);
  const [color, setColor] = useState(profile.avatarColor || "accent");
  const [image, setImage] = useState(profile.avatarImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateProfile({ bio, avatarColor: color, avatarImage: image });
    onClose();
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast("Выберите изображение");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const initials = user?.name?.substring(0, 2).toUpperCase() || "МК";
  const currentColor = COLORS.find(c => c.id === color)?.bg || COLORS[0].bg;

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Редактировать профиль</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-ink-2">Аватар</label>
          <div className="flex items-center gap-6">
            
            {/* Аватар с кликом для загрузки */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full overflow-hidden shadow-md border-2 border-surface shrink-0 group cursor-pointer"
            >
              {image ? (
                <img src={image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-white font-semibold text-2xl ${currentColor}`}>
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
            />

            <div>
              <div className="text-sm font-medium mb-3">Или выберите цвет фона</div>
              <div className="flex gap-2.5">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setColor(c.id); setImage(""); }}
                    className={`w-9 h-9 rounded-full ${c.bg} ${color === c.id && !image ? "ring-2 ring-offset-2 ring-ink scale-110" : "opacity-70 hover:opacity-100 hover:scale-105"} transition-all duration-200 shadow-sm`}
                  />
                ))}
              </div>
              {image && (
                <button 
                  onClick={() => setImage("")} 
                  className="text-[13px] text-red-500 hover:underline mt-3 flex items-center gap-1"
                >
                  <X size={14} /> Сбросить фото
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-ink-2">О себе</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Расскажите о своем опыте, стеке и достижениях..."
            className="w-full border border-line-2 rounded-xl p-3.5 text-[15px] bg-surface outline-none focus:border-accent transition-all min-h-[120px] resize-y"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button variant="accent" onClick={handleSave}>Сохранить</Button>
        </div>
      </div>
    </Modal>
  );
}
