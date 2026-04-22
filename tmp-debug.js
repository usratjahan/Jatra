import { getEventsByCommunity } from './src/hooks/mockEventsDetail.js';

(async () => {
  try {
    const events = await getEventsByCommunity('Family');
    console.log('count', events.length);
    console.log('first', JSON.stringify(events[0], null, 2));
  } catch (err) {
    console.error(err);
  }
})();
