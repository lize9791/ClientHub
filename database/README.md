# 数据库迁移脚本

## 执行步骤

### 1. 创建 orders 表

1. 打开 Supabase 控制台：https://supabase.com/dashboard
2. 选择你的项目
3. 点击左侧菜单的 **SQL Editor**
4. 点击 **New query** 创建新查询
5. 复制 `create_orders_table.sql` 文件的内容
6. 粘贴到查询编辑器中
7. 点击 **Run** 按钮执行

### 2. 验证表是否创建成功

在 SQL Editor 中执行以下查询：

```sql
SELECT * FROM public.orders LIMIT 10;
```

如果没有报错，说明表创建成功！

### 3. 检查表结构

```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'orders' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

## 表结构说明

### orders 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGSERIAL | 主键，自增 |
| client_id | BIGINT | 客户ID（外键） |
| order_num | VARCHAR(100) | 订单编号（必填） |
| order_inquiry_date | DATE | 询盘日期 |
| profit | DECIMAL(12,2) | 利润（美元） |
| order_status | VARCHAR(50) | 订单状态（默认：in_progress） |
| payment_account | VARCHAR(100) | 收款账号 |
| payment_ratio | DECIMAL(5,2) | 收款比例 |
| payment_date | DATE | 收款日期 |
| production_date | DATE | 排产日期 |
| export_method | VARCHAR(100) | 出口方式 |
| product_name | VARCHAR(255) | 产品名称（必填） |
| product_model | VARCHAR(100) | 产品型号 |
| product_quantity | DECIMAL(12,2) | 产品数量 |
| product_unit | VARCHAR(50) | 产品单位 |
| product_price | DECIMAL(12,2) | 产品单价 |
| product_spec | TEXT | 产品规格描述 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

### 关系说明

- `orders.client_id` → `clients.id`：一个客户可以有多个订单（一对多）
- 外键约束：`ON DELETE CASCADE`（删除客户时自动删除其所有订单）
- 唯一约束：同一客户的订单编号不能重复

### 索引说明

- `idx_orders_client_id`：加速按客户查询订单
- `idx_orders_order_num`：加速按订单编号搜索
- `idx_orders_created_at`：加速按创建时间排序
- `idx_orders_order_status`：加速按订单状态筛选

## 常见问题

### Q: 执行脚本时报错 "relation already exists"
A: 表已经存在了，不需要重复创建。如果需要重建表，请先删除：
```sql
DROP TABLE IF EXISTS public.orders CASCADE;
```
然后重新执行创建脚本。

### Q: 报错 "foreign key constraint" 相关错误
A: 确保 `clients` 表已经存在。如果不存在，需要先创建 clients 表。

### Q: 访问 orders 表时提示权限错误
A: 检查 Row Level Security (RLS) 策略是否正确设置。脚本中已经包含了允许所有认证用户访问的策略。
