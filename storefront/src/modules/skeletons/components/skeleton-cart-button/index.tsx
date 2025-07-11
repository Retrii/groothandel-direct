export default function SkeletonCartButton() {
  return (
    <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-sky-400 transition-colors duration-200 hover:bg-sky-50 rounded-lg">
      <div className="relative">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4"
          />
        </svg>
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-4 text-center font-medium">
          0
        </div>
      </div>
      <span className="hidden lg:inline font-medium">Winkelwagen</span>
    </button>
  )
}
