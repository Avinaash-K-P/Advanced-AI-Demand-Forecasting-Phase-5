import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Admin_Layout from "../components/Admin_Layout";
import {useState,useEffect} from "react"
import axios from "axios";



function DownloadSummary() {

    //Gather Data
  const [totalSales, setTotalSales] = useState({});
  const [forecastAccuracy, setForecastAccuracy] = useState({});

  const fetchTotalSales = async () => {
     
    const response = await axios.get(
          "http://127.0.0.1:8000/analytics/total-sales",
           {
             
            headers: {
              Authorization:
              `Bearer ${localStorage.getItem("token")}`
            }
        }
    );
        setTotalSales(
        response.data.data
    );
}

  const fetchForecastAccuracy = async () => {

    const response = await axios.get(

        "http://127.0.0.1:8000/analytics/forecast-accuracy",

        {

            headers: {

                Authorization:
                `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    setForecastAccuracy(
        response.data.data
    );
};


   
useEffect(() => {

    fetchTotalSales();

    fetchForecastAccuracy();

}, []);
        


    //Excel Download
    const downloadExcelSummary = async () => {

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet(
            "Analytics Summary"
        );


        // Title
        worksheet.addRow([
            "Analytics Summary Report"
        ]);

        worksheet.addRow([]);


        // Headers
        worksheet.addRow([
            "Metric",
            "Value"
        ]);


        // Analytics Data
        worksheet.addRow([

            "Total Revenue",

            totalSales?.total_revenue || 0
        ]);

        worksheet.addRow([

            "Total Quantity Sold",

            totalSales?.total_quantity_sold || 0
        ]);

        worksheet.addRow([

            "Forecast Accuracy",

            (100 - forecastAccuracy?.mae) || 0
        ]);



        // Styling
        worksheet.getRow(3).font = {

            bold: true
        };


        worksheet.columns = [

            { width: 30 },

            { width: 25 }
        ];


        // Generate File
        const buffer = await workbook.xlsx.writeBuffer();


        saveAs(

            new Blob([buffer]),

            "analytics_summary.xlsx"
        );
    };


    // =========================
    // PDF DOWNLOAD
    // =========================
    const downloadPDFSummary = () => {

        const doc = new jsPDF();


        // Title
        doc.setFontSize(18);

        doc.text(

            "Analytics Summary Report",

            14,

            20
        );


        // Table
        autoTable(doc, {

            startY: 35,

            head: [[
                "Metric",
                "Value"
            ]],

            body: [

                [

                    "Total Revenue",

                    totalSales?.total_revenue || 0
                ],

                [

                    "Total Quantity Sold",

                    totalSales?.total_quantity_sold || 0
                ],

                [

                    "Forecast Accuracy",

                    (100 - forecastAccuracy?.mae)|| 0
                ]
            ]
        });


        doc.save(
            "analytics_summary.pdf"
        );
    };

return (

        <Admin_Layout>

            <div className="p-6">

                {/* Heading */}
                <div className="mb-8">

                    <h1 className="
                        text-4xl
                        font-bold
                        text-gray-800
                        mb-2
                    ">

                        Analytics Summary

                    </h1>

                    <p className="
                        text-gray-500
                    ">

                        View and export system analytics reports

                    </p>

                </div>


                {/* Buttons */}
                <div className="
                    flex
                    flex-col
                    md:flex-row
                    gap-4
                    mb-8
                ">

                    <button

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

                        onClick={downloadExcelSummary}
                    >

                        Download Excel Summary

                    </button>


                    <button

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

                        onClick={downloadPDFSummary}
                    >

                        Download PDF Summary

                    </button>

                </div>

              <table className="
        min-w-full
        border-collapse
    ">

        <thead>

            <tr className="
                bg-gray-100
                text-gray-700
            ">

                <th className="
                    p-4
                    text-left
                    border-b
                ">

                    Metric

                </th>

                <th className="
                    p-4
                    text-left
                    border-b
                ">

                    Value

                </th>

            </tr>

        </thead>


        <tbody>

            <tr className="
                hover:bg-gray-50
                transition-all
            ">

                <td className="
                    p-4
                    border-b
                    font-medium
                ">

                    Total Revenue

                </td>

                <td className="
                    p-4
                    border-b
                ">

                    ₹ {totalSales?.total_revenue || 0}

                </td>

            </tr>


            <tr className="
                hover:bg-gray-50
                transition-all
            ">

                <td className="
                    p-4
                    border-b
                    font-medium
                ">

                    Total Quantity Sold

                </td>

                <td className="
                    p-4
                    border-b
                ">

                    {totalSales?.total_quantity_sold || 0}

                </td>

            </tr>


            <tr className="
                hover:bg-gray-50
                transition-all
            ">

                <td className="
                    p-4
                    border-b
                    font-medium
                ">

                    Forecast Accuracy

                </td>

                <td className="
                    p-4
                    border-b
                ">

                    {(100 - forecastAccuracy?.mae) || 0} %

                </td>

            </tr>

        </tbody>

    </table>    

            </div>

        </Admin_Layout>
    );
}

export default DownloadSummary;