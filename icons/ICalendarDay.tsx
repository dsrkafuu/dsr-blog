const ICalendarDay = (props: any) => {
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
        d='M0 192V464C0 490.5 21.5 512 48 512H400C426.5 512 448 490.5 448 464V192H0ZM192 368C192 376.75 184.75 384 176 384H80C71.25 384 64 376.75 64 368V272C64 263.25 71.25 256 80 256H176C184.75 256 192 263.25 192 272V368Z'
        style={{ opacity: 0.4 }}
      />
      <path d='M400 64H352V32C352 14.327 337.673 0 320 0H320C302.327 0 288 14.327 288 32V64H160V32C160 14.327 145.673 0 128 0H128C110.327 0 96 14.327 96 32V64H48C21.49 64 0 85.49 0 112V192H448V112C448 85.49 426.51 64 400 64Z' />
    </svg>
  );
};

export default ICalendarDay;
