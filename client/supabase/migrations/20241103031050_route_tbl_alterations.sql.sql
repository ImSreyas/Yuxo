alter table "public"."tbl_routes" alter column "route_name" set data type text using "route_name"::text;

CREATE UNIQUE INDEX tbl_bus_stops_stop_name_key ON public.tbl_bus_stops USING btree (stop_name);

CREATE UNIQUE INDEX unique_operator_route_name ON public.tbl_routes USING btree (operator_id, route_name);

alter table "public"."tbl_bus_stops" add constraint "tbl_bus_stops_stop_name_key" UNIQUE using index "tbl_bus_stops_stop_name_key";

alter table "public"."tbl_routes" add constraint "unique_operator_route_name" UNIQUE using index "unique_operator_route_name";


