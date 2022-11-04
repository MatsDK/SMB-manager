import { Route, Router } from 'preact-router'
import { DashboardView } from './components/DashboardView'
import { GlobalConfigView } from './components/GlobalConfigView'
import { HomeView } from './components/HomeView'
import { NewShareView } from './components/NewShareView'
import { SmbShareView } from './components/SmbShareView'
import './index.css'

export const App = () => {
    return (
        <Router>
            <Route default component={HomeView} />
            <Route path='/dashboard' component={DashboardView} />
            <Route path='/dashboard/global' component={GlobalConfigView} />
            <Route path='/dashboard/share/:name' component={SmbShareView} />
            <Route path='/dashboard/new-share' component={NewShareView} />
        </Router>
    )
}
