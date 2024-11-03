set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_route(operator_id uuid, route_name text, route_geometry geometry, status boolean, stops integer[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_route_id INT; -- Variable to hold the route_id of the newly inserted route
    i INT; -- Position counter for stops
BEGIN
    -- Insert into tbl_routes and capture the new route_id
    INSERT INTO public.tbl_routes (operator_id, route_name, route_geometry, status)
    VALUES (operator_id, route_name, route_geometry, status)
    RETURNING route_id INTO new_route_id;

    -- Loop through each stop_id in stops array and insert into tbl_route_stops
    FOR i IN 1 .. array_length(stops, 1) LOOP
        INSERT INTO public.tbl_route_stops (route_id, stop_id, position, fare)
        VALUES (
            new_route_id,
            stops[i],       -- Stop ID from array
            i,              -- Position based on array order
            0.0             -- Default fare; can be set to another value or parameter
        );
    END LOOP;

END;
$function$
;


