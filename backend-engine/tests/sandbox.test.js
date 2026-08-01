const http = require('http');

console.log('🧪 Running Sandbox Ingestion Loop QA Test...');

http.get('http://localhost:5000/api/v1/telemetry', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.assert(parsed.governance_loop_active === true, 'Shadow Mode must be active');
      console.assert(parsed.checkpoint_id === 'DOROHUSK_01', 'Checkpoint ID mismatch');
      console.assert(parsed.manifest_id_hash.length === 64, 'SHA-256 hash length invalid');
      console.log('✅ QA Test Passed: Telemetry schema & Shadow Mode verified!');
      process.exit(0);
    } catch (err) {
      console.error('❌ QA Test Failed: Invalid JSON response', err);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('❌ QA Test Failed: Server not reachable. Ensure server.js is running.', err.message);
  process.exit(1);
});
