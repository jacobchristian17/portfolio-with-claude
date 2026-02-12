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

## Ticket Workflow (OpenClaw/Chico)

### Acceptance Criteria (REQUIRED)
Before starting ANY ticket (frontend or backend):
1. Review the ticket/task requirements
2. **Confirm acceptance criteria with Jacob** — get explicit approval before writing code
3. Only proceed after Jacob confirms the criteria

### UI Testing (Frontend Changes)
For any UI work (components, animations, DOM manipulations):
1. Start dev server: `npm run dev -- -H 0.0.0.0`
2. Open in browser tool and take **before screenshot** (if modifying existing UI)
3. Make changes
4. Take **after screenshot** to verify:
   - Layout renders correctly
   - Elements are positioned as expected
   - Responsive states (if applicable)
5. For animations/interactions:
   - Use browser tool to click/hover/interact
   - Capture multiple screenshots at different states
   - Review CSS/JS for correct timing, easing, transforms
6. For DOM manipulations:
   - Take DOM snapshot before/after
   - Verify element structure matches expectations

**Limitation**: Can't watch animations in real-time — rely on code review + Jacob's eyes for final QA on timing/easing.

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

### Dev Access
- Dev server runs on `localhost:3000`
- External access via host machine `:5000` with SSL (no tunneling needed)