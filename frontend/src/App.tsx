import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// MUI
import { Stack, ThemeProvider } from '@mui/material';

// Assets
import './assets/sass/App.scss';
import Theme from './assets/Theme';

// Components
import Login from './components/Login';
import Profile from './components/Profile';
import Sidebar from './components/sidebar/Sidebar';
import SearchComponent from './components/SearchComponent';
import PostComponent from './components/PostComponent';
import HotQuestions from './components/HotQuestions';
import Ask from './components/Ask';
import API from './data/FrontendAPI';
import FloatingAsk from './components/FloatingAsk';
import TopicFeed from './components/TopicFeed';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import PrivateWrapper from './utils/PrivateWrapper';
import Signup from './components/Signup';
import MainHeader from './components/header/MainHeader';
import Menu from './components/Menu';
import PublicWrapper from './utils/PublicWrapper';

export const UserContext = createContext<string | undefined>(undefined);

function App() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<string>();

  const getCurrentUser = async () => {
    const curr = await API.Auth.currentUser();
    setCurrentUser(curr);
  };

  useEffect(() => {
    getCurrentUser();
  });

  return (
    <UserContext.Provider value={currentUser}>
      <ThemeProvider theme={Theme}>
        <ScrollToTop />

        <Stack
          // className={'collapse-main'}
          paddingRight={'40px'}
          paddingLeft={'40px'}
          paddingTop={'25px'}
          paddingBottom={'25px'}
          direction={'row'}
          alignItems={'flex-start'}
          spacing={2}
        >
          <Sidebar />
          <div className={'main'}>
            <MainHeader />

            <Stack direction={'row'}>
              <Stack direction={'column'} spacing={2}>
                <Routes>
                  <Route path={'/'} element={<HotQuestions />} />
                  <Route element={<PublicWrapper />}>
                    {/*           ^^^^^^^^^^^^^^^^^ */}
                    {/* TODO: - works, but clean up later */}
                    <Route path={'/login'} element={<Login />} />
                    <Route path={'/signup'} element={<Signup />} />
                  </Route>

                  <Route path={'/q/:qid'} element={<PostComponent />} />
                  <Route path={'/search'} element={<SearchComponent />} />
                  <Route element={<PrivateWrapper />}>
                    <Route path={'/ask'} element={<Ask />} />
                  </Route>
                  <Route path={'/@:username'} element={<Profile />} />
                  <Route path={'/topics/*'} element={<TopicFeed />} />
                  <Route index element={<HotQuestions />} />
                </Routes>

                <Footer />
              </Stack>
              <div style={{ width: '100%' }}></div>
            </Stack>
            {location.pathname === '/ask' ||
            location.pathname === '/login' ||
            location.pathname === '/signup' ? null : (
              <FloatingAsk />
            )}
          </div>
        </Stack>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
