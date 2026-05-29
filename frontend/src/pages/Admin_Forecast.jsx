import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function AdminForecast() {
  const [forecastData, setForecastData] = useState([]);
  
  //Paginations
  
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;  
  const skip = (currentPage - 1) * limit;
  const [total,setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit)
  
  //Filters
  
  const [filters, setFilters] = useState({
    
    start_date:"",
    
    end_date:"",

})

const clearFilters = () => {

    setFilters({

        start_date: "",

        end_date: ""
    })
}

  const fetchForecastData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:8000/admin/forecasts",
        {   
            params:{
                
                start_date: filters.start_date,
                
                end_date: filters.end_date,
                
                skip,
                
                limit       
            },
            headers: {
                Authorization: `Bearer ${token}`
            }   
        }
    )
        setForecastData(response.data.data.items);
      
    } catch (error) {
      console.log(error);
    }
  };    

  useEffect(() => {
    fetchForecastData();
  }, [currentPage, filters]);

  return (

    <Layout>
         <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Forecast
            </h1>

<div className="
    bg-white
    p-6
    rounded-2xl
    shadow-lg
    mb-6
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

            Forecast Filters

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

    {/* Date Row */}
    <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-4
    ">

        {/* Start Date */}
        <input

            type="date"

            value={filters.start_date}

            onChange={(e) =>
                setFilters({
                    ...filters,
                    start_date: e.target.value
                })
            }

            className="
                border
                p-3
                rounded-xl
            "
        />

        {/* End Date */}
        <input

            type="date"

            value={filters.end_date}

            onChange={(e) =>
                setFilters({
                    ...filters,
                    end_date: e.target.value
                })
            }

            className="
                border
                p-3
                rounded-xl
            "
        />

    </div>

</div>            

         <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-indigo-900 text-white">
                        <tr>
                            <th className="p-4 text-left">
                                ID
                            </th>
                            <th className="p-4 text-left">
                                Forecast Date
                            </th>
                            <th className="p-4 text-left">
                                Predicted Demand
                            </th>    
                        </tr>
                    </thead>
                    <tbody>
                        {forecastData.map((forecast) => (
                            <tr key={forecast.id} className="border-b">
                                <td className="p-4">
                                    {forecast.id}
                                </td>
                                <td className="p-4">
                                    {forecast.forecast_date}
                                </td>
                                <td className="p-4">
                                    {forecast.predicted_demand}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
         </div>

<div className="
    flex
    justify-center
    gap-4
    mt-6
">

    <button

        disabled={currentPage === 1}

        onClick={() =>
            setCurrentPage(currentPage - 1)
        }

        className="
            bg-blue-500
            text-white
            px-4
            py-2
            rounded-lg
        "
    >

        Previous

    </button>

    <span className="font-bold">

        Page {currentPage}

    </span>

    <button

        disabled={
            currentPage === totalPages
        }

        onClick={() =>
            setCurrentPage(currentPage + 1)
        }

        className="
            bg-blue-500
            text-white
            px-4
            py-2
            rounded-lg
        "
    >
        Next

    </button>

</div> 

        </div>            

  
    </Layout>

  )

}

export default AdminForecast;