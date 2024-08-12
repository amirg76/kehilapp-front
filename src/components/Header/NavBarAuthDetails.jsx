import NavBarButton from "./NavBarButton";

/**
 * Renders a navigation bar item with authentication details.
 *
 * @param {object} currentUser - The currently authenticated user.
 * @param {function} onClickAuthButton - The callback function for the authentication button click event.
 * @param {string} className - The CSS class name for the authentication button.
 * @param {node} children - The child elements of the authentication button.
 * @return {JSX.Element} The rendered navigation bar item with authentication details.
 */
const NavBarAuthDetails = (
  currentUser,
  onClickAuthButton,
  className,
  children
) => {
  return (
    <li>
      <div className="flex flex-shrink-0 items-center ">
        <div className="flex flex-shrink-0 items-center p-4 ">
          שלום {currentUser.name}!
        </div>
        {NavBarButton(onClickAuthButton, className, children)}
      </div>
    </li>
  );
};

export default NavBarAuthDetails;
