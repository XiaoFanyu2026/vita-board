-- 开启 pgcrypto 扩展用于 UUID 生成
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. users 表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status SMALLINT NOT NULL DEFAULT 1, -- 1: 正常, 0: 禁用
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. departments 表 (部门/组织)
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES departments(id) ON DELETE RESTRICT,
    sort INT DEFAULT 0,
    status SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_departments_parent_id ON departments(parent_id);

-- 3. roles 表
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. permissions 表
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE, -- 例如: 'whiteboard:read', 'user:create'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. role_permissions 表 (角色-权限关联)
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

-- 6. user_roles 表 (用户-角色关联)
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- 7. user_departments 表 (用户-部门关联)
CREATE TABLE user_departments (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, department_id)
);
CREATE INDEX idx_user_departments_user_id ON user_departments(user_id);
CREATE INDEX idx_user_departments_dept_id ON user_departments(department_id);

-- 8. whiteboards 表 (支持 Yjs 二进制状态存储)
CREATE TABLE whiteboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    yjs_data BYTEA,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_whiteboards_owner_id ON whiteboards(owner_id);
CREATE INDEX idx_whiteboards_department_id ON whiteboards(department_id);

-- 初始化数据 Seed
DO $$ 
DECLARE 
    v_root_dept_id UUID := gen_random_uuid();
    v_admin_role_id UUID := gen_random_uuid();
    v_admin_user_id UUID := gen_random_uuid();
    v_perm_read UUID := gen_random_uuid();
    v_perm_write UUID := gen_random_uuid();
BEGIN
    -- 1. 插入根部门
    INSERT INTO departments (id, name, parent_id, sort) 
    VALUES (v_root_dept_id, '总部', NULL, 0);

    -- 2. 插入基础权限点
    INSERT INTO permissions (id, code, name, description) VALUES 
    (v_perm_read, 'whiteboard:read', '白板读取权限', '允许查看和读取白板内容'),
    (v_perm_write, 'whiteboard:write', '白板编辑权限', '允许编辑和保存白板内容');

    -- 3. 插入管理员角色
    INSERT INTO roles (id, name, description) 
    VALUES (v_admin_role_id, '超级管理员', '系统最高权限管理员');

    -- 4. 绑定角色与权限 (超管拥有读写权限)
    INSERT INTO role_permissions (role_id, permission_id) VALUES 
    (v_admin_role_id, v_perm_read),
    (v_admin_role_id, v_perm_write);

    -- 5. 插入管理员用户 (密码为 '123456' 的 bcrypt hash)
    INSERT INTO users (id, username, email, password_hash, phone, status) 
    VALUES (
        v_admin_user_id, 
        'admin', 
        'admin@example.com', 
        '$2a$10$X1hF5D6B6A7H6E8G1I9J8.X0K9M8N7O6P5Q4R3S2T1U0V9W8X7Y6Z', -- '123456'
        '13800138000', 
        1
    );

    -- 6. 绑定用户与角色
    INSERT INTO user_roles (user_id, role_id) 
    VALUES (v_admin_user_id, v_admin_role_id);

    -- 7. 绑定用户与部门 (归属到总部)
    INSERT INTO user_departments (user_id, department_id) 
    VALUES (v_admin_user_id, v_root_dept_id);
    
END $$;
