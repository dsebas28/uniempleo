-- titulo: Vacantes por área profesional
-- descripcion: Por cada área: vacantes activas, cuántas son prácticas, postulaciones recibidas y salario medio ofrecido. FILTER separa los casos sin subconsultas.
SELECT j.area                                                        AS area,
       COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'active')       AS vacantes_activas,
       COUNT(DISTINCT j.id) FILTER (WHERE j.is_internship)           AS practicas,
       COUNT(a.id)                                                   AS postulaciones,
       round(AVG((j.salary_min + j.salary_max) / 2.0) / 1000000, 2)  AS salario_medio_millones
FROM jobs j
LEFT JOIN applications a ON a.job_id = j.id
GROUP BY j.area
ORDER BY postulaciones DESC;
