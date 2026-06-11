import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import DashboardAnalytics from "../components/Dashboard_Analytics";
import React from "react";

function Dashboard() {

return (
  <Layout>

  <DashboardAnalytics/>

  </Layout>

);

}
export default Dashboard;