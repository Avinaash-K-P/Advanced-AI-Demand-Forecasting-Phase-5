import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

function Projects() {

  const darkMode =localStorage.getItem("theme") === "dark";
  const navigate = useNavigate();
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName]           = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating]   = useState(false);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  };

  // ── Fetch Projects ──
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://127.0.0.1:8000/projects/",
        { headers }
      );
      setProjects(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // ── Create Project ──
  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }
    try {
      setCreating(true);
      await axios.post(
        "http://127.0.0.1:8000/projects/create",
        { name, description },
        { headers }
      );
      toast.success("Project created successfully!");
      setShowModal(false);
      setName("");
      setDescription("");
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-1">Forecast Workspaces</h1>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Manage your forecasting projects and workspaces
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all"
          >
            + New Project
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Loading projects...</p>
          </div>

        ) : projects.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-64 rounded-3xl border-2 border-dashed ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-400"}`}>
            <p className="text-xl font-semibold mb-2">No projects yet</p>
            <p className="text-sm">Click "New Project" to get started</p>
          </div>

        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate("/workspace/project-details", { state: { id: project.id } })}
                className={`cursor-pointer rounded-3xl p-6 shadow-md border transition-all hover:shadow-xl hover:-translate-y-1 ${darkMode ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-200 text-gray-800"}`}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow">
                    {project.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${project.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {project.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold mt-4 mb-1 truncate">{project.name}</h3>
                <p className={`text-sm line-clamp-2 mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {project.description || "No description provided"}
                </p>

                <div className={`flex items-center justify-between text-xs pt-3 border-t ${darkMode ? "border-gray-800 text-gray-500" : "border-gray-100 text-gray-400"}`}>
                  <span>
                    Created {project.created_at
                      ? new Date(project.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                      : "—"}
                  </span>
                  <span className="text-emerald-500 font-semibold">View →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`w-full max-w-md rounded-3xl shadow-2xl p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
              <h2 className="text-2xl font-bold mb-6">Create New Project</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Project Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q3 Retail Forecast"
                  className={`w-full px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this project..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border outline-none resize-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowModal(false); setName(""); setDescription(""); }}
                  className={`flex-1 py-3 rounded-xl font-semibold border transition ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex-1 py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Projects;