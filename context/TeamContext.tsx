import React, { createContext, useState, useContext, ReactNode } from "react";
interface TeamContextProps {
  role: string;
  setRole: (value: string) => void;
  getRole: () => string;
  id: string;
  setId: (value: string) => void;
  getId: () => string;
}

interface TeamProviderProps {
  children: ReactNode;
}

// Tạo context với giá trị mặc định
const TeamContext = createContext<TeamContextProps | undefined>(undefined);

// Provider cho phép các component con sử dụng context
export const TeamProvider = ({ children }: TeamProviderProps) => {
  const [role, setRole] = useState<string>(""); // Khởi tạo state role
  const [id, setId] = useState<string>(""); // Khởi tạo state id

  const getRole = () => role;
  const getId = () => id;

  return (
    <TeamContext.Provider value={{ role, setRole, getRole, id, setId, getId }}>
      {children}
    </TeamContext.Provider>
  );
};

// Hook sử dụng context
export const useTeamContext = (): TeamContextProps => {
  const context = useContext(TeamContext);

  if (!context) {
    throw new Error("useTeamContext must be used within a TeamProvider");
  }

  return context;
};
