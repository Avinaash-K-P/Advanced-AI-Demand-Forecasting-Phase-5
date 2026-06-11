import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import NotificationDropdown from "./NotificationDropDown";
import React from "react";
import {
  FaTachometerAlt,
  FaChartLine,
  FaUsersCog,
  FaClipboardList,
  FaFlask,
  FaFolderOpen,
  FaUserFriends,
  FaUpload,
  FaBrain,
  FaDownload,
  FaUserCircle,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import { getThemeStyles } from "./ThemeStyles";
import {toast} from "react-toastify";


function Layout({ children }) {

  const navigate = useNavigate();

  const username = localStorage.getItem("username"); // To display username in the dashboard

  const role = localStorage.getItem("role");

  const [showMenu,setShowMenu] = useState(false);

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");
  };

  const [darkMode, setDarkMode] = useState(false);
  
  const styles = getThemeStyles(darkMode);

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

  const token = localStorage.getItem("token");

  if (!token) {

    navigate("/");
    toast.error("Please log in to access the dashboard.");
  }

  }, []);


  useEffect(() => {

    const savedTheme =
        localStorage.getItem("theme");

    if(savedTheme === "dark"){

        document.documentElement
            .classList.add("dark");

        setDarkMode(true);
    }

}, []);

  return (

   <div
  className={`
    min-h-screen
    flex
    transition-all
    duration-300
    
     ${styles.layout}
    `}
>

      {/* Sidebar */}
   
   <div className={`   

    ${styles.navBar}
    fixed
    top-0
    left-0
    h-screen
    w-56

    overflow-y-auto
    p-6

    hidden
    md:block

    shadow-2xl
    transition-all
    duration-300
    text-center

   `}
    >


        { role =="super_admin" && (
        
        <h1 className="text-2xl font-bold mb-10">
            Admin Panel
        </h1>

         )
        }


      {(role === "analyst" || role === "viewer") && (

    <h1 className="text-2xl font-bold mb-10">
        AI Forecast
    </h1>

)}

        <nav className="space-y-4">

        <Link
            to="/dashboard"
            className="
             flex 
             items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaTachometerAlt className="shrink-0 text-lg"/>
            <span className="truncate">Dashboard</span> 
        </Link>




        {/*For Admin Access*/
           role === "super_admin" &&
           ( <>

                   <Link
            to="/executive-dashboard"
            className="
            flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaChartLine className="shrink-0 text-lg"/>
            <span className="truncate">Executive</span> 
          </Link>

            <Link
            to="/admin/management"
            className="
             flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaUsersCog />
           <span className="truncate">Manage</span> 
          </Link>

            <Link
            to="/admin/activity-logs"
            className="
             flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          > 
            <FaClipboardList className="shrink-0 text-lg"/>
            <span className="truncate">Logs</span> 
          </Link>

          <Link
            to="/forecast-scenario"
            className="
            flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaFlask className="shrink-0 text-lg"/>
            <span className="truncate">Scenario</span> 
          </Link>


          <Link
            to="/workspace"
            className="
             flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaFolderOpen className="shrink-0 text-lg"/>
           <span className="truncate">Workspace</span> 
          </Link>

          <Link
            to="/collaboration"
            className="
            flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaUserFriends className="shrink-0 text-lg"/>
            <span className="truncate">Collabs</span> 
          </Link>


          </>)
        }

        {/*For Analyst Access*/

        role ==="analyst" &&
        ( <>

          <Link
            to="/executive-dashboard"
            className="
            flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaChartLine className="shrink-0 text-lg"/>
            <span className="truncate">Executive</span> 
          </Link>

          <Link
            to="/upload"
            className="
            flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaUpload className="shrink-0 text-lg"/>
            <span className="truncate">Upload</span> 
          </Link>

          <Link
            to="/forecast"
            className="
            flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaBrain className="shrink-0 text-lg"/>
            <span className="truncate">Forecast</span> 
          </Link>

                    <Link
            to="/forecast-scenario"
            className="
            flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaFlask className="shrink-0 text-lg"/>
            <span className="truncate">Scenario</span> 
          </Link>


          <Link
            to="/workspace"
            className="
             flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaFolderOpen className="shrink-0 text-lg"/>
           <span className="truncate">Workspace</span> 
          </Link>

          <Link
            to="/collaboration"
            className="
            flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaUserFriends className="shrink-0 text-lg"/>
            <span className="truncate">Collabs</span> 
          </Link>

          </>)
        }

          <Link
            to="/download"
            className="
            flex items-center gap-3 p-3
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            <FaDownload className="shrink-0 text-lg"/>
            <span className="truncate">Downloads</span> 
          </Link>

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

{/*Top Bar*/}
<div className="
flex-1
flex
flex-col
ml-56
">

    <header
className={`
  
fixed
top-0
left-56
right-0

h-16
flex
items-center
justify-between

px-8

shadow-lg
z-50
      ${styles.navBar}
`}
>

        {/* Left */}

        <div
        className="
        text-xl
        font-semibold
        "
        >

            AI Demand Forecast


        </div>

        {/* Right */}

        <div
        className="
        flex
        items-center
        gap-6
        "
        >



              
            {/* Notification */}

          { <div className="       
          block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition">
             <NotificationDropdown />
          </div> }

            {/* User Dropdown */}

            <div
            className="
            relative
            "
            >
    
    <div
onClick={() =>
setShowMenu(!showMenu)
}
className="
cursor-pointer
font-medium
"
>

Welcome {username} ▼

{
showMenu && (

<div
className={`
  ${styles.navBar}
  absolute
right-0
top-10

w-52

text-gray-700

rounded-2xl
shadow-2xl

border
border-gray-200

overflow-hidden

z-50`}

>

    {/* User Header */}

    <div
    className=" 
    px-4
    py-3

    bg-gradient-to-r
    from-emerald-50
    to-green-100

    border-b
    "
    >

        <p className="
        text-sm
        text-gray-500
        ">
            Signed In
        </p>

        <p className="
        font-semibold
        text-gray-800
        ">
            {username}
        </p>

    </div>

    {/* Profile */}

    <Link
        to="/profile"
        className="
        flex
        items-center
        gap-3

        px-4
        py-3

        hover:bg-green-50
        hover:text-green-700

        transition
        duration-200
        "
    >

        <FaUserCircle/>

        <span>
            Profile
        </span>

    </Link>

     <div className="border-t"></div>

    {(role=="super_admin" || role == "analyst") &&
    (<>
            <Link
        to="/dashboard/settings"
        className="
        flex
        items-center
        gap-3

        px-4
        py-3

        hover:bg-green-50
        hover:text-green-700

        transition
        duration-200
        "
    >

        <FaCog/>

        <span>
            Widgets
        </span>

    </Link>  

      </>)
    }



    <div className="border-t"></div>

    {/* Logout */}

    <button

        onClick={handleLogout}

        className="
        w-full

        flex
        items-center
        gap-3

        px-4
        py-3

        text-left

        hover:bg-red-50
        hover:text-red-600

        transition
        duration-200
        "

    >

        <FaSignOutAlt/>

        <span>
            Logout
        </span>

    </button>

</div>

)
}


</div>


            </div>

        </div>

</header>

<main
className={`
  flex-1
  p-6
  pt-20
  overflow-y-auto

    ${styles.layout}
  
  
  `}
>
{children}
</main>

</div>

    </div>
  
);
}

export default Layout;