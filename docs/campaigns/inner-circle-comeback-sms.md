# WSA Inner Circle — SMS Comeback Campaign

**Primary audiences:**
1. **Booked-no-show:** Anyone with a Calendly `text_reminder_number` on file who booked but did not attend their strategy call. (High intent — these are warm leads who already said yes to a conversation.)
2. **First-blast non-responder:** Anyone who received the first SMS campaign and didn't reply or click. (Cooler — needs to be re-engaged without being annoying.)

**Compliance note — read this first.**

Your existing SMS program at `/sms-consent` is registered for **transactional messages only** (call confirmations, reminders, reschedules, support). The consent form, the sample messages, the privacy policy, and the TCR / 10DLC registration all use that scope. Sending promotional content through that same sender is a regulatory exposure that could get the number revoked or result in carrier filtering.

This campaign is structured to fit inside your existing compliance posture. The two tracks below use the same SMS infrastructure but for different scopes:

- **Track 1 (booked-no-show) is transactional.** It is a "reminder about a scheduled appointment you booked." That fits the registered scope. No opt-in change needed because Calendly already captured `text_reminder_number` with the booking.
- **Track 2 (first-blast non-responder) is borderline.** The original first SMS blast was sent somehow — if it was a marketing send, you need to verify those users gave marketing SMS consent. If they did not, do NOT send Track 2. Instead, run an email-only re-engagement and a separate opt-in campaign (e.g., "reply YES to get the Inner Circle discount by text").

If you want a true marketing SMS program for IC promotions, register a separate SMS sender (separate number, separate TCR registration with marketing use-case), collect explicit marketing opt-in, and put it behind a fresh consent form. Do not mix the two.

---

## Voice system (apply to every SMS)

Same rules as the email campaign. Pulled from `apps/web/lib/cue-prompt.ts`.

- First person as Cue (or in member letters, first person as the member).
- Short sentences. SMS forces this naturally. Good.
- No em-dashes. Period or newline.
- No bullet lists, no numbered lists, no headers. Plain speech.
- No hedging, no apologies, no "just checking in."
- One CTA per message. Short link or reply keyword. Not both.
- **160 character target, 320 character hard cap per message segment.** Anything longer costs more and gets split.
- Every message starts with the sender identity — required for compliance and for the reader to trust it.
- Every message ends with the STOP / HELP line — required for compliance.

---

## Sender identity (required on every message)

Use a consistent sender on every SMS. Examples:

- `WSA` — short, brand-forward, recognizable
- `WallStAcademy` — slightly more descriptive

Pick one. Use it on every message. The example messages below use `WSA`.

---

## Compliance footer (required on every message)

Every SMS in this campaign must end with this exact footer language (or a substantively identical version reviewed by counsel):

```
Reply STOP to end. HELP for help.
```

This is non-negotiable under TCPA and your TCR registration. Twilio will append its own STOP/HELP handling automatically, but the in-message language is still required.

---

# TRACK 1 — Booked No-Show Re-Engagement

**Audience:** Calendly bookings where `text_reminder_number` is on file AND the invitee did not join the call (detected via Calendly's `invitee.canceled` event, no-show status from your CRM, or by checking the call recording system).
**Channel scope:** Transactional. Fits inside your existing TCR registration.
**Send window:** Within 1 hour of no-show detection, then 24 hours later, then 72 hours later. Then stop.
**Goal:** Get the lead back on the calendar.

**Detection logic for "no-show":**
- Most reliable: Calendly webhook doesn't fire `invitee.canceled` (they didn't cancel) AND your call system (Close, Zoom, etc.) shows no attendance within 15 minutes of scheduled end time.
- Acceptable fallback: Calendly `invitee.created` exists, `invitee.canceled` does not, scheduled time is in the past, no-show field is true.

**Trigger:** Automated webhook from your call-attendance system → fires the appropriate message based on elapsed time since scheduled start.

---

## T1-1 — No-Show Initial (within 1 hour of missed call)

**Timing:** 30–60 minutes after scheduled call end time.
**Character target:** 280–300.

---

**Body:**

WSA: Hey [First Name], you missed our call today at [TIME]. No worries — life happens. Reply YES if you want to rebook and I'll get you on the schedule this week.

[LINK to Calendly]

Reply STOP to end. HELP for help.

---

## T1-2 — No-Show Followup (24 hours later)

**Timing:** Exactly 24 hours after T1-1 (not after original booking — after the first message, so you don't double-fire on the same day).
**Character target:** 280–320.

---

**Body:**

WSA: [First Name] — quick followup on yesterday's call. The strategy session is free, no pressure, 15 minutes. I can fit you in [DAY] at [TIME] or [TIME] ET. Reply 1 or 2.

Reply STOP to end. HELP for help.

---

## T1-3 — No-Show Final (72 hours later)

**Timing:** 72 hours after T1-2. After this, stop the SMS chain entirely.
**Character target:** 280–320.

---

**Body:**

WSA: [First Name], last text from me on this. If you still want the call, here's the link — grab any time that works: [LINK]. If not, no hard feelings. Either way, wish you well.

Reply STOP to end. HELP for help.

---

## Track 1 — Send logic

| Step | Trigger | Wait | Message | Stop conditions |
|---|---|---|---|---|
| T1-1 | Call ended, invitee did not attend | 30–60 min after scheduled end | T1-1 | Recipient replies STOP, replies YES (move to rebook flow), or books a new slot |
| T1-2 | T1-1 sent, no STOP, no rebook, no new booking | 24 hours | T1-2 | Same as above + recipient replies 1 or 2 (move to scheduling) |
| T1-3 | T1-2 sent, no STOP, no rebook | 72 hours | T1-3 | Final send. After this, do not contact via SMS again unless they book a new call. |

**Reply handling for Track 1:**

- `YES` → reply with a Calendly link in a follow-up message. Tag as `SMS_Rebooked_Yes`.
- `1` or `2` → reply with a Calendly confirmation link for the chosen slot. Tag as `SMS_Rebooked_Slot`.
- `STOP` → remove from all SMS lists. Honor immediately.
- `HELP` → auto-reply with: "WSA: Wall Street Academy transactional SMS. For support, email alex@wsacademyfx.com. Reply STOP to end."
- Anything else → forward to Alex for personal reply.

---

# TRACK 2 — First-Blast Non-Responder Re-Engagement

**Audience:** Anyone who received your first SMS campaign and did not reply or click, AND has marketing SMS consent on file.
**Channel scope:** Borderline marketing. Only send if you have explicit marketing opt-in for these recipients. If you don't, swap this track for an email-only version (see "Track 2 Email Backup" below).
**Send window:** 2 messages, 48 hours apart. Then stop.
**Goal:** Get the click on `/innercircle` or the IC application.

**Pre-flight checklist before sending Track 2:**

- [ ] Confirm every recipient on this list has explicit marketing SMS consent on file (separate from transactional).
- [ ] Confirm the sender number is registered for marketing use (separate TCR registration from the transactional one). If not, do not send.
- [ ] Confirm STOP/HELP footer is on every message.
- [ ] Confirm message frequency disclosures match your registration.

If any of those boxes fail, use the email-only backup at the bottom of this doc.

---

## T2-1 — Re-Open (Day 1)

**Timing:** Tuesday or Wednesday at 10:30 AM ET (mid-morning, when SMS reply rates are highest).
**Character target:** 290–320.

---

**Body:**

WSA: Hey [First Name] — Quillan from WSA. The Inner Circle cohort is mid-cycle. Confluence 30.0 went live this morning. A few spots opened at 25% off — $3,750 instead of $5,000. If you want in: [LINK]. Sunday at midnight.

Reply STOP to end. HELP for help.

---

## T2-2 — Peer Proof (Day 3)

**Timing:** 48 hours after T2-1, same time of day.
**Character target:** 290–320.

---

**Body:**

WSA: [First Name] — one more from me. Cornelius, an Inner Circle member, hit $10K his first week. Jonathan hit $48K in 30 days. The discount ends Sunday. 4-minute app: [LINK].

Reply STOP to end. HELP for help.

---

## Track 2 — Send logic

| Step | Trigger | Wait | Message | Stop conditions |
|---|---|---|---|---|
| T2-1 | First-blast sent, no reply, no click, marketing consent verified | Tuesday or Wednesday 10:30 AM ET | T2-1 | STOP, click (move to retargeting), or purchase |
| T2-2 | T2-1 sent, no STOP, no click | 48 hours | T2-2 | STOP, click, or purchase |

**Reply handling for Track 2:**

- `STOP` → remove from all SMS lists. Honor immediately.
- `HELP` → auto-reply with: "WSA: Wall Street Academy. For Inner Circle questions, email alex@wsacademyfx.com. Reply STOP to end."
- Any reply with a question → forward to Alex. Tag as `SMS_Hot_Lead` for priority follow-up.
- Click on the link → tag as `SMS_Clicked_IC`. Move to retargeting.

**Hard rule:** After T2-2, stop. Do not send a third promotional SMS. The list will cool. Re-engage them with email only, or wait for the next quarterly campaign.

---

## Track 2 Email Backup (if SMS isn't compliant for this segment)

If you can't send Track 2 via SMS, the same content works as a 2-touch email. Use the existing email campaign templates from `inner-circle-comeback-3variations.md`, but compress them to the SMS versions above. Subject lines for the email version:

- Email 1 subject: "Quick update from Week 4"
- Email 2 subject: "Cornelius. Jonathan. Sunday."

---

# Operational checklist before sending either track

- [ ] **Sender identity** set to `WSA` on every message (or your chosen sender).
- [ ] **STOP/HELP footer** on every message. No exceptions.
- [ ] **Compliance review** completed with counsel if this is the first marketing SMS you're sending. Even if your privacy policy says "marketing texts," that doesn't satisfy carrier registration. Verify the TCR use-case is registered for marketing.
- [ ] **Suppress list synced.** Anyone who has STOPped in the last 12 months is excluded.
- [ ] **Test send** to internal numbers first. Verify link rendering, character count, and footer presence.
- [ ] **Time zone check.** All send times are ET. If you want to optimize per-recipient local time, segment the list by timezone in Twilio before sending.
- [ ] **Reply routing configured.** `STOP`, `HELP`, `YES`, `1`, `2`, and any custom keywords route to the right flows in Twilio Studio or your SMS platform.
- [ ] **PostHog / Kit tags fire.** `SMS_NoShow_T1`, `SMS_NoShow_T2`, `SMS_NoShow_T3`, `SMS_Rebook_Yes`, `SMS_Rebook_Slot`, `SMS_IC_T1`, `SMS_IC_T2`, `SMS_Clicked_IC`, `SMS_Hot_Lead`. Add to `TAG_MAP` in `app/api/analytics/data/route.ts` if you want them in the analytics dashboard.

---

# Send schedule summary

| Track | Message | Timing | Channel | Sender | Compliance scope |
|---|---|---|---|---|---|
| T1 | T1-1 | 30–60 min after missed call | SMS | WSA | Transactional |
| T1 | T1-2 | 24 hours after T1-1 | SMS | WSA | Transactional |
| T1 | T1-3 | 72 hours after T1-2 | SMS | WSA | Transactional |
| T2 | T2-1 | Tue/Wed 10:30 AM ET | SMS | WSA | Marketing (verify registration) |
| T2 | T2-2 | 48 hours after T2-1 | SMS | WSA | Marketing (verify registration) |

---

# Performance targets (rough)

**Track 1 (no-show):**
- Delivery rate: 95%+ (US carrier filtering is low for transactional)
- Reply rate (YES or 1/2): 8–15%
- Rebook rate: 30–50% of replies
- Show-up rate for rebooked calls: 50–65%
- Net: 1.5–5% of no-shows come back to a second call

**Track 2 (non-responder):**
- Delivery rate: 90%+ (marketing filters slightly higher)
- Reply rate: 2–4%
- Click-through rate: 4–8%
- Application rate: 1–3%
- Net: 0.5–1.5% of non-responders enter the cohort at $3,750

---

# Legal footer (every message in every track)

Every SMS in this campaign ends with:

```
Reply STOP to end. HELP for help.
```

For the email backup, use the existing legal footer from `inner-circle-comeback-3variations.md`:

> Educational program only. Trading involves substantial risk; results vary and are not guaranteed. Past performance is not indicative of future results.

---

# What to build in code (if you want this automated)

This campaign is content-first — the copy is ready to paste into Twilio, Kit, or whatever SMS platform you're using. If you want to wire it up to the existing app, here are the integration points:

1. **No-show detection webhook** — extend `apps/web/app/api/booked/route.ts` (or add a new `/api/no-show/route.ts`) to handle a `invitee.no_show` event from Calendly or your call platform. Trigger T1-1 from this.
2. **SMS send helper** — add `apps/web/lib/sms.ts` with `sendSms({ to, body, sender })` wrapping Twilio's API. Mirror the pattern of `lib/email.ts` and `lib/kit.ts`.
3. **Reply webhook** — add `/api/sms/inbound/route.ts` to handle STOP, HELP, YES, 1, 2, and forward everything else to Alex via Discord or email.
4. **Suppression list** — store STOPped numbers in Convex (new table `smsSuppression` keyed by phone) and check before every send.
5. **Kit tag sync** — fire `SMS_NoShow_*`, `SMS_Rebook_*`, `SMS_IC_*`, `SMS_Clicked_IC`, `SMS_Hot_Lead` from the SMS handler into Kit so the rest of the funnel knows what happened.

All of these can be built incrementally. The copy and the send logic can be operated manually from Twilio's UI for the first run while the integration is being built.
