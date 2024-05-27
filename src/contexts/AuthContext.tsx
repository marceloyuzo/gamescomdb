

import { ReactNode, useEffect, useState, createContext } from "react";
import { auth } from "../services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";


interface AuthProviderProps {
  children: ReactNode
}

interface UserProps {
  idUser: string,
  email: string | null,
  username: string | null
}

type AuthContextData = {
  signed: boolean,
  loadingAuth: boolean,
  user: UserProps | null
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null)
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          idUser: user.uid,
          username: user?.displayName,
          email: user?.email
        })

        setLoadingAuth(false)
      } else {
        setUser(null)
        setLoadingAuth(false)
      }
    })

    return () => {
      unsub()
    }
  }, [])


  return (
    <AuthContext.Provider value={{
      signed: !!user,
      loadingAuth,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider