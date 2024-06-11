import { useContext, useEffect, useState } from "react"
import { Container } from "../../../components/Container"
import { ProfileTitle } from "../../../components/ProfileTitle"
import { Link, useParams } from "react-router-dom"
import { GamesPlayedContext } from "../../../contexts/GamesPlayedContext"
import { MdDelete } from "react-icons/md"
import { AuthContext } from "../../../contexts/AuthContext"
import { GamePlayedProps } from "../../../contexts/GamesPlayedContext"
import ModalFeedback from "../../../components/ModalFeedback"

export function ListGames() {
  const [enableFeedback, setEnableFeedback] = useState<boolean>(false)
  const [sucess, setSucess] = useState<boolean>(false)
  const [textFeedback, setTextFeedback] = useState<string>("")
  const [linkRef, setLinkRef] = useState<string>("")
  const { myGamesPlayed, handleMoreLoad, limitLoad, loadListGamesPlayed, deleteGamePlayed } = useContext(GamesPlayedContext)
  const userAuth = useParams()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (userAuth.id) {
      loadListGamesPlayed(userAuth.id)
    }
  }, [limitLoad, userAuth])


  async function handleDelete(game: GamePlayedProps) {
    if (await deleteGamePlayed(game)) {
      setSucess(true)
      setTextFeedback("O jogo foi removido com sucesso.")
      setLinkRef(`/profile/${user?.idUser}/gamesplayed`)
      setEnableFeedback(true)
      return
    }

    setSucess(false)
    setTextFeedback("Ocorreu um erro ao remover o jogo. Tente novamente.")
    setLinkRef(`/profile/${user?.idUser}/gamesplayed`)
    setEnableFeedback(true)
    return
  }

  return (
    <>
      <Container>
        <div className="min-h-body mt-header w-full py-10">
          <ProfileTitle title="LISTA DE JOGOS" />

          {myGamesPlayed.length > 0 && (
            <div className="w-full grid grid-cols-2 gap-4 lg:grid-cols-4 md:grid-cols-3">
              {myGamesPlayed.map((game) => (
                <div className="relative" key={game.idGame}>
                  <Link to={`/game/${game.idGame}`} className="flex flex-col justify-center items-center gap-1">
                    <img
                      className="rounded-md"
                      src={game.cover}
                      alt={game.title}
                    />
                    <span className={`absolute right-1 top-1 bg-bg_color px-3 py-0.5 text-xs rounded-lg ${game.status === "COMPLETE" ? "text-green-600" : "text-orange-600"}`}>{game.status}</span>
                    <span className="text-lg text-main_color text-center">{game.title}</span>
                  </Link>
                  {userAuth.id === user?.idUser && (
                    <MdDelete
                      size={24}
                      className="bg-bg_color rounded-full p-1 absolute top-1 left-1 cursor-pointer text-secundary_color z-10"
                      onClick={() => handleDelete(game)}
                    />

                  )}
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
          {myGamesPlayed.length == 0 && (
            <div className="mt-header w-full">
              <h1 className="absolute right-1/2 top-1/2 transform translate-x-1/2 translate-y-1/2 text-4xl text-main_color ">NÃO POSSUI JOGOS LISTADOS</h1>
            </div>
          )}

          <ModalFeedback enableFeedback={enableFeedback} onClose={() => setEnableFeedback(false)} sucess={sucess} text={textFeedback} linkref={linkRef} />
        </div>

      </Container >
    </>
  )
}