#!/bin/bash
set -e

export MYSQL_PWD="root"

echo "Aguardando MySQL iniciar..."
while ! mysqladmin ping -u root --host=localhost --silent; do
    sleep 1
done

export MYSQL_PWD=$MYSQL_PASSWORD

MYSQL_PWD=$MYSQL_PASSWORD mysql --user=root --host=localhost -e "CREATE DATABASE IF NOT EXISTS \`$DB\`;"

mysql --user=root --host=localhost <<-EOSQL
  -- Criar usuário se não existir
  CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';
  
  -- Conceder todos os privilégios no banco específico
  GRANT ALL PRIVILEGES ON \`$DB\`.* TO '$DB_USER'@'%';
  
  -- Atualizar privilégios
  FLUSH PRIVILEGES;

  SET GLOBAL log_bin_trust_function_creators = 1;
EOSQL

echo "Usuário '$DB_USER' criado com acesso ao banco '$DB'"