import tw from 'tailwind-styled-components';

const Box = tw.div`
  flex
  flex-col
  justify-center
  text-center
  items-center
  p-2
  w-[75px]
  break-all
`;

const Text = tw.span`
  mt-1
  text-white
`;

export default Object.assign({}, { Box, Text });