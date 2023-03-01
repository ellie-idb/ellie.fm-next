import { TaskBar, List } from '@react95/core'
import {
  Computer3,
  FileFind,
  FolderExe2,
  FolderFile,
  HelpBook,
  LoaderBat,
  Settings,
} from '@react95/icons';
import { useContext } from 'react';
import { ModalContext } from './ModalContext';
import VMModal from './VMModal';

const MainTaskBar = () => {
  const modalCtx = useContext(ModalContext);

  return (
    <TaskBar list={
      <List>
        <List.Item icon={<FolderExe2 variant="32x32_4" />}>
          <List>
            <List.Item onClick={() => {
              modalCtx.dispatch({ type: 'ADD_MODAL', element: <VMModal vm={'doom_linux'} title={'Doom Linux'} /> })
            }} icon={<Computer3 variant="32x32_4" />}>
              Doom Linux
            </List.Item>
            <List.Item onClick={() => {
              modalCtx.dispatch({ type: 'ADD_MODAL', element: <VMModal vm={'buildroot_linux'} title={'Buildroot Linux'} /> })
            }} icon={<Computer3 variant="32x32_4" />}>
              Buildroot Linux
            </List.Item>
          </List>
          Programs
        </List.Item>
        <List.Item icon={<FolderFile variant="32x32_4" />}>Documents</List.Item>
        <List.Item icon={<Settings variant="32x32_4" />}>Settings</List.Item>
        <List.Item icon={<FileFind variant="32x32_4" />}>Find</List.Item>
        <List.Item icon={<HelpBook variant="32x32_4" />}>Help</List.Item>
        <List.Item icon={<LoaderBat variant="32x32_4" />}>Run...</List.Item>
        <List.Divider />
        <List.Item icon={<Computer3 variant="32x32_4" />}>
          Shut Down...
        </List.Item>
      </List>
    } />
  );
};

export default MainTaskBar;