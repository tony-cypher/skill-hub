import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

const HomePage = () => {
  const { data: category } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/posts/category");
        const data = res.json();

        if (data.error) {
          console.log("data error", data);
        }

        if (!res.ok) {
          throw new Error("Something went wrong!");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const [selectedSkill, setSelectedSkill] = useState("");
  const [feedType, setFeedType] = useState("forYou");

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <>
      <div className="flex-[4_4_0] mr-auto bg-base-300 min-h-screen">
        {/*  CREATE POST INPUT */}
        {authUser.type === "artisan" ? <CreatePost /> : <></>}
        <div className="flex flex-row gap-4 mr-auto mt-3 mb-2 ml-5">
          <select
            className="select select-bordered w-full sm:w-1/3 md:w-1/4"
            onChange={(e) => {
              setFeedType("search");
              setSelectedSkill(e.target.value);
            }}
          >
            <option value="" disabled>
              Find by category
            </option>
            {category ? (
              category.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))
            ) : (
              <option>loading...</option>
            )}
          </select>
          <button className="btn btn-ghost">
            <FaSearch />
          </button>
        </div>
        {/* POSTS */}
        <Posts feedType={feedType} category={selectedSkill.toLowerCase()} />
      </div>
    </>
  );
};
export default HomePage;
