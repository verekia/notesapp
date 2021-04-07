CREATE
OR REPLACE VIEW "public"."note_public" AS
SELECT
  note.content,
  note.title,
  note.slug
FROM
  note;
