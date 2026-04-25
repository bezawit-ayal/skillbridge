import axios from 'axios';

const OFFLINE_KEY = 'pending_sos_alerts';

export const saveAlertOffline = (alertData) => {
  const existing = JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
  existing.push({ ...alertData, timestamp: Date.now() });
  localStorage.setItem(OFFLINE_KEY, JSON.stringify(existing));
};

export const syncOfflineAlerts = async () => {
  if (!navigator.onLine) return;

  const existing = JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
  if (existing.length === 0) return;

  console.log(`Syncing ${existing.length} offline alerts...`);

  for (const alert of existing) {
    try {
      await axios.post('http://localhost:5000/api/sos/trigger', alert, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
    } catch (err) {
      console.error('Failed to sync an alert', err);
      return; // Stop if one fails
    }
  }

  localStorage.removeItem(OFFLINE_KEY);
  console.log('All offline alerts synced successfully.');
};

// Listen for connection restoration
window.addEventListener('online', syncOfflineAlerts);
