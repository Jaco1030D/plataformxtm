import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ContextFilesUploads } from './context/FileUploads/index.tsx'
import { GroupsProvider } from './context/Groups/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContextFilesUploads>
      <GroupsProvider>
        <App />
      </GroupsProvider>
    </ContextFilesUploads>
   </StrictMode>,
)
