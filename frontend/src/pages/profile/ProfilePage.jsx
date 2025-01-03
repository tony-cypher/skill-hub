import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";

const ProfilePage = () => {
  const [profileImg, setProfileImg] = useState(null);
  // const [feedType, setFeedType] = useState("posts");
  const profileImgRef = useRef(null);
  const { username } = useParams();
  const feedType = "posts";

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const isMyProfile = authUser._id === user?._id;
  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex-[4_4_0]  border-r border-gray-700 bg-base-200 min-h-screen ">
        {/* HEADER */}
        {isLoading || (isRefetching && <ProfileHeaderSkeleton />)}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullname}</p>
                </div>
              </div>
              {/* PROFILE IMG */}
              <div className="relative group/cover mt-20">
                <input
                  type="file"
                  hidden
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />
                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={
                        profileImg ||
                        user?.profileImg ||
                        "https://i.pinimg.com/736x/ff/5f/78/ff5f78476f0edf5b1bf7840f84342ebd.jpg"
                      }
                    />
                    <div className="absolute top-5 right-3 p-1 bg-indigo-400 rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal />}
                {profileImg && (
                  <button
                    className="btn bg-indigo-400 hover:bg-indigo-300 rounded-full btn-sm text-white px-4 ml-2"
                    onClick={async () => {
                      await updateProfile({ profileImg });
                      setProfileImg(null);
                    }}
                  >
                    {isUpdatingProfile ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              <div className="flex flex-row">
                <div className="flex flex-col gap-4 mt-14 px-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">{user?.fullname}</span>
                    <span className="text-sm text-slate-500">
                      @{user?.username}
                    </span>
                    <span className="text-sm my-1">
                      {user?.type.toUpperCase()}
                    </span>
                    <span className="text-sm my-1">
                      {user?.phone || "08012345678"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-14 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm my-1">
                      {user?.work || "work: N/A"}
                    </span>
                    <span className="text-sm my-1">
                      {user?.state || "state: N/A"}
                    </span>
                    <span className="text-sm my-1">
                      {user?.lga || "lga: N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap">
                <span className="text-sm my-1">{user?.bio || "bio: N/A"}</span>
                <span className="text-sm my-1">
                  {user?.services || "service: N/A"}
                </span>
                <div className="flex gap-2 flex-wrap">
                  {user?.email && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <MdOutlineMail className="w-3 h-3 text-slate-500" />
                        <a
                          href={`mailto:${user?.email}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {user?.email}
                        </a>
                      </>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-b border-gray-700 mt-4"></div>
            </>
          )}

          <div className="mt-6">
            <Posts feedType={feedType} username={username} />
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
