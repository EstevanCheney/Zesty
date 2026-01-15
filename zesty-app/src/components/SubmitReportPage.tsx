import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { DashboardNav } from "./DashboardNav";
import { SubmitReportForm } from "./SubmitReportForm";

interface SubmitReportPageProps {
  onBack: () => void;
  onMessagesClick: () => void;
}

export function SubmitReportPage({ onBack, onMessagesClick }: SubmitReportPageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav onMessagesClick={onMessagesClick} />
      
      <div className="p-6">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Page Header */}
        <div className="max-w-2xl mx-auto mb-6">
          <h1 className="text-slate-900 mb-2">Report New Issue</h1>
          <p className="text-slate-600">
            Submit a new maintenance or safety report for immediate review by the facilities team.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <SubmitReportForm />
        </div>
      </div>
    </div>
  );
}