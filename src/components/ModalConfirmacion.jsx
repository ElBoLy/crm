import { useEffect, useState } from 'react'

export default function ModalConfirmacion({ visible, mensaje, onConfirm, onCancel, soloConfirmar = false }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible) {
      setTimeout(() => setShow(true), 10)
    } else {
      setShow(false)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300 ${
        show ? 'bg-black/50 opacity-100' : 'bg-black/0 opacity-0'
      }`}
    >
      <div
        className={`bg-white p-6 rounded-xl shadow-xl max-w-sm w-full transform transition-all duration-300 ${
          show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">{mensaje}</h2>
        <div className="flex justify-end gap-3">
          {!soloConfirmar && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-all duration-300 ease-in-out"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#4f772d] text-white rounded hover:bg-[#3d5a1f] transition-all duration-300 ease-in-out"
          >
            {soloConfirmar ? "Aceptar" : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  )
}
