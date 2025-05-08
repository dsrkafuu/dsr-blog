const IChevronRight = (props: any) => {
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
        d='M188.74 256l56.78 56.89L91.21 466.9a24 24 0 0 1-33.94 0l-22.7-22.65a23.93 23.93 0 0 1 0-33.84z'
        style={{ opacity: 0.4 }}
      />
      <path d='M91.25 45.06l194.33 194a23.93 23.93 0 0 1 0 33.84l-40 40-211-211.34a23.92 23.92 0 0 1 0-33.84l22.7-22.65a24 24 0 0 1 33.97-.01z' />
    </svg>
  );
};

export default IChevronRight;
