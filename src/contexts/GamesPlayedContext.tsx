import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { db } from "../services/firebaseConnection";
import { AuthContext } from "./AuthContext";

export interface GamePlayedProps {
  idGame: number,
  title: string,
  cover: string,
  status: string
  datePlayed: Date
}

type GamesPlayedContextData = {
  myGamesPlayed: GamePlayedProps[],
  limitLoad: number,
  loadListGamesPlayed: (idUser: string) => void,
  addNewGamePlayed: (newGame: GamePlayedProps) => void,
  handleMoreLoad: () => void
  deleteGamePlayed: (game: GamePlayedProps) => void
  //remGamePlayed: (game: GamePlayedProps) => void
}

interface GamesPlayedProviderProps {
  children: ReactNode
}

export const GamesPlayedContext = createContext({} as GamesPlayedContextData)

function GamesPlayedProvider({ children }: GamesPlayedProviderProps) {
  const [myGamesPlayed, setMyGamesPlayed] = useState<GamePlayedProps[]>([])
  const [limitLoad, setLimitLoad] = useState<number>(12)
  const { user } = useContext(AuthContext)

  async function loadListGamesPlayed(idUser: string) {
    const usersRef = collection(db, "users", idUser, "gamesPlayed")
    const orderRef = query(usersRef, orderBy("datePlayed"))
    const limitedRef = query(orderRef, limit(limitLoad))

    await getDocs(limitedRef)
      .then((snapshot) => {
        let listGamesPlayed = [] as GamePlayedProps[]
        console.log("Número de documentos recuperados:", snapshot.size);

        snapshot.forEach(doc => {
          listGamesPlayed.push({
            idGame: doc.data().idGame,
            title: doc.data().title,
            cover: doc.data().cover,
            status: doc.data().status,
            datePlayed: doc.data().datePlayed
          })
        })
        setMyGamesPlayed(listGamesPlayed)
      })
  }

  async function deleteGamePlayed(game: GamePlayedProps) {
    const gamesRef = collection(db, "users", `${user?.idUser}`, "gamesPlayed")
    const queryRef = query(gamesRef, where("idGame", "==", game.idGame))


    const snapshot = await getDocs(queryRef)
    snapshot.forEach((snap) => {
      let deleteRef = doc(db, "users", `${user?.idUser}`, "gamesPlayed", snap.id)

      deleteDoc(deleteRef)
        .then(() => {
          console.log("jogo deletado")
          window.location.reload()
        })
    })

  }

  function searchGame(game: GamePlayedProps): boolean {
    return myGamesPlayed.some(gp => gp.idGame === game.idGame)
  }

  async function addNewGamePlayed(newGame: GamePlayedProps) {
    const ref = doc(db, "users", `${user?.idUser}`)
    const gameInList = await searchGame(newGame)

    if (gameInList) {
      console.log("O jogo já está em sua lista de jogos jogados.")
      return
    }

    addDoc(collection(ref, "gamesPlayed"), {
      idGame: newGame.idGame,
      title: newGame.title,
      cover: newGame.cover,
      status: newGame.status,
      datePlayed: new Date()
    })
      .then(() => {
        console.log("ATIVIDADE CADASTRADA COM SUCESSO!")
        window.location.reload();
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function handleMoreLoad() {
    setLimitLoad(limitLoad + 12)
  }

  return (
    <GamesPlayedContext.Provider
      value={{
        myGamesPlayed,
        limitLoad,
        addNewGamePlayed,
        handleMoreLoad,
        loadListGamesPlayed,
        deleteGamePlayed
      }}
    >
      {children}
    </GamesPlayedContext.Provider>
  )
}

export default GamesPlayedProvider

