import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Assessment from "./components/Assessment";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  // ==========================================
  // HANDLE ASSESSMENT COMPLETION
  // ==========================================

  const handleAssessmentComplete = (results) => {
    // Save the latest assessment results
    localStorage.setItem(
      "studyRecoverResults",
      JSON.stringify(results)
    );

    // Mark assessment as completed
    localStorage.setItem(
      "studyRecoverAssessmentCompleted",
      "true"
    );

    // Go back to Dashboard
    setActivePage("dashboard");
  };

  // ==========================================
  // PAGE RENDERING
  // ==========================================

  const renderPage = () => {
    switch (activePage) {
      case "assessment":
        return (
          <Assessment
            onAssessmentComplete={handleAssessmentComplete}
          />
        );

      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  // ==========================================
  // MAIN APP
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {renderPage()}
      </main>

    </div>
  );
}

export default App;