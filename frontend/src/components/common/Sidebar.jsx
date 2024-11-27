import { useState } from "react";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { FiSun } from "react-icons/fi";
import { IoMoonOutline } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
  // Function to toggle the theme
  const [theme, setTheme] = useState("");
  const handleToggle = () => {
    const newTheme = theme === "cupcake" ? "sunset" : "cupcake"; // Switch themes
    setTheme(newTheme); // Update state
    document.documentElement.setAttribute("data-theme", newTheme); // Update HTML attribute
  };

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout/", {
          method: "POST",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      // refetch the authUser
      window.location.href = "/login";
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col w-20 md:w-full">
        <ul className="flex flex-col gap-3 mt-4">
          <li className="justify-center md:justify-start ">
            <h1 className="ml-3 text-2xl font-bold ">SKILL HUB</h1>
          </li>
          <li className="flex justify-center md:justify-start mt-5">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-indigo-300 hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-indigo-300 hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-indigo-300 hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/messages"
              className="flex gap-3 items-center hover:bg-indigo-300 hover:text-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FiMessageSquare className="w-6 h-6" />
              <span className="text-lg hidden md:block">Messages</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <div className="flex gap-3 items-center transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer">
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  onChange={handleToggle}
                  checked={theme === "sunset"}
                />
                <IoMoonOutline className="swap-off h-10 w-10 fill-current" />
                <FiSun className="swap-on h-8 w-8 fill-current" />
              </label>
            </div>
          </li>
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-indigo-300 py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img
                  src={
                    authUser.profileImg ||
                    "https://i.pinimg.com/736x/ff/5f/78/ff5f78476f0edf5b1bf7840f84342ebd.jpg"
                  }
                />
              </div>
            </div>
            <div className="flex justify-between flex-1 hover:text-white">
              <div className="hidden md:block">
                <p className="font-bold text-sm w-20 truncate">
                  {authUser?.fullname}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
