"use client";

export default function ProfileError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <h2 className="text-xl font-bold">
        Something went wrong fetching your profile
      </h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-orange-500 rounded-lg text-white"
      >
        Try Again
      </button>
    </div>
  );
}
