# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (opens on http://localhost:3000)
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Project Architecture

This is a Next.js 15 portfolio application using the App Router architecture with TypeScript and Tailwind CSS.

### Key Structure:
- **App Router**: Uses Next.js 15 App Router with file-based routing in the `app/` directory
- **Layout System**: Root layout (`app/layout.tsx`) includes global Navbar and styling
- **Pages**: Portfolio sections as separate routes (`about-work`, `about-school`, `about-me`)
- **Components**: Reusable components in `app/components/` (currently just Navbar)
- **Styling**: Tailwind CSS with custom global styles in `app/globals.css`
- **Fonts**: Uses Geist font family (sans and mono variants)

### Navigation:
The application uses a persistent navigation bar with route-based active states managed by Next.js `usePathname()` hook.

### Tech Stack:
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- ESLint with Next.js config
- React Router DOM (though Next.js router is primary)

### Development Notes:
- TypeScript path aliases configured with `@/*` pointing to root
- Turbopack enabled for faster development builds
- All pages currently have placeholder content and need implementation

### Repository:
- Format the commit with `[Feature] - Changelog`

## Git Workflow (OpenClaw/Chico)

### SSH Setup (required each session)
```bash
eval "$(ssh-agent -s)" && SSH_ASKPASS=~/.ssh/askpass-portfolio.sh SSH_ASKPASS_REQUIRE=force ssh-add ~/.ssh/id_ed25519 < /dev/null
```

### Push Flow
1. Make changes
2. **Wait for explicit "commit and push" command from Jacob**
3. `git add -A && git commit -m "[Feature] - Description"`
4. Run SSH setup above (if not done this session)
5. `git push`

**Important**: Do NOT auto-commit/push. Wait for Jacob to say "commit and push" or similar.

### Deployment
- **Auto-deploy**: Vercel deploys on push to `main`
- **CI**: GitHub Actions runs lint, typecheck, build before deploy
- **Notifications**: Telegram notification on deploy status

### Working Directory
When using OpenClaw, work from: `/home/jacob/.openclaw/workspace/portfolio`