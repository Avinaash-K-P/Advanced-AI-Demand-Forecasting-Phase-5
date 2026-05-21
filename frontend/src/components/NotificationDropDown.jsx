import { useState } from "react"
import { Bell } from "lucide-react"
import { useEffect } from "react"

const NotificationDropdown = () => {

    const [notifications, setNotifications] = useState([])
    const [open, setOpen] = useState(false)
   
useEffect(() => {

    const storedNotifications =

        JSON.parse(
            localStorage.getItem("notifications")
        ) || []

    setNotifications(storedNotifications)

}, [open])

    return (

        <div className="relative">

            {/* Bell Icon */}
            <button
                onClick={() => setOpen(!open)}
                className="relative"
            >

                <Bell className="w-7 h-7 text-white cursor-pointer" />

                {/* Notification Count */}
                {
                    notifications.length > 0 && (

                        <span
                            className="absolute -top-2 -right-2
                            bg-red-500 text-white text-xs
                            rounded-full px-2 py-0.5"
                        >

                            {notifications.length}

                        </span>
                    )
                }

            </button>

            {/* Dropdown */}
            {
                open && (

                    <div
                        className="absolute left-0 mt-4
                        w-80 bg-white rounded-2xl
                        shadow-2xl z-50 overflow-hidden"
                    >

                        {/* Header */}
                        <div
                            className="bg-indigo-900 text-white
                            px-4 py-3 font-bold"
                        >

                            Notifications

                        </div>

                        {/* Notification List */}
                        <div className="max-h-96 overflow-y-auto">

                            {
                                notifications.length === 0 ? (

                                    <p className="p-4 text-gray-500">

                                        No notifications

                                    </p>

                                ) : (

                                    notifications.map((notification) => (

                                        <div
                                            key={notification.id}
                                            className="border-b p-4 hover:bg-gray-100"
                                        >

                                            <p className="font-semibold text-gray-800">

                                                {notification.message}

                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">

                                                {notification.time}

                                            </p>

                                        </div>

                                    ))
                                )
                            }

                        </div>

                    </div>
                )
            }

        </div>
    )
}

export default NotificationDropdown