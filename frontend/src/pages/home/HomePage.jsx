import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

const HomePage = () => {
  const [selectedSkill, setSelectedSkill] = useState("");
  const skills = [
    "Electrician",
    "Plumber",
    "Mechanic",
    "Carpenter",
    "Phone/Laptop repair",
    "chef",
    "Fashion designer",
  ];
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const feedType = "forYou";
  const handleSkillSubmit = () => {
    if (selectedSkill) {
      alert(`You selected: ${selectedSkill.toLowerCase()}`);
    } else {
      toast.error("Please select a skill!");
    }
  };
  return (
    <>
      <div className="flex-[4_4_0] mr-auto bg-base-300 min-h-screen">
        {/*  CREATE POST INPUT */}
        {authUser.type === "artisan" ? <CreatePost /> : <></>}
        <div className="flex flex-row gap-4 mr-auto mt-3 mb-2 ml-5">
          <select
            className="select select-bordered w-full sm:w-1/3 md:w-1/4"
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="" disabled>
              Find by category
            </option>
            {skills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
          <button className="btn btn-ghost" onClick={handleSkillSubmit}>
            <FaSearch />
          </button>
        </div>
        {/* POSTS */}
        <Posts feedType={feedType} />
      </div>
    </>
  );
};
export default HomePage;
