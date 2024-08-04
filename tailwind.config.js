/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customColor: 'rgba(89, 140, 152, 0.72)',
        customGreen: 'rgba(140, 179, 124, 0.72)',
        customPurple: '#8F61A3',
        customBig: '#F1E9E7',
        cuLoading: '#F1EDEA',
        culogin: '#B3E0E3',
        cusign: '#ADEDED',
        sign4: '#F07B81',
        card1: '#CEB3E3',
        card2: '#E3B6B3',
        card3:'#C8E3B3'
      },

    },
    
  },
  plugins: [],
}
