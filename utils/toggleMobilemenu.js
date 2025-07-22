export const openMobileMenu = () =>
  document
    .querySelector(".menu-mobile-popup")
    .classList.add("modal-menu--open");
export const closeMobileMenu = () =>
  document
    .querySelector(".menu-mobile-popup")
    .classList.remove("modal-menu--open");
