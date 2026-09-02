-- =============================================================
-- Migration: Add shipping_address JSON snapshot to orders table
-- Ensures order delivery address is permanent and immune to user address edits
-- =============================================================

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS shipping_address JSONB;

COMMENT ON COLUMN public.orders.shipping_address IS 'Immutable snapshot of recipient name, phone, and complete shipping address at the time the order was placed.';
