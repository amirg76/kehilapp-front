This code defines a functional component called Header that represents the application header.

It includes a navigation bar with a logo, contact and button links, and a sidebar that can be toggled open or closed.

The component uses useSelector and useDispatch hooks from Redux to manage state and actions.

It also has a function onCloseNavbar that closes the navbar after a short delay using setTimeout.

The JSX returned includes a header element with conditional styling based on the isModalOpen state and a NavBar component.
