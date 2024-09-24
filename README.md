# ISS Appointment Setter
The ISS Appointment Setter is an innovative AI-powered system designed to automate and streamline the process of scheduling appointments. It leverages advanced language models and speech recognition technology to conduct real-time phone conversations with clients, handling appointment bookings efficiently and naturally.

For more Docs and Product Information, please go to intelligentstaffingsystems.com

Key features of the ISS Appointment Setter include:

1. AI-driven conversational interface
2. Real-time speech-to-speech capabilities
3. Integration with existing calendar systems
4. Automatic handling of complex scheduling scenarios
5. Continuous learning and improvement through feedback

This system aims to reduce the workload on human staff, improve appointment scheduling efficiency, and enhance the overall customer experience by providing a seamless booking service.


## Project Setup
After cloning this repo, copy the example.env to .env and enter the values from your own Google Developer Accounts. Microsoft to be added soon. 
docker may want a frontend/.env.local file.  this is something that needs to be fixed. 


## Tree Structure of the Application

/iss-appointment-setter
│
├── /src
│   ├── /app                      # Next.js App Router directory
│   │   ├── /api                  # API routes (NextAuth, etc.)
│   │   │   └── /auth
│   │   │       └── [...nextauth]/route.ts  # NextAuth API config (Google & Outlook)
│   │   ├── /dashboard            # Dashboard-specific routes
│   │   │   ├── page.tsx          # Main Dashboard page (routes to /dashboard)
│   │   │   └── settings/page.tsx # Dashboard settings page (routes to /dashboard/settings)
│   │   ├── /signin               # Sign-in route
│   │   │   └── page.tsx          # Sign-in page with Google and Outlook
│   │   ├── /signup               # Sign-up route (if applicable)
│   │   │   └── page.tsx          # Sign-up page for new users
│   │   ├── page.tsx              # Landing page (routes to /)
│   │   └── layout.tsx            # Global layout for the app (used across all pages)
│
├── /components                   # Reusable UI components
│   ├── /layout                   # Global Layout components
│   │   ├── Layout.tsx            # Main layout wrapper with Navbar/Footer
│   │   ├── Navbar.tsx            # Navbar component
│   │   └── Footer.tsx            # Footer component
│   ├── /auth                     # Authentication components (Google, Outlook)
│   │   ├── SignInButton.tsx      # Reusable Sign-in button (Google/Outlook)
│   │   ├── GoogleSignIn.tsx      # Google sign-in button
│   │   └── OutlookSignIn.tsx     # Outlook sign-in button
│   ├── Button.tsx                # Reusable Button component
│   └── Spinner.tsx               # Loading spinner component
│
├── /public                       # Static files accessible publicly
│   ├── /images                   # Images and media assets
│   │   └── logo.png              # Application logo
│   └── favicon.ico               # Favicon for the app
│
├── /styles                       # Global CSS and theme files
│   ├── globals.css               # Global CSS file
│   ├── theme.css                 # CSS file for theme definitions
│   └── /components               # Component-specific CSS modules (if needed)
│       ├── SignInButton.module.css  # Styles for sign-in buttons
│       └── Button.module.css      # CSS module for the Button component
│
├── /utils                        # Utility functions and helpers
│   ├── api.ts                    # Helper functions for API requests
│   └── auth.ts                   # Helper functions for authentication logic (Google/Outlook)
