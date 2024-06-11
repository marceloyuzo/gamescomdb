import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Container } from "../../../components/Container";
import { SideMenu } from "../../../components/SideMenu";
import { AuthContext } from "../../../contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../services/firebaseConnection";
import { useNavigate, useParams } from "react-router-dom";
import ModalFeedback from "../../../components/ModalFeedback";
import { MdFileUpload } from "react-icons/md";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidV4 } from 'uuid'

const schemaPersonal = z.object({
  fullname: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  birthday: z.string().optional()
})

type PersonalData = z.infer<typeof schemaPersonal>

const schemaPrivacy = z.object({
  privacy: z.enum(["PUBLIC", "NOT LISTED", "PRIVATE"])
})

type PrivacyData = z.infer<typeof schemaPrivacy>

interface UserInfoProps {
  fullname: string,
  email: string,
  username: string,
  birthday: string,
  photo: string,
  privacy: PrivacyData["privacy"]
}

interface ImageProps {
  name: string,
  uid: string,
  previewUrl: string,
  url: string
}

export function EditProfile() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const userAuth = useParams()
  const [photo, setPhoto] = useState<ImageProps>()
  const [readOnly, setReadOnly] = useState<boolean>(true)
  const [userInfo, setUserInfo] = useState<UserInfoProps | null>()
  const [enableFeedback, setEnableFeedback] = useState<boolean>(false)
  const [sucess, setSucess] = useState<boolean>(false)
  const [textFeedback, setTextFeedback] = useState<string>("")
  const [linkRef, setLinkRef] = useState<string>("")
  const { register: registerPersonal, setValue: setValuePersonal, handleSubmit: handlePersonal, formState: { errors: errorsPersonal } } = useForm<PersonalData>({
    resolver: zodResolver(schemaPersonal),
    mode: "onChange"
  })
  const { register: registerPrivacy, setValue: setValuePrivacy, handleSubmit: handlePrivacy } = useForm<PrivacyData>({
    resolver: zodResolver(schemaPrivacy),
    mode: "onChange"
  })

  useEffect(() => {
    if (user?.idUser !== userAuth.id) {
      navigate(`/profile/${user?.idUser}/edit`)
    }
  }, [])

  useEffect(() => {
    if (user?.idUser) {
      fetchData();
    }
  }, [user?.idUser, setValuePersonal]);

  useEffect(() => {
    if (photo) {
      updatePhotoProfile()
    }
  }, [photo])

  async function fetchData() {
    const info: UserInfoProps | null = await loadUserInfo();

    if (info) {
      setUserInfo(info)
      setValuePersonal('fullname', info.fullname);
      setValuePersonal('email', info.email);
      setValuePersonal('username', info.username);
      setValuePersonal('birthday', info.birthday);
      setValuePrivacy('privacy', info.privacy)
    }
  }

  async function loadUserInfo() {
    const userRef = doc(db, "users", `${user?.idUser}`)
    let tempInfo: UserInfoProps | null = null

    try {
      const snapshot = await getDoc(userRef)
      console.log("Número de documentos recuperados:", snapshot)

      tempInfo = {
        fullname: snapshot.data()?.fullname,
        username: snapshot.data()?.username,
        photo: snapshot.data()?.photo.url,
        email: snapshot.data()?.email,
        birthday: snapshot.data()?.birthday,
        privacy: snapshot.data()?.privacy
      }

      return tempInfo
    }
    catch (error) {
      console.log(error);
      return null;
    }

  }

  function updatePersonal(data: PersonalData) {
    if (data.fullname === userInfo?.fullname && data.birthday === userInfo?.birthday) {
      return
    }

    const userInfoRef = doc(db, "users", `${user?.idUser}`)

    updateDoc(userInfoRef, {
      fullname: data.fullname,
      birthday: data.birthday
    })
      .then(() => {
        setSucess(true)
        setTextFeedback("Suas informações pessoais foram atualizadas com sucesso.")
        setLinkRef(`/profile/${user?.idUser}/edit`)
        setEnableFeedback(true)
        setReadOnly(true)
      })
      .catch(() => {
        setSucess(false)
        setTextFeedback("Ocorreu um erro ao atualizar suas informações pessoais.")
        setLinkRef(`/profile/${user?.idUser}/edit`)
        setEnableFeedback(true)
      })

  }

  function changePrivacy(data: PrivacyData) {
    const userInfoRef = doc(db, "users", `${user?.idUser}`)

    updateDoc(userInfoRef, {
      privacy: data.privacy
    })
      .then(() => {
        setSucess(true)
        setTextFeedback("Sua privacidade foi atualizada com sucesso.")
        setLinkRef(`/profile/${user?.idUser}/edit`)
        setEnableFeedback(true)
      })
      .catch(() => {
        setSucess(false)
        setTextFeedback("Ocorreu um problema ao atualizar sua privacidade.")
        setLinkRef(`/profile/${user?.idUser}/edit`)
        setEnableFeedback(true)
      })
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0]

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        await handleUpload(image)
      } else {
        alert("Envie a foto no formato JPEG ou PNG.")
        return
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.idUser) {
      return
    }

    const currentUid = user.idUser
    const uidImage = uuidV4()

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

    uploadBytes(uploadRef, image)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadUrl) => {
          const imageItem = {
            name: uidImage,
            uid: currentUid,
            previewUrl: URL.createObjectURL(image),
            url: downloadUrl
          }

          setPhoto(imageItem)
        })
      })
  }

  async function updatePhotoProfile() {
    try {
      await updateDoc(doc(db, "users", `${user?.idUser}`), {
        photo: photo
      })
      setSucess(true)
      setTextFeedback("Sua foto de perfil foi atualizada.")
      setLinkRef(`/profile/${user?.idUser}/edit`)
      setEnableFeedback(true)
    }
    catch (error) {
      console.log(error)
    }
  }

  if (!user?.idUser) {
    return
  }

  return (
    <Container>
      <main className="mt-header w-full flex gap-4 justify-center items-start py-16">
        <SideMenu idUser={user?.idUser}></SideMenu>
        <div className="w-full flex flex-col gap-4 border-1 p-8 rounded-lg">
          <div className="flex justify-end">
            <button className="text-bg_color bg-secundary_color px-4 py-1 rounded-lg font-medium"
              onClick={() => navigate(`/profile/${user.idUser}`)}
            >VOLTAR PARA O PERFIL</button>
          </div>
          <form
            className="flex flex-col gap-3 text-main_color"
            onSubmit={handlePersonal(updatePersonal)}
          >
            <h2 className="text-xl">INFORMAÇÕES PESSOAIS</h2>
            <div className="w-full flex gap-8">
              <div className="flex flex-col w-full">
                <span>Nome Completo</span>
                <input
                  className={`px-2 py-1 rounded-lg outline-none w-full text-bg_color ${readOnly ? "bg-zinc-500" : "bg-main_color"}`}
                  type="text"
                  readOnly={readOnly}
                  {...registerPersonal("fullname")}
                  placeholder=""
                />
                <span>{errorsPersonal.fullname?.message}</span>
              </div>
              <div className="flex flex-col w-full">
                <span>Email</span>
                <input
                  className={`px-2 py-1 rounded-lg outline-none w-full text-bg_color ${readOnly ? "bg-zinc-500" : "bg-main_color"}`}
                  type="email"
                  readOnly={true}
                  {...registerPersonal("email")}
                  placeholder=""
                />
                <span>{errorsPersonal.email?.message}</span>
              </div>
            </div>
            <div className="w-full flex gap-8">
              <div className="flex flex-col w-full">
                <span>Username</span>
                <input
                  className={`px-2 py-1 rounded-lg outline-none w-full text-bg_color ${readOnly ? "bg-zinc-500" : "bg-main_color"}`}
                  type="text"
                  readOnly={true}
                  {...registerPersonal("username")}
                  placeholder=""
                />
                <span>{errorsPersonal.username?.message}</span>
              </div>
              <div className="flex flex-col w-full">
                <span>Data de Nascimento</span>
                <input
                  className={`px-2 py-1 rounded-lg outline-none w-full text-bg_color ${readOnly ? "bg-zinc-500" : "bg-main_color"}`}
                  type="date"
                  readOnly={readOnly}
                  {...registerPersonal("birthday")}
                  placeholder=""
                />
                <span>{errorsPersonal.birthday?.message}</span>
              </div>
            </div>
            <div className="flex justify-end mt-2 gap-3">
              <div
                className={`text-lg bg-main_color text-bg_color px-4 py-0.5 rounded-lg font-medium ${readOnly ? "block" : "hidden"}`}
                onClick={() => setReadOnly(false)}
              >EDITAR INFORMAÇÃO</div>
              <div
                className={`text-lg bg-main_color text-bg_color px-4 py-0.5 rounded-lg font-medium ${readOnly ? "hidden" : "block"}`}
                onClick={() => setReadOnly(true)}
              >CANCELAR</div>
              <button
                type="submit"
                className={`text-lg bg-secundary_color text-bg_color px-4 py-0.5 rounded-lg font-medium ${readOnly ? "hidden" : "block"}`}
              >SALVAR</button>
            </div>
          </form>

          <form
            className="flex flex-col gap-3 text-main_color mt-4"
            onChange={handlePrivacy(changePrivacy)}
          >
            <h2 className="text-xl">SEGURANÇA E PRIVACIDADE</h2>

            <div className="flex flex-col w-full gap-1">
              <span>Privacidade da Conta</span>
              <select {...registerPrivacy("privacy")} className="outline-none rounded-lg text-bg_color py-1 px-2 max-w-40">
                <option value="PUBLIC">PUBLIC</option>
                <option value="NOT LISTED">NOT LISTED</option>
                <option value="PRIVATE">PRIVATE</option>
              </select>
            </div>
          </form>

          <div className="mt-8">
            <h2 className="text-xl text-main_color mb-2">FOTO DE PERFIL</h2>

            <div className="relative w-full max-w-40 bg-main_color rounded-lg h-8 cursor-pointer">
              <input
                type="file"
                accept="image/"
                onChange={handleFile}
                className="opacity-0 w-full cursor-pointer h-full rounded-lg"
              />
              <MdFileUpload size={30} className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 cursor-pointer text-bg_color" />
            </div>
          </div>
        </div>
        <ModalFeedback enableFeedback={enableFeedback} onClose={() => setEnableFeedback(false)} sucess={sucess} text={textFeedback} linkref={linkRef} />
      </main >
    </Container >
  )
}