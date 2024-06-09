import { Container } from "../../components/Container"
import { Link, useLocation, useNavigate } from "react-router-dom"
import userPage from '../../assets/User Page.png'
import gameDetailPage from '../../assets/Game Detail Page.png'
import listGamesPage from '../../assets/List Games Page.png'
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { Card } from "../../components/Card";
import { useEffect } from "react"

export function Landing() {
   const navigate = useNavigate()
   const location = useLocation();

   useEffect(() => {
      const hash = location.hash;
      if (hash) {
         const element = document.querySelector(hash);
         if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
         }
      }

      if (!hash) {
         window.scrollTo({ top: 0, behavior: 'smooth' });

      }
   }, [location]);

   return (
      <Container>
         <div className="h-body mt-header flex flex-col justify-center items-center text-2xl gap-2 font-semibold md:text-4xl">
            <h2 className="text-main_color">TODOS OS SEUS JOGOS EM UM LUGAR SÓ</h2>
            <h2 className="text-secundary_color">MAIS ORGANIZADO</h2>
            <h2 className="text-main_color">COMPARTILHAVEL COM SEUS AMIGOS</h2>
            <h2 className="text-secundary_color">SIGA OS SEUS AMIGOS</h2>
            <h2 className="text-main_color">FIQUE POR DENTRO DO QUE JOGARAM</h2>

            <div className="w-full flex justify-center gap-4 text-base mt-6 md:text-xl">
               <button
                  className="w-60 max-w-80 bg-main_color rounded-lg py-1 text-center shadow-md md:w-full"
                  onClick={() => navigate("/#about")}
               >
                  SOBRE O PROJETO
               </button>
               <Link to="/register" className="w-60 max-w-80 bg-secundary_color text-main_color font-medium rounded-lg py-1 text-center shadow-md md:w-full">
                  COMECE A USAR

               </Link>
            </div>
         </div>
         <div className="h-body flex flex-col justify-center items-center gap-5 w-full">
            <h1 className="text-main_color text-4xl">FEATURES</h1>
            <div className="w-full max-w-96 h-0.5 bg-main_color mb-16"></div>
            <div className="flex justify-center items-center gap-20 transition-all">
               <Card img={userPage} title={"PERFIL CUSTOM"} />
               <Card img={gameDetailPage} title={"INFORMAÇÕES DOS JOGOS"} />
               <Card img={listGamesPage} title={"LISTA DE JOGOS PRÓPRIA"} />
            </div>
         </div>
         <div className="h-dvh pt-header flex justify-center items-center w-full gap-20" id="about">
            <div className="text-2xl flex flex-col justify-center items-center text-main_color gap-3 text-justify w-2/3">
               <h1 className="text-main_color text-4xl">SOBRE O PROJETO</h1>
               <div className="w-full max-w-96 h-0.5 bg-main_color mb-16"></div>
               <p className="indent-4">O projeto GAMESCOMDB começou com um trabalho na universidade, com o objetivo de criar um banco de dados no contexto que o grupo escolhesse. Com inspiração em databases como myanimelist e letterbox, decidimos criar um no tema de jogos.</p>
               <p className="indent-4">Como o trabalho pediu apenas o banco de dados, o projeto ficou abstrato, então com objetivo de treinar os fundamentos de desenvolvimento web com React, Typescript e Tailwind vistos em curso, decidi continuar o projeto e dar uma forma "física", a base teve que sofrer algumas modificações por não ser práticos, detalhes que não é fácil perceber ficando apenas no abstrato.</p>
               <p className="indent-4">O projeto GAMESCOMDB tem como objetivo organizar todos os seus jogos em um perfil compartilhável, aqueles jogos que você jogou faz muito tempo e já não lembra de jeito nenhum do nome ou em qual plataforma procurar, com o GAMESCOMDB estará registrado em seu perfil todos os jogos, suas opiniões e quais são os favoritos.</p>
               <p className="indent-4">O projeto planeja ter um sistema de seguidores, onde você consegue seguir os seus amigos e acompanhar suas atividades (todos as modificações ou adições que você fizer em algum jogo, vai aparecer em uma página de TIMELINE para todos que te seguem, com opção de não querer compartilhar também).</p>
            </div>
            <div className="w-1/3 flex flex-col justfiy-center items-center">
               <div className="flex gap-4 text-main_color opacity-40">
                  <FaGithub size={90} />
                  <FaLinkedin size={90} />
                  <FaInstagram size={90} />
               </div>
               <h2 className="text-2xl text-main_color mt-2">MEIOS DE CONTATO</h2>
            </div>
         </div>

      </Container>
   )
}