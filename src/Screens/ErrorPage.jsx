import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-6xl font-bold text-[#1169bf] mb-4">Oops!</h1>
        <p className="text-xl text-gray-600 mb-6">Sorry, an unexpected error has occurred.</p>
        <div className="bg-red-50 p-4 rounded-lg mb-8 text-left">
          <p className="text-red-600 font-mono text-sm break-words">
            {error.statusText || error.message}
          </p>
        </div>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-[#1169bf] text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
