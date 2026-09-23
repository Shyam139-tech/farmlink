CREATE TABLE IF NOT EXISTS pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID,
  farmer_id UUID,
  fpo_id UUID,
  crop_id UUID,
  quantity NUMERIC NOT NULL CHECK(quantity > 0),
  pickup_latitude NUMERIC,
  pickup_longitude NUMERIC,
  pickup_address TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  special_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED','FPO_ACCEPTED','VEHICLE_ASSIGNED','PICKUP_SCHEDULED','PICKED_UP','IN_TRANSIT','DELIVERED','CANCELLED')),
  vehicle_id UUID,
  transporter_id UUID,
  route_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pickup_requests_status_idx ON pickup_requests(status);