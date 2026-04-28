// FILE: src/services/eventsService.js
// Public API for fetching events

const API_BASE = import.meta.env.VITE_API_URL;

/**
 * Get all public events from the backend
 */
export const getPublicEvents = async () => {
  try {
    const res = await fetch(`${API_BASE}/tours`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  } catch (error) {
    console.error('Error fetching public events:', error);
    return [];
  }
};

/**
 * Get events filtered by community
 */
export const getEventsByCommunity = async (community) => {
  try {
    const events = await getPublicEvents();
    return events.filter(e => e.community?.toLowerCase() === community?.toLowerCase());
  } catch (error) {
    console.error(`Error fetching events for community ${community}:`, error);
    return [];
  }
};

/**
 * Count events by community
 */
export const getCommunityCounts = async () => {
  try {
    const events = await getPublicEvents();
    const counts = {
      Family: 0,
      Male: 0,
      Female: 0,
      Combined: 0,
    };
    
    events.forEach(event => {
      if (event.community && counts.hasOwnProperty(event.community)) {
        counts[event.community]++;
      }
    });
    
    return counts;
  } catch (error) {
    console.error('Error counting events by community:', error);
    return { Family: 0, Male: 0, Female: 0, Combined: 0 };
  }
};
