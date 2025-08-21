import './App.css';
import './AuthenticationImage.jsx';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { MantineProvider } from '@mantine/core';
import { NavBar } from './NavBar.jsx';
import { AuthenticationImage } from './AuthenticationImage.jsx';
import { PostsGallery } from './PostGallery.jsx';
import { Summary } from './Summary.jsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import { PostDetail } from './PostDetail.jsx';
import { RegisterPage } from './RegisterPage.jsx';
import { RegistrationSuccessful } from './RegistrationSuccessful.jsx';
import { AccountPage } from './AccountPage.jsx';

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthenticationImage />} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/registrationSuccessful" element={<RegistrationSuccessful/>} />
          <Route element={<NavBar />}>
            <Route path="/posts" element={<PostsGallery />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
