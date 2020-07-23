import React, { createContext, useState } from "react";

export const UserContext = createContext({
  user: undefined,
  currentUser: () => {}
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  const currentUser = user => setUser(user);

  return (
    <UserContext.Provider value={{ user, currentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
