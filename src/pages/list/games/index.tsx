import { useContext, useEffect, useState } from "react"
import { Container } from "../../../components/Container"
import { ProfileTitle } from "../../../components/ProfileTitle"
import { collection, getDocs, limit, query } from "firebase/firestore"
import { db } from "../../../services/firebaseConnection"
import { useParams } from "react-router-dom"
import { GamesPlayedContext } from "../../../contexts/GamesPlayedContext"

interface GamePlayedProps {
  idGame: number,
  title: string,
  cover: string,
  status: string
}

export function ListGames() {
  const { myGamesPlayed, handleMoreLoad, limitLoad, loadListGamesPlayed } = useContext(GamesPlayedContext)
  const userAuth = useParams()

  useEffect(() => {
    if (userAuth.id) {
      loadListGamesPlayed(userAuth.id)
    }
  }, [limitLoad, userAuth])

  // useEffect(() => {
  //    loadListGamesPlayed()

  // }, [limitLoad])

  // async function loadListGamesPlayed() {
  //   const usersRef = collection(db, "users", `${user.id}`, "activities")
  //   const limitedRef = query(usersRef, limit(limitLoad))

  //   await getDocs(limitedRef)
  //     .then((snapshot) => {
  //       let listGamesPlayed = [] as GamePlayedProps[]
  //       console.log("Número de documentos recuperados:", snapshot.size);

  //       snapshot.forEach(doc => {
  //         listGamesPlayed.push({
  //           idGame: doc.data().idGame,
  //           title: doc.data().title,
  //           cover: doc.data().image,
  //           status: doc.data().status
  //         })
  //       })
  //       setGamesPlayed(listGamesPlayed)
  //     })
  //     .catch((error) => console.log(error))
  // }


  return (
    <>
      <Container>
        <div className="mt-header w-full py-10">
          <ProfileTitle title="LISTA DE JOGOS" />

          {myGamesPlayed.length > 0 && (
            <div className="w-full grid grid-cols-2 gap-4 lg:grid-cols-4 md:grid-cols-3">
              {myGamesPlayed.map((game) => (
                <div className="relative flex flex-col justify-center items-center gap-1" key={game.idGame}>
                  <img
                    className="rounded-md"
                    src={game.cover}
                    alt={game.title}
                  />
                  <span className={`absolute right-1 top-1 bg-bg_color px-3 py-0.5 text-xs rounded-lg ${game.status === "COMPLETE" ? "text-green-600" : "text-orange-600"}`}>{game.status}</span>
                  <span className="text-lg text-main_color">{game.title}</span>
                </div>
              ))}

            </div>
          )}
          {(myGamesPlayed.length === limitLoad) && (
            <div className="flex justify-center items-center w-full mt-4">
              <button
                className="w-full bg-main_color text-bg_color font-semibold py-2 rounded-lg max-w-44"
                onClick={() => handleMoreLoad()}
              >CARREGAR MAIS</button>
            </div>
          )}
        </div>

      </Container>
    </>
  )
}