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
      fontSize: {
        "2xs":['10px'],
      },
      colors :{
        'primary-lgt': "#FEFAE0",
        'secondary-lgt': "#B99470",
        'lgt':"#776B5D",
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
      boxShadow: {  
        "inner-lg":"inset gray 0px 0px 20px -12px"
        
      },
    },
    keyframes:{
      "fade-in":{
        '0%' :{
          opacity : "0",
        },
        '100%' : {
          opacity : "1",
        }
      },
      "slide-left":{
        '0%' :{
          transform : "translateX(24rem)",
        },
        '100%' : {
          transform : "translateX(-w-96)",
        }
      },
      "slide-up":{
        '0%' :{
          transform : "translateY(-24rem)",
        },
        '100%' : {
          transform : "translateX(h-auto)",
        }
      }
    },
    animation:{
        "fade-in" : "fade-in 2s ease-in-out",
        "slide-left":"slide-left 0.3s ease-in alternate forwards",
        "slide-up":"slide-up 0.3s ease-in alternate forwards",
    }
  },
  plugins: [],
}

