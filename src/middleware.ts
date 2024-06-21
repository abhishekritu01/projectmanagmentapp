import { NextResponse, NextRequest } from 'next/server'
// import type { NextRequest } from 'next/server'


//get from next auth
export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request })
    const url = request.nextUrl       //current url

    if (token && (
        url.pathname.startsWith('/login')
        || url.pathname.startsWith('/register')
    )) {
        return NextResponse.redirect(new URL('/', request.url))
    }

}

//path of that file where u want to run middleWare 
export const config = {
    matcher: [
        '/login',
        '/',
        '/register',
    ]
}