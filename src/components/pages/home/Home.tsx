import React from 'react'
import HomeSection from './HomeSection'
import Navigation from './Navigation'


interface HomeProps {
    isAuthenticated: boolean;
    isLoading: boolean;
}

export const sections = [
    {
        title: 'Home',
        name: 'home'
    }, 
    {
        title: 'About',
        name: 'about'
    },
    {
        title: 'Features',
        name: 'features'
    },
    {
        title: 'Steps',
        name: 'steps'
    },
    {
        title: 'Roles',
        name: 'roles'
    },
]
const Home: React.FC<HomeProps> = ({
    isAuthenticated, 
    isLoading
}) => {
    return (
        <div>
            <Navigation isAuthenticated={isAuthenticated} isLoading={isLoading} />
            <HomeSection />
        </div>
    )
}

export default Home
