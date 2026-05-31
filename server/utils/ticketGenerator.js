/**
 * Ticket ID Generator
 * Format: [EVENT_PREFIX][YY][RANDOM_6_CHARS]
 * Example: CS25A7B6F2 (CodeSprint 2025)
 */

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars (0,O,1,I)

/**
 * Generate a random alphanumeric string of given length
 */
function randomPart(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

/**
 * Get 2-letter prefix from event name
 * e.g. "CodeSprint 2025" → "CS"
 */
function getEventPrefix(eventName) {
  if (!eventName) return 'EV';
  const words = eventName.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Generate a unique ticket ID
 * @param {string} eventName - Name of the event
 * @param {number} [year]    - Optional year (defaults to current year)
 * @returns {string}          - Ticket ID like "CS25A7B6F2"
 */
function generateTicketId(eventName, year) {
  const prefix = getEventPrefix(eventName);
  const yy = String(year || new Date().getFullYear()).slice(-2);
  const random = randomPart(6);
  return `${prefix}${yy}${random}`;
}

/**
 * Generate a batch of unique ticket IDs (no duplicates)
 * @param {string} eventName
 * @param {number} count
 * @returns {string[]}
 */
function generateBatchTicketIds(eventName, count) {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(generateTicketId(eventName));
  }
  return Array.from(ids);
}

module.exports = { generateTicketId, generateBatchTicketIds, getEventPrefix };
