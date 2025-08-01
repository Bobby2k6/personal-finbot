import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900">Page Not Found</h2>
        <p className="text-gray-600 max-w-md">
          This page is still being built. Continue prompting to help us fill in the content!
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
