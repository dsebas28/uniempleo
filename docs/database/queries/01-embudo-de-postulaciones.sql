-- titulo: Embudo de postulaciones
-- descripcion: Cuántas postulaciones hay en cada etapa del proceso y qué porcentaje del total representan (función de ventana sobre el agregado). Es la gráfica "Embudo de Postulaciones" de los reportes del administrador.
SELECT status                                                  AS etapa,
       COUNT(*)                                                AS postulaciones,
       round(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1)      AS porcentaje
FROM applications
GROUP BY status
ORDER BY array_position(ARRAY['sent', 'reviewing', 'preselected', 'interview', 'selected', 'rejected'], status::text);
