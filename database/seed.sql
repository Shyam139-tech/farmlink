-- Demo seed is intentionally small and repeatable. Passwords for the UI demo are managed by backend demo mode.
INSERT INTO crops(name) VALUES ('Tomato'),('Onion'),('Banana'),('Brinjal'),('Okra'),('Mango'),('Paddy'),('Groundnut'),('Chilli'),('Coconut') ON CONFLICT DO NOTHING;
INSERT INTO fpos(name) VALUES ('Melur Farmer Hub'),('Madurai Growers FPO'),('Vaigai Valley FPO') ON CONFLICT DO NOTHING;
