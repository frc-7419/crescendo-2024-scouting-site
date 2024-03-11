# Self-Hosting Guide for 7419 Scouting App

Thank you for your interest in self-hosting the 7419 Scouting App! This guide will walk you through the steps required
to set up and run the application on your own infrastructure.

## Prerequisites

Before you begin, ensure you have the following:

- Node.js installed on your system.
- Git installed on your system.
- Access to a PostgreSQL database or a Supabase database.
- A Blue Alliance API key for accessing data from the Blue Alliance.
- A Vercel account for deployment or your favorite host.

## Installation Steps

1. **Clone the Repository**: Clone the repository to your local machine using Git.

    ```bash
    git clone https://github.com/frc-7419/crescendo-2024-scouting-site
    ```

2. **Navigate to the Project Directory**: Change into the project directory.

    ```bash
    cd crescendo-2024-scouting-site
    ```

3. **Install Dependencies**: Install the project dependencies using npm.

    ```bash
    npm install
    ```

4. **Hardcode Events**: For now, you will need to hardcode the events you are going to in
   the `components/util/getCurrentEvent.tsx` We are planning to use blue alliance to get your team events but for now
   you will need to hardcode them.

    ```tsx
   export const getCurrentEvent = () => {
        const currentDate = new Date();
        const feb24 = new Date('2024-02-24');
        const mar11 = new Date('2024-03-11');
        const mar30 = new Date('2024-03-30');

        if (currentDate > feb24) {
            return '2024casj';
        } else if (currentDate > mar11) {
            return '2024azgl';
        } else if (currentDate > mar30) {
            return '2024cabe';
        } else {
            return '2024cabe';
        }
   };
   ```
5. **Initialize the Database**: Run the following command to initialize the database and create the required tables.

    ```bash
    npx prisma db push
    ```

6. **User Registration**: As of now, we do not have a registration page, so you will need to manually add users to the
   database. You can do this by adding a user to the `users` table in the database. You will need to add the user's
   email and password. The password should be hashed using bcrypt.

7. **Upload to host**: You can upload the project to your favorite host. We use Vercel for our production.

## Updating the App

To update the application, pull the latest changes from the repository and follow any additional instructions provided
in the repository's README.md file.

## Support and Assistance

If you encounter any issues or need assistance with self-hosting the application, feel free to reach out
on [GitHub Discussions](https://github.com/frc-7419/crescendo-2024-scouting-site/discussions).

We appreciate your interest in self-hosting the 7419 Scouting App and look forward to your exprience with the app!

— The 7419 Programming Team
