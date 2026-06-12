-- ✅ RUN THIS DIRECTLY IN SUPABASE SQL EDITOR
-- ✅ THIS WILL CREATE YOUR ADMIN USER DIRECTLY IN DATABASE

INSERT INTO users (id, name, userId, password, role)
VALUES (
  'admin_1',
  'System Administrator',
  'Master1',
  'admin123',
  'admin'
);

-- ✅ AFTER RUNNING THIS YOU CAN LOGIN WITH:
-- User ID: Master1
-- Password: admin123
-- Role: Administrator