import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";


export function Footer() {
   return (
      <footer className="border-t-0.5 h-40 w-full flex flex-col justify-center items-center gap-3 mt-20">
         <div className="flex gap-4 text-main_color">
            <FaGithub size={38} />
            <FaLinkedin size={38} />
            <FaInstagram size={38} />
         </div>
         <span className="text-main_color ">Copyright © 2024 - Created by marceloyuzo</span>
      </footer>
   )
}