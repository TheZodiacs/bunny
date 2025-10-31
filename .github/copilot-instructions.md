# AI Coding Guidelines for Bunny React Native App

## Project Overview
This is a React Native/Expo project built with Expo Router, Nativewind (Tailwind CSS), and React Native Reusables. It supports iOS, Android, and Web platforms with New Architecture and Edge-to-Edge enabled. The app is a **show tracker** for managing TV shows, anime, movies, etc. with categories, statuses, and user ratings.

## Core Architecture Patterns

### Navigation & Routing
- Uses **Expo Router** with file-based routing in `app/` directory
- **Tab-based navigation** with `(tabs)` directory structure
- Root layout in `app/_layout.tsx` provides SafeAreaProvider, theme context, and portal host
- Tab layout in `app/(tabs)/_layout.tsx` handles bottom tab navigation
- Screen components use `<Stack.Screen options={...} />` for navigation configuration
- Web-specific HTML configuration in `app/+html.tsx`

### Safe Area Handling
- **SafeAreaProvider** wraps the entire app in root layout
- **SafeAreaView** used in tab layout (`edges={['top']}`) and individual screens (`edges={['bottom']}`)
- Prevents content from overflowing into status bar and navigation areas
- Essential for edge-to-edge enabled apps

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
- **Input/Textarea** components for form inputs
- **Select** component from react-native-reusables for dropdowns

### Database & Data Layer
- **Drizzle ORM** with **Expo SQLite** for local database storage
- Schema defined in `db/schema.ts` with tables for categories, entries, and entry parts
- Database configuration in `config/drizzle.config.ts`
- Migrations generated with `drizzle-kit` and stored in `drizzle/` directory
- **Database seeding** in `lib/seed.ts` with sample data
- Use `expo-sqlite` for cross-platform SQLite database access

### Form Handling
- **react-hook-form** for form state management and validation
- **Controller** component for integrating with custom UI components
- Form validation with required field checks
- Mutation handling with `@tanstack/react-query`

### Path Aliases
- `@/*` maps to project root (configured in `tsconfig.json`)
- Import examples: `@/components/ui/button`, `@/lib/theme`, `@/assets/images/logo.png`

## App-Specific Components

### Show Tracker Components
- **CollapsibleSection**: Expandable sections for show statuses (current, planned, completed, dropped, hold)
- **EntryCard**: Display component for show entries with title, category, rating, and cover image

### Screen Structure
- **Home Screen** (`app/(tabs)/index.tsx`): Filters + collapsible status sections with entry cards
- **Create Screen** (`app/(tabs)/create.tsx`): Form for adding new show entries

## Development Workflow

### Running the App
```bash
pnpm dev        # Start Expo dev server (clears cache)
pnpm android    # Run on Android (clears cache)
pnpm ios        # Run on iOS (clears cache)
pnpm web        # Run on web (clears cache)
```

### Database Management
```bash
pnpm db:generate # Generate database migrations with Drizzle Kit
```

### Adding UI Components
```bash
pnpm dlx @react-native-reusables/cli@latest [component-name]
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

### Using Forms with react-hook-form
```tsx
import { useForm, Controller } from 'react-hook-form';

const { control, handleSubmit } = useForm<FormData>({
  defaultValues: { /* initial values */ },
});

<Controller
  control={control}
  name="fieldName"
  render={({ field: { onChange, value } }) => (
    <Input
      value={value}
      onChangeText={onChange}
      placeholder="Enter value"
    />
  )}
/>
```

### Database Queries with Drizzle
```tsx
import { useQuery } from '@tanstack/react-query';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';

const db = useSQLiteContext();
const drizzleDb = drizzle(db);

const { data } = useQuery({
  queryKey: ['entries'],
  queryFn: async () => {
    return await drizzleDb.select().from(entries);
  },
});
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
- **Safe area handling** is critical for edge-to-edge apps

## File Structure Conventions
- `app/` - Expo Router screens and layouts
- `app/(tabs)/` - Tab-based navigation screens
- `components/ui/` - Reusable UI components (shadcn/ui style)
- `components/` - App-specific components (CollapsibleSection, EntryCard)
- `lib/` - Utilities, theme, and shared logic
- `db/` - Database schema and configuration
- `assets/` - Images and static assets
- Keep components in `components/ui/` for consistency with React Native Reusables

## Key Dependencies
- `@tanstack/react-query` - Data fetching and mutations (configured in _layout.tsx)
- `drizzle-orm` - Type-safe SQL query builder and ORM
- `expo-sqlite` - SQLite database for Expo apps
- `drizzle-kit` - Database migration and schema management tool
- `react-native-reanimated` - Animations
- `expo-router` - Navigation
- `nativewind` - Styling
- `lucide-react-native` - Icons
- `react-hook-form` - Form handling
- `react-native-safe-area-context` - Safe area management for edge-to-edge apps</content>
<parameter name="filePath">/home/praveen/bunny/.github/copilot-instructions.md