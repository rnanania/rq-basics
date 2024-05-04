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
    return <ErrorMessage message={error?.message || "Fetching Failed"} />;

  return (
    <div className="grid grid-cols-3 gap-4 mt-2">
      <div className="col-span-2 border rounded p-2">
        <nav
          className="flex items-center justify-between border-b border-gray-200 bg-white py-3"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                Page {currentPage}
              </span>
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((s) => s - 1);
              }}
              className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
            >
              Previous
            </button>
            <button
              disabled={currentPage === maxPostPage}
              onClick={() => {
                setCurrentPage((s) => s + 1);
              }}
              className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
            >
              Next
            </button>
          </div>
        </nav>
        <ul role="list" className="divide-y divide-gray-100 cursor-pointer">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex justify-between gap-x-6 px-2 py-5 hover:shadow-md"
              onClick={() => {
                updateMutation.reset();
                deleteMutation.reset();
                setSelectedPost(post);
              }}
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {post.title}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {post.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border rounded p-2">
        {selectedPost && (
          <PostDetail
            post={selectedPost}
            deleteMutation={deleteMutation}
            updateMutation={updateMutation}
          />
        )}
      </div>
    </div>
  );
}
