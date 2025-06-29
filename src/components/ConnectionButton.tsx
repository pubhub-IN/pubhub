import { useState, useEffect } from "react";
import { UserPlus, UserCheck, UserX, Clock, MessageCircle } from "lucide-react";
import { authService } from "../lib/auth-jwt";

interface ConnectionButtonProps {
  username: string;
  className?: string;
}

interface ConnectionStatus {
  status:
    | "self"
    | "connected"
    | "request_sent"
    | "request_received"
    | "not_connected";
  requestStatus?: string;
  message: string;
}

export default function ConnectionButton({
  username,
  className = "",
}: ConnectionButtonProps) {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkConnectionStatus();
  }, [username]);

  const checkConnectionStatus = async () => {
    try {
      setLoading(true);
      const response = await authService.fetchWithAuth(
        `/api/connections/status/${username}`
      );
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error("Error checking connection status:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (message?: string) => {
    try {
      setActionLoading(true);
      const response = await authService.fetchWithAuth(
        "/api/connections/request",
        {
          method: "POST",
          body: JSON.stringify({
            recipient_username: username,
            message: message || null,
          }),
        }
      );

      if (response.ok) {
        await checkConnectionStatus();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send connection request");
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert("Failed to send connection request");
    } finally {
      setActionLoading(false);
      setShowMessageModal(false);
      setMessage("");
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      setActionLoading(true);
      const response = await authService.fetchWithAuth(
        `/api/connections/accept/${requestId}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        await checkConnectionStatus();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request");
    } finally {
      setActionLoading(false);
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      setActionLoading(true);
      const response = await authService.fetchWithAuth(
        `/api/connections/reject/${requestId}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        await checkConnectionStatus();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-300 text-gray-600 font-medium ${className}`}
      >
        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
        Loading...
      </button>
    );
  }

  if (!status) {
    return null;
  }

  // Don't show button for own profile
  if (status.status === "self") {
    return null;
  }

  // Connected state
  if (status.status === "connected") {
    return (
      <button
        disabled
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium ${className}`}
      >
        <UserCheck className="w-4 h-4" />
        Connected
      </button>
    );
  }

  // Request sent state
  if (status.status === "request_sent") {
    return (
      <button
        disabled
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium ${className}`}
      >
        <Clock className="w-4 h-4" />
        {status.requestStatus === "pending"
          ? "Request Sent"
          : "Request " + status.requestStatus}
      </button>
    );
  }

  // Request received state
  if (status.status === "request_received") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => acceptRequest("request-id")} // You'll need to get the actual request ID
          disabled={actionLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition ${className}`}
        >
          <UserCheck className="w-4 h-4" />
          Accept
        </button>
        <button
          onClick={() => rejectRequest("request-id")} // You'll need to get the actual request ID
          disabled={actionLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition ${className}`}
        >
          <UserX className="w-4 h-4" />
          Decline
        </button>
      </div>
    );
  }

  // Not connected state
  return (
    <>
      <button
        onClick={() => setShowMessageModal(true)}
        disabled={actionLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition ${className}`}
      >
        <UserPlus className="w-4 h-4" />
        Connect
      </button>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">
              Send Connection Request
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message (optional)"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 resize-none h-24 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessage("");
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => sendConnectionRequest(message)}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <MessageCircle className="w-4 h-4" />
                )}
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
