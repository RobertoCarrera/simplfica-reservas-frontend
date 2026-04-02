/**
 * Validates that a payment URL points to a trusted provider.
 * Prevents open-redirect attacks by only allowing known payment domains.
 */
const TRUSTED_PAYMENT_DOMAINS = [
  'checkout.stripe.com',
  'www.paypal.com',
  'paypal.com',
  'pay.stripe.com',
];

export function isTrustedPaymentUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      TRUSTED_PAYMENT_DOMAINS.some(
        (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`),
      )
    );
  } catch {
    return false;
  }
}
