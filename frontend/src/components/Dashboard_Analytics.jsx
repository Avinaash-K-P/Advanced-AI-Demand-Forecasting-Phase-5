import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


function DashboardAnalytics({darkMode}) {
  //To get user role
  const role = localStorage.getItem("role")  
  
  //To fetch api
  const [hasSearched, setHasSearched] = useState(false);  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);    
  const [forecastComparison,setForecastComparison] = useState([]);
  const [systemPerformance, setSystemPerformance] = useState({});  
  const [inventoryRisk, setInventoryRisk] = useState([]);
  const [revenuePrediction, setRevenuePrediction] = useState([]);
  const [categorySales, setCategorySales] = useState([]);  
  const [regionForecast, setRegionForecast] = useState([]);
  const [anomalies, setAnomalies] = useState([]);  
  const [seasonalTrends, setSeasonalTrends] = useState([]);  
  const [recentSales, setRecentSales] = useState([]);
  const [totalSales, setTotalSales] = useState({})
  const [forecastAccuracy, setForecastAccuracy] = useState({});
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [forecastResults, setForecastResults] = useState([]);
  const [filters, setFilters] = useState({

    startDate: "",

    endDate: "",

    category: "",

    region: ""
})

const clearFilters = () => {

    setFilters({

        startDate: "",

        endDate: "",

        category: "",

        region: ""
    })
}


   // Global search
   const handleGlobalSearch = async () => {

    try {

        const response = await axios.get(

            "http://127.0.0.1:8000/analytics/global-search",

            {

                params: {

                    query: searchQuery
                },

                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );


        setSearchResults(
            response.data.data
        );
        setHasSearched(true)
        
    }

    catch(error){

        console.error(error);
    }
};

  // Forecast history comparison
  const fetchForecastComparison = async () => {

    try {

        const response = await axios.get(

            "http://127.0.0.1:8000/forecast/forecast-comparison",

            {

                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );


        setForecastComparison(
            response.data.data
        );

    }

    catch(error){

        console.error(error);
    }
};
  

  // System performance metrics
  const fetchSystemPerformance = async () => {

    try {

        const response = await axios.get(

            "http://127.0.0.1:8000/analytics/system-performance",
            {
                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        setSystemPerformance(
            response.data.data
        );
    }
    catch(error){

        console.error(error);
    }
};  

  // Inventory risk prediction
  const fetchInventoryRisk = async () => {

    try {

        const response = await axios.get(

            "http://127.0.0.1:8000/analytics/inventory-risk",

            {

                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );


        setInventoryRisk(
            response.data.data
        );

    }

    catch(error){

        console.error(error);
    }
}; 
  
  // Revenue prediction
   const fetchRevenuePrediction = async () => {
    try {
        const response = await axios.get(

            "http://127.0.0.1:8000/analytics/revenue-prediction",

            {

                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
       setRevenuePrediction(
            response.data.data
        );
    }

    catch(error){

        console.error(error);
    }
};  

  // Category wise analytics
  const fetchCategorySales = async () => {
    try {
        const response = await axios.get(

            "http://127.0.0.1:8000/analytics/category-sales",

            {

                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        setCategorySales(
            response.data.data
        );

    }

    catch(error){

        console.error(error);
    }
};

  // Region wise analytics
  const fetchRegionForecast = async () => {
    try {
        const response = await axios.get(
            "http://127.0.0.1:8000/analytics/region-forecast",
            {
                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        setRegionForecast(
            response.data.data
        );
    }
    catch(error){

        console.error(error);
    }
};
  

  // Anomalies detection
  const fetchAnomalies = async () => {
    try{
        const response = await axios.get(
    
        "http://127.0.0.1:8000/analytics/detect-anomalies",
        {
            headers:{
                Authorization:
                `Bearer ${localStorage.getItem("token")}`
            }
        }
    );
    setAnomalies(response.data.data.anomalies);
    }
    catch(error){console.error(error);}
  }
  
  // Seasonal Trends  
  const fetchSeasonalTrends = async () => {

    try{ 
        const response = await axios.get(

        "http://127.0.0.1:8000/analytics/seasonal-trends",

        {

            headers: {

                Authorization:
                `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    setSeasonalTrends(response.data.data);}
    catch(error){console.error(error);}

};


  // Fetch recent sales
  const fetchRecentSales = async () => {

    try{
        const response = await axios.get(
        "http://127.0.0.1:8000/analytics/recent-sales",

        {

            headers: {

                Authorization:
                `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    setRecentSales(response.data.data);
    }
    catch(error){console.error(error);}
    
};


  // Fetch total sales
  const fetchTotalSales = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/analytics/total-sales",
         {
                params: {

                    start_date:
                        filters.startDate,

                    end_date:
                        filters.endDate,

                    category:
                        filters.category,

                    region:
                        filters.region
                },        
          headers: {
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
            }
        }
      );
      setTotalSales(response.data.data);
    } 
    catch (error) {
      console.error(error);
    }
  };

  // Fetch forecast accuracy
  const fetchForecastAccuracy = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/analytics/forecast-accuracy",
        {                     
          headers: {
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
            }
        }
      );
      setForecastAccuracy(response.data.data);
    } 
    catch (error) {
      console.error(error);
    }
  };

  // Fetch monthly sales
  const fetchMonthlySales = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/analytics/monthly-sales",
        { 
          params: {
                    start_date:
                        filters.startDate,

                    end_date:
                        filters.endDate,

                    category:
                        filters.category,

                    region:
                        filters.region
                },     
          headers: {
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
            }
        }
      );
      setMonthlySales(response.data.data);
    }
    catch (error) {
      console.error(error);
    }   
  };

  // Fetch top products
  const fetchTopProducts = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/analytics/top-products",
        {                
          params: {

                    start_date:
                        filters.startDate,

                    end_date:
                        filters.endDate,

                    category:
                        filters.category,

                    region:
                        filters.region
                },     
          headers: {
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
            }
        }
      );
      setTopProducts(response.data.data);
    }
    catch (error){
      console.error(error);
    }    
  };

  // Fetch forecast results
  const fetchForecastResults = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/analytics/forecast-results",
        {                
          headers: {
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
            }
        }
      );
      setForecastResults(response.data.data.items);
    }
    catch (error) {
      console.error(error);
    }
    
  };

  useEffect(() => {
    fetchTotalSales();
    fetchMonthlySales();
    fetchTopProducts();

       // Auto Refresh Every 30 Seconds
    const interval = setInterval(() => {

        fetchTotalSales();

        fetchMonthlySales();

        fetchTopProducts();

        console.log("Live dashboard refreshed");

    }, 30000);


    // Cleanup
    return () => clearInterval(interval);

    
  }, [filters]);

  useEffect(()=>{

    fetchForecastAccuracy();
    fetchForecastResults();
    fetchRecentSales();
    fetchSeasonalTrends();
    fetchAnomalies();
    fetchRegionForecast();
    fetchCategorySales();
    fetchRevenuePrediction();
    fetchInventoryRisk();
    fetchSystemPerformance();
    fetchForecastComparison();
    handleGlobalSearch();

           // Auto Refresh Every 30 Seconds
    const interval = setInterval(() => {

      fetchForecastAccuracy();

      fetchForecastResults();

      fetchRecentSales();

      fetchSeasonalTrends();

      fetchAnomalies();

      fetchRegionForecast();

      fetchCategorySales();

      fetchRevenuePrediction();

      fetchInventoryRisk();

      fetchSystemPerformance();

      fetchForecastComparison();

      handleGlobalSearch();

      console.log("Live dashboard refreshed");

    }, 30000);

    // Cleanup
    return () => clearInterval(interval);


  },[]);

return (

<div
    classname="
    grid
    grid-cols-1
    md:grid-cols-2
    xl:grid-cols-3
    gap-6">

    {/*Global Search*/}
    <div className="
    flex
    gap-4
    mb-6
    ">

    <input

        type="text"

        placeholder="Global Search..."

        value={searchQuery}

        onChange={(e)=>
            setSearchQuery(
                e.target.value
            )
        }

        className="
            flex-1
            p-4
            border
            rounded-2xl
        "
    />


    <button

        onClick={handleGlobalSearch}

        className="
            bg-blue-600
            text-white
            px-6
            rounded-2xl
        "
    >

        Search

    </button>

</div>

{/*Display search result*/}

{ hasSearched && searchResults && (

    <div className="
        bg-white
        rounded-2xl
        shadow-lg
        p-6
        mt-6
    ">

        <h2 className="
            text-2xl
            font-bold
            mb-4
        ">

            Search Results

        </h2>


{
    searchResults.sales?.length > 0 ? (

           <table className="
            min-w-full
         ">

            <thead className="
                bg-gray-100
            ">

                <tr>

                    <th className="p-4 text-left">
                        Product
                    </th>

                    <th className="p-4 text-left">
                        Category
                    </th>

                    <th className="p-4 text-left">
                        Region
                    </th>

                </tr>

            </thead>


            <tbody>

                {

                    searchResults.sales.slice(0,10).map(

                        (item,index)=>(

                        <tr
                            key={index}
                            className="
                                border-b
                            "
                        >

                            <td className="p-4">

                                {item.product}

                            </td>

                            <td className="p-4">

                                {item.category}

                            </td>

                            <td className="p-4">

                                {item.region}

                            </td>

                        </tr>
                    ))
                }

            </tbody>

        </table>
    
        ) : 
        
(
        <div className="
            text-center
            text-gray-500
            p-10
        ">

            No Results Found

        </div>
    )
}

    </div>
)}
<br/>
{ (role =="super_admin" || role == "analyst") &&

(<>

{/*System Performance Metrics*/}

        <h2 className="
        text-2xl
        font-bold
        mb-6
        text-gray-800
    ">

        System Performance Metrics

    </h2>
    
<div className="
    grid
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-5
    gap-6
">

    <div className="
        bg-white
        rounded-2xl
        shadow-lg
        p-6
    ">

        <h3 className="
            text-gray-500
            mb-2
        ">

            Total Users

        </h3>

        <p className="
            text-3xl
            font-bold
        ">

            {
                systemPerformance.total_users
            }

        </p>

    </div>


    <div className="
        bg-white
        rounded-2xl
        shadow-lg
        p-6
    ">

        <h3 className="
            text-gray-500
            mb-2
        ">

            Sales Records

        </h3>

        <p className="
            text-3xl
            font-bold
        ">

            {
                systemPerformance.total_sales_records
            }

        </p>

    </div>


    <div className="
        bg-white
        rounded-2xl
        shadow-lg
        p-6
    ">

        <h3 className="
            text-gray-500
            mb-2
        ">

            Forecasts Generated

        </h3>

        <p className="
            text-3xl
            font-bold
        ">

            {
                systemPerformance.total_forecasts_generated
            }

        </p>

    </div>


    <div className="
        bg-white
        rounded-2xl
        shadow-lg
        p-6
    ">

        <h3 className="
            text-gray-500
            mb-2
        ">

            API Requests

        </h3>

        <p className="
            text-3xl
            font-bold
        ">

            { systemPerformance.total_api_requests }

        </p>

    </div>

    <div className="
        bg-white
        rounded-2xl
        shadow-lg
        p-6
    ">

        <h3 className="
            text-gray-500
            mb-2
        ">

            API Response Time

        </h3>

        <p className="
            text-3xl
            font-bold
        ">

            {
                systemPerformance.api_response_time_seconds
            }s

        </p>

    </div>

</div>

</>)

}
<br/>
{/*Filter Method*/}
<div className="
    bg-white
    p-6
    rounded-2xl
    shadow-lg
    mt-6
">

    {/* Header */}
    <div className="
        flex
        justify-between
        items-center
        mb-6
    ">

        <h2 className="
            text-2xl
            font-bold
        ">

            Filters

        </h2>

        <button

            onClick={clearFilters}

            className="
                bg-red-500
                hover:bg-red-600
                text-white
                px-4
                py-2
                rounded-xl
            "
        >

            Clear

        </button>

    </div>

    {/* Filter Grid */}
    <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
    ">

        {/* Start Date */}
        <div>

            <label className="
                block
                font-semibold
                mb-2
            ">

                Start Date

            </label>

            <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        startDate: e.target.value
                    })
                }
                className="
                    border
                    p-3
                    rounded-xl
                    w-full
                "
            />

        </div>

        {/* Category */}
        <div>

            <label className="
                block
                font-semibold
                mb-2
            ">

                Category

            </label>

            <select
                value={filters.category}
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        category: e.target.value
                    })
                }
                className="
                    border
                    p-3
                    rounded-xl
                    w-full
                "
            >

            <option value = "">All Categories </option>
            
            <option value = "Clothing">Clothing</option>
            
            <option value = "Electronics">Electronics</option>
            
            <option value = "Groceries">Groceries</option>
            
            <option value = "Home">Home</option>
            
            <option value = "Sports">Sports</option>
            
            <option value = "Toys">Toys</option>

            </select>

        </div>

        {/* End Date */}
        <div>

            <label className="
                block
                font-semibold
                mb-2
            ">

                End Date

            </label>

            <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        endDate: e.target.value
                    })
                }
                className="
                    border
                    p-3
                    rounded-xl
                    w-full
                "
            />

        </div>

        {/* Region */}
        <div>

            <label className="
                block
                font-semibold
                mb-2
            ">

                Region

            </label>

            <select
                value={filters.region}
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        region: e.target.value
                    })
                }
                className="
                    border
                    p-3
                    rounded-xl
                    w-full
                "
            >

                <option value="">
                    All Regions
                </option>

                <option value="North">
                    North
                </option>

                <option value="South">
                    South
                </option>

                <option value="East">
                    East
                </option>
                
                <option value="West">
                    West
                </option>

                <option value="Central">
                    Central
                </option>

            </select>

        </div>

    </div>

</div>
<br/>
    {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Revenue */}
        <div className={`${darkMode?"bg-gray-900":"bg-white"} rounded-2xl shadow-lg p-6 `}>

          <h2 className="text-gray-500 text-lg">
            Total Revenue
          </h2>

          <p className="text-3xl font-bold mt-4">
            ₹ {Number(totalSales.total_revenue).toFixed(2) || 0}
          </p>

        </div>

        {/* Total Quantity */}
        <div className={`${darkMode?"bg-gray-900":"bg-white"} rounded-2xl shadow-lg p-6 `}>

          <h2 className="text-gray-500 text-lg">
            Total Quantity Sold
          </h2>

          <p className="text-3xl font-bold mt-4">
            {totalSales.total_quantity_sold || 0}
          </p>

        </div>

        {/* Forecast Accuracy */}
        <div className={`${darkMode?"bg-gray-900":"bg-white"} rounded-2xl shadow-lg p-6 `}>

          <h2 className="text-gray-500 text-lg">
            Forecast Accuracy
          </h2>

          <p className="text-3xl font-bold mt-4">
            {forecastAccuracy.model_performance || "N/A"}
          </p>

          <p className="text-gray-500 mt-2">
            {forecastAccuracy.mae || 0}
          </p>

        </div>

      </div>
<br/>
      {/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

  {/* Monthly Sales Chart */}
  <div className={`stroke={darkMode ? "#ffffff" : "#000000"} rounded-2xl shadow-lg p-6`}>

    <h2 className="text-2xl font-bold mb-4">
      Monthly Sales Trends
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <LineChart data={monthlySales}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="total_revenue"
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

  {/* Top Products Chart */}
  <div className={`stroke={darkMode ? "#ffffff" : "#000000"} rounded-2xl shadow-lg p-6`}>

    <h2 className="text-2xl font-bold mb-4">
      Top Products
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >

      <BarChart data={topProducts}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="product_name" />

        <YAxis />

        <Tooltip />

        <Bar dataKey="total_quantity_sold" fill="#8884d8" />

      </BarChart>

    </ResponsiveContainer>

  </div>

</div>
<br/>
{/* Forecast Graph */}
<div className={`stroke={darkMode ? "#ffffff" : "#000000"} rounded-2xl shadow-lg p-6 mt-10`}>

  <h2 className="text-2xl font-bold mb-4">
    Forecast Prediction Graph
  </h2>

  <ResponsiveContainer
    width="100%"
    height={400}
  >

    <LineChart data={forecastResults}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="forecast_date" />

      <YAxis />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="predicted_demand"
      />

    </LineChart>

  </ResponsiveContainer>

</div>
<br/>
{ 
    (role == "super_admin" || role == "analyst") &&

( <>
{/*Live Monitoring*/}
<div className={`${darkMode?"bg-gray-900":"bg-white"} rounded-2xl shadow-lg p-6 `}>

    <h2 className="
        text-2xl
        font-bold
        mb-6
    ">

        Live Sales Monitoring

    </h2>


    <div className="
        space-y-4
    ">

        {

            recentSales.slice(0,5).map((sale, index) => (

                <div

                    key={index}

                    className="
                        border
                        rounded-xl
                        p-4
                        hover:bg-gray-50
                        transition-all
                    "
                >

                    <div className="
                        flex
                        justify-between
                    ">

                        <div>

                            <h3 className="
                                font-semibold
                            ">

                                {sale.product_name}

                            </h3>

                            <p className="
                                text-sm
                                text-gray-500
                            ">

                                {sale.category} • {sale.region}

                            </p>

                        </div>


                        <div className="
                            text-right
                        ">

                            <p className="
                                font-bold
                                text-green-600
                            ">

                                ₹ {sale.revenue}

                            </p>

                            <p className="
                                text-sm
                                text-gray-500
                            ">

                                Qty: {sale.quantity_sold}

                            </p>

                        </div>

                    </div>

                </div>
            ))
        }

    </div>

</div>
    
    </>)
}
<br/>
{/*Seasonal Trend*/}
<div className={`${darkMode?"bg-gray-900":"bg-white"} rounded-2xl shadow-lg p-6 `}>

    <h2 className="
        text-2xl
        font-bold
        mb-6
    ">

        Seasonal Trend Analysis

    </h2>


    <ResponsiveContainer
        width="100%"
        height={400}
    >

        <LineChart
            data={seasonalTrends}
        >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="forecast_date" />

            <YAxis />

            <Tooltip />

            <Legend />


            <Line

                type="monotone"

                dataKey="predicted_demand"

                stroke="#2563eb"

                strokeWidth={3}

                name="Predicted Demand"
            />


            <Line

                type="monotone"

                dataKey="sales_trend"

                stroke="#16a34a"

                strokeWidth={2}

                name="Sales Trend"
            />


            <Line

                type="monotone"

                dataKey="weekly_pattern"

                stroke="#ea580c"

                strokeWidth={2}

                name="Weekly Pattern"
            />


            <Line

                type="monotone"

                dataKey="yearly_pattern"

                stroke="#9333ea"

                strokeWidth={2}

                name="Yearly Pattern"
            />

        </LineChart>

    </ResponsiveContainer>

</div>

{ 
   (role == "super_admin" || role == "analyst") &&

(<>
<br/>
{/*Anomaly Detection*/}
<div className={`${darkMode?"bg-gray-900":"bg-white"} rounded-2xl shadow-lg p-6 `}>

    <div className="
        flex
        justify-between
        items-center
        mb-6
    ">

        <h2 className="
            text-2xl
            font-bold
            text-red-600
        ">

            AI Anomaly Detection

        </h2>


        <div className="
            bg-red-100
            text-red-700
            px-4
            py-2
            rounded-xl
            font-semibold
        ">

            {anomalies.length} Alerts

        </div>

    </div>


    {

        anomalies.length === 0 ? (

            <div className="
                text-center
                text-gray-500
                p-8
            ">

                No anomalies detected

            </div>

        ) : (

            <div className="
                space-y-4
            ">

                {

                    anomalies.slice(0,5).map((item, index) => (

                        <div

                            key={index}

                            className="
                                border
                                border-red-300
                                bg-red-50
                                rounded-2xl
                                p-4
                            "
                        >

                            <div className="
                                flex
                                justify-between
                                items-center
                            ">

                                <div>

                                    <h3 className="
                                        font-bold
                                        text-red-700
                                    ">

                                        {item.product_name}

                                    </h3>

                                    <p className="
                                        text-sm
                                        text-gray-600
                                    ">

                                        {item.region}

                                    </p>

                                </div>


                                <div className="
                                    text-right
                                ">

                                    <p className="
                                        font-bold
                                        text-red-600
                                        text-lg
                                    ">

                                        Qty: {item.quantity_sold}

                                    </p>

                                    <p className="
                                        text-sm
                                        text-gray-500
                                    ">

                                        {item.date}

                                    </p>

                                </div>

                            </div>

                        </div>
                    ))
                }

            </div>
        )
    }

</div>

</>)
}
<br/>
{/*Regional Analytics*/}
<div className={`${darkMode?"bg-gray-900":"bg-white"} rounded-2xl shadow-lg p-6 `}>

    <h2 className="
        text-2xl
        font-bold
        mb-6
        text-gray-800
    ">

        Region-wise Forecast Analytics

    </h2>


    <ResponsiveContainer
        width="100%"
        height={350}
    >

        <BarChart
            data={regionForecast}
        >

            <CartesianGrid
                strokeDasharray="3 3"
            />

            <XAxis
                dataKey="region"
            />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar

                dataKey="forecasted_demand"

                fill="#16a34a"

                radius={[10,10,0,0]}
            />

        </BarChart>

    </ResponsiveContainer>

</div>
<br/>
{/*Category wise*/}
<div className={`${darkMode?"bg-gray-900":"bg-white"} rounded-2xl shadow-lg p-6 `}>

    <h2 className="
        text-2xl
        font-bold
        mb-6
        text-gray-800
    ">

        Category-wise Sales Insights

    </h2>


    <ResponsiveContainer
        width="100%"
        height={350}
    >

        <BarChart
            data={categorySales}
        >

            <CartesianGrid
                strokeDasharray="3 3"
            />

            <XAxis
                dataKey="category"
            />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar

                dataKey="total_sales"

                fill="#2563eb"

                radius={[10,10,0,0]}
            />

        </BarChart>

    </ResponsiveContainer>

</div>

<br/>
{/*Revenue Prediction*/}
<div className={`${darkMode?"bg-gray-900":"bg-white"} rounded-2xl shadow-lg p-6 `}>

    <h2 className="
        text-2xl
        font-bold
        mb-6
        text-gray-800
    ">

        Revenue Prediction Analytics

    </h2>


    <ResponsiveContainer
        width="100%"
        height={350}
    >

        <LineChart
            data={revenuePrediction}
        >

            <CartesianGrid
                strokeDasharray="3 3"
            />

            <XAxis
                dataKey="forecast_date"
            />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line

                type="monotone"

                dataKey="predicted_revenue"

                stroke="#dc2626"

                strokeWidth={3}

                 dot={true}
            />

        </LineChart>

    </ResponsiveContainer>

</div>

<br/>
<br/>
{
    (role == "super_admin" || role == "analyst") &&

( <>
{/*Inventory Risk Analysis*/}
<div className={`${darkMode?"bg-gray-900":"bg-white"} rounded-2xl shadow-lg p-6 `}>

    <h2 className="
        text-2xl
        font-bold
        mb-6
        text-gray-800
    ">

        Inventory Risk Analysis

    </h2>


    <div className="overflow-x-auto">

        <table className="
            min-w-full
            border-collapse
        ">

            <thead>

                <tr className="
                    bg-gray-100
                ">

                    <th className="p-4 text-left">
                        Product
                    </th>

                    <th className="p-4 text-left">
                        Stock Available
                    </th>

                    <th className="p-4 text-left">
                        Predicted Demand
                    </th>

                    <th className="p-4 text-left">
                        Risk Level
                    </th>

                </tr>

            </thead>


            <tbody>

                {

                    inventoryRisk.slice(0,5).map((item,index)=>(

                        <tr
                            key={index}
                            className="
                                border-b
                            "
                        >

                            <td className="p-4">

                                {item.product}

                            </td>


                            <td className="p-4">

                                {item.stock_available}

                            </td>


                            <td className="p-4">

                                {item.predicted_demand}

                            </td>


                            <td className="p-4">

                                <span className={`

                                    px-3
                                    py-1
                                    rounded-full
                                    text-white
                                    text-sm

                                    ${

                                        item.risk_level === "High Risk"

                                        ? "bg-red-600"

                                        : item.risk_level === "Medium Risk"

                                        ? "bg-yellow-500"

                                        : "bg-green-600"
                                    }
                                `}>

                                    {item.risk_level}

                                </span>

                            </td>

                        </tr>
                    ))
                }

            </tbody>

        </table>

    </div>

</div>

</>) 
}
<br/>
{/*Forecast History Comparison*/}
<div className={`${darkMode?"bg-gray-900":"bg-white"} rounded-2xl shadow-lg p-6 `}>

    <h2 className="
        text-2xl
        font-bold
        mb-6
        text-gray-800
    ">

        Forecast Comparison Report

    </h2>


    <ResponsiveContainer
        width="100%"
        height={400}
    >

        <LineChart
            data={forecastComparison}
        >

            <CartesianGrid
                strokeDasharray="3 3"
            />

            <XAxis
                dataKey="forecast_date"
            />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line

                type="monotone"

                dataKey="actual_sales"

                stroke="#16a34a"

                strokeWidth={3}

                name="Actual Sales"
            />


            <Line

                type="monotone"

                dataKey="predicted_sales"

                stroke="#2563eb"

                strokeWidth={3}

                name="Predicted Sales"
            />

        </LineChart>

    </ResponsiveContainer>

 </div>

</div>

);

}

export default DashboardAnalytics;