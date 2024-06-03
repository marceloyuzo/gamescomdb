import { Container } from "../../components/Container"
import { InputForm } from "../../components/InputForm"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { auth } from "../../services/firebaseConnection"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { db } from "../../services/firebaseConnection"
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

const schemaUser = z.object({
   username: z.string().min(1, "O campo usuário é obrigatório"),
   email: z.string().email("Digite um email válido").min(0, "O campo email é obrigatório"),
   password: z.string().min(8, "A senha é muito curta"),
   confirmPassword: z.string()
})
   .refine((data) => data.confirmPassword === data.password, {
      message: "A senha não está igual.",
      path: ["confirmPassword"]
   })

type FormData = z.infer<typeof schemaUser>

export function Register() {
   const navigate = useNavigate()
   const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
      resolver: zodResolver(schemaUser),
      mode: "onBlur"
   })

   async function registerSubmit(data: FormData) {
      const usersRef = collection(db, "users")
      const queryRef = query(usersRef, where("username", "==", data.username))

      const snapshot = await getDocs(queryRef)
      if (!snapshot.empty) {
         console.log("JA EXISTE UM USUARIO COM ESSE USERNAME")
         return
      }

      createUserWithEmailAndPassword(auth, data.email, data.password)
         .then((UserCredential) => {
            const user = UserCredential.user
            const userRef = doc(db, "users", `${user.uid}`)
            setDoc(userRef, {
               idUser: user.uid,
               email: user.email,
               username: data.username,
               privacy: "PUBLIC",
               fullname: null,
               description: null,
               photo: null,
               wishes: null,
               birthday: null,
               dateCreated: new Date(),
            })

            updateProfile(user, {
               displayName: data.username
            })
            console.log("REGISTRADO COM SUCESSO")
            navigate('/register/almost')
         })
         .catch((error) => {
            console.log("ALGUMA COISA DEU ERRADO NO CADASTRO", error)
         })


   }

   return (
      <Container>
         <div className="h-body mt-header w-full flex flex-col justify-center items-center">
            <h1 className="text-4xl text-main_color font-semibold mb-10">QUERO FAZER O CADASTRO</h1>
            <form
               className="w-full max-w-96 text-main_color flex flex-col gap-6"
               onSubmit={handleSubmit(registerSubmit)}
            >
               <div>
                  <span>Username</span>
                  <InputForm
                     type="text"
                     name="username"
                     placeholder="Digite seu username..."
                     register={register}
                     error={errors.username?.message}
                  />
               </div>
               <div>
                  <span>Email</span>
                  <InputForm
                     type="text"
                     name="email"
                     placeholder="Digite seu email..."
                     register={register}
                     error={errors.email?.message}
                  />
               </div>
               <div>
                  <span>Senha</span>
                  <InputForm
                     type="password"
                     name="password"
                     placeholder="**************"
                     register={register}
                     error={errors.password?.message}
                  />
               </div>
               <div>
                  <span>Confirmar Senha</span>
                  <InputForm
                     type="password"
                     name="confirmPassword"
                     placeholder="**************"
                     register={register}
                     error={errors.confirmPassword?.message}
                  />
               </div>

               <button className="w-full bg-secundary_color text-bg_color font-bold rounded-md h-11 px-2 mt-4">REALIZAR CADASTRO</button>
            </form>
         </div>
      </Container>
   )
}