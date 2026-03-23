import '../assets/styles/main.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import { UserProvider } from '../contexts/UserContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
    title: 'NeuroLingo',
    description: 'A web application for the NeuroLingo Smart Brain Health Test.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <LanguageProvider>
                    <UserProvider>
                        <div className="app-container">
                            <Header />
                            <main className="main-content">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </UserProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
