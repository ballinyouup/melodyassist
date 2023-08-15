# Overview

Melody Assist is a web application that allows users to generate audio drum loops using AI. The application includes features such as authentication, a global feed, audio file uploads, audio generation using an AI cloud model service, audio playback, and user account management.

## Tech Stack

- Next.js: A React framework for building server-rendered and statically exported applications.
- Typescript: A statically typed superset of JavaScript.
- React: A JavaScript library for building user interfaces.
- TailwindCSS: A utility-first CSS framework.
- Prisma: An open-source database toolkit for Typescript and Node.js.
- NextAuth: An authentication library for Next.js applications.
- tRPC: A framework for building type safe APIs with TypeScript.
- Zod: A TypeScript-first schema validation library.
- upload.io: A file upload service.
- replicate: An AI cloud model service for generating audio drum loops.

## Features:

### Authentication

![Melody Assist Login Page](https://www.bryanhuici.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fem0qyevz%2Fproduction%2F2af9c7e984b96d38eb1da0d784d10b4386375a07-1878x928.png%3Frect%3D11%2C0%2C1856%2C928%26w%3D1024%26h%3D512%26min-h%3D512%26min-w%3D1024%26fit%3Dmin%26auto%3Dformat&w=1080&q=75)
- NextAuth is used for authentication.
- Users can sign in using a magic link sent via email (SMTP).
- OAuth authentication is supported for Discord and Google.
- Session id's are stored in the database and checked on every request.

### Global Feed
![Melody Assist Global File Feed](https://www.bryanhuici.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fem0qyevz%2Fproduction%2F9729455b1aad781bf92ad9915caec405cfc39a28-1877x930.png%3Frect%3D9%2C0%2C1860%2C930%26w%3D1024%26h%3D512%26min-h%3D512%26min-w%3D1024%26fit%3Dmin%26auto%3Dformat&w=1080&q=75)
- The browse page displays a global feed.
- Users can view audio generations of all users in chronological order (newest to oldest).

### Generate Page
![Melody Assist Generate Page](https://www.bryanhuici.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fem0qyevz%2Fproduction%2F70c23cf1c3b0754381e116bbe910175773ee4f3d-1879x929.png%3Frect%3D11%2C0%2C1858%2C929%26w%3D1024%26h%3D512%26min-h%3D512%26min-w%3D1024%26fit%3Dmin%26auto%3Dformat&w=1080&q=75)
- Users can upload audio files on their profile page.
- Recursive uploading is implemented to handle the disappearance of the upload.io upload file component on upload completion.
- Once an audio file is uploaded, the application makes fetch calls to the replicate API every 2 seconds to generate audio using AI.
- The generated audio is saved in the user's account in the database using Prisma.
- The profile page revalidates and displays the audio file in the user's audio section.
- Users can play and delete their audio files.

### Settings Page
![Melody Assist Settings Page](https://www.bryanhuici.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fem0qyevz%2Fproduction%2Fe6c3b6a7b9f200cedfa4c0a6d5ee1fab345f29f7-1877x929.png%3Frect%3D10%2C0%2C1858%2C929%26w%3D1024%26h%3D512%26min-h%3D512%26min-w%3D1024%26fit%3Dmin%26auto%3Dformat&w=1080&q=75)
- Users can access the settings page to manage their account.
- Users can change their username, and the system checks for username availability.
- If the chosen username is taken, an error is displayed; otherwise, the username is updated.
- Users can delete their account, which automatically signs them out.
