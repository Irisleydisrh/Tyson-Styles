-- Update admin password
UPDATE "User" SET password = '$2b$10$Qj/zjO5aREL6CxkKt.jj4uh1dzxkHN.N1ipbAqmJYTJDkXu/P6A.S', "updatedAt" = NOW() WHERE email = 'admin@tyson.styles';