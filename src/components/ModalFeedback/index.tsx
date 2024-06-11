import { useEffect } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const ModalFeedback = ({ enableFeedback, onClose, sucess, text, linkref }: { enableFeedback: boolean, onClose: () => void, sucess: boolean, text: string, linkref: string }) => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (enableFeedback) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [enableFeedback]);

  function handleNavigation() {
    if (location.pathname === linkref) {
      window.location.reload()
    } else {
      navigate(linkref)
    }
  }

  if (!enableFeedback) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10"></div>
      <div className="text-main_color bg-bg_color rounded-lg w-full fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20 flex justify-center max-w-xl p-6 flex-col items-center gap-5">
        {sucess ? (
          <FaRegCheckCircle size={72} className="text-green-600" />
        ) : (
          <MdErrorOutline size={72} className="text-yellow-300" />
        )}
        <h1 className="text-2xl">{text}</h1>
        <button
          className="border-1 text-lg px-4 py-1 rounded-lg mt-5 cursor-pointer"
          onClick={() => {
            onClose
            handleNavigation()
          }}
        >
          Fechar
        </button>
      </div >
    </>
  )
}

export default ModalFeedback