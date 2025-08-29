import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ModalPerfil({ isOpen, onConfirm, onCancel, mensaje }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 10)
    } else {
      setShow(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-100 ${
        show ? 'bg-black/50 opacity-100' : 'bg-black/0 opacity-0'
      }`}
    >
      <div
        className={`bg-white rounded-xl shadow-lg p-6 max-w-sm w-full relative transform transition-all duration-300 ${
          show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Boton cerrar */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-all duration-300 ease-in-out cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Mensaje */}
        <p className="text-gray-800 mb-6">{mensaje}</p>

        {/* Botones de accion */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded transition-all duration-300 ease-in-out hover:bg-gray-400 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#4f772d] text-white px-4 py-2 rounded transition-all duration-300 ease-in-out hover:bg-[#3d5a1f] cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
