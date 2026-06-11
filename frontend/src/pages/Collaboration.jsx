import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function Collaboration() {

  const darkMode =localStorage.getItem("theme") === "dark";  
  const navigate = useNavigate();

  const cards = [
    {
      icon: "📨",
      title: "Collaboration Invites",
      description: "Invite users and manage workspace access.",
      onClick: () => navigate("/collaboration/invitation"),
      // ✅ No id needed — works standalone
    },
    {
      icon: "💬",
      title: "Project Discussion",
      description: "Collaborate and discuss project progress.",
      onClick: () => navigate("/workspace/projects"),
      // ✅ Must select a project first to get project_id
      note: "Select a project to open discussion"
    },
    {
      icon: "📈",
      title: "Forecast Comments",
      description: "Review and comment on forecasting results.",
      onClick: () => navigate("/collaboration/forecast-comments"),
      // ✅ Must select a forecast first to get forecastId
      note: "Select a forecast to open comments"
    },
    {
      icon: "📊",
      title: "Report Sharing",
      description: "Share reports with teams and stakeholders.",
      onClick: () => navigate("/collaboration/report-sharing"),
      // ✅ No id needed — works standalone
    },
  ];

  return (
    <Layout>
      <div className="p-8">

        <h1 className="text-3xl font-bold mb-3">
          Collaboration Hub
        </h1>

        <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Collaborate with team members, discuss forecasts, share reports, and manage project communication.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={card.onClick}
              className={`
                cursor-pointer rounded-2xl shadow-lg p-6
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

export default Collaboration;