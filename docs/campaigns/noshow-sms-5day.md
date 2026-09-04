# WSA — No-Show SMS Re-Engagement (5-Day)

**Audience:** Leads in Close CRM who booked a strategy call and did not attend.
**Channel:** SMS — through Close's native SMS actions, OR through Twilio piped into Close via Zapier/Make (the copy works in either).
**Goal:** Get them back on the calendar.
**Send window:** Day 1 → Day 5, spaced to avoid harassment while staying top-of-mind.
**Offer:** None on this sequence. The asset is the free strategy call, not the program. Don't discount the program to no-shows — they haven't earned the trust yet. Get them on the call first. The program pitch happens on the call.

---

## How to build the list in Close (no API needed)

You can run this whole campaign from the Close UI without writing any code or using the API. Here's the segment:

**Close Smart View filter — "No-Show Re-Engage":**

- Lead Status `is` `Demo Booked`
- AND Date Created (or Date Updated) `<=` [today - 1 day]
- AND No Call Activity in the last `[today - scheduled call time]`

If your team is already setting a no-show flag, use that instead:

- Custom Field `call_outcome` `is` `No Show`
- OR Lead Status `is` `No Show`
- OR a Call Activity with `outcome` `is` `No Show`

**Manual list export workflow:**

1. In Close, go to the Smart View above.
2. Select all leads.
3. Export to CSV with columns: `lead_id`, `contact_name`, `phone`, `email`, `date_created`, `call_scheduled_time`.
4. Paste phone numbers into Twilio (or into Close's Bulk SMS action).
5. Tag every lead in this export with `sms_noshow_seq_5d` so you can track who's in the sequence.

**If you want the sequence triggered automatically:**

- In Close, create a Smart View for the no-show segment.
- Create a Sequence with these 5 SMS steps, scheduled per the table below.
- Smart View becomes the source list for the Sequence.

---

## Voice system (apply to every SMS)

Same rules as the email campaigns. Pulled from `apps/web/lib/cue-prompt.ts`.

- First person as Cue (Alex's signature is also fine for these — see below).
- Short sentences. SMS forces this naturally.
- No em-dashes. Period or newline.
- No bullet lists, no numbered lists, no headers. Plain speech.
- No hedging, no apologies, no "just checking in."
- One CTA per message. Short link or reply keyword. Not both.
- **160 character target, 320 character hard cap per segment.**
- Every message starts with the sender identity.
- Every message ends with the STOP / HELP line.

**Signature choice:** These messages can go out as either `WSA`, `Quillan`, or `Alex`. Recommendation:

- **Day 1, Day 3, Day 5:** Send as `WSA` (brand sender). Warmer opener, sets the tone.
- **Day 2, Day 4:** Send as `Alex` (CSM sender). Personal touch after the brand opener.

This rotation signals "we are a real team and Alex is the human who'll work with you" without making every message feel scripted.

---

## Compliance footer (required on every message)

```
Reply STOP to end. HELP for help.
```

Non-negotiable under TCPA and your existing TCR/10DLC registration. Every message in this sequence ends with this exact line.

---

## Sender identity (required on every message)

- Brand: `WSA`
- Personal: `Alex`

Twilio and Close both support custom sender IDs. Use them consistently.

---

# THE 5-DAY SEQUENCE

---

## Day 1 (Send at 11:00 AM ET, day after no-show)

**Sender:** WSA
**Character target:** 290–310

---

**Body:**

WSA: Hey [First Name] — Alex here. We missed you on the strategy call yesterday at [TIME]. No judgment, life happens. I have 2 slots open this week if you want to lock one in: wallstreetacademyfx.com/rebook Reply YES if you want me to send you options.

Reply STOP to end. HELP for help.

---

**Why this works:**
- Opens with the human (Alex), not the brand, on the first re-engagement.
- No accusation, no "you missed your call" framing. Just "we missed you."
- Low-friction CTA: a short link + a one-word reply.
- Two response paths so the lead can choose how to engage.

---

## Day 2 (Send at 4:00 PM ET, one day after Day 1)

**Sender:** Alex
**Character target:** 290–310

---

**Body:**

Alex / WSA: [First Name] — one more from me. The strategy session is 15 min, no slides, just your chart and your goals. I'll tell you straight if the program is a fit for you or not. Two slots left this week: wallstreetacademyfx.com/rebook

Reply STOP to end. HELP for help.

---

**Why this works:**
- Address the unspoken objection: "will this be a sales pitch?" Pre-frame: no slides, just charts and goals.
- "I'll tell you straight if it's a fit or not." Cue's voice. Reduces the pressure of "is this going to be a close."
- Same link. Repetition is fine in SMS at this frequency.

---

## Day 3 (Send at 10:30 AM ET, two days after Day 1)

**Sender:** WSA
**Character target:** 290–310

---

**Body:**

WSA: Hey [First Name] — quick one. I just looked at your application and there's a setup question I want to walk you through on a call. 15 min, free, no pitch. Want me to grab you a slot this week? Reply YES.

Reply STOP to end. HELP for help.

---

**Why this works:**
- Switches the angle. Not "I want to sell you" — "I want to answer something on your application."
- Specific reason for the call. Reduces the "is this going to be a sales pitch" objection.
- "Reply YES" is one tap. Highest-converting CTA format in SMS.

---

## Day 4 (Send at 2:00 PM ET, three days after Day 1)

**Sender:** Alex
**Character target:** 290–320

---

**Body:**

Alex / WSA: [First Name] — last text from me. If the timing is wrong, no hard feelings. If you still want the call, here's the link one more time: wallstreetacademyfx.com/rebook Pick any 15-min window. Either way, take care.

Reply STOP to end. HELP for help.

---

**Why this works:**
- "Last text from me" sets the expectation. Respects the lead's attention.
- Polite exit. No guilt. No pressure.
- If they rebook, great. If they don't, you've left the door open for them to come back on their own.

---

## Day 5 (Send at 9:00 AM ET, four days after Day 1)

**Sender:** WSA
**Character target:** 290–320

---

**Body:**

WSA: [First Name] — final note from us. The cohort starts Phase 1 next Monday and spots are filling. If you want to talk before then, the call is yours: wallstreetacademyfx.com/rebook If I don't hear from you, I'll assume the timing's off and won't reach out again. — Quillan

Reply STOP to end. HELP for help.

---

**Why this works:**
- Signed by Cue personally. The brand reaches its highest-credibility sender for the close.
- "I don't hear from you, I'll assume the timing's off" is a clean, dignified exit. No "ACT NOW" panic.
- Phase 1 urgency is real and tied to the existing cohort calendar. Not manufactured.
- After this message, the lead exits the sequence. Do not send a 6th SMS.

---

## Send schedule summary

| Day | Step | Time (ET) | Sender | Character target |
|---|---|---|---|---|
| 1 | Day 1 | 11:00 AM | WSA | 290–310 |
| 2 | Day 2 | 4:00 PM | Alex | 290–310 |
| 3 | Day 3 | 10:30 AM | WSA | 290–310 |
| 4 | Day 4 | 2:00 PM | Alex | 290–320 |
| 5 | Day 5 | 9:00 AM | WSA | 290–320 |

Total sends per lead: 5. Spans 5 days. No 6th message.

---

## Reply routing

Configure these keywords in Close's SMS inbox or Twilio Studio:

| Reply | Action |
|---|---|
| `STOP` | Remove from all SMS lists. Honor immediately. Tag lead `sms_opted_out`. |
| `HELP` | Auto-reply: "WSA: For Inner Circle questions, email alex@wsacademyfx.com. Reply STOP to end." |
| `YES` | Move lead to rebook flow. Send the Calendly link in a one-off follow-up. Tag `sms_noshow_rebooked`. |
| `1`, `2`, `3` | If you offer specific slots, route to the matching booking confirmation. Tag `sms_noshow_slot_picked`. |
| Any other reply | Forward to Alex via Close inbox notification. Tag `sms_hot_lead`. |

---

## Stop conditions (per lead)

Remove a lead from the sequence and stop sending if any of these happen:

- Lead replies `STOP`.
- Lead books a new call (Calendly webhook fires `invitee.created` → tag `sms_noshow_rebooked`).
- Lead purchases (any Close status change to a won stage).
- Lead replies with anything else AND you manually pull them out (e.g., they ask to be left alone, or they're now in a different campaign).

**Mechanics for stop conditions in Close:**

- Set up a Smart View rule that auto-removes leads from Sequences when their status changes to a "won" stage.
- Set up a Close Workflow that triggers when a Calendly booking is detected — pauses the SMS Sequence and tags the lead.

---

## Personalization tokens

Both Close and Twilio support merge tags. Use these per lead:

- `[First Name]` — first name only. No full names. Looks weird in SMS.
- `[TIME]` — original scheduled call time. Format as "10:30 AM ET" or "yesterday at 2:00 PM" depending on which is more contextual.
- `[LINK]` — your rebook link. If using Close, this can be a tracked link.

---

## A/B variants for Day 1 (test two openers)

If your no-show list is large enough (50+), split-test Day 1 into two variants and send each to half the segment. Track which converts more replies.

**Variant A (this doc):** "We missed you on the strategy call yesterday."

**Variant B:**

**Body:**

WSA: Hey [First Name] — Alex here. Wanted to circle back on the strategy call. I have 2 slots this week if you want to lock one in: wallstreetacademyfx.com/rebook Reply YES and I'll send the times.

Reply STOP to end. HELP for help.

---

Variant B is softer. Drops the "we missed you" framing entirely. Test which pulls more replies — usually the more specific opener (Variant A) wins on no-shows because it acknowledges reality.

---

## Performance targets (rough)

For a warm no-show segment with valid phone numbers:

- Delivery rate: 95%+ (US carriers, transactional sender)
- Reply rate (YES, 1/2/3, or any custom): 6–12%
- Rebook rate (of replies): 30–45%
- Show-up rate for rebooked calls: 50–65%
- Net: 1.5–4% of no-shows book and show for a second call

Track per-variant if you A/B test. Iterate on Day 1's opener based on what wins. Day 5 is a hard cap — never extend the sequence past 5 messages for no-shows.

---

## Compliance checklist before sending

- [ ] Every recipient on this list has a phone number in Close (export the Smart View first; remove rows with empty phone).
- [ ] Every recipient either (a) opted into SMS via the WSA `/sms-consent` form, OR (b) provided their phone number as the `text_reminder_number` on a Calendly booking. **Do not send to anyone outside those two paths.** This is a transactional re-engagement of an existing appointment — it's defensible under your existing TCR registration.
- [ ] STOP/HELP footer on every message.
- [ ] Sender identity (`WSA` or `Alex`) consistent across all 5 messages.
- [ ] Suppression list synced — anyone who STOPped in the last 12 months is excluded.
- [ ] Test send to 2–3 internal numbers first.
- [ ] Time zone check — all times listed are ET. If you want to optimize per-recipient local time, segment the list by timezone before sending.

---

## What to do with replies

**If YES, 1, 2, or 3** — send the Calendly link in a follow-up message. Keep it short:

```
WSA: Great — here you go: wallstreetacademyfx.com/rebook Pick any 15-min window that works. See you then.
```

Then remove the lead from the sequence.

**If they ask a question** — forward to Alex. Don't try to handle the question in SMS. Alex has the context, the rapport, and the relationship.

**If they push back or say "not interested"** — send one final message:

```
Alex / WSA: All good, [First Name]. Door's always open if you want to revisit. — Alex
```

Then remove from the sequence. Do not argue. Do not persuade.

**If they ask to be removed entirely** — STOP works immediately. Tag `sms_opted_out`. Confirm via the auto-reply.

---

## After the sequence: long-tail re-engagement

If a lead doesn't reply or rebook after the 5-day sequence:

- **Day 14:** Add them to the email-only "IC Comeback" campaign (the one in `inner-circle-comeback-3variations.md`). The email version works for this audience too.
- **Day 30:** Add them to the next quarterly broadcast. Subject: "The cohort is graduating. Final check-in."
- **Day 90:** Move to a long-tail nurture list. No more SMS. Email only.

Do NOT loop them back into another 5-day SMS sequence. They've already had their window. Continuing to text is how you get flagged for spam.
