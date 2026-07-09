/**
 * Formats work experience years into a reader-friendly string.
 * If experience is less than a year, it displays in months (e.g. 0.18 years -> 2 months).
 * Otherwise, it displays in years.
 *
 * @param {number|string} years - The experience in years.
 * @returns {string} The formatted experience string.
 */
export function formatExperience(years) {
  if (years === undefined || years === null || years === 0 || years === "0") {
    return "0 years";
  }
  const numericYears = Number(years);
  if (isNaN(numericYears) || numericYears <= 0) {
    return "0 years";
  }
  if (numericYears < 1) {
    let months = Math.round(numericYears * 12);
    if (months === 0 && numericYears > 0) {
      months = 1;
    }
    if (months === 12) {
      return "1 year";
    }
    return `${months} ${months === 1 ? "month" : "months"}`;
  }
  const formattedYears = numericYears % 1 === 0 ? numericYears : Number(numericYears.toFixed(1));
  return `${formattedYears} ${formattedYears === 1 ? "year" : "years"}`;
}
