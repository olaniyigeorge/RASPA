import { FooterLink, FooterLinkSection } from './interfaces'

export function LinkSection(props: FooterLinkSection) {
  const { title } = props

  return (
    <div className="flex flex-col">
      <h3 className="mb-4 font-semibold leading-normal text-white">
        {title}
      </h3>
      <Links links={LinksMap[title]} />
    </div>
  )
}

export function Links(props: { links: FooterLink[] }) {
  const { links } = props

  return (
    <ul>
      {links.map((menu: FooterLink, idx: number) => (
        <li
          className="
            mb-2.5
            w-full"
          key={idx}
        >
          <a
            className="
              h-full
              w-full
              font-medium
              leading-relaxed
              text-white
              hover:border-b-2
              hover:border-b-white
              hover:scale-105
              hover:text-purple-900"
            href={menu.url}
          >
            {menu.title}
          </a>
        </li>
      ))}
    </ul>
  )
}

export const LinksMap: Record<string, FooterLink[]> = {
  RASPA: [
    {
      title: 'About us',
      url: '/about-us',
    },
    {
      title: 'Team',
      url: '/team',
    },
    {
      title: 'Investors',
      url: '/investors',
    },
    {
      title: 'Careers',
      url: '/careers',
    },


  ],
  Property_Types: [
    {
      title: 'About Us',
      url: '/about-us',
    },
    {
      title: 'Our Services',
      url: '/our-services',
    },
    {
      title: 'Explore Properties',
      url: '/explore',
    },
    {
      title: 'Explore Properties on Map',
      url: '/explore/map',
    },
    {
      title: 'Blog',
      url: '/blog',
    },
  ],
  Connect: [
    {
      title: 'Contact us',
      url: '/contact',
    },
    {
      title: 'Events',
      url: '/events',
    },
    {
      title: 'Developers',
      url: 'https://github.com/olaniyigeorge',
    },
    {
      title: 'Contribute',
      url: 'https://github.com/olaniyigeorge/raspa-client',
    },
  ],
  Popular_Searches: [
    {
      title: 'Residential properties',
      url: '/explore?type=residential',
    },
    {
      title: 'Commercial Jobs',
      url: '//explore?type=commercial',
    },
    {
      title: 'Industrial Academy',
      url: '/explore?type=industrial',
    },
    {
      title: 'Land',
      url: '/explore?type=land',
    },
    {
      title: 'Near by schools',
      url: '/explore?search=near-by-schools',
    },
  ],
}
