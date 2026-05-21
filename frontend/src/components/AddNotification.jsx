export const addNotification = (message) => {

    const existingNotifications =

        JSON.parse(
            localStorage.getItem("notifications")
        ) || []

    const newNotification = {

        id: Date.now(),

        message,

        time: "Just now"
    }

    localStorage.setItem(

        "notifications",

        JSON.stringify([
            newNotification,
            ...existingNotifications
        ])
    )
}