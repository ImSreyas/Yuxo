create type "public"."stop_type" as enum ('bus_stand', 'bus_shelter', 'bus_stop', 'food_stop');

alter table "public"."tbl_bus_stops" drop constraint "tbl_bus_stops_stop_type_check";

alter table "public"."tbl_bus_stops" alter column "stop_type" set default 'bus_stop'::stop_type;

alter table "public"."tbl_bus_stops" alter column "stop_type" set data type stop_type using "stop_type"::stop_type;


