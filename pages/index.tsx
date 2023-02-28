import type { NextPage } from 'next'
import { Modal } from '@react95/core'
import {
  InfoBubble,
  RecycleFull,
  Notepad,
  Wordpad,
  User,
} from '@react95/icons';
import Icon from '../components/Icon';
import MainTaskBar from '../components/MainTaskBar';
import NotepadModal from '../components/NotepadModal';
// @ts-ignore
import aboutMeContent from '../notepad_contents/about_me.txt';
// @ts-ignore
import contactMeContent from '../notepad_contents/contact_me.txt';
// @ts-ignore
import musicContent from '../notepad_contents/music.txt';
import { useState } from 'react';

const notepadContents = {
  'about_me.txt': aboutMeContent,
  'contact_me.txt': contactMeContent,
  'cherished_music.txt': musicContent,
};

const Home: NextPage = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showNotepad, setShowNotepad] = useState(false);
  const [notepadContent, setNotepadContent] = useState<'about_me.txt' | 'contact_me.txt' | 'cherished_music.txt'>('about_me.txt');

  return (
    <div className="flex flex-col items-start">
      { showWelcomeModal && <Modal
        closeModal={() => setShowWelcomeModal(false)}   
        icon={<InfoBubble/>}
        defaultPosition={{x: 80, y: 50}}
        title={'Welcome!'}
        height={'150'}
        width={'300'}
      >
        <div className="flex flex-col justify-center">
          <div className="flex text-center justify-center items-center mr-auto">
            <User variant="32x32_4" />
            <span className="mt-1">
              {`Hi. I'm Harrison (@hatf0).`}
            </span>
          </div>
          <div className="flex flex-col mt-1 space-y-2">
            <span>
              {`I'm a 19 year old software engineer, pursuing a degree in Comp. Sci.`}
            </span>
            <span>
              {`Welcome to my personal website - I hope you enjoy :-)`}
            </span>
          </div>
        </div>
      </Modal> }

      <NotepadModal
        show={showNotepad}
        setShow={setShowNotepad}
        title={`Notepad - ${notepadContent}`}
        value={notepadContents[notepadContent]}
      />

      <Icon.Box>
        <RecycleFull />
        <Icon.Text>
          Recycle Bin
        </Icon.Text>
      </Icon.Box>

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

      <Icon.Wrapper onDoubleClick={() => (setNotepadContent('about_me.txt'), setShowNotepad(true))}>
        <Icon.Box>
          <Notepad variant='32x32_4' />
          <Icon.Text>
            about_me.txt
          </Icon.Text>
        </Icon.Box>
      </Icon.Wrapper>

      <Icon.Wrapper onDoubleClick={() => (setNotepadContent('contact_me.txt'), setShowNotepad(true))}>
        <Icon.Box>
          <Notepad variant='32x32_4' />
          <Icon.Text>
            contact_me.txt
          </Icon.Text>
        </Icon.Box>
      </Icon.Wrapper>

      <Icon.Wrapper onDoubleClick={() => (setNotepadContent('cherished_music.txt'), setShowNotepad(true))}>
        <Icon.Box>
          <Notepad variant='32x32_4' />
          <Icon.Text>
            cherished_music.txt
          </Icon.Text>
        </Icon.Box>
      </Icon.Wrapper>

      <MainTaskBar />
    </div>
  )
}

export default Home;