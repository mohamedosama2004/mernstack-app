import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { RateLimitProvider } from "./context/RateLimitContext";
import ThemeToggle from "./components/ThemeToggle";
import RateLimitBanner from "./components/RateLimitBanner";
import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";

const App = () => {
  const location = useLocation();
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    document.body.classList.toggle("light-theme", !dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toastStyle = dark
    ? {
        background: "#141414",
        color: "#fafafa",
        border: "1px solid #262626",
      }
    : {
        background: "#ffffff",
        color: "#0a0a0a",
        border: "1px solid #e5e5e5",
      };

  return (
    <RateLimitProvider>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            ...toastStyle,
            borderRadius: "12px",
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
      <nav className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 bg-navbar-bg backdrop-blur-xl border-b border-border sm:px-10 sm:py-4">
        <Link
          to="/"
          className="text-lg font-extrabold tracking-tighter uppercase text-text"
        >
          Note<span className="font-normal text-text-dim">Pad</span>
        </Link>
        <ThemeToggle dark={dark} setDark={setDark} />
      </nav>
      <RateLimitBanner />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/note/:id" element={<DetailsPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/note/:id/edit" element={<EditPage />} />
        </Routes>
      </AnimatePresence>
    </RateLimitProvider>
  );
};

export default App;
