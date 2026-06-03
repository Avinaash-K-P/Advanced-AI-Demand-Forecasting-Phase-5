import Layout from "../components/Layout";
import axios from "axios";
import {useState,useEffect} from "react"
import {toast} from "react-toastify";

function IntegrationManagement() {

    const [Integration,setIntegration] = useState({});

    const [integrations, setIntegrations] = useState([]);

    const fetchIntegrations = async () => {

    try {

        const response = await axios.get(

            "http://127.0.0.1:8000/inventory/all",

            {
                headers: {
                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        setIntegrations(
            response.data.data
        );

    }

    catch(error){

        console.error(error);
    }
};

const testConnection = async (integration) => {

    try {

        await axios.post(

            "http://127.0.0.1:8000/inventory/test-connection",

            integration,

            {
                headers: {
                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        toast.success(
            "Connection Successful"
        );

    }

    catch(error){

        toast.error(
            "Connection Failed"
        );
    }
};

const syncInventory = async () => {

    try {

        await axios.post(

            "http://127.0.0.1:8000/inventory/sync",

            {},

            {
                headers: {
                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        toast.success(
            "Inventory Synced Successfully"
        );

        fetchIntegrations();

    }

    catch(error){

        toast.error(
            "Sync Failed"
        );
    }
};

const toggleIntegration = async (id) => {

    try {

        await axios.put(

            `http://127.0.0.1:8000/inventory/${id}/toggle`,

            {},

            {
                headers: {
                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        toast.success(
            "Integration Updated"
        );

        fetchIntegrations();

    }

    catch(error){

        toast.error(
            "Update Failed"
        );
    }
};

    useEffect(() => {
        fetchIntegrations();
    },[]);


    return(
        <Layout>

             <div className="p-6">

    <h2 className="
        text-2xl
        font-bold
        mb-4
        text-gray-800
    ">
        Integration Management
    </h2>

    <div className="overflow-x-auto">

        <table className="
            min-w-full
        ">

            <thead className="
                bg-gray-100
                dark:bg-gray-700
            ">

                <tr>

                    <th className="p-4 text-left">
                        System Name
                    </th>

                    <th className="p-4 text-left">
                        Status
                    </th>

                    <th className="p-4 text-left">
                        Last Sync
                    </th>

                    <th className="p-4 text-left">
                        Actions
                    </th>

                </tr>

            </thead>

            <tbody>

                {

                    integrations.map(

                        (integration) => (

                            <tr

                                key={integration.id}

                                className="
                                    border-b
                                    dark:border-gray-700
                                "
                            >

                                <td className="
                                    p-4
                                    font-medium
                                ">

                                    {integration.system_name}

                                </td>

                                <td className="p-4">

                                    {

                                        integration.is_active ?

                                        <span className="
                                            bg-green-100
                                            text-green-700
                                            px-3
                                            py-1
                                            rounded-full
                                            text-sm
                                        ">
                                            Active
                                        </span>

                                        :

                                        <span className="
                                            bg-red-100
                                            text-red-700
                                            px-3
                                            py-1
                                            rounded-full
                                            text-sm
                                        ">
                                            Inactive
                                        </span>

                                    }

                                </td>

                                <td className="p-4">

                                    {

                                        integration.last_sync ?

                                        new Date(
                                            integration.last_sync
                                        ).toLocaleString()

                                        :

                                        "Never Synced"

                                    }

                                </td>

                                <td className="
                                    p-4
                                    flex
                                    gap-2
                                    flex-wrap
                                ">

                                    <button

                                        onClick={() =>
                                            testConnection(
                                                integration
                                            )
                                        }

                                        className="
                                            bg-blue-600
                                            text-white
                                            px-3
                                            py-1
                                            rounded
                                        "
                                    >

                                        Test

                                    </button>


                                    <button

                                        onClick={
                                            syncInventory
                                        }

                                        className="
                                            bg-green-600
                                            text-white
                                            px-3
                                            py-1
                                            rounded
                                        "
                                    >

                                        Sync

                                    </button>


                                    <button

                                        onClick={() =>
                                            toggleIntegration(
                                                integration.id
                                            )
                                        }

                                        className="
                                            bg-orange-500
                                            text-white
                                            px-3
                                            py-1
                                            rounded
                                        "
                                    >

                                        {

                                            integration.is_active ?

                                            "Disable"

                                            :

                                            "Enable"

                                        }

                                    </button>

                                </td>

                            </tr>

                        )
                    )

                }

            </tbody>

        </table>

    </div>

</div>   

        </Layout>
    );

}

export default IntegrationManagement;