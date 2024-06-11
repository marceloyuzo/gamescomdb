import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ReactNode, createContext, useContext, useState } from "react";
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
  addNewGamePlayed: (newGame: GamePlayedProps) => Promise<FeedbackResult>,
  handleMoreLoad: () => void
  deleteGamePlayed: (game: GamePlayedProps) => Promise<boolean>
}

interface GamesPlayedProviderProps {
  children: ReactNode
}

interface FeedbackResult {
  sucess: boolean,
  textFeedback: string,
  linkRef: string
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

  async function deleteGamePlayed(game: GamePlayedProps): Promise<boolean> {
    const gamesRef = collection(db, "users", `${user?.idUser}`, "gamesPlayed")
    const queryRef = query(gamesRef, where("idGame", "==", game.idGame))

    try {
      const snapshot = await getDocs(queryRef)
      const deletePromises = snapshot.docs.map(async (snap) => {
        const deleteRef = doc(db, "users", `${user?.idUser}`, "gamesPlayed", snap.id)
        await deleteDoc(deleteRef)
      })

      await Promise.all(deletePromises)
      return true
    } catch {
      return false
    }
  }

  async function searchGame(game: GamePlayedProps): Promise<boolean> {
    const gamesRef = collection(db, "users", `${user?.idUser}`, "gamesPlayed")
    const queryRef = query(gamesRef, where("idGame", "==", game.idGame))

    const snapshot = await getDocs(queryRef)
    return !snapshot.empty
  }

  async function addNewGamePlayed(newGame: GamePlayedProps): Promise<FeedbackResult> {
    const ref = doc(db, "users", `${user?.idUser}`)
    const gameInList = await searchGame(newGame)

    if (gameInList) {
      const feedbackResultTemp: FeedbackResult = {
        sucess: false,
        textFeedback: "O jogo já está em sua lista.",
        linkRef: `/profile/${user?.idUser}`
      }

      console.log("REPETIDO")
      return feedbackResultTemp
    }

    try {
      await addDoc(collection(ref, "gamesPlayed"), {
        idGame: newGame.idGame,
        title: newGame.title,
        cover: newGame.cover,
        status: newGame.status,
        datePlayed: new Date()
      })

      const feedbackResultTemp: FeedbackResult = {
        sucess: true,
        textFeedback: "Jogo cadastrado com sucesso.",
        linkRef: `/profile/${user?.idUser}`
      }

      return feedbackResultTemp
    } catch (error) {
      const feedbackResultTemp: FeedbackResult = {
        sucess: false,
        textFeedback: "Ocorreu um erro ao cadastrar o jogo.",
        linkRef: `/profile/${user?.idUser}`
      }

      return feedbackResultTemp
    }
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

