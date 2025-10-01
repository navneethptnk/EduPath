// assets/ai-config.example.js
// Copy this file to assets/ai-config.js and fill in your provider details to enable external AI.
// Do NOT commit real API keys to source control.
// Transparency note: Only anonymized quiz data (answer values and aggregate counts) will be sent.

window.EDUPATH_AI_CONFIG = {
  // Example: 'https://your-ai-gateway.example.com/quiz/insights'
  endpoint: '',
  // Optional: provider label for display purposes
  provider: 'external-ai',
  // Optional: bearer token; prefer runtime injection rather than committing to repo
  apiKey: '',
  // Optional timeout (ms)
  timeout: 8000
};
