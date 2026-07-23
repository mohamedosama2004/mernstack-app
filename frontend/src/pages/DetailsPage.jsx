import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRateLimit } from "../context/RateLimitContext";
import { formatDateLong, wordCount } from "../lib/utils";

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const { triggerRateLimit } = useRateLimit();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/${id}`);
        if (res.status === 429) {
          triggerRateLimit();
          setLoading(false);
          return;
        }
        if (!res.ok) {
          navigate("/");
          return;
        }
        const data = await res.json();
        setNote(data);
      } catch (err) {
        console.error("Failed to fetch note:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, navigate, triggerRateLimit]);

  useEffect(() => {
    if (note && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.2 }
      );
    }
  }, [note]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/notes/${note._id}`, { method: "DELETE" });
      if (res.status === 429) {
        triggerRateLimit();
        return;
      }
      navigate("/");
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-border border-t-text rounded-full animate-[spin_0.6s_linear_infinite]" />
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="max-w-[900px] w-full mx-auto px-4 py-6 pb-[60px] sm:px-6 sm:py-10 sm:pb-20">
      <div className="max-w-[700px] mx-auto">
        <Link to="/">
          <motion.span
            className="inline-flex items-center gap-1.5 text-text-muted text-[13px] font-medium mb-8 transition-colors duration-200 hover:text-text"
            whileHover={{ x: -3 }}
            transition={{ duration: 0.15 }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to notes
          </motion.span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-3 mb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <h1 className="text-[26px] sm:text-[36px] font-extrabold tracking-tighter leading-tight">
              {note.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 pb-6 border-b border-border">
            <span className="text-xs font-medium text-text-dim uppercase tracking-wider">
              Created {formatDateLong(note.createdAt)}
            </span>
            {note.updatedAt && note.updatedAt !== note.createdAt && (
              <>
                <span className="w-[3px] h-[3px] bg-text-dim rounded-full" />
                <span className="text-xs font-medium text-text-dim uppercase tracking-wider">
                  Updated {formatDateLong(note.updatedAt)}
                </span>
              </>
            )}
            <span className="w-[3px] h-[3px] bg-text-dim rounded-full" />
            <span className="text-xs font-medium text-text-dim uppercase tracking-wider">
              {wordCount(note.content)} words
            </span>
          </div>

          <div
            ref={contentRef}
            className="text-[15px] leading-[1.85] text-text-muted whitespace-pre-wrap break-words"
          >
            {note.content}
          </div>

          <div className="flex gap-3 mt-12 pt-6 border-t border-border">
            <Link to={`/note/${note._id}/edit`}>
              <motion.button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap bg-transparent text-text-muted border border-border hover:text-text hover:border-border-hover hover:bg-accent-dim"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </motion.button>
            </Link>
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap bg-danger-dim text-danger border border-transparent hover:bg-danger hover:text-white"
              onClick={handleDelete}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
              Delete
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DetailsPage;
