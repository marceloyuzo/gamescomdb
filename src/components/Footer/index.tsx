import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";


export function Footer() {
   return (
      <footer className="border-t-0.5 h-40 w-full flex flex-col justify-center items-center gap-3 mt-20">
         <div className="flex gap-4 text-main_color">
            <a href="https://github.com/marceloyuzo" target="_blank">
               <FaGithub size={38} />
            </a>
            <a href="https://www.linkedin.com/in/marcelo-yuzo-itami-0a79a2263/" target="_blank">
               <FaLinkedin size={38} />
            </a>
            <a href="https://www.instagram.com/marceloyuzo/" target="_blank">
               <FaInstagram size={38} />
            </a>
         </div>
         <span className="text-main_color ">Copyright © 2024 - Created by marceloyuzo</span>
      </footer>
   )
}