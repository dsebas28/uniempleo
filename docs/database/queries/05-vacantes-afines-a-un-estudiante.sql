-- titulo: Vacantes más afines a las habilidades de un estudiante
-- descripcion: Intersección de arreglos: para el estudiante demo, cuántas de las habilidades que pide cada vacante ya tiene, y cuáles. Base para un recomendador basado en datos reales.
WITH mis_habilidades AS (
    SELECT array_agg(sk.name) AS habilidades
    FROM students s
    JOIN users u           ON u.id = s.user_id
    JOIN student_skills ss ON ss.student_id = s.id
    JOIN skills sk         ON sk.id = ss.skill_id
    WHERE u.email = 'estudiante@demo.com'
)
SELECT j.title                                                        AS vacante,
       c.name                                                         AS empresa,
       cardinality(string_to_array(j.skills, ','))                    AS pide,
       cardinality(ARRAY(SELECT unnest(string_to_array(j.skills, ','))
                         INTERSECT SELECT unnest(m.habilidades)))     AS tiene,
       array_to_string(ARRAY(SELECT unnest(string_to_array(j.skills, ','))
                             INTERSECT SELECT unnest(m.habilidades)), ', ') AS coincidencias
FROM jobs j
JOIN companies c ON c.id = j.company_id
CROSS JOIN mis_habilidades m
WHERE j.status = 'active'
ORDER BY tiene DESC, pide
LIMIT 8;
