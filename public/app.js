// This file will be bundled - import from npm packages
import SessionReplay, { LDRecord } from '@launchdarkly/session-replay';

// LaunchDarkly configuration
const CLIENT_SIDE_ID = 'CLIENT_SIDE_ID_HEREEEE'; // Replace with your client-side ID

// Create context
const context = {
  kind: 'user',
  key: 'test-user-' + Date.now(),
  name: 'Test User',
  email: 'test@example.com'
};

// Initialize LaunchDarkly SDK with Session Replay plugin
const client = LDClient.initialize(CLIENT_SIDE_ID, context, {
  plugins: [
    new SessionReplay({
      // Privacy settings - choose one:
      // 'strict' - obfuscate all text and images (default, safest)
      // 'default' - obfuscate inputs and PII patterns
      // 'none' - don't obfuscate anything
      privacySetting: 'default',
      
      // Canvas recording options
      enableCanvasRecording: true,
      samplingStrategy: {
        canvas: 2, // snapshot at 2 fps
        canvasMaxSnapshotDimension: 480,
      },
      
      // Optional: inline assets if needed
      // inlineStylesheet: false,
      // inlineImages: false,
      // inlineVideos: false,
    })
  ]
});

// Handle SDK initialization
client.on('initialized', function() {
  console.log('LaunchDarkly SDK successfully initialized!');
  updateStatus('SDK initialized successfully! Session recording is active.', 'success');
  
  // Log initial session info
  console.log('Context:', context);
  console.log('Recording state:', LDRecord.getRecordingState());
});

client.on('failed', function() {
  console.error('LaunchDarkly SDK initialization failed');
  updateStatus('SDK initialization failed. Check console for errors.', 'error');
});

client.on('ready', function() {
  console.log('SDK is ready');
});

// Helper function to update status
function updateStatus(message, type = 'info') {
  const statusDiv = document.getElementById('sdkStatus');
  statusDiv.textContent = message;
  statusDiv.className = 'status';
  
  if (type === 'success') {
    statusDiv.style.backgroundColor = '#e8f5e9';
    statusDiv.style.borderColor = '#4CAF50';
  } else if (type === 'error') {
    statusDiv.style.backgroundColor = '#ffebee';
    statusDiv.style.borderColor = '#f44336';
  }
}

// Test click event
function testClick() {
  console.log('Button clicked at:', new Date().toISOString());
  alert('Click event recorded!');
}

// Add custom session property
function addCustomProperty() {
  const timestamp = Date.now();
  LDRecord.addSessionProperties({
    testProperty: 'custom-value-' + timestamp,
    buttonClickTime: timestamp,
    userAction: 'added_property'
  });
  console.log('Custom session properties added');
  alert('Custom properties added to session!');
}

// Get session information
async function getSessionInfo() {
  try {
    const recordingState = LDRecord.getRecordingState();
    console.log('Recording state:', recordingState);
    
    const session = await LDRecord.getSession();
    console.log('Session details:', session);
    
    const infoDiv = document.getElementById('sessionInfo');
    infoDiv.innerHTML = `
      <strong>Recording State:</strong> ${recordingState}<br><br>
      <strong>Session URL:</strong><br>
      <a href="${session.url}" target="_blank">${session.url}</a><br><br>
      <strong>URL with Timestamp:</strong><br>
      <a href="${session.urlWithTimestamp}" target="_blank">${session.urlWithTimestamp}</a>
    `;
  } catch (error) {
    console.error('Error getting session info:', error);
    document.getElementById('sessionInfo').textContent = 'Error: ' + error.message;
  }
}

// Draw on canvas
function drawOnCanvas() {
  const canvas = document.getElementById('testCanvas');
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw a random shape
  const x = Math.random() * 250;
  const y = Math.random() * 100;
  const radius = 20 + Math.random() * 30;
  
  ctx.fillStyle = '#' + Math.floor(Math.random()*16777215).toString(16);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  
  // Draw some text
  ctx.fillStyle = '#333';
  ctx.font = '16px Arial';
  ctx.fillText('Canvas Test ' + Date.now(), 10, canvas.height - 10);
  
  console.log('Canvas drawn');
}

// Log page interactions
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded');
  
  // Draw initial canvas content
  drawOnCanvas();
});

// Add input listeners for debugging
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', (e) => {
    console.log('Input event on:', e.target.id || e.target.className);
  });
});
