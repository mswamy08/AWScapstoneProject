import { createContext, useContext, useState } from "react";
import type { Finding } from "@/types/Finding";

interface FindingsContextType {
  findings: Finding[];
  setFindings: (f: Finding[]) => void;
}

const FindingsContext = createContext<FindingsContextType | undefined>(undefined);

export const FindingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [findings, setFindings] = useState<Finding[]>([]);

  return (
    <FindingsContext.Provider value={{ findings, setFindings }}>
      {children}
    </FindingsContext.Provider>
  );
};

export const useFindings = () => {
  const ctx = useContext(FindingsContext);
  if (!ctx) throw new Error("useFindings must be used inside FindingsProvider");
  return ctx;
};
