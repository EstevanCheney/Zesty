import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { LoginScreen } from "./components/LoginScreen";
import { MainDashboard } from "./components/MainDashboard";
import { SubmitReportPage } from "./components/SubmitReportPage";
import { IncidentDetailPage } from "./components/IncidentDetailPage";
import { AllIncidentsPage } from "./components/AllIncidentsPage";
import { MessagingInbox } from "./components/MessagingInbox";
import { NewMessageDialog } from "./components/NewMessageDialog";
import { WorkSchedule } from "./components/WorkSchedule";
import { ColleagueDirectory } from "./components/ColleagueDirectory";
import { AccountSettings } from "./components/accountsetting";

interface Incident {
  id: string;
  image: string;
  location: string;
  category: "Safety" | "Cleaning" | "Repair";
  priority: "High" | "Med" | "Low";
  description: string;
  timestamp: string;
  reportedBy?: string;
  detailedDescription?: string;
  status?: string;
}

type View = "dashboard" | "submitReport" | "incidentDetail" | "allIncidents" | "workSchedule" | "colleagueDirectory" | "accountSettings";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {};

  const handleReportNewIssue = () => {
    setCurrentView("submitReport");
  };

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setCurrentView("incidentDetail");
  };

  const handleViewAllIncidents = () => {
    setCurrentView("allIncidents");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedIncident(null);
  };

  const handleMessagesClick = () => {
    setShowMessaging(true);
  };

  const handleCloseMessaging = () => {
    setShowMessaging(false);
  };

  const handleNewMessage = () => {
    setShowMessaging(false);
    setShowNewMessage(true);
  };

  const handleCloseNewMessage = () => {
    setShowNewMessage(false);
  };

  const handleWorkScheduleClick = () => {
    setCurrentView("workSchedule");
  };

  const handleColleagueDirectoryClick = () => {
    setCurrentView("colleagueDirectory");
  };

  const handleAccountSettingsClick = () => {
    setCurrentView("accountSettings");
  };

  if (!session) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderMessaging = () => (
    <>
      {showMessaging && (
        <MessagingInbox
          onClose={handleCloseMessaging}
          onNewMessage={handleNewMessage}
        />
      )}
      {showNewMessage && (
        <NewMessageDialog onClose={handleCloseNewMessage} />
      )}
    </>
  );

  if (currentView === "workSchedule") {
    return (
      <>
        <WorkSchedule onBack={handleBackToDashboard} />
        {renderMessaging()}
      </>
    );
  }

  if (currentView === "colleagueDirectory") {
    return (
      <>
        <ColleagueDirectory onBack={handleBackToDashboard} />
        {renderMessaging()}
      </>
    );
  }

  if (currentView === "accountSettings") {
    return (
      <>
        <AccountSettings onBack={handleBackToDashboard} />
        {renderMessaging()}
      </>
    );
  }

  if (currentView === "submitReport") {
    return (
      <>
        <SubmitReportPage onBack={handleBackToDashboard} onMessagesClick={handleMessagesClick} />
        {renderMessaging()}
      </>
    );
  }

  if (currentView === "incidentDetail" && selectedIncident) {
    return (
      <>
        <IncidentDetailPage incident={selectedIncident} onBack={handleBackToDashboard} onMessagesClick={handleMessagesClick} />
        {renderMessaging()}
      </>
    );
  }

  if (currentView === "allIncidents") {
    return (
      <>
        <AllIncidentsPage onBack={handleBackToDashboard} onIncidentClick={handleIncidentClick} onMessagesClick={handleMessagesClick} />
        {renderMessaging()}
      </>
    );
  }

  return (
    <>
      <MainDashboard
        onReportNewIssue={handleReportNewIssue}
        onIncidentClick={handleIncidentClick}
        onViewAllIncidents={handleViewAllIncidents}
        onMessagesClick={handleMessagesClick}
        onWorkScheduleClick={handleWorkScheduleClick}
        onColleagueDirectoryClick={handleColleagueDirectoryClick}
        onAccountSettingsClick={handleAccountSettingsClick}
      />
      {renderMessaging()}
    </>
  );
}