import Home from '../pages/Home'
import Jobs from '../pages/Jobs'
import Profile from '../pages/Profile'
import Applications from '../pages/Applications'
import NotFound from '../pages/NotFound'

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Home
  },
  jobs: {
    id: 'jobs',
    label: 'Jobs',
    path: '/jobs',
    icon: 'Briefcase',
    component: Jobs
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  },
  applications: {
    id: 'applications',
    label: 'Applications',
    path: '/applications',
    icon: 'FileText',
    component: Applications
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
    component: NotFound
  }
}

export const routeArray = Object.values(routes)