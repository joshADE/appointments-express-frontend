import React, { useRef, useState } from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import AboutSection from './AboutSection'
import FeaturesSection from './FeaturesSection'
import HomeSection from './HomeSection'
import Navigation from './Navigation'
import StatsSection from './StatsSection'
import StepsSection from './StepsSection'
import RolesSection from './RolesSection'


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

    const homeRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const feauturesRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);
    const rolesRef = useRef<HTMLDivElement>(null);
    const [currentSection, setCurrentSection] = useState(sections[0].name);


    useScrollPosition(
      ({ prevPos, currPos }) => {
        const current = -1 * currPos.y;
    
        
        let newSection = currentSection;
        if (rolesRef.current && current >= rolesRef.current.offsetTop)
            newSection = sections[4].name;
        else if (stepsRef.current && current >= stepsRef.current.offsetTop)
            newSection = sections[3].name;
        else if (feauturesRef.current && current >= feauturesRef.current.offsetTop)
            newSection = sections[2].name;
        else if (aboutRef.current && current >= aboutRef.current.offsetTop)
            newSection = sections[1].name;
        else
            newSection = sections[0].name;
        
        if (newSection !== currentSection){
            console.log("set");
            setCurrentSection(newSection);
        }
        
      },
      [currentSection, sections]
    )

    return (
        <div>
            <Navigation isAuthenticated={isAuthenticated} isLoading={isLoading} currentSection={currentSection} />
            <HomeSection ref={homeRef} />
            <StatsSection ref={statsRef} />
            <AboutSection ref={aboutRef} />
            <FeaturesSection ref={feauturesRef} />
            <StepsSection ref={stepsRef} />
            <RolesSection ref={rolesRef} />
        </div>
    )
}

export default Home
