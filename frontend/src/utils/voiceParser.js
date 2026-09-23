const CROP_ALIASES = { tomato: 'Tomato', tomatoes: 'Tomato', தக்காளி: 'Tomato', potato: 'Potato', potatoes: 'Potato', onion: 'Onion', onions: 'Onion', வெங்காயம்: 'Onion', rice: 'Rice', wheat: 'Wheat', carrot: 'Carrot', cabbage: 'Cabbage', brinjal: 'Brinjal', கத்தரிக்காய்: 'Brinjal', banana: 'Banana', mango: 'Mango', chilli: 'Chilli', cotton: 'Cotton', groundnut: 'Groundnut' };
const UNIT_ALIASES = { kg: 'kg', kilogram: 'kg', kilograms: 'kg', கிலோ: 'kg', ton: 'ton', tonne: 'ton', tons: 'ton', quintal: 'quintal' };
const AVAILABILITY = [/available\s+(today|tomorrow|day after tomorrow)/i, /(today|tomorrow|day after tomorrow)/i, /(நாளை)/i];

export function parseVoiceListing(transcript = '') {
  const normalized = transcript.toLowerCase();
  const cropKey = Object.keys(CROP_ALIASES).find(crop => normalized.includes(crop));
  const quantityMatch = normalized.match(/\b(\d+(?:\.\d+)?)\b/);
  const unitKey = Object.keys(UNIT_ALIASES).find(unit => normalized.includes(unit));
  const availabilityMatch = AVAILABILITY.map(pattern => normalized.match(pattern)).find(Boolean);
  return { crop: cropKey ? CROP_ALIASES[cropKey] : '', quantity: quantityMatch ? Number(quantityMatch[1]) : '', unit: unitKey ? UNIT_ALIASES[unitKey] : 'kg', available_from: availabilityMatch ? availabilityMatch[1] || availabilityMatch[0] : '', confidence: Boolean(cropKey && quantityMatch) ? 'high' : 'needs confirmation' };
}
