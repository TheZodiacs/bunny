# AI Coding Guidelines for Bunny React Native App

## Project Overview
This is a React Native/Expo project built with Expo Router, Nativewind (Tailwind CSS), and React Native Reusables. It supports iOS, Android, and Web platforms with New Architecture and Edge-to-Edge enabled.

## Core Architecture Patterns

### Navigation & Routing
- Uses **Expo Router** with file-based routing in `app/` directory
- Root layout in `app/_layout.tsx` provides theme context and portal host
- Screen components use `<Stack.Screen options={...} />` for navigation configuration
- Web-specific HTML configuration in `app/+html.tsx`

### Styling System
- **Nativewind** for utility-first styling with Tailwind CSS
- CSS custom properties defined in `global.css` for light/dark themes
- Theme colors accessible via `hsl(var(--color-name))` in Tailwind config
- Platform-specific styles using `Platform.select({})`

### UI Components (`components/ui/`)
- Built with **Class Variance Authority (CVA)** for variant management
- Components use `cn()` utility for conditional class merging
- **Icon component** wraps Lucide icons with `cssInterop` for Nativewind support
- **Text component** uses context (`TextClassContext`) for automatic text styling inheritance
- Button variants include: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`

### Path Aliases
- `@/*` maps to project root (configured in `tsconfig.json`)
- Import examples: `@/components/ui/button`, `@/lib/theme`, `@/assets/images/logo.png`

## Development Workflow

### Running the App
```bash
pnpm dev        # Start Expo dev server (clears cache)
pnpm android    # Run on Android (clears cache)
pnpm ios        # Run on iOS (clears cache)
pnpm web        # Run on web (clears cache)
```

### Adding UI Components
```bash
npx react-native-reusables/cli@latest add [component-name]
# Example: npx react-native-reusables/cli@latest add input textarea
```

## Component Patterns

### Creating New UI Components
```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const componentVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'default-styles',
      variantName: 'variant-styles',
    },
    size: {
      default: 'size-styles',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type ComponentProps = React.ComponentProps<typeof BaseComponent> & 
  VariantProps<typeof componentVariants>;

function Component({ className, variant, size, ...props }: ComponentProps) {
  return (
    <BaseComponent 
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

### Using Icons
```tsx
import { Icon } from '@/components/ui/icon';
import { HeartIcon } from 'lucide-react-native';

<Icon as={HeartIcon} className="text-red-500" size={16} />
```

### Theme Integration
- Use `useColorScheme()` from `nativewind` for theme detection
- Theme colors defined in `lib/theme.ts` with NAV_THEME for React Navigation
- CSS variables automatically switch based on `.dark` class on `:root`

## Platform Considerations
- Web-specific code uses `Platform.select({ web: ... })`
- iOS-specific styling uses `ios:` prefix in class names
- Android Edge-to-Edge enabled in `app.json`
- New Architecture enabled for better performance

## File Structure Conventions
- `app/` - Expo Router screens and layouts
- `components/ui/` - Reusable UI components (shadcn/ui style)
- `lib/` - Utilities, theme, and shared logic
- `assets/` - Images and static assets
- Keep components in `components/ui/` for consistency with React Native Reusables

## Key Dependencies
- `@tanstack/react-query` - Data fetching (configured in _layout.tsx)
- `react-native-reanimated` - Animations
- `expo-router` - Navigation
- `nativewind` - Styling
- `lucide-react-native` - Icons</content>
<parameter name="filePath">/home/praveen/bunny/.github/copilot-instructions.md