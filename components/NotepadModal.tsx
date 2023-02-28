import { Modal, TextArea, List } from '@react95/core'
import {
  Notepad,
} from '@react95/icons';
import React from 'react';
import Icon from './Icon';

type NotepadModalProps = Omit<React.ComponentProps<typeof Modal>, 'closeModal'> & {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
}

const NotepadModal = ( { show, setShow, value: notepadValue, setValue: setNotepadValue, ...props }: NotepadModalProps) => {
  if (!show) {
    return ( <></> );
  }

  return (
      <Modal
        closeModal={() => setShow(false)}   
        icon={<Notepad/>}
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
          value={notepadValue}
          onChange={({ target: { value }}: { target: { value: string }}) => {
            if (setNotepadValue) {
              setNotepadValue(value);
            }
          }}
        />

      </Modal>
  )
};

export default NotepadModal;