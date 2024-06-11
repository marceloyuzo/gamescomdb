import { MdFileUpload } from "react-icons/md";
import { z } from "zod"
import { Container } from "../../../components/Container"
import { InputForm } from "../../../components/InputForm"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../services/firebaseConnection";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidV4 } from 'uuid'
import { FaUser } from "react-icons/fa";

const schema = z.object({
  fullname: z.string().optional(),
  birthday: z.string().optional(),
})

type RegisterData = z.infer<typeof schema>

interface ImageProps {
  name: string,
  uid: string,
  previewUrl: string,
  url: string
}

export function CompleteRegister() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [photo, setPhoto] = useState<ImageProps>()
  const { handleSubmit, register, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(schema),
    mode: "onBlur"
  })

  function handleSkip() {
    if (!user) {
      return
    }

    navigate(`/profile/${user.idUser}`)
  }

  async function handleInfoRegister(data: RegisterData) {
    try {
      await updateDoc(doc(db, "users", `${user?.idUser}`), {
        fullname: data.fullname,
        birthday: data.birthday,
        photo: photo
      })
      console.log("INFORMAÇÕES ATUALIZADAS COM SUCESSO.")
      navigate(`/profile/${user?.idUser}`)
    }
    catch (error) {
      console.log(error)
    }
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

  return (
    <Container>
      <div className="min-h-body mt-header w-full flex flex-col justify-center items-center">
        <div className="relative border-1 p-14 rounded-lg pt-24 flex flex-col items-center">
          {!photo && (
            <FaUser size={160} className="absolute rounded-full border-1 p-4 text-slate-300 bg-bg_color -top-24 z-10" />
          )}
          <div className="absolute rounded-full border-1 -top-24 z-10 size-40 overflow-hidden">
            <img
              className="rounded-full object-cover w-full h-full"
              src={photo?.url}
              alt="Foto de Perfil"
            />
          </div>
          <h2 className="text-2xl text-main_color font-semibold mb-10">FALTA POUCO PARA TERMINAR O CADASTRO...</h2>

          <form
            className="w-full max-w-96 text-main_color flex flex-col gap-6 "
            onSubmit={handleSubmit(handleInfoRegister)}
          >
            <div className="w-full">
              <span>Nome Completo</span>
              <InputForm
                type="text"
                name="fullname"
                placeholder="Digite seu nome completo..."
                register={register}
                error={errors.fullname?.message}
              />
            </div>
            <div>
              <span>Data de Nascimento</span>
              <InputForm
                type="date"
                name="birthday"
                placeholder="dd/mm/aaaa"
                register={register}
                error={errors.birthday?.message}
              />
            </div>
            <div>
              <span>Foto de Perfil</span>
              <div className="relative w-full bg-main_color rounded-lg h-11 cursor-pointer">
                <input
                  type="file"
                  accept="image/"
                  onChange={handleFile}
                  className="opacity-0 w-full cursor-pointer h-full rounded-lg"
                />
                <MdFileUpload size={36} className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 cursor-pointer text-bg_color" />
              </div>
            </div>
            <div className="w-full flex justify-end gap-2">
              <button
                className="text-lg bg-main_color text-bg_color px-4 py-0.5 rounded-lg font-medium"
                onClick={() => handleSkip()}
              >PULAR ETAPA</button>
              <button
                type="submit"
                className="text-lg bg-secundary_color text-bg_color px-4 py-0.5 rounded-lg font-medium"
              >SALVAR INFORMAÇÕES</button>

            </div>
          </form>
        </div>

      </div>
    </Container>
  )
}