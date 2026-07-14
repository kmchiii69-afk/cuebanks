import dns from 'dns';

// Common disposable/throwaway email providers — blocked outright since
// they're the #1 way people fake an email on a lead-gen form.
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
  'temp-mail.org', 'throwawaymail.com', 'yopmail.com', 'trashmail.com',
  'getnada.com', 'dispostable.com', 'fakeinbox.com', 'sharklasers.com',
  'maildrop.cc', 'moakt.com', 'mintemail.com', 'mailnesia.com', 'mohmal.com',
  'emailondeck.com', 'discard.email', 'spamgourmet.com', 'mailcatch.com',
  '33mail.com', 'inboxbear.com', 'tempinbox.com', 'burnermail.io',
  'guerrillamailblock.com', 'mailsac.com', 'mail-temporaire.fr', 'spam4.me',
  'grr.la', 'trbvm.com', 'byom.de', 'kuku.lu', 'mytemp.email',
]);

export function isDisposableEmailDomain(domain: string): boolean {
  return DISPOSABLE_DOMAINS.has(domain.toLowerCase());
}

/** True if the domain has a mail server willing to accept mail (MX, falling
 * back to A/AAAA since some small domains route mail through their bare
 * host). Catches typos and made-up domains that can't actually receive email. */
export async function domainHasMailServer(domain: string): Promise<boolean> {
  try {
    const records = await dns.promises.resolveMx(domain);
    if (records && records.length > 0) return true;
  } catch {
    // fall through to A/AAAA check below
  }
  try {
    const a = await dns.promises.resolve4(domain);
    if (a.length > 0) return true;
  } catch {
    // ignore
  }
  try {
    const aaaa = await dns.promises.resolve6(domain);
    return aaaa.length > 0;
  } catch {
    return false;
  }
}
