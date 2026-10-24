import { useEffect } from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Drawer } from "@/components/layout/Sidebar";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { ChatPanel } from "@/components/layout/ChatPanel";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { BackToTop } from "@/components/layout/BackToTop";
import { ToastContainer } from "@/components/layout/ToastContainer";
import { useAppStore } from "@/store/useAppStore";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Landing } from "@/pages/Landing";
import { About } from "@/pages/About";
import { How } from "@/pages/How";
import { Levels } from "@/pages/Levels";
import { Pricing } from "@/pages/Pricing";
import { Clients } from "@/pages/Clients";
import { Specialists } from "@/pages/Specialists";
import { Faq } from "@/pages/Faq";
import { Blog } from "@/pages/Blog";
import { Contacts } from "@/pages/Contacts";
import { Terms } from "@/pages/Terms";
import { Privacy } from "@/pages/Privacy";
import { Cases } from "@/pages/Cases";
import { Partners } from "@/pages/Partners";
import { Press } from "@/pages/Press";
import { Careers } from "@/pages/Careers";
import { Status } from "@/pages/Status";
import { Help } from "@/pages/Help";
import { Changelog } from "@/pages/Changelog";
import { Roadmap } from "@/pages/Roadmap";
import RegisterPage from "@/pages/Register";
import LoginPage from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import { Dashboard } from "@/pages/Dashboard";

function Layout() {
  const location = useLocation();
  useScrollReveal(location.pathname);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.16, 0.84, 0.44, 1] }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default function App() {
  const theme = useAppStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none z-[9999] w-full h-full" />
      <Routes>
        {/* Auth Routes (без шапки и подвала) */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Main App Routes (с шапкой и подвалом) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/how" element={<How />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/specialists" element={<Specialists />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/press" element={<Press />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/status" element={<Status />} />
          <Route path="/help" element={<Help />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      
      <Drawer />
      <NotificationPanel />
      <ChatPanel />
      <CommandPalette />
      <BackToTop />
      <ToastContainer />
    </>
  );
}
