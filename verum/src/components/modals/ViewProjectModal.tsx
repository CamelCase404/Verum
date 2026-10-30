import { motion } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";

export function ViewProjectModal({ project, onClose }: { project: any; onClose: () => void }) {
    const allImages = project.images || (project.cover ? [project.cover] : []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface border border-line rounded-2xl w-full max-w-4xl shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
            >
                <div className="p-4 border-b border-line flex justify-between items-center bg-surface-2">
                    <h2 className="font-bold text-lg">{project.title}</h2>
                    <button onClick={onClose} className="text-ink-3 hover:text-ink p-1">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6">
                    <p className="text-ink-2 text-sm whitespace-pre-line leading-relaxed">
                        {project.description || "Описание отсутствует"}
                    </p>
                    
                    {allImages.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {allImages.map((img: string, idx: number) => (
                                <a 
                                    href={img} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    key={idx} 
                                    className="rounded-xl overflow-hidden border border-line hover:opacity-90 transition-opacity aspect-video bg-bg-2 flex items-center justify-center"
                                >
                                    <img src={img} alt={`Фото ${idx+1}`} className="w-full h-full object-cover" />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 border border-dashed border-line-2 rounded-xl bg-surface-2">
                            <ImageIcon size={32} className="mx-auto text-ink-4 mb-2" />
                            <p className="text-[13px] text-ink-3">К этому проекту не прикреплены фотографии.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
