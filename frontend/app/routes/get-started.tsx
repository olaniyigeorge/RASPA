import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { validateCredentials } from '~/api/auth';
import { getEnvVar, getUrl } from '~/api/util';
import { currentSession, enableAuthenticableServerApiRequests, storage } from '~/session.server';


export default function Login() {
  const loaded = useLoaderData<typeof loader>()
  const [title, setTitle] = useState<string>('sign-in')
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setMessage] = useState<string>('');

  console.log("Get Started")
  

  const handleToggle = () => {
    // Toggle between sign-in and sign-up
    const newTitle = title === 'sign-in' ? 'sign-up' : 'sign-in';
    setTitle(newTitle);

  };



  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-md">
        <a href="/" className="flex p-2 justify-center">
              <img
                className="h-auto w-56"
                src="/images/rasp-logo-purple.png"
                alt="RASPA"
              />
                
        </a>
        <h1 className="text-2xl w-full flex capitalize justify-center font-bold mb-4">{title}</h1>
        
        {errorMessage && (
          <div className="w-full p-2 bg-red-500 text-white font-bold text-2xl">
            {errorMessage}
          </div>
        )}
      

        <form method="POST">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              className="w-full border focus:outline-purple-600 p-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="w-full border focus:outline-purple-600 p-2 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4 ">
            <label htmlFor="Auth type" className="block text-sm font-medium text-gray-600">
              Auth type
            </label>
            <input
              type="text"
              id="auth_type"
              name="auth_type"
              className="w-full border focus:outline-purple-600 p-2 rounded-md"
              value={title}
              
            />
          </div>
          <button
            type="submit"
            className="w-full border p-2 rounded-md hover:bg-purple-700 bg-purple-600 text-white"
          >
            Submit
          </button>

        </form>
        <div
            className="w-full flex justify-center items-center  p-2 rounded-md text-sm"
        >
            <button
                type="button"
                className="hover:text-purple-600 hover:border-b hover:border-b-purple-600 hover:transition-all"
                onClick={handleToggle}
            >
             {title === 'sign-in' ? 'Switch to Sign Up' : 'Switch to Sign In'}
          </button>
        </div>
        
      </div>
    </div>
  );
}


export async function loader({request,}: LoaderFunctionArgs){
    const session = await currentSession(request);
    console.log(`Session: ${session}`)

    if (session.has("bearer")) {
        // Redirect to the home page if they are already signed in.
        return redirect("/");
      }

    const accessName = `${getEnvVar("API_TOKEN_NAME_PREFIX")}_access`
    const refreshName = `${getEnvVar("API_TOKEN_NAME_PREFIX")}_refresh`
    const endpoints = {
        "sign-in": getUrl("sign-in"),
        "sign-in-refresh": getUrl("sign-in-refresh"),
        "sign-up": getUrl('sign-up')}

    
    return json({
      title: 'sign-in/up',
      endpoints: endpoints,
      accessName: accessName,
      refreshName: refreshName

    }, {
        headers: {
        "Set-Cookie": await storage.commitSession(session),
      }});
  }



  export async function action({request,}: ActionFunctionArgs) {
    console.log("---- In actions ----")
    //const session = await currentSession(request);

    const form = await request.formData();
    const email = (form.get("email") || "").toString();
    const password = (form.get("password") || "").toString();
    const auth_type = (form.get("auth_type") || "sign-up")?.toString();
  
    console.log("Validating cred---------------------")
    const res = await validateCredentials({email, password});
    console.log(`Cred Validation Response:  ${res}`)
  
    if (res == false) {
      const session = await currentSession(request);
      // session.flash("error", "Invalid username/password");
  
        // Redirect back to the login page with errors.
        return redirect("/get-started", {
          headers: {
            "Set-Cookie": await storage.commitSession(session),
          },
        });
    }

    // console.log(`Access: ${res.access}`)
    // console.log(`Refresh: ${res.refresh}`)

    const session = await enableAuthenticableServerApiRequests(request, {
      token: res.access, refresh: res.refresh
    })

    // Login succeeded, send them to the home page.
    console.log("Login successful")
    return redirect("/", {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    });


  }