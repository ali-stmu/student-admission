UPDATE application
SET program_id_1 = CASE WHEN program_id_1 = 5 THEN NULL ELSE program_id_1 END,
    program_id_2 = CASE WHEN program_id_2 = 5 THEN NULL ELSE program_id_2 END,
    program_id_3 = CASE WHEN program_id_3 = 5 THEN NULL ELSE program_id_3 END,
    program_id_4 = CASE WHEN program_id_4 = 5 THEN NULL ELSE program_id_4 END
WHERE (program_id_1 = 5 OR
       program_id_2 = 5 OR
       program_id_3 = 5 OR
       program_id_4 = 5)
  AND created_at < '2024-03-15';
