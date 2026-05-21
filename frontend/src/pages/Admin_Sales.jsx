import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/Admin_Layout";

function AdminSales() {
  const [salesData, setSalesData] = useState([]);
  
  //Paginations
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;  
  const skip = (currentPage - 1) * limit;
  const [total,setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit)

  //Filters
  const [filters, setFilters] = useState({

    product_name: "",

    category: "",

    region: "",

    start_date: "",

    end_date: ""
})

const clearFilters = () => {

    setFilters({

        product_name: "",

        category: "",

        region: "",

        start_date: "",

        end_date: ""
    })
}


  const fetchSalesData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:8000/admin/sales",
        {
            params:{

                product_name:filters.product_name,

                category: filters.category,

                region: filters.region,

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
        setSalesData(response.data.data.items);
        console.log("Current page", currentPage);
      
    } catch (error) {
      console.log(error);
    }
  };    

  useEffect(() => {
    fetchSalesData();
  }, [currentPage, filters]);

  return (

    <AdminLayout>
         <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Datasets
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

            Sales Filters

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

    {/* First Row */}
    <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-4
        mb-4
    ">

        {/* Product Name */}
        <input

            type="text"

            placeholder="Product Name"

            value={filters.product_name}

            onChange={(e) =>
                setFilters({
                    ...filters,
                    product_name: e.target.value
                })
            }

            className="
                border
                p-3
                rounded-xl
            "
        />

        {/* Category */}
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
            "
        >

            <option value="">
                All Categories
            </option>

            <option value="Electronic">
                Electronics
            </option>

            <option value="Furniture">
                Furnitures
            </option>

            <option value="Clothing">
                Clothing
            </option>

        </select>

        {/* Region */}
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

    {/* Second Row */}
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
                                Product Name 
                            </th>
                            <th className="p-4 text-left">
                                Category 
                            </th>
                            <th className="p-4 text-left">
                                Sales Date
                            </th>    
                            <th className="p-4 text-left">
                                Quantity Sold
                            </th>
                            <th className="p-4 text-left">
                                Total Revenue
                            </th>
                            <th className="p-4 text-left">
                                Region
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.map((sales) => (
                            <tr key={sales.id} className="border-b">
                                <td className="p-4">
                                    {sales.id}
                                </td>
                                <td className="p-4">
                                    {sales.product_name}
                                </td>
                                <td className="p-4">
                                    {sales.category}
                                </td>
                                <td className="p-4">
                                    {sales.sales_date}
                                </td>
                                <td className="p-4">
                                    {sales.quantity_sold}
                                </td>
                                <td className="p-4">
                                    {sales.revenue}
                                </td>
                                <td className="p-4">
                                    {sales.region}
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
  
    </AdminLayout>

  )

}

export default AdminSales;