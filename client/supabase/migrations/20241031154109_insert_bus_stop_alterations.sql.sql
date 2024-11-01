alter table "public"."tbl_bus_stops" add column "operator_id" uuid not null;

alter table "public"."tbl_bus_stops" alter column "stop_name" set data type text using "stop_name"::text;

alter table "public"."tbl_bus_stops" add constraint "tbl_bus_stops_operator_id_fkey" FOREIGN KEY (operator_id) REFERENCES tbl_operators(operator_id) not valid;

alter table "public"."tbl_bus_stops" validate constraint "tbl_bus_stops_operator_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_bus_stop(p_stop_name text, p_lon double precision, p_lat double precision, p_stop_type stop_type, p_operator_id uuid)
 RETURNS TABLE(inserted_id integer, inserted_stop_name text, inserted_location geometry, inserted_status boolean, inserted_stop_type stop_type, inserted_operator_id uuid)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    INSERT INTO tbl_bus_stops (stop_name, location, status, stop_type, operator_id)
    VALUES (
        p_stop_name,
        ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geometry, -- geometry type cast
        TRUE, -- status set to true
        p_stop_type,
        p_operator_id
    )
    RETURNING 
        stop_id AS inserted_id, 
        stop_name AS inserted_stop_name, 
        location AS inserted_location, 
        status AS inserted_status, 
        stop_type AS inserted_stop_type, 
        operator_id AS inserted_operator_id;
END;
$function$
;


