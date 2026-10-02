-- titulo: Plan de ejecución: listado de vacantes
-- descripcion: El listado público pide las vacantes activas más recientes. Con pocas filas PostgreSQL prefiere leer la tabla entera, así que se desactiva el recorrido secuencial para ver el plan que usará cuando crezca: el índice compuesto (status, created_at DESC), que ya entrega las filas en orden.
SET enable_seqscan = off;
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
SELECT id, title, city, created_at
FROM jobs
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 12;
