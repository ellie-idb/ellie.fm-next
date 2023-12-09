import { InfoBubble, User } from '@react95/icons';
import { Modal } from '@react95/core';
import { useContext } from 'react';
import { ModalContext, RenderedModalContext } from './ModalContext';
import { backgroundImage } from '@xstyled/styled-components';

export type WelcomeModalProps = Omit<React.ComponentProps<typeof Modal>, 'closeModal' | 'title' | 'icon' | 'height' | 'width'>;

const WelcomeModal = ({...props}: WelcomeModalProps) => {
  const renderedCtx = useContext(RenderedModalContext);
  const modalCtx = useContext(ModalContext);

  return (
    <Modal
      closeModal={() => {
        modalCtx.dispatch({ type: 'CLOSE_MODAL', id: renderedCtx.id });
      }}
      icon={<InfoBubble/>}
      title={'Welcome'}
      height={'160'}
      width={'300'}
      {...props}
    >
      <div className="flex flex-col justify-center">
        <div className="flex text-center justify-center items-center mr-auto">
          <User variant="32x32_4" />
          <span className="mt-1">
            {`Hi. I'm Harrison, but I also go by hatf0.`}
          </span>
        </div>
        <div className="flex flex-col mt-1 space-y-2">
          <span>
            {`I'm a 20 y/o site reliability engineer, with interests in hardware hacking, network engineering, and breaking compilers.`}
          </span>
          <span style={{backgroundImage: 'url(/rainbow_sparkles.gif)'}}>
            {`Welcome to my personal website. Have fun! <3`}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;