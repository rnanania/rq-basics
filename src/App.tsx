import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Posts } from "components/posts/Posts";

const queryClient = new QueryClient();

// TODO: Add loader animation
// TODO: Add dark theme support
// TODO: Design a logo for learning
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="prose prose-sm dark:prose-invert p-4 max-w-none">
        <div className="border-b border-gray-200">
          <h2>React Query</h2>
          <p>
            React query learning with vite, typescript and tailwind ui.
          </p>
        </div>
        <Posts />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
