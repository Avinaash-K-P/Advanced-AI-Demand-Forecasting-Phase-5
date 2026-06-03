import { useState, useEffect } from "react"; 
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPassword()
{

const navigate = useNavigate();  

const [token,setToken] = useState("");

const [newPassword,setNewPassword] = useState("");

const [confirmPassword, setConfirmPassword] = useState("");

const [loading,setLoading] = useState(false);

const handleSubmit = async (e) => {

    e.preventDefault();

    if(newPassword !== confirmPassword){

        toast.error(
            "Passwords do not match"
        );

        return;
    }

    try {

        setLoading(true);

        await axios.post(

            "http://127.0.0.1:8000/auth/reset-password",

            {

                token,

                new_password:newPassword

            }

        );

        toast.success(

            "Password reset successful!"
        );


    }

    catch(error){

        toast.error(

            error.response?.data?.detail ||
            "Reset failed"

        );
    }

    finally{

        navigate("/")
        setLoading(false);
    }
};

useEffect(() => {

    const savedToken =
    localStorage.getItem(
        "reset_token"
    );

    if(savedToken){

        setToken(
            savedToken
        );
    }

}, []);

return (

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
    
	    <h2 className="

        text-2xl
        font-bold

        mb-6

    ">

        Reset Password

    </h2>

    <form onSubmit={handleSubmit}>

        <input

          type="password"

        placeholder="New Password"

        value={newPassword}

        onChange={(e)=>
            setNewPassword(
                e.target.value
            )
        }
            className="

                w-full
                border
                p-3
                rounded-lg

                mb-4

            "

        />

        <input

            type="password"

        placeholder="Confirm Password"

        value={confirmPassword}

        onChange={(e)=>
            setConfirmPassword(
                e.target.value
            )
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

                bg-green-600

                text-white

                px-4

                py-2

                rounded-lg

            "

        >

            {

                loading

                ? "Updating..."

                : "Reset Password"

            }

        </button>

    </form>	

      </div>

    </div>

  </div>

)

}
export default ResetPassword;