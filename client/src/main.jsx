import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from './pages/ErrorPage.jsx';


import App from './App.jsx'
import { store } from './redux/store.js'

import './index.css'

createRoot(document.getElementById('root')).render(

  <ErrorBoundary fallback={<ErrorPage />}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ErrorBoundary>
)
