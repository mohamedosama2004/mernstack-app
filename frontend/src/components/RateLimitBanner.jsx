import { motion, AnimatePresence } from "framer-motion";
import { useRateLimit } from "../context/RateLimitContext";

const RateLimitBanner = () => {
  const { rateLimited, remaining } = useRateLimit();

  return (
    <AnimatePresence>
      {rateLimited && (
        <motion.div
          className="overflow-hidden"
          initial={{ opacity: 0, y: -16, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -16, height: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mx-5 py-3.5 px-5 bg-danger-dim border border-red-500/20 rounded-xl overflow-hidden sm:mx-10">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-danger"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-[13px] font-medium text-text-muted">
              Too many requests. Please wait{" "}
              <span className="font-bold text-danger tabular-nums">
                {remaining}s
              </span>{" "}
              before trying again.
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RateLimitBanner;
