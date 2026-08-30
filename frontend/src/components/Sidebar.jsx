function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
    },
    {
      id: "assessment",
      label: "Assessment",
    },
    {
      id: "recovery",
      label: "Recovery Plan",
    },
    {
      id: "practice",
      label: "Practice",
    },
    {
      id: "progress",
      label: "Progress",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6">
      <h2 className="text-2xl font-bold text-white mb-10">
        StudyRecover
        <span className="text-blue-400"> AI</span>
      </h2>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
              activePage === item.id
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;