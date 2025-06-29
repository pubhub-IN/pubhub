import { useState, useEffect } from "react";
import {
  UserCheck,
  UserPlus,
  Clock,
  UserX,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { authService } from "../lib/auth-jwt";

interface Connection {
  id: string;
  created_at: string;
  connected_user: {
    id: string;
    github_username: string;
    name: string;
    avatar_url: string;
    profession: string;
  };
}

interface ConnectionRequest {
  id: string;
  status: string;
  message: string;
  created_at: string;
  requester: {
    id: string;
    github_username: string;
    name: string;
    avatar_url: string;
  };
  recipient: {
    id: string;
    github_username: string;
    name: string;
    avatar_url: string;
  };
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"connections" | "requests">(
    "connections"
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadConnections(), loadRequests()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const response = await authService.fetchWithAuth("/api/connections");
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections || []);
      }
    } catch (error) {
      console.error("Error loading connections:", error);
    }
  };

  const loadRequests = async () => {
    try {
      const response = await authService.fetchWithAuth(
        "/api/connections/requests"
      );
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      const response = await authService.fetchWithAuth(
        `/api/connections/accept/${requestId}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        await loadData();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request");
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      const response = await authService.fetchWithAuth(
        `/api/connections/reject/${requestId}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        await loadData();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
    }
  };

  const removeConnection = async (connectionId: string) => {
    if (!confirm("Are you sure you want to remove this connection?")) {
      return;
    }

    try {
      const response = await authService.fetchWithAuth(
        `/api/connections/${connectionId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await loadConnections();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to remove connection");
      }
    } catch (error) {
      console.error("Error removing connection:", error);
      alert("Failed to remove connection");
    }
  };

  const pendingRequests = requests.filter((req) => req.status === "pending");
  const sentRequests = requests.filter(
    (req) => req.status === "pending" && req.requester
  );
  const receivedRequests = requests.filter(
    (req) => req.status === "pending" && req.recipient
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">My Network</h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("connections")}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "connections"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Connections ({connections.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "requests"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Requests ({pendingRequests.length})
          </div>
        </button>
      </div>

      {/* Connections Tab */}
      {activeTab === "connections" && (
        <div>
          {connections.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No connections yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start connecting with other developers to build your network!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={connection.connected_user.avatar_url}
                        alt={connection.connected_user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {connection.connected_user.name ||
                            connection.connected_user.github_username}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          @{connection.connected_user.github_username}
                        </p>
                        {connection.connected_user.profession && (
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {connection.connected_user.profession}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          Connected{" "}
                          {new Date(connection.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/profile/${connection.connected_user.github_username}`}
                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Profile
                      </a>
                      <button
                        onClick={() => removeConnection(connection.id)}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      >
                        <UserX className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <div>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No pending requests
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have any pending connection requests.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Received Requests */}
              {receivedRequests.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Received Requests
                  </h3>
                  <div className="grid gap-4">
                    {receivedRequests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={request.requester.avatar_url}
                              alt={request.requester.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <h4 className="font-semibold">
                                {request.requester.name ||
                                  request.requester.github_username}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                @{request.requester.github_username}
                              </p>
                              {request.message && (
                                <p className="text-sm text-gray-500 mt-1">
                                  "{request.message}"
                                </p>
                              )}
                              <p className="text-xs text-gray-400">
                                {new Date(
                                  request.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => acceptRequest(request.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              <UserCheck className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => rejectRequest(request.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              <UserX className="w-4 h-4" />
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sent Requests */}
              {sentRequests.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sent Requests</h3>
                  <div className="grid gap-4">
                    {sentRequests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={request.recipient.avatar_url}
                              alt={request.recipient.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <h4 className="font-semibold">
                                {request.recipient.name ||
                                  request.recipient.github_username}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                @{request.recipient.github_username}
                              </p>
                              {request.message && (
                                <p className="text-sm text-gray-500 mt-1">
                                  "{request.message}"
                                </p>
                              )}
                              <p className="text-xs text-gray-400">
                                Sent{" "}
                                {new Date(
                                  request.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-blue-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Pending</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
