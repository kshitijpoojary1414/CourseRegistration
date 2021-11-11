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
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz
);

CREATE TABLE public.courses (
	id serial4 unique not null, 
	name varchar(100),
	subject varchar(225),
	description varchar(225),
	start_time varchar(225),
	end_time varchar(100),
	start_date varchar(100),
	end_date varchar(100),
	teachers text[],
	registered integer default 0,
	course_limit integer default 60,
	price integer default 0,
	days text[],
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz

);

CREATE TABLE public.courseregistrations (
	id uuid unique not null, 
	course_id uuid,
	user_id uuid,
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz

);