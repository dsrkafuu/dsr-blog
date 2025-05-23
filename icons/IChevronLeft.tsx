const IChevronLeft = (props: any) => {
  return (
    <svg
      className='icon'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 320 512'
      width='1.1em'
      height='1.1em'
      {...props}
    >
      <path
        d='M285.59 410.4a23.93 23.93 0 0 1 0 33.84l-22.7 22.65a24 24 0 0 1-33.94 0l-154.31-154L131.42 256z'
        style={{ opacity: 0.4 }}
      />
      <path d='M262.85 45.06l22.7 22.65a23.93 23.93 0 0 1 0 33.84L74.58 312.9l-40-40a23.94 23.94 0 0 1 0-33.84l194.33-194a24 24 0 0 1 33.94 0z' />
    </svg>
  );
};

export default IChevronLeft;
