import { useContext, useEffect } from "react"
import { Container } from "../../../components/Container"
import { ProfileTitle } from "../../../components/ProfileTitle"
import { Link, useParams } from "react-router-dom"
import { GamesPlayedContext } from "../../../contexts/GamesPlayedContext"
import { MdDelete } from "react-icons/md"
import { AuthContext } from "../../../contexts/AuthContext"

export function ListGames() {
  const { myGamesPlayed, handleMoreLoad, limitLoad, loadListGamesPlayed, deleteGamePlayed } = useContext(GamesPlayedContext)
  const userAuth = useParams()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (userAuth.id) {
      loadListGamesPlayed(userAuth.id)
    }
  }, [limitLoad, userAuth])


  return (
    <>
      <Container>
        <div className="mt-header w-full py-10">
          <ProfileTitle title="LISTA DE JOGOS" />

          {myGamesPlayed.length > 0 && (
            <div className="w-full grid grid-cols-2 gap-4 lg:grid-cols-4 md:grid-cols-3">
              {myGamesPlayed.map((game) => (
                <Link to={`/game/${game.idGame}`}>
                  <div className="relative flex flex-col justify-center items-center gap-1" key={game.idGame}>
                    <img
                      className="rounded-md"
                      src={game.cover}
                      alt={game.title}
                    />
                    <span className={`absolute right-1 top-1 bg-bg_color px-3 py-0.5 text-xs rounded-lg ${game.status === "COMPLETE" ? "text-green-600" : "text-orange-600"}`}>{game.status}</span>
                    {userAuth.id === user?.idUser && (
                      <MdDelete
                        size={24}
                        className="bg-bg_color rounded-full p-1 absolute top-1 left-1 cursor-pointer text-secundary_color"
                        onClick={() => deleteGamePlayed(game)}
                      />

                    )}
                    <span className="text-lg text-main_color">{game.title}</span>
                  </div>
                </Link>
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
          {myGamesPlayed.length == 0 && (
            <div className="mt-header w-full">
              <h1 className="fixed right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-4xl text-main_color ">NÃO POSSUI JOGOS LISTADOS</h1>
            </div>
          )}
        </div>

      </Container >
    </>
  )
}