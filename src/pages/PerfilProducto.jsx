import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Tag, FileText, DollarSign, Image } from 'lucide-react'

export default function PerfilProducto() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [productos, setProductos] = useState([])
  const [producto, setProducto] = useState(null)
  const [editando, setEditando] = useState(false)

  useEffect(() => {
    const storedProductos = JSON.parse(localStorage.getItem('productos')) || []
    setProductos(storedProductos)

    const encontrado = storedProductos.find(p => p.id === Number(id))
    setProducto(encontrado || null)
  }, [id])

  const handleInput = (e) => {
    const { name, value } = e.target
    setProducto({ ...producto, [name]: value })
  }

  const guardarCambios = () => {
    const actualizados = productos.map(p =>
      p.id === producto.id ? producto : p
    )
    setProductos(actualizados)
    localStorage.setItem('productos', JSON.stringify(actualizados))
    setEditando(false)
  }

  if (!producto) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-600">Producto no encontrado</h1>
        <button
          onClick={() => navigate('/productos')}
          className="mt-4 bg-[#4f772d] text-white px-4 py-2 rounded"
        >
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Título principal */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Perfil del producto</h1>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <img
          src={producto.imagen || 'https://via.placeholder.com/200'}
          alt={producto.nombre}
          className="w-full h-60 object-cover rounded mb-4"
        />

        {editando ? (
          <div className="space-y-6">
            {/* Nombre */}
            <div className="flex items-center">
              <Tag className="w-5 h-5 mr-3 text-gray-500" />
              <input
                name="nombre"
                value={producto.nombre}
                onChange={handleInput}
                placeholder="Nombre del producto"
                className="w-full border-b border-gray-300 focus:border-[#4f772d] outline-none px-1 py-1"
              />
            </div>

            {/* Descripción */}
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3 text-gray-500" />
              <input
                name="descripcion"
                value={producto.descripcion}
                onChange={handleInput}
                placeholder="Descripción"
                className="w-full border-b border-gray-300 focus:border-[#4f772d] outline-none px-1 py-1"
              />
            </div>

            {/* Precio */}
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-3 text-gray-500" />
              <input
                type="number"
                name="precio"
                value={producto.precio}
                onChange={handleInput}
                placeholder="Precio"
                className="w-full border-b border-gray-300 focus:border-[#4f772d] outline-none px-1 py-1"
              />
            </div>

            {/* Imagen */}
            <div className="flex items-center">
              <Image className="w-5 h-5 mr-3 text-gray-500" />
              <input
                name="imagen"
                value={producto.imagen}
                onChange={handleInput}
                placeholder="URL de la imagen"
                className="w-full border-b border-gray-300 focus:border-[#4f772d] outline-none px-1 py-1"
              />
            </div>

            {/* Botones en modo edición */}
            <div className="flex justify-between mt-4">
              <button
                onClick={guardarCambios}
                className="bg-[#4f772d] text-white px-4 py-2 rounded hover:bg-[#3d5a1f] cursor-pointer transition-colors duration-300 ease-in-out"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => navigate('/productos')}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer transition-colors duration-300 ease-in-out"
              >
                ← Volver a productos
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-2">{producto.nombre}</h2>
            <p className="text-gray-600 mb-2">{producto.descripcion}</p>
            <p className="text-green-700 font-semibold text-lg mb-4">
              ${producto.precio}
            </p>

            {/* Botones en modo lectura */}
            <div className="flex justify-between">
              <button
                onClick={() => setEditando(true)}
                className="bg-[#4f772d] text-white px-4 py-2 rounded hover:bg-[#3d5a1f] cursor-pointer transition-colors duration-300 ease-in-out"
              >
                Editar
              </button>
              <button
                onClick={() => navigate('/productos')}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer transition-colors duration-300 ease-in-out"
              >
                ← Volver a productos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
