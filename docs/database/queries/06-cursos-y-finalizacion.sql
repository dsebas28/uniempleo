-- titulo: UniEmpleo Academy: inscripciones y finalización
-- descripcion: Por curso: estudiantes inscritos en la plataforma, progreso medio y porcentaje que lo terminó (completed es BOOLEAN; FILTER cuenta los verdaderos).
SELECT co.title                                                          AS curso,
       co.level                                                          AS nivel,
       COUNT(e.id)                                                       AS inscritos,
       round(AVG(e.progress))                                            AS progreso_medio_pct,
       round(100.0 * COUNT(e.id) FILTER (WHERE e.completed) / NULLIF(COUNT(e.id), 0)) AS terminaron_pct
FROM courses co
LEFT JOIN enrollments e ON e.course_id = co.id
GROUP BY co.id, co.title, co.level
ORDER BY inscritos DESC, co.title;
