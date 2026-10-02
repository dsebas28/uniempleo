-- titulo: Tablas del modelo
-- descripcion: Estadísticas del propio PostgreSQL: filas y espacio en disco (datos más índices) de las 21 tablas de la base, de las que más datos tienen a las que menos.
SELECT relname                                        AS tabla,
       n_live_tup                                     AS filas,
       pg_size_pretty(pg_total_relation_size(relid))  AS tamano
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC, relname
LIMIT 21;
