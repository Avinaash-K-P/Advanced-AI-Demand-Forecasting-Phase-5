import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

function ProjectDetail() {

  const darkMode =localStorage.getItem("theme") === "dark";  
  const navigate     = useNavigate();
  const location     = useLocation();
  const id           = location.state?.id;

  // ── Guard — redirect back if no id in state ──
  useEffect(() => {
    if (!id) {
      toast.error("No project selected. Please select a project first.");
      navigate("/workspace/projects");
    }
  }, [id]);
  const [project, setProject]       = useState(null);
  const [members, setMembers]       = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab]   = useState("overview");
  const [loading, setLoading]       = useState(true);

  // Link modals
  const [showDatasetModal,  setShowDatasetModal]  = useState(false);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [showReportModal,   setShowReportModal]   = useState(false);

  // Link form values
  const [datasetName,      setDatasetName]      = useState("");
  const [salesRefId,       setSalesRefId]       = useState("");
  const [forecastResultId, setForecastResultId] = useState("");
  const [reportId,         setReportId]         = useState("");

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const tabs = ["overview", "members", "activity"];

  const actionIcon = {
    PROJECT_CREATED:     "🚀", PROJECT_UPDATED:  "✏️",
    PROJECT_ARCHIVED:    "📦", MEMBER_ADDED:     "👤",
    MEMBER_REMOVED:      "🚫", DATASET_LINKED:   "📂",
    FORECAST_LINKED:     "📈", REPORT_LINKED:    "📄",
    DISCUSSION_POSTED:   "💬", INVITATION_SENT:  "✉️",
  };

  // ── Fetch ──
  const fetchProject = async () => {
    try {
      setLoading(true);
      const [projRes, membRes, actRes] = await Promise.allSettled([
        axios.get(`http://127.0.0.1:8000/projects/${id}`, { headers }),
        axios.get(`http://127.0.0.1:8000/projects/${id}/members`, { headers }),
        axios.get(`http://127.0.0.1:8000/projects/${id}/activity`, { headers }),
      ]);
      if (projRes.status === "fulfilled") setProject(projRes.value.data.data);
      else toast.error("Failed to load project details");
      if (membRes.status === "fulfilled") setMembers(membRes.value.data.data || []);
      if (actRes.status  === "fulfilled") setActivities(actRes.value.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  // ── Link Dataset ──
  const handleLinkDataset = async () => {
    if (!datasetName.trim()) { toast.error("Dataset name is required"); return; }
    try {
      await axios.post(`http://127.0.0.1:8000/projects/${id}/datasets/link`,
        {
          dataset_name: datasetName,
          sales_reference_id: salesRefId !== "" ? parseInt(salesRefId) : null
        },
        { headers }
      );
      toast.success("Dataset linked!");
      setShowDatasetModal(false); setDatasetName(""); setSalesRefId("");
      fetchProject();
    } catch (error) { console.error(error); toast.error("Failed to link dataset"); }
  };

  // ── Link Forecast ──
  const handleLinkForecast = async () => {
    if (!forecastResultId) { toast.error("Forecast Result ID is required"); return; }
    try {
      await axios.post(`http://127.0.0.1:8000/projects/${id}/forecasts/link`,
        { forecast_result_id: parseInt(forecastResultId) },
        { headers }
      );
      toast.success("Forecast linked!");
      setShowForecastModal(false); setForecastResultId("");
      fetchProject();
    } catch (error) { console.error(error); toast.error("Failed to link forecast"); }
  };

  // ── Link Report ──
  const handleLinkReport = async () => {
    if (!reportId) { toast.error("Report ID is required"); return; }
    try {
      await axios.post(`http://127.0.0.1:8000/projects/${id}/reports/link`,
        { report_id: parseInt(reportId) },
        { headers }
      );
      toast.success("Report linked!");
      setShowReportModal(false); setReportId("");
      fetchProject();
    } catch (error) { console.error(error); toast.error("Failed to link report"); }
  };

  if (loading) return (
    <Layout>
      <div className="p-6 flex justify-center items-center h-64">
        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Loading workspace...</p>
      </div>
    </Layout>
  );

  if (!project) return null;

  const roleBadge = { owner: "bg-emerald-100 text-emerald-700", editor: "bg-blue-100 text-blue-700", viewer: "bg-gray-100 text-gray-600" };

  return (
    <Layout>
      <div className="p-6">

        {/* Back */}
        <button onClick={() => navigate("/workspace/projects")}
          className={`mb-6 text-sm font-medium flex items-center gap-1 transition ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}>
          ← Back to Projects
        </button>

        {/* Banner */}
        <div className="mb-8 bg-gradient-to-r from-emerald-800 to-gray-800 text-white rounded-3xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full capitalize mb-2 inline-block">{project.status}</span>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <p className="text-gray-300 mt-2">{project.description || "No description provided"}</p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-3">
              <button onClick={() => navigate("/workspace/project-settings", { state: { id } })}
                className="bg-white/10 border border-white/20 px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-white/20 transition">
                ⚙ Settings
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex gap-2 mb-6 border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 transition ${activeTab === tab ? "border-emerald-500 text-emerald-500" : `border-transparent ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Navigation shortcuts */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate("/collaboration/project-discussion", { state: { id } })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            💬 Open Discussion
          </button>
        </div>

        {/* Dataset Card */}
            <div className={`rounded-3xl border p-6 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Datasets</h3>
                <button onClick={() => setShowDatasetModal(true)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-semibold transition">
                  + Link
                </button>
              </div>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Link datasets from your uploaded sales records to this project.
              </p>
            </div>

            {/* Forecast Card */}
            <div className={`rounded-3xl border p-6 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Forecasts</h3>
                <button onClick={() => setShowForecastModal(true)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-semibold transition">
                  + Link
                </button>
              </div>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Attach forecast results generated from your AI models to this project.
              </p>
            </div>

            {/* Report Card */}
            <div className={`rounded-3xl border p-6 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Reports</h3>
                <button onClick={() => setShowReportModal(true)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-semibold transition">
                  + Link
                </button>
              </div>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Attach generated PDF or Excel reports to organize under this project.
              </p>
            </div>

          </div>
        )}

        {/* ── Members Tab ── */}
        {activeTab === "members" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Project Members</h2>
              <button onClick={() => navigate("/workspace/project-settings", { state: { id } })}
                className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition">
                Manage Members
              </button>
            </div>

            {members.length === 0 ? (
              <div className={`flex items-center justify-center h-40 rounded-2xl border-2 border-dashed text-sm ${darkMode ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
                No members found
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((m) => (
                  <div key={m.id} className={`flex items-center justify-between px-5 py-4 rounded-2xl border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                        {m.user_id}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">User #{m.user_id}</p>
                        <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                          Joined {new Date(m.joined_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${roleBadge[m.role] || "bg-gray-100 text-gray-600"}`}>
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Activity Tab ── */}
        {activeTab === "activity" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Project Activity</h2>

            {activities.length === 0 ? (
              <div className={`flex items-center justify-center h-40 rounded-2xl border-2 border-dashed text-sm ${darkMode ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
                No activity recorded yet
              </div>
            ) : (
              <div className="relative">
                <div className={`absolute left-6 top-0 bottom-0 w-px ${darkMode ? "bg-gray-800" : "bg-gray-200"}`} />
                <div className="space-y-4">
                  {activities.map((a) => (
                    <div key={a.id} className="flex items-start gap-4 pl-2">
                      <div className="relative z-10 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm flex-shrink-0">
                        {actionIcon[a.action] || "•"}
                      </div>
                      <div className={`flex-1 px-5 py-4 rounded-2xl border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            {a.action.replace(/_/g, " ")}
                          </span>
                          <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                            {new Date(a.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{a.description || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Dataset Modal ── */}
      {showDatasetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md rounded-3xl shadow-2xl p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
            <h2 className="text-2xl font-bold mb-6">Link Dataset</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Dataset Name *</label>
              <input type="text" value={datasetName} onChange={(e) => setDatasetName(e.target.value)} placeholder="e.g. Retail Sales Q1"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`} />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Sales Record ID (optional)</label>
              <input type="text" value={salesRefId} onChange={(e) => setSalesRefId(e.target.value)} placeholder="e.g. 1"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowDatasetModal(false); setDatasetName(""); setSalesRefId(""); }}
                className={`flex-1 py-3 rounded-xl border font-semibold transition ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>Cancel</button>
              <button onClick={handleLinkDataset} className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Forecast Modal ── */}
      {showForecastModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md rounded-3xl shadow-2xl p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
            <h2 className="text-2xl font-bold mb-6">Link Forecast</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Forecast Result ID *</label>
              <input type="text" value={forecastResultId} onChange={(e) => setForecastResultId(e.target.value)} placeholder="e.g. 1"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowForecastModal(false); setForecastResultId(""); }}
                className={`flex-1 py-3 rounded-xl border font-semibold transition ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>Cancel</button>
              <button onClick={handleLinkForecast} className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Report Modal ── */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md rounded-3xl shadow-2xl p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
            <h2 className="text-2xl font-bold mb-6">Link Report</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Report ID *</label>
              <input type="text" value={reportId} onChange={(e) => setReportId(e.target.value)} placeholder="e.g. 1"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowReportModal(false); setReportId(""); }}
                className={`flex-1 py-3 rounded-xl border font-semibold transition ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>Cancel</button>
              <button onClick={handleLinkReport} className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition">Confirm</button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}

export default ProjectDetail;