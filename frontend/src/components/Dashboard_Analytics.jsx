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
import { toast } from "react-toastify";

function DashboardAnalytics({darkMode}) {
  //To get user role
  const role = localStorage.getItem("role")  

  //To show alert messages
  const [alerts, setAlerts] = useState([]); 
    
  //To schedule interval
  const [intervalType, setIntervalType] = useState("minutes");
  const [intervalValue, setIntervalValue] = useState(10);

  //To fetch api
  const [businessRecommendations,setBusinessRecommendations] = useState([]);
  const [confidenceData,setConfidenceData] = useState(null);
  const [accuracyData,setAccuracyData] = useState(null);
  const [modelComparison, setModelComparison] = useState([]);
  const [customerBehavior,setCustomerBehavior] =useState(null);
  const [inventoryOptimization,setInventoryOptimization] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [demandSpikes, setDemandSpikes] = useState([]);
  const [stockRisk, setStockRisk] = useState(null);
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
  
  const [filters, setFilters] = useState(

    {startDate: "", endDate: "", category: "",region: ""}

)
  const clearFilters = () => {

    setFilters({startDate: "", endDate: "", category: "", region: ""})

}
    //Business Recommendation
    const fetchBusinessRecommendations = async () => {

    const response =
    await axios.get(

        "http://127.0.0.1:8000/analytics/business-recommendations",
                    {
                headers:{
                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
    );    
    setBusinessRecommendations(
        response.data.data
    );
};

   //Confidence Score
   const fetchConfidenceData =
    async () => {

    try {

        const response =
        await axios.get(

            "http://127.0.0.1:8000/forecast/forecast-confidence",

            {
                headers:{
                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        setConfidenceData(
            response.data.data
        );

    }

    catch(error){

        console.error(error);
    }
}; 

    //Model Accuracy
    const fetchAccuracyData = async () => {

    try {

        const response =
        await axios.get(

            "http://127.0.0.1:8000/forecast/model-accuracy",

            {
                headers: {
                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        setAccuracyData(
            response.data.data
        );

    }

    catch(error){

        console.error(error);
    }
};

    //Model Comparison
    const fetchModelComparison = async () => {

    try {

        const response = await axios.get(

            "http://127.0.0.1:8000/forecast/model-comparison",

            {
                headers: {
                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        setModelComparison(
            response.data.data
        );

    }

    catch(error){

        console.error(error);
    }
};    


    //Customer Behavior
    const fetchCustomerBehavior =
async () => {

    try {

        const response =
        await axios.get(

            "http://127.0.0.1:8000/analytics/customer-behavior",

            {
                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        setCustomerBehavior(

            response.data.data

        );

    }

    catch(error){

        console.error(error);
    }
};

    //Inventory Optimization
    const fetchInventoryOptimization = async () => {

    try {

        const response =
        await axios.get(

            "http://127.0.0.1:8000/inventory/inventory-optimization",

            {
                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        setInventoryOptimization(

            response.data.data

        );

    }

    catch(error){

        console.error(error);
    }
};

    //Demand Recommendation
    const fetchDemandRecommendations = async () => {

    try {

        const response = await axios.get(

            "http://127.0.0.1:8000/inventory/demand",

            {
                headers: {
                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        setRecommendations(
            response.data.data
        );

    }

    catch(error){

        console.error(error);
    }
};

   // Demand Spike Prediction
   const fetchDemandSpikes = async () => {

    try {

        const response = await axios.get(

            "http://127.0.0.1:8000/inventory/demand-spikes",

            {
                headers: {
                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        setDemandSpikes(
            response.data.data
        );

    }

    catch(error){

        console.error(error);
    }
};

   // Low Stock Prediction
   const fetchStockRisk = async () => {

    try {

        const response = await axios.get(

            "http://127.0.0.1:8000/inventory/global-stock-risk",

            {
                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        setStockRisk(
            response.data.data
        );

    }

    catch(error){

        console.error(error);
    }
};

   // Schedule Time
   const updateSchedule = async () => {

    try {

        await axios.put(

            "http://127.0.0.1:8000/forecast/forecast-schedule",

            {

                interval_type:
                intervalType,

                interval_value:
                parseInt(intervalValue)

            },

            {

                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        toast.success("Forecast Schedule Updated Successfully!");

    }

    catch(error){

        console.error(error);

        toast.error("Failed to update schedule");
    }
};

   // Load scheduler
   const loadSchedule = async () => {

    try {

        const response =
            await axios.get(

            "http://127.0.0.1:8000/forecast/get-forecast-schedule",

            {

                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        setIntervalType(
            response.data.data.interval_type
        );

        setIntervalValue(
            response.data.data.interval_value
        );

    }

    catch(error){

        console.error(error);
    }
}; 

   // Alert Message
   const fetchAlerts = async () => {

    const response = await axios.get(

        "http://127.0.0.1:8000/analytics/get-alert",

        {

            headers: {

                Authorization:
                `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    setAlerts(
        response.data.data
    );
}; 

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
    fetchAlerts();
    updateSchedule();
    loadSchedule();
    fetchStockRisk();
    fetchDemandSpikes();
    fetchDemandRecommendations();
    fetchInventoryOptimization();
    fetchCustomerBehavior();
    fetchModelComparison();
    fetchAccuracyData();
    fetchConfidenceData();
    fetchBusinessRecommendations();

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
      fetchAlerts();
      updateSchedule();
      loadSchedule();
      fetchStockRisk();
      fetchDemandSpikes();
      fetchDemandRecommendations();
      fetchInventoryOptimization();
      fetchCustomerBehavior();
      fetchModelComparison();
      fetchAccuracyData();
      fetchConfidenceData();
      fetchBusinessRecommendations();

      console.log("Live dashboard refreshed");

    }, 30000);

    // Cleanup
    return () => clearInterval(interval);


  },[]);

return (

<div>

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
            }

        </p>

    </div>

</div>

</>)

}

<br/>
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

                    searchResults.sales.slice(0,5).map(

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
{
    (role =="super_admin") &&
(<>

{/*Forecast Scheduler*/}
<br/>
<div className="
    bg-white
    rounded-xl
    shadow-lg
    p-6
">

    <h2 className="
        text-xl
        font-bold
        mb-4
    ">
        Forecast Schedule
    </h2>

    <div className="mb-4">

        <label className="block mb-2">
            Interval Type
        </label>

        <select

            value={intervalType}

            onChange={(e)=>
                setIntervalType(
                    e.target.value
                )
            }

            className="
                border
                p-2
                rounded
                w-full
            "
        >

            <option value="minutes">
                Minutes
            </option>

            <option value="hours">
                Hours
            </option>

            <option value="days">
                Days
            </option>

            <option value="weeks">
                Weeks
            </option>

        </select>

    </div>


    <div className="mb-4">

        <label className="block mb-2">
            Interval Value
        </label>

        <input

            type="number"

            value={intervalValue}

            onChange={(e)=>
                setIntervalValue(
                    e.target.value
                )
            }

            className="
                border
                p-2
                rounded
                w-full
            "
        />

    </div>

    <button

        onClick={updateSchedule}

        className="
            bg-green-600
            text-white
            px-4
            py-2
            rounded
        "
    >

        Save Schedule

    </button>

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

{/*Model Comparison*/}
<div className="

    bg-white
    dark:bg-gray-800

    rounded-xl
    shadow-lg

    p-6

">

    <h2 className="

        text-xl
        font-bold

        mb-4

        text-gray-800
        dark:text-white

    ">

        Forecast Model Comparison

    </h2>

    <ResponsiveContainer
        width="100%"
        height={350}
    >

        <LineChart
            data={modelComparison}
        >

            <CartesianGrid
                strokeDasharray="3 3"
            />

            <XAxis
                dataKey="date"
            />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line

                type="monotone"

                dataKey="prophet"

                name="Prophet"

            />

            <Line

                type="monotone"

                dataKey="linear_regression"

                name="Linear Regression"

            />

            <Line

                type="monotone"

                dataKey="moving_average"

                name="Moving Average"

            />

            <Line

                type="monotone"

                dataKey="ensemble"

                name="Ensemble"

            />

        </LineChart>

    </ResponsiveContainer>

</div>

<br/>
{
    (role== "super_admin" || role == "analyst") && 
    (<>

{/*Alert Message*/}    
<div
    className="
        bg-white
        dark:bg-gray-800
        rounded-xl
        shadow-lg
        p-6
    "
>

    <div className="
        flex
        items-center
        justify-between
        mb-4
    ">

        <h2 className="
            text-xl
            font-bold
            text-gray-800
            dark:text-white
        ">
            Alerts
        </h2>

        <span className="
            bg-red-500
            text-white
            text-xs
            px-2
            py-1
            rounded-full
        ">
            {alerts.length}
        </span>

    </div>

    {
        alerts.length > 0 ? (

            alerts.map((alert, index) => (

                <div
                    key={index}
                    className="
                        border-l-4
                        border-red-500
                        bg-gray-50
                        dark:bg-gray-700
                        rounded-lg
                        p-4
                        mb-3
                        hover:shadow-md
                        transition
                    "
                >

                    <div className="
                        flex
                        justify-between
                        items-start
                    ">

                        <div>

                            <p className="
                                font-semibold
                                text-red-600
                            ">
                                {alert.alert_type || "High Demand Alert"}
                            </p>

                            <p className="
                                text-gray-700
                                dark:text-gray-200
                                mt-1
                            ">
                                {alert.message}
                            </p>

                        </div>

                        <span className="
                            text-xs
                            text-gray-500
                        ">
                            {alert.created_at
                                ? new Date(alert.created_at)
                                      .toLocaleDateString()
                                : ""}
                        </span>

                    </div>

                </div>

            ))

        ) : (

            <div className="
                text-center
                text-gray-500
                py-8
            ">
                No alerts available
            </div>

        )
    }

</div>

    </>)
}


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

{(role== "super_admin" || role == "analyst") && 
    (<>
    <div className="

    mt-4

    p-4

    rounded-lg

    bg-gray-50
    dark:bg-gray-700

">

    <p className="

        text-gray-700
        dark:text-gray-200

        font-medium

    ">

        AI Suggestion:

    </p>

    <p className="

        mt-2

        text-lg
        font-bold

        text-indigo-600

    ">

{
    inventoryOptimization && (

        <div className="

            bg-white
            dark:bg-gray-800

            rounded-xl
            shadow-lg

            p-6

        ">

            <h2 className="

                text-xl
                font-bold

                mb-4

                text-gray-800
                dark:text-white

            ">

                AI Inventory Optimization

            </h2>

            <div className="space-y-3">

                <p className="

                    text-gray-700
                    dark:text-gray-300

                ">

                    Current Stock:

                    <span className="
                        font-semibold
                        ml-2
                    ">

                        {

                            inventoryOptimization
                            .total_stock

                        }

                    </span>

                </p>

                <p className="

                    text-gray-700
                    dark:text-gray-300

                ">

                    Projected Demand:

                    <span className="
                        font-semibold
                        ml-2
                    ">

                        {

                            Math.round(

                                inventoryOptimization
                                .projected_demand

                            )

                        }

                    </span>

                </p>

                <div className="mt-4">

                    {

                        inventoryOptimization
                        .suggestion ===
                        "Order More Inventory"

                        ?

                        <span className="

                            bg-green-100
                            text-green-700

                            px-4
                            py-2

                            rounded-full

                        ">

                            🚚 Order More Inventory

                        </span>

                        :

                        inventoryOptimization
                        .suggestion ===
                        "Reduce Purchasing"

                        ?

                        <span className="

                            bg-red-100
                            text-red-700

                            px-4
                            py-2

                            rounded-full

                        ">

                            📦 Reduce Purchasing

                        </span>

                        :

                        <span className="

                            bg-blue-100
                            text-blue-700

                            px-4
                            py-2

                            rounded-full

                        ">

                            ✅ Maintain Current Inventory

                        </span>

                    }

                </div>

            </div>

        </div>

    )
}

    </p>

</div>
    </>)}


<br/>
{ (role== "super_admin" || role == "analyst") && 
    (<>
    <div className="

    bg-white
    dark:bg-gray-800

    rounded-xl
    shadow-lg

    p-6

">

    <h2 className="

        text-xl
        font-bold
        mb-4

        text-gray-800
        dark:text-white

    ">

        AI Demand Recommendations

    </h2>

    {

        recommendations.length > 0 ?

        recommendations.slice(0,5).map(

            (item,index)=>(

                <div

                    key={index}

                    className="

                        border-b
                        dark:border-gray-700

                        py-3

                    "
                >

                    <div className="

                        flex
                        justify-between
                        items-center

                    ">

                        <div>

                            <p className="

                                font-semibold
                                text-gray-800
                                dark:text-white

                            ">

                                {item.forecast_date}

                            </p>

                            <p className="

                                text-sm
                                text-gray-500
                                dark:text-gray-400

                            ">

                                Predicted Demand:

                                {" "}

                                {Number(
                                    item.predicted_demand
                                ).toFixed(2)}

                            </p>

                        </div>

                        {

                            item.recommendation ===
                            "Increase Inventory"

                            ?

                            <span className="

                                bg-green-100
                                text-green-700

                                px-3
                                py-1

                                rounded-full
                                text-sm

                            ">

                                📈 Increase

                            </span>

                            :

                            item.recommendation ===
                            "Reduce Inventory"

                            ?

                            <span className="

                                bg-red-100
                                text-red-700

                                px-3
                                py-1

                                rounded-full
                                text-sm

                            ">

                                📉 Reduce

                            </span>

                            :

                            <span className="

                                bg-blue-100
                                text-blue-700

                                px-3
                                py-1

                                rounded-full
                                text-sm

                            ">

                                ➖ Maintain

                            </span>

                        }

                    </div>

                </div>

            )

        )

        :

        <div className="

            text-center
            text-gray-500

            p-6

        ">

            No Recommendations Available

        </div>

    }

</div>
    </>)
}


<br/>
{
    (role == "super_admin" || role == "analyst") && 
    (<>

{
    stockRisk && (

        <div className="

            bg-white
            dark:bg-gray-800

            rounded-xl
            shadow-lg

            p-6

        ">

            <h2 className="

                text-lg
                font-bold
                mb-4

                text-gray-800
                dark:text-white

            ">

                Global Inventory Risk

            </h2>

            <div className="space-y-2">

                <p className="
                    text-gray-700
                    dark:text-gray-300
                ">

                    Total Stock:

                    <span className="
                        font-semibold
                        ml-2
                    ">

                        {stockRisk.total_stock}

                    </span>

                </p>

                <p className="
                    text-gray-700
                    dark:text-gray-300
                ">

                    Projected Demand:

                    <span className="
                        font-semibold
                        ml-2
                    ">

                        {stockRisk.projected_demand}

                    </span>

                </p>

                <p className="
                    text-gray-700
                    dark:text-gray-300
                ">

                    Remaining Stock:

                    <span className="
                        font-semibold
                        ml-2
                    ">

                        {stockRisk.remaining_stock}

                    </span>

                </p>

                <div className="mt-4">

                    {

                        stockRisk.risk === "Low" ?

                        <span className="
                            bg-green-100
                            text-green-700
                            px-3
                            py-1
                            rounded-full
                        ">

                            🟢 Low Risk

                        </span>

                        :

                        stockRisk.risk === "Medium" ?

                        <span className="
                            bg-yellow-100
                            text-yellow-700
                            px-3
                            py-1
                            rounded-full
                        ">

                            🟡 Medium Risk

                        </span>

                        :

                        <span className="
                            bg-red-100
                            text-red-700
                            px-3
                            py-1
                            rounded-full
                        ">

                            🔴 High Risk

                        </span>

                    }

                </div>

            </div>

        </div>

    )
}        
    
    </>)
}

<br/>

{
    (role=="super_admin" || role == "analyst") &&
    
    (<>
    {/*Demand Spike Prediction*/}
    <div className="

    bg-white
    dark:bg-gray-800

    rounded-xl
    shadow-lg

    p-6

">

    <h2 className="

        text-xl
        font-bold
        mb-4

        text-gray-800
        dark:text-white

    ">

        Demand Spike Alerts

    </h2>

    {

        demandSpikes.length > 0 ?

        demandSpikes.map(

            (spike,index)=>(

                <div

                    key={index}

                    className="

                        border-b
                        dark:border-gray-700

                        py-3

                    "
                >

                    <div className="

                        flex
                        justify-between
                        items-center

                    ">

                        <div>

                            <p className="

                                font-semibold
                                text-gray-800
                                dark:text-white

                            ">

                                {spike.forecast_date}

                            </p>

                            <p className="

                                text-sm
                                text-gray-500
                                dark:text-gray-400

                            ">

                                Demand Increase:

                                {" "}

                                {spike.spike_percentage}%

                            </p>

                        </div>

                        {

                            spike.severity === "High" ?

                            <span className="

                                bg-red-100
                                text-red-700

                                px-3
                                py-1

                                rounded-full
                                text-sm

                            ">

                                🔴 High

                            </span>

                            :

                            <span className="

                                bg-yellow-100
                                text-yellow-700

                                px-3
                                py-1

                                rounded-full
                                text-sm

                            ">

                                🟡 Medium

                            </span>

                        }

                    </div>

                </div>

            )

        )

        :

        <div className="

            text-center
            text-gray-500

            p-6

        ">

            No Demand Spikes Detected

        </div>

    }

</div>
    </>)

}

<br/>

{
customerBehavior && (

<div className="

    bg-white
    dark:bg-gray-800

    rounded-xl
    shadow-lg

    p-6

">

    <h2 className="

        text-xl
        font-bold

        mb-4

        text-gray-800
        dark:text-white

    ">

        Customer Buying Behavior

    </h2>

    <div className="space-y-3">

        <p className="

            text-gray-700
            dark:text-gray-300

        ">

            Total Customers:

            <span className="
                font-semibold
                ml-2
            ">

                {customerBehavior.total_customers}

            </span>

        </p>

        <p className="

            text-gray-700
            dark:text-gray-300

        ">

            Repeat Customers:

            <span className="
                font-semibold
                ml-2
            ">

                {customerBehavior.repeat_customers}

            </span>

        </p>

        <p className="

            text-gray-700
            dark:text-gray-300

        ">

            Top Segment:

            <span className="
                font-semibold
                ml-2
            ">

                {customerBehavior.top_segment}

            </span>

        </p>

        <p className="

            text-gray-700
            dark:text-gray-300

        ">

            Top Gender:

            <span className="
                font-semibold
                ml-2
            ">

                {customerBehavior.top_gender}

            </span>

        </p>

        <p className="

            text-gray-700
            dark:text-gray-300

        ">

            Top Age Group:

            <span className="
                font-semibold
                ml-2
            ">

                {customerBehavior.top_age_group}

            </span>

        </p>

    </div>

</div>

)}
<br/>

{
accuracyData && (

<div className="

    bg-white
    dark:bg-gray-800

    rounded-xl
    shadow-lg

    p-6

">

    <h2 className="

        text-xl
        font-bold

        mb-4

        text-gray-800
        dark:text-white

    ">

        Forecast Accuracy

    </h2>

    <p className="

        text-3xl
        font-bold

        text-green-600

    ">

        {accuracyData.current_accuracy}%

    </p>

    <p className="

        mt-2

        text-gray-600
        dark:text-gray-300

    ">

        Average Accuracy:

        {accuracyData.average_accuracy}%

    </p>

</div>

)}

<br/>
{
accuracyData && (

<div className="

    bg-white
    dark:bg-gray-800

    rounded-xl
    shadow-lg

    p-6

">

    <h2 className="

        text-xl
        font-bold

        mb-4

        text-gray-800
        dark:text-white

    ">

        Accuracy Trend

    </h2>

    <ResponsiveContainer
        width="100%"
        height={300}
    >

        <LineChart
            data={accuracyData.trend}
        >

            <CartesianGrid
                strokeDasharray="3 3"
            />

            <XAxis
                dataKey="date"
            />

            <YAxis />

            <Tooltip />

            <Line

                type="monotone"

                dataKey="accuracy"

                name="Accuracy %"

            />

        </LineChart>

    </ResponsiveContainer>

</div>

)}

<br/>
{/*Confidence Score*/}
{    
confidenceData && (

<div className="

    bg-white
    dark:bg-gray-800

    rounded-xl
    shadow-lg

    p-6

">

    <h2 className="

        text-xl
        font-bold

        mb-4

        text-gray-800
        dark:text-white

    ">

        Forecast Confidence

    </h2>

    <p className="

        text-3xl
        font-bold

        text-blue-600

    ">

        {confidenceData.average_confidence}%

    </p>

    <p className="

        mt-2

        text-gray-600
        dark:text-gray-300

    ">

        Model Agreement Score

    </p>

</div>

)}

<br/>
{/*Business Recommendation*/}
<div className="

    bg-white
    rounded-xl
    shadow-lg

    p-6

">

    <h2 className="

        text-xl
        font-bold

        mb-4

    ">

        Business Recommendations

    </h2>

    {

        businessRecommendations.map(

            (item,index)=>(

                <div

                    key={index}

                    className="

                        border-b
                        py-3

                    "

                >

                    <p className="font-semibold">

                        {item.priority}

                    </p>

                    <p>

                        {item.message}

                    </p>

                </div>
            )
        )
    }

</div>

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