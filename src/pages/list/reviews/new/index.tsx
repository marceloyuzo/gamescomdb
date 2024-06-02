import { Container } from "../../../../components/Container"
import { MdEdit } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { useContext, useEffect, useState } from "react";
import { GamesPlayedContext, GamePlayedProps } from "../../../../contexts/GamesPlayedContext";
import { AuthContext } from "../../../../contexts/AuthContext";
import "./style.css"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../services/firebaseConnection";
import { useNavigate } from "react-router-dom";
import { apiSteam } from "../../../../services/api";

const schema = z.object({
  review: z.string().min(1, "Escreva algo a respeito do jogo")
})

type ReviewData = z.infer<typeof schema>

interface GamesReviewProps {
  idGame: string,
  title: string,
  cover: string,
  release: string,
  publishers: string[],
  developers: string[],
}

export function NewReview() {
  const navigate = useNavigate()
  const [selectGame, setSelectGame] = useState<GamePlayedProps>()
  const [gameInfo, setGameInfo] = useState<GamesReviewProps>()
  const { myGamesPlayed, loadListGamesPlayed } = useContext(GamesPlayedContext)
  const { user } = useContext(AuthContext)
  const { handleSubmit, register, formState: { errors } } = useForm<ReviewData>({
    resolver: zodResolver(schema),
    mode: "onBlur"
  })

  useEffect(() => {
    if (user) {
      loadListGamesPlayed(user.idUser)
    }
  }, [user])

  async function postReview(data: ReviewData) {
    const reviewRef = collection(db, "users", `${user?.idUser}`, "reviews")
    const formatedDateCreated = formatDate()

    if (!selectGame) {
      console.log("TESTE")
      return
    }
    await getGame(selectGame.idGame)
    console.log(selectGame)
    try {

      addDoc(reviewRef, {
        justify: data.review,
        dateCreated: formatedDateCreated,
        status: selectGame?.status,
        idUser: user?.idUser,
        idGame: gameInfo?.idGame,
        title: gameInfo?.title,
        cover: gameInfo?.cover,
        release: gameInfo?.release,
        publishers: gameInfo?.publishers,
        developers: gameInfo?.developers
      })

      console.log("REVIEW CADASTRADO COM SUCESSO.")
      navigate(`/profile/${user?.idUser}/reviews`)
    }
    catch (error) {
      console.log(error)
    }
  }

  async function getGame(idGame: number) {
    try {
      const response = await apiSteam.get(`/game/${idGame}`)
      const jogo: GamesReviewProps = {
        idGame: response.data[idGame].data.steam_appid,
        title: response.data[idGame].data.name,
        cover: response.data[idGame].data.header_image,
        release: response.data[idGame].data.release_date.date,
        publishers: response.data[idGame].data.publishers,
        developers: response.data[idGame].data.developers
      }

      setGameInfo(jogo)
    }
    catch (error) {
      console.log(error)
    }
  }

  function formatDate() {
    const date = new Date()

    const day = date.getDate()
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = date.getFullYear()

    return `${day} ${month}, ${year}`
  }

  return (
    <>
      <Container>
        <main className="mt-header w-full py-16">
          <div className="w-full border-1 flex justify-center items-center py-4 rounded-lg mb-6">
            <h2 className="text-xl text-main_color">ADICIONAR REVIEW</h2>
          </div>
          <div className="w-full border-1 rounded-lg p-4 mb-6">
            <h2 className="text-xl text-main_color mb-4">SELECIONE O JOGO</h2>

            {myGamesPlayed && (
              <Swiper
                className="mb-4"
                spaceBetween={8}
                modules={[Navigation]}
                slidesPerView={4}
                loop
                navigation
              >
                {myGamesPlayed.map((game) => (
                  <SwiperSlide>
                    <div
                      className="relative flex flex-col justify-center items-center gap-1 cursor-pointer div_container"
                      onClick={() => { setSelectGame(game) }}
                    >
                      <MdEdit size={46} className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 opacity-0 icone_edit text-main_color" />
                      <img
                        className="rounded-md"
                        src={game.cover}
                        alt={game.title}
                      />
                      <span className="text-lg text-main_color">{game.title}</span>
                    </div>
                  </SwiperSlide>
                ))}

              </Swiper>
            )}
          </div>

          {selectGame && (
            <form className="w-full border-1 rounded-lg p-4 mb-6" onSubmit={handleSubmit(postReview)}>
              <h2 className="text-xl text-main_color mb-4">{selectGame.title}</h2>

              <textarea
                id="review"
                {...register("review")}
                className="w-full min-h-40 p-2 outline-none rounded-lg bg-main_color bg-opacity-20 text-xl max-w-full resize-y"
              />

              <div className="flex justify-end mt-4">
                <button
                  className="text-lg bg-secundary_color px-4 py-0.5 rounded-lg font-medium"
                >PUBLICAR</button>

              </div>
            </form>
          )}

        </main>
      </Container>
    </>
  )
}