// Delete session via API endpoint
const sessionIdToDelete = 'CFV-VS-00002';

fetch('https://cfv-content-engine.vercel.app/api/sessions', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sessionId: sessionIdToDelete })
})
.then(r => r.json())
.then(data => {
  console.log('Delete result:', JSON.stringify(data, null, 2));
})
.catch(err => {
  console.error('Delete failed:', err.message);
});
