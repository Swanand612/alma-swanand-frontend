# Alma Immigration Portal

A modern web application built with Next.js that helps potential immigrants connect with experienced immigration attorneys. The platform streamlines the visa consultation process by collecting relevant information and managing leads efficiently.

## Features

- User-friendly lead capture form
- Support for multiple visa types (O-1, H1B, EB-1, etc.)
- Admin dashboard for lead management
- Real-time status updates
- File upload capabilities
- Form validation and error handling

## Getting Started

### Clone the repository:

```bash
git clone https://github.com/Swanand612/alma-swanand-frontend.git
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Key Routes

To be able to see the leads as an admin navigate to ```/admin/leads```

- Home page with lead capture form
- ```/admin/leads```: Admin dashboard for lead management
- ```/api/submit-lead```: API endpoint for form submission
- ```/api/update-lead-status```: API endpoint for status updates
- ```/login``` : Will take the user to the login page. This will redirect to ```/admin/leads``` on successful login

## Development Tools

- Next.js 13+
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Hook Form
- JSON Server (mock backend)
