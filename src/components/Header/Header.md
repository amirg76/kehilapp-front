This is a React functional component named Header that represents the application's header. It consists of a navigation bar with a logo, contact and button links, and a sidebar that can be toggled open or closed.

The component uses Redux to manage its state, specifically the isModalOpen property, which determines whether the sidebar is open or closed. The component also defines two functions, onOpenNavbar and onCloseNavbar, which dispatch actions to open or close the sidebar, respectively.

The component renders a header element with a nav element inside, which contains the logo, contact and button links, and the sidebar. The sidebar is conditionally rendered based on the isModalOpen property, and its classes are dynamically generated based on this property.

The component also includes a hamburger icon (represented by the FontAwesomeIcon component) that is only visible on medium-sized screens and below, which toggles the sidebar open when clicked.
