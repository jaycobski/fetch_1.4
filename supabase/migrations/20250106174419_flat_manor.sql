/*
  # Clear summaries table

  1. Changes
    - Truncates the summaries table to clear all existing summaries
    - Resets the sequence for the id column
  
  2. Safety
    - Only affects summaries table
    - Preserves table structure and policies
    - Data can be regenerated by users
*/

-- Clear all summaries while preserving the table structure
TRUNCATE TABLE public.summaries;

-- Reset the sequence if using serial/bigserial
ALTER SEQUENCE IF EXISTS summaries_id_seq RESTART;