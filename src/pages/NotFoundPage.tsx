import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";

export default function NotFoundPage() {
  return (
    <main className="container py-24">
      <EmptyState
        icon="search"
        title="Page not found"
        description="The page you are looking for does not exist or has moved."
        actionLabel="Back to Home"
        actionHref="/"
      />
      <div className="mt-6 text-center">
        <Link to="/" className="text-sm text-primary hover:underline">
          Return to GAURAVANIME
        </Link>
      </div>
    </main>
  );
}
