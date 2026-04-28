-- Insert categories
INSERT INTO "Category" (id, name, slug, icon, "sortOrder", "createdAt", "updatedAt") VALUES
('34e328e3-95ee-4549-86b2-f6acc9f0b6f6', 'Champs', 'champs', '💇', 1, NOW(), NOW()),
('deb39101-8727-4507-a509-fb632cf7f495', 'Acondicionadores', 'acondicionadores', '💆', 2, NOW(), NOW()),
('1e76cefe-cc70-46ec-b3ca-cd0ef32b5aaa', 'Mascarillas', 'mascarillas', '🎭', 3, NOW(), NOW()),
('37b612a3-4c29-41b0-bdac-765587d932ac', 'Aceites', 'aceites', '🫒', 4, NOW(), NOW()),
('361d07d3-f006-4530-a2d6-bb1b19505adc', 'Geles y Cremas', 'geles-cremas', '🧴', 5, NOW(), NOW()),
('51b66923-0a4d-4f57-b645-899b9eb3a86e', 'Accesorios', 'accesorios', '🪮', 6, NOW(), NOW());

-- Insert admin user (password: admin123)
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES
('a0eebc99-9c0b-4ef8-bb6d-3c1e530e9a01', 'admin@tyson.styles', '$2b$10$rVqK.vXqlj0P6xZ1xYJ3YOV4K9Z1X1Z1X1Z1X1Z1X1Z1X1Z1X1', 'Admin', 'ADMIN', NOW(), NOW());