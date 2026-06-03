import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import NotificationDropdown from "./NotificationDropDown";
import React from "react";
function Layout({ children }) {

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");
  };

  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {

    if(darkMode){

        document.documentElement
            .classList.remove("dark");

        localStorage.setItem(
            "theme",
            "light"
        );

    } else {

        document.documentElement
            .classList.add("dark");

        localStorage.setItem(
            "theme",
            "dark"
        );
    }

    setDarkMode(!darkMode);
};

  useEffect(() => {

    const savedTheme =
        localStorage.getItem("theme");

    if(savedTheme === "dark"){

        document.documentElement
            .classList.add("dark");

        setDarkMode(true);
    }

}, []);


  useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {

    navigate("/");
    alert("Please log in to access the dashboard.");
  }

  }, []);


  return (

   <div
  className={`

    min-h-screen
    flex
    transition-all
    duration-300

    ${darkMode

      ?

      "bg-gray-950 text-white"

      :

      "bg-gray-100 text-black"
    }

  `}
>

      {/* Sidebar */}
   
   <div className={`

    fixed
    top-0
    left-0
    h-screen
    w-64

    overflow-y-auto

    text-white
    p-6

    hidden
    md:block

    shadow-2xl
    transition-all
    duration-300

    ${darkMode

      ?

      "bg-gradient-to-b from-gray-950 via-gray-900 to-black"

      :

      "bg-gradient-to-b from-emerald-950 via-green-900 to-emerald-800"
    }

`}>

        <h1 className="text-2xl font-bold mb-10">
          AI Forecast
        </h1>

        <nav className="space-y-4">

        {/*For Admin Access*/
           role === "super_admin" &&
           ( <>
                 <Link
            to="/admin/dashboard"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Dashboard
          </Link>

            <Link
            to="/admin/users"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Manage Users
          </Link>

            <Link
            to="/admin/activity-logs"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Activity Logs
          </Link>      

          <Link
            to="/admin/sales"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Manage Dataset
          </Link>

           <Link
            to="/admin/forecasts"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Manage Forecast 
          </Link>

           <Link
            to="/admin/reports"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Manage Reports
          </Link>

          <Link
            to="/admin/integration-managment"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Manage Integration
          </Link>

          </>)
        }

        {/*For Analyst Access*/

        role ==="analyst" &&
        ( <>
          <Link
            to="/dashboard"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Dashboard
          </Link>

          <Link
            to="/upload"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Upload Dataset
          </Link>

          <Link
            to="/forecast"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Forecast
          </Link>

          <Link
            to="/reports"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Reports
          </Link>

          </>)
        }

        {/* Viewer Access*/
          role === "viewer" &&
          (<>
           <Link
            to="/dashboard"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Dashboard
          </Link>

          <Link
            to="/reports"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Reports
          </Link>

          </>)
        
        }

          <Link
            to="/profile"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Profile
          </Link>


          <Link
            to="/download-summary"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Analytic Summary
          </Link>


          <div className="       
          block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition">
             <NotificationDropdown />
          </div>
      
          <button
            onClick={handleLogout}
            className="
            mt-10
            w-full
            bg-white/10
            border
            border-white/20
            px-4
            py-3
            rounded-2xl
            hover:bg-red-500
            hover:border-red-500
            transition
            font-semibold
            backdrop-blur-md
          "
          >
            Logout
          </button>

        <button

    onClick={toggleTheme}

    className="
        w-full
        mt-6
        px-4
        py-3
        rounded-xl
        bg-gray-200
        dark:bg-gray-700
        text-black dark:text-white
        transition
    "
>

    {darkMode?"☀ Light Mode":"🌙 Dark Mode"}

</button>  


        </nav>

      </div>

      {/* Page Content */}

   <div className={`

    ml-64
    flex-1
    p-6
    transition-all
    duration-300

    ${darkMode

        ?

        "bg-gray-950 text-white"

        :

        "bg-gray-100 text-black"
    }


`}>
      
        {

    React.cloneElement(

        children,

        { darkMode }

    )

}

      </div>

    </div>
  );
}

export default Layout;