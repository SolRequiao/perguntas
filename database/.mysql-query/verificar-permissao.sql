--Verificar permissões e conexões do usuário
SHOW GRANTS FOR 'user'@'%';

SELECT user, host, max_user_connections 
FROM mysql.user 
WHERE user = 'user';