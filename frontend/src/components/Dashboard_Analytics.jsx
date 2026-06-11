import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import { getThemeStyles } from "./ThemeStyles";

// ── Section tabs definition ──
const TABS = [
  { key: "overview",   label: "Overview" },
  { key: "forecast",   label: "Forecasting" },
  { key: "inventory",  label: "Inventory" },
  { key: "analytics",  label: "Analytics" },
  { key: "ai",         label: "AI Insights" },
  { key: "settings",   label: "Settings",   adminOnly: true },
];

function DashboardAnalytics() {

  // TO get the theme 
  const darkMode = localStorage.getItem("theme")=== "dark";
  const styles = getThemeStyles(darkMode);
  const role     = localStorage.getItem("role");
  const navigate = useNavigate();
  const headers  = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const [activeTab, setActiveTab] = useState("overview");

  // ── Per-section loading states ──
  const [loadingOverview,   setLoadingOverview]   = useState(false);
  const [loadingForecast,   setLoadingForecast]   = useState(false);
  const [loadingInventory,  setLoadingInventory]  = useState(false);
  const [loadingAnalytics,  setLoadingAnalytics]  = useState(false);
  const [loadingAI,         setLoadingAI]         = useState(false);

  // ── Overview ──
  const [totalSales,       setTotalSales]       = useState({});
  const [forecastAccuracy, setForecastAccuracy] = useState({});
  const [alerts,           setAlerts]           = useState([]);
  const [systemPerformance,setSystemPerformance]= useState({});
  const [recentSales,      setRecentSales]      = useState([]);

  // ── Forecasting ──
  const [forecastResults,    setForecastResults]    = useState([]);
  const [modelComparison,    setModelComparison]    = useState([]);
  const [forecastComparison, setForecastComparison] = useState([]);
  const [confidenceData,     setConfidenceData]     = useState(null);
  const [accuracyData,       setAccuracyData]       = useState(null);
  const [seasonalTrends,     setSeasonalTrends]     = useState([]);

  // ── Inventory ──
  const [inventoryRisk,         setInventoryRisk]         = useState([]);
  const [inventoryOptimization, setInventoryOptimization] = useState(null);
  const [stockRisk,             setStockRisk]             = useState(null);
  const [demandSpikes,          setDemandSpikes]          = useState([]);
  const [recommendations,       setRecommendations]       = useState([]);

  // ── Analytics ──
  const [monthlySales,  setMonthlySales]  = useState([]);
  const [topProducts,   setTopProducts]   = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [regionForecast,setRegionForecast]= useState([]);
  const [revenuePrediction,setRevenuePrediction] = useState([]);
  const [anomalies,     setAnomalies]     = useState([]);

  // ── AI Insights ──
  const [customerBehavior,       setCustomerBehavior]       = useState(null);
  const [businessRecommendations,setBusinessRecommendations]= useState([]);

  // ── Settings ──
  const [intervalType,  setIntervalType]  = useState("minutes");
  const [intervalValue, setIntervalValue] = useState(10);

  // ── Search ──
  const [searchQuery,  setSearchQuery]  = useState("");
  const [searchResults,setSearchResults]= useState(null);
  const [hasSearched,  setHasSearched]  = useState(false);

  // ── Filters ──
  const [filters, setFilters] = useState({ startDate: "", endDate: "", category: "", region: "" });
  const clearFilters = () => setFilters({ startDate: "", endDate: "", category: "", region: "" });

  // ──────────────────────────────────────────────────
  // API Helpers
  // ──────────────────────────────────────────────────
  const get = (url, params = {}) =>
    axios.get(`http://127.0.0.1:8000${url}`, { headers, params }).then(r => r.data.data);

  // ──────────────────────────────────────────────────
  // Tab-scoped loaders — only called when tab is active
  // ──────────────────────────────────────────────────

  const loadOverview = async () => {
    try {
      setLoadingOverview(true);
      const [sales, accuracy, alertsData, perf, recent] = await Promise.allSettled([
        get("/analytics/total-sales", {
          start_date: filters.startDate, end_date: filters.endDate,
          category: filters.category, region: filters.region
        }),
        get("/analytics/forecast-accuracy"),
        get("/analytics/get-alert"),
        get("/analytics/system-performance"),
        get("/analytics/recent-sales"),
      ]);
      if (sales.status       === "fulfilled") setTotalSales(sales.value);
      if (accuracy.status    === "fulfilled") setForecastAccuracy(accuracy.value);
      if (alertsData.status  === "fulfilled") setAlerts(alertsData.value);
      if (perf.status        === "fulfilled") setSystemPerformance(perf.value);
      if (recent.status      === "fulfilled") setRecentSales(recent.value);
    } catch (e) { console.error(e); }
    finally { setLoadingOverview(false); }
  };

  const loadForecast = async () => {
    try {
      setLoadingForecast(true);
      const [results, model, comparison, confidence, accuracy, seasonal] = await Promise.allSettled([
        get("/analytics/forecast-results"),
        get("/forecast/model-comparison"),
        get("/forecast/forecast-comparison"),
        get("/forecast/forecast-confidence"),
        get("/forecast/model-accuracy"),
        get("/analytics/seasonal-trends"),
      ]);
      if (results.status    === "fulfilled") setForecastResults(results.value?.items || results.value);
      if (model.status      === "fulfilled") setModelComparison(model.value);
      if (comparison.status === "fulfilled") setForecastComparison(comparison.value);
      if (confidence.status === "fulfilled") setConfidenceData(confidence.value);
      if (accuracy.status   === "fulfilled") setAccuracyData(accuracy.value);
      if (seasonal.status   === "fulfilled") setSeasonalTrends(seasonal.value);
    } catch (e) { console.error(e); }
    finally { setLoadingForecast(false); }
  };

  const loadInventory = async () => {
    try {
      setLoadingInventory(true);
      const [risk, opt, stock, spikes, recs] = await Promise.allSettled([
        get("/analytics/inventory-risk"),
        get("/inventory/inventory-optimization"),
        get("/inventory/global-stock-risk"),
        get("/inventory/demand-spikes"),
        get("/inventory/demand"),
      ]);
      if (risk.status   === "fulfilled") setInventoryRisk(risk.value);
      if (opt.status    === "fulfilled") setInventoryOptimization(opt.value);
      if (stock.status  === "fulfilled") setStockRisk(stock.value);
      if (spikes.status === "fulfilled") setDemandSpikes(spikes.value);
      if (recs.status   === "fulfilled") setRecommendations(recs.value);
    } catch (e) { console.error(e); }
    finally { setLoadingInventory(false); }
  };

  const loadAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const params = {
        start_date: filters.startDate, end_date: filters.endDate,
        category: filters.category, region: filters.region
      };
      const [monthly, products, category, region, revenue, anom] = await Promise.allSettled([
        get("/analytics/monthly-sales", params),
        get("/analytics/top-products", params),
        get("/analytics/category-sales"),
        get("/analytics/region-forecast"),
        get("/analytics/revenue-prediction"),
        get("/analytics/detect-anomalies"),
      ]);
      if (monthly.status   === "fulfilled") setMonthlySales(monthly.value);
      if (products.status  === "fulfilled") setTopProducts(products.value);
      if (category.status  === "fulfilled") setCategorySales(category.value);
      if (region.status    === "fulfilled") setRegionForecast(region.value);
      if (revenue.status   === "fulfilled") setRevenuePrediction(revenue.value);
      if (anom.status      === "fulfilled") setAnomalies(anom.value?.anomalies || []);
    } catch (e) { console.error(e); }
    finally { setLoadingAnalytics(false); }
  };

  const loadAI = async () => {
    try {
      setLoadingAI(true);
      const [behavior, recs] = await Promise.allSettled([
        get("/analytics/customer-behavior"),
        get("/analytics/business-recommendations"),
      ]);
      if (behavior.status === "fulfilled") setCustomerBehavior(behavior.value);
      if (recs.status     === "fulfilled") setBusinessRecommendations(recs.value);
    } catch (e) { console.error(e); }
    finally { setLoadingAI(false); }
  };

  const loadSchedule = async () => {
    try {
      const data = await get("/forecast/get-forecast-schedule");
      setIntervalType(data.interval_type);
      setIntervalValue(data.interval_value);
    } catch (e) { console.error(e); }
  };

  const updateSchedule = async () => {
    try {
      await axios.put("http://127.0.0.1:8000/forecast/forecast-schedule",
        { interval_type: intervalType, interval_value: parseInt(intervalValue) },
        { headers }
      );
      toast.success("Forecast Schedule Updated!");
    } catch (e) { toast.error("Failed to update schedule"); }
  };

  const handleGlobalSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const data = await get("/analytics/global-search", { query: searchQuery });
      setSearchResults(data);
      setHasSearched(true);
    } catch (e) { console.error(e); }
  };

  // ── Load tab data on tab switch ──
  useEffect(() => {
    if      (activeTab === "overview")  loadOverview();
    else if (activeTab === "forecast")  loadForecast();
    else if (activeTab === "inventory") loadInventory();
    else if (activeTab === "analytics") loadAnalytics();
    else if (activeTab === "ai")        loadAI();
    else if (activeTab === "settings")  loadSchedule();
  }, [activeTab, filters]);

  // ── Auto-refresh every 30s (only overview) ──
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "overview") loadOverview();
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // ──────────────────────────────────────────────────
  // UI Helpers
  // ──────────────────────────────────────────────────

  const card   = `rounded-2xl border p-6 shadow-sm ${styles.card}`;
  const label  = `text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`;
  const title  = `text-xl font-bold mb-4`;
  const chartBg = darkMode ? "#111827" : "#ffffff";
  const axisColor = darkMode ? "#9ca3af" : "#6b7280";

  const SectionLoader = () => (
    <div className={`flex justify-center items-center h-48 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-4 h-4 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-4 h-4 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );

  const KPICard = ({ label: lbl, value, sub, accent = "text-emerald-500" }) => (
    <div className={card}>
      <p className={`${label} mb-2`}>{lbl}</p>
      <p className={`text-3xl font-bold ${accent}`}>{value ?? "—"}</p>
      {sub && <p className={`text-xs mt-2 ${label}`}>{sub}</p>}
    </div>
  );

  const SectionTitle = ({ children }) => (
    <h2 className="text-2xl font-bold mb-6">{children}</h2>
  );

  // ──────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────
  const visibleTabs = TABS.filter(t => !t.adminOnly || role === "super_admin");

  return (
    <div>

      {/* ── Sticky Tab Navigation ── */}
      <div className={`sticky top-0 z-30 mb-8 border-b ${darkMode ? "bg-gray-950 border-gray-800" : "bg-gray-50 border-gray-200"}`}>

        {/* Search row */}
        <div className="flex gap-3 px-1 pt-4 pb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGlobalSearch()}
            placeholder="Global search — products, forecasts, regions..."
            className={`flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-800"}`}
          />
          <button onClick={handleGlobalSearch}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
            Search
          </button>
        </div>

        {/* Tabs row */}
        <div className="flex gap-1 px-1 overflow-x-auto">
          {visibleTabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === tab.key
                  ? "border-emerald-500 text-emerald-500"
                  : `border-transparent ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search Results ── */}
      {hasSearched && searchResults && (
        <div className={`${card} mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={title}>Search Results</h2>
            <button onClick={() => { setSearchResults(null); setHasSearched(false); setSearchQuery(""); }}
              className={`text-xs font-semibold px-3 py-1 rounded-lg ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}>
              Clear
            </button>
          </div>
          {searchResults.sales?.length > 0 ? (
            <table className="w-full text-sm">
              <thead><tr className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <th className="text-left p-3 font-semibold">Product</th>
                <th className="text-left p-3 font-semibold">Category</th>
                <th className="text-left p-3 font-semibold">Region</th>
              </tr></thead>
              <tbody>
                {searchResults.sales.slice(0, 5).map((item, i) => (
                  <tr key={i} className={`border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
                    <td className="p-3">{item.product}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">{item.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={`text-center py-8 ${label}`}>No results found</p>
          )}
        </div>
      )}

      {/* ── Filters (Analytics tab only) ── */}
      {activeTab === "analytics" && (
        <div className={`${card} mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={title}>Filters</h2>
            <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded-lg transition">
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Start Date", type: "date",   key: "startDate" },
              { label: "End Date",   type: "date",   key: "endDate" },
            ].map(f => (
              <div key={f.key}>
                <label className={`block text-xs font-semibold mb-1 ${label}`}>{f.label}</label>
                <input type={f.type} value={filters[f.key]} onChange={e => setFilters({ ...filters, [f.key]: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-sm outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`} />
              </div>
            ))}
            <div>
              <label className={`block text-xs font-semibold mb-1 ${label}`}>Category</label>
              <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border text-sm outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`}>
                <option value="">All Categories</option>
                {["Clothing","Electronics","Groceries","Home","Sports","Toys"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${label}`}>Region</label>
              <select value={filters.region} onChange={e => setFilters({ ...filters, region: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border text-sm outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`}>
                <option value="">All Regions</option>
                {["North","South","East","West","Central"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          TAB: OVERVIEW
      ═══════════════════════════════════════════ */}
      {activeTab === "overview" && (
        loadingOverview ? <SectionLoader /> : (
          <div className="space-y-8">

            {/* System performance — admin/analyst only */}
            {(role === "super_admin" || role === "analyst") && (
              <div>
                <SectionTitle>System Performance</SectionTitle>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <KPICard label="Total Users"         value={systemPerformance.total_users} />
                  <KPICard label="Sales Records"       value={systemPerformance.total_sales_records} />
                  <KPICard label="Forecasts Generated" value={systemPerformance.total_forecasts_generated} />
                  <KPICard label="API Requests"        value={systemPerformance.total_api_requests} />
                  <KPICard label="Response Time (s)"   value={systemPerformance.api_response_time_seconds} />
                </div>
              </div>
            )}

            {/* KPI cards */}
            <div>
              <SectionTitle>Key Metrics</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard label="Total Revenue"       value={`₹ ${Number((totalSales.total_revenue || 0).toFixed(2)).toLocaleString("en-IN")}`} accent="text-emerald-500" />
                <KPICard label="Total Quantity Sold" value={totalSales.total_quantity_sold || 0} accent="text-blue-500" />
                <KPICard label="Forecast Accuracy"   value={forecastAccuracy.model_performance || "N/A"} sub={`MAE: ${forecastAccuracy.mae || 0}`} accent="text-purple-500" />
              </div>
            </div>

            {/* Alerts */}
            {(role === "super_admin" || role === "analyst") && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <SectionTitle>Alerts</SectionTitle>
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full -mt-4">{alerts.length}</span>
                </div>
                {alerts.length === 0 ? (
                  <div className={`${card} text-center py-8 ${label}`}>No active alerts</div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert, i) => (
                      <div key={i} className={`${card} border-l-4 border-red-500`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-red-500">{alert.alert_type || "Alert"}</p>
                            <p className={`text-sm mt-1 ${label}`}>{alert.message}</p>
                          </div>
                          <span className={`text-xs ${label}`}>
                            {alert.created_at ? new Date(alert.created_at).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Live Sales */}
            {(role === "super_admin" || role === "analyst") && (
              <div>
                <SectionTitle>Live Sales Monitoring</SectionTitle>
                <div className="space-y-3">
                  {recentSales.slice(0, 5).map((sale, i) => (
                    <div key={i} className={`${card} flex items-center justify-between`}>
                      <div>
                        <p className="font-semibold">{sale.product_name}</p>
                        <p className={`text-sm ${label}`}>{sale.category} · {sale.region}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-500">₹ {sale.revenue}</p>
                        <p className={`text-sm ${label}`}>Qty: {sale.quantity_sold}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )
      )}

      {/* ═══════════════════════════════════════════
          TAB: FORECASTING
      ═══════════════════════════════════════════ */}
      {activeTab === "forecast" && (
        loadingForecast ? <SectionLoader /> : (
          <div className="space-y-8">

            {/* Confidence + Accuracy KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {confidenceData && (
                <KPICard label="Forecast Confidence" value={`${confidenceData.average_confidence}%`} sub="Model Agreement Score" accent="text-blue-500" />
              )}
              {accuracyData && (
                <KPICard label="Current Accuracy" value={`${accuracyData.current_accuracy}%`} sub={`Avg: ${accuracyData.average_accuracy}%`} accent="text-emerald-500" />
              )}
            </div>

            {/* Forecast Prediction Graph */}
            <div className={card}>
              <h2 className={title}>Forecast Prediction Graph</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={forecastResults}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="forecast_date" tick={{ fill: axisColor, fontSize: 11 }} />
                  <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: chartBg, border: "none", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="predicted_demand" stroke="#10b981" strokeWidth={2} dot={false} name="Predicted Demand" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Model Comparison */}
            <div className={card}>
              <h2 className={title}>Forecast Model Comparison</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={modelComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 11 }} />
                  <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: chartBg, border: "none", borderRadius: 12 }} />
                  <Legend />
                  <Line type="monotone" dataKey="prophet"           stroke="#6366f1" strokeWidth={2} dot={false} name="Prophet" />
                  <Line type="monotone" dataKey="linear_regression"  stroke="#f59e0b" strokeWidth={2} dot={false} name="Linear Regression" />
                  <Line type="monotone" dataKey="moving_average"     stroke="#ec4899" strokeWidth={2} dot={false} name="Moving Average" />
                  <Line type="monotone" dataKey="ensemble"           stroke="#10b981" strokeWidth={3} dot={false} name="Ensemble" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Forecast History Comparison */}
            <div className={card}>
              <h2 className={title}>Forecast vs Actual Comparison</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={forecastComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="forecast_date" tick={{ fill: axisColor, fontSize: 11 }} />
                  <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: chartBg, border: "none", borderRadius: 12 }} />
                  <Legend />
                  <Line type="monotone" dataKey="actual_sales"    stroke="#16a34a" strokeWidth={3} dot={false} name="Actual Sales" />
                  <Line type="monotone" dataKey="predicted_sales" stroke="#2563eb" strokeWidth={3} dot={false} name="Predicted Sales" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Seasonal Trends */}
            <div className={card}>
              <h2 className={title}>Seasonal Trend Analysis</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={seasonalTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="forecast_date" tick={{ fill: axisColor, fontSize: 11 }} />
                  <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: chartBg, border: "none", borderRadius: 12 }} />
                  <Legend />
                  <Line type="monotone" dataKey="predicted_demand" stroke="#2563eb" strokeWidth={2} dot={false} name="Predicted Demand" />
                  <Line type="monotone" dataKey="sales_trend"      stroke="#16a34a" strokeWidth={2} dot={false} name="Sales Trend" />
                  <Line type="monotone" dataKey="weekly_pattern"   stroke="#ea580c" strokeWidth={2} dot={false} name="Weekly Pattern" />
                  <Line type="monotone" dataKey="yearly_pattern"   stroke="#9333ea" strokeWidth={2} dot={false} name="Yearly Pattern" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Accuracy Trend */}
            {accuracyData && (
              <div className={card}>
                <h2 className={title}>Accuracy Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={accuracyData.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 11 }} />
                    <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: chartBg, border: "none", borderRadius: 12 }} />
                    <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} dot={false} name="Accuracy %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Navigation shortcuts */}
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => navigate("/forecast")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                → Generate Forecast
              </button>
              <button onClick={() => navigate("/reports")}
                className={`border px-5 py-2.5 rounded-xl text-sm font-semibold transition ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>
                → View Reports
              </button>
              <button onClick={() => navigate("/projects")}
                className={`border px-5 py-2.5 rounded-xl text-sm font-semibold transition ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>
                → Workspaces
              </button>
            </div>

          </div>
        )
      )}

      {/* ═══════════════════════════════════════════
          TAB: INVENTORY
      ═══════════════════════════════════════════ */}
      {activeTab === "inventory" && (
        loadingInventory ? <SectionLoader /> : (
          <div className="space-y-8">

            {/* Global Stock Risk */}
            {stockRisk && (
              <div>
                <SectionTitle>Global Inventory Risk</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <KPICard label="Total Stock"      value={stockRisk.total_stock} />
                  <KPICard label="Projected Demand" value={stockRisk.projected_demand} />
                  <KPICard label="Remaining Stock"  value={stockRisk.remaining_stock}
                    accent={stockRisk.risk === "High" ? "text-red-500" : stockRisk.risk === "Medium" ? "text-yellow-500" : "text-emerald-500"} />
                </div>
              </div>
            )}

            {/* Inventory Risk Table */}
            <div className={card}>
              <h2 className={title}>Inventory Risk Analysis</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    {["Product","Stock Available","Predicted Demand","Risk Level"].map(h => (
                      <th key={h} className="text-left p-3 font-semibold">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {inventoryRisk.slice(0, 5).map((item, i) => (
                      <tr key={i} className={`border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
                        <td className="p-3">{item.product}</td>
                        <td className="p-3">{item.stock_available}</td>
                        <td className="p-3">{item.predicted_demand}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${item.risk_level === "High Risk" ? "bg-red-600" : item.risk_level === "Medium Risk" ? "bg-yellow-500" : "bg-emerald-600"}`}>
                            {item.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inventory Optimization */}
            {inventoryOptimization && (
              <div className={card}>
                <h2 className={title}>AI Inventory Optimization</h2>
                <div className="space-y-3">
                  <p className={label}>Current Stock: <span className="font-semibold ml-2">{inventoryOptimization.total_stock}</span></p>
                  <p className={label}>Projected Demand: <span className="font-semibold ml-2">{Math.round(inventoryOptimization.projected_demand)}</span></p>
                  <div className="mt-4">
                    <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
                      inventoryOptimization.suggestion === "Order More Inventory" ? "bg-emerald-100 text-emerald-700" :
                      inventoryOptimization.suggestion === "Reduce Purchasing"    ? "bg-red-100 text-red-700" :
                                                                                    "bg-blue-100 text-blue-700"
                    }`}>
                      {inventoryOptimization.suggestion === "Order More Inventory" ? "🚚 " :
                       inventoryOptimization.suggestion === "Reduce Purchasing"    ? "📦 " : "✅ "}
                      {inventoryOptimization.suggestion}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Demand Spikes */}
            <div className={card}>
              <h2 className={title}>Demand Spike Alerts</h2>
              {demandSpikes.length === 0 ? (
                <p className={`text-center py-8 ${label}`}>No demand spikes detected</p>
              ) : (
                <div className="space-y-3">
                  {demandSpikes.map((spike, i) => (
                    <div key={i} className={`flex items-center justify-between border-b pb-3 ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
                      <div>
                        <p className="font-semibold">{spike.forecast_date}</p>
                        <p className={`text-sm ${label}`}>Increase: {spike.spike_percentage}%</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${spike.severity === "High" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {spike.severity === "High" ? "🔴" : "🟡"} {spike.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Demand Recommendations */}
            <div className={card}>
              <h2 className={title}>AI Demand Recommendations</h2>
              {recommendations.length === 0 ? (
                <p className={`text-center py-8 ${label}`}>No recommendations available</p>
              ) : (
                <div className="space-y-3">
                  {recommendations.slice(0, 5).map((item, i) => (
                    <div key={i} className={`flex items-center justify-between border-b pb-3 ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
                      <div>
                        <p className="font-semibold">{item.forecast_date}</p>
                        <p className={`text-sm ${label}`}>Demand: {Number(item.predicted_demand).toFixed(2)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.recommendation === "Increase Inventory" ? "bg-emerald-100 text-emerald-700" :
                        item.recommendation === "Reduce Inventory"   ? "bg-red-100 text-red-700" :
                                                                        "bg-blue-100 text-blue-700"
                      }`}>
                        {item.recommendation === "Increase Inventory" ? "📈 Increase" :
                         item.recommendation === "Reduce Inventory"   ? "📉 Reduce" : "➖ Maintain"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )
      )}

      {/* ═══════════════════════════════════════════
          TAB: ANALYTICS
      ═══════════════════════════════════════════ */}
      {activeTab === "analytics" && (
        loadingAnalytics ? <SectionLoader /> : (
          <div className="space-y-8">

            {/* Monthly Sales + Top Products side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={card}>
                <h2 className={title}>Monthly Sales Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} />
                    <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: chartBg, border: "none", borderRadius: 12 }} />
                    <Line type="monotone" dataKey="total_revenue" stroke="#10b981" strokeWidth={2} dot={false} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={card}>
                <h2 className={title}>Top Products</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis dataKey="product_name" tick={{ fill: axisColor, fontSize: 10 }} />
                    <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: chartBg, border: "none", borderRadius: 12 }} />
                    <Bar dataKey="total_quantity_sold" fill="#6366f1" radius={[6, 6, 0, 0]} name="Qty Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional + Category side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={card}>
                <h2 className={title}>Region-wise Forecast</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionForecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis dataKey="region" tick={{ fill: axisColor, fontSize: 11 }} />
                    <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: chartBg, border: "none", borderRadius: 12 }} />
                    <Bar dataKey="forecasted_demand" fill="#16a34a" radius={[6, 6, 0, 0]} name="Forecasted Demand" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={card}>
                <h2 className={title}>Category-wise Sales</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categorySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis dataKey="category" tick={{ fill: axisColor, fontSize: 11 }} />
                    <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: chartBg, border: "none", borderRadius: 12 }} />
                    <Bar dataKey="total_sales" fill="#2563eb" radius={[6, 6, 0, 0]} name="Total Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Prediction */}
            <div className={card}>
              <h2 className={title}>Revenue Prediction Analytics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenuePrediction}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="forecast_date" tick={{ fill: axisColor, fontSize: 11 }} />
                  <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: chartBg, border: "none", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="predicted_revenue" stroke="#dc2626" strokeWidth={3} dot={false} name="Predicted Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Anomaly Detection */}
            {(role === "super_admin" || role === "analyst") && (
              <div className={card}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-red-500">AI Anomaly Detection</h2>
                  <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">{anomalies.length} Alerts</span>
                </div>
                {anomalies.length === 0 ? (
                  <p className={`text-center py-8 ${label}`}>No anomalies detected</p>
                ) : (
                  <div className="space-y-3">
                    {anomalies.slice(0, 5).map((item, i) => (
                      <div key={i} className="border border-red-200 bg-red-50 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-red-700">{item.product_name}</p>
                            <p className="text-sm text-gray-600">{item.region}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">Qty: {item.quantity_sold}</p>
                            <p className="text-sm text-gray-500">{item.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )
      )}

      {/* ═══════════════════════════════════════════
          TAB: AI INSIGHTS
      ═══════════════════════════════════════════ */}
      {activeTab === "ai" && (
        loadingAI ? <SectionLoader /> : (
          <div className="space-y-8">

            {/* Customer Behavior */}
            {customerBehavior && (
              <div className={card}>
                <h2 className={title}>Customer Buying Behavior</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Total Customers",  value: customerBehavior.total_customers },
                    { label: "Repeat Customers", value: customerBehavior.repeat_customers },
                    { label: "Top Segment",      value: customerBehavior.top_segment },
                    { label: "Top Gender",       value: customerBehavior.top_gender },
                    { label: "Top Age Group",    value: customerBehavior.top_age_group },
                  ].map((kpi, i) => (
                    <div key={i} className={`rounded-xl p-4 border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                      <p className={`text-xs mb-1 ${label}`}>{kpi.label}</p>
                      <p className="font-bold">{kpi.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Recommendations */}
            <div className={card}>
              <h2 className={title}>Business Recommendations</h2>
              {businessRecommendations.length === 0 ? (
                <p className={`text-center py-8 ${label}`}>No recommendations available</p>
              ) : (
                <div className="space-y-3">
                  {businessRecommendations.map((item, i) => (
                    <div key={i} className={`flex items-start gap-3 border-b pb-3 ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0 ${
                        item.priority === "High"   ? "bg-red-100 text-red-700" :
                        item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                                     "bg-emerald-100 text-emerald-700"
                      }`}>{item.priority}</span>
                      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigate to AI Insights full page */}
            <div className="flex gap-3">
              <button onClick={() => navigate("/download-summary")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                → Full Analytics Summary
              </button>
            </div>

          </div>
        )
      )}

      {/* ═══════════════════════════════════════════
          TAB: SETTINGS (super_admin only)
      ═══════════════════════════════════════════ */}
      {activeTab === "settings" && role === "super_admin" && (
        <div className="space-y-6 max-w-lg">
          <div className={card}>
            <h2 className={title}>Forecast Schedule</h2>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${label}`}>Interval Type</label>
              <select value={intervalType} onChange={(e) => setIntervalType(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`}>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
              </select>
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-medium mb-1 ${label}`}>Interval Value</label>
              <input type="number" value={intervalValue} onChange={(e) => setIntervalValue(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border outline-none ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-800"}`} />
            </div>

            <button onClick={updateSchedule}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition">
              Save Schedule
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default DashboardAnalytics;
