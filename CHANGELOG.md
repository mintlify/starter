# Changelog

## [Unreleased] — 2026-11-10-1

### Added

- Add outcome-focused public changelog entries for checkout branding (October 25), the preloaded new-card form (October 28), session quote-ID validation and sandbox polling fixes (November 6), and mandate setup without shipping fields (November 9). Clarify the October 29 checkout enrollment completion entry with a headline and plain-language resource ID guidance.

### Changed

- Keep changelog updates stacked on wide screens, with the date and tags above each entry, so entries align with the page title instead of sitting in an indented column.

## [Unreleased] — 2026-10-29-2

### Changed

- Document full-enrollment completion for new cards added during checkout, including replacement-card retries, and its enrollment action resource ID. Payment outcomes and standalone enrollment identifiers remain unchanged.

## [Unreleased] — 2026-10-29-1

### Added

- Document card-saved and card-deleted webhooks, user correlation, explicit subscriptions and event version ordering.

### Changed

- Explain delayed deletion notifications and mandate-charge card identifiers, including null handling when a card cannot be determined.

## [Unreleased] — 2026-10-28-1

### Changed

- Clarify that payment webhook `card_id` is currently `null` for both regular and quote-backed mandate charges, with mandate/transaction correlation guidance in the event guide, API description and public release notes.

## [Unreleased] — 2026-10-24-1

### Added

- Add a Webhooks API reference with one page per webhook operation and response schemas.

### Changed

- Reorganize the webhook guides into shorter sections and tables.

## [Unreleased] — 2026-10-22-1

### Fixed

- Merge current main's public release notes and document the existing quote pricing-evidence error with the same code and fixed message in API responses and quote-request failure events.

## [Unreleased] — 2026-10-21-4

### Fixed

- Document restored warnings for specific receiver connection, certificate/protocol and confirmed DNS failures, while preserving ambiguous network-outage exclusions and quiet pause notices.

## [Unreleased] — 2026-10-21-3

### Fixed

- Explain confirmed-response endpoint health, bounded health-pause buffering, explicit resume periods, public blocked reasons and terminal mandate expiry without changing financial state.

## [Unreleased] — 2026-10-21-1

### Changed

- Document eight-failure endpoint auto-pause, one labelled email per outage with no reminders, explicit resume, real-delivery recovery and Events API recovery for gaps during pauses.

## [Unreleased] — 2026-10-20-2

### Fixed

- Clarify current lowercase recurring setup terms and retained historical uppercase values; lifecycle events use lowercase values.

## [Unreleased] — 2026-10-20-1

### Added

- Document mandate lifecycle subscriptions, owned mandate IDs on payment events, expiry scheduling and activation boundaries, and mdt_ event filters. Distinguish setup, local mandate control and charge outcomes without implying payment settlement or network revocation.

## [Unreleased] — 2026-10-19-7

### Fixed

- Document confirmed credential-fetch rejection coverage without changing public codes, preserve historical network-named names for compatibility, and explain fixed safe Charge a Mandate messages in immediate and deduplicated responses.

## [Unreleased] — 2026-10-19-6

### Fixed

- Clarify hosted-checkout HTTP errors versus merchant payment-result/webhook causes, and document the existing timeout code without changing either API contract.

## [Unreleased] — 2026-10-19-5

### Fixed

- Document exact shared API/webhook public codes, trusted pre-issuance capture boundaries, and compatibility until a versioned API release. Preserve cancelled-enrollment error:null and align OpenAPI result schemas with the documented contract.

## [Unreleased] — 2026-10-19-4

### Fixed

- Remove the normalized provider-workflow guidance claim belonging to the separate, unfinished Core #230 work. Keep this guide scoped to the standalone webhook release in Core #271.

## [Unreleased] — 2026-10-19-3

### Changed

- Clarify that unmapped provider-workflow codes use the safe generic fallback while normalized payment-result guidance remains available.

## [Unreleased] — 2026-10-19-2

### Fixed

- Match event-history resource filters to Core: `txn_`, `ses_` and `qreq_`, underscores allowed, maximum 120 characters; add quote-request IDs to the API guide and a contract regression.
- State explicitly that quote-request failure capture is best-effort: bursts/timeouts can skip events without retry or backfill, while saved events retain normal delivery guarantees.

## [Unreleased] — 2026-10-19-1

### Fixed

- Document issued-only payment coverage, exclusion of browser failure reports and uncertain pre-issuance outcomes, preserved enrollment cancellation category, and confirmed-only quote correlation headers with bounded capture.
- Publish safe outcome messages and payment-result compatibility guidance while preserving existing public error codes.

## [Unreleased] — 2026-10-16-2

### Fixed

- Clarify that a retried operation may create a different payment-attempt resource, while delivery retries and replays preserve the original event bytes.

## [Unreleased] — 2026-10-16-1

### Added

- Document safe error codes across payment, enrollment and mandate outcomes, quote-request failure subscriptions/examples, and explicit missing lifecycle-event coverage.

### Changed

- Explain credential-issuance failure stages, retained-event compatibility, terminal enrollment status reasons, and twelve supported event choices in OpenAPI.

## [Unreleased] — 2026-10-12-4

### Changed

- Keep webhook signature guidance language-independent; move optional Node/Python receiver setup and runtime requirements into a separate examples page.
- Separate sandbox testing guidance and opt-in automated receiver controls from the main security guide.

## [Unreleased] — 2026-10-12-3

### Changed

- Simplify webhook environment enablement guidance and link the event catalog near the start of the setup overview.

## [Unreleased] — 2026-10-12-2

### Changed

- Add API compatibility notes for `GET /v1/sessions/{sessionId}/status`: a full-enrollment session revoked at or after expiry remains `expired`; earlier cancellation stays `cancelled`. Integrators should handle both terminal states.

## [Unreleased] — 2026-10-12-1

### Fixed

- Use canonical session IDs in API/webhook examples and filters, and document actionable receiver/challenge errors and bodyless control requests.

### Changed

- Clarify HTTP acknowledgement independently of bounded response bodies, bounded replay retention grace and cancellation/expiry chronology.

## [Unreleased] — 2026-10-09-5

### Changed

- Clarify internal preparation delays, event-scoped exhaustion recovery, adaptive Dashboard refresh and durable queued notice semantics.

## [Unreleased] — 2026-10-09-4

### Added

- Document reseller-managed application subscriptions, shared receivers and independent bulk setup results.

## [Unreleased] — 2026-10-09-3

### Changed

- Clarify repeated retry result versions, replay key binding across destination changes, incident visibility and retained recovery reads during delivery shutdown.

## [Unreleased] — 2026-10-09-2

### Security

- Add optional authenticated control for a dedicated sandbox account and synthetic deliveries; ordinary receivers keep it disabled.

### Fixed

- Preserve nullable uncapped mandate budgets and document expiry after capture activation.

## [Unreleased] — 2026-10-09-1

### Added

- Document full enrollment and mandate-creation events, event filters, queued synthetic tests, circuit recovery and verified incident notices.
- Add runnable Node/Python receivers with raw-byte signature verification and durable SQLite receipt deduplication.

## [Unreleased] — 2026-10-08-1

### Added

- Gated-preview webhook setup, event catalog, signature verification, delivery/recovery guidance, and matching OpenAPI operations. Availability remains dependent on sandbox-first Core activation.
