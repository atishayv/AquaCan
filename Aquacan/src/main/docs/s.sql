--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.5
-- Dumped by pg_dump version 9.4.5
-- Started on 2016-10-20 17:00:28

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 7 (class 2615 OID 16738)
-- Name: aquacandb; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA aquacandb;


ALTER SCHEMA aquacandb OWNER TO postgres;

SET search_path = aquacandb, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 176 (class 1259 OID 16754)
-- Name: user_data; Type: TABLE; Schema: aquacandb; Owner: postgres; Tablespace: 
--

CREATE TABLE user_data (
    user_id integer NOT NULL,
    password character(128),
    first_name character varying(255),
    last_name character varying(255),
    mail_id character varying(320) NOT NULL,
    profile_pic character varying(255),
    dob character varying(255),
    gender character(1),
    address character varying(500),
    latitude character varying(255),
    longitude character varying(255),
    contact_number character varying(14)
);


ALTER TABLE user_data OWNER TO postgres;

--
-- TOC entry 175 (class 1259 OID 16752)
-- Name: user_data_user_id_seq; Type: SEQUENCE; Schema: aquacandb; Owner: postgres
--

CREATE SEQUENCE user_data_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_data_user_id_seq OWNER TO postgres;

--
-- TOC entry 2012 (class 0 OID 0)
-- Dependencies: 175
-- Name: user_data_user_id_seq; Type: SEQUENCE OWNED BY; Schema: aquacandb; Owner: postgres
--

ALTER SEQUENCE user_data_user_id_seq OWNED BY user_data.user_id;


--
-- TOC entry 1889 (class 2604 OID 16757)
-- Name: user_id; Type: DEFAULT; Schema: aquacandb; Owner: postgres
--

ALTER TABLE ONLY user_data ALTER COLUMN user_id SET DEFAULT nextval('user_data_user_id_seq'::regclass);


--
-- TOC entry 2004 (class 0 OID 16754)
-- Dependencies: 176
-- Data for Name: user_data; Type: TABLE DATA; Schema: aquacandb; Owner: postgres
--

COPY user_data (user_id, password, first_name, last_name, mail_id, profile_pic, dob, gender, address, latitude, longitude, contact_number) FROM stdin;
1	atishay                                                                                                                         	Atishay	Verma	atishayv@gmail.com	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 2014 (class 0 OID 0)
-- Dependencies: 175
-- Name: user_data_user_id_seq; Type: SEQUENCE SET; Schema: aquacandb; Owner: postgres
--

SELECT pg_catalog.setval('user_data_user_id_seq', 1, true);


--
-- TOC entry 1891 (class 2606 OID 16764)
-- Name: user_data_mail_id_key; Type: CONSTRAINT; Schema: aquacandb; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY user_data
    ADD CONSTRAINT user_data_mail_id_key UNIQUE (mail_id);


--
-- TOC entry 1893 (class 2606 OID 16762)
-- Name: user_data_pkey; Type: CONSTRAINT; Schema: aquacandb; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY user_data
    ADD CONSTRAINT user_data_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2009 (class 0 OID 0)
-- Dependencies: 7
-- Name: aquacandb; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA aquacandb FROM PUBLIC;
GRANT ALL ON SCHEMA aquacandb TO PUBLIC;


--
-- TOC entry 2010 (class 0 OID 0)
-- Dependencies: 176
-- Name: user_data; Type: ACL; Schema: aquacandb; Owner: postgres
--

REVOKE ALL ON TABLE user_data FROM PUBLIC;
GRANT ALL ON TABLE user_data TO PUBLIC;


--
-- TOC entry 2011 (class 0 OID 0)
-- Dependencies: 176
-- Name: user_data.user_id; Type: ACL; Schema: aquacandb; Owner: postgres
--

REVOKE ALL(user_id) ON TABLE user_data FROM PUBLIC;
REVOKE ALL(user_id) ON TABLE user_data FROM postgres;
GRANT ALL(user_id) ON TABLE user_data TO postgres;
GRANT ALL(user_id) ON TABLE user_data TO PUBLIC;


--
-- TOC entry 2013 (class 0 OID 0)
-- Dependencies: 175
-- Name: user_data_user_id_seq; Type: ACL; Schema: aquacandb; Owner: postgres
--

REVOKE ALL ON SEQUENCE user_data_user_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE user_data_user_id_seq FROM postgres;
GRANT ALL ON SEQUENCE user_data_user_id_seq TO postgres;
GRANT ALL ON SEQUENCE user_data_user_id_seq TO PUBLIC;


-- Completed on 2016-10-20 17:00:28

--
-- PostgreSQL database dump complete
--

