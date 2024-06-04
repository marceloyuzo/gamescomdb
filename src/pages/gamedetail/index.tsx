import { useParams } from "react-router-dom"
import { Container } from "../../components/Container"
import { apiSteam } from "../../services/api"
import { useEffect, useState } from "react"

interface GameDetailProps {
  idGame: string,
  title: string,
  cover: string,
  release: string,
  publishers: string[],
  developers: string[],
  genres: GenreProps[],
  categories: CategoryProps[],
  shortDescription: string,
  price: string | null,
  isFree: boolean,
  about: string
}


interface GenreProps {
  idGenre: string,
  description: string,
}

interface CategoryProps {
  idCategory: string,
  description: string,
}

export function GameDetail() {
  const idGame = useParams()
  const [gameInfo, setGameInfo] = useState<GameDetailProps>()

  useEffect(() => {
    if (idGame.id) {
      getGame(Number(idGame.id))
    }
  }, [idGame])

  async function getGame(idGame: number) {

    try {
      const response = await apiSteam.get(`/game/${idGame}`)

      if (response.data[idGame].data.is_free) {
        const jogo: GameDetailProps = {
          idGame: response.data[idGame].data.steam_appid,
          title: response.data[idGame].data.name,
          cover: response.data[idGame].data.header_image,
          release: response.data[idGame].data.release_date.date,
          publishers: response.data[idGame].data.publishers,
          developers: response.data[idGame].data.developers,
          genres: response.data[idGame].data.genres,
          categories: response.data[idGame].data.categories,
          shortDescription: response.data[idGame].data.short_description,
          isFree: response.data[idGame].data.is_free,
          price: null,
          about: response.data[idGame].data.about_the_game
        }

        setGameInfo(jogo)
        return
      }

      const jogo: GameDetailProps = {
        idGame: response.data[idGame].data.steam_appid,
        title: response.data[idGame].data.name,
        cover: response.data[idGame].data.header_image,
        release: response.data[idGame].data.release_date.date,
        publishers: response.data[idGame].data.publishers,
        developers: response.data[idGame].data.developers,
        genres: response.data[idGame].data.genres,
        categories: response.data[idGame].data.categories,
        shortDescription: response.data[idGame].data.short_description,
        isFree: response.data[idGame].data.is_free,
        price: response.data[idGame].data.price_overview.final_formatted,
        about: response.data[idGame].data.about_the_game
      }
      setGameInfo(jogo)
      return


    }
    catch (error) {
      console.log(error)
      return null
    }
  }

  return (
    <Container>
      {gameInfo && (
        <main className="mt-header w-full py-16">
          <div className="relative w-full border-1 flex items-center py-8 rounded-lg mb-6 px-4">
            <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2">
              <h2 className="text-xl text-main_color">{gameInfo.title}</h2>
            </div>
          </div>
          <div className="flex ">
            <div className="w-1/2 p-4 ">
              <img
                className="w-full rounded-lg"
                src={gameInfo.cover}
                alt={gameInfo.title}
              />
              <div className="flex flex-col w-full text-lg text-main_color gap-2 mt-2">
                <span className="text-secundary_color">Data de Lançamento: <span className="rounded-lg border-1 text-main_color text-base px-2">{gameInfo.release}</span></span>

                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-secundary_color">Editora: </span>
                  {gameInfo.publishers.map((publisher) => (
                    <span key={publisher} className="rounded-lg border-1 text-main_color text-base px-2">{publisher} </span>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-secundary_color">Desenvolvedora: </span>
                  {gameInfo.developers.map((developer) => (
                    <span key={developer} className="rounded-lg border-1 text-main_color text-base px-2">{developer} </span>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-secundary_color">Gêneros: </span>
                  {gameInfo.genres.map((genre) => (
                    <span key={genre.idGenre} className="rounded-lg border-1 text-main_color text-base px-2">{genre.description} </span>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-secundary_color">Categorias: </span>
                  {gameInfo.categories.map((category) => (
                    <span key={category.idCategory} className="rounded-lg border-1 text-main_color text-base px-2">{category.description} </span>
                  ))}
                </div>
                {gameInfo.isFree ? (
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="text-secundary_color">Preço: </span>
                    <span className="rounded-lg border-1 text-green-600 text-base px-2">GRATUITO</span>
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="text-secundary_color">Preço: </span>
                    <span className="rounded-lg border-1 text-main_color text-base px-2">{gameInfo.price}</span>
                  </div>
                )}

              </div>
            </div>
            <div className="w-1/2 p-4">
              <h2 className="text-2xl text-main_color">DESCRIÇÃO</h2>
              <p className="text-lg text-main_color mt-2 text-justify">{gameInfo.shortDescription}</p>
            </div>
          </div>
          <div className="w-full p-4">
            <div className="w-full border-1 p-8 rounded-lg">
              <h2 className="text-2xl text-main_color">SOBRE O JOGO</h2>
              <p className="text-lg text-main_color mt-2 text-justify" dangerouslySetInnerHTML={{ __html: gameInfo.about }}></p>

            </div>

          </div>
        </main>

      )}

    </Container>
  )
}