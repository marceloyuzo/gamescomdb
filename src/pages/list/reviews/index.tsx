import { ProfileTitle } from "../../../components/ProfileTitle"
import { Container } from "../../../components/Container"
import { useContext, useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { db } from "../../../services/firebaseConnection"
import { useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"
import ModalFeedback from "../../../components/ModalFeedback"

export interface ReviewsProps {
  idReview: string,
  idGame: string,
  idUser: string,
  title: string,
  cover: string,
  release: string,
  dateCreated: string,
  status: string,
  justify: string[],
  publishers: string[],
  developers: string[]
}

export function Reviews() {
  const [reviews, setReviews] = useState<ReviewsProps[]>([])
  const [enableFeedback, setEnableFeedback] = useState<boolean>(false)
  const [sucess, setSucess] = useState<boolean>(false)
  const [textFeedback, setTextFeedback] = useState<string>("")
  const [linkRef, setLinkRef] = useState<string>("")
  const userAuth = useParams()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    loadReviews()
  }, [userAuth])

  async function loadReviews() {
    try {
      const snapshot = await getDocs(collection(db, "users", `${userAuth.id}`, "reviews"))

      let listReview = [] as ReviewsProps[]
      console.log("Número de documentos recuperados:", snapshot.size);

      snapshot.forEach(doc => {
        listReview.push({
          idReview: doc.id,
          idGame: doc.data().idGame,
          idUser: doc.data().idUser,
          title: doc.data().title,
          cover: doc.data().cover,
          release: doc.data().release,
          dateCreated: doc.data().dateCreated,
          status: doc.data().status,
          justify: doc.data().justify,
          developers: doc.data().developers,
          publishers: doc.data().publishers
        })
      })

      setReviews(listReview)
    }
    catch (error) {
      console.log(error)
    }
  }

  async function deleteReview(review: ReviewsProps) {
    const reviewsRef = collection(db, "users", `${user?.idUser}`, "reviews")
    const queryRef = query(reviewsRef, where("idGame", "==", review.idGame))

    const snapshot = await getDocs(queryRef)
    snapshot.forEach((snap) => {
      let deleteRef = doc(db, "users", `${user?.idUser}`, "reviews", snap.id)

      deleteDoc(deleteRef)
        .then(() => {
          setSucess(true)
          setEnableFeedback(true)
          setTextFeedback("Review removido com sucesso!")
          setLinkRef(`/profile/${user?.idUser}/reviews`)
        })
        .catch(() => {
          setSucess(false)
          setEnableFeedback(true)
          setTextFeedback("Ocorreu um erro ao remover a review.")
          setLinkRef(`/profile/${user?.idUser}/reviews`)
        })
    })
  }

  return (
    <>
      <Container>
        <main className="min-h-body mt-header py-10 w-full">
          <ProfileTitle title={"REVIEWS"} />

          {reviews && (
            <div className="w-full flex flex-col gap-4">

              {reviews.map((review) => (
                <div className="w-full rounded-lg border-1 py-6" key={review.idReview}>
                  <div className="w-full flex justify-between items-center text-main_color text-2xl mb-4 px-10">
                    <h2>#{review.idReview}</h2>
                    <div className="flex gap-3">
                      {user?.idUser === userAuth.id && (
                        <button
                          className="bg-secundary_color text-bg_color px-3 py-1 rounded-lg text-xl font-medium"
                          onClick={() => deleteReview(review)}
                        >EXCLUIR</button>
                      )}
                    </div>
                  </div>
                  <div className="w-full flex gap-6 px-10">
                    <div className="relative flex flex-col items-center gap-1 mb-2 w-1/3">
                      <img
                        className="rounded-md w-full"
                        src={review.cover}
                        alt={review.title}
                      />
                      <span className={`absolute right-1 top-1 bg-bg_color px-3 py-0.5 text-xs rounded-lg ${review.status === "COMPLETE" ? "text-green-600" : "text-orange-600"}`}>{review.status}</span>
                      <span className="text-2xl text-main_color">{review.title}</span>
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
                    <div className="w-2/3 text-main_color text-2xl text-justify flex items-center">
                      <div className="indent-4">
                        {review.justify.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {reviews.length == 0 && (
            <div className="mt-header w-full">
              <h1 className="absolute right-1/2 top-1/2 transform translate-x-1/2 translate-y-1/2 text-4xl text-main_color ">NÃO POSSUI REVIEWS</h1>
            </div>
          )}

          <ModalFeedback enableFeedback={enableFeedback} onClose={() => setEnableFeedback(false)} sucess={sucess} text={textFeedback} linkref={linkRef} />
        </main>
      </Container>
    </>
  )
}