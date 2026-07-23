import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useRateLimit } from "../context/RateLimitContext";
import { formatDateShort } from "../lib/utils";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);
  const { triggerRateLimit } = useRateLimit();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes");
        if (res.status === 429) {
          triggerRateLimit();
          setLoading(false);
          return;
        }
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [triggerRateLimit]);

  useEffect(() => {
    if (!loading && notes.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-card]");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
        }
      );
    }
  }, [loading, notes]);

  const handleDelete = async (e, noteId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
      if (res.status === 429) {
        triggerRateLimit();
        return;
      }
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const handleEdit = (e, noteId) => {
    e.stopPropagation();
    navigate(`/note/${noteId}/edit`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-border border-t-text rounded-full animate-[spin_0.6s_linear_infinite]" />
      </div>
    );
  }

  return (
    <div className="max-w-[900px] w-full mx-auto px-4 py-6 pb-[60px] sm:px-6 sm:py-10 sm:pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-start gap-4 mb-12 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-[28px] sm:text-[40px] font-extrabold tracking-tighter leading-tight">
            Notes
          </h1>
          <p className="text-text-muted text-sm mt-1.5 font-normal">
            {notes.length} {notes.length === 1 ? "note" : "notes"} total
          </p>
        </div>
        <Link to="/create">
          <motion.button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap bg-accent text-bg hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Note
          </motion.button>
        </Link>
      </motion.div>

      {notes.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-20 px-6 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="w-16 h-16 border-2 border-dashed border-border rounded-2xl flex items-center justify-center mb-6 text-text-dim">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 tracking-tight">No notes yet</h2>
          <p className="text-text-muted text-sm mb-6 max-w-[300px]">
            Create your first note to get started.
          </p>
          <Link to="/create">
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap bg-accent text-bg hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Note
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]"
        >
          {notes.map((note, index) => (
              <div
                key={note._id}
                data-card
                onClick={() => navigate(`/note/${note._id}`)}
                className="group relative flex flex-col p-6 min-h-[260px] overflow-hidden bg-surface border border-border rounded-2xl cursor-pointer transition-all duration-200 hover:border-border-hover hover:bg-surface-hover hover:-translate-y-0.5"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 dark:via-white/10 [&:not(.dark)]:via-black/[0.06]" />
                <span className="absolute top-4 right-4 text-[11px] font-semibold text-text-dim bg-accent-dim px-2 py-1 rounded-md">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-bold tracking-tight mb-2 leading-snug line-clamp-2">
                  {note.title}
                </h3>
                <p className="text-[13px] text-text-muted leading-relaxed flex-1 line-clamp-2">
                  {note.content}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 mb-4">
                  <span className="text-[11px] text-text-dim font-medium uppercase tracking-wider">
                    {formatDateShort(note.createdAt)}
                  </span>
                  {note.updatedAt && note.updatedAt !== note.createdAt && (
                    <>
                      <span className="w-[3px] h-[3px] bg-text-dim rounded-full" />
                      <span className="text-[11px] text-text-dim font-medium uppercase tracking-wider">
                        Updated {formatDateShort(note.updatedAt)}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <button
                    onClick={(e) => handleEdit(e, note._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200 bg-transparent text-text-muted border border-border hover:text-text hover:border-border-hover hover:bg-accent-dim"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, note._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200 bg-danger-dim text-danger border border-transparent hover:bg-danger hover:text-white"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
