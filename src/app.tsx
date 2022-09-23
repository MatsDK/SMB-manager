import { Route, Router } from 'preact-router'
import { DashboardView } from './components/DashboardView'
import { GlobalConfigView } from './components/GlobalConfigView'
import { HomeView } from './components/HomeView'
import './index.css'

export const App = () => {
    return (
        <Router>
            <Route default component={HomeView} />
            <Route path='/dashboard' component={DashboardView} />
            <Route path='/dashboard/global' component={GlobalConfigView} />
        </Router>
    )
}
