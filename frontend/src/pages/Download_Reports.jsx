import Layout from "../components/Layout";
import { Link } from "react-router-dom";

function DownloadReports() {

    return (
        <Layout>
       <div className="p-8">

    <h1
    className="
    text-3xl
    font-bold
    mb-2
    "
    >
        Download Center
    </h1>

    <p
    className="
    text-gray-500
    mb-8
    "
    >
        Download generated reports and business analytics documents.
    </p>

    <div
    className="
    grid
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
    gap-6
    "
    >

        {/* Forecast Report */}

        <Link
            to="/download/forecast-report"
            className="
            bg-white
            rounded-2xl
            shadow-lg
            p-6
            hover:shadow-2xl
            hover:-translate-y-1
            transition-all
            duration-300
            "
        >

            <div className="text-5xl mb-4">
                📈
            </div>

            <h2
            className="
            text-xl
            font-semibold
            text-gray-800
            "
            >
                Forecast Report
            </h2>

            <p
            className="
            text-gray-500
            mt-2
            "
            >
                Download forecast predictions and demand analysis reports.
            </p>

            <div
            className="
            mt-4
            text-green-600
            font-medium
            "
            >
                Download →
            </div>

        </Link>

        {/* Analytics Summary */}

        <Link
            to="/download/analytic-summary"
            className="
            bg-white
            rounded-2xl
            shadow-lg
            p-6
            hover:shadow-2xl
            hover:-translate-y-1
            transition-all
            duration-300
            "
        >

            <div className="text-5xl mb-4">
                📊
            </div>

            <h2
            className="
            text-xl
            font-semibold
            text-gray-800
            "
            >
                Analytics Summary
            </h2>

            <p
            className="
            text-gray-500
            mt-2
            "
            >
                Download business insights, KPIs and executive summaries.
            </p>

            <div
            className="
            mt-4
            text-green-600
            font-medium
            "
            >
                Download →
            </div>

        </Link>

    </div>

</div>
    </Layout>    
    );
}

export default DownloadReports;
