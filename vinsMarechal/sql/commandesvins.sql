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
-- Name: commandesvins; Type: TABLE; Schema: public; Owner: olivier; Tablespace: 
--

CREATE TABLE commandesvins (
    cmd_id numeric DEFAULT nextval('commandesvins_id_seq'::regclass) NOT NULL,
    cmd_date date,
    cmd_name text,
    cmd_email text,
    cmd_dir_delivery text,
    cmd_dir_facturation text,
    cmd_vins json,
    cmd_comment text,
    cmd_compid text
);


ALTER TABLE public.commandesvins OWNER TO olivier;

--
-- Name: TABLE commandesvins; Type: COMMENT; Schema: public; Owner: olivier
--

COMMENT ON TABLE commandesvins IS 'Commandes de vins';


--
-- Name: COLUMN commandesvins.cmd_id; Type: COMMENT; Schema: public; Owner: olivier
--

COMMENT ON COLUMN commandesvins.cmd_id IS 'Id de la commande';


--
-- Name: COLUMN commandesvins.cmd_date; Type: COMMENT; Schema: public; Owner: olivier
--

COMMENT ON COLUMN commandesvins.cmd_date IS 'Date de la commande';


--
-- Name: COLUMN commandesvins.cmd_name; Type: COMMENT; Schema: public; Owner: olivier
--

COMMENT ON COLUMN commandesvins.cmd_name IS 'Nom du client';


--
-- Name: COLUMN commandesvins.cmd_email; Type: COMMENT; Schema: public; Owner: olivier
--

COMMENT ON COLUMN commandesvins.cmd_email IS 'Email du client';


--
-- Name: COLUMN commandesvins.cmd_dir_delivery; Type: COMMENT; Schema: public; Owner: olivier
--

COMMENT ON COLUMN commandesvins.cmd_dir_delivery IS 'Adresse de livraison';


--
-- Name: COLUMN commandesvins.cmd_dir_facturation; Type: COMMENT; Schema: public; Owner: olivier
--

COMMENT ON COLUMN commandesvins.cmd_dir_facturation IS 'Adresse de facturation';


--
-- Name: COLUMN commandesvins.cmd_vins; Type: COMMENT; Schema: public; Owner: olivier
--

COMMENT ON COLUMN commandesvins.cmd_vins IS 'Vins commandés';


--
-- Name: COLUMN commandesvins.cmd_comment; Type: COMMENT; Schema: public; Owner: olivier
--

COMMENT ON COLUMN commandesvins.cmd_comment IS 'Commentaire optionel';


--
-- Name: commandesvins_pkey; Type: CONSTRAINT; Schema: public; Owner: olivier; Tablespace: 
--

ALTER TABLE ONLY commandesvins
    ADD CONSTRAINT commandesvins_pkey PRIMARY KEY (cmd_id);


--
-- PostgreSQL database dump complete
--

