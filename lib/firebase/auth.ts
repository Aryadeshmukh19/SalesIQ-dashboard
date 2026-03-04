import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    type User,
    type NextOrObserver,
} from 'firebase/auth'
import { auth } from './config'

const googleProvider = new GoogleAuthProvider()

/** Returns true when running on a mobile browser where popups are unreliable */
function isMobile(): boolean {
    if (typeof navigator === 'undefined') return false
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent)
}

export function signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
}

export function signUpWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
}

/**
 * On mobile: uses redirect flow (page reloads, result caught by AuthContext).
 * On desktop: uses popup flow (instant, no page reload).
 */
export function signInWithGoogle() {
    if (isMobile()) {
        return signInWithRedirect(auth, googleProvider)
    }
    return signInWithPopup(auth, googleProvider)
}

/** Call this once on app load to pick up a Google redirect result */
export function getGoogleRedirectResult() {
    return getRedirectResult(auth)
}

export function signOutUser() {
    return signOut(auth)
}

export function onAuthStateChange(callback: NextOrObserver<User>) {
    return onAuthStateChanged(auth, callback)
}
