import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  // GETS ALL USER'S NOTIFICATIONS
  try {
    // gets the user's id
    const userId = req.user._id;

    // gets the notifications directed to the user
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    // returns the notification
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotifications = async (req, res) => {
  // DELETES ALL NOTIFICATIONS
  try {
    // gets the user's id
    const userId = req.user._id;

    // deletes all user's notifications
    await Notification.deleteMany({ to: userId });

    // returns a success response
    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotifications controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
