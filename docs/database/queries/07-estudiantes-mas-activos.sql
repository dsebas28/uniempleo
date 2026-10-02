-- titulo: Estudiantes más activos
-- descripcion: Ranking con DENSE_RANK() por número de postulaciones, junto al estado más avanzado alcanzado y si tiene entrevistas agendadas.
SELECT DENSE_RANK() OVER (ORDER BY COUNT(a.id) DESC)          AS puesto,
       s.full_name                                            AS estudiante,
       s.career                                               AS carrera,
       COUNT(a.id)                                            AS postulaciones,
       COUNT(a.id) FILTER (WHERE a.status IN ('interview', 'selected')) AS entrevistas_o_contratos,
       s.profile_completion                                   AS perfil_pct
FROM students s
LEFT JOIN applications a ON a.student_id = s.id
GROUP BY s.id, s.full_name, s.career, s.profile_completion
ORDER BY puesto, s.full_name
LIMIT 10;
