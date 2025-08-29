import { useState, useEffect } from 'react'
import { Tag, FileText, DollarSign, Image } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '', precio: '', imagen: '' })
  const navigate = useNavigate()

  useEffect(() => {
    const storedProductos = JSON.parse(localStorage.getItem('productos')) || []
    setProductos(storedProductos)
  }, [])

  useEffect(() => {
    localStorage.setItem('productos', JSON.stringify(productos))
  }, [productos])

  const handleInput = (e) => {
    const { name, value } = e.target
    setNuevo({ ...nuevo, [name]: value })
  }

  const agregarProducto = () => {
    if (!nuevo.nombre || !nuevo.precio) return
    setProductos([...productos, { ...nuevo, id: Date.now() }])
    setNuevo({ nombre: '', descripcion: '', precio: '', imagen: '' })
  }

  const eliminarProducto = (id) => {
    setProductos(productos.filter(p => p.id !== id))
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-[#4f772d]">Productos</h1>

      {/* Formulario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center border rounded px-3 py-2 border-gray-300 shadow bg-white">
          <Tag className="w-4 h-4 mr-2 text-gray-500" />
          <input
            name="nombre"
            value={nuevo.nombre}
            onChange={handleInput}
            placeholder="Nombre"
            className="w-full outline-none"
          />
        </div>

        <div className="flex items-center border rounded px-3 py-2 border-gray-300 shadow bg-white">
          <FileText className="w-4 h-4 mr-2 text-gray-500" />
          <input
            name="descripcion"
            value={nuevo.descripcion}
            onChange={handleInput}
            placeholder="Descripción"
            className="w-full outline-none"
          />
        </div>

        <div className="flex items-center border rounded px-3 py-2 border-gray-300 shadow bg-white">
          <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
          <input
            name="precio"
            type="number"
            value={nuevo.precio}
            onChange={handleInput}
            placeholder="Precio"
            className="w-full outline-none"
          />
        </div>

        <div className="flex items-center border rounded px-3 py-2 border-gray-300 shadow bg-white">
          <Image className="w-4 h-4 mr-2 text-gray-500" />
          <input
            name="imagen"
            value={nuevo.imagen}
            onChange={handleInput}
            placeholder="URL de la imagen"
            className="w-full outline-none"
          />
        </div>
      </div>

      <button
        onClick={agregarProducto}
        className="bg-[#4f772d] text-white px-4 py-2 rounded hover:bg-[#3d5a1f] mb-8 cursor-pointer transition-colors duration-300 ease-in-out"
      >
        Agregar Producto
      </button>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map((producto) => (
          <div key={producto.id} className="border rounded-lg p-4 bg-white relative border-gray-300 shadow">
            <img
              src={producto.imagen || 'https://via.placeholder.com/150'}
              alt={producto.nombre}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h2 className="text-lg font-bold">{producto.nombre}</h2>
            <p className="text-sm text-gray-600">{producto.descripcion}</p>
            <p className="text-green-700 font-semibold mt-2">${producto.precio}</p>

            <div className="mt-4 flex justify-between ">
              <button
                onClick={() => navigate(`/productos/${producto.id}`)}
                className="px-3 py-1 text-sm bg-[#4f772d] text-white rounded hover:bg-[#3d5a1f] cursor-pointer transition-colors duration-300 ease-in-out "
              >
                Ver Producto
              </button>
              <button
                onClick={() => eliminarProducto(producto.id)}
                className="px-3 py-1 text-sm bg-[#31572c] text-white rounded hover:bg-gray-400 cursor-pointer transition-colors duration-300 ease-in-out"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
