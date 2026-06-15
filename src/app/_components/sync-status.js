"use client";
import { useEffect, useState } from "react";

export function SyncStatus() {
  const [syncData, setSyncData] = useState(null);

  useEffect(() => {
    function handleSync(event) {
      setSyncData(event.detail);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setSyncData(null), 5000);
      return () => clearTimeout(timer);
    }
    window.addEventListener("dm-sync-success", handleSync);
    return () => window.removeEventListener("dm-sync-success", handleSync);
  }, []);

  useEffect(() => {
    function handleSyncStart() {
      setSyncData({ pending: true });
    }
    function handleSyncError() {
      setSyncData(null);
    }
    window.addEventListener("dm-sync-start", handleSyncStart);
    window.addEventListener("dm-sync-error", handleSyncError);
    return () => {
      window.removeEventListener("dm-sync-start", handleSyncStart);
      window.removeEventListener("dm-sync-error", handleSyncError);
    };
  }, []);

  if (!syncData) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-md border border-lime-900/10 bg-white p-3 shadow-lg">
      <div className="flex items-center gap-2">
        {syncData.pending ? (
          <>
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-olive-900 border-t-transparent" />
            <p className="text-sm font-bold text-olive-950">Saving...</p>
          </>
        ) : (
          <>
            <span className="flex h-2.5 w-2.5 rounded-full bg-lime-500"></span>
            <p className="text-sm font-bold text-olive-950">Synced</p>
          </>
        )}
      </div>
      {!syncData.pending && syncData.timestamp && (
        <p className="mt-1 text-xs text-olive-700">
          {new Date(syncData.timestamp).toLocaleTimeString()} by {syncData.user}
        </p>
      )}
    </div>
  );
}
