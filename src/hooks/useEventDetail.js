// ═══════════════════════════════════════════════════════════════
// FILE: src/hooks/useEventDetail.js
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { getAdminEvents } from "../services/adminService";

const useEventDetail = (id) => {
  const [event,   setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);

      try {
        // ── TODO: Replace mock with real API calls ──────────────
        // const [base, itinerary, inclusions, exclusions, disclaimer, terms, reviews] =
        //   await Promise.all([
        //     fetch(`/api/events/${id}`).then(r => r.json()),
        //     fetch(`/api/events/${id}/itinerary`).then(r => r.json()),
        //     fetch(`/api/events/${id}/inclusions`).then(r => r.json()),
        //     fetch(`/api/events/${id}/exclusions`).then(r => r.json()),
        //     fetch(`/api/events/${id}/disclaimer`).then(r => r.json()),
        //     fetch(`/api/events/${id}/terms`).then(r => r.json()),
        //     fetch(`/api/events/${id}/reviews`).then(r => r.json()),
        //   ]);
        // setEvent({ ...base, itinerary, inclusions, exclusions, disclaimer, terms, reviews });
        // ── END TODO ────────────────────────────────────────────

        const allEvents = await getAdminEvents();
        const data = allEvents.find((e) => String(e.id) === String(id));
        if (!data) throw new Error("Event not found");
        setEvent(data);
      } catch (err) {
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return { event, loading, error };
};

export default useEventDetail;