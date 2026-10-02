-- titulo: Habilidades: lo que piden las empresas frente a lo que tienen los estudiantes
-- descripcion: Las vacantes guardan sus habilidades como texto separado por comas; string_to_array + unnest las convierte en filas. Se cruzan con las habilidades registradas por los estudiantes para ver dónde falta talento.
WITH demanda AS (
    SELECT btrim(skill) AS habilidad, COUNT(*) AS vacantes
    FROM jobs, unnest(string_to_array(skills, ',')) AS skill
    WHERE status = 'active'
    GROUP BY btrim(skill)
),
oferta AS (
    SELECT sk.name AS habilidad, COUNT(*) AS estudiantes
    FROM student_skills ss
    JOIN skills sk ON sk.id = ss.skill_id
    GROUP BY sk.name
)
SELECT d.habilidad,
       d.vacantes                                  AS vacantes_que_la_piden,
       COALESCE(o.estudiantes, 0)                  AS estudiantes_que_la_tienen,
       round(COALESCE(o.estudiantes, 0)::numeric / d.vacantes, 2) AS estudiantes_por_vacante
FROM demanda d
LEFT JOIN oferta o USING (habilidad)
ORDER BY d.vacantes DESC, d.habilidad
LIMIT 12;
