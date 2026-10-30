import { Image as ImageIcon, ExternalLink } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export function ViewProjectModal({ project, onClose }: { project: any; onClose: () => void }) {
    const allImages = project.images || (project.cover ? [project.cover] : []);

    return (
        <Modal onClose={onClose} size="lg">
            <div className="flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-line bg-surface-2 flex justify-between items-center rounded-t-2xl">
                    <h2 className="font-bold text-xl text-ink pr-8">{project.title}</h2>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                    <p className="text-ink-2 text-[15px] whitespace-pre-line leading-relaxed">
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
                                    className="group relative rounded-xl overflow-hidden border border-line hover:border-accent/50 transition-colors aspect-video bg-bg-2 flex items-center justify-center"
                                >
                                    <img src={img} alt={`Фото ${idx+1}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <ExternalLink size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border border-dashed border-line-2 rounded-xl bg-surface-2">
                            <ImageIcon size={36} className="mx-auto text-ink-4 mb-3" />
                            <p className="text-[14px] text-ink-3">К этому проекту не прикреплены фотографии.</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
