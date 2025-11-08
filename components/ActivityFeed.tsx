"use client";

import React, { useEffect, useState } from "react";

interface Activity {
  id: string;
  timestamp: string;
  activity: "FAVORITED" | "WATCH_LATER";
  title: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch("/api/activities");
        if (!res.ok) throw new Error("Failed to load activities");
        const data = await res.json();
        setActivities(data.activities);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  if (loading) return <p className="text-gray-400">Loading recent activity...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (activities.length === 0)
    return <p className="text-gray-400 text-sm">No recent activity yet.</p>;

  // Convert UTC → Local Time
  const formatToLocalTime = (utcString: string) => {
    const date = new Date(utcString);
    const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(localTime);
  };

  return (
    <div className="space-y-3 border-t border-black/30 pt-3">
      <h2 className="text-lg font-semibold mb-2 text-[#1ED5AF]">
        Recent Activity
      </h2>
      {activities.map((act) => (
        <div
          key={act.id}
          className="bg-[#0b0b4a] p-3 rounded-xl text-sm border border-[#1ED5AF]/40"
        >
          <p className="font-medium text-[#1ED5AF]">
            {act.activity === "FAVORITED" ? "❤️ Favorited" : "⏱️ Watch Later"}
          </p>
          <p className="text-white">{act.title}</p>
          <p className="text-gray-400 text-xs mt-1">
            {formatToLocalTime(act.timestamp)}
          </p>
        </div>
      ))}
    </div>
  );
}
