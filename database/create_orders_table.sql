-- 创建订单表
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,

  -- 订单基本信息
  order_num VARCHAR(100) NOT NULL,
  order_inquiry_date DATE,
  profit DECIMAL(12, 2),
  order_status VARCHAR(50) DEFAULT 'in_progress',

  -- 收款信息
  payment_account VARCHAR(100),
  payment_ratio DECIMAL(5, 2),
  payment_date DATE,
  production_date DATE,
  export_method VARCHAR(100),

  -- 产品信息
  product_name VARCHAR(255) NOT NULL,
  product_model VARCHAR(100),
  product_quantity DECIMAL(12, 2),
  product_unit VARCHAR(50),
  product_price DECIMAL(12, 2),
  product_spec TEXT,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 索引优化
  CONSTRAINT unique_order_num_per_client UNIQUE(client_id, order_num)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON public.orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_num ON public.orders(order_num);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);

-- 创建更新时间戳的触发器函数（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 orders 表创建触发器
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 添加注释
COMMENT ON TABLE public.orders IS '客户订单表';
COMMENT ON COLUMN public.orders.client_id IS '关联的客户ID';
COMMENT ON COLUMN public.orders.order_num IS '订单编号';
COMMENT ON COLUMN public.orders.order_inquiry_date IS '询盘日期';
COMMENT ON COLUMN public.orders.profit IS '利润（美元）';
COMMENT ON COLUMN public.orders.order_status IS '订单状态: in_progress(进行中), completed(已完成), cancelled(已取消)';
COMMENT ON COLUMN public.orders.payment_account IS '收款账号';
COMMENT ON COLUMN public.orders.payment_ratio IS '收款比例（百分比）';
COMMENT ON COLUMN public.orders.payment_date IS '收款日期';
COMMENT ON COLUMN public.orders.production_date IS '排产日期';
COMMENT ON COLUMN public.orders.export_method IS '出口方式';
COMMENT ON COLUMN public.orders.product_name IS '产品名称';
COMMENT ON COLUMN public.orders.product_model IS '产品型号';
COMMENT ON COLUMN public.orders.product_quantity IS '产品数量';
COMMENT ON COLUMN public.orders.product_unit IS '产品单位';
COMMENT ON COLUMN public.orders.product_price IS '产品单价（美元）';
COMMENT ON COLUMN public.orders.product_spec IS '产品规格详细描述';

-- 启用行级安全策略（RLS）
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 创建访问策略：允许所有认证用户访问
CREATE POLICY "Allow all access to authenticated users" ON public.orders
  FOR ALL
  USING (true)
  WITH CHECK (true);
