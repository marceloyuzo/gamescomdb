import { Container } from "../../components/Container"
import { FcGoogle } from "react-icons/fc";
import { InputForm } from "../../components/InputForm"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { auth } from "../../services/firebaseConnection";
import { browserLocalPersistence, browserSessionPersistence, setPersistence, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/cordova";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const schemaUser = z.object({
   email: z.string().email("Digite um email válido").min(1, "O campo email é obrigatório"),
   password: z.string().min(1, "O campo senha é obrigatório"),
   remember: z.boolean().optional()
})

type FormUser = z.infer<typeof schemaUser>


export function Login() {
   const navigate = useNavigate()
   const { user } = useContext(AuthContext)
   const { register, handleSubmit, formState: { errors } } = useForm<FormUser>({
      resolver: zodResolver(schemaUser),
      mode: "onBlur"
   })

   useEffect(() => {
      if (user) {
         navigate(`/profile/${user.idUser}`)
      }
   }, [user])

   async function handleLoginWithGoogle() {
      // try {
      //    const provider = new GoogleAuthProvider();
      //    const result = await signInWithPopup(auth, provider)
      //       .then((usercredential) => {
      //          console.log("LOGADO COM SUCESSO");
      //          navigate("/");
      //       })
      // } catch (error) {
      //    console.error("Erro ao fazer login com o Google:", error);
      // }
   }

   function handleLoginWithEmail(data: FormUser) {

      const persistence = data.remember ? browserLocalPersistence : browserSessionPersistence

      setPersistence(auth, persistence)
         .then(() => {
            return signInWithEmailAndPassword(auth, data.email, data.password)
         })
   }



   return (
      <Container>
         <div className="h-body mt-header flex flex-col justify-center items-center">
            <h1 className="text-4xl text-main_color font-semibold mb-10">TENHO CADASTRO</h1>

            <form
               className="max-w-96 w-full text-main_color flex flex-col gap-4"
               onSubmit={handleSubmit(handleLoginWithEmail)}
            >
               <div>
                  <span>Email</span>
                  <InputForm
                     name="email"
                     type="email"
                     placeholder="Digite seu email..."
                     register={register}
                     error={errors.email?.message}
                  />
               </div>
               <div>
                  <span>Senha</span>
                  <InputForm
                     name="password"
                     type="password"
                     placeholder="*************"
                     register={register}
                     error={errors.password?.message}
                  />
               </div>

               <div>
                  <input
                     className="mr-2 mt-2 rounded-lg"
                     type="checkbox"
                     id="remember"
                     {...register("remember")}
                  />
                  Mantenha-se conectado
               </div>

               <button className="w-full bg-secundary_color text-bg_color font-bold rounded-md h-11 px-2 mt-4">INICIAR SESSÃO</button>
               <div className="mx-auto -mt-3">
                  Não possui conta ? <Link to="/register" className="text-secundary_color">Cadastra-se</Link> agora
               </div>
            </form>

            <div className="w-full max-w-96 flex mt-5 items-center justify-center text-main_color">
               <div className="h-px w-full bg-gray-300"></div>
               <span className="text-nowrap mx-2">ou acesse com</span>
               <div className="h-px w-full bg-gray-300"></div>
            </div>

            <button
               className="w-full max-w-96 bg-main_color text-bg_color rounded-md h-11 px-2 mt-4 flex justify-center items-center gap-2"
               onClick={handleLoginWithGoogle}
            >
               <FcGoogle size={28} />
               <span className="text-xl">Google</span>
            </button>
         </div>

      </Container>
   )
}