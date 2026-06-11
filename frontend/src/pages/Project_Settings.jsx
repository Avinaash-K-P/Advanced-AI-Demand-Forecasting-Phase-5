import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

function ProjectSettings() {

  const darkMode =localStorage.getItem("theme") === "dark";
  const navigate   = useNavigate();
  const location   = useLocation();
  const id         = location.state?.id;

  // ── Guard — redirect back if no id in state ──
  useEffect(() => {
    if (!id) {
      toast.error("No project selected. Please select a project first.");
      navigate("/workspace/projects");
    }
  }, [id]);

  const [project,     setProject]     = useState(null);
  const [members,     setMembers]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [name,        setName]        = useState("");
  const [description, setDescription] = useState("");
  const [saving,      setSaving]      = useState(false);

  // Add member
  const [newUserId, setNewUserId] = useState("");
  const [newRole,   setNewRole]   = useState("viewer");
  const [adding,    setAdding]    = useState(false);

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const roleBadge = {
    owner:  "bg-emerald-100 text-emerald-700",
    editor: "bg-blue-100 text-blue-700",
    viewer: "bg-gray-100 text-gray-600"
  };

  // ── Fetch ──
  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, membRes] = await Promise.allSettled([
        axios.get(`http://127.0.0.1:8000/projects/${id}`, { headers }),
        axios.get(`http://127.0.0.1:8000/projects/${id}/members`, { headers }),
      ]);

      if (projRes.status === "fulfilled") {
        const data = projRes.value.data.data;
        setProject(data);
        setName(data.name);
        setDescription(data.description || "");
      } else {
        toast.error("Failed to load project details");
      }

      if (membRes.status === "fulfilled") {
        setMembers(membRes.value.data.data || []);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // ── Save Project ──
  const handleSave = async () => {
    if (!name.trim()) { toast.error("Project name is required"); return; }
    try {
      setSaving(true);
      await axios.put(`http://127.0.0.1:8000/projects/${id}/update`, { name, description }, { headers });
      toast.success("Project updated successfully!");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  // ── Archive ──
  const handleArchive = async () => {
    if (!window.confirm("Archive this project?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/projects/${id}/delete`, { headers });
      toast.success("Project archived");
      navigate("/workspace/projects");
    } catch (error) {
      console.error(error);
      toast.error("Failed to archive project");
    }
  };

  // ── Add Member ──
  const handleAddMember = async () => {
    if (!newUserId) { toast.error("User ID is required"); return; }
    try {
      setAdding(true);
      await axios.post(`http://127.0.0.1:8000/projects/${id}/members/add`,
        { user_id: parseInt(newUserId), role: newRole },
        { headers }
      );
      toast.success("Member added!");
      setNewUserId("");
      setNewRole("viewer");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Failed to add member");
    } finally {
      setAdding(false);
    }
  };

  // ── Update Role ──
  const handleRoleChange = async (userId, role) => {
    try {
      await axios.put(`http://127.0.0.1:8000/projects/${id}/members/${userId}`, { role }, { headers });
      toast.success("Role updated!");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    }
  };

  // ── Remove Member ──
  const handleRemove = async (userId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/projects/${id}/members/${userId}`, { headers });
      toast.success("Member removed!");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove member");
    }
  };

  if (loading) return (
    <Layout>
      <div className="p-6 flex justify-center items-center h-64">
        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Loading settings...</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="p-6 max-w-3xl">

        {/* Back */}
        <button onClick={() => navigate("/workspace/project-details", { state: { id } })}
          className={`mb-6 text-sm font-medium flex items-center gap-1 transition ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}>
          ← Back to Workspace
        </button>

        <h1 className="text-3xl font-bold mb-8">Project Settings</h1>

        {/* ── General ── */}
        <div className={`rounded-3xl border p-6 mb-6 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-lg font-bold mb-4">General</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`} />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className={`w-full px-4 py-3 rounded-xl border outline-none resize-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`} />
          </div>

          <button onClick={handleSave} disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* ── Members ── */}
        <div className={`rounded-3xl border p-6 mb-6 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-lg font-bold mb-4">Members</h2>

          {/* Add Member Row */}
          <div className="flex gap-3 mb-6">
            <input type="number" value={newUserId} onChange={(e) => setNewUserId(e.target.value)} placeholder="User ID"
              className={`flex-1 px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`} />
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
              className={`px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`}>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <button onClick={handleAddMember} disabled={adding}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl transition disabled:opacity-50">
              {adding ? "Adding..." : "+ Add"}
            </button>
          </div>

          {/* Member List */}
          {members.length === 0 ? (
            <p className={`text-sm text-center py-6 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>No members found</p>
          ) : (
            <div className="space-y-3">
              {members.map((m) => (
                <div key={m.id} className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${darkMode ? "border-gray-800 bg-gray-800/50" : "border-gray-100 bg-gray-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                      {m.user_id}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">User #{m.user_id}</p>
                      <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Joined {new Date(m.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.role === "owner" ? (
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${roleBadge.owner}`}>Owner</span>
                    ) : (
                      <select value={m.role} onChange={(e) => handleRoleChange(m.user_id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border outline-none cursor-pointer ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"}`}>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    )}

                    {m.role !== "owner" && (
                      <button onClick={() => handleRemove(m.user_id)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 transition">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Danger Zone ── */}
        <div className={`rounded-3xl border p-6 ${darkMode ? "bg-gray-900 border-red-900" : "bg-white border-red-200"}`}>
          <h2 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h2>
          <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Archiving this project will hide it from your workspace. This can be reversed.
          </p>
          <button onClick={handleArchive}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition">
            Archive Project
          </button>
        </div>

      </div>
    </Layout>
  );
}

export default ProjectSettings;