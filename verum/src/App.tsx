import { useEffect } from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Drawer } from "@/components/layout/Sidebar";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { ChatPanel } from "@/components/layout/ChatPanel";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { BackToTop } from "@/components/layout/BackToTop";
import { ToastContainer } from "@/components/layout/ToastContainer";
import { useAppStore } from "@/store/useAppStore";

// Pages
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
import { Messages } from "@/pages/Messages";
import { PublicProfile } from "@/pages/PublicProfile";

function Layout() {
  const location = useLocation();
  
  // Скрываем футер на странице чатов, чтобы освободить место
  const isMessagesPage = location.pathname === "/messages";

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      
      {/* Плавная анимация появления без скачков по Y */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 15, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 25,
          mass: 0.8
        }}
        className="flex-1 flex flex-col relative"
      >
        <Outlet />
      </motion.main>

      {/* Показываем футер везде, кроме чатов */}
      {!isMessagesPage && <Footer />}
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
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

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
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile/:id" element={<PublicProfile />} />
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
