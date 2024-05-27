import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { Container } from "../../components/Container"
import { SideMenu } from "../../components/SideMenu"

export function Profile() {
   const { user } = useContext(AuthContext)

   return (
      <Container>
         <main className="h-body mt-header w-full flex gap-4 justify-center items-start py-16">
            <SideMenu></SideMenu>
            <div className="w-full flex flex-col gap-4 justify-start items-start">
               <section className="w-full p-6 flex flex-col border-1 rounded-lg">
                  <div className="flex justify-between items-center w-full mb-4">
                     <h2 className="text-2xl text-main_color">JOGOS FAVORITOS</h2>
                     <button className="text-lg bg-main_color px-4 py-0.5 rounded-lg font-medium">VER MAIS</button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 md:grid-cols-2">
                     <div className="flex flex-col justify-center items-center gap-1">
                        <img
                           className=""
                           src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1716311593"
                           alt="Foto do Jogo Favorito"
                        />
                        <span className="text-lg text-main_color">ELDEN RING</span>
                     </div>
                     <div className="flex flex-col justify-center items-center gap-1">
                        <img
                           className=""
                           src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1716311593"
                           alt="Foto do Jogo Favorito"
                        />
                        <span className="text-lg text-main_color">ELDEN RING</span>
                     </div>
                     <div className="flex flex-col justify-center items-center gap-1">
                        <img
                           className=""
                           src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1716311593"
                           alt="Foto do Jogo Favorito"
                        />
                        <span className="text-lg text-main_color">ELDEN RING</span>
                     </div>
                  </div>
               </section>
               <section className="w-full p-6 flex flex-col border-1 rounded-lg">
                  <div className="flex justify-between items-center w-full mb-4">
                     <h2 className="text-2xl text-main_color">REVIEWS</h2>
                     <button className="text-lg bg-main_color px-4 py-0.5 rounded-lg font-medium">VER MAIS</button>
                  </div>
                  <div className="w-full flex gap-4">
                     <div className="flex flex-col gap-1 w-1/2 text-main_color">
                        <img
                           src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1716311593"
                           alt="Foto do Review"
                        />
                        <span className="text-lg text-main_color text-center">ELDEN RING</span>
                        <div>
                           <span className="text-secundary_color">Data de Lançamento: </span> 14 Jan, 2022
                        </div>
                        <div>
                           <span className="text-secundary_color">Editora: </span> PlayStation PC LLC
                        </div>
                        <div>
                           <span className="text-secundary_color">Desenvolvedora: </span> Santa Monica Studio
                        </div>
                        <div>
                           <span className="text-secundary_color">Status: </span> Completo
                        </div>
                        <div>
                           <span className="text-secundary_color">Data Criado (Review): </span>24 Mai, 2024
                        </div>
                     </div>
                     <div className="w-1/2 text-2xl flex justify-center items-center text-main_color text-justify">
                        <p>“Bom de guerra vale muito na promoção, impossível alguém não gostar e perder a oportunidade de testar agora no seu PC rodando mais bonito que no console 25 horas primeira run, 40 horas platinado.”</p>
                     </div>
                  </div>
               </section>
               <section className="w-full p-6 flex flex-col border-1 rounded-lg">
                  <div className="flex justify-between items-center w-full mb-4">
                     <h2 className="text-2xl text-main_color">LISTA DE JOGOS</h2>
                     <button className="text-lg bg-main_color px-4 py-0.5 rounded-lg font-medium">VER MAIS</button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 md:grid-cols-2">
                     <div className="flex flex-col justify-center items-center gap-1">
                        <img
                           className=""
                           src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1716311593"
                           alt="Foto do Jogo Favorito"
                        />
                        <span className="text-lg text-main_color">ELDEN RING</span>
                     </div>
                     <div className="flex flex-col justify-center items-center gap-1">
                        <img
                           className=""
                           src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1716311593"
                           alt="Foto do Jogo Favorito"
                        />
                        <span className="text-lg text-main_color">ELDEN RING</span>
                     </div>
                     <div className="flex flex-col justify-center items-center gap-1">
                        <img
                           className=""
                           src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1716311593"
                           alt="Foto do Jogo Favorito"
                        />
                        <span className="text-lg text-main_color">ELDEN RING</span>
                     </div>
                     <div className="flex flex-col justify-center items-center gap-1">
                        <img
                           className=""
                           src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1716311593"
                           alt="Foto do Jogo Favorito"
                        />
                        <span className="text-lg text-main_color">ELDEN RING</span>
                     </div>
                     <div className="flex flex-col justify-center items-center gap-1">
                        <img
                           className=""
                           src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1716311593"
                           alt="Foto do Jogo Favorito"
                        />
                        <span className="text-lg text-main_color">ELDEN RING</span>
                     </div>
                     <div className="flex flex-col justify-center items-center gap-1">
                        <img
                           className=""
                           src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1716311593"
                           alt="Foto do Jogo Favorito"
                        />
                        <span className="text-lg text-main_color">ELDEN RING</span>
                     </div>
                  </div>

               </section>
            </div>
         </main>
      </Container>
   )
}