
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import  { AnimatePresence } from 'framer-motion'


// import { ColourSchemeProvider, TColourScheme } from '~/ui/colour-scheme'

export function DomWrapper(props: IDomWrapper) {

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <Meta />
        <Links />
      </head>
      <body>

        <AnimatePresence mode="wait">{props.children}</AnimatePresence>

        {props.scripts}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

interface IDomWrapper {
  children: React.ReactNode
  scripts?: React.ReactNode
}
