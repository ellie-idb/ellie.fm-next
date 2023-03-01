import { Modal } from '@react95/core'
import { Computer3 } from '@react95/icons';
import React, { createContext, useEffect, useRef, useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import { ModalContext, RenderedModalContext } from './ModalContext';

type VMModalProps = Omit<React.ComponentProps<typeof Modal>, 'closeModal'> & {
  vm: V86Props['vm'];
};

type V86Props = {
  vm: 'doom_linux' | 'buildroot_linux';
  v86: any;
  setV86: React.Dispatch<React.SetStateAction<any>>;
};

const cdrom_urls = {
  'doom_linux': '/vm/doom-linux.iso',
  'buildroot_linux': '/vm/buildroot-linux.iso'
};

const V86DynamicComponent = dynamic(async () => {
  // @ts-ignore
  const { V86Starter } = await import('v86');

  const V86Component = ({ vm, v86, setV86 }: V86Props) => {
    const screenContainer = useRef<HTMLDivElement>(null);
    const [emulatorUsesMouse, setEmulatorUsesMouse] = useState(false);
    const cdrom_url = cdrom_urls[vm];

    useEffect(() => {
      if (v86 === null) {
        const emulator = new V86Starter({
          wasm_path: "/vm/v86.wasm",
          fastboot: true,
          memory_size: 256 * 1024 * 1024,
          vga_memory_size: 8 * 1024 * 1024,
          screen_container: screenContainer.current,
          bios: {
            url: "/vm/seabios.bin",
            async: false,
          },
          vga_bios: {
            url: "/vm/vgabios.bin",
            async: false,
          },
          cdrom: {
            url: cdrom_url,
            async: false,
          },
          autostart: true,
        });

        emulator.add_listener("mouse-enable", (e: boolean) => {
          setEmulatorUsesMouse(e);
        });

        setV86(emulator);
      }
    }, [v86, setV86, cdrom_url]);

    return (
      <div ref={screenContainer} onClick={() => {
        if (emulatorUsesMouse && v86 !== null) {
          v86.lock_mouse();
        }
      }}
        className="relative w-full h-full bg-black">
        <div className="p-2 whitespace-pre flex font-mono text-sm" />
        <canvas className="hidden" />
      </div>
    );
  };

  return V86Component;
}, { ssr: false, loading: () => <span>{'Loading...'}</span> });

const VMContext = createContext<any>(null);

const VMModal = ({ vm, ...props }: VMModalProps) => {
  const [v86, setV86] = useState<any>(null);
  const modalCtx = useContext(ModalContext);
  const renderedCtx = useContext(RenderedModalContext);

  useEffect(() => {
    return () => {
      if (v86 !== null) {
        v86.destroy();
      }
    }
  }, [v86]);

  return (
    <VMContext.Provider value={v86}>
      <Modal
        closeModal={() => modalCtx.dispatch({ type: 'CLOSE_MODAL', id: renderedCtx.id })}
        icon={<Computer3 />}
        width={"1040"}
        height={"820"}
        {...props}
      >
        <V86DynamicComponent vm={vm} v86={v86} setV86={setV86} />
      </Modal>
    </VMContext.Provider>
  );
};

export default VMModal;