import { UseMutationResult, useQuery } from "@tanstack/react-query";
import { Post, fetchComments } from "api/posts";
import ErrorMessage from "components/error/Error";

type CommentsProps = {
  postId: number;
};
const Comments = ({ postId }: CommentsProps) => {
  const {
    data: comments,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["comments", "post", postId],
    queryFn: () => fetchComments(postId),
    staleTime: 5000,
  });

  if (isLoading) return <h2>Loading...</h2>;
  if (isError || !comments)
    return <ErrorMessage message={error?.message || "Fetching comments failed!!"} />;

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </ul>
  );
};

type PostDetailProps = {
  post: Post;
  deleteMutation: UseMutationResult<void, Error, number, unknown>;
  updateMutation: UseMutationResult<void, Error, number, unknown>;
};
export function PostDetail({
  post,
  deleteMutation,
  updateMutation,
}: PostDetailProps) {
  return (
    <>
      <h3>
        {post.title}
      </h3>
      <p className="my-2">{post.body}</p>
      <div className="flex flex-1 justify-end my-2">
        <button
          onClick={() => {
            deleteMutation.mutate(post.id);
          }}
          className="relative inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          Delete
        </button>
        <button
          onClick={() => {
            updateMutation.mutate(post.id);
          }}
          className="relative ml-3 inline-flex items-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          Update title
        </button>
      </div>
      <hr />
      <h4>Comments</h4>
      <Comments postId={post.id} />
    </>
  );
}
