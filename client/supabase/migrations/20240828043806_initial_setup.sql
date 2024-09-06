-- Table to store admins
CREATE TABLE IF NOT EXISTS public.tbl_admins (
    admin_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL
);

-- Table to store users
CREATE TABLE IF NOT EXISTS public.tbl_users (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL
);

-- Table to store operators
CREATE TABLE IF NOT EXISTS public.tbl_operators (
    operator_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    place VARCHAR NOT NULL,
    permit_no VARCHAR NOT NULL,
    is_ksrtc_operator BOOLEAN DEFAULT FALSE
);

-- Table to store bus types
CREATE TABLE IF NOT EXISTS public.tbl_bus_types (
    bus_type_id SERIAL PRIMARY KEY,
    type VARCHAR NOT NULL,
    for_ksrtc BOOLEAN
);

-- Table to store bus details
CREATE TABLE IF NOT EXISTS public.tbl_buses (
    bus_id SERIAL PRIMARY KEY,
    bus_number VARCHAR NOT NULL,
    bus_name VARCHAR, -- Name of the bus for private buses
    bus_type_id INT REFERENCES public.tbl_bus_types(bus_type_id),
    registration_number VARCHAR NOT NULL, -- Bus registration number (number plate)
    operator_id uuid REFERENCES public.tbl_operators(operator_id), 
    is_ksrtc BOOLEAN NOT NULL,
    bus_color VARCHAR,
    bus_capacity INT
);

-- Table to store route details
CREATE TABLE IF NOT EXISTS public.tbl_routes (
    route_id SERIAL PRIMARY KEY,
    operator_id uuid REFERENCES public.tbl_operators(operator_id), 
    route_name VARCHAR NOT NULL,
    route_geometry GEOMETRY(LINESTRING, 4326), -- PostGIS type to store the route as a geographic line
    status BOOLEAN DEFAULT TRUE -- Indicates if the route is active or inactive
);

-- Table to store bus stops
CREATE TABLE IF NOT EXISTS public.tbl_bus_stops (
    stop_id SERIAL PRIMARY KEY,
    stop_name VARCHAR NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL,
    status BOOLEAN DEFAULT TRUE, -- Indicates if the stop is active or inactive
    stop_type VARCHAR CHECK (stop_type IN ('bus_stand', 'bus_shelter', 'bus_stop')) DEFAULT 'bus_stop' -- Corrected ENUM to VARCHAR with CHECK constraint
);

-- Table to store stops in a route
CREATE TABLE IF NOT EXISTS public.tbl_route_stops (
    route_stop_id SERIAL PRIMARY KEY,
    route_id INT REFERENCES public.tbl_routes(route_id),
    stop_id INT REFERENCES public.tbl_bus_stops(stop_id),
    position INT NOT NULL,
    fare DECIMAL NOT NULL
);

-- Table to store schedules
CREATE TABLE IF NOT EXISTS public.tbl_schedules (
    schedule_id SERIAL PRIMARY KEY,
    bus_id INT REFERENCES public.tbl_buses(bus_id),
    route_id INT REFERENCES public.tbl_routes(route_id),
    operator_id uuid REFERENCES public.tbl_operators(operator_id), 
    departure_time TIMESTAMP NOT NULL,
    running_days TEXT[] NOT NULL, -- Array of day names (e.g., '{Monday,Tuesday}')
    status BOOLEAN NOT NULL, -- Scheduled service is running or not
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store schedule stops
CREATE TABLE IF NOT EXISTS public.tbl_schedule_stops (
    schedule_stop_id SERIAL PRIMARY KEY,
    schedule_id INT REFERENCES public.tbl_schedules(schedule_id),
    route_stop_id INT REFERENCES public.tbl_route_stops(route_stop_id),
    arrival_time TIMESTAMP NOT NULL
);

-- Table to store ticket fare details
CREATE TABLE IF NOT EXISTS public.tbl_ticket_charge (
    fare_id SERIAL PRIMARY KEY,
    from_route_stop_id INT REFERENCES public.tbl_route_stops(route_stop_id),
    to_route_stop_id INT REFERENCES public.tbl_route_stops(route_stop_id),
    amount DECIMAL NOT NULL,
    concession_amount DECIMAL,
    half_ticket_amount DECIMAL
);

-- Table to store auto stand locations
CREATE TABLE IF NOT EXISTS public.tbl_auto_stands (
    stand_id SERIAL PRIMARY KEY,
    stand_name VARCHAR NOT NULL,
    stand_location GEOMETRY(POINT, 4326) NOT NULL, -- PostGIS type for storing location
    no_of_markings INT
);

-- Table to store user markings of auto stands
CREATE TABLE IF NOT EXISTS public.tbl_user_auto_stand_markings (
    marking_id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES public.tbl_users(user_id), 
    marking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comments VARCHAR,
    stand_location GEOMETRY(Point, 4326) NOT NULL -- PostGIS type for storing location
);

-- Table to store user schedule updates
CREATE TABLE IF NOT EXISTS public.tbl_user_schedule_updates (
    update_id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES public.tbl_users(user_id), 
    schedule_stop_id INT REFERENCES public.tbl_schedule_stops(schedule_stop_id),
    new_arrival_time TIMESTAMP NOT NULL,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comments VARCHAR
);

-- Table to store user reviews of buses
CREATE TABLE IF NOT EXISTS public.tbl_user_reviews (
    review_id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES public.tbl_users(user_id), 
    bus_id INT REFERENCES public.tbl_buses(bus_id),
    review_text TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5), -- Rating given by the user (e.g., 1-5 stars)
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store bus halts
CREATE TABLE IF NOT EXISTS public.tbl_bus_halts (
    halt_id SERIAL PRIMARY KEY,
    schedule_stop_id INT REFERENCES public.tbl_schedule_stops(schedule_stop_id),
    new_start_time TIMESTAMP NOT NULL,
    halt_duration INTERVAL NOT NULL,
    halt_days TEXT[] -- Array of day names (e.g., '{Monday,Tuesday}')
);

-- Table to store user reports
CREATE TABLE IF NOT EXISTS public.tbl_reports (
    report_id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES public.tbl_users(user_id), 
    comment TEXT,
    reported_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
