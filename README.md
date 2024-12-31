<div align="center">
<p align="center">
  <a href="https://nativewind.dev" target="_blank">
    <img src="https://nativewind.dev/img/logo.svg" alt="Tailwind CSS" width="70" height="70">
    <h1 align="center" style="color:red;">NativeWind</h1>
  </a>
</p>

[![npm version](https://img.shields.io/npm/v/nativewind)](https://www.npmjs.com/package/nativewind)
[![npm downloads](https://img.shields.io/npm/dw/nativewind)](https://www.npmjs.com/package/nativewind)
[![Github](https://img.shields.io/github/license/marklawlor/nativewind)](https://github.com/nativewind/nativewind)
[![Discord](https://img.shields.io/discord/968718419904057416?logo=discord&logoColor=ffffff&label=Discord&color=%235865F2)](https://discord.gg/ypNakAFQ65)
[![Twitter](https://img.shields.io/twitter/follow/nativewindcss?link=https%3A%2F%2Fx.com%2Ftailwindcss)](https://x.com/nativewindcss)

</div>
<br />

# About

Do you like using [Tailwind CSS](https://tailwindcss.com) to style your apps? This helps you do that in [React Native](https://reactnative.dev). NativeWind is **not** a component library, it's a styling library. If you're looking for component libraries that support NativeWind, [see below](https://github.com/nativewind/nativewind/tree/%40danstepanov/docs-v4.1?tab=readme-ov-file#what-if-im-looking-for-a-component-library-that-uses-nativewind).

NativeWind makes sure you're using the best style engine for any given platform (e.g. CSS StyleSheet or StyleSheet.create). It's goals are to to provide a consistent styling experience across all platforms, improving developer UX, component performance, and code maintainability.

NativeWind processes your styles during your application's build step and uses a minimal runtime to selectively apply reactive styles (eg changes to device orientation, light dark mode).

## Installation

If you have an existing project, [use these guides](https://www.nativewind.dev/getting-started/react-native) to configure NativeWind for your respective stack.

Alternatively, you can create a new pre-configured project via our Quickstart options, below.

## Quickstart

You can get started with any of the following options:

- [Create Expo Stack](https://rn.new): `npx create-expo-stack@latest --nativewind`
- ~~[Create Expo App](https://expo.new): `npx create-expo-app -e with-nativewind`~~ (being fixed to work with v4)

## Features

- Works on **all** RN platforms, uses the best style system for each platform.
- Uses the Tailwind CSS compiler
- Styles are computed at **build time**
- Small runtime keeps your components fast
- **jsxImportSourceTransform** only wraps native components, making it lighter and such that the **className** prop is accessible inside your component
- Respects all tailwind.config.js settings, including **themes, custom values,** and **plugins**
- Support for
  - custom CSS properties, aka **CSS Variables**
  - **dark mode, arbitrary classes,** and **media queries**
  - **animations** and **transitions**
  - **container queries**
    - `container-type` and style-based container queries are not supported
  - pseudo classes - **hover / focus / active** on compatible components
  - `rem` units
  - theme functions and nested functions
  - React 18 Suspense API
  - Custom CSS
- Styling based on **parent state modifiers** - automatically style children based upon parent pseudo classes
  - support for the `group` and `group/<name>` syntax
- **Children styles** - create simple layouts based upon parent class
- Fast and consistent style application via hot reload
  - includes changes made to `tailwind.config.js`

[More details here](https://www.nativewind.dev/blog/announcement-nativewind-v4#breaking-changes-from-v2)

## npm distribution tags
It's worth noting that we do not have Github branches that directly correlate to npm distribution tags. Instead, we deploy to specific npm tags either via automated Github actions (push to `main` -> publish to `next`) or manually (snapshots versions).
- **Release:** `latest` (currently v2.0.11)
  - You should use this version
- **Canary:** `canary` (currently v4.0.36)
  - You can use this version
  - Potentially less stable than latest but likely more robust
- **Experimental:** `next` tag (currently v4.1)
  - You probably shouldn't use this version
  - Undergoing testing to move to a release version
- **Bleeding Edge:** snapshot releases prefixed with `0.0.0-`
  - You should not use this version
  - Used internally for moving towards a `next` version

## Contribution

[See this guide](https://github.com/nativewind/nativewind/blob/main/contributing.md)

# FAQ

## Is it safe to use v4?
It's reasonably safe to use the `canary` version save for a known issue with styles being inconsistently applied. This issue is resolved in the `next` version; however, using this dist tag may break your app as it is considered experimental. To see which versions correlate to these dist tags, please refer to [our npm distribution tags](https://github.com/nativewind/nativewind?tab=readme-ov-file#npm-distribution-tags).

## Is NativeWind moving to Expo?

No. Expo is always exploring ways to handle styles better but NativeWind, as a project, will not be moving into the Expo organization.

## Can we disable the change that was done recently to auto-add nativewind types using a setting or something? I already have the settings using `compilerOptions.types`, so I would like to disable the file generation.

Not at the moment. We've found this will cause a long term problem where people "forget" what their type config was doing. They then update their types and break the NativeWind ones. To combat this, we've copied the behavior from other major frameworks which is to handle their types separately from user specified ones.

In the future, we may add an option like `dangerouslyDisableTypeScriptGeneration` or something verbose to prevent people from using it. We are tired of solving TypeScript issues, particularly ones such as "my types were working and now they aren't."

## What happened to v3?

Similar to Valve, we don't like the number 3. Nah, we had a V3 but it was a bad idea and needed to be reworked so we dropped it and moved on to v4.

## What if I'm looking for a component library that uses NativeWind?

There are a number of different component libraries available that use NativeWind to achieve different results. You should pick the one that best suits your needs.

### [NativeWindUI](https://nativewindui.com)

This multi-platform library focuses on achieving native feel for each individual platform using the familiar interface of Tailwind CSS.

### [React Native Reusables](https://rnr-docs.vercel.app)

This open source library offers universal [shadcn/ui](https://ui.shadcn.com) via React Native. Use this as a foundation to develop your own high-quality component library.

### [GluestackUI v2](https://gluestack.io)

From the folks that brought you NativeBase, this library offers customizable cross-platform components designed to look & behave cleanly on every platform.

## What are the breaking changes from v2 to v4?

All breaking changes are [outlined here](https://www.nativewind.dev/blog/announcement-nativewind-v4#breaking-changes-from-v2).

## Documentation

Learn more on [our website](https://nativewind.dev).
