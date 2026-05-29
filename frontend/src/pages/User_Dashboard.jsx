import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import DashboardAnalytics from "../components/Dashboard_Analytics";
import React from "react";

function Dashboard({darkMode}) {

  const username = localStorage.getItem("username"); // To display username in the dashboard

return (
  <Layout>
   <div className="p-6"> 
   {/*<div className="min-h-screen bg-gray-100 p-6">*/}

      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">
        User Dashboard
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

  <DashboardAnalytics 
    darkMode = {darkMode}
  />

</div> 

  </Layout>

);

}

export default Dashboard;