import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs'


export const SidebarData = [
    {
        title: 'Manage Stores',
        path: '/dashboard/',
        icon: <AiIcons.AiOutlineClockCircle />,
        cName: 'nav-text'
    },
    {
        title: 'Manage Appointments ',
        path: '/dashboard/appointments',
        icon: <BiIcons.BiCalendar />,
        cName: 'nav-text'
    },
    {
        title: 'Manage Roles',
        path: '/dashboard/roles',
        icon: <BsIcons.BsPerson />,
        cName: 'nav-text'
    },
]