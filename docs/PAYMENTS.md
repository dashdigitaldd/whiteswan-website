# Direct payments and El Salvador settlement

Discovery notes checked September 15, 2026. Direct payments are an intended platform capability. No processor has been selected, no merchant account has been opened, and no payment credentials, checkout, deposit capture or bank settlement is active.

## Candidates to evaluate with the actual merchant

| Candidate | Verified public information | Still requires confirmation |
|---|---|---|
| Promerica El Salvador | Its payment portfolio lists web integrations, payment links, Cybersource and POS Virtual. Separate POS requirements explicitly cover individuals with a Promerica checking/savings account. | Confirm online-product onboarding for an individual lodging operator, whether the existing account is eligible, actual tax-document requirements, international cards, hosted checkout, webhooks, refunds, deposits and settlement terms. |
| Wompi El Salvador | Published merchant terms cover local natural/legal persons and require an active Banco Agrícola account for activation. The platform documents API, hosted checkout/payment buttons and payment links. | Eligibility for this merchant and accommodation activity; current onboarding documents; USD bank settlement timing/fees; international cards; refunds; advance payments; security-deposit authorization/capture; reserves and disputes. |
| BAC El Salvador | BAC's Salvadoran business materials include online payment links. Regional e-commerce guidance includes merchant affiliation and website/contact/policy requirements. | The El Salvador-specific product/contract, supported settlement bank, required account ownership, hosted checkout/API, international cards, refund and deposit capabilities, current fees and payout schedule. |

Wompi cannot be assumed to settle to any Salvadoran bank: its published account requirements specifically mention Banco Agrícola. BAC availability does not establish that any bank account is acceptable. Merchant eligibility and the actual settlement account must be confirmed before implementation.

Sources: [Wompi merchant terms](https://wompi.sv/TerminosCondiciones/Comercio), [Wompi API](https://wompi.sv/NuestrosServicios/API), [BAC Salvadoran business solutions](https://www.baccredomatic.com/es-sv/empresas/soluciones-herramientas), [BAC e-commerce guidance](https://ayuda.baccredomatic.com/para_empresas_o_negocios/comercios_afiliados/e-commerce).

## Information needed for a decision

Bank name and whether the merchant is an individual or registered company are the first inputs. The processor should confirm the required local tax/business identifiers, beneficial-owner/representative verification, account-holder match, lodging acceptance, website policy requirements and the settlement contract. Identity documents and bank details go through the processor's secure onboarding channel, not GitHub or the public enquiry form.

Ask each provider for a written capability matrix and sandbox access. Compare total transaction/foreign-card fees, net settlement timing, minimum/maximum amounts, reserves, chargeback handling, partial refunds, webhook guarantees, idempotency support, authorization validity and permitted third-party supplier collections. Do not equate a successful test payment with verified bank settlement.

## Payment architecture

Keep separate records for:

- Booking quote and its exact terms, currency, expiry and policy revision.
- Inventory hold / reservation reference and confirmation outcome.
- Payment obligation: accommodation advance, remaining balance, refundable damage deposit, or service prepayment. These are not interchangeable.
- Payment attempt, processor reference, authorization/capture/refund/dispute events and their verified timestamps.
- Settlement batch and bank reconciliation: gross amount, fees, refunds and net paid out.

Use integer minor units and a currency on every amount. Take payment details only in processor-hosted checkout/fields; never receive card numbers or CVVs in our API, logs or chat. Card authentication, guest identity, merchant KYC and reservation confirmation are four different checks.

A redirect to a success page must not mark an order paid. Verify signed provider events, retrieve authoritative transaction state where supported, deduplicate events and reconcile delayed/out-of-order outcomes. Persist an immutable financial ledger and an outbox for downstream actions. An uncertain payment or send must not be retried under a new identity automatically.

Before instant direct booking, verify Hospitable's supported reservation/hold and channel-inventory semantics. A local calendar check cannot atomically reserve nights across Airbnb and the website. If no safe hold/confirmation flow is available, use a host-reviewed quote and payment request workflow until double-booking prevention is proven. Define recovery/refund behavior if payment succeeds but reservation confirmation fails.

Security deposits may require authorization/capture/void capabilities or a separately collected refundable charge; choose only a flow the processor explicitly supports for the required interval. Do not silently implement a refundable charge as if it were a card hold. Let the owner set the advance-payment, balance, cancellation, refund and deposit terms before publishing them.

For future SaaS, connect each property's own approved merchant account and settlement destination. Routing every host or vendor payment through Diego's bank account is not an assumed platform capability. Marketplace or split settlement needs explicit provider support and an appropriate operating model.

## Go-live evidence

The first direct-payment release requires approved merchant status, verified bank settlement, reviewed website terms, production secrets, sandbox tests, signed webhook/reconciliation tests, refund tests, deposit-specific tests, inventory concurrency tests, monitoring and a recovery runbook. Keep Airbnb as the functioning accommodation checkout until these are complete.

## Promerica first: clarify the exact online product

Promerica is the first bank to contact when settlement should remain there. Its e-commerce page and POS page publish different document lists (including different VAT-history periods); do not combine these into a definitive onboarding checklist. Ask for the exact requirements for the chosen online product and merchant activity. Personal account ownership does not itself prove approval as an online merchant.

Sources: [Promerica payment portfolio](https://solucionesdigitales.promerica.com.sv/medios-de-pago) and [Promerica POS requirements](https://www.promerica.com.sv/banca-de-empresas/pos-promerica/). The POS page provides the merchant team contact: comerciosafiliados@promerica.com.sv and +503 2513-5000. No enquiry has been sent to the bank.
