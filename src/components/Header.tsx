

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100 py-6">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">

        {/* Left: Title & Subtitle */}
        <div className="flex flex-col z-10">
          <h1 className="text-xl font-bold text-gray-900 font-sans tracking-tight">
            All Things Liverpool
          </h1>
          <p className="text-xs text-gray-500 font-serif mt-0.5">
            You'll Never Walk Alone
          </p>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center">
            <img
              src="/lfc-fan-logo.png"
              alt="LFC Logo"
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>

        {/* Right: Empty div to balance layout if needed, or just remove */}
        <div className="z-10 w-[120px]"></div>

      </div>
    </header>
  );
};
