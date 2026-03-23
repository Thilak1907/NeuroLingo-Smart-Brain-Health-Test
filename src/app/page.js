"use client";
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from '../components/user/Login';
import { UserContext } from '../contexts/UserContext';

export default function Home() {
    const { user, login } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    if (user) {
        return null; // or a loading spinner
    }

    return <Login onLogin={login} />;
}
