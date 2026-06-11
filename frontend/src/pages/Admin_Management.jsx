import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { getThemeStyles } from "../components/ThemeStyles";

function Management() {
    const darkMode =localStorage.getItem("theme") === "dark";
    const styles = getThemeStyles(darkMode);
    return (
    <Layout>

<div className="p-8">

    <h1 className="
    text-3xl
    font-bold
    mb-8
    ">
        Management Center
    </h1>

    <div className="
    grid
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
    gap-6
    ">

        {/* Manage Users */}

        <Link
        
            to="/admin/management/users"
            className={`${styles.card}
            rounded-2xl
            shadow-lg
            p-6
            hover:shadow-2xl
            hover:-translate-y-1
            transition
            duration-300`}
   
            
        >

            <div className="text-4xl mb-4">
                👥
            </div>

            <h2 className="text-xl font-semibold">
                Manage Users
            </h2>

            <p className="text-gray-500 mt-2">
                View, edit and manage system users.
            </p>

        </Link>

        {/* Manage Datasets */}

        <Link
            to="/admin/management/sales"
            className={`${styles.card}
            rounded-2xl
            shadow-lg
            p-6
            hover:shadow-2xl
            hover:-translate-y-1
            transition
            duration-300
            `}

            
        >

            <div className="text-4xl mb-4">
                📁
            </div>

            <h2 className="text-xl font-semibold">
                Manage Datasets
            </h2>

            <p className="text-gray-500 mt-2">
                Review uploaded sales datasets.
            </p>

        </Link>

        {/* Manage Forecasts */}

        <Link
            to="/admin/management/forecasts"
            className={`${styles.card}
            rounded-2xl
            shadow-lg
            p-6
            hover:shadow-2xl
            hover:-translate-y-1
            transition
            duration-300
            `}
        >

            <div className="text-4xl mb-4">
                📈
            </div>

            <h2 className="text-xl font-semibold">
                Manage Forecasts
            </h2>

            <p className="text-gray-500 mt-2">
                Monitor generated forecasting results.
            </p>

        </Link>

        {/* Manage Reports */}

        <Link
            to="/admin/management/reports"
            className={`${styles.card}
            rounded-2xl
            shadow-lg
            p-6
            hover:shadow-2xl
            hover:-translate-y-1
            transition
            duration-300
            `}
        >

            <div className="text-4xl mb-4">
                📊
            </div>

            <h2 className="text-xl font-semibold">
                Manage Reports
            </h2>

            <p className="text-gray-500 mt-2">
                Access generated business reports.
            </p>

        </Link>

        {/* Manage Integration */}

        <Link
            to="/admin/management/integration"
            className={`${styles.card}
            rounded-2xl
            shadow-lg
            p-6
            hover:shadow-2xl
            hover:-translate-y-1
            transition
            duration-300
            `}
        >

            <div className="text-4xl mb-4">
                🔗
            </div>

            <h2 className="text-xl font-semibold">
                Manage Integration
            </h2>

            <p className="text-gray-500 mt-2">
                Configure external system integrations.
            </p>

        </Link>

    </div>

</div>

    </Layout>    
    );

}

export default Management;