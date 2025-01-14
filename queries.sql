––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

-- Table: public.users

CREATE TABLE IF NOT EXISTS public.users
(
    user_email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    user_password character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (user_email)
)

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

-- Table: public.current_day_activities

CREATE TABLE IF NOT EXISTS public.current_day_activities
(
    activity_name character varying(40) COLLATE pg_catalog."default" NOT NULL,
    activity_description character varying(500) COLLATE pg_catalog."default",
    activity_priority integer,
    activity_start_time time without time zone NOT NULL,
    activity_end_time time without time zone NOT NULL,
    activity_uuid uuid NOT NULL DEFAULT gen_random_uuid(),
    activity_type character varying(1) COLLATE pg_catalog."default" DEFAULT 'c'::character varying,
    activity_status integer,
    user_email character varying(150) COLLATE pg_catalog."default",
    activity_notes character varying(10000) COLLATE pg_catalog."default",
    CONSTRAINT pk_current_day_activities PRIMARY KEY (activity_uuid),
    CONSTRAINT current_day_activities_activity_name_key UNIQUE (activity_name),
    CONSTRAINT current_day_activities_user_email_fkey FOREIGN KEY (user_email)
        REFERENCES public.users (user_email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT chk_time CHECK (activity_start_time::text < activity_end_time::text),
    CONSTRAINT current_day_activities_activity_end_time_check CHECK (activity_end_time::text <> ''::text),
    CONSTRAINT current_day_activities_activity_name_check CHECK (activity_name::text <> ''::text),
    CONSTRAINT current_day_activities_activity_start_time_check CHECK (activity_start_time::text <> ''::text),
    CONSTRAINT current_day_activities_activity_status_check CHECK (activity_status = ANY (ARRAY[0, 1]))
)

-- Trigger: check_start_end_time_future

CREATE OR REPLACE FUNCTION public.check_start_end_time_future()
RETURNS TRIGGER AS $$
DECLARE
    current_est_time TIME := (now() AT TIME ZONE 'America/New_York')::time;
    end_of_day TIME := '23:59:59';
BEGIN
    IF (NEW.activity_start_time IS DISTINCT FROM OLD.activity_start_time) OR 
       (NEW.activity_end_time IS DISTINCT FROM OLD.activity_end_time) THEN

        IF NEW.activity_start_time <= current_est_time THEN
            RAISE EXCEPTION 'activity_start_time must be in the future (EST)';
        END IF;

        IF NEW.activity_start_time > end_of_day THEN
            RAISE EXCEPTION 'activity_start_time must be before 11:59 PM (EST)';
        END IF;

        IF NEW.activity_end_time <= NEW.activity_start_time THEN
            RAISE EXCEPTION 'activity_end_time must be after activity_start_time';
        END IF;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: ensure_start_end_time_future

CREATE OR REPLACE TRIGGER ensure_start_end_time_future
    BEFORE INSERT OR UPDATE 
    ON public.current_day_activities
    FOR EACH ROW
    EXECUTE FUNCTION public.check_start_end_time_future();

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

-- Table: public.daily_activities

CREATE TABLE IF NOT EXISTS public.daily_activities
(
    activity_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    activity_description character varying(500) COLLATE pg_catalog."default",
    activity_priority integer,
    activity_start_time time without time zone NOT NULL,
    activity_end_time time without time zone NOT NULL,
    activity_uuid uuid NOT NULL DEFAULT gen_random_uuid(),
    activity_type character varying(1) COLLATE pg_catalog."default" DEFAULT 'd'::character varying,
    activity_status integer,
    user_email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    activity_notes character varying(10000) COLLATE pg_catalog."default",
    CONSTRAINT pk_activities PRIMARY KEY (activity_uuid),
    CONSTRAINT activities_user_email_fkey FOREIGN KEY (user_email)
        REFERENCES public.users (user_email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT activities_activity_end_time_check CHECK (activity_end_time::text <> ''::text),
    CONSTRAINT activities_activity_name_check CHECK (activity_name::text <> ''::text),
    CONSTRAINT activities_activity_start_time_check CHECK (activity_start_time::text <> ''::text),
    CONSTRAINT activities_activity_status_check CHECK (activity_status = ANY (ARRAY[0, 1, 2])),
    CONSTRAINT chk_time CHECK (activity_start_time::text < activity_end_time::text)
)

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

-- Table: public.daily_activities_progress

CREATE TABLE IF NOT EXISTS public.daily_activities_progress
(
    record_uuid uuid NOT NULL DEFAULT gen_random_uuid(),
    activity_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    activity_uuid character varying(200) COLLATE pg_catalog."default" NOT NULL,
    date_completed date NOT NULL,
    user_email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT daily_activities_progress_pkey PRIMARY KEY (record_uuid),
    CONSTRAINT daily_activities_progress_user_email_fkey FOREIGN KEY (user_email)
        REFERENCES public.users (user_email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

-- Table: public.global_activities

CREATE TABLE IF NOT EXISTS public.global_activities
(
    record_uuid uuid NOT NULL DEFAULT gen_random_uuid(),
    activity_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    activity_uuid character varying(200) COLLATE pg_catalog."default" NOT NULL,
    user_email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT global_activities_pkey PRIMARY KEY (record_uuid),
    CONSTRAINT global_activities_activity_name_key UNIQUE (activity_name),
    CONSTRAINT global_activities_user_email_fkey FOREIGN KEY (user_email)
        REFERENCES public.users (user_email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

-- Table: public.missed_activities

CREATE TABLE IF NOT EXISTS public.missed_activities
(
    activity_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    activity_description character varying(500) COLLATE pg_catalog."default",
    activity_priority integer,
    activity_start_time time without time zone NOT NULL,
    activity_end_time time without time zone NOT NULL,
    activity_uuid uuid NOT NULL DEFAULT gen_random_uuid(),
    activity_date date,
    user_email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT missed_activities_pkey PRIMARY KEY (activity_uuid),
    CONSTRAINT missed_activities_activity_name_key UNIQUE (activity_name),
    CONSTRAINT missed_activities_user_email_fkey FOREIGN KEY (user_email)
        REFERENCES public.users (user_email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT chk_time CHECK (activity_start_time::text < activity_end_time::text),
    CONSTRAINT missed_activities_activity_end_time_check CHECK (activity_end_time::text <> ''::text),
    CONSTRAINT missed_activities_activity_name_check CHECK (activity_name::text <> ''::text),
    CONSTRAINT missed_activities_activity_start_time_check CHECK (activity_start_time::text <> ''::text)
)

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

-- Table: public.upcoming_activities

CREATE TABLE IF NOT EXISTS public.upcoming_activities
(
    activity_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    activity_description character varying(500) COLLATE pg_catalog."default",
    activity_priority integer,
    activity_start_time time without time zone NOT NULL,
    activity_end_time time without time zone NOT NULL,
    activity_uuid uuid NOT NULL DEFAULT gen_random_uuid(),
    activity_date date,
    user_email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT upcoming_activities_pkey PRIMARY KEY (activity_uuid),
    CONSTRAINT upcoming_activities_user_email_fkey FOREIGN KEY (user_email)
        REFERENCES public.users (user_email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT chk_time CHECK (activity_start_time::text < activity_end_time::text),
    CONSTRAINT upcoming_activities_activity_end_time_check CHECK (activity_end_time::text <> ''::text),
    CONSTRAINT upcoming_activities_activity_name_check CHECK (activity_name::text <> ''::text),
    CONSTRAINT upcoming_activities_activity_start_time_check CHECK (activity_start_time::text <> ''::text)
)

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

-- Table: public.user_session

CREATE TABLE IF NOT EXISTS public.user_session
(
    record_uuid uuid NOT NULL DEFAULT gen_random_uuid(),
    user_email character varying(150) COLLATE pg_catalog."default",
    session_start_time time without time zone,
    session_end_time time without time zone,
    break_time integer,
    total_sessions integer,
    session_type character varying(1) COLLATE pg_catalog."default",
    session_version character varying(1) COLLATE pg_catalog."default",
    CONSTRAINT user_session_pkey PRIMARY KEY (record_uuid),
    CONSTRAINT user_session_user_email_fkey FOREIGN KEY (user_email)
        REFERENCES public.users (user_email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT user_session_check CHECK (session_start_time < session_end_time),
    CONSTRAINT user_session_session_type_check CHECK (session_type::text = ANY (ARRAY['q'::character varying::text, 'd'::character varying::text])),
    CONSTRAINT user_session_session_version_check CHECK (session_version::text = ANY (ARRAY['o'::character varying::text, 'n'::character varying::text]))
)

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

-- Table: public.user_statistics

CREATE TABLE IF NOT EXISTS public.user_statistics
(
    record_id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    date date NOT NULL,
    skipped_activities integer NOT NULL,
    completed_activities integer NOT NULL,
    CONSTRAINT user_statistics_pkey PRIMARY KEY (record_id),
    CONSTRAINT user_statistics_user_email_fkey FOREIGN KEY (user_email)
        REFERENCES public.users (user_email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

