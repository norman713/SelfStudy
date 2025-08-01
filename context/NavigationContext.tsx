import { Href, router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

interface NavigationContextProps {
  sideNavPath: string;
  bottomNavPath: string;
  setSidePath: (value: string) => void;
  setBottomPath: (value: string) => void;
  onChangeSidePath: (oldValue: string, newValue: string) => void;
  onChangeBottomPath: (oldValue: string, newValue: string) => void;
}

const defaultValue: NavigationContextProps = {
  sideNavPath: "Plan",
  bottomNavPath: "Me",
  setSidePath: () => {},
  setBottomPath: () => {},
  onChangeSidePath: () => {},
  onChangeBottomPath: () => {},
};

const NavigationContext = createContext<NavigationContextProps>(defaultValue);

export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sideNavPath, setSideNavPath] = useState<string>("Plan");
  const [bottomNavPath, setBottomNavPath] = useState<string>("Me");

  const setSidePath = (value: string) => setSideNavPath(value);
  const setBottomPath = (value: string) => setBottomNavPath(value);

  const onChangeSidePath = (oldValue: string, newValue: string) => {
    if (oldValue === newValue) return;
    setSideNavPath(newValue);
    const path = `/${bottomNavPath}/${newValue}`;
    router.push(path as Href);
  };

  const onChangeBottomPath = (oldValue: string, newValue: string) => {
    // 1) nếu bấm lại vào Team khi đang ở Team, dùng logic cũ để đi vào /Team/sideNavPath
    if (oldValue === newValue) {
      if (newValue === "Team") {
        const path = `/${newValue}/${sideNavPath}`;
        router.push(path as Href);
      }
      return;
    }

    // 2) cập nhật state
    setBottomNavPath(newValue);

    // 3) nếu chuyển từ khác sang Team, chỉ route thẳng tới /Team
    if (newValue === "Team") {
      router.push("/Team/Main");
      return;
    }

    // 4) logic cũ cho các trường hợp khác
    const path =
      newValue === "Notification" || newValue === "MissedDeadline"
        ? `/${newValue}`
        : `/${newValue}/${sideNavPath}`;

    if (path === "/Me/Management") {
      router.push("/Me/Plan");
    } else {
      router.push(path as Href);
    }
  };

  const value = {
    sideNavPath,
    bottomNavPath,
    setSidePath,
    setBottomPath,
    onChangeSidePath,
    onChangeBottomPath,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
