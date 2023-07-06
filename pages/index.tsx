import type { NextPage } from 'next'
import {
  Notepad,
  Wordpad,
  RecycleFull,
  Url102,
  Computer3
} from '@react95/icons';
import Icon from '../components/Icon';
import MainTaskBar from '../components/MainTaskBar';
import WelcomeModal from '../components/WelcomeModal';
import VMModal from '../components/VMModal';
import NotepadModal from '../components/NotepadModal';
import { useReducer, useEffect, useState } from 'react';
import { ModalContext } from '../components/ModalContext';
import { createModalStack, modalStackReducer, ModalStack, renderModalStack } from '../components/ModalStack';

const useMousePosition = () => {
  const [
    mousePosition,
    setMousePosition
  ] = useState({ x: null, y: null });
  useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  return mousePosition;
};

const Home: NextPage = () => {
  const [modals, dispatch] = useReducer(modalStackReducer, createModalStack());
  const mousePosition = useMousePosition();

  useEffect(() => {
    // create "welcome" modal at roughly the middle of the screen,
    // plus or minus a few pixels
    dispatch({ type: 'ADD_MODAL', element: <WelcomeModal defaultPosition={{ x: (Math.floor(window.innerWidth / 2) - 150), y: Math.floor(window.innerHeight / 2) - 150 }} /> });

    // and nuke all modals when this page is unmounted
    return () => {
      dispatch({ type: 'CLOSE_ALL_MODALS' });
    };
  }, []);

  return (
    <ModalContext.Provider value={{ stack: modals, dispatch }}>
      {renderModalStack(modals)}
      <div className="flex flex-col items-start">
        <Icon.Wrapper onDoubleClick={() => {
          let elem = document.createElement("a");
          elem.download = "resume.pdf";
          elem.href = "/resume.pdf";
          elem.click();
        }}>
          <Icon.Box>
            <Wordpad variant='32x32_4' />
            <Icon.Text>
              resume.pdf
            </Icon.Text>
          </Icon.Box>
        </Icon.Wrapper>

        <Icon.Wrapper onDoubleClick={(e) => dispatch({ type: 'ADD_MODAL', element: <NotepadModal file={'about_me.txt'} defaultPosition={{ x: mousePosition.x!, y: (mousePosition.y! - 40) }} /> })}>
          <Icon.Box>
            <Notepad variant='32x32_4' />
            <Icon.Text>
              about_me.txt
            </Icon.Text>
          </Icon.Box>
        </Icon.Wrapper>

        <Icon.Wrapper onDoubleClick={() => dispatch({ type: 'ADD_MODAL', element: <NotepadModal file={'contact_me.txt'} defaultPosition={{ x: mousePosition.x!, y: (mousePosition.y! - 40) }} /> })}>
          <Icon.Box>
            <Notepad variant='32x32_4' />
            <Icon.Text>
              contact_me.txt
            </Icon.Text>
          </Icon.Box>
        </Icon.Wrapper>

        <Icon.Wrapper onDoubleClick={() => dispatch({ type: 'ADD_MODAL', element: <NotepadModal file={'cherished_music.txt'} defaultPosition={{ x: mousePosition.x!, y: (mousePosition.y! - 40) }} /> })}>
          <Icon.Box>
            <Notepad variant='32x32_4' />
            <Icon.Text>
              cherished_music.txt
            </Icon.Text>
          </Icon.Box>
        </Icon.Wrapper>

        <Icon.Wrapper onDoubleClick={() => window.open("https://github.com/hatf0/hat.fo-next", "_blank") }>
          <Icon.Box>
            <Url102 variant='32x32_4' />
            <Icon.Text>
              Website Source Code
            </Icon.Text>
          </Icon.Box>
        </Icon.Wrapper>

        <div className="flex">
          <Icon.Wrapper onDoubleClick={() => dispatch({ type: 'ADD_MODAL', element: <VMModal vm={'doom_linux'} title={'Doom Linux'} /> })}>
            <Icon.Box>
              <Computer3 variant='32x32_4' />
              <Icon.Text>
                Doom Linux VM
              </Icon.Text>
            </Icon.Box>
          </Icon.Wrapper>

          <Icon.Wrapper onDoubleClick={() => dispatch({ type: 'ADD_MODAL', element: <VMModal vm={'buildroot_linux'} title={'Buildroot Linux'} /> })}>
            <Icon.Box>
              <Computer3 variant='32x32_4' />
              <Icon.Text>
                Buildroot Linux VM
              </Icon.Text>
            </Icon.Box>
          </Icon.Wrapper>
        </div>
        <MainTaskBar />
      </div>
    </ModalContext.Provider>
  )
}

export default Home;