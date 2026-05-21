import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/Admin_Layout";

function AdminReports() {
  const [reportData, setReportData] = useState([]);
  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:8000/admin/reports",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }   
        }
    )
        setReportData(response.data.data);
      
    } catch (error) {
      console.log(error);
    }
  };    

  useEffect(() => {
    fetchReportData();
  }, []);

  return (

    <AdminLayout>
         <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Reports
            </h1>

         <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-indigo-900 text-white">
                        <tr>
                            <th className="p-4 text-left">
                                File Name
                            </th>
                            <th className="p-4 text-left">
                                File Path
                            </th>    
                            <th className="p-4 text-left">
                                File Type
                            </th>    
                            <th className="p-4 text-left">
                                File Created
                            </th>    
                            <th className="p-4 text-left">
                                Download
                            </th>    

                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((report) => (
                            <tr key={report.id} className="border-b">
                                <td className="p-4">
                                    {report.file_name}
                                </td>
                                <td className="p-4">
                                    {report.file_path}
                                </td>
                                <td className="p-4">
                                    {report.file_type}
                                </td>
                                <td className="p-4">
                                    {report.created_at}
                                </td>
                        
                                <td>

                        <a href={`http://127.0.0.1:8000/${report.file_path}`}

                        target="_blank" 
                        rel="noopener noreferrer"

                        className=" 
                            bg-blue-500
                            hover:bg-blue-600
                            text-white
                            px-4
                            py-2
                            rounded-lg" 
                        >
                                        Download
                            </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
         </div>

        </div>            

  
    </AdminLayout>

  )

}

export default AdminReports;