import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { getThemeStyles } from "../components/ThemeStyles";
import { toast } from "react-toastify";

function DashboardPreferences() {

const darkMode =localStorage.getItem("theme") === "dark";
const styles = getThemeStyles(darkMode);

const [preferences, setPreferences] = useState({

    show_kpi: true,
    show_revenue: true,
    show_profit: true,
    show_growth: true,
    show_cost: true,
    show_ai_insights: true

});

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

        setPreferences({
            show_kpi: response.data.data.show_kpi,
            show_revenue: response.data.data.show_revenue,
            show_profit: response.data.data.show_profit,
            show_growth: response.data.data.show_growth,
            show_cost: response.data.data.show_cost,
            show_ai_insights: response.data.data.show_ai_insights
        });

    }

    catch(error){

        console.error(error);

    }

};

const savePreferences = async () => {

    try {

        await axios.put(

            "http://127.0.0.1:8000/dashboard/preferences",

            preferences,

            {
                headers: {
                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`
                }
            }

        );

        toast.success("Preferences Saved Successfully");

    }

    catch(error){

        console.error(error);

    }

};

const handleChange = (e) => {

    setPreferences({

        ...preferences,

        [e.target.name]: e.target.checked

    });

};

useEffect(() => {

    loadPreferences();

}, []);

return (

<Layout>

<div
className={
    `${styles.card}
    max-w-3xl
    mx-auto
    rounded-2xl
    shadow-lg
    p-8
    `}

>

<h2
className="
text-2xl
font-bold
mb-6
"
>

Dashboard Preferences

</h2>

<div className="space-y-4">

<label className="flex items-center gap-3">

<input
type="checkbox"
name="show_kpi"
checked={preferences.show_kpi}
onChange={handleChange}
/>

Show KPI Cards

</label>

<label className="flex items-center gap-3">

<input
type="checkbox"
name="show_revenue"
checked={preferences.show_revenue}
onChange={handleChange}
/>

Show Revenue Forecast

</label>

<label className="flex items-center gap-3">

<input
type="checkbox"
name="show_profit"
checked={preferences.show_profit}
onChange={handleChange}
/>

Show Profit Forecast

</label>

<label className="flex items-center gap-3">

<input
type="checkbox"
name="show_growth"
checked={preferences.show_growth}
onChange={handleChange}
/>

Show Growth Impact

</label>

<label className="flex items-center gap-3">

<input
type="checkbox"
name="show_cost"
checked={preferences.show_cost}
onChange={handleChange}
/>

Show Cost Analysis

</label>

<label className="flex items-center gap-3">

<input
type="checkbox"
name="show_ai_insights"
checked={preferences.show_ai_insights}
onChange={handleChange}
/>

Show AI Insights

</label>

</div>

<button

onClick={savePreferences}

className="
mt-8
bg-green-600
hover:bg-green-700
text-white
px-6
py-3
rounded-xl
font-semibold
"

>

Save Preferences

</button>

</div>


</Layout>

);

}

export default DashboardPreferences;