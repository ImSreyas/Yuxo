import { BusFormSchema } from "@/schema/form";
import { z } from "zod";

export type BusForm = z.infer<typeof BusFormSchema>