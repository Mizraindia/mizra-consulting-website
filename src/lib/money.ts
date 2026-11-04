// Money shown on the site. Class prices are in Indian rupees.

/** A rupee amount with the rupee sign and Indian digit grouping, for example ₹1,499 or ₹1,00,000. */
export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}
