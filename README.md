# Bunny App

Bunny is a privacy-first, local binge tracker for all forms of content like anime, manga, novels, movies, and shows.

## Features

- **Quick Track**: Easily track your progress on your favorite content.
- **Discover**: Find new content to enjoy.
- **Timeline**: See your binge-watching history in a timeline view.
- **Cloud Backup**: Backup your data to the cloud.
- **Privacy First**: Your data is stored locally on your device.

## Getting Started

To run the development server:

```bash
pnpm dev
```

This will start the Expo Dev Server. You can then open the app in:

- **iOS**: press `i` to launch in the iOS simulator _(Mac only)_
- **Android**: press `a` to launch in the Android emulator
- **Web**: press `w` to run in a browser

You can also scan the QR code using the [Expo Go](https://expo.dev/go) app on your device.

## Project Structure

- `app/`: Contains the application screens and navigation logic, powered by [Expo Router](https://expo.dev/router).
- `components/`: Shared UI components.
- `assets/`: Static assets like images and fonts.
- `lib/`: Utility functions and libraries.
- `package.json`: Project dependencies and scripts.

## Tech Stack

- **React Native & Expo**: Cross-platform development for iOS, Android, and Web.
- **Expo Router**: File-based routing for React Native.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development via [Nativewind](https://www.nativewind.dev/).
- **TypeScript**: Statically typed JavaScript for better code quality.
- **Drizzle ORM**: TypeScript ORM for your database.

## Scripts

- `pnpm dev`: Starts the Expo development server.
- `pnpm android`: Starts the app on a connected Android device or emulator.
- `pnpm ios`: Starts the app on the iOS simulator.
- `pnpm web`: Starts the app in a web browser.
- `pnpm clean`: Removes `node_modules` and the `.expo` directory.
- `pnpm db:generate`: Generates Drizzle ORM files.
