import { Modal, TextArea, List } from '@react95/core'
import {
  Notepad,
} from '@react95/icons';
import React, { useContext } from 'react';
import Icon from './Icon';
// @ts-ignore
import aboutMeContent from '../notepad_contents/about_me.txt';
// @ts-ignore
import contactMeContent from '../notepad_contents/contact_me.txt';
// @ts-ignore
import musicContent from '../notepad_contents/music.txt';
import { ModalContext, RenderedModalContext } from './ModalContext';

export type NotepadModalProps = Omit<React.ComponentProps<typeof Modal>, 'closeModal' | 'title'> & {
  file: keyof typeof notepadContents;
}

const notepadContents = {
  'about_me.txt': aboutMeContent,
  'contact_me.txt': contactMeContent,
  'cherished_music.txt': musicContent,
};

export const NotepadModal = ({ file, ...props }: NotepadModalProps) => {
  const renderedCtx = useContext(RenderedModalContext);
  const modalCtx = useContext(ModalContext);

  return (
    <Modal
      closeModal={() => {
        modalCtx.dispatch({ type: 'CLOSE_MODAL', id: renderedCtx.id });
      }}
      title={`Notepad - ${file}`}
      icon={<Notepad />}
      menu={[
        {
          name: 'File',
          list: (
            <List>
              <List.Item>Filler</List.Item>
            </List>
          ),
        },
        {
          name: 'Edit',
          list: (
            <List>
              <List.Item>Filler</List.Item>
            </List>
          ),
        },
      ]}
      {...props}
    >
      <TextArea
        rows={20}
        cols={60}
        value={notepadContents[file]}
        onChange={({ target: { value } }: { target: { value: string } }) => {}}
      />
    </Modal>
  )
};

export default NotepadModal;