import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { authApi, setToken } from "@/api";
import { ArrowLeft, ShieldCheck, Loader2, Mail, Lock, Github } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };
const slideLeft = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const slideRight = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } } };
const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function LoginPage() {
    const setUser = useAppStore((s) => s.setUser);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [githubLoading, setGithubLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await authApi.login(email, password);
            setToken(res.data.access_token);
            const me = await authApi.getMe();
            setUser({ name: me.data.full_name, email: me.data.email, role: me.data.role });
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Ошибка входа");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4 sm:p-8 font-sans text-ink relative">
            <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate("/")} className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-sm font-medium text-ink-2 hover:text-accent transition-colors bg-surface/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm z-20">
                <ArrowLeft size={16} /> <span className="hidden sm:inline">Вернуться на сайт</span>
            </motion.button>

            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="w-full max-w-4xl bg-surface rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row md:min-h-[600px] relative z-10 border border-line mt-12 md:mt-0">
                <motion.div variants={slideLeft} className="w-full md:w-[45%] bg-accent p-8 md:p-10 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }} className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl mx-auto flex items-center justify-center mb-4 md:mb-6 backdrop-blur-sm border border-white/20">
                            <ShieldCheck size={28} className="md:w-8 md:h-8" />
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">С возвращением!</h2>
                        <p className="text-[13px] md:text-sm text-white/80 leading-relaxed px-2 md:px-4">
                            Чтобы оставаться с нами на связи, пожалуйста, войдите, используя свои личные данные.
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={slideRight} className="w-full md:w-[55%] p-6 sm:p-12 flex flex-col justify-center bg-surface">
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Вход в Verum</h1>
                        <p className="text-xs text-ink-3 mt-2">Используйте свой email и пароль</p>
                    </div>

                    <motion.form variants={staggerContainer} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-4">
                        <motion.div variants={fadeUp} className="relative">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full bg-bg-2 border-none rounded-lg px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition-all placeholder:text-ink-4" />
                            <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-4" />
                        </motion.div>
                        <motion.div variants={fadeUp} className="relative">
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Пароль" className="w-full bg-bg-2 border-none rounded-lg px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition-all placeholder:text-ink-4" />
                            <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-4" />
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div key="error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-warn text-xs bg-warn-soft border border-warn/20 p-3 rounded-lg overflow-hidden text-center">
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="pt-2 flex flex-col items-center gap-4">
                            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} className="bg-accent text-white font-semibold py-3 px-10 rounded-full hover:bg-accent-2 transition-colors duration-300 shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 text-sm uppercase tracking-wider w-full sm:w-auto">
                                {loading ? <><Loader2 size={16} className="animate-spin" /> Загрузка...</> : "Войти"}
                            </motion.button>
                            <div className="text-sm text-ink-3 mt-2">
                                Нет аккаунта? <Link to="/register" className="text-accent font-semibold hover:underline">Зарегистрироваться</Link>
                            </div>
                        </div>
                    </motion.form>

                    <div className="mt-6 md:mt-8">
                        <div className="flex items-center gap-3 mb-4 md:mb-5">
                            <div className="flex-1 h-px bg-line" />
                            <span className="text-[11px] text-ink-3 uppercase tracking-widest">или</span>
                            <div className="flex-1 h-px bg-line" />
                        </div>
                        <div className="flex justify-center">
                            <button 
                                onClick={() => {
                                    setGithubLoading(true);
                                    window.location.href = "http://localhost:8000/api/auth/github";
                                }}
                                disabled={githubLoading}
                                className="w-12 h-12 rounded-full border border-line flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface-2 hover:border-line-2 transition-all shadow-sm disabled:opacity-50" 
                                title="Войти через GitHub"
                            >
                                {githubLoading ? <Loader2 size={22} className="animate-spin text-accent" /> : <Github size={22} />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
