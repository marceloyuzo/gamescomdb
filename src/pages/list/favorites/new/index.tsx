import { Container } from "../../../../components/Container"
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { useContext, useEffect, useState } from "react";
import { GamePlayedProps, GamesPlayedContext } from "../../../../contexts/GamesPlayedContext";
import { AuthContext } from "../../../../contexts/AuthContext";
import "./style.css"
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../../../services/firebaseConnection";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import ModalFeedback from "../../../../components/ModalFeedback";

export interface GamesFavoritesProps {
  idGame: number,
  title: string,
  cover: string,
  status: string
  datePlayed: Date,
  idRegister: string
}

export function NewFavorite() {
  const navigate = useNavigate()
  const [favoriteGames, setFavoriteGames] = useState<GamesFavoritesProps[]>([])
  const [loadedFavorites, setLoadedFavorites] = useState<GamesFavoritesProps[]>([])
  const [enableFeedback, setEnableFeedback] = useState<boolean>(false)
  const [sucess, setSucess] = useState<boolean>(false)
  const [textFeedback, setTextFeedback] = useState<string>("")
  const [linkRef, setLinkRef] = useState<string>("")
  const { myGamesPlayed, loadListGamesPlayed } = useContext(GamesPlayedContext)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      loadListGamesPlayed(user.idUser)
      loadFavoritesGames()
    }
  }, [user])

  async function loadFavoritesGames() {
    const favoriteRef = collection(db, "users", `${user?.idUser}`, "favorites")
    const snapshot = await getDocs(favoriteRef)
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

      setLoadedFavorites(listFavoritesGames)
      setFavoriteGames(listFavoritesGames)

    })
  }

  function setFavorite(newGame: GamePlayedProps) {
    const alreadyFavorite = favoriteGames.some(game => game.idGame === newGame.idGame)

    if (alreadyFavorite) {
      let listFavoritesGames = favoriteGames.filter((game) => (game.idGame !== newGame.idGame))

      setFavoriteGames(listFavoritesGames)
      return
    }

    let listFavoritesGames: GamesFavoritesProps = ({
      idGame: newGame.idGame,
      title: newGame.title,
      cover: newGame.cover,
      status: newGame.status,
      datePlayed: newGame.datePlayed,
      idRegister: ""
    })
    console.log(newGame.idGame)
    setFavoriteGames([
      ...favoriteGames, listFavoritesGames
    ])


  }

  async function postFavoritesGames() {
    const favoritesRef = collection(db, "users", `${user?.idUser}`, "favorites")
    const favoritesToAdd = favoriteGames.filter((newFavorite) => !loadedFavorites.some(favorite => favorite.idGame === newFavorite.idGame))
    const favoritestoDelete = loadedFavorites.filter((oldFavorite) => !favoriteGames.some(newFavorite => oldFavorite.idGame === newFavorite.idGame))

    if (!favoriteGames) {
      navigate(`/profile/${user?.idUser}`)
      return
    }

    if (favoritesToAdd) {
      favoritesToAdd.forEach((game) => {
        addDoc(favoritesRef, {
          idGame: game.idGame,
          title: game.title,
          cover: game.cover,
          status: game.status,
          datePlayed: game.datePlayed
        })
      })
    }

    if (favoritestoDelete) {
      favoritestoDelete.forEach((game) => {
        let deleteRef = doc(db, "users", `${user?.idUser}`, "favorites", game.idRegister)

        deleteDoc(deleteRef)
      })
    }

    setEnableFeedback(true)
    setSucess(true)
    setTextFeedback("Seus jogos favoritos foram atualizados com sucesso.")
    setLinkRef("/profile/newfavorite")
  }

  return (
    <>
      <Container>
        <main className="min-h-body mt-header w-full py-16">
          <div className="relative w-full border-1 flex justify-end items-center py-4 rounded-lg mb-6 px-4">
            <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2">
              <h2 className="text-xl text-main_color">ADICIONAR AOS FAVORITOS</h2>
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
                  <SwiperSlide key={game.idGame}>
                    <div
                      className="relative flex flex-col justify-center items-center gap-1 cursor-pointer div_container"
                      onClick={() => { setFavorite(game) }}
                    >
                      {favoriteGames.some(favorite => favorite.idGame === game.idGame) ? (
                        <MdFavorite size={46} className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 opacity-100 icone_edit text-secundary_color" />
                      ) : (
                        <MdFavoriteBorder size={46} className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 opacity-0 icone_edit text-main_color" />
                      )}
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
          <div className="w-full border-1 rounded-lg p-4 mb-6">
            <h2 className="text-xl text-main_color mb-4">LISTA DE JOGOS FAVORITOS</h2>

            {favoriteGames && (
              <div className="w-full grid grid-cols-4 gap-3">
                {favoriteGames.map((game) => (
                  <div
                    className="relative flex flex-col justify-center items-center gap-1 cursor-pointer div_container"
                    key={game.idGame}
                    onClick={() => { setFavorite(game) }}
                  >
                    <img
                      className="rounded-md"
                      src={game.cover}
                      alt={game.title}
                    />
                    <span className="text-lg text-main_color">{game.title}</span>
                  </div>
                ))}

              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                className="px-6 py-1 text-bg_color bg-main_color rounded-lg font-medium text-lg"
                onClick={() => postFavoritesGames()}
              >SALVAR FAVORITOS</button>
            </div>
          </div>

          <ModalFeedback enableFeedback={enableFeedback} onClose={() => setEnableFeedback(false)} sucess={sucess} text={textFeedback} linkref={linkRef} />
        </main>
      </Container>
    </>
  )
}