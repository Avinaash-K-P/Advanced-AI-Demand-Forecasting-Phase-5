import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function Profile() {

    const [profile, setProfile] = useState({

        username: "",

        email: "",

        role: ""

    });

    const [loading, setLoading] = useState(false);
    const fetchProfile = async () => {

    try {

        const response = await axios.get(

            "http://127.0.0.1:8000/auth/profile",

            {

                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`

                }

            }

        );

        setProfile(response.data);

    }

    catch(error){

        console.error(error);
    }

};
useEffect(() => {

    fetchProfile();

}, []);

const handleChange = (e) => {

    setProfile({

        ...profile,

        [e.target.name]: e.target.value

    });

};

const updateProfile = async () => {

    try {

        setLoading(true);

        await axios.put(

            "http://127.0.0.1:8000/auth/profile",

            {

                username: profile.username,

                email: profile.email

            },

            {

                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("token")}`

                }

            }

        );

        alert("Profile updated successfully");

    }

    catch(error){

        console.error(error);

        alert("Profile update failed");
    }

    finally{

        setLoading(false);
    }

};

return (

<Layout>
<div className="

    max-w-2xl
    mx-auto

    bg-white

    rounded-xl

    shadow-lg

    p-6

">

    <h2 className="

        text-2xl
        font-bold

        mb-6

    ">

        My Profile

    </h2>

    <div className="mb-4">

        <label>

            Username

        </label>

        <input

            type="text"

            name="username"

            value={profile.username}

            onChange={handleChange}

            className="

                w-full

                border

                rounded-lg

                p-2

                mt-1

            "

        />

    </div>

    <div className="mb-4">

        <label>

            Email

        </label>

        <input

            type="email"

            name="email"

            value={profile.email}

            onChange={handleChange}

            className="

                w-full

                border

                rounded-lg

                p-2

                mt-1

            "

        />

    </div>

    <div className="mb-6">

        <label>

            Role

        </label>

        <input

            value={profile.role}

            disabled

            className="

                w-full

                bg-gray-100

                border

                rounded-lg

                p-2

                mt-1

            "

        />

    </div>

    <button

        onClick={updateProfile}

        disabled={loading}

        className="

            bg-blue-600

            text-white

            px-4

            py-2

            rounded-lg

        "

    >

        {

            loading

            ? "Saving..."

            : "Update Profile"

        }

    </button>

</div>
</Layout>

);

}

export default Profile;