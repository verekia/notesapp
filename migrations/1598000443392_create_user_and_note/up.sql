
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."user"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), "email" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("email"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updatedAt"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updatedAt" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_user_updatedAt"
BEFORE UPDATE ON "public"."user"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_user_updatedAt" ON "public"."user" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."note"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), "slug" text NOT NULL, "title" text NOT NULL, "content" text, "userId" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("slug"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updatedAt"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updatedAt" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_note_updatedAt"
BEFORE UPDATE ON "public"."note"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_note_updatedAt" ON "public"."note" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';

ALTER TABLE "public"."user" ADD COLUMN "name" text NULL;
