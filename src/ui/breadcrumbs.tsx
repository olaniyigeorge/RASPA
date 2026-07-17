import { HomeIcon } from '@heroicons/react/24/solid'
import { useLocation } from '@remix-run/react'
import { NavLink } from '@remix-run/react'
import { useMemo } from 'react'
// import { Home } from 'tabler-icons-react'
// import v from 'voca'

export function Breadcrumbs() {
  const location = useLocation()
  const participants: string[] = useMemo(
    () => location.pathname.split('/'),
    [location.pathname],
  )

  return (
    <nav
      aria-label="Breadcrumbs"
      className="
        shadow-xs
        h-auto
        w-full
        border-0"
    >
      <ol
        className="
          mx-auto
          flex
          h-8
          w-full
          items-center
          px-2"
      >
        <li className="flex list-none">
          <NavLink className="text-gray-400 hover:text-gray-500" to="/">
            <HomeIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </NavLink>
        </li>
        {participants
          .filter(p => p !== '')
          .map((participant: any, index: number) => {
            const path: string = participants.slice(0, index + 2).join('/')

            const active: boolean = path === location?.pathname
            const title: React.ReactNode = v.titleCase(
              v.replaceAll(participant, '-', ' '),
            )
            
            return (
              <li className="flex list-none" key={participant as string}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <NavLink
                  aria-current={active ? 'page' : undefined}
                  className={`
                    text-xs
                    font-medium
                    text-gray-500
                    no-underline
                    hover:text-gray-700
                  `}
                  to={path}
                >
                  {title}
                </NavLink>
              </li>
            )
          })}
      </ol>
    </nav>
  )
}
