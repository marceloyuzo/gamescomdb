import logoImg from '../../assets/logoImg.png'
import { IoIosSearch } from "react-icons/io";
import { FaSignInAlt, FaUser } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export function Header() {
   const navigate = useNavigate()
   const [enableInput, setEnableInput] = useState<boolean>(false)
   const [enableNavExpansion, setEnableNavExpansion] = useState<boolean>(false)
   const [searchUser, setSearchUser] = useState<string>("")
   const { user } = useContext(AuthContext)

   function handleInput() {
      if (!enableInput) {
         setEnableInput(true)
         return
      }

      setEnableInput(false)
      return
   }

   function handleNavExpansion() {
      if (!enableNavExpansion) {
         setEnableNavExpansion(true)
         return
      }

      setEnableNavExpansion(false)
      return
   }

   function handleSearch(event: KeyboardEvent) {
      if (event.key === "Enter") {
         navigate(`/users?username=${searchUser}`)
         setSearchUser("")
      }
   }

   return (
      <header className='fixed w-full top-0 z-20 h-header flex items-center bg-bg_color'>
         <div className='flex justify-between items-center w-full max-w-6xl mx-auto px-4'>
            <Link to="/">
               <img
                  src={logoImg}
                  alt="Logo do site"
                  className='w-auto cursor-pointer'
               />
            </Link>

            <nav className='flex items-center gap-10 text-main_color'>
               <ul className='flex gap-6 text-lg '>
                  <li
                     className='relative cursor-pointer rounded-lg hover:border-1'
                  >
                     <div
                        className='flex items-center justify-center gap-1 px-4 py-1'
                        onMouseEnter={handleNavExpansion}
                     >
                        NAVEGAR
                        <IoIosArrowDown
                           size={18}
                           className='text-main_color'
                        />
                     </div>

                     {enableNavExpansion && (
                        <div
                           className='absolute w-full flex flex-col justify-center text-center left-0 top-0 pt-11 rounded-lg'
                           onMouseLeave={handleNavExpansion}
                        >
                           <span className='bg-bg_color py-2 hover:bg-main_color hover:text-bg_color block sm:hidden transition duration-300'>SOBRE</span>
                           <span className='bg-bg_color py-2 hover:bg-main_color hover:text-bg_color transition duration-300 rounded-b-lg'
                              onClick={() => navigate("/users")}
                           >USERS</span>
                        </div>
                     )}

                  </li>
                  <li
                     className='items-center gap-1 cursor-pointer py-1 px-4 rounded-lg hover:border-1 hidden sm:block'
                     onClick={() => navigate("/#about")}
                  >
                     SOBRE
                  </li>
               </ul>

               <div className='flex items-center'>
                  {enableInput ? (
                     <input
                        type="text"
                        placeholder='Pesquisar Usuário...'
                        onBlur={handleInput}
                        className="py-1 px-3 rounded-lg min-w-52 bg-bg_color border-main_color border-1 outline-none"
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        onKeyDown={(e) => handleSearch(e.nativeEvent)}
                     />
                  ) : (
                     <IoIosSearch
                        size={28}
                        className='text-main_color cursor-pointer'
                        onClick={handleInput}
                     />
                  )}
               </div>

               {user ? (
                  <Link to={`/profile/${user.idUser}`}>
                     <FaUser
                        size={28}
                        className='text-main_color cursor-pointer'
                     />
                  </Link>
               ) : (
                  <Link to="/login">
                     <FaSignInAlt
                        size={28}
                        className='text-main_color cursor-pointer'
                     />
                  </Link>
               )}
            </nav>
         </div>

      </header>
   )
}