<header
  style={{
    backgroundColor: 'rgba(0,0,0,0.20)', // 20% black
    backdropFilter: 'blur(4px)', // optional subtle blur for frosted effect
  }}
  className="fixed top-0 left-0 right-0 z-50 py-4 shadow-sm"
>
  <div className="container mx-auto px-4 flex items-center justify-between">

    {/* Logo */}
    <div
      onClick={scrollToTop}
      className="flex items-center space-x-2 cursor-pointer"
      aria-label="Kolabing"
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
        <img src="..." alt="Kolabing Logo" className="w-8 h-8" />
      </div>
      <span
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.06em',
        }}
        className="text-xl text-foreground select-none tracking-wide"
      >
        Kolabing
      </span>
    </div>

    {/* Desktop Navigation */}
    <nav
      className="hidden md:flex space-x-6"
      role="navigation"
      aria-label="Main navigation"
    >
      <button
        onClick={scrollToTop}
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.06em',
        }}
        className={cn(
          "transition-colors duration-300 text-base tracking-wide",
          isActivePage('/') ? "text-primary" : "text-foreground"
        )}
      >
        How it Works
      </button>
      {/* repeat this pattern for each nav button */}
      {/* ... */}
    </nav>

    {/* ...rest of Navbar remains unchanged, but update mobile overlay styling/classes as above */}
  </div>
  {/* ...rest of Navbar */}
</header>
