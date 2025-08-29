import { useEffect, useState } from 'react'
import { Mail, User, Phone, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import ModalPerfil from '../components/ModalPerfil'

export default function Perfil() {
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [modalOpen, setModalOpen] = useState(false) 
  const navigate = useNavigate()


  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUsuario({
          nombre: user.user_metadata?.full_name || '',
          email: user.email,
          telefono: user.user_metadata?.telefono || '',
          password: ''
        })
      } else {
        navigate('/login')
      }
    }
    fetchUser()
  }, [navigate])

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Actualizar metadata
      const updates = { data: { full_name: usuario.nombre, telefono: usuario.telefono } }
      const { error: metaError } = await supabase.auth.updateUser(updates)
      if (metaError) throw metaError

      const { data: { user } } = await supabase.auth.getUser()
      if (usuario.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: usuario.email })
        if (emailError) throw emailError
      }

      if (usuario.password) {
        const { error: passError } = await supabase.auth.updateUser({ password: usuario.password })
        if (passError) throw passError
      }

      setSuccess('Perfil actualizado correctamente')
      setUsuario({ ...usuario, password: '' })
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!usuario.email) return <p className="p-6">Cargando perfil...</p>

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-[#4f772d]">Perfil de Usuario</h1>

      <form onSubmit={handleUpdate} className="space-y-4 bg-gray-50 p-6 rounded-xl shadow w-full">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <div className="flex items-center border-b-2 border-gray-300">
            <User className="text-gray-500 mr-2" size={20} />
            <input
              type="text"
              name="nombre"
              value={usuario.nombre}
              onChange={handleChange}
              required
              disabled={!isEditing}
              className={`w-full bg-transparent border-none focus:outline-none py-2 placeholder-gray-600 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="flex items-center border-b-2 border-gray-300">
            <Mail className="text-gray-500 mr-2" size={20} />
            <input
              type="email"
              name="email"
              value={usuario.email}
              onChange={handleChange}
              required
              disabled={!isEditing}
              className={`w-full bg-transparent border-none focus:outline-none py-2 placeholder-gray-600 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>

        {/* Telefono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <div className="flex items-center border-b-2 border-gray-300">
            <Phone className="text-gray-500 mr-2" size={20} />
            <input
              type="text"
              name="telefono"
              value={usuario.telefono}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full bg-transparent border-none focus:outline-none py-2 placeholder-gray-600 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>

        {/* Contraseña solo en edicion */}
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
            <div className="flex items-center border-b-2 border-gray-300">
              <Lock className="text-gray-500 mr-2" size={20} />
              <input
                type="password"
                name="password"
                value={usuario.password}
                onChange={handleChange}
                placeholder="Dejar vacío si no quieres cambiarla"
                className="w-full bg-transparent border-none focus:outline-none py-2 placeholder-gray-600"
              />
            </div>
          </div>
        )}

        {/* Mensajes */}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setModalOpen(true)} 
              className="bg-[#4f772d] text-white px-4 py-2 rounded hover:bg-[#3d5a1f] cursor-pointer transition-colors duration-200 ease-in-out"
            >
              Editar perfil
            </button>
          ) : (
            <>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#4f772d] text-white px-4 py-2 rounded hover:bg-[#3d5a1f] cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Actualizando...' : 'Guardar cambios'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setError('')
                  setSuccess('')

                  supabase.auth.getUser().then(({ data: { user } }) => {
                    if (user) {
                      setUsuario({
                        nombre: user.user_metadata?.full_name || '',
                        email: user.email,
                        telefono: user.user_metadata?.telefono || '',
                        password: ''
                      })
                    }
                  })
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 cursor-pointer"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </form>

      {/* Modal de confirmación */}
      <ModalPerfil
        isOpen={modalOpen}
        mensaje="¿Estás seguro de que quieres editar tu perfil?"
        onConfirm={() => {
          setModalOpen(false)
          setIsEditing(true)
        }}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  )
}
