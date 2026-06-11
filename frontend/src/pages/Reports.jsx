import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { addNotification } from "../components/AddNotification";

function Reports() {

  // Download Excel
  const downloadExcel = async () => {

    try{
    const response = await axios.get(
      "http://127.0.0.1:8000/reports/export-excel",    
      {
        responseType:"blob",
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`
        }
      }

    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download","forecast_report.xlsx");
    document.body.appendChild(link);
    link.click();
    addNotification("Report Downloaded successfully")
    }
    
    catch (error) {
      console.error(error); 
      toast.error("Excel download failed");
    }

  };

  // Download PDF
  const downloadPDF = async () => {

  try{  

    const response = await axios.get(
      "http://127.0.0.1:8000/reports/export-pdf",
      {
        responseType:"blob",
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download","forecast_report.pdf");
    document.body.appendChild(link);
    link.click();
  }

    catch (error) {

      console.error(error); 
      toast.error("PDF download failed");
    }
  };


  // To Display Forecast Table
  const [forecastResults, setForecastResults] = useState([]);
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
        )

        setForecastResults(
            response.data.data.items
        )

    } catch (error) {

        console.error(error)
    }
};

useEffect(() => {

    fetchForecastResults()

}, []);


  return (
  <Layout>

      <div className="p-6">

    {/* Heading */}
    <div className="mb-8">

        <h1 className="
            text-4xl
            font-bold
            mb-2
        ">

            Reports Export

        </h1>

        <p className="
            text-gray-500
        ">

            Download and review forecast analytics reports

        </p>

    </div>


    {/* Download Buttons */}
    <div className="
        flex
        flex-col
        md:flex-row
        gap-4
        mb-8
    ">

        <button

            onClick={downloadExcel}

            className="
                flex-1
                bg-green-600
                hover:bg-green-700
                text-white
                font-semibold
                p-4
                rounded-2xl
                shadow-md
                transition-all
            "
        >

            Download Excel Report

        </button>

        <button

            onClick={downloadPDF}

            className="
                flex-1
                bg-red-600
                hover:bg-red-700
                text-white
                font-semibold
                p-4
                rounded-2xl
                shadow-md
                transition-all
            "
        >

            Download PDF Report

        </button>

    </div>


    {/* Forecast Table Card */}
    <div className={`
        bg-white
        rounded-2xl
        shadow-lg
        overflow-hidden
    `}>

        {/* Table Header */}
        <div className="
            px-6
            py-4
            border-b
            bg-gray-50
        ">

            <h2 className="
                text-2xl
                font-semibold
                text-gray-700
            ">

                Forecast Results

            </h2>

        </div>


        {/* Responsive Table */}
        <div className="
            overflow-x-auto
        ">

            <table className="
                min-w-full
            ">

                <thead className="
                    bg-gray-100
                ">

                    <tr>

                        <th className="
                            p-4
                            text-left
                            text-gray-700
                            font-semibold
                        ">

                            Forecast Date

                        </th>

                        <th className="
                            p-4
                            text-left
                            text-gray-700
                            font-semibold
                        ">

                            Predicted Demand

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        forecastResults.map((item,index) => (

                            <tr

                                key={index}

                                className="
                                    border-b
                                    hover:bg-gray-50
                                    transition-colors
                                "
                            >

                                <td className="
                                    p-4
                                    text-gray-700
                                ">

                                    {item.forecast_date}

                                </td>

                                <td className="
                                    p-4
                                    font-medium
                                    text-emerald-700
                                ">

                                    {item.predicted_demand}

                                </td>

                            </tr>
                        ))
                    }

                </tbody>

            </table>

        </div>

    </div>

</div>                  

  </Layout>
  );
}

export default Reports;