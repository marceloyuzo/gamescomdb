import { IoIosCloseCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react"
import { apiSteam } from "../../services/api"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useContext } from "react"
import { GamesPlayedContext } from "../../contexts/GamesPlayedContext";
import { GamePlayedProps } from "../../contexts/GamesPlayedContext";
import ModalFeedback from "../ModalFeedback";

interface GamesProps {
  idGame: number,
  name: string,
}

export interface GameProps {
  idGame: number,
  title: string,
  cover: string,
}

const schema = z.object({
  state: z.enum(["COMPLETE", "ON GOING"])
})

type FormActivity = z.infer<typeof schema>

const Modal = ({ enableModal, onClose }: { enableModal: boolean, onClose: () => void }) => {
  const { addNewGamePlayed } = useContext(GamesPlayedContext)
  const [enableFeedback, setEnableFeedback] = useState<boolean>(false)
  const [sucess, setSucess] = useState<boolean>(false)
  const [textFeedback, setTextFeedback] = useState<string>("")
  const [linkRef, setLinkRef] = useState<string>("")
  const [games, setGames] = useState<GamesProps[]>([])
  const [filteredGames, setFilteredGames] = useState<GamesProps[]>([])
  const [inputSearch, setInputSearch] = useState("")
  const [activeGame, setActiveGame] = useState<GameProps>()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm<FormActivity>({
    resolver: zodResolver(schema),
    mode: "onBlur"
  })

  useEffect(() => {
    getGames()

  }, [])

  useEffect(() => {
    if (enableModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [enableModal]);

  useEffect(() => {
    handleSearch()
  }, [inputSearch, games])

  async function getGames() {
    try {
      const response = await apiSteam.get("")
      let listGames = response.data.sortedGames

      setGames(listGames)
    }
    catch (error) {
      console.log(error)
    }
  }

  async function getGame(idGame: number) {
    try {
      setLoading(true)
      setActiveGame(undefined)
      const response = await apiSteam.get(`/game/${idGame}`)
      const jogo: GameProps = {
        idGame: response.data[idGame].data.steam_appid,
        title: response.data[idGame].data.name,
        cover: response.data[idGame].data.header_image,
      }

      setActiveGame(jogo)
      setLoading(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  function handleSearch() {
    if (!inputSearch) {
      setFilteredGames([])
      return
    }

    const filtered = games.filter((game) => game.name.toLowerCase().startsWith(inputSearch.trim().toLowerCase()))

    setFilteredGames(filtered.slice(0, 20))
    return
  }

  function handleActiveGame(idGame: number) {
    getGame(idGame)
  }

  async function handlePost(data: FormActivity) {
    if (!activeGame) {
      console.log("SELECIONE UM JOGO")
      return
    }

    let temp: GamePlayedProps = {
      idGame: activeGame.idGame,
      title: activeGame.title,
      cover: activeGame.cover,
      status: data.state,
      datePlayed: new Date()
    }

    const feedbackResultTemp = await addNewGamePlayed(temp)

    setEnableFeedback(true)
    setSucess(feedbackResultTemp.sucess)
    setTextFeedback(feedbackResultTemp.textFeedback)
    setLinkRef(feedbackResultTemp.linkRef)
  }

  if (!enableModal) return null

  return (
    <>

      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10"></div>
      <div className="text-main_color bg-bg_color rounded-lg w-full fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20 flex justify-center max-w-2xl p-6">
        <div className="relative flex flex-col items-center w-full">
          <div className="absolute right-0 -top-2" onClick={onClose}>
            <IoIosCloseCircleOutline size={28} className="text-main_color" />
          </div>
          <h1 className="text-2xl text-main_color mb-4">ADICIONAR JOGO</h1>

          <input
            className="w-full max-w-64 rounded-lg py-1 px-2 mb-10  outline-none select-none text-bg_color"
            type="text"
            placeholder="Procure o nome do jogo..."
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
          />

          <div className="w-full flex gap-4 justify-between">
            {filteredGames && (
              <ul className="h-72 w-1/2 border-1 rounded-lg overflow-auto">
                {filteredGames.map((game) => (
                  <li key={game.idGame} className="w-full p-2 border-y-1 overflow-hidden text-nowrap first-of-type:border-y-transparent first-of-type:rounded-tl-lg last-of-type:border-y-transparent last-of-type:rounded-bl-lg hover:bg-main_color hover:text-bg_color" onClick={() => handleActiveGame(game.idGame)}>{game.name}</li>
                ))}
              </ul>
            )}
            <div className="flex w-1/2 border-1 rounded-lg">
              {loading && (
                <div className="flex flex-col justify-center items-center w-full">
                  <h2>CARREGANDO</h2>
                </div>
              )}

              {activeGame && (
                <div className="flex flex-col justify-center items-center w-full px-2">
                  <img
                    className="rounded-lg"
                    src={activeGame.cover}
                    alt=""
                  />
                  <span className="mt-4 text-xl">{activeGame.title}</span>
                </div>
              )}
            </div>

          </div>

          <form
            className="w-full flex justify-between mt-10 text-bg_color"
            onSubmit={handleSubmit(handlePost)}
          >
            <select className="w-full max-w-48 px-2 py-1 outline-none select-none rounded-lg" defaultValue="default" {...register("state", { required: true })}>
              <option value="default" disabled>ESCOLHA UMA OPÇÃO</option>
              <option value="COMPLETE">COMPLETE</option>
              <option value="ON GOING">ON GOING</option>
            </select>
            <button
              className="w-full max-w-40 bg-secundary_color rounded-lg py-1 text-main_color font-medium "
            >PUBLICAR</button>
          </form>

          <ModalFeedback enableFeedback={enableFeedback} onClose={() => setEnableFeedback(false)} sucess={sucess} text={textFeedback} linkref={linkRef} />
        </div>
      </div >
    </>
  )
}

export default Modal