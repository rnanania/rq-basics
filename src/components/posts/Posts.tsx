import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { Post, fetchPosts, deletePost, updatePost } from "api/posts";
import { PostDetail } from "components/posts/PostDetail";
import ErrorMessage from "components//error/Error";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (postId: number) => updatePost(postId),
  });
  const deleteMutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
  });

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000,
  });

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage),
        staleTime: 2000,
      });
    }
  }, [currentPage, queryClient]);

  if (isLoading) return <h2>Loading...</h2>;
  if (isError || !posts)
    return <ErrorMessage message={error?.message || "Fetching blogs failed!!"} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
      <div className="col-span-2 border rounded p-4">
        <nav
          className="flex items-baseline justify-between border-b border-gray-200 bg-white py-3"
          aria-label="Pagination"
        >
          <h3 className="flex flex-1">
            Blogs
          </h3>
          <div className="justify-between">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((s) => s - 1);
              }}
              className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
            >
              Previous
            </button>
            <span className="relative inline-flex items-center rounded bg-blue-50 mx-4 px-3 py-2 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {currentPage}
            </span>
            <button
              disabled={currentPage === maxPostPage}
              onClick={() => {
                setCurrentPage((s) => s + 1);
              }}
              className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
            >
              Next
            </button>
          </div>
        </nav>
        <ul role="list" className="divide-y divide-gray-100 cursor-pointer">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex justify-between gap-x-6 hover:shadow-md"
              onClick={() => {
                updateMutation.reset();
                deleteMutation.reset();
                setSelectedPost(post);
              }}
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold">
                    {post.title}
                  </p>
                  <p className="mt-1 truncate text-xs">
                    {post.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border rounded p-4">
        <>
        {!selectedPost && (
          <h3>
          Please select the blog to see the details.
          </h3>
        )}
        {selectedPost && (
          <PostDetail
            post={selectedPost}
            deleteMutation={deleteMutation}
            updateMutation={updateMutation}
          />
        )}
        </>
      </div>
    </div>
  );
}
