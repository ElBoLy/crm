import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Mail, User } from 'lucide-react'
import { generarPDFPerfilCliente } from '../utils/pdfPerfilCliente'

export default function PerfilCliente() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({ nombre: '', email: '', productos: [] })
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false)
  const [mostrarConfirmacionGuardado, setMostrarConfirmacionGuardado] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)

  useEffect(() => {
    const storedClientes = JSON.parse(localStorage.getItem('clientes')) || []
    const storedProductos = JSON.parse(localStorage.getItem('productos')) || []
    const cliente = storedClientes.find(c => c.id === Number(id))

    if (cliente) setForm(cliente)

    setClientes(storedClientes)
    setProductos(storedProductos)
  }, [id])

  const handleGuardar = () => {
    const actualizados = clientes.map(c =>
      c.id === Number(id) ? form : c
    )
    setClientes(actualizados)
    localStorage.setItem('clientes', JSON.stringify(actualizados))
    setModoEdicion(false)
    setMostrarConfirmacionGuardado(true) // Mostrar modal guardado
  }

  const cerrarModalGuardado = () => {
    setMostrarConfirmacionGuardado(false)
  }

  const handleEliminar = () => {
    const actualizados = clientes.filter(c => c.id !== Number(id))
    localStorage.setItem('clientes', JSON.stringify(actualizados))
    navigate('/clientes')
  }

  const handleRegresar = () => {
    navigate('/clientes')
  }

  const toggleProducto = (productoId) => {
    const isSelected = form.productos.includes(productoId)
    const nuevos = isSelected
      ? form.productos.filter(pid => pid !== productoId)
      : [...form.productos, productoId]
    setForm({ ...form, productos: nuevos })
  }

  const handleDescargarPDF = () => {
    const productosCliente = productos.filter(p => form.productos.includes(p.id))
    generarPDFPerfilCliente(form, productosCliente)
  }

  if (!form) return <p className="p-6 text-gray-600">Cliente no encontrado.</p>

  return (
    <div className="p-6 space-y-6 relative">
      <h1 className="text-3xl font-bold text-[#4f772d]">
        {modoEdicion ? 'Editar Cliente' : 'Perfil del Cliente'}
      </h1>

      <div className="space-y-4 bg-gray-50 p-6 rounded-xl shadow">
        {modoEdicion ? (
          <>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <User className="text-gray-500 mr-2" size={18} />
                Nombre
              </label>
              <input
                type="text"
                className="w-full border-b-2 border-gray-300 bg-transparent p-2 focus:outline-none focus:border-[#4f772d] transition"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>

            <div className="mt-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Mail className="text-gray-500 mr-2" size={18} />
                Email
              </label>
              <input
                type="email"
                className="w-full border-b-2 border-gray-300 bg-transparent p-2 focus:outline-none focus:border-[#4f772d] transition"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <h2 className="font-semibold mb-2">Productos asignados</h2>
              <div className="flex flex-wrap gap-2">
                {productos.map((producto) => {
                  const isSelected = form.productos.includes(producto.id)
                  return (
                    <button
                      key={producto.id}
                      type="button"
                      onClick={() => toggleProducto(producto.id)}
                      className={`px-3 py-1 rounded border text-sm font-medium transition
                        ${isSelected
                          ? 'bg-[#4f772d] text-white border-[#31572c]'
                          : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100 cursor-pointer'}`}
                    >
                      {producto.nombre}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleGuardar}
                className="bg-[#4f772d] text-white rounded hover:bg-[#3d5a1f] transition
                            text-sm sm:text-base px-2 py-1 sm:px-4 sm:py-2"
              >
                Guardar cambios
              </button>
              <button
                onClick={() => setMostrarConfirmacionEliminar(true)}
                className="bg-red-600 text-white rounded hover:bg-red-700 transition
                            text-sm sm:text-base px-2 py-1 sm:px-4 sm:py-2"
              >
                Eliminar
              </button>
              <button
                onClick={() => setModoEdicion(false)}
                className="bg-gray-400 text-white rounded hover:bg-gray-500 transition
                            text-sm sm:text-base px-2 py-1 sm:px-4 sm:py-2"
              >
                Cancelar edición
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <User className="text-gray-500 mr-2" size={18} />
                Nombre
              </label>
              <p className="text-lg text-gray-800 border-b border-gray-300 pb-1">{form.nombre}</p>
            </div>

            <div className="mt-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Mail className="text-gray-500 mr-2" size={18} />
                Email
              </label>
              <p className="text-lg text-gray-800 border-b border-gray-300 pb-1">{form.email}</p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Productos asignados</h2>
              <ul className="list-disc list-inside text-gray-800 text-sm">
                {form.productos.length > 0
                  ? form.productos.map(pid => (
                      <li key={pid}>
                        {productos.find(p => p.id === pid)?.nombre || 'Producto eliminado'}
                      </li>
                    ))
                  : <li className="text-gray-500">Sin productos asignados</li>}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDescargarPDF}
                className="bg-[#4f772d] text-white rounded hover:bg-[#3d5a1f] transition
                            text-sm sm:text-base px-2 py-1 sm:px-4 sm:py-2"
              >
                Descargar PDF
              </button>
              <button
                onClick={() => setModoEdicion(true)}
                className="bg-[#4f772d] text-white rounded hover:bg-[#3d5a1f] transition
                            text-sm sm:text-base px-2 py-1 sm:px-4 sm:py-2"
              >
                Modificar
              </button>
              <button
                onClick={handleRegresar}
                className="bg-gray-400 text-white rounded hover:bg-gray-500 transition
                            text-sm sm:text-base px-2 py-1 sm:px-4 sm:py-2"
              >
                Regresar
              </button>
            </div>
          </>
        )}
      </div>

      {mostrarConfirmacionEliminar && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full transform scale-95 animate-fadeIn transition">
            <h2 className="text-xl font-semibold mb-4">¿Estás seguro de eliminar este cliente?</h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarConfirmacionEliminar(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarConfirmacionGuardado && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full transform scale-95 animate-fadeIn transition">
            <h2 className="text-xl font-semibold mb-4">Perfil actualizado</h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={cerrarModalGuardado}
                className="px-4 py-2 bg-[#4f772d] text-white rounded hover:bg-[#3d5a1f] transition"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
