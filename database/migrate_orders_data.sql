-- 数据迁移脚本
-- 将clients表中现有的订单相关字段数据迁移到新的orders表

-- 第一步：迁移现有订单数据到orders表
-- 注意：这个脚本假设clients表的订单字段包含单个订单的数据
INSERT INTO orders (
  client_id,
  order_num,
  order_inquiry_date,
  profit,
  payment_account,
  payment_ratio,
  payment_date,
  production_date,
  export_method,
  product_name,
  product_model,
  product_quantity,
  product_unit,
  product_price,
  product_spec,
  order_status,
  created_at
)
SELECT
  id AS client_id,
  order_num,
  order_inquiry_date,
  profit,
  payment_account,
  payment_ratio,
  payment_date,
  production_date,
  export_method,
  order_product_name AS product_name,
  product_model,
  product_quantity,
  product_unit,
  product_price,
  product_spec,
  CASE
    WHEN state = 4 THEN 'completed'
    WHEN state = 3 THEN 'in_progress'
    ELSE 'in_progress'
  END AS order_status,
  created_at
FROM clients
WHERE order_num IS NOT NULL AND order_num != ''; -- 只迁移有订单编号的记录

-- 第二步：备份旧数据（可选，建议执行）
-- 创建备份表
CREATE TABLE IF NOT EXISTS clients_backup AS SELECT * FROM clients;

-- 第三步：清理clients表中的订单字段（可选，在确认数据迁移成功后执行）
-- 注意：执行前请务必确认数据已正确迁移！
-- ALTER TABLE clients DROP COLUMN IF EXISTS order_num;
-- ALTER TABLE clients DROP COLUMN IF EXISTS order_inquiry_date;
-- ALTER TABLE clients DROP COLUMN IF EXISTS profit;
-- ALTER TABLE clients DROP COLUMN IF EXISTS payment_account;
-- ALTER TABLE clients DROP COLUMN IF EXISTS payment_ratio;
-- ALTER TABLE clients DROP COLUMN IF EXISTS payment_date;
-- ALTER TABLE clients DROP COLUMN IF EXISTS production_date;
-- ALTER TABLE clients DROP COLUMN IF EXISTS export_method;
-- ALTER TABLE clients DROP COLUMN IF EXISTS order_product_name;
-- ALTER TABLE clients DROP COLUMN IF EXISTS product_model;
-- ALTER TABLE clients DROP COLUMN IF EXISTS product_quantity;
-- ALTER TABLE clients DROP COLUMN IF EXISTS product_unit;
-- ALTER TABLE clients DROP COLUMN IF EXISTS product_price;
-- ALTER TABLE clients DROP COLUMN IF EXISTS product_spec;

-- 验证迁移结果的查询
SELECT
  c.id AS client_id,
  c.client_name,
  COUNT(o.id) AS order_count
FROM clients c
LEFT JOIN orders o ON c.id = o.client_id
GROUP BY c.id, c.client_name
ORDER BY order_count DESC;
