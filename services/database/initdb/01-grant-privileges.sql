-- Usar backticks para nomes que podem conter caracteres especiais
CREATE USER IF NOT EXISTS `${DB_USER}`@`%` IDENTIFIED BY '${DB_PASSWORD}';

-- Conceder privilégios específicos (mais seguro que ALL PRIVILEGES)
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, EXECUTE, 
      CREATE ROUTINE, ALTER ROUTINE, TRIGGER, REFERENCES 
ON `${DB_NAME}`.* TO `${DB_USER}`@`%`;

-- Atualizar senha se o usuário já existir (opcional)
ALTER USER `${DB_USER}`@`%` IDENTIFIED BY '${DB_PASSWORD}';

FLUSH PRIVILEGES;