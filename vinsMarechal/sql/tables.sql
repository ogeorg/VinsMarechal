CREATE TABLE listevins (
    compid text NOT NULL,
    vins json,
    shop json
);
COMMENT ON TABLE listevins IS 'Table pour stocker la liste des vins';
ALTER TABLE ONLY listevins ADD CONSTRAINT listevins_pkey PRIMARY KEY (compid);

CREATE SEQUENCE commandesvins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

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

COMMENT ON TABLE commandesvins IS 'Commandes de vins';
COMMENT ON COLUMN commandesvins.cmd_id IS 'Id de la commande';
COMMENT ON COLUMN commandesvins.cmd_date IS 'Date de la commande';
COMMENT ON COLUMN commandesvins.cmd_name IS 'Nom du client';
COMMENT ON COLUMN commandesvins.cmd_email IS 'Email du client';
COMMENT ON COLUMN commandesvins.cmd_dir_delivery IS 'Adresse de livraison';
COMMENT ON COLUMN commandesvins.cmd_dir_facturation IS 'Adresse de facturation';
COMMENT ON COLUMN commandesvins.cmd_vins IS 'Vins commandés';
COMMENT ON COLUMN commandesvins.cmd_comment IS 'Commentaire optionel';
ALTER TABLE ONLY commandesvins ADD CONSTRAINT commandesvins_pkey PRIMARY KEY (cmd_id);
