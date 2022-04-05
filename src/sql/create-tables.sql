CREATE TABLE 
	IF NOT EXISTS
		users(
			user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			
			first_name VARCHAR (50) NOT NULL,
            last_name VARCHAR (50) NOT NULL,
            pwd VARCHAR (255) NOT NULL,
            gender varchar,
            email VARCHAR (255) NOT NULL,
			avatar TEXT,
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW()
	);



	--  CREATE TABLE 
	-- IF NOT EXISTS
	-- 	blogs(
	-- 		blog_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	-- 		title VARCHAR(255) NOT NULL,
	-- 		category VARCHAR (50) NOT NULL,
	-- 		content TEXT NOT NULL,
	-- 		author_id INTEGER REFERENCES authors ON DELETE CASCADE,
	-- 		read_time_unit VARCHAR(10) NOT NULL,
	-- 		read_time_value INTEGER NOT NULL,
	-- 		created_at TIMESTAMPTZ DEFAULT NOW(),
	-- 		updated_at TIMESTAMPTZ DEFAULT NOW()
	-- );