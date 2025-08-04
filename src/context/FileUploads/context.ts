import { createContext } from "react";
import type { FilesUploadsContext } from ".";

export const Context = createContext<FilesUploadsContext | undefined>(undefined);