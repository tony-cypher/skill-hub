import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        {/*  CREATE POST INPUT */}
        {authUser.type === "artisan" ? <CreatePost /> : <></>}

        {/* POSTS */}
        <Posts />
      </div>
    </>
  );
};
export default HomePage;
