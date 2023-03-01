import { List, Modal } from '@react95/core'
import { Computer3, User4 } from '@react95/icons';
import React, { createContext, useEffect, useRef, useState, useContext, Fragment, useReducer, useCallback } from 'react';
import dynamic from 'next/dynamic';
import tw from 'tailwind-styled-components';
import { isMobile } from 'react-device-detect';
import { ModalContext, RenderedModalContext } from './ModalContext';

type VMModalProps = Omit<React.ComponentProps<typeof Modal>, 'closeModal' | 'icon' | 'width' | 'height'> & {
  vm: V86Props['vm'];
};

type V86Props = {
  vm: 'doom_linux' | 'buildroot_linux';
};

type V86Action = {
  type: 'CREATE_VM',
  v86_library: any,
  vm_type: keyof typeof cdrom_urls,
  screen_container: React.RefObject<HTMLDivElement>,
  progress_bar: React.MutableRefObject<HTMLSpanElement | null>,
  on_preboot_line: (element: JSX.Element) => void,
} | { 
  type: 'START_VM',
} | {
  type: 'STOP_VM', 
}| {
  type: 'DESTROY_VM'
} | {
  type: 'DOWNLOAD_PROGRESS',
  data: any,
} | {
  type: 'MOUSE_ENABLE',
  data: boolean,
} | {
  type: 'DOWNLOAD_ERROR',
  data: any
} | {
  type: 'EMULATOR_READY'
} | {
  type: 'REREGISTERED_HOOKS'
};

type V86State = {
  emulator: any;
  settings: any;
  v86_library: any;
  on_preboot_line: ((element: JSX.Element) => void) | null,
  running: boolean;
  needs_reinit: boolean;
  needs_reregister: boolean;
  uses_mouse: boolean;
  current_file: string;
  progress_bar: React.MutableRefObject<HTMLSpanElement | null> | null;
  ticks: number;
};

const createV86State = () => {
  return {
    emulator: null,
    settings: null,
    on_preboot_line: null,
    running: false,
    needs_reinit: false,
    needs_reregister: true,
    uses_mouse: false,
    current_file: "",
    progress_bar: null,
    ticks: 0,
  } as V86State;
}

type V86Context = {
  state: V86State;
  dispatch: React.Dispatch<V86Action>;
}

const V86Context = createContext<V86Context>(null!);

const cdrom_urls = {
  'doom_linux': '/vm/doom-linux.iso',
  'buildroot_linux': '/vm/buildroot-linux.iso'
};

export const v86StateReducer: React.Reducer<V86State, V86Action> = (
  state,
  action,
) => {
  const ctx = { ...state };
  switch (action.type) {
    case 'CREATE_VM': {
      if (ctx.emulator !== null) {
        if (ctx.emulator.is_running()) {
          ctx.emulator.stop();
          ctx.emulator.destroy();
          ctx.emulator = null;
        }
      } 

      ctx.v86_library = action.v86_library;
      const { V86Starter } = action.v86_library;
      const cdrom_url = cdrom_urls[action.vm_type];
      action.on_preboot_line(<span>{`Downloading resources...`}</span>);
      
      ctx.progress_bar = action.progress_bar;
      ctx.on_preboot_line = action.on_preboot_line;
      ctx.running = false;
      ctx.settings = {
        wasm_path: "/vm/v86.wasm",
        fastboot: true,
        memory_size: 256 * 1024 * 1024,
        vga_memory_size: 8 * 1024 * 1024,
        screen_container: action.screen_container.current,
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
      };
      ctx.emulator = new V86Starter(ctx.settings);

      return ctx;
    }

    case 'START_VM': {
      if (ctx.emulator === null) return ctx;
      if (ctx.emulator.is_running()) return ctx;
      if (ctx.needs_reinit) {
        const { V86Starter } = ctx.v86_library;
        ctx.emulator = new V86Starter(ctx.settings);
        ctx.needs_reinit = false;
        ctx.running = true;
        ctx.needs_reregister = true;
        return ctx;
      }

      ctx.running = true;
      ctx.emulator.run();
      return ctx;
    }

    case 'STOP_VM': {
      if (ctx.emulator === null) return ctx;
      if (!ctx.emulator.is_running()) return ctx;
      ctx.running = false;
      ctx.emulator.stop();
      ctx.needs_reinit = true;
      return ctx;
    }

    case 'DESTROY_VM': {
      if (ctx.emulator === null) return ctx;
      if (ctx.emulator.is_running()) {
        ctx.emulator.stop();
        ctx.emulator.destroy();
        ctx.running = false;
        ctx.emulator = null;
      }

      return ctx;
    }

    case 'MOUSE_ENABLE': {
      ctx.uses_mouse = action.data;
      return ctx;
    }

    case 'DOWNLOAD_PROGRESS': {
      if (action.data.file_name.endsWith(".wasm")) {
        if (ctx.current_file === action.data.file_name) return ctx;
        ctx.current_file = action.data.file_name;
        const parts = action.data.file_name.split("/");
        ctx.on_preboot_line!(<span>{"Fetching " + parts[parts.length - 1] + " ..."}</span>);
        return ctx;
      }

      var line = 'Fetching ' + action.data.file_name + " ";
      if (action.data.file_name !== ctx.current_file) {
          ctx.current_file = action.data.file_name;
          ctx.progress_bar!.current = null;
          ctx.ticks = 0;
      }
      
      if (action.data.total && typeof action.data.loaded === "number")
      {
          let per100 = Math.floor(action.data.loaded / action.data.total * 100);
          per100 = Math.min(100, Math.max(0, per100));

          const per50 = Math.floor(per100 / 2);

          line += per100 + "% [";
          line += "#".repeat(per50);
          line += " ".repeat(50 - per50) + "]";
      }
      else
      {
          line += ".".repeat(ctx.ticks % 50);
          ctx.ticks += 1;
      }

      if (ctx.progress_bar!.current === null) {
        const newBar = (<span ref={ctx.progress_bar}>{line}</span>);
        ctx.on_preboot_line!(newBar);
      } else {
        ctx.progress_bar!.current.innerHTML = line;
      }

      return ctx;
    }

    case 'DOWNLOAD_ERROR': {
      ctx.on_preboot_line!(<span>{`An error occured while loading ${action.data.file_name}`}</span>);
      ctx.on_preboot_line!(<span>{`Cannot continue booting...`}</span>);
      return ctx;
    }

    case 'EMULATOR_READY': {
      ctx.on_preboot_line!(<span>{`Ready!`}</span>);
      if (ctx.running) {
        ctx.emulator.run();
      }
      return ctx;
    }

    case 'REREGISTERED_HOOKS': {
      if (!ctx.needs_reregister) return ctx;
      ctx.needs_reregister = false;
      return ctx;
    }

    default:
      return state;
  }
};


const PrebootScreenComponent = tw.div`
  p-2
  whitespace-pre
  flex
  flex-col
  font-mono
  text-sm
  w-full
  h-full
  bg-black
  text-white
`;

const V86DynamicComponent = dynamic(async () => {
  // @ts-ignore
  const v86_library = await import('v86');

  const V86Component = ({ vm }: V86Props) => {
    const { state: v86State, dispatch } = useContext(V86Context);
    const screenContainer = useRef<HTMLDivElement>(null);
    const progressBar = useRef<HTMLSpanElement | null>(null);
    const [prebootLines, setPrebootLines] = useState<JSX.Element[]>([]);

    useEffect(() => {
      dispatch({
        type: 'CREATE_VM', v86_library, vm_type: vm, screen_container: screenContainer, progress_bar: progressBar, on_preboot_line: (element) => {
          setPrebootLines(lines => {
            lines.push(element);
            return lines;
          });
        }
      });

      return () => {
        dispatch({
          type: 'DESTROY_VM'
        });
      }
    }, [vm, dispatch]);

    useEffect(() => {
      if (v86State.emulator === null) return;
      if (!v86State.needs_reregister) return;

      v86State.emulator.add_listener("mouse-enable", (data: boolean) => {
        dispatch({ type: 'MOUSE_ENABLE', data })
      });

      v86State.emulator.add_listener("download-progress", (data: any) => {
        dispatch({ type: 'DOWNLOAD_PROGRESS', data });
      });

      v86State.emulator.add_listener("download-error", (data: any) => {
        dispatch({ type: 'DOWNLOAD_ERROR', data })
      });

      v86State.emulator.add_listener("emulator-ready", () => {
        dispatch({ type: 'EMULATOR_READY' });
      });
      
      v86State.emulator.add_listener("emulator-started", () => {
        setPrebootLines([]);
      });

      dispatch({ type: 'REREGISTERED_HOOKS' });
    }, [v86State.emulator, v86State.needs_reregister, dispatch]);

    return (
      <>
        {!v86State.emulator?.is_running() && <PrebootScreenComponent>
          {prebootLines.map((v, i) => <Fragment key={`preboot-${i}`}>{v}</Fragment>)}
        </PrebootScreenComponent> }
        <div ref={screenContainer} hidden={!v86State.running} onClick={() => {
          if (v86State.uses_mouse && v86State.emulator !== null) {
            v86State.emulator.lock_mouse();
          }
        }}
          className="w-full h-full bg-black">
          <div className="p-2 whitespace-pre flex font-mono text-sm" />
          <canvas className="hidden" />
        </div>
      </>
    );
  };

  return V86Component;
}, { ssr: false, loading: () => <span>{'Loading...'}</span> });


const VMModal = ({ vm, ...props }: VMModalProps) => {
  const [v86State, dispatch] = useReducer(v86StateReducer, createV86State());
  const modalCtx = useContext(ModalContext);
  const renderedCtx = useContext(RenderedModalContext);

  if (isMobile) {
    return (
      <Modal
        closeModal={() => modalCtx.dispatch({ type: 'CLOSE_MODAL', id: renderedCtx.id })}
        icon={<User4 variant='32x32_4' />}
        width={"200"}
        {...props}
      >
        <div className='flex flex-col'>
          <div className='flex items-center justify-center'>
            <User4 variant='32x32_4' />
            <span className='pl-2'>
              {`We've detected that you're on a mobile device.`}
            </span>
          </div>
          <span className='pt-2'>
            {`Unfortunately, due to limitations with JavaScript on mobile devices, this VM will not run properly. Try again on a regular browser.`}
          </span>
          <span>
            {`Sorry :( - hatf0`}
          </span>
        </div>
      </Modal>
    )
  }

  return (
    <V86Context.Provider value={{ state: v86State, dispatch }}>
      <Modal
        closeModal={() => modalCtx.dispatch({ type: 'CLOSE_MODAL', id: renderedCtx.id })}
        icon={<Computer3 />}
        width={"1040"}
        height={"840"}
        menu={[
          {
            name: 'VM',
            list: (
              <List>
                <List.Item onClick={() => {
                  dispatch({ type: 'START_VM' });
                }}>Start</List.Item>
                <List.Item onClick={() => {
                  dispatch({ type: 'STOP_VM' });
                }}>Stop</List.Item>
              </List>
            ),
          },
        ]}
        {...props}
      >
        <V86DynamicComponent vm={vm} />
      </Modal>
    </V86Context.Provider>
  );
};

export default VMModal;