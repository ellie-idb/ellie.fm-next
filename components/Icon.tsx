import tw from 'tailwind-styled-components';

const Wrapper = tw.button`
  group
`;

const Box = tw.div`
  flex
  flex-col
  justify-center
  text-center
  items-center
  p-2
  w-[80px]
  break-all
  pointer-events-none
`;

const Text = tw.span`
  mt-1
  text-white
  p-[1px]
  border-[1px]
  border-white/0
  group-focus:border-gray-400
  group-focus:border-dashed
`;

export default Object.assign({}, { Wrapper, Box, Text });