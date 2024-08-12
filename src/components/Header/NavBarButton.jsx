const NavBarButton = (onClickAuthButton, className, children) => {
  return (
    <button onClick={onClickAuthButton} className={className}>
      {children}
    </button>
  );
};
export default NavBarButton;
