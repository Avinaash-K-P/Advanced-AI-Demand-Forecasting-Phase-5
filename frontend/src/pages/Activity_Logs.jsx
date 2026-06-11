import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import React from "react";
import { getThemeStyles } from "../components/ThemeStyles";

function ActivityLogs() {

    const darkMode =localStorage.getItem("theme") === "dark";
    const styles = getThemeStyles(darkMode);
    const [activityLogs,setActivityLogs] = useState([]);
    const fetchActivityLogs =
async () => {

    try {

        const response =
        await axios.get(

            "http://127.0.0.1:8000/admin/activity-logs",

            {

                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`

                }

            }

        );

        setActivityLogs(
            response.data.data
        );

    }

    catch(error){

        console.error(error);
    }

};

useEffect(()=>{

    fetchActivityLogs();

},[]);


    return(

        <Layout>

<div
className="
bg-white
rounded-2xl
shadow-xl
p-6
mt-6
"
>

    <div className="
    flex
    justify-between
    items-center
    mb-6
    ">

        <h2 className="
        text-2xl
        font-bold
        text-gray-800
        ">
            Activity Logs
        </h2>

        <span className="
        bg-green-100
        text-green-700
        px-3
        py-1
        rounded-full
        text-sm
        font-medium
        ">
            {activityLogs.length} Records
        </span>

    </div>

    <div
    className="
    overflow-x-auto
    max-h-[500px]
    overflow-y-auto
    "
    >

        <table
        className="
        w-full
        text-left
        "
        >

            <thead
            className={`  
            ${styles.tableHeader} 
            sticky
            top-0
            z-10
            `}
            >

                <tr>

                    <th className="p-3 font-semibold">
                        User
                    </th>

                    <th className="p-3 font-semibold">
                        Endpoint
                    </th>

                    <th className="p-3 font-semibold">
                        Method
                    </th>

                    <th className="p-3 font-semibold">
                        Status
                    </th>

                    <th className="p-3 font-semibold">
                        Timestamp
                    </th>

                </tr>

            </thead>

            <tbody>

                {
                activityLogs.map((log,index)=>(

                    <tr
                    key={index}
                    className= {` 
                    ${styles.input}                  
                    border-b
                    hover:bg-gray-50
                    transition`} 
                    >

                        <td className="p-3 font-medium">
                            {log.username}
                        </td>

                        <td className="p-3 text-blue-600">
                            {log.endpoint}
                        </td>

                        <td className="p-3">

                            <span
                            className={`
                            px-2
                            py-1
                            rounded-lg
                            text-xs
                            font-semibold

                            ${
                                log.method === "GET"
                                ? "bg-green-100 text-green-700"
                                : log.method === "POST"
                                ? "bg-blue-100 text-blue-700"
                                : log.method === "PUT"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }
                            `}
                            >
                                {log.method}
                            </span>

                        </td>

                        <td className="p-3">

                            <span
                            className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-semibold

                            ${
                                log.status === "Success"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                            `}
                            >

                                {log.status}

                            </span>

                        </td>

                        <td className="p-3 text-gray-600">

                            {
                            new Date(
                                log.timestamp
                            ).toLocaleString()
                            }

                        </td>

                    </tr>

                ))
                }

            </tbody>

        </table>

    </div>

</div>

        </Layout>

    ) 
}

export default ActivityLogs;