import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#693be3',
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#b19cff',
					foreground: '#1e1e1e'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: '#b19cff',
					foreground: '#1e1e1e'
				},
				popover: {
					DEFAULT: '#ffffff',
					foreground: '#1e1e1e'
				},
				card: {
					DEFAULT: '#ffffff',
					foreground: '#1e1e1e'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				'text-primary': '#1e1e1e',
				'text-secondary': '#606060',
				'text-link': '#9760f1',
				'purple-gradient-start': '#9760f1',
				'purple-gradient-end': '#693be3'
			},
			fontFamily: {
				'outfit': ['Outfit', 'sans-serif'],
				'baloo': ['Baloo 2', 'cursive'],
				'glegoo': ['Glegoo', 'serif'],
				'andika': ['Andika', 'sans-serif'],
				'sans': ['Outfit', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #9760f1, #693be3)',
				'gradient-secondary': 'linear-gradient(135deg, #b19cff, #9760f1)',
				'gradient-accent': 'linear-gradient(135deg, #693be3, #9760f1)',
				'premium-gradient': 'linear-gradient(135deg, #9760f1, #693be3)',
				'card-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
			},
			boxShadow: {
				'premium': '0 20px 25px -5px rgba(151, 96, 241, 0.3), 0 10px 10px -5px rgba(105, 59, 227, 0.2)',
				'glow': '0 0 20px rgba(177, 156, 255, 0.4)',
				'inner-glow': 'inset 0 2px 4px 0 rgba(177, 156, 255, 0.1)',
				'card': '0 4px 16px rgba(151, 96, 241, 0.1)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'glow-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(177, 156, 255, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 30px rgba(177, 156, 255, 0.5)'
					}
				},
				'thinking-dots': {
					'0%, 20%': {
						opacity: '0.3'
					},
					'50%': {
						opacity: '1'
					},
					'80%, 100%': {
						opacity: '0.3'
					}
				},
				'spin-slow': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'thinking-dots': 'thinking-dots 1.4s ease-in-out infinite',
				'spin-slow': 'spin-slow 2s linear infinite'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
