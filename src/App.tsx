import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Posts } from "components/posts/Posts";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-4">
        <div className="border-b border-gray-200 pb-5">
          <h2 className="text-base font-bold leading-8 text-gray-900">React Query</h2>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
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
