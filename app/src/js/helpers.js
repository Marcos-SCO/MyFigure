// Selects the element and activate the scroll behavior with scrollIntoView
export const scrollTo = (element) => document.querySelector(element).scrollIntoView({behavior: "smooth"});