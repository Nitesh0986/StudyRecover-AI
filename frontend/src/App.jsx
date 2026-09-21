import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Assessment from "./components/Assessment";
import RecoveryPlan from "./components/RecoveryPlan";
import Practice from "./components/Practice";
import Progress from "./components/Progress";

function App() {
  // ============================================
  // ASSESSMENT RESULTS
  // ============================================

  const [assessmentResults, setAssessmentResults] = useState(() => {
    const savedResults = localStorage.getItem(
      "studyRecoverResults"
    );

    if (!savedResults) {
      return [];
    }

    try {
      return JSON.parse(savedResults);
    } catch (error) {
      console.error(
        "Unable to load saved assessment results:",
        error
      );

      return [];
    }
  });

  // ============================================
  // ACTIVE PAGE
  // ============================================

  const [activePage, setActivePage] =
    useState("dashboard");

  // ============================================
  // PRACTICE TOPIC
  // ============================================

  const [practiceTopic, setPracticeTopic] =
    useState(null);

  // ============================================
  // ASSESSMENT COMPLETE
  // ============================================

  const handleAssessmentComplete = (results) => {
    setAssessmentResults(results);

    localStorage.setItem(
      "studyRecoverResults",
      JSON.stringify(results)
    );

    setActivePage("dashboard");
  };

  // ============================================
  // OPEN PRACTICE FOR TOPIC
  // ============================================

  const handlePracticeTopic = (topic) => {
    setPracticeTopic(topic);
    setActivePage("practice");
  };

  // ============================================
  // OPEN RECOVERY PLAN
  // ============================================

  const handleOpenRecovery = () => {
    setActivePage("recovery");
  };

  // ============================================
  // NAVIGATION
  // ============================================

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  // ============================================
  // RENDER CURRENT PAGE
  // ============================================

  const renderPage = () => {
    switch (activePage) {

      // ------------------------------------------
      // ASSESSMENT
      // ------------------------------------------

      case "assessment":
        return (
          <Assessment
            onAssessmentComplete={
              handleAssessmentComplete
            }
          />
        );

      // ------------------------------------------
      // RECOVERY PLAN
      // ------------------------------------------

      case "recovery":
        return (
          <RecoveryPlan
            results={assessmentResults}
            onPracticeTopic={handlePracticeTopic}
          />
        );

      // ------------------------------------------
      // PRACTICE
      // ------------------------------------------

      case "practice":
        return (
          <Practice
            topic={practiceTopic}
            onBack={() =>
              setActivePage("recovery")
            }
          />
        );

      // ------------------------------------------
      // PROGRESS
      // ------------------------------------------

      case "progress":
        return (
          <Progress
            assessmentResults={assessmentResults}
          />
        );

      // ------------------------------------------
      // DASHBOARD
      // ------------------------------------------

      case "dashboard":
      default:
        return (
          <Dashboard
            assessmentResults={assessmentResults}
            onStartAssessment={() =>
              setActivePage("assessment")
            }
            onOpenRecovery={handleOpenRecovery}
          />
        );
    }
  };

  // ============================================
  // APP UI
  // ============================================

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            StudyRecover
            <span className="text-blue-400"> AI</span>
          </h1>
          <p className="text-xs text-slate-500">Learn at your own pace</p>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
          aria-label="Toggle navigation menu"
        >
          <span className="text-lg leading-none">☰</span>
        </button>
      </header>

      {/* SIDEBAR */}
      <Sidebar
        activePage={activePage}
        setActivePage={handlePageChange}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto min-w-0">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;