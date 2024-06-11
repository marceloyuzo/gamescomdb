

import { useEffect, useState } from "react"
import { Container } from "../../../components/Container"
import { ProfileTitle } from "../../../components/ProfileTitle"
import { useParams } from "react-router-dom"
import { GamesFavoritesProps } from "./new"
import { db } from "../../../services/firebaseConnection"
import { collection, getDocs, limit, query } from "firebase/firestore"

export function Favorites() {
  const userAuth = useParams()
  const [favoriteGames, setFavoriteGames] = useState<GamesFavoritesProps[]>([])
  const [limitLoad, setLimitLoad] = useState<number>(12)

  useEffect(() => {
    if (userAuth.id) {
      loadFavoritesGames()
    }
  }, [limitLoad, userAuth])


  async function loadFavoritesGames() {
    const favoriteRef = collection(db, "users", `${userAuth.id}`, "favorites")
    const limitedRef = query(favoriteRef, limit(limitLoad))
    const snapshot = await getDocs(limitedRef)
    let listFavoritesGames = [] as GamesFavoritesProps[]

    if (snapshot.empty) {
      return
    }
    snapshot.forEach((doc) => {

      listFavoritesGames.push({
        idGame: doc.data().idGame,
        title: doc.data().title,
        cover: doc.data().cover,
        status: doc.data().status,
        datePlayed: doc.data().datePlayed,
        idRegister: doc.id
      })

      setFavoriteGames(listFavoritesGames)
    })
  }

  function handleMoreLoad() {
    setLimitLoad(limitLoad + 12)
  }

  return (
    <>
      <Container>
        <div className="min-h-body mt-header w-full py-10">
          <ProfileTitle title="JOGOS FAVORITOS" />

          {favoriteGames.length > 0 && (
            <div className="w-full grid grid-cols-2 gap-4 lg:grid-cols-4 md:grid-cols-3">
              {favoriteGames.map((game) => (
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
          {(favoriteGames.length === limitLoad) && (
            <div className="flex justify-center items-center w-full mt-4">
              <button
                className="w-full bg-main_color text-bg_color font-semibold py-2 rounded-lg max-w-44"
                onClick={() => handleMoreLoad()}
              >CARREGAR MAIS</button>
            </div>
          )}
          {favoriteGames.length == 0 && (
            <div className="mt-header w-full">
              <h1 className="absolute right-1/2 top-1/2 transform translate-x-1/2 translate-y-1/2 text-4xl text-main_color ">NÃO POSSUI JOGOS FAVORITOS</h1>
            </div>
          )}
        </div>

      </Container>
    </>
  )
}