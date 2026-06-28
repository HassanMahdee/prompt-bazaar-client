import Link from "next/link";
import { FaGhost, FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center p-8">
        <div className="text-6xl text-base-content/50 mb-4">
          <FaGhost />
        </div>
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-base-content/70 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary">
          <FaHome className="mr-2" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
