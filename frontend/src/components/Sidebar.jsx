function Sidebar({
  activePage,
  setActivePage,
  mobileOpen = false,
  setMobileOpen,
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      id: "assessment",
      label: "Assessment",
      icon: "✓",
    },
    {
      id: "recovery",
      label: "Recovery Plan",
      icon: "↗",
    },
    {
      id: "practice",
      label: "Practice",
      icon: "✎",
    },
    {
      id: "progress",
      label: "Progress",
      icon: "↗",
    },
  ];

  const handleSelect = (id) => {
    setActivePage(id);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 px-5 py-6 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Header & Logo */}
        <div className="px-3 mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              StudyRecover
              <span className="text-blue-400"> AI</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Learn at your own pace
            </p>
          </div>

          {/* Close button on mobile */}
          {setMobileOpen && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
              aria-label="Close menu"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5 flex-1">
          <p className="px-3 mb-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
            Your learning
          </p>

          {menuItems.map((item) => {
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "bg-slate-900 text-slate-500"
                  }`}
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom message */}
        <div className="mt-auto px-3 pt-6">
          <div className="border-t border-slate-800 pt-4">
            <p className="text-sm text-slate-400 leading-relaxed">
              Small steps add up.
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Keep learning, one topic at a time.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;