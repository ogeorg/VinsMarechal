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

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: listevins; Type: TABLE; Schema: public; Owner: olivier; Tablespace: 
--

CREATE TABLE listevins (
    compid text NOT NULL,
    vins json,
    shop json
);


ALTER TABLE public.listevins OWNER TO olivier;

--
-- Name: TABLE listevins; Type: COMMENT; Schema: public; Owner: olivier
--

COMMENT ON TABLE listevins IS 'Table pour stocker la liste des vins';


--
-- Name: listevins_pkey; Type: CONSTRAINT; Schema: public; Owner: olivier; Tablespace: 
--

ALTER TABLE ONLY listevins
    ADD CONSTRAINT listevins_pkey PRIMARY KEY (compid);


--
-- PostgreSQL database dump complete
--

