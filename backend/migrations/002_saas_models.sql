-- =========================================================
-- Verum — SaaS-модель: схема БД (Блок 2.0)
-- Все IF NOT EXISTS — можно прогонять сколько угодно раз.
--
-- Команда для сервера:
--   docker exec -i verum_db psql -U verum_user -d verum_db < /root/Verum/backend/migrations/002_saas_models.sql
-- =========================================================

-- users: план, лимиты, бан, дата подписки
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verifications_left INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_until TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS banned BOOLEAN NOT NULL DEFAULT FALSE;

-- interviews: тайм-коды аномалий для модератора
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS timecode_markers JSONB DEFAULT NULL;

-- subscriptions: история подписок компании
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(20) NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- invoices: счета (пока заглушки, ЮKassa/CloudPayments позже)
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    description VARCHAR(255) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_id VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMP NULL
);

-- usage_logs: все списания (аудит)
CREATE TABLE IF NOT EXISTS usage_logs (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    candidate_id INTEGER NULL REFERENCES users(id) ON DELETE SET NULL,
    interview_id VARCHAR(36) NULL,
    cost INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- verification_requests: On-Demand модерация (Q1=B)
CREATE TABLE IF NOT EXISTS verification_requests (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    developer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    reserved_credit BOOLEAN NOT NULL DEFAULT TRUE,
    moderated_by INTEGER NULL REFERENCES users(id) ON DELETE SET NULL,
    moderated_at TIMESTAMP NULL,
    rejection_reason VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- индексы
CREATE INDEX IF NOT EXISTS idx_usage_logs_company ON usage_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_action ON usage_logs(action);
CREATE INDEX IF NOT EXISTS idx_subscriptions_company ON subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_company ON verification_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_developer ON verification_requests(developer_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status);
