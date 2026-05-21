import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../components/Admin_Layout";
import ChartsAndGraphs from "../components/charts_and_graphs";

function AdminDashboard() { 

const [dashboardData, setDashboardData] = useState({})
const username = localStorage.getItem("username"); // To display username in the dashboard

const fetchDashboard = async () => {

    try {

        const token = localStorage.getItem("token")

        const response = await axios.get(
            "http://127.0.0.1:8000/admin/dashboard",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        setDashboardData(response.data.data)
    } 
    catch (error) {
        console.log(error)
    }

    
}

useEffect(() => {
    fetchDashboard()
}, []);

 return (

    <AdminLayout>

        <div className="min-h-screen bg-gray-100 p-6">

             {/* Header */}
      <h1 className="text-4xl font-bold mb-8">
        AI Demand Forecast Admin Dashboard
      </h1>

        {/* Welcome Message */}

<div className="
  mb-8
  bg-gradient-to-r
  from-emerald-800
  to-gray-800
  text-white
  rounded-3xl
  p-8
  shadow-xl
">

  <div className="
    flex
    flex-col
    md:flex-row
    md:items-center
    md:justify-between
  ">

    {/* Left Content */}
    <div>

      <h1 className="text-4xl font-bold">

        Welcome back,
        <span className="text-gray-300">
          {" "} {username} !
        </span>
        

      </h1>

      <p className="
        text-gray-300
        mt-4
        text-lg
        leading-7
      ">

        Here is your latest AI-powered
        demand forecasting analytics,
        business trends, and prediction
        insights.

      </p>

    </div>

    {/* Right Badge */}
    <div className="mt-6 md:mt-0">

      <div className="
        bg-white/10
        backdrop-blur-lg
        px-6
        py-4
        rounded-2xl
        border
        border-white/20
      ">

        <p className="text-sm text-gray-300">
          Forecast Status
        </p>

        <h2 className="text-2xl font-bold mt-1">
          Active
        </h2>

      </div>      

    </div>

  </div>

</div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Total Users */}
                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <h2 className="text-gray-500">
                        Total Users
                    </h2>

                    <p className="text-3xl font-bold mt-3">
                        {dashboardData.total_users || 0}
                    </p>

                </div>

                {/* Total Datasets */}
                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <h2 className="text-gray-500">
                        Total Datasets
                    </h2>

                    <p className="text-3xl font-bold mt-3">
                        {dashboardData.total_datasets || 0}
                    </p>

                </div>

                {/* Total Forecasts */}
                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <h2 className="text-gray-500">
                        Total Forecasts
                    </h2>

                    <p className="text-3xl font-bold mt-3">
                        {dashboardData.total_forecasts || 0}
                    </p>

                </div>

            </div>

              <br/>  
              <ChartsAndGraphs />         

        </div>


    </AdminLayout>
)
}

export default AdminDashboard;