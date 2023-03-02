import React, { createContext, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { axiosClient } from "../../helpers/axios";
import { Buffer } from "buffer";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      user.getIdToken(true).then(function (token) {
        axiosClient.post("login", { token }).then((idTokenReturn) => {
          try {
            const payloadJson = Buffer.from(
              idTokenReturn.data.data.split(".")[1],
              "base64"
            ).toString("ascii");
            const payloadObj = JSON.parse(payloadJson);
            localStorage.setItem("user", JSON.stringify(payloadObj));
            setUser(payloadObj);
          } catch (error) {
            console.log(error);
          }
        });
      });
    });
  };

  const logOut = () => {
    signOut(auth);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (user === null) {
      googleSignIn();
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    const userStorage = localStorage.getItem("user");
    console.log("user storage: ", userStorage);
    if (userStorage) {
      setUser(JSON.parse(userStorage));
    }
  }, []);

  const value = { user, googleSignIn, logOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const UseAuth = () => {
  return useContext(AuthContext);
};
