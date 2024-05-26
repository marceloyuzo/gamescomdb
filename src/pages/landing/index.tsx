import { Container } from "../../components/Container"
import { Link } from "react-router-dom"

export function Landing() {
   return (
      <Container>
         <div className="h-body mt-header flex flex-col justify-center items-center text-2xl gap-2 font-semibold md:text-4xl">
            <h2 className="text-main_color">TODOS OS SEUS JOGOS EM UM LUGAR SÓ</h2>
            <h2 className="text-secundary_color">MAIS ORGANIZADO</h2>
            <h2 className="text-main_color">COMPARTILHAVEL COM SEUS AMIGOS</h2>
            <h2 className="text-secundary_color">SIGA OS SEUS AMIGOS</h2>
            <h2 className="text-main_color">FIQUE POR DENTRO DO QUE JOGARAM</h2>

            <div className="w-full flex justify-center gap-4 text-base mt-6 md:text-xl">
               <Link to="/" className="w-60 max-w-80 bg-main_color rounded-lg py-1 text-center shadow-md md:w-full">
                  SOBRE O PROJETO
               </Link>
               <Link to="/register" className="w-60 max-w-80 bg-secundary_color rounded-lg py-1 text-center shadow-md md:w-full">
                  COMECE A USAR

               </Link>
            </div>
         </div>
         <div className="h-body">
            TESTE
         </div>
      </Container>
   )
}