import nextRoutes from "next-routes"
const routes = nextRoutes()

routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show')
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/requests/creator', '/campaigns/requests/creator')

export default routes