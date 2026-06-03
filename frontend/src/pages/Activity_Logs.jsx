import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import React from "react";

function ActivityLogs() {

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
            <div className="

    bg-white

    rounded-xl

    shadow-lg

    p-6

">

    <h2 className="

        text-2xl
        font-bold

        mb-4

    ">

        Activity Logs

    </h2>

    <table className="

        w-full

        border-collapse

    ">

        <thead>

            <tr>

                <th>User</th>

                <th>Endpoint</th>

                <th>Method</th>

                <th>Status</th>

                <th>Timestamp</th>

            </tr>

        </thead>

        <tbody>

            {

                activityLogs.map(

                    (log,index)=>(

                        <tr key={index}>

                            <td>

                                {log.username}

                            </td>

                            <td>

                                {log.endpoint}

                            </td>

                            <td>

                                {log.method}

                            </td>

                            <td>

                                {log.status}

                            </td>

                            <td>

                                {

                                    new Date(
                                        log.timestamp
                                    )

                                    .toLocaleString()

                                }

                            </td>

                        </tr>
                    )
                )
            }

        </tbody>

    </table>

</div>

        </Layout>

    ) 
}

export default ActivityLogs;