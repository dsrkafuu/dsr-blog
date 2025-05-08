const IBars = (props: any) => {
  return (
    <svg
      className='icon'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 448 512'
      width='1.1em'
      height='1.1em'
      {...props}
    >
      <path
        d='M16 288h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16z'
        style={{ opacity: 0.4 }}
      />
      <path d='M432 384H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H16A16 16 0 0 0 0 80v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16z' />
    </svg>
  );
};

export default IBars;
