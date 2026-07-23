import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import gsap from "gsap";
import toast from "react-hot-toast";
import { useRateLimit } from "../context/RateLimitContext";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const formRef = useRef(null);
  const { triggerRateLimit } = useRateLimit();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/${id}`);
        if (res.status === 429) {
          triggerRateLimit();
          setFetching(false);
          return;
        }
        if (!res.ok) {
          toast.error("Note not found");
          navigate("/");
          return;
        }
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
      } catch {
        toast.error("Failed to load note");
        navigate("/");
      } finally {
        setFetching(false);
      }
    };
    fetchNote();
  }, [id, navigate, triggerRateLimit]);

  useEffect(() => {
    if (!fetching && formRef.current) {
      const groups = formRef.current.querySelectorAll("[data-form-group]");
      gsap.fromTo(
        groups,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    }
  }, [fetching]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });
      if (res.status === 429) {
        triggerRateLimit();
        return;
      }
      if (res.ok) {
        toast.success("Note updated successfully");
        navigate(`/note/${id}`);
      } else {
        toast.error("Failed to update note");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-border border-t-text rounded-full animate-[spin_0.6s_linear_infinite]" />
      </div>
    );
  }

  return (
    <div className="max-w-[900px] w-full mx-auto px-4 py-6 pb-[60px] sm:px-6 sm:py-10 sm:pb-20">
      <div className="max-w-[600px] mx-auto">
        <Link to={`/note/${id}`}>
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
            Back to note
          </motion.span>
        </Link>

        <motion.h1
          className="text-2xl sm:text-[32px] font-extrabold tracking-tight mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Edit Note
        </motion.h1>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div data-form-group className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-2.5">
              Title
            </label>
            <input
              type="text"
              className="w-full py-3.5 px-4 bg-surface border border-border rounded-xl text-[15px] font-medium text-text transition-all duration-200 focus:border-border-hover focus:bg-surface-hover placeholder:text-text-dim"
              placeholder="Give your note a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div data-form-group className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-widest text-text-muted mb-2.5">
              Content
            </label>
            <textarea
              className="w-full py-3.5 px-4 bg-surface border border-border rounded-xl text-[15px] font-medium text-text transition-all duration-200 focus:border-border-hover focus:bg-surface-hover placeholder:text-text-dim min-h-[200px] resize-y leading-7"
              placeholder="Start writing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div data-form-group className="flex gap-3 mt-8">
            <motion.button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap bg-accent text-bg hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-border border-t-text rounded-full animate-[spin_0.6s_linear_infinite]" />
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Save Changes
                </>
              )}
            </motion.button>
            <Link to={`/note/${id}`}>
              <motion.button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap bg-transparent text-text-muted border border-border hover:text-text hover:border-border-hover hover:bg-accent-dim"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPage;
