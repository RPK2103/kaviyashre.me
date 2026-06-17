# Portfolio Architecture

## Goal

Build a production-grade personal portfolio that feels like a modern SaaS product rather than a traditional portfolio website.

## Tech Stack

Frontend:

- Next.js 15 App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion

Future Enhancements:

- Notion CMS
- AI Search
- Recruiter Summary Mode
- Semantic Search
- Portfolio Assistant

Deployment:

- Vercel

## Folder Structure

app/  
components/  
content/  
lib/  
types/  
public/

## Component Architecture

components/  
├── layout  
├── sections  
├── ui  
├── effects

### Layout

Navbar  
Footer  
ThemeProvider

### Sections

Hero  
CurrentFocus  
About  
Experience  
Skills  
Projects  
Contact

### UI

Button  
Card  
Badge  
Container  
SectionHeading

### Effects

Particles  
GradientBackground  
GlowEffects

## Design Principles

- Mobile first
- Accessibility first
- Semantic HTML
- Reusable components
- Server Components by default
- Client Components only when needed

## Performance Goals

- Lighthouse > 95
- Optimized images
- Lazy loading
- Minimal client-side JavaScript

## Future AI Features

- Recruiter Summary
- AI Project Search
- Semantic Search
- Portfolio Assistant

