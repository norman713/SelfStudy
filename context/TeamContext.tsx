import React, { createContext, useState, useContext, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho TeamContext
interface TeamContextProps {
  role: string;
  setRole: (value: string) => void;
  getRole: () => string;
}

// Định nghĩa kiểu dữ liệu cho props của TeamProvider, bao gồm cả children
interface TeamProviderProps {
  children: ReactNode;
}

// Tạo context với giá trị mặc định
const TeamContext = createContext<TeamContextProps | undefined>(undefined);

// Provider cho phép các component con sử dụng context
export const TeamProvider = ({ children }: TeamProviderProps) => {
  const [role, setRole] = useState<string>(""); // Khởi tạo state role

  // Hàm lấy giá trị role
  const getRole = () => role;

  return (
    <TeamContext.Provider value={{ role, setRole, getRole }}>
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
