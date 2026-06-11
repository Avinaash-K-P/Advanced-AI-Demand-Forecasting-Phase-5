import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

function CollaborationInvitations() {

  const darkMode =localStorage.getItem("theme") === "dark";
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [responding,  setResponding]  = useState(null);

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  // ── Fetch My Invitations ──
  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://127.0.0.1:8000/collaboration/my-invitations",
        { headers }
      );
      setInvitations(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvitations(); }, []);

  // ── Respond to Invitation ──
  const handleRespond = async (invitationId, status) => {
    try {
      setResponding(invitationId);
      await axios.put(
        `http://127.0.0.1:8000/collaboration/invitations/${invitationId}/respond`,
        { status },
        { headers }
      );
      toast.success(`Invitation ${status}!`);
      fetchInvitations();
      if (status === "accepted") {
        toast.info("You have been added to the project workspace");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to respond to invitation");
    } finally {
      setResponding(null);
    }
  };

  const roleBadge = {
    editor: "bg-blue-100 text-blue-700",
    viewer: "bg-gray-100 text-gray-600"
  };

  const formatDate = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });
  };

  return (
    <Layout>
      <div className="p-6 max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-1">Invitations</h1>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Pending collaboration invitations to forecasting workspaces
          </p>
        </div>

        {loading ? (
          <div className={`flex justify-center items-center h-48 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Loading invitations...
          </div>

        ) : invitations.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-64 rounded-3xl border-2 border-dashed ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-400"}`}>
            <p className="text-xl font-semibold mb-2">No pending invitations</p>
            <p className="text-sm">You're all caught up!</p>
          </div>

        ) : (
          <div className="space-y-4">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className={`rounded-3xl border p-6 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between mb-4">

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow">
                      📁
                    </div>
                    <div>
                      <p className="font-bold text-lg">Project #{inv.project_id}</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Invited by User #{inv.invited_by} · {formatDate(inv.invited_at)}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${roleBadge[inv.role] || "bg-gray-100 text-gray-600"}`}>
                    {inv.role}
                  </span>
                </div>

                {/* Message */}
                {inv.message && (
                  <div className={`rounded-xl px-4 py-3 mb-4 text-sm ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-600"}`}>
                    "{inv.message}"
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRespond(inv.id, "accepted")}
                    disabled={responding === inv.id}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50"
                  >
                    {responding === inv.id ? "..." : "✓ Accept"}
                  </button>
                  <button
                    onClick={() => handleRespond(inv.id, "declined")}
                    disabled={responding === inv.id}
                    className={`flex-1 py-3 rounded-xl border font-semibold transition disabled:opacity-50 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                  >
                    {responding === inv.id ? "..." : "✗ Decline"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}

export default CollaborationInvitations;