import { Modal } from "@/components/ui/Modal";
import { Briefcase, Banknote, MapPin, Layers } from "lucide-react";

export function ViewJobModal({ job, companyName, onClose }: { job: any; companyName: string; onClose: () => void }) {
    return (
        <Modal onClose={onClose} size="md">
            <div className="p-6 sm:p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2 pr-6">{job.title}</h2>
                    <div className="text-ink-3 font-medium">{companyName}</div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-line">
                    {job.salary && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-sm font-semibold">
                            <Banknote size={16} /> {job.salary}
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-line text-ink-2 rounded-lg text-sm">
                        <Layers size={16} /> {job.stack}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-line text-ink-2 rounded-lg text-sm">
                        <Briefcase size={16} /> {job.level}
                    </span>
                    {job.format && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-line text-ink-2 rounded-lg text-sm">
                            <MapPin size={16} /> {job.format}
                        </span>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Описание вакансии</h3>
                    <p className="text-[15px] leading-relaxed text-ink-2 whitespace-pre-line">
                        {job.description || "Описание не указано."}
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-line flex justify-end">
                    <button onClick={onClose} className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors">
                        Закрыть
                    </button>
                </div>
            </div>
        </Modal>
    );
}
