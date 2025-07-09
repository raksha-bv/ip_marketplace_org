/**
 * Utility functions for formatting data in the IP Marketplace frontend
 */

/**
 * Format ICP values from e8s (10^-8 ICP units) to human-readable format
 * @param {number|bigint|null|undefined} e8s - Value in e8s units
 * @returns {string} Formatted ICP value
 */
export const formatICP = (e8s) => {
  // Handle BigInt conversion and null/undefined values
  if (e8s === undefined || e8s === null) {
    return "0.00";
  }
  const value = typeof e8s === "bigint" ? Number(e8s) : e8s;
  if (isNaN(value) || value === null || value === undefined) {
    return "0.00";
  }
  return (value / 1e8).toFixed(2);
};

/**
 * Format large numbers with K/M suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) {
    return "0";
  }

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

/**
 * Format timestamp to human-readable date
 * @param {number|bigint} timestamp - Timestamp in nanoseconds
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  return new Date(Number(timestamp) / 1_000_000).toLocaleString();
};

/**
 * Format timestamp to human-readable date (date only)
 * @param {number|bigint} timestamp - Timestamp in nanoseconds
 * @returns {string} Formatted date string
 */
export const formatDateOnly = (timestamp) => {
  if (!timestamp) return "N/A";
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString();
};

/**
 * Format principal to shortened version
 * @param {string|object} principal - Principal to format
 * @returns {string} Shortened principal
 */
export const formatPrincipal = (principal) => {
  if (!principal) return "N/A";
  const principalStr = principal.toString();
  return `${principalStr.substring(0, 8)}...${principalStr.substring(
    principalStr.length - 8
  )}`;
};

/**
 * Calculate remaining time for auctions
 * @param {number|bigint} endTime - End time in nanoseconds
 * @returns {string} Formatted time remaining
 */
export const getTimeRemaining = (endTime) => {
  if (!endTime) return "N/A";

  const now = Date.now() * 1_000_000;
  const remaining = Number(endTime) - now;

  if (remaining <= 0) return "Ended";

  const days = Math.floor(remaining / (24 * 60 * 60 * 1_000_000_000));
  const hours = Math.floor(
    (remaining % (24 * 60 * 60 * 1_000_000_000)) / (60 * 60 * 1_000_000_000)
  );
  const minutes = Math.floor(
    (remaining % (60 * 60 * 1_000_000_000)) / (60 * 1_000_000_000)
  );

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * Format rarity score with fallback
 * @param {number|null|undefined} score - Rarity score
 * @returns {string} Formatted rarity score
 */
export const formatRarityScore = (score) => {
  if (score === undefined || score === null || isNaN(score)) {
    return "N/A";
  }
  return typeof score === "number" ? score.toFixed(1) : score.toString();
};

/**
 * Format percentage with fallback
 * @param {number|null|undefined} percentage - Percentage value
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (percentage) => {
  if (percentage === undefined || percentage === null || isNaN(percentage)) {
    return "N/A";
  }
  return `${percentage}%`;
};

/**
 * Safe value extractor for optional fields
 * @param {any} optionalValue - Optional value (could be [] or [value])
 * @param {any} defaultValue - Default value if optional is empty
 * @returns {any} Extracted value or default
 */
export const extractOptionalValue = (optionalValue, defaultValue = null) => {
  if (Array.isArray(optionalValue) && optionalValue.length > 0) {
    return optionalValue[0];
  }
  return defaultValue;
};
