import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import { useQuery } from "@tanstack/react-query";
import EmbeddedChatbot from "../../hooks/EmbeddedChatBot";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const feedType = "forYou";
  return (
    <>
      <div className="flex-[4_4_0] mr-auto bg-base-300 min-h-screen">
        {/*  CREATE POST INPUT */}
        {authUser.type === "artisan" ? <CreatePost /> : <></>}

        {/* POSTS */}
        <Posts feedType={feedType} />
        <EmbeddedChatbot />
      </div>
    </>
  );
};
export default HomePage;
