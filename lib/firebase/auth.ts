import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    type User,
    type NextOrObserver,
} from 'firebase/auth'
import { auth } from './config'

const googleProvider = new GoogleAuthProvider()

export function signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
}

export function signUpWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
}

export function signInWithGoogle() {
    return signInWithPopup(auth, googleProvider)
}

export function signOutUser() {
    return signOut(auth)
}

export function onAuthStateChange(callback: NextOrObserver<User>) {
    return onAuthStateChanged(auth, callback)
}
