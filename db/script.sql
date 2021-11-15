CREATE TABLE public.users (
	id uuid unique not null, 
	first_name varchar(100),
	middle_name varchar(100),
	last_name varchar(100),
	email varchar(100) unique,
	avatar varchar(225),
	school varchar(100),
	street_address varchar(100),
	city varchar(100),
	state varchar(100),
	country varchar(100),
	zip_code varchar(100),
	courses varchar(100) array,
	phone int8,
	role varchar(100) default false,
	password varchar(100) default true ,
	is_active bool default truw, 
	created_at timestamptz default now(),
	updated_at timestamptz,
	department_id uuid,
	major_id uuid
);

CREATE TABLE public.courses (
	id uuid unique not null, 
	name varchar(100),
	subject varchar(225),
	description varchar(225),
	start_time varchar(225),
	end_time varchar(100),
	start_date varchar(100),
	end_date varchar(100),
	teachers uuid[],
	registered integer default 0,
	course_limit integer default 60,
	price integer default 0,
	days text[],
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz,
	major_id uuid not null

);

CREATE TABLE public.courseregistrations (
	id uuid unique not null, 
	course_id uuid,
	user_id uuid,
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz
);

CREATE TABLE public.departments (
	id uuid unique not null, 
	name varchar(100),
	code varchar(100),
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz,
	created_by uuid 
);

CREATE TABLE public.majors (
	id uuid unique not null, 
	major_name varchar(100),
	major_code varchar(100),
	department_id uuid,
	maj_min_units integer, 
	maj_units integer, 
	created_at timestamptz default now(),
	updated_at timestamptz,
);


create table grades
(
    id uuid not null constraint grades_id_key unique,
    course_id  uuid,
    user_id    uuid,
    grades     varchar                  default '-'::character varying,
    is_active  boolean                  default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone,
    createdby  uuid,
    comments   varchar
);