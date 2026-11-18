import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-7xl font-extrabold text-[#FF6B00]">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-[#041E42] dark:text-white">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
        Sorry, the page or tuition listing you are looking for does not exist or
        has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-[#FF6B00] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e05e00]"
      >
        Back to Home
      </Link>
    </div>
  );
}