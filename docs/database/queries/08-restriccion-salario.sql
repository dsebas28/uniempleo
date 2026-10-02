-- titulo: La base de datos rechaza un rango salarial invertido
-- descripcion: La restricción jobs_salary_range exige que el salario mínimo no supere al máximo. Aunque el formulario o la API fallaran, PostgreSQL no guarda el dato (la sentencia se ejecuta en una transacción que se revierte).
UPDATE jobs
SET salary_min = 5000000, salary_max = 1000000
WHERE id = 1;
