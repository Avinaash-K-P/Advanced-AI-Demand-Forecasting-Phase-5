import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

function ProjectDiscussion() {

  const darkMode =localStorage.getItem("theme") === "dark";
  const navigate   = useNavigate();
  const location   = useLocation();
  const id         = location.state?.id;

  // ── Guard ──
  useEffect(() => {
    if (!id) {
      toast.error("No project selected. Please select a project first.");
      navigate("/workspace/projects");
    }
  }, [id]);
  const bottomRef  = useRef(null);

  const [discussions,  setDiscussions]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [message,      setMessage]      = useState("");
  const [posting,      setPosting]      = useState(false);
  const [replyTo,      setReplyTo]      = useState(null);
  const [replyText,    setReplyText]    = useState("");
  const [postingReply, setPostingReply] = useState(false);
  const [editId,       setEditId]       = useState(null);
  const [editText,     setEditText]     = useState("");

  const currentUserId = parseInt(localStorage.getItem("user_id"));
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  // ── Fetch Discussions ──
  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:8000/collaboration/projects/${id}/discussions`,
        { headers }
      );
      setDiscussions(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDiscussions();
  }, [id]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [discussions]);

  // ── Post Message ──
  const handlePost = async () => {
    if (!message.trim()) { toast.error("Message cannot be empty"); return; }
    try {
      setPosting(true);
      await axios.post(
        `http://127.0.0.1:8000/collaboration/projects/${id}/discussions`,
        { message, parent_id: null },
        { headers }
      );
      setMessage("");
      fetchDiscussions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to post message");
    } finally {
      setPosting(false);
    }
  };

  // ── Post Reply ──
  const handleReply = async (parentId) => {
    if (!replyText.trim()) { toast.error("Reply cannot be empty"); return; }
    try {
      setPostingReply(true);
      await axios.post(
        `http://127.0.0.1:8000/collaboration/projects/${id}/discussions`,
        { message: replyText, parent_id: parentId },
        { headers }
      );
      setReplyTo(null);
      setReplyText("");
      fetchDiscussions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to post reply");
    } finally {
      setPostingReply(false);
    }
  };

  // ── Edit Message ──
  const handleEdit = async (discussionId) => {
    if (!editText.trim()) return;
    try {
      await axios.put(
        `http://127.0.0.1:8000/collaboration/discussions/${discussionId}`,
        { message: editText },
        { headers }
      );
      toast.success("Message updated!");
      setEditId(null);
      setEditText("");
      fetchDiscussions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update message");
    }
  };

  // ── Delete Message ──
  const handleDelete = async (discussionId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(
        `http://127.0.0.1:8000/collaboration/discussions/${discussionId}`,
        { headers }
      );
      toast.success("Message deleted!");
      fetchDiscussions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleString("en-US", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  // ── Message Bubble ──
  const MessageBubble = ({ d, isReply = false }) => (
    <div className={`flex gap-3 ${isReply ? "ml-12" : ""}`}>

      <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm ${isReply ? "bg-blue-500" : "bg-emerald-600"}`}>
        {d.user_id}
      </div>

      <div className="flex-1">
        <div className={`rounded-2xl px-4 py-3 ${isReply
          ? darkMode ? "bg-gray-800 border border-gray-700" : "bg-blue-50 border border-blue-100"
          : darkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
        }`}>

          {/* Meta */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">User #{d.user_id}</span>
              {isReply && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
                  reply
                </span>
              )}
            </div>
            <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              {formatTime(d.created_at)}
            </span>
          </div>

          {/* Body or Edit */}
          {editId === d.id ? (
            <div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className={`w-full px-3 py-2 rounded-xl border outline-none resize-none mb-2 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`}
              />
              <div className="flex gap-2">
                <button onClick={() => handleEdit(d.id)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-semibold transition">
                  Save
                </button>
                <button onClick={() => { setEditId(null); setEditText(""); }}
                  className={`text-xs border px-3 py-1.5 rounded-lg font-semibold transition ${darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-600"}`}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {d.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-1 px-1">
          {!isReply && (
            <button
              onClick={() => { setReplyTo(d.id); setReplyText(""); }}
              className={`text-xs font-medium transition ${darkMode ? "text-gray-500 hover:text-blue-400" : "text-gray-400 hover:text-blue-600"}`}
            >
              Reply
            </button>
          )}
          {d.user_id === currentUserId && (
            <>
              <button
                onClick={() => { setEditId(d.id); setEditText(d.message); }}
                className={`text-xs font-medium transition ${darkMode ? "text-gray-500 hover:text-emerald-400" : "text-gray-400 hover:text-emerald-600"}`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(d.id)}
                className={`text-xs font-medium transition ${darkMode ? "text-gray-500 hover:text-red-400" : "text-gray-400 hover:text-red-500"}`}
              >
                Delete
              </button>
            </>
          )}
        </div>

        {/* Inline Reply Box */}
        {replyTo === d.id && (
          <div className="mt-2 ml-1">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Replying to User #${d.user_id}...`}
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border outline-none resize-none mb-2 text-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-300 text-gray-800"}`}
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleReply(d.id)}
                disabled={postingReply}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
              >
                {postingReply ? "Posting..." : "Reply"}
              </button>
              <button
                onClick={() => { setReplyTo(null); setReplyText(""); }}
                className={`text-sm border font-semibold px-4 py-2 rounded-xl transition ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {d.replies && d.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {d.replies.map((reply) => (
              <MessageBubble key={reply.id} d={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-6 max-w-3xl flex flex-col" style={{ height: "calc(100vh - 48px)" }}>

        {/* Header */}
        <button
          onClick={() => navigate("/workspace/project-details", { state: { id } })}
          className={`mb-4 text-sm font-medium flex items-center gap-1 transition ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}
        >
          ← Back to Workspace
        </button>

        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-1">Team Discussion</h1>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Project #{id} — Collaborate with your team
          </p>
        </div>

        {/* ── Message Thread ── */}
        <div className="flex-1 overflow-y-auto space-y-5 mb-6 pr-1">
          {loading ? (
            <div className={`flex justify-center items-center h-48 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Loading discussion...
            </div>
          ) : discussions.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-64 rounded-3xl border-2 border-dashed ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-400"}`}>
              <p className="text-xl font-semibold mb-2">No messages yet</p>
              <p className="text-sm">Start the team discussion below</p>
            </div>
          ) : (
            discussions.map((d) => (
              <MessageBubble key={d.id} d={d} />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Message Input ── */}
        <div className={`rounded-3xl border p-4 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
          <div className="flex gap-3 items-end">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handlePost(); }}}
              placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
              rows={2}
              className={`flex-1 px-4 py-3 rounded-xl border outline-none resize-none text-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-300 text-gray-800"}`}
            />
            <button
              onClick={handlePost}
              disabled={posting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl transition disabled:opacity-50 flex-shrink-0"
            >
              {posting ? "..." : "Send"}
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default ProjectDiscussion;