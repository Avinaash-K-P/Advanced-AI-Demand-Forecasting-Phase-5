import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

function ReportSharing() {

  const darkMode =localStorage.getItem("theme") === "dark";
  const [sharedWithMe,   setSharedWithMe]   = useState([]);
  const [shareReportId,  setShareReportId]  = useState("");
  const [shareUserId,    setShareUserId]    = useState("");
  const [sharePermission, setSharePermission] = useState("view");
  const [sharingLoading, setSharingLoading] = useState(false);
  const [loadingShared,  setLoadingShared]  = useState(true);
  const [activeTab,      setActiveTab]      = useState("shared-with-me");

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  // ── Fetch Reports Shared With Me ──
  const fetchSharedWithMe = async () => {
    try {
      setLoadingShared(true);
      const res = await axios.get(
        "http://127.0.0.1:8000/reports/shared-with-me",
        { headers }
      );
      setSharedWithMe(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load shared reports");
    } finally {
      setLoadingShared(false);
    }
  };

  useEffect(() => { fetchSharedWithMe(); }, []);

  // ── Share a Report ──
  const handleShare = async () => {
    if (!shareReportId || !shareUserId) {
      toast.error("Report ID and User ID are required");
      return;
    }
    try {
      setSharingLoading(true);
      await axios.post(
        `http://127.0.0.1:8000/reports/${shareReportId}/share`,
        {
          shared_to: parseInt(shareUserId),
          permission: sharePermission
        },
        { headers }
      );
      toast.success("Report shared successfully!");
      setShareReportId("");
      setShareUserId("");
      setSharePermission("view");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Failed to share report");
    } finally {
      setSharingLoading(false);
    }
  };

  // ── Revoke Share ──
  const handleRevoke = async (shareId) => {
    if (!window.confirm("Revoke access to this report?")) return;
    try {
      await axios.delete(
        `http://127.0.0.1:8000/reports/shares/${shareId}/revoke`,
        { headers }
      );
      toast.success("Access revoked!");
      fetchSharedWithMe();
    } catch (error) {
      console.error(error);
      toast.error("Failed to revoke access");
    }
  };

  const permBadge = {
    view:     "bg-gray-100 text-gray-600",
    download: "bg-emerald-100 text-emerald-700"
  };

  const formatDate = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });
  };

  return (
    <Layout>
      <div className="p-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-1">Report Sharing</h1>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Share reports with teammates and manage access
          </p>
        </div>

        {/* Tabs */}
        <div className={`flex gap-2 mb-6 border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          {["shared-with-me", "share-report"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 transition ${
                activeTab === tab
                  ? "border-emerald-500 text-emerald-500"
                  : `border-transparent ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`
              }`}
            >
              {tab === "shared-with-me" ? "Shared With Me" : "Share a Report"}
            </button>
          ))}
        </div>

        {/* ── Shared With Me Tab ── */}
        {activeTab === "shared-with-me" && (
          <div>
            {loadingShared ? (
              <div className={`flex justify-center items-center h-48 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Loading shared reports...
              </div>

            ) : sharedWithMe.length === 0 ? (
              <div className={`flex flex-col items-center justify-center h-64 rounded-3xl border-2 border-dashed ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-400"}`}>
                <p className="text-xl font-semibold mb-2">No shared reports</p>
                <p className="text-sm">Reports shared with you will appear here</p>
              </div>

            ) : (
              <div className="space-y-4">
                {sharedWithMe.map((s) => (
                  <div
                    key={s.id}
                    className={`rounded-2xl border p-5 flex items-center justify-between ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
                  >
                    <div className="flex items-center gap-4">

                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                        📄
                      </div>

                      <div>
                        <p className="font-bold">Report #{s.report_id}</p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Shared by User #{s.shared_by} · {formatDate(s.shared_at)}
                        </p>
                        {s.expires_at && (
                          <p className={`text-xs mt-0.5 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                            Expires {formatDate(s.expires_at)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${permBadge[s.permission] || "bg-gray-100 text-gray-600"}`}>
                        {s.permission}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Share a Report Tab ── */}
        {activeTab === "share-report" && (
          <div className="max-w-lg">
            <div className={`rounded-3xl border p-6 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
              <h2 className="text-lg font-bold mb-6">Share a Report</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Report ID *</label>
                <input
                  type="number"
                  value={shareReportId}
                  onChange={(e) => setShareReportId(e.target.value)}
                  placeholder="e.g. 1"
                  className={`w-full px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Share with User ID *</label>
                <input
                  type="number"
                  value={shareUserId}
                  onChange={(e) => setShareUserId(e.target.value)}
                  placeholder="e.g. 3"
                  className={`w-full px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Permission</label>
                <select
                  value={sharePermission}
                  onChange={(e) => setSharePermission(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`}
                >
                  <option value="view">View only</option>
                  <option value="download">View + Download</option>
                </select>
              </div>

              <button
                onClick={handleShare}
                disabled={sharingLoading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50"
              >
                {sharingLoading ? "Sharing..." : "Share Report"}
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default ReportSharing;