import type { ContainerRecord, ExtractionWarning } from "../../types";
import { createContext } from "react";

export const warnings = new Map<string, ExtractionWarning[]>();
export const warned = new Set<string>();

export const containerContext = createContext<ContainerRecord>({});
