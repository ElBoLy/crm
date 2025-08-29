import { useEffect, useState } from 'react'
import { Mail, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AgregarCliente() {
  const [form, setForm] = useState({ nombre: '', email: '', productos: [] })
  const [productosDisponibles, setProductosDisponibles] = useState([])
  const [clientes, setClientes] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const storedClientes = JSON.parse(localStorage.getItem('clientes')) || []
    const storedProductos = JSON.parse(localStorage.getItem('productos')) || []
    setClientes(storedClientes)
    setProductosDisponibles(storedProductos)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newCliente = { ...form, id: Date.now() }
    const updatedClientes = [...clientes, newCliente]
    setClientes(updatedClientes)
    localStorage.setItem('clientes', JSON.stringify(updatedClientes))
    navigate('/clientes')
  }

  const toggleProducto = (id) => {
    const isSelected = form.productos.includes(id)
    const updatedProductos = isSelected
      ? form.productos.filter(pid => pid !== id)
      : [...form.productos, id]
    setForm({ ...form, productos: updatedProductos })
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-[#4f772d]">Agregar Cliente</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#4f772d] transition">
            <User className="text-gray-500 mr-2" size={20} />
            <input
              type="text"
              className="w-full bg-transparent p-2 focus:outline-none"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
        </div>
    
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Email</label>
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#4f772d] transition">
            <Mail className="text-gray-500 mr-2" size={20} />
            <input
              type="email"
              className="w-full bg-transparent p-2 focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Asignar Productos</h2>
          <div className="flex flex-wrap gap-2">
            {productosDisponibles.map((producto) => {
              const isSelected = form.productos.includes(producto.id)
              return (
                <button
                  type="button"
                  key={producto.id}
                  onClick={() => toggleProducto(producto.id)}
                  className={`px-3 py-1 rounded border transition text-sm font-medium
                    ${isSelected 
                      ? 'bg-green-600 text-white border-green-700' 
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100 cursor-pointer'}`}
                >
                  {producto.nombre}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-[#4f772d] text-white px-4 py-2 rounded hover:bg-[#3d5a1f] cursor-pointer transition-colors duration-300 ease-in-out"
          >
            Guardar Cliente
          </button>
          <button
            type="button"
            onClick={() => navigate('/clientes')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer transition-colors duration-300 ease-in-out"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
