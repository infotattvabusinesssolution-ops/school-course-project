import React, { useState } from "react";
import api from "../../lib/axios";
import { Mail, Send, Loader2 } from "lucide-react";

export default function AdminEmailsTab() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendTestEmails = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/email-test/send-all", { email });
      if (response.data.success) {
        alert("All test emails sent successfully. Please check your inbox!");
        setEmail("");
      }
    } catch (error) {
      console.error("Error sending test emails:", error);
      alert(error.response?.data?.message || "Failed to send test emails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-crmisa-accentNavy">Email Testing</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-start space-x-4 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-crmisa-accentNavy">Send Test Emails</h3>
            <p className="text-slate-500 text-sm">
              Use this tool to trigger all transactional and marketing email templates to a specific email address. 
              This allows you to verify the design and content of the emails before they are sent to real students.
            </p>
          </div>
        </div>

        <form onSubmit={handleSendTestEmails} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Target Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Send All Templates
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-crmisa-accentNavy mb-2">Templates that will be sent:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 list-disc list-inside">
            <li>Account Welcome Email</li>
            <li>Password Reset Request</li>
            <li>Purchase Invoice (Course)</li>
            <li>Re-Exam Payment Receipt</li>
            <li>Exam Passed & Certificate Notice</li>
            <li>Exam Failed Notice</li>
            <li>Course Review Reminder</li>
            <li>Ebook Upsell Campaign</li>
            <li>Problem/Solution Marketing Campaign</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
