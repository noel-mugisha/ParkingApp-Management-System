"use client";
import React, { useState } from "react";
import { AppContext } from "./app-context";

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    isVerified: false,
    role: "",
    status: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
