import { AdminBusFormSchema, BusFormSchema } from "@/schema/form";
import { z } from "zod";

export type BusForm = z.infer<typeof BusFormSchema>
export type AdminBusForm = z.infer<typeof AdminBusFormSchema>