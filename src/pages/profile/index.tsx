import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { Container } from "../../components/Container"
import { SideMenu } from "../../components/SideMenu"
import { Link, useNavigate, useParams } from "react-router-dom"
import Modal from "../../components/Modal"
import { GamesPlayedContext } from "../../contexts/GamesPlayedContext"
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { ReviewsProps } from "../list/reviews"
import { GamesFavoritesProps } from "../list/favorites/new"


export function Profile() {
   const navigate = useNavigate()
   const { user } = useContext(AuthContext)
   const { myGamesPlayed, loadListGamesPlayed, limitLoad } = useContext(GamesPlayedContext)
   const [review, setReview] = useState<ReviewsProps>()
   const [privacy, setPrivacy] = useState("")
   const [favorites, setFavorites] = useState<GamesFavoritesProps[]>([])
   const userAuth = useParams()
   const [enableModal, setEnableModal] = useState<boolean>(false)

   useEffect(() => {
      if (userAuth.id) {
         loadListGamesPlayed(userAuth.id)
         getPrivacy()
      }
      loadListReview()
      loadListFavorite()

   }, [userAuth.id, limitLoad])

   useEffect(() => {
      searchUser()
   }, [])

   if (!userAuth.id) {
      return null
   }

   async function getPrivacy() {
      const userRef = doc(db, "users", `${userAuth.id}`)

      const snapshot = await getDoc(userRef)
      if (snapshot.exists()) {
         setPrivacy(snapshot.data().privacy)
      }
   }

   async function searchUser() {
      const ref = collection(db, "users")
      const queryRef = query(ref, where("idUser", "==", userAuth.id))

      const snapshot = await getDocs(queryRef)

      if (snapshot.empty) {
         navigate("/notfound")
         return
      }
   }

   async function loadListFavorite() {
      const favoritesRef = collection(db, "users", `${userAuth.id}`, "favorites")
      const queryRef = query(favoritesRef, limit(3))
      let listFavorite = [] as GamesFavoritesProps[]

      const snapshot = await getDocs(queryRef)
      snapshot.forEach(doc => {
         listFavorite.push({
            idGame: doc.data().idGame,
            title: doc.data().title,
            cover: doc.data().cover,
            status: doc.data().status,
            datePlayed: doc.data().datePlayed,
            idRegister: doc.data().idRegister
         })

         setFavorites(listFavorite)
      })
   }

   async function loadListReview() {
      const reviewsRef = collection(db, "users", `${userAuth.id}`, "reviews")
      const queryRef = query(reviewsRef, orderBy("dateCreated", "desc"), limit(1))

      const snapshot = await getDocs(queryRef)
      snapshot.forEach(doc => {
         let review: ReviewsProps = {
            idReview: doc.id,
            idGame: doc.data().idGame,
            idUser: doc.data().idUser,
            title: doc.data().title,
            cover: doc.data().cover,
            release: doc.data().release,
            dateCreated: doc.data().dateCreated,
            status: doc.data().status,
            justify: doc.data().justify,
            publishers: doc.data().publishers,
            developers: doc.data().developers
         }

         setReview(review)
      })
   }

   return (
      <Container>
         {(privacy === "PRIVATE" && userAuth.id !== user?.idUser) ? (
            <div className="min-h-body mt-header w-full">
               <h1 className="fixed right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-4xl text-main_color ">ESSE PERFIL É PRIVADO :(</h1>
            </div>
         ) : (

            <main className="min-h-body mt-header w-full flex gap-4 justify-center items-start py-16">
               <SideMenu idUser={userAuth.id}></SideMenu>
               <div className="w-full flex flex-col gap-4">

                  <section className="w-full p-6 flex flex-col border-1 rounded-lg">
                     <div className="flex justify-between items-center w-full mb-4">
                        <h2 className="text-2xl text-main_color">LISTA DE JOGOS</h2>
                        <div className="flex gap-2">
                           {(user?.idUser === userAuth.id) && (
                              <div className="flex justify-end">
                                 <button
                                    className="text-lg bg-secundary_color text-main_color font-light px-4 py-0.5 rounded-lg"
                                    onClick={() => setEnableModal(true)}
                                 >ADICIONAR JOGO</button>
                                 <Modal enableModal={enableModal} onClose={() => setEnableModal(false)} />
                              </div>
                           )}
                           <button
                              className="text-lg bg-main_color px-4 py-0.5 rounded-lg font-medium"
                              onClick={() => navigate(`/profile/${userAuth.id}/gamesplayed`)}
                           >VER MAIS</button>

                        </div>
                     </div>
                     {(myGamesPlayed.length == 0) && (
                        <div className="text-main_color flex justify-center items-center w-full text-xl my-10">
                           NÃO POSSUI JOGOS LISTADOS
                        </div>
                     )}
                     <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 md:grid-cols-2">

                        {myGamesPlayed.map((game) => (
                           <Link to={`/game/${game.idGame}`} key={game.idGame}>
                              <div className="relative flex flex-col justify-center items-center gap-1" key={game.idGame}>
                                 <img
                                    className="rounded-md"
                                    src={game.cover}
                                    alt={game.title}
                                 />
                                 <span className={`absolute right-1 top-1 bg-bg_color px-3 py-0.5 text-xs rounded-lg ${game.status === "COMPLETE" ? "text-green-600" : "text-orange-600"}`}>{game.status}</span>
                                 <span className="text-lg text-main_color">{game.title}</span>
                              </div>
                           </Link>
                        )).slice(0, 9)}


                     </div>

                  </section>
                  <section className="w-full p-6 flex flex-col border-1 rounded-lg">
                     <div className="flex justify-between items-center w-full mb-4">
                        <h2 className="text-2xl text-main_color">REVIEWS</h2>
                        <div className="flex gap-2">
                           {(user?.idUser === userAuth.id) && (
                              <div className="flex justify-end">
                                 <button
                                    className="text-lg bg-secundary_color text-main_color font-light px-4 py-0.5 rounded-lg "
                                    onClick={() => navigate("/profile/newreview")}
                                 >ADICIONAR REVIEW</button>
                              </div>
                           )}
                           <button
                              className="text-lg bg-main_color px-4 py-0.5 rounded-lg font-medium"
                              onClick={() => navigate(`/profile/${userAuth.id}/reviews`)}
                           >VER MAIS</button>

                        </div>
                     </div>
                     {review && (
                        <div className="w-full flex gap-4">
                           <div className="relative flex flex-col gap-1 w-1/2 text-main_color">
                              <img
                                 src={review.cover}
                                 alt={review.title}
                              />
                              <span className={`absolute right-1 top-1 bg-bg_color px-3 py-0.5 text-xs rounded-lg ${review.status === "COMPLETE" ? "text-green-600" : "text-orange-600"}`}>{review.status}</span>
                              <span className="text-lg text-main_color text-center">{review.title}</span>
                              <div className="flex flex-col w-full text-lg text-main_color gap-2 mt-2">
                                 <span className="text-secundary_color">Data de Lançamento: <span className="rounded-lg border-1 text-main_color text-base px-2">{review.release}</span></span>

                                 <div className="flex gap-2 flex-wrap items-center">
                                    <span className="text-secundary_color">Editora: </span>
                                    {review.publishers.map((publisher) => (
                                       <span key={publisher} className="rounded-lg border-1 text-main_color text-base px-2">{publisher} </span>
                                    ))}
                                 </div>

                                 <div className="flex gap-2 flex-wrap items-center">
                                    <span className="text-secundary_color">Desenvolvedora: </span>
                                    {review.developers.map((developer) => (
                                       <span key={developer} className="rounded-lg border-1 text-main_color text-base px-2">{developer} </span>
                                    ))}
                                 </div>
                                 <span className="text-secundary_color">Status: <span className="rounded-lg border-1 text-main_color text-base px-2">{review.status}</span></span>
                                 <span className="text-secundary_color">Data Criado (Review): <span className="rounded-lg border-1 text-main_color text-base px-2">{review.dateCreated}</span></span>
                              </div>
                           </div>
                           <div className="w-1/2 text-main_color text-xl text-justify flex items-center">
                              <div className="line-clamp-6">
                                 {review.justify.map((paragraph) => (
                                    <p className="indent-4" key={paragraph}>{paragraph} </p>
                                 ))}
                              </div>
                           </div>
                        </div>
                     )}

                     {!review && (
                        <div className="text-main_color flex justify-center items-center w-full text-xl my-10">
                           NÃO POSSUI REVIEWS
                        </div>
                     )}
                  </section>
                  <section className="w-full p-6 flex flex-col border-1 rounded-lg">
                     <div className="flex justify-between items-center w-full mb-4">
                        <h2 className="text-2xl text-main_color">JOGOS FAVORITOS</h2>
                        <div className="flex gap-2">
                           {(user?.idUser === userAuth.id) && (
                              <div className="flex justify-end">
                                 <button
                                    className="text-lg bg-secundary_color text-main_color font-light px-4 py-0.5 rounded-lg"
                                    onClick={() => navigate("/profile/newfavorite")}
                                 >ADICIONAR FAVORITO</button>
                              </div>
                           )}
                           <button className="text-lg bg-main_color px-4 py-0.5 rounded-lg font-medium"
                              onClick={() => navigate(`/profile/${userAuth.id}/favorites`)}
                           >VER MAIS</button>

                        </div>
                     </div>
                     {favorites && (
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 md:grid-cols-2">
                           {favorites.map((favorite) => (
                              <Link to={`/game/${favorite.idGame}`} key={favorite.idGame}>
                                 <div className="relative flex flex-col justify-center items-center gap-1">
                                    <img
                                       className=""
                                       src={favorite.cover}
                                       alt={favorite.title}
                                    />
                                    <span className={`absolute right-1 top-1 bg-bg_color px-3 py-0.5 text-xs rounded-lg ${favorite.status === "COMPLETE" ? "text-green-600" : "text-orange-600"}`}>{favorite.status}</span>
                                    <span className="text-lg text-main_color">{favorite.title}  </span>
                                 </div>
                              </Link>
                           ))}
                        </div>

                     )}
                     {(favorites.length == 0) && (
                        <div className="text-main_color flex justify-center items-center w-full text-xl my-10">
                           NÃO POSSUI JOGOS FAVORITOS
                        </div>
                     )}
                  </section>
               </div>
            </main >
         )}
      </Container >
   )
}