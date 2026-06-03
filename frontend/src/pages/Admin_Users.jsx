import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function AdminUsers() {

const [users, setUsers] = useState([])
const [filters, setFilters] = useState({
   id:"",
   username:"",
   role:"",
})
const clearFilters = () => {
    setFilters({
   id:"",
   username:"",
   role:"",
    })
}

const fetchUsers = async () => {

    try{
        const token = localStorage.getItem("token")
        const response = await axios.get(
            "http://127.0.0.1:8000/admin/users",
            {
                params:{
                  
                  ...(filters.id && {id: filters.id}), // will not send id = "" and avoids error

                  username:filters.username,
                  
                  role:filters.role      
                
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        setUsers(response.data.data)
    } 
    catch (error) {
        console.log(error)
    }
}

//Update function
const updateUserStatus = async (
    userId,
    status
) => {

    try {

        const token =
        localStorage.getItem("token");

        await axios.put(

            `http://127.0.0.1:8000/admin/users/${userId}/status`,

            {
                status
            },

            {
                headers: {
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        fetchUsers();

    }

    catch(error){

        console.log(error);

    }

};


useEffect(() => {
    fetchUsers()
}, [filters])



return(

    <Layout>

    <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Users
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

            User Filters

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

    {/* Filters Row */}
    <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-4
    ">

        {/* User ID */}
        <input

            type="number"

            placeholder="User ID"

            value={filters.id}

            onChange={(e) =>
                setFilters({
                    ...filters,
                    id: e.target.value
                })
            }

            className="
                border
                p-3
                rounded-xl
            "
        />

        {/* Username */}
        <input

            type="text"

            placeholder="Username"

            value={filters.username}

            onChange={(e) =>
                setFilters({
                    ...filters,
                    username: e.target.value
                })
            }

            className="
                border
                p-3
                rounded-xl
            "
        />

        {/* Role */}
        <select

            value={filters.role}

            onChange={(e) =>
                setFilters({
                    ...filters,
                    role: e.target.value
                })
            }

            className="
                border
                p-3
                rounded-xl
            "
        >

            <option value="">
                All Roles
            </option>

            <option value="super_admin">
                Super admin
            </option>

            <option value="analyst">
                Analyst
            </option>

            <option value="viewer">
                Viewer
            </option>

        </select>

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
                                Username
                            </th>

                            <th className="p-4 text-left">
                                Email
                            </th>

                            <th className="p-4 text-left">
                                Role
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {users.map((user) => (

                            <tr
                                key={user.id}
                                className="border-b"
                            >

                                <td className="p-4">
                                    {user.id}
                                </td>

                                <td className="p-4">
                                    {user.username}
                                </td>

                                <td className="p-4">
                                    {user.email}
                                </td>

                                <td className="p-4">

                                    <span
                                        className={`px-3 py-1 rounded-full text-white text-sm
                                        ${
                                            user.role === "admin"
                                            ? "bg-red-500"
                                            : "bg-blue-500"
                                        }`}
                                    >

                                        {user.role}

                                    </span>

                                </td>

                                 <td>
    <select
        className="
            border
            rounded-md
            px-2
            py-1
        "
        value={user.status || "active"}
        onChange={(e) =>
            updateUserStatus(
                user.id,
                e.target.value
            )
        }
    >
        <option value="active">
            Active
        </option>

        <option value="inactive">
            Inactive
        </option>

        <option value="suspended">
            Suspended
        </option>
    </select>
</td>           

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

    </div>        

    </Layout>

);

}

export default AdminUsers;