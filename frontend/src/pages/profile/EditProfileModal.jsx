import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    bio: "",
    newPassword: "",
    currentPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullname: authUser.fullname,
        email: authUser.email,
        bio: authUser.bio,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  return (
    <>
      <button
        className="btn bg-indigo-400 hover:bg-indigo-300 rounded-full btn-sm text-white"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData);
            }}
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.fullname}
                name="fullname"
                onChange={handleInputChange}
              />
              <input
                disabled
                type="text"
                placeholder={authUser.username}
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>

            <button className="btn bg-indigo-400 hover:bg-indigo-300 rounded-full btn-sm text-white">
              {isUpdatingProfile ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
