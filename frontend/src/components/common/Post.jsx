import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");

  // gets user from db
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);

  const isMyPost = authUser._id === post.user._id;

  const formattedDate = formatPostDate(post.createdAt);

  // update post
  const [text, setText] = useState("");
  const [work, setWork] = useState("");

  const { mutate: updatePost } = useMutation({
    mutationFn: async ({ text, work }) => {
      try {
        const res = await fetch(`/api/posts/update/${post._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, work }),
        });
        const data = await res.json();

        if (!res.ok) {
          console.log(data.error);
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },

    onSuccess: () => {
      // reset the form state
      toast.success("Post updated successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleUpdatePost = () => {
    updatePost({ text, work });
  };

  // like function
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },

    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  // comment function
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: comment }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment created successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  // delete function
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/delete/${post._id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      // refetch the posts
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleDeletePost = () => {
    deletePost();
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 bg-base-200">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img
              src={
                postOwner.profileImg ||
                "https://i.pinimg.com/736x/ff/5f/78/ff5f78476f0edf5b1bf7840f84342ebd.jpg"
              }
            />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullname}
            </Link>
            <span className="text-slate-500 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
              <span>
                <b>{post.work}</b>
              </span>
            </span>
            {isMyPost && (
              <div className="flex justify-end flex-1">
                <span>
                  <button className="mr-5">
                    <FaPencilAlt
                      className="cursor-pointer hover:text-purple-500"
                      onClick={() =>
                        document.getElementById(post._id).showModal()
                      }
                    />
                  </button>
                  <dialog id={post._id} className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg text-center mb-3">
                        Update Post
                      </h3>
                      <input
                        type="text"
                        placeholder={post.text}
                        className="input input-bordered w-full max-w-sm"
                        name="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder={post.work || "update work"}
                        className="input input-bordered w-full max-w-sm mt-2"
                        name="work"
                        value={work}
                        onChange={(e) => setWork(e.target.value)}
                      />

                      <form method="dialog">
                        <button
                          className="btn btn-success ml-3 mt-3"
                          onClick={handleUpdatePost}
                        >
                          Update Post
                        </button>
                      </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                </span>
                <span>
                  {!isDeleting && (
                    <FaTrash
                      className="cursor-pointer hover:text-red-500"
                      onClick={handleDeletePost}
                    />
                  )}
                  {isDeleting && <LoadingSpinner size="sm" />}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-start">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() =>
                  document
                    .getElementById("comments_modal" + post._id)
                    .showModal()
                }
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">No comments yet.</p>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                comment.user.profileImg ||
                                "https://i.pinimg.com/736x/ff/5f/78/ff5f78476f0edf5b1bf7840f84342ebd.jpg"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user.fullName}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment.user.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn bg-indigo-400 hover:bg-indigo-300 rounded-full btn-sm text-white px-4">
                      {isCommenting ? <LoadingSpinner size="sm" /> : "Post"}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>

              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                {isLiking && <LoadingSpinner size="sm" />}
                {!isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-red-500" />
                )}
                {isLiked && !isLiking && (
                  <FaHeart className="w-4 h-4 cursor-pointer text-red-500 " />
                )}

                <span
                  className={`text-sm text-slate-500 group-hover:text-red-500 ${
                    isLiked ? "text-red-500" : ""
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
