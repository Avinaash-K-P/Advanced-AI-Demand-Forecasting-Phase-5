import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { getThemeStyles } from "../components/ThemeStyles";

function ExecutiveDashboard() {

const darkMode = localStorage.getItem("theme") === "dark";

const styles = getThemeStyles(darkMode);

const [dashboardData,setDashboardData] = useState(null);

const [preferences, setPreferences] = useState(null);

const formatNumber = (value) =>
    Number(value || 0).toLocaleString("en-IN");

const formatCompactNumber = (value) =>
    Intl.NumberFormat("en-IN", {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(value);

const loadDashboard = async() => {

try {

    const response = await axios.get(
        "http://127.0.0.1:8000/business/executive-dashboard",
        {
            headers:{
                Authorization:
                `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    setDashboardData(
        response.data.data
    );

}

catch(error){

    console.error(error);

}

};
const loadPreferences = async () => {

    try {

        const response = await axios.get(

            "http://127.0.0.1:8000/dashboard/preferences",

            {
                headers: {
                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }

        );

        setPreferences(response.data.data);

    }

    catch(error){

        console.error(error);

    }

};

useEffect(() => {

    loadDashboard();
    loadPreferences();

}, []);


if(!dashboardData || !preferences){

return(
    <Layout>
        <div className="p-6">
            Loading Executive Dashboard...
        </div>
    </Layout>
);

}

const revenueForecast =
dashboardData["Revenue forecast"];

const profitForecast =
dashboardData["Profit Forecast"];

const costAnalysis =
dashboardData["Cost Analysis"];

const kpis =
dashboardData["Business KPI's"];

const growthImpact =
dashboardData["Growth Impact"];

return(<Layout>

{
preferences.show_kpi && (

<div className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-6
mb-8
">

    <div className="
    bg-blue-500
    text-white
    rounded-2xl
    p-6
    shadow-lg
    ">
        <h3>Total Sales</h3>
        <p className="text-3xl font-bold mt-2">
            {kpis.total_sales}
        </p>
    </div>

    <div className="
    bg-green-500
    text-white
    rounded-2xl
    p-6
    shadow-lg
    ">
        <h3>Total Forecasts</h3>
        <p className="text-3xl font-bold mt-2">
            {kpis.total_forecasts}
        </p>
    </div>

    <div className="
    bg-purple-500
    text-white
    rounded-2xl
    p-6
    shadow-lg
    ">
        <h3>Average Demand</h3>
        <p className="text-3xl font-bold mt-2">
            {kpis.average_demand}
        </p>
    </div>

    <div className="
    bg-orange-500
    text-white
    rounded-2xl
    p-6
    shadow-lg
    ">
        <h3>Total Revenue</h3>
        <p className="text-3xl font-bold mt-2">
            ₹ {formatCompactNumber(kpis.total_revenue)}
        </p>
    </div>

</div>

)
}

<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
mb-8
">

{/* Cost Analysis */}

{
preferences.show_cost && (

<div className={`
    ${styles.card}
    rounded-2xl
    shadow-lg
    p-6
`}
>

<h2 className="
text-xl
font-bold
mb-4
">
Cost Analysis
</h2>

<div className="space-y-3">

<p>
Revenue:
<span className="font-bold text-green-600 ml-2">
₹ {Number(costAnalysis.forecasted_revenue).toLocaleString("en-IN") }
</span>
</p>

<p>
Profit:
<span className="font-bold text-blue-600 ml-2">
₹ {Number(costAnalysis.forecasted_profit).toLocaleString("en-IN") }
</span>
</p>

<p>
Cost:
<span className="font-bold text-red-500 ml-2">
₹ {Number(costAnalysis.forecasted_cost).toLocaleString("en-IN") }
</span>
</p>

</div>
</div>

)

}

{/* Growth Impact */}

{
preferences.show_growth && (


<div className={`
    ${styles.card}
    rounded-2xl
    shadow-lg
    p-6
`}>

<h2 className="
text-xl
font-bold
mb-4
">
Growth Impact
</h2>

<div className="space-y-3">

<p>
Current Revenue:
<span className="font-bold ml-2">
₹ {Number(growthImpact.current_revenue).toLocaleString("en-IN") } 
</span>
</p>

<p>
Forecast Revenue:
<span className="font-bold ml-2">
₹ {Number(growthImpact.forecast_revenue).toLocaleString("en-IN") } 
</span>
</p>

<p>
Growth:
<span className="
font-bold
text-green-600
ml-2
">
{growthImpact.growth_percentage}%
</span>
</p>

</div>

</div>

)
}

</div>

{
preferences.show_revenue && (


<div className={`
    ${styles.card}
    rounded-2xl
    shadow-lg
    p-6
    mb-8
`}>

<h2 className="
text-xl
font-bold
mb-4
">
Revenue Forecast
</h2>

<div className="overflow-x-auto">

<table className="w-full">

<thead>

<tr className={`
 ${styles.tableHeader}
 text-left
`}
>

<th className="p-3">
Forecast Date
</th>

<th className="p-3">
Demand
</th>

<th className="p-3">
Revenue
</th>

</tr>

</thead>

<tbody>

{
revenueForecast.map((row,index)=>(

<tr
key={index}
className={`
    ${styles.tableRow}
    border-b    
`}
>

<td className="p-3">
{row.forecast_date}
</td>

<td className="p-3">
{row.predicted_demand}
</td>

<td className="p-3">
₹ {row.forecasted_revenue}
</td>

</tr>

))
}

</tbody>

</table>

</div>

</div>
)
}


{
    preferences.showprofit && (
        
<div className={`
    ${styles.card}
    rounded-2xl
    shadow-lg
    p-6
    mb-8
`}>

<h2 className="
text-xl
font-bold
mb-4
">
Profit Forecast
</h2>

<div className="overflow-x-auto">

<table className="w-full">

<thead>

<tr className={`
 ${styles.tableHeader}
 text-left
`}>

<th className="p-3">
Forecast Date
</th>

<th className="p-3">
Profit
</th>

</tr>

</thead>

<tbody>

{
profitForecast.map((row,index)=>(

<tr
key={index}
className={`
    ${styles.tableRow}
    border-b    
`}
>

<td className="p-3">
{row.forecast_date}
</td>

<td className="p-3">
₹ {Number(row.forecasted_profit).toLocaleString("en-IN") } 
</td>

</tr>

))
}

</tbody>

</table>

</div>

</div>
)
}

{
preferences.show_ai_insights && (

<div className={`${styles.card}
rounded-2xl
shadow-lg
p-6
mt-8

`}


>

<h2 className="
text-xl
font-bold
mb-4
">
AI Insights
</h2>

<ul className="space-y-2">

<li>
Demand growth expected in upcoming periods.
</li>

<li>
Revenue trend remains positive.
</li>

<li>
Inventory optimization recommended.
</li>

<li>
Monitor high-demand products closely.
</li>

</ul>

</div>

)
}

</Layout>)

}

export default ExecutiveDashboard;