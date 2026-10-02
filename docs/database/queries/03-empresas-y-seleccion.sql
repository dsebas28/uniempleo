-- titulo: Empresas: postulaciones y tasa de selección
-- descripcion: Vacantes, postulaciones recibidas y qué porcentaje terminó en contratación por empresa. NULLIF evita dividir entre cero en empresas sin postulaciones.
SELECT c.name                                                                AS empresa,
       c.sector                                                              AS sector,
       COUNT(DISTINCT j.id)                                                  AS vacantes,
       COUNT(a.id)                                                           AS postulaciones,
       COUNT(a.id) FILTER (WHERE a.status = 'selected')                      AS contratados,
       round(100.0 * COUNT(a.id) FILTER (WHERE a.status = 'selected')
             / NULLIF(COUNT(a.id), 0), 1)                                    AS tasa_seleccion_pct
FROM companies c
LEFT JOIN jobs j         ON j.company_id = c.id
LEFT JOIN applications a ON a.job_id = j.id
GROUP BY c.id, c.name, c.sector
ORDER BY postulaciones DESC;
