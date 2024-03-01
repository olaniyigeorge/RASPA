import { createCookieSessionStorage, Session } from '@remix-run/node'
// import { Request as SARequest } from 'superagent'



const cookie: string = process.env.APP_COOKIE_NAME ?? 'RASPA-ID'
const secret: string =
  process.env.APP_SECRET ?? 'Rent-A-Space-Akure-Secret'

export const storage = createCookieSessionStorage({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: cookie,

    // all of these are optional
    // expires: Date.now() + 3600,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365 * 5, // 5 years
    path: '/',
    sameSite: 'lax',
    secrets: [secret],
    secure: process.env.NODE_ENV === 'production',
  },
})

/**
 * Gets the session from appropriate cookie in the request headers
 * @param request The request object
 * @returns A promise to return the session
 */
export async function currentSession(request: Request): Promise<Session> {
  return await storage.getSession(request.headers.get('Cookie'))
}

/**
 * Gets the current token
 * @param request The request object
 * @returns A promise to return the token if exists
 */
export async function currentToken(request: Request): Promise<string> {
  const session = await currentSession(request)

  return session.get('bearer') ?? 'anonymous'
}

/**
 * Gets the current refresh token
 * @param request The request object
 * @returns A promise to return the token if exists
 */
export async function currentRefreshToken(request: Request): Promise<string> {
  const session = await currentSession(request)

  return session.get('refreshToken') ?? 'anonymous'
}

/**
 * Should be called when client-side authentication recieves token from the
 * data server. The idea is for this server to have access to the token to be
 * able to make authenticated requests to the data server. The session has to
 * be returned so that modifications to it can be committed.
 * @param request The request object
 * @param response The response from the data server
 * @returns A promise to return the session
 */
export async function enableAuthenticableServerApiRequests(
  request: Request,
  response: TokenResponse,
): Promise<Session> {
  const session = await currentSession(request)
  session.set('bearer', response.token)
  session.set('refreshToken', response.refresh)

  return session
}

/**
 * Ensures the data server's token is attached to requests the remix server
 * makes to it
 * @param request The request object
 */
// export async function ensureAuthenticableServerApiRequests(
//   request: Request,
// ): Promise<void> {
//   const token: string = await currentToken(request)

//   if (token !== 'anonymous') {
//     transformers.push((request: SARequest) => {
//       if (token) request.auth(token, { type: 'bearer' })
//       return request
//     })
//   }
// }

type TokenResponse = {
  token: string;
  refresh: string;
}
