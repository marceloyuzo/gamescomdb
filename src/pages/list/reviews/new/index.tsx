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
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../services/firebaseConnection";
import { useNavigate } from "react-router-dom";
import { apiSteam } from "../../../../services/api";
import { IoIosArrowRoundBack } from "react-icons/io";
import ModalFeedback from "../../../../components/ModalFeedback";

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
  const [enableFeedback, setEnableFeedback] = useState<boolean>(false)
  const [sucess, setSucess] = useState<boolean>(false)
  const [textFeedback, setTextFeedback] = useState<string>("")
  const [linkRef, setLinkRef] = useState<string>("")
  const { myGamesPlayed, loadListGamesPlayed } = useContext(GamesPlayedContext)
  const { user } = useContext(AuthContext)
  const { handleSubmit, register } = useForm<ReviewData>({
    resolver: zodResolver(schema),
    mode: "onBlur"
  })

  useEffect(() => {
    if (user) {
      loadListGamesPlayed(user.idUser)
    }
  }, [user])

  async function postReview(data: ReviewData) {
    if (!selectGame) {
      console.log("Nenhum jogo selecionado");
      return;
    }

    const loadedGame = await getGame(selectGame.idGame);

    if (!loadedGame) {
      return
    }

    if (await searchReview(loadedGame.idGame)) {
      setSucess(false)
      setEnableFeedback(true)
      setTextFeedback("Você já possui uma review sobre esse jogo.")
      setLinkRef(`/profile/newreview`)
      return
    }

    const reviewRef = collection(db, "users", `${user?.idUser}`, "reviews");
    const formatedDateCreated = formatDate();

    try {
      await addDoc(reviewRef, {
        justify: data.review.split('\n'),
        dateCreated: formatedDateCreated,
        status: selectGame?.status,
        idUser: user?.idUser,
        idGame: loadedGame?.idGame,
        title: loadedGame?.title,
        cover: loadedGame?.cover,
        release: loadedGame?.release,
        publishers: loadedGame?.publishers,
        developers: loadedGame?.developers
      })

      setEnableFeedback(true)
      setSucess(true)
      setTextFeedback("Review cadastrado com sucesso!")
      setLinkRef(`/profile/${user?.idUser}/reviews`)
      return
    }
    catch (error) {
      console.log(error)
      setEnableFeedback(true)
      setSucess(false)
      setTextFeedback("Ocorreu um erro ao realizar o cadastro.")
      setLinkRef(`/profile/newreview`)
      return
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

      return jogo
    }
    catch (error) {
      console.log(error)
      return null
    }
  }

  async function searchReview(idGame: string) {
    const reviewsRef = collection(db, "users", `${user?.idUser}`, "reviews")
    const queryRef = query(reviewsRef, where("idGame", "==", idGame))

    const snapshot = await getDocs(queryRef)

    if (snapshot.empty) {
      return false
    }

    return true
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
        <main className="min-h-body mt-header w-full py-16">
          <div className="relative w-full border-1 flex justify-end items-center py-4 rounded-lg mb-6 px-4">
            <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2">
              <h2 className="text-xl text-main_color">ADICIONAR REVIEW</h2>
            </div>
            <div className="">
              <IoIosArrowRoundBack
                size={36}
                className="rounded-full text-main_color p-1 hover:bg-main_color hover:text-bg_color"
                onClick={() => navigate(`/profile/${user?.idUser}`)}
              />
            </div>
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
                      key={game.idGame}
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
          <ModalFeedback enableFeedback={enableFeedback} onClose={() => setEnableFeedback(false)} sucess={sucess} text={textFeedback} linkref={linkRef} />
        </main>
      </Container>
    </>
  )
}