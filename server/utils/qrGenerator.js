/**
 * QR Code Generator
 * Generates a QR code PNG (as base64 data URL or buffer)
 * encodes ticket verification URL or ticket data JSON
 */

const QRCode = require('qrcode');

/**
 * Build the data string to embed in QR code.
 * Could be a URL or a JSON payload - both work fine.
 * @param {object} ticketData
 * @returns {string}
 */
function buildQRPayload(ticketData) {
  // Embed a URL that can be used for scanning at venue
  // You can replace this with your actual domain later
  const base = `https://eventhub.app/verify`;
  const params = new URLSearchParams({
    ticket: ticketData.ticketId,
    event:  ticketData.eventId || '',
    name:   ticketData.name || '',
  });
  return `${base}?${params.toString()}`;
}

/**
 * Generate a QR code as a Base64 Data URL (PNG)
 * @param {object} ticketData - { ticketId, eventId, name, ... }
 * @returns {Promise<string>}  - data:image/png;base64,...
 */
async function generateQRCodeDataURL(ticketData) {
  const payload = buildQRPayload(ticketData);
  const dataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'H',  // High — survives partial damage
    type: 'image/png',
    margin: 1,
    color: {
      dark: '#0a1628',   // dark blue dots (matches EventHub theme)
      light: '#ffffff',
    },
    width: 256,
  });
  return dataUrl;
}

/**
 * Generate a QR code as a raw Buffer (PNG)
 * Useful for saving to disk or attaching to emails
 * @param {object} ticketData
 * @returns {Promise<Buffer>}
 */
async function generateQRCodeBuffer(ticketData) {
  const payload = buildQRPayload(ticketData);
  return QRCode.toBuffer(payload, {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 1,
    color: { dark: '#0a1628', light: '#ffffff' },
    width: 256,
  });
}

/**
 * Generate a QR code SVG string
 * @param {object} ticketData
 * @returns {Promise<string>} SVG markup
 */
async function generateQRCodeSVG(ticketData) {
  const payload = buildQRPayload(ticketData);
  return QRCode.toString(payload, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 1,
    color: { dark: '#0a1628', light: '#ffffff' },
  });
}

module.exports = { generateQRCodeDataURL, generateQRCodeBuffer, generateQRCodeSVG, buildQRPayload };
