import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { LogOut, Users, Box, LayoutDashboard, Menu, X, ChevronLeft, ChevronRight, Snail, UserPlus, User
} from 'lucide-react'

export default function Sidebar({ isCollapsed, setIsCollapsed, isOpen, setIsOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [active, setActive] = useState(location.pathname)
  const [closing, setClosing] = useState(false) 

  useEffect(() => {
    setActive(location.pathname)
  }, [location.pathname])

  const handleLogout = async () => {
    setClosing(true) 
    setTimeout(async () => {
      await supabase.auth.signOut()
      navigate('/login')
    }, 1000) 
  }

  const linkStyle = (path) =>
    `${active === path ? 'bg-gray-50 text-[#4f772d]' : 'text-white hover:bg-gray-50 hover:text-[#4f772d]'}
     flex items-center px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden
     ${isCollapsed ? 'justify-center' : 'space-x-3 justify-start'}`

  return (
    <>
      {/* Hamburguesa */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          md:hidden fixed top-4 right-4 z-50 bg-[#4f772d] p-2 rounded text-white
          transition-opacity duration-500
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}
        `}
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-[#4f772d] shadow-md p-4 z-40
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
          flex flex-col justify-between
        `}
        style={{ width: isCollapsed ? '80px' : '256px' }}
      >
        <div>
          {/* Boton cerrar (movil) */}
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={() => setIsOpen(false)} className="text-green-100">
              <X />
            </button>
          </div>

          <div className="md:hidden flex flex-col items-center mb-6 w-full">
            <Snail className="w-6 h-6 text-white mb-1" />
            <h1 className="text-white font-bold text-xl">CRM Panel</h1>
          </div>

          <div className="hidden md:flex items-center justify-between mb-8">
            {isCollapsed ? (
              <button
                onClick={() => setIsCollapsed(false)}
                className="text-green-100 hover:text-white mx-auto cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 transition-transform duration-300" />
              </button>
            ) : (
              <>
                <div className="flex items-center space-x-2 mx-auto">
                  <Snail className="w-6 h-6 text-white" />
                  <h1 className="text-white font-bold text-2xl cursor-default">CRM Panel</h1>
                </div>
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="text-green-100 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6 transition-transform duration-300" />
                </button>
              </>
            )}
          </div>

          {/* Enlaces */}
          <nav className="space-y-2">
            <Link to="/" className={linkStyle('/')} onClick={() => setIsOpen(false)}>
              <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
            </Link>
            <Link to="/clientes" className={linkStyle('/clientes')} onClick={() => setIsOpen(false)}>
              <Users className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Clientes</span>}
            </Link>
            <Link to="/agregar-cliente" className={linkStyle('/agregar-cliente')} onClick={() => setIsOpen(false)}>
              <UserPlus className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Agregar Cliente</span>}
            </Link>
            <Link to="/productos" className={linkStyle('/productos')} onClick={() => setIsOpen(false)}>
              <Box className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Productos</span>}
            </Link>
            <Link to="/perfil" className={linkStyle('/perfil')} onClick={() => setIsOpen(false)}>
              <User className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Mi Perfil</span>}
            </Link>
          </nav>
        </div>

        {/* Cerrar sesion */}
        <div>
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center space-x-2 px-4 py-2 bg-[#31572c] text-white rounded-xl
              hover:bg-[#294b25] transition justify-center cursor-pointer
            `}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && (
              <span className="transition-opacity duration-300">
                {closing ? 'Cerrando sesión...' : 'Cerrar sesión'}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
