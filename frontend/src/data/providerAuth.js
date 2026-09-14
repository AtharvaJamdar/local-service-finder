// Temporary in-memory "session" for the currently signed-in provider.
// Replace with real auth/session handling once the backend exists.

let currentProvider = null;

export function setCurrentProvider(provider) {
  currentProvider = provider;
}

export function getCurrentProvider() {
  return currentProvider;
}
