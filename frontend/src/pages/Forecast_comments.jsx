import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

function ForecastComments() {

  const darkMode =localStorage.getItem("theme") === "dark";  
  const navigate       = useNavigate();
  const location       = useLocation();
  const forecastId     = location.state?.forecastId;

  // ── Guard ──
  useEffect(() => {
    if (!forecastId) {
      toast.error("No forecast selected. Please select a forecast first.");
      navigate("/forecast");
    }
  }, [forecastId]);

  const [comments,    setComments]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [newComment,  setNewComment]  = useState("");
  const [posting,     setPosting]     = useState(false);
  const [editId,      setEditId]      = useState(null);
  const [editText,    setEditText]    = useState("");

  const currentUserId = parseInt(localStorage.getItem("user_id"));
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  // ── Fetch Comments ──
  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:8000/forecasts/${forecastId}/comments`,
        { headers }
      );
      setComments(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (forecastId) fetchComments(); }, [forecastId]);

  // ── Post Comment ──
  const handlePost = async () => {
    if (!newComment.trim()) { toast.error("Comment cannot be empty"); return; }
    try {
      setPosting(true);
      await axios.post(
        `http://127.0.0.1:8000/forecasts/${forecastId}/comments`,
        { comment: newComment },
        { headers }
      );
      toast.success("Comment posted!");
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  // ── Edit Comment ──
  const handleEdit = async (commentId) => {
    if (!editText.trim()) { toast.error("Comment cannot be empty"); return; }
    try {
      await axios.put(
        `http://127.0.0.1:8000/forecasts/comments/${commentId}`,
        { comment: editText },
        { headers }
      );
      toast.success("Comment updated!");
      setEditId(null);
      setEditText("");
      fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update comment");
    }
  };

  // ── Delete Comment ──
  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(
        `http://127.0.0.1:8000/forecasts/comments/${commentId}`,
        { headers }
      );
      toast.success("Comment deleted!");
      fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleString("en-US", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <Layout>
      <div className="p-6 max-w-3xl">

        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className={`mb-6 text-sm font-medium flex items-center gap-1 transition ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}
        >
          ← Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-1">Forecast Comments</h1>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Forecast #{forecastId} — Team discussion and notes
          </p>
        </div>

        {/* ── Post New Comment ── */}
        <div className={`rounded-3xl border p-6 mb-8 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-lg font-bold mb-4">Add a Comment</h2>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts on this forecast..."
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border outline-none resize-none mb-4 ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-300 text-gray-800"}`}
          />
          <button
            onClick={handlePost}
            disabled={posting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post Comment"}
          </button>
        </div>

        {/* ── Comments List ── */}
        <h2 className="text-xl font-bold mb-4">
          Comments ({comments.length})
        </h2>

        {loading ? (
          <div className={`flex justify-center items-center h-40 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Loading comments...
          </div>

        ) : comments.length === 0 ? (
          <div className={`flex items-center justify-center h-40 rounded-2xl border-2 border-dashed text-sm ${darkMode ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
            No comments yet — be the first to add one
          </div>

        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div
                key={c.id}
                className={`rounded-2xl border p-5 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
              >
                {/* Comment Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                      {c.user_id}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">User #{c.user_id}</p>
                      <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {formatTime(c.created_at)}
                        {c.updated_at !== c.created_at && " · edited"}
                      </p>
                    </div>
                  </div>

                  {/* Actions — only own comments */}
                  {c.user_id === currentUserId && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditId(c.id); setEditText(c.comment); }}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg transition ${darkMode ? "text-blue-400 hover:bg-gray-800" : "text-blue-600 hover:bg-blue-50"}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg transition ${darkMode ? "text-red-400 hover:bg-gray-800" : "text-red-500 hover:bg-red-50"}`}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Comment Body or Edit Mode */}
                {editId === c.id ? (
                  <div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border outline-none resize-none mb-3 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(c.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditId(null); setEditText(""); }}
                        className={`text-sm font-semibold px-4 py-2 rounded-xl border transition ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {c.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}

export default ForecastComments;