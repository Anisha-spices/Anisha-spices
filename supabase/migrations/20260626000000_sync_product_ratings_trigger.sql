-- Migration to automatically sync products.average_rating and products.review_count with approved reviews in the reviews table

CREATE OR REPLACE FUNCTION update_product_rating_stats()
RETURNS TRIGGER AS $$
DECLARE
  target_product_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_product_id := OLD.product_id;
  ELSE
    target_product_id := NEW.product_id;
  END IF;

  UPDATE products
  SET 
    average_rating = COALESCE((
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM reviews
      WHERE product_id = target_product_id AND is_approved = true
    ), 0.00),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE product_id = target_product_id AND is_approved = true
    )
  WHERE id = target_product_id;

  IF TG_OP = 'UPDATE' AND OLD.product_id IS DISTINCT FROM NEW.product_id THEN
    UPDATE products
    SET 
      average_rating = COALESCE((
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews
        WHERE product_id = OLD.product_id AND is_approved = true
      ), 0.00),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE product_id = OLD.product_id AND is_approved = true
      )
    WHERE id = OLD.product_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_product_rating_stats ON reviews;
CREATE TRIGGER trigger_update_product_rating_stats
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating_stats();

-- Reset any pre-seeded hardcoded product ratings to 0 if they have no approved reviews
UPDATE products
SET 
  average_rating = COALESCE((
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM reviews
    WHERE reviews.product_id = products.id AND reviews.is_approved = true
  ), 0.00),
  review_count = (
    SELECT COUNT(*)
    FROM reviews
    WHERE reviews.product_id = products.id AND reviews.is_approved = true
  );
