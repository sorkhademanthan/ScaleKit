# PLAN_PHASE_9_BILLING.md

## Phase 9: Billing & Subscriptions (SaaS Monetization)

This phase will transform ScaleKit into a revenue-generating SaaS platform by integrating Stripe for subscription management.

### 1. Database Schema
- **Subscriptions Table**: `stripe_subscription_id`, `stripe_customer_id`, `stripe_price_id`, `status` (active, past_due, canceled), `current_period_end`.
- **Workspace Integration**: Link subscriptions to `workspaces` (so billing is per-team, not per-user).
- **Usage Limits**: Columns for `member_limit`, `storage_limit` based on plan.

### 2. Stripe Integration
- **Stripe Checkout**: Redirect users to Stripe hosted payment page to subscribe.
- **Stripe Webhooks**: Listen for `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`.
- **Customer Portal**: Self-serve portal for users to upgrade/downgrade/cancel.

### 3. Application Logic
- **Plan Types**:
    - **Free**: Limited members (e.g., 3), basic features.
    - **Pro**: Unlimited members, advanced features, priority support.
- **Gatekeeping**: Middleware/HOC to block access to Pro features if subscription is not active.

### 4. UI Components
- **Pricing Page**: Public marketing page showing plans.
- **Billing Settings**: Private workspace settings to manage subscription, view invoices, update card.
- **Upgrade Prompts**: UI nudges when limits are reached.

---

This phase usually follows **Phase 8 (Workspaces)** because B2B billing is tied to the Workspace entity.
