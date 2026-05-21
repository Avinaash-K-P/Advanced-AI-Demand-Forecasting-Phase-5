import { useState, useEffect } from "react";
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
  ResponsiveContainer,
} from "recharts";


function ChartsAndGraphs() {

  const [totalSales, setTotalSales] = useState({});
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
    
  }, [filters]);

  useEffect(()=>{
    fetchForecastAccuracy();
    fetchForecastResults();
  },[]);

return (
<div>

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

                <option value="">
                    All Categories
                </option>

                <option value="Electronic">
                    Electronic
                </option>

                <option value="Furniture">
                    Furniture
                </option>

                <option value="Clothing">
                  Clothing
                </option>

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

            </select>

        </div>

    </div>

</div>

<br/>
    {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500 text-lg">
            Total Revenue
          </h2>

          <p className="text-3xl font-bold mt-4">
            ₹ {totalSales.total_revenue || 0}
          </p>

        </div>

        {/* Total Quantity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500 text-lg">
            Total Quantity Sold
          </h2>

          <p className="text-3xl font-bold mt-4">
            {totalSales.total_quantity_sold || 0}
          </p>

        </div>

        {/* Forecast Accuracy */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500 text-lg">
            Forecast Accuracy
          </h2>

          <p className="text-3xl font-bold mt-4">
            {forecastAccuracy.model_performance || "N/A"}
          </p>

          <p className="text-gray-500 mt-2">
            MAE:
            {" "}
            {forecastAccuracy.mae || 0}
          </p>

        </div>

      </div>

      {/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

  {/* Monthly Sales Chart */}
  <div className="bg-white rounded-2xl shadow-lg p-6">

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
  <div className="bg-white rounded-2xl shadow-lg p-6">

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

{/* Forecast Graph */}
<div className="bg-white rounded-2xl shadow-lg p-6 mt-10">

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

</div>

);

}

export default ChartsAndGraphs;