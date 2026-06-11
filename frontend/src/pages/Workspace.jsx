import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function Workspace() {

  const darkMode =localStorage.getItem("theme") === "dark";
    
  const navigate = useNavigate();

  const cards = [
    {
      icon: "📂",
      title: "View Projects",
      description: "Browse all forecasting projects and workspaces.",
      onClick: () => navigate("/workspace/projects"),
      // ✅ No id needed — goes to the projects list
    },
    {
      icon: "📋",
      title: "Project Details",
      description: "Select a project first to view its datasets, forecasts and reports.",
      onClick: () => navigate("/workspace/projects"),
      // ✅ Redirects to projects list so user picks a project first
      note: "Select a project to open details"
    },
    {
      icon: "⚙️",
      title: "Project Settings",
      description: "Select a project first to manage permissions and configurations.",
      onClick: () => navigate("/workspace/projects"),
      // ✅ Same — user must select a project first
      note: "Select a project to open settings"
    },
  ];

  return (
    <Layout>
      <div className="p-8">

        <h1 className="text-3xl font-bold mb-2">
          Forecast Workspace
        </h1>

        <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Manage forecasting projects, workspace settings, and project configurations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={card.onClick}
              className={`
                cursor-pointer
                rounded-2xl shadow-lg p-6
                hover:shadow-2xl hover:-translate-y-1
                transition-all duration-300 border
                ${darkMode
                  ? "bg-gray-900 border-gray-800 text-white"
                  : "bg-white border-gray-200 text-gray-800"}
              `}
            >
              <div className="text-5xl mb-4">{card.icon}</div>

              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>

              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {card.description}
              </p>

              {card.note && (
                <p className={`
                  text-xs mt-3 px-3 py-1.5 rounded-xl inline-block font-medium
                  ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}
                `}>
                  ℹ {card.note}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}

export default Workspace;