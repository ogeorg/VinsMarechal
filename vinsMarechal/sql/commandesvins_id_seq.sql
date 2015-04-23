--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

--
-- Name: commandesvins_id_seq; Type: SEQUENCE; Schema: public; Owner: olivier
--

CREATE SEQUENCE commandesvins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.commandesvins_id_seq OWNER TO olivier;

--
-- PostgreSQL database dump complete
--

