export function HoneypotInput() {
  return (
    <input
      className='niceInput'
      name='dateUpdatedAt'
      type='text'
      autoComplete='new-password'
      tabIndex={-1}
      aria-hidden='true'
      defaultValue=''
    />
  );
}
