/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.{ejs,js}',
  ],
  theme :{
    extend :{
      fontFamily: {
        title: ['Montserrat', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
        numbers: ['Oswald', 'sans-serif'],
        interactive: ['Poppins', 'sans-serif'],
      },
      colors :{
        'primary-lgt': "#FFF2D8",
        'secondary-lgt': "#EAD7BB",
        'primary-drk': "#041C32",
        'secondary-drk': "#04293A",
        'icons-lgt':"#3F5781",
        'icons-drk':"#FF7A00",
      },
      backgroundImage: {

      },
      screens: {
        "wide": "1440px"
      },  
    },
  },
  plugins: [],
}

