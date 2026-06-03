import axios from "axios";
import { useState } from "react"; 
import {Link, useNavigate} from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {

    const navigate = useNavigate();  

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        setLoading(true);

        const response = await axios.post(

            "http://127.0.0.1:8000/auth/forgot-password",

            {

                email

            }

        );

        localStorage.setItem("reset_token",response.data.data.reset_token);

        navigate("/reset-password");

    }

    catch(error){

        toast.error(error.response?.data?.detail ||
            "Request failed"
        );
    }

    finally{

        setLoading(false);
    }
};

return(

      <div className="min-h-screen flex">

    {/* Left Section */}
<div className="hidden md:flex w-1/2 bg-gradient-to-br
from-emerald-950
via-teal-900
to-green-800
text-white 
items-center 
justify-center p-12">

      <div>

        <h1 className="text-5xl font-bold mb-6">
          AI Demand Forecasting
        </h1>

        <p className="text-lg text-gray-300 leading-8">

          Predict future product demand using
          AI-powered analytics, forecasting,
          and intelligent business insights.

        </p>

      </div>

    </div>

    {/* Right Section */}
    <div className="flex-1 flex items-center justify-center bg-gray-100 p-6">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">
    
	 <h2 className="text-2xl font-bold mb-6">

        Forgot Password

    </h2>

    <form onSubmit={handleSubmit}>

        <input

            type="email"

            placeholder="Enter Email"

            value={email}

            onChange={(e)=>
                setEmail(e.target.value)
            }

            className="

                w-full
                border
                p-3
                rounded-lg

            "

        />

        <button

            type="submit"

            className="

                mt-4

                bg-blue-600

                text-white

                px-4

                py-2

                rounded-lg

            "

        >
            Reset Password

            {/* {

                loading

                ? "Sending..."

                : "Generate Reset Token"

            } */}

        </button>

<br/>


    </form>     

      </div>

    </div>

  </div>



)
}

export default ForgotPassword;